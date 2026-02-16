import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
  Phone,
  MessageCircle,
  PackageSearch,
  Grid3X3,
} from 'lucide-react';
import { catalogMenu } from '../data/catalogMenu';
import type { CatalogGroup, CatalogLeafSection } from '../data/catalogMenu';
import { realProducts } from '../data/products/realProducts';
import type { Product } from '../data/products/sampleProducts';

/* ────────────────────────────────────────────────────────────────
 * Tipi locali per ordinamento e filtri
 * ──────────────────────────────────────────────────────────────── */
type SortOption = 'prezzo-asc' | 'prezzo-desc' | 'nome' | 'popolarita';

interface FiltriAttivi {
  prezzoMin: string;
  prezzoMax: string;
  marca: string;
  disponibilita: string;
}

/* ────────────────────────────────────────────────────────────────
 * Filtri iniziali vuoti
 * ──────────────────────────────────────────────────────────────── */
const filtriIniziali: FiltriAttivi = {
  prezzoMin: '',
  prezzoMax: '',
  marca: '',
  disponibilita: '',
};

/* ────────────────────────────────────────────────────────────────
 * Componente principale: pagina categoria con navigazione a 3 livelli
 *
 * Livello 1 – /categoria/:slug
 *   Mostra i GRUPPI della categoria come card grandi
 *
 * Livello 2 – /categoria/:slug/:sottocategoria
 *   Mostra le SEZIONI del gruppo come card
 *
 * Livello 3 – /categoria/:slug/:sottocategoria/:foglia
 *   Mostra i PRODOTTI REALI filtrati per categorySlug
 * ──────────────────────────────────────────────────────────────── */
export default function CategoryPage() {
  /* --- Parametri URL --- */
  const { slug, sottocategoria, foglia } = useParams();

  /* --- Stato per ordinamento e filtri (usati al livello 3) --- */
  const [sortBy, setSortBy] = useState<SortOption>('popolarita');
  const [showFilters, setShowFilters] = useState(false);
  const [filtri, setFiltri] = useState<FiltriAttivi>(filtriIniziali);

  /* --- Ricerca della categoria principale nel catalogo --- */
  const category = catalogMenu.find(c => c.key === slug);

  /* --- Se la categoria non esiste, mostra errore --- */
  if (!category) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Categoria non trovata</h1>
        <p className="text-gray-600 mb-6">La categoria &quot;{slug}&quot; non esiste nel catalogo.</p>
        <Link to="/" className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 inline-block">
          Torna alla Home
        </Link>
      </main>
    );
  }

  /* --- Ricerca del gruppo (livello 2) tramite slug --- */
  const gruppoCorrente: CatalogGroup | undefined = sottocategoria
    ? category.groups.find(g => g.slug === sottocategoria)
    : undefined;

  /* --- Ricerca della sezione foglia (livello 3) tramite slug --- */
  const sezioneFoglia: CatalogLeafSection | undefined =
    gruppoCorrente && foglia
      ? gruppoCorrente.sections.find(s => s.slug === foglia)
      : undefined;

  /* ──────────────────────────────────────────────────
   * Determina il livello corrente della navigazione
   * ────────────────────────────────────────────────── */
  const livello: 1 | 2 | 3 = sezioneFoglia ? 3 : gruppoCorrente ? 2 : 1;

  /* ──────────────────────────────────────────────────
   * Livello 3: carica i prodotti reali filtrati
   * ────────────────────────────────────────────────── */

  /* Raccogli tutti gli slug delle foglie (items) per filtrare i prodotti */
  const slugFoglie = useMemo(() => {
    if (!sezioneFoglia) return [] as string[];
    return sezioneFoglia.items.map(item => item.slug);
  }, [sezioneFoglia]);

  /* Filtra i prodotti reali che corrispondono alla sezione foglia */
  const prodottiFiltrati = useMemo(() => {
    if (livello !== 3) return [] as Product[];

    /* Filtra per categorySlug corrispondente a uno degli item della sezione */
    let risultati = realProducts.filter(p => slugFoglie.includes(p.categorySlug));

    /* Anche match diretto sullo slug della sezione stessa */
    if (risultati.length === 0 && sezioneFoglia) {
      risultati = realProducts.filter(p => p.categorySlug === sezioneFoglia.slug);
    }

    /* Filtro per prezzo minimo */
    if (filtri.prezzoMin) {
      const min = parseFloat(filtri.prezzoMin);
      if (!isNaN(min)) risultati = risultati.filter(p => p.priceNet >= min);
    }

    /* Filtro per prezzo massimo */
    if (filtri.prezzoMax) {
      const max = parseFloat(filtri.prezzoMax);
      if (!isNaN(max)) risultati = risultati.filter(p => p.priceNet <= max);
    }

    /* Filtro per marca */
    if (filtri.marca) {
      risultati = risultati.filter(p => p.brand === filtri.marca);
    }

    /* Filtro per disponibilita */
    if (filtri.disponibilita) {
      risultati = risultati.filter(p => p.availability === filtri.disponibilita);
    }

    return risultati;
  }, [livello, slugFoglie, sezioneFoglia, filtri]);

  /* Estrai le marche uniche per il filtro marca */
  const marcheDisponibili = useMemo(() => {
    if (livello !== 3) return [] as string[];
    const prodottiCategoria = realProducts.filter(p => slugFoglie.includes(p.categorySlug));
    return [...new Set(prodottiCategoria.map(p => p.brand))].sort();
  }, [livello, slugFoglie]);

  /* Ordina i prodotti secondo il criterio selezionato */
  const prodottiOrdinati = useMemo(() => {
    const copia = [...prodottiFiltrati];
    switch (sortBy) {
      case 'prezzo-asc':
        return copia.sort((a, b) => a.priceNet - b.priceNet);
      case 'prezzo-desc':
        return copia.sort((a, b) => b.priceNet - a.priceNet);
      case 'nome':
        return copia.sort((a, b) => a.name.localeCompare(b.name));
      default:
        /* Popolarita: ordina per numero di recensioni decrescente */
        return copia.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [prodottiFiltrati, sortBy]);

  /* ──────────────────────────────────────────────────
   * Titolo e descrizione per ogni livello
   * ────────────────────────────────────────────────── */
  const titoloCorrente =
    livello === 3 && sezioneFoglia
      ? sezioneFoglia.title
      : livello === 2 && gruppoCorrente
        ? gruppoCorrente.title
        : category.label;

  const descrizioneCorrente =
    livello === 1
      ? category.description
      : livello === 2 && gruppoCorrente
        ? `Sfoglia le sezioni di ${gruppoCorrente.title} nella categoria ${category.label}.`
        : sezioneFoglia
          ? `${prodottiOrdinati.length} prodotti in ${sezioneFoglia.title}`
          : '';

  /* ──────────────────────────────────────────────────
   * Helper: mappa disponibilita in etichetta e colore
   * ────────────────────────────────────────────────── */
  const etichettaDisponibilita = (d: Product['availability']) => {
    switch (d) {
      case 'disponibile': return { testo: 'Disponibile', classi: 'bg-green-100 text-green-700' };
      case 'in_arrivo':   return { testo: 'In arrivo', classi: 'bg-amber-100 text-amber-700' };
      case 'su_ordinazione': return { testo: 'Su ordinazione', classi: 'bg-blue-100 text-blue-700' };
      case 'esaurito':    return { testo: 'Esaurito', classi: 'bg-red-100 text-red-700' };
      default:            return { testo: 'N/D', classi: 'bg-gray-100 text-gray-500' };
    }
  };

  /* ──────────────────────────────────────────────────
   * Aggiorna un singolo campo filtro
   * ────────────────────────────────────────────────── */
  const aggiornaFiltro = (campo: keyof FiltriAttivi, valore: string) => {
    setFiltri(prev => ({ ...prev, [campo]: valore }));
  };

  /* ══════════════════════════════════════════════════
   * RENDER
   * ══════════════════════════════════════════════════ */
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mb-20">

      {/* ─── Breadcrumb ───────────────────────────────── */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600 flex-wrap">
        <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />

        {/* Link alla categoria principale (sempre visibile) */}
        {livello === 1 ? (
          <span className="font-semibold text-gray-900">{category.label}</span>
        ) : (
          <Link
            to={`/categoria/${category.key}`}
            className="hover:text-green-600 transition-colors"
          >
            {category.label}
          </Link>
        )}

        {/* Link al gruppo (livello 2+) */}
        {livello >= 2 && gruppoCorrente && (
          <>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            {livello === 2 ? (
              <span className="font-semibold text-gray-900">{gruppoCorrente.title}</span>
            ) : (
              <Link
                to={`/categoria/${category.key}/${gruppoCorrente.slug}`}
                className="hover:text-green-600 transition-colors"
              >
                {gruppoCorrente.title}
              </Link>
            )}
          </>
        )}

        {/* Sezione foglia (livello 3) */}
        {livello === 3 && sezioneFoglia && (
          <>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            <span className="font-semibold text-gray-900">{sezioneFoglia.title}</span>
          </>
        )}
      </nav>

      {/* ─── Intestazione categoria ───────────────────── */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">{titoloCorrente}</h1>
        {descrizioneCorrente && (
          <p className="mt-1 text-sm text-gray-600">{descrizioneCorrente}</p>
        )}
      </section>

      {/* ─── LIVELLO 1: Griglia dei gruppi ────────────── */}
      {livello === 1 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {category.groups.map(gruppo => (
            <Link
              key={gruppo.slug}
              to={`/categoria/${category.key}/${gruppo.slug}`}
              className="group"
            >
              <article className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow hover:border-green-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Grid3X3 className="w-6 h-6 text-green-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                      {gruppo.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {gruppo.sections.length} {gruppo.sections.length === 1 ? 'sezione' : 'sezioni'}
                    </p>
                    {/* Anteprima delle prime sezioni */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {gruppo.sections.slice(0, 4).map(sez => (
                        <span
                          key={sez.slug}
                          className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
                        >
                          {sez.title}
                        </span>
                      ))}
                      {gruppo.sections.length > 4 && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-400">
                          +{gruppo.sections.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {/* ─── LIVELLO 2: Griglia delle sezioni del gruppo ─ */}
      {livello === 2 && gruppoCorrente && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gruppoCorrente.sections.map(sezione => {
            /* Conta quanti prodotti reali esistono per questa sezione */
            const slugItems = sezione.items.map(i => i.slug);
            const contoProdotti = realProducts.filter(p => slugItems.includes(p.categorySlug)).length;

            return (
              <Link
                key={sezione.slug}
                to={`/categoria/${category.key}/${gruppoCorrente.slug}/${sezione.slug}`}
                className="group"
              >
                <article className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow hover:border-green-300">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                    {sezione.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {contoProdotti > 0
                      ? `${contoProdotti} ${contoProdotti === 1 ? 'prodotto' : 'prodotti'} disponibili`
                      : 'Catalogo in arrivo'}
                  </p>
                  {/* Anteprima degli item della sezione */}
                  {sezione.items.length > 1 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {sezione.items.slice(0, 3).map(item => (
                        <span
                          key={item.slug}
                          className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-600"
                        >
                          {item.name}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </Link>
            );
          })}
        </div>
      )}

      {/* ─── LIVELLO 3: Prodotti reali ───────────────── */}
      {livello === 3 && (
        <div className="grid gap-6 lg:grid-cols-[280px,1fr]">

          {/* ── Sidebar sinistra ── */}
          <aside className="space-y-4">

            {/* Navigazione sezioni sorelle (dello stesso gruppo) */}
            {gruppoCorrente && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Sezioni in {gruppoCorrente.title}
                </p>
                <div className="space-y-1.5">
                  {gruppoCorrente.sections.map(sez => (
                    <Link
                      key={sez.slug}
                      to={`/categoria/${category.key}/${gruppoCorrente.slug}/${sez.slug}`}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                        sez.slug === foglia
                          ? 'bg-green-50 text-green-700 border border-green-300'
                          : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      {sez.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Blocco aiuto / contatto */}
            <div className="bg-green-50 rounded-xl border border-green-200 p-4">
              <p className="font-bold text-green-900 text-sm mb-2">Serve aiuto?</p>
              <p className="text-xs text-green-700 mb-3">
                I nostri esperti possono consigliarti l&apos;attrezzatura giusta per la tua attivit&agrave;.
              </p>
              <div className="space-y-2">
                <a
                  href="tel:+390212345"
                  className="flex items-center gap-2 text-xs font-semibold text-green-800 hover:text-green-900"
                >
                  <Phone className="w-3.5 h-3.5" /> Chiama ora
                </a>
                <button className="flex items-center gap-2 text-xs font-semibold text-green-800 hover:text-green-900">
                  <MessageCircle className="w-3.5 h-3.5" /> Richiedi preventivo
                </button>
              </div>
            </div>
          </aside>

          {/* ── Contenuto principale: prodotti ── */}
          <div>
            {/* Barra degli strumenti: filtri e ordinamento */}
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3 mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-green-700"
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filtri
                </button>
                <span className="text-xs text-gray-400">
                  {prodottiOrdinati.length} {prodottiOrdinati.length === 1 ? 'prodotto' : 'prodotti'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortOption)}
                  className="text-sm font-medium text-gray-700 border-0 bg-transparent focus:ring-0 cursor-pointer"
                >
                  <option value="popolarita">Piu popolari</option>
                  <option value="prezzo-asc">Prezzo crescente</option>
                  <option value="prezzo-desc">Prezzo decrescente</option>
                  <option value="nome">Nome A-Z</option>
                </select>
              </div>
            </div>

            {/* Pannello filtri espandibile */}
            {showFilters && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 grid gap-4 sm:grid-cols-3">
                {/* Filtro prezzo */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Prezzo (netto)</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filtri.prezzoMin}
                      onChange={e => aggiornaFiltro('prezzoMin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filtri.prezzoMax}
                      onChange={e => aggiornaFiltro('prezzoMax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                {/* Filtro marca */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Marca</label>
                  <select
                    value={filtri.marca}
                    onChange={e => aggiornaFiltro('marca', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Tutte</option>
                    {marcheDisponibili.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                {/* Filtro disponibilita */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Disponibilit&agrave;</label>
                  <select
                    value={filtri.disponibilita}
                    onChange={e => aggiornaFiltro('disponibilita', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Tutti</option>
                    <option value="disponibile">Disponibile</option>
                    <option value="in_arrivo">In arrivo</option>
                    <option value="su_ordinazione">Su ordinazione</option>
                  </select>
                </div>
              </div>
            )}

            {/* Griglia prodotti oppure messaggio "nessun prodotto" */}
            {prodottiOrdinati.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {prodottiOrdinati.map(prodotto => {
                  const disp = etichettaDisponibilita(prodotto.availability);
                  return (
                    <Link key={prodotto.id} to={`/prodotto/${prodotto.slug}`} className="group">
                      <article className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        {/* Immagine prodotto */}
                        <div className="relative h-40 bg-gray-50 flex items-center justify-center">
                          {prodotto.images[0] ? (
                            <img
                              src={prodotto.images[0]}
                              alt={prodotto.name}
                              className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <PackageSearch className="w-12 h-12 text-gray-300" />
                          )}
                          {/* Badge novita o offerta */}
                          {prodotto.isNew && (
                            <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              Nuovo
                            </span>
                          )}
                          {prodotto.isOnSale && (
                            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              Offerta
                            </span>
                          )}
                        </div>
                        {/* Dettagli prodotto */}
                        <div className="p-4">
                          <p className="text-xs font-semibold text-green-700 mb-1">
                            {prodotto.brand}
                          </p>
                          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[2.5rem] group-hover:text-green-700 transition-colors">
                            {prodotto.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {prodotto.shortDescription}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div>
                              {/* Prezzo originale barrato se in offerta */}
                              {prodotto.originalPriceNet && (
                                <p className="text-xs text-gray-400 line-through">
                                  &euro; {prodotto.originalPriceNet.toFixed(2)}
                                </p>
                              )}
                              <p className="text-lg font-extrabold text-gray-900">
                                &euro; {prodotto.priceNet.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500">+ IVA</p>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${disp.classi}`}>
                              {disp.testo}
                            </span>
                          </div>
                          {/* Stelline e recensioni */}
                          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                            <span className="text-amber-500">{'★'.repeat(Math.round(prodotto.rating))}</span>
                            <span>{prodotto.rating.toFixed(1)}</span>
                            <span>({prodotto.reviewCount})</span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            ) : (
              /* ── Nessun prodotto trovato: CTA preventivo ── */
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                <PackageSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Prodotti in arrivo
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Stiamo aggiornando il catalogo per questa categoria.
                  Nel frattempo puoi richiedere un preventivo personalizzato.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="tel:+390212345"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" /> Chiama per un preventivo
                  </a>
                  <button className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-green-600 text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors">
                    <MessageCircle className="w-4 h-4" /> Richiedi preventivo online
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
