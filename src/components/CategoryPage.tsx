import { useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowLeft,
  ArrowRight,
  Phone,
  MessageCircle,
  PackageSearch,
  ShoppingCart,
  Star,
} from 'lucide-react';
import { catalogMenu } from '../data/catalogMenu';
import type { CatalogGroup, CatalogLeafSection } from '../data/catalogMenu';
import { realProducts } from '../data/products/realProducts';
import type { Product } from '../data/products/sampleProducts';
import heroImage from '../assets/f4ed0b934aabb9cdf06af64854509a5ac97f8256.png';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

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

const filtriIniziali: FiltriAttivi = {
  prezzoMin: '',
  prezzoMax: '',
  marca: '',
  disponibilita: '',
};

/* ────────────────────────────────────────────────────────────────
 * Componente principale: pagina categoria con navigazione a 3 livelli
 * ──────────────────────────────────────────────────────────────── */
export default function CategoryPage() {
  const { slug, sottocategoria, foglia } = useParams();
  const { addItem } = useCart();

  const [sortBy, setSortBy] = useState<SortOption>('popolarita');
  const [showFilters, setShowFilters] = useState(false);
  const [filtri, setFiltri] = useState<FiltriAttivi>(filtriIniziali);

  /* Ref per il carousel sottocategorie */
  const subcatScrollRef = useRef<HTMLDivElement>(null);

  const category = catalogMenu.find(c => c.key === slug);

  if (!category) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Categoria non trovata</h1>
        <p className="text-gray-600 mb-6">La categoria &quot;{slug}&quot; non esiste nel catalogo.</p>
        <Link to="/" className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 inline-block transition-colors">
          Torna alla Home
        </Link>
      </main>
    );
  }

  const gruppoCorrente: CatalogGroup | undefined = sottocategoria
    ? category.groups.find(g => g.slug === sottocategoria)
    : undefined;

  const sezioneFoglia: CatalogLeafSection | undefined =
    gruppoCorrente && foglia
      ? gruppoCorrente.sections.find(s => s.slug === foglia)
      : undefined;

  const livello: 1 | 2 | 3 = sezioneFoglia ? 3 : gruppoCorrente ? 2 : 1;

  /* ── Prodotti filtrati (livello 3) ── */
  const slugFoglie = useMemo(() => {
    if (!sezioneFoglia) return [] as string[];
    return sezioneFoglia.items.map(item => item.slug);
  }, [sezioneFoglia]);

  const prodottiFiltrati = useMemo(() => {
    if (livello !== 3) return [] as Product[];
    let risultati = realProducts.filter(p => slugFoglie.includes(p.categorySlug));
    if (risultati.length === 0 && sezioneFoglia) {
      risultati = realProducts.filter(p => p.categorySlug === sezioneFoglia.slug);
    }
    if (filtri.prezzoMin) {
      const min = parseFloat(filtri.prezzoMin);
      if (!isNaN(min)) risultati = risultati.filter(p => p.priceNet >= min);
    }
    if (filtri.prezzoMax) {
      const max = parseFloat(filtri.prezzoMax);
      if (!isNaN(max)) risultati = risultati.filter(p => p.priceNet <= max);
    }
    if (filtri.marca) risultati = risultati.filter(p => p.brand === filtri.marca);
    if (filtri.disponibilita) risultati = risultati.filter(p => p.availability === filtri.disponibilita);
    return risultati;
  }, [livello, slugFoglie, sezioneFoglia, filtri]);

  const marcheDisponibili = useMemo(() => {
    if (livello !== 3) return [] as string[];
    const prodottiCategoria = realProducts.filter(p => slugFoglie.includes(p.categorySlug));
    return [...new Set(prodottiCategoria.map(p => p.brand))].sort();
  }, [livello, slugFoglie]);

  const prodottiOrdinati = useMemo(() => {
    const copia = [...prodottiFiltrati];
    switch (sortBy) {
      case 'prezzo-asc': return copia.sort((a, b) => a.priceNet - b.priceNet);
      case 'prezzo-desc': return copia.sort((a, b) => b.priceNet - a.priceNet);
      case 'nome': return copia.sort((a, b) => a.name.localeCompare(b.name));
      default: return copia.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [prodottiFiltrati, sortBy]);

  /* ── Titoli e descrizioni ── */
  const titoloCorrente =
    livello === 3 && sezioneFoglia ? sezioneFoglia.title
    : livello === 2 && gruppoCorrente ? gruppoCorrente.title
    : category.label;

  const descrizioneCorrente =
    livello === 1 ? category.description
    : livello === 2 && gruppoCorrente ? `Sfoglia le sezioni di ${gruppoCorrente.title} nella categoria ${category.label}.`
    : sezioneFoglia ? `${prodottiOrdinati.length} prodotti in ${sezioneFoglia.title}`
    : '';

  /* ── Helper disponibilita ── */
  const etichettaDisponibilita = (d: Product['availability']) => {
    switch (d) {
      case 'disponibile': return { testo: 'Disponibile', classi: 'bg-green-100 text-green-700' };
      case 'in_arrivo': return { testo: 'In arrivo', classi: 'bg-amber-100 text-amber-700' };
      case 'su_ordinazione': return { testo: 'Su ordinazione', classi: 'bg-blue-100 text-blue-700' };
      case 'esaurito': return { testo: 'Esaurito', classi: 'bg-red-100 text-red-700' };
      default: return { testo: 'N/D', classi: 'bg-gray-100 text-gray-500' };
    }
  };

  const aggiornaFiltro = (campo: keyof FiltriAttivi, valore: string) => {
    setFiltri(prev => ({ ...prev, [campo]: valore }));
  };

  /* ── Scroll sottocategorie ── */
  const scrollSubcat = (direction: 'left' | 'right') => {
    if (!subcatScrollRef.current) return;
    subcatScrollRef.current.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  /* ── Aggiungi al carrello ── */
  const handleAddToCart = (product: Product) => {
    addItem({
      id: `product-${product.id}-${Date.now()}`,
      name: product.name,
      price: product.priceNet,
      quantity: 1,
      image: product.images[0] || heroImage,
    });
    toast.success('Prodotto aggiunto al carrello');
  };

  /* ── Elementi per il carousel sottocategorie ── */
  const subcatItems = livello === 1
    ? category.groups
    : livello === 2 && gruppoCorrente
      ? gruppoCorrente.sections
      : [];

  const subcatBasePath = livello === 1
    ? `/categoria/${category.key}`
    : livello === 2 && gruppoCorrente
      ? `/categoria/${category.key}/${gruppoCorrente.slug}`
      : '';

  /* ══════════════════════════════════════════════════
   * RENDER
   * ══════════════════════════════════════════════════ */
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mb-20">

      {/* ─── Breadcrumb ───────────────────────────────── */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600 flex-wrap">
        <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        {livello === 1 ? (
          <span className="font-semibold text-gray-900">{category.label}</span>
        ) : (
          <Link to={`/categoria/${category.key}`} className="hover:text-green-600 transition-colors">
            {category.label}
          </Link>
        )}
        {livello >= 2 && gruppoCorrente && (
          <>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            {livello === 2 ? (
              <span className="font-semibold text-gray-900">{gruppoCorrente.title}</span>
            ) : (
              <Link to={`/categoria/${category.key}/${gruppoCorrente.slug}`} className="hover:text-green-600 transition-colors">
                {gruppoCorrente.title}
              </Link>
            )}
          </>
        )}
        {livello === 3 && sezioneFoglia && (
          <>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            <span className="font-semibold text-gray-900">{sezioneFoglia.title}</span>
          </>
        )}
      </nav>

      {/* ─── Intestazione ──────────────────────────────── */}
      <section className="mb-6">
        <p className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-1">Selezione Bianchipro</p>
        <h1 className="text-3xl font-extrabold text-gray-900">{titoloCorrente}</h1>
        {descrizioneCorrente && (
          <p className="mt-2 text-gray-600 max-w-2xl">{descrizioneCorrente}</p>
        )}
      </section>

      {/* ─── Carousel sottocategorie (livello 1 e 2) ──── */}
      {(livello === 1 || livello === 2) && subcatItems.length > 0 && (
        <section className="mb-8">
          <div className="relative">
            {/* Frecce navigazione */}
            <button
              onClick={() => scrollSubcat('left')}
              className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollSubcat('right')}
              className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
            </button>

            <div
              ref={subcatScrollRef}
              className="flex gap-5 overflow-x-auto scroll-smooth px-6 py-3"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {subcatItems.map((item) => (
                <Link
                  key={item.slug}
                  to={`${subcatBasePath}/${item.slug}`}
                  className="group flex-shrink-0 flex flex-col items-center gap-2 w-24"
                >
                  <div className="h-20 w-20 rounded-full border-2 border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center group-hover:border-green-400 transition-colors shadow-sm">
                    <img src={heroImage} alt={item.title} className="h-full w-full object-cover rounded-full" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 text-center leading-tight line-clamp-2 group-hover:text-green-600 transition-colors">
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── LIVELLO 1: Griglia dei gruppi ────────────── */}
      {livello === 1 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {category.groups.map(gruppo => (
            <Link key={gruppo.slug} to={`/categoria/${category.key}/${gruppo.slug}`} className="group">
              <article className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow hover:border-green-300">
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  {gruppo.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {gruppo.sections.length} {gruppo.sections.length === 1 ? 'sezione' : 'sezioni'}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {gruppo.sections.slice(0, 4).map(sez => (
                    <span key={sez.slug} className="rounded-full bg-gray-50 border border-gray-200 px-2.5 py-0.5 text-xs text-gray-600">
                      {sez.title}
                    </span>
                  ))}
                  {gruppo.sections.length > 4 && (
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-400">
                      +{gruppo.sections.length - 4}
                    </span>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {/* ─── LIVELLO 2: Griglia delle sezioni ─────────── */}
      {livello === 2 && gruppoCorrente && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gruppoCorrente.sections.map(sezione => {
            const slugItems = sezione.items.map(i => i.slug);
            const contoProdotti = realProducts.filter(p => slugItems.includes(p.categorySlug)).length;
            return (
              <Link key={sezione.slug} to={`/categoria/${category.key}/${gruppoCorrente.slug}/${sezione.slug}`} className="group">
                <article className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow hover:border-green-300">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {sezione.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {contoProdotti > 0
                      ? `${contoProdotti} ${contoProdotti === 1 ? 'prodotto' : 'prodotti'} disponibili`
                      : 'Catalogo in arrivo'}
                  </p>
                  {sezione.items.length > 1 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {sezione.items.slice(0, 3).map(item => (
                        <span key={item.slug} className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-600">
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

      {/* ─── LIVELLO 3: Prodotti ────────────────────────── */}
      {livello === 3 && (
        <div>
          {/* Barra filtri e ordinamento */}
          <div className="flex flex-wrap items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3 mb-5 gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtra i prodotti
              </button>
              <span className="text-sm text-gray-500">
                Ci sono <strong className="text-gray-900">{prodottiOrdinati.length}</strong> prodotti
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="text-sm font-medium text-gray-700 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-green-200 focus:border-green-400 cursor-pointer"
              >
                <option value="popolarita">Ordina per: Piu popolari</option>
                <option value="prezzo-asc">Prezzo crescente</option>
                <option value="prezzo-desc">Prezzo decrescente</option>
                <option value="nome">Nome A-Z</option>
              </select>
            </div>
          </div>

          {/* Pannello filtri espandibile */}
          {showFilters && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5 grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Prezzo (netto)</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="number" placeholder="Min" value={filtri.prezzoMin}
                    onChange={e => aggiornaFiltro('prezzoMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:outline-none"
                  />
                  <input
                    type="number" placeholder="Max" value={filtri.prezzoMax}
                    onChange={e => aggiornaFiltro('prezzoMax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Marca</label>
                <select
                  value={filtri.marca} onChange={e => aggiornaFiltro('marca', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:outline-none"
                >
                  <option value="">Tutte</option>
                  {marcheDisponibili.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Disponibilit&agrave;</label>
                <select
                  value={filtri.disponibilita} onChange={e => aggiornaFiltro('disponibilita', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:outline-none"
                >
                  <option value="">Tutti</option>
                  <option value="disponibile">Disponibile</option>
                  <option value="in_arrivo">In arrivo</option>
                  <option value="su_ordinazione">Su ordinazione</option>
                </select>
              </div>
            </div>
          )}

          {/* Griglia prodotti — 4 colonne */}
          {prodottiOrdinati.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {prodottiOrdinati.map(prodotto => {
                const disp = etichettaDisponibilita(prodotto.availability);
                const hasDiscount = prodotto.originalPriceNet && prodotto.originalPriceNet > prodotto.priceNet;

                return (
                  <div key={prodotto.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-green-300 transition-all flex flex-col">
                    {/* Immagine e badge */}
                    <div className="relative">
                      <Link to={`/prodotto/${prodotto.slug}`}>
                        <div className="aspect-square bg-gray-50 flex items-center justify-center p-3">
                          {prodotto.images[0] ? (
                            <img
                              src={prodotto.images[0]}
                              alt={prodotto.name}
                              className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <PackageSearch className="w-12 h-12 text-gray-300" />
                          )}
                        </div>
                      </Link>
                      {/* Badge */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {prodotto.isNew && (
                          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                            nuovo
                          </span>
                        )}
                        {prodotto.isOnSale && (
                          <span className="bg-orange-400 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                            offerta
                          </span>
                        )}
                        {hasDiscount && (
                          <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                            best seller
                          </span>
                        )}
                      </div>
                      {/* Disponibilita */}
                      <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${disp.classi}`}>
                        {disp.testo}
                      </span>
                    </div>

                    {/* Dettagli */}
                    <div className="flex flex-col flex-1 p-4">
                      {/* Categoria tag */}
                      <span className="mb-1 w-fit rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                        {prodotto.categorySlug.replace(/-/g, ' ')}
                      </span>

                      {/* Nome prodotto */}
                      <Link to={`/prodotto/${prodotto.slug}`}>
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[2.5rem] group-hover:text-green-600 transition-colors">
                          {prodotto.name}
                        </h3>
                      </Link>

                      {/* Stelline */}
                      <div className="mt-1.5 flex items-center gap-1">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i <= Math.round(prodotto.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({prodotto.reviewCount})</span>
                      </div>

                      {/* Prezzo */}
                      <div className="mt-auto pt-3">
                        {hasDiscount && (
                          <p className="text-xs text-gray-400 line-through">
                            {prodotto.originalPriceNet!.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                          </p>
                        )}
                        <p className="text-lg font-extrabold text-gray-900">
                          {prodotto.priceNet.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                        </p>
                        <p className="text-xs text-gray-500">+ IVA</p>
                      </div>

                      {/* Bottone acquista */}
                      <button
                        onClick={() => handleAddToCart(prodotto)}
                        className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-green-500 py-2.5 text-sm font-bold text-white hover:bg-green-600 transition-colors"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Acquista
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Nessun prodotto */
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
              <PackageSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Prodotti in arrivo</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Stiamo aggiornando il catalogo per questa categoria. Nel frattempo puoi richiedere un preventivo personalizzato.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="tel:+390541620526" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors">
                  <Phone className="w-4 h-4" /> Chiama per un preventivo
                </a>
                <button className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-green-500 text-green-600 font-bold rounded-xl hover:bg-green-50 transition-colors">
                  <MessageCircle className="w-4 h-4" /> Richiedi preventivo online
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
