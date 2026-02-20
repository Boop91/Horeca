import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
  Phone,
  MessageCircle,
  PackageSearch,
  Star,
  Send,
} from 'lucide-react';
import { catalogMenu } from '../data/catalogMenu';
import type { CatalogGroup, CatalogLeafSection } from '../data/catalogMenu';
import type { Product } from '../data/products/sampleProducts';
import ProductListingCard from './ProductListingCard';
import heroImage from '../assets/f4ed0b934aabb9cdf06af64854509a5ac97f8256.png';
import { useCart } from '../contexts/CartContext';
import { useStoreProducts } from '../lib/storefrontStore';
import { trackUxEvent } from '../lib/uxTelemetry';
import { toast } from 'sonner';
import './CategoryPage.css';

/* ────────────────────────────────────────────────────────────────
 * Tipi locali
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

const PRODUCTS_PER_PAGE = 16;

/* ────────────────────────────────────────────────────────────────
 * Reviews mock data
 * ──────────────────────────────────────────────────────────────── */
const reviews = [
  { name: 'Marco R.', rating: 5, text: 'Prodotto eccellente, spedizione velocissima. Consigliatissimo!', date: '12/01/2026' },
  { name: 'Laura B.', rating: 5, text: 'Qualità professionale, ottimo rapporto qualità-prezzo.', date: '05/01/2026' },
  { name: 'Giuseppe M.', rating: 4, text: 'Molto soddisfatto dell\'acquisto, assistenza impeccabile.', date: '28/12/2025' },
];

/* ════════════════════════════════════════════════════════════════
 * CategoryPage
 * ════════════════════════════════════════════════════════════════ */
export default function CategoryPage() {
  const { slug, sottocategoria, foglia } = useParams();
  const location = useLocation();
  const { addItem } = useCart();
  const products = useStoreProducts();

  const [sortBy, setSortBy] = useState<SortOption>('popolarita');
  const [showFilters, setShowFilters] = useState(false);
  const [filtri, setFiltri] = useState<FiltriAttivi>(filtriIniziali);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const subcatScrollRef = useRef<HTMLDivElement>(null);

  const category = catalogMenu.find(c => c.key === slug);

  if (!category) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Categoria non trovata</h1>
        <p className="text-gray-600 mb-6">La categoria &quot;{slug}&quot; non esiste nel catalogo.</p>
        <Link to="/" className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 inline-block transition-colors">
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
  const getTrackingContext = () => ({
    categoryKey: category.key,
    level: livello,
    groupKey: gruppoCorrente?.slug ?? null,
    sectionKey: sezioneFoglia?.slug ?? null,
  });

  /* ── Prodotti filtrati (livello 3) ── */
  const slugFoglie = useMemo(() => {
    if (livello === 3 && sezioneFoglia) {
      return sezioneFoglia.items.map(item => item.slug);
    }

    if (livello === 2 && gruppoCorrente) {
      return gruppoCorrente.sections.flatMap(section => section.items.map(item => item.slug));
    }

    return category.groups.flatMap(group =>
      group.sections.flatMap(section => section.items.map(item => item.slug)),
    );
  }, [livello, sezioneFoglia, gruppoCorrente, category]);

  const prodottiFiltrati = useMemo(() => {
    let risultati = products.filter(p => slugFoglie.includes(p.categorySlug));
    if (risultati.length === 0 && sezioneFoglia) {
      risultati = products.filter(p => p.categorySlug === sezioneFoglia.slug);
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
  }, [livello, slugFoglie, sezioneFoglia, filtri, products]);

  const marcheDisponibili = useMemo(() => {
    const prodottiCategoria = products.filter(p => slugFoglie.includes(p.categorySlug));
    return [...new Set(prodottiCategoria.map(p => p.brand))].sort();
  }, [slugFoglie, products]);

  const prodottiOrdinati = useMemo(() => {
    const copia = [...prodottiFiltrati];
    switch (sortBy) {
      case 'prezzo-asc': return copia.sort((a, b) => a.priceNet - b.priceNet);
      case 'prezzo-desc': return copia.sort((a, b) => b.priceNet - a.priceNet);
      case 'nome': return copia.sort((a, b) => a.name.localeCompare(b.name));
      default: return copia.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [prodottiFiltrati, sortBy]);

  const showProductsGrid = livello === 3;

  /* ── Pagination ── */
  const totalPages = showProductsGrid
    ? Math.max(1, Math.ceil(prodottiOrdinati.length / PRODUCTS_PER_PAGE))
    : 1;
  const paginatedProducts = showProductsGrid
    ? prodottiOrdinati.slice(
      (currentPage - 1) * PRODUCTS_PER_PAGE,
      currentPage * PRODUCTS_PER_PAGE,
    )
    : [];

  const goToPage = (page: number) => {
    const nextPage = Math.max(1, Math.min(page, totalPages));
    if (nextPage === currentPage) return;
    trackUxEvent('pagination_navigate', {
      fromPage: currentPage,
      toPage: nextPage,
      totalPages,
      ...getTrackingContext(),
    });
    setCurrentPage(nextPage);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  useEffect(() => {
    setCurrentPage(1);
    setShowFilters(false);
  }, [slug, sottocategoria, foglia]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /* ── Titoli e descrizioni ── */
  const titoloCorrente =
    livello === 3 && sezioneFoglia ? sezioneFoglia.title
    : livello === 2 && gruppoCorrente ? gruppoCorrente.title
    : category.label;

  const descrizioneCorrente =
    livello === 1 ? category.description
    : livello === 2 && gruppoCorrente ? `Sfoglia le sezioni di ${gruppoCorrente.title} nella categoria ${category.label}.`
    : sezioneFoglia ? `Scopri la nostra selezione di ${sezioneFoglia.title.toLowerCase()} professionali. Attrezzature certificate per ristoranti, hotel e attività di ristorazione.`
    : '';

  const testoSottoBottoni =
    livello === 1
      ? `Scegli una sottocategoria della ${category.label} per accedere alle sottocategorie finali e vedere i prodotti disponibili.`
      : livello === 2 && gruppoCorrente
        ? `In ${gruppoCorrente.title} i prodotti vengono mostrati solo nella sottocategoria finale. Seleziona una voce qui sopra per continuare.`
        : '';
  const preventivoQuery = useMemo(() => {
    const params = new URLSearchParams({
      oggetto: 'preventivo',
      categoria: titoloCorrente,
      messaggio: `Buongiorno, desidero un preventivo per la categoria "${titoloCorrente}".`,
    });
    return params.toString();
  }, [titoloCorrente]);

  /* ── Helpers ── */
  const aggiornaFiltro = (campo: keyof FiltriAttivi, valore: string) => {
    setFiltri(prev => ({ ...prev, [campo]: valore }));
    setCurrentPage(1);
  };

  const resetFiltri = (source: 'active_filters' | 'expanded_panel' | 'quick_action') => {
    setFiltri(filtriIniziali);
    setCurrentPage(1);
    trackUxEvent('filters_reset', {
      source,
      ...getTrackingContext(),
    });
  };

  const filtriAttivi = useMemo(() => {
    const entries: Array<{ id: string; label: string }> = [];

    if (filtri.prezzoMin || filtri.prezzoMax) {
      const prezzoLabel = filtri.prezzoMin && filtri.prezzoMax
        ? `Prezzo: €${filtri.prezzoMin} - €${filtri.prezzoMax}`
        : filtri.prezzoMin
          ? `Prezzo da €${filtri.prezzoMin}`
          : `Prezzo fino a €${filtri.prezzoMax}`;
      entries.push({ id: 'prezzo', label: prezzoLabel });
    }

    if (filtri.marca) {
      entries.push({ id: 'marca', label: `Marca: ${filtri.marca}` });
    }

    if (filtri.disponibilita) {
      const disponibilitaLabel = filtri.disponibilita === 'disponibile'
        ? 'Disponibile'
        : filtri.disponibilita === 'in_arrivo'
          ? 'In arrivo'
          : 'Su ordinazione';
      entries.push({ id: 'disponibilita', label: `Disponibilita: ${disponibilitaLabel}` });
    }

    return entries;
  }, [filtri.disponibilita, filtri.marca, filtri.prezzoMax, filtri.prezzoMin]);

  const handleFiltersToggle = () => {
    setShowFilters((prev) => {
      const next = !prev;
      trackUxEvent('filters_toggle', {
        open: next,
        activeFilters: filtriAttivi.length,
        ...getTrackingContext(),
      });
      return next;
    });
  };

  const handleSortChange = (nextSort: SortOption) => {
    setSortBy(nextSort);
    setCurrentPage(1);
    trackUxEvent('sort_change', {
      sortBy: nextSort,
      results: prodottiOrdinati.length,
      ...getTrackingContext(),
    });
  };

  const handleApplyFilters = () => {
    trackUxEvent('filters_apply', {
      activeFilters: filtriAttivi.length,
      results: prodottiOrdinati.length,
      ...getTrackingContext(),
    });
    setShowFilters(false);
  };

  const rimuoviFiltroAttivo = (id: string) => {
    trackUxEvent('filter_chip_remove', {
      filterId: id,
      ...getTrackingContext(),
    });

    setFiltri((prev) => {
      if (id === 'prezzo') {
        return { ...prev, prezzoMin: '', prezzoMax: '' };
      }

      if (id === 'marca') {
        return { ...prev, marca: '' };
      }

      if (id === 'disponibilita') {
        return { ...prev, disponibilita: '' };
      }

      return prev;
    });
    setCurrentPage(1);

    return;
  };

  const scrollSubcat = (direction: 'left' | 'right') => {
    if (!subcatScrollRef.current) return;
    subcatScrollRef.current.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
  };

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

  /* ── Subcategory carousel items ── */
  const subcatItems = livello === 1
    ? category.groups
    : livello === 2 && gruppoCorrente
      ? gruppoCorrente.sections
      : [];

  const subcatItemsUnique = useMemo(() => {
    const seen = new Set<string>();
    return subcatItems.filter((item) => {
      const key = `${item.slug}::${item.title}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [subcatItems]);

  const subcatBasePath = livello === 1
    ? `/categoria/${category.key}`
    : livello === 2 && gruppoCorrente
      ? `/categoria/${category.key}/${gruppoCorrente.slug}`
      : '';
  const subcatTrackDensityClass = subcatItemsUnique.length <= 4
    ? ' category-figma-subcat-track-wide'
    : subcatItemsUnique.length <= 8
      ? ' category-figma-subcat-track-balanced'
      : ' category-figma-subcat-track-dense';

  /* ══════════════════════════════════════════════════════════════
   * RENDER
   * ══════════════════════════════════════════════════════════════ */
  return (
    <>
      <main className="category-figma-main">
        {/* ─── Header ──────────────────────────────── */}
        <section className="category-figma-header">
          <p className="category-figma-eyebrow">Selezione Bianchipro</p>
          <h1 className="category-figma-title">{titoloCorrente} Prodotti</h1>
          {descrizioneCorrente && (
            <p className="category-figma-description">{descrizioneCorrente}</p>
          )}
        </section>

        {/* ─── Subcategory Carousel (livello 1 e 2) ── */}
        {(livello === 1 || livello === 2) && subcatItemsUnique.length > 0 && (
          <section className="category-figma-subcategories">
            <div className="category-figma-subcategories-shell">
              <button
                onClick={() => scrollSubcat('left')}
                className="category-figma-subcat-arrow category-figma-subcat-arrow-left"
                aria-label="Scorri sottocategorie a sinistra"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollSubcat('right')}
                className="category-figma-subcat-arrow category-figma-subcat-arrow-right"
                aria-label="Scorri sottocategorie a destra"
              >
                <ArrowRight className="h-4 w-4" />
              </button>

              <div
                ref={subcatScrollRef}
                className={`category-figma-subcat-track${subcatItemsUnique.length <= 7 ? ' category-figma-subcat-track-centered' : ''}${subcatTrackDensityClass}`}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {subcatItemsUnique.map((item) => {
                  const itemPath = `${subcatBasePath}/${item.slug}`;
                  const isItemActive =
                    location.pathname === itemPath || location.pathname.startsWith(`${itemPath}/`);

                  return (
                    <Link
                      key={item.slug}
                      to={itemPath}
                      className={`category-figma-subcat-item${isItemActive ? ' category-figma-subcat-item-active' : ''}`}
                      aria-current={isItemActive ? 'page' : undefined}
                    >
                      <div className="category-figma-subcat-thumb">
                        <img
                          src={heroImage}
                          alt={item.title}
                          className="category-figma-subcat-image"
                          loading="lazy"
                          decoding="async"
                          width={140}
                          height={173}
                        />
                      </div>
                      <span className="category-figma-subcat-label">
                        {item.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {showProductsGrid ? (
          <div className="category-figma-products-wrap">
            {/* ── Barra filtri orizzontale ── */}
            <div className="category-figma-filter-row">
              <button
                onClick={handleFiltersToggle}
                className="category-figma-filter-button"
                aria-expanded={showFilters}
              >
                {showFilters
                  ? 'Nascondi filtri'
                  : filtriAttivi.length > 0
                    ? `Filtri (${filtriAttivi.length})`
                    : 'Filtri'}
              </button>

              <span className="category-figma-filter-count">
                Prodotti trovati: {prodottiOrdinati.length}
              </span>

              <div className="category-figma-sort-wrap">
                <select
                  value={sortBy}
                  onChange={e => handleSortChange(e.target.value as SortOption)}
                  className="category-figma-sort-select"
                  aria-label="Ordina per"
                >
                  <option value="popolarita">Rilevanza</option>
                  <option value="prezzo-asc">Prezzo crescente</option>
                  <option value="prezzo-desc">Prezzo decrescente</option>
                  <option value="nome">Nome A-Z</option>
                </select>
              </div>
            </div>

            {filtriAttivi.length > 0 && (
              <div className="category-figma-active-filters" aria-live="polite">
                {filtriAttivi.map((filtro) => (
                  <button
                    key={filtro.id}
                    type="button"
                    className="category-figma-active-filter-chip"
                    onClick={() => rimuoviFiltroAttivo(filtro.id)}
                  >
                    {filtro.label}
                    <span aria-hidden="true">×</span>
                  </button>
                ))}
                <button
                  type="button"
                  className="category-figma-active-filter-clear"
                  onClick={() => resetFiltri('active_filters')}
                >
                  Rimuovi tutti i filtri
                </button>
              </div>
            )}

            {/* Riga filtri dropdown (espandibile) */}
            {showFilters && (
              <div className="category-figma-expanded-filters">
                <div>
                  <label htmlFor="categoria-filtro-prezzo-min" className="text-xs font-bold text-gray-500 uppercase mb-1 block">Prezzo min</label>
                  <input
                    id="categoria-filtro-prezzo-min"
                    type="number"
                    placeholder="€ Min"
                    value={filtri.prezzoMin}
                    onChange={e => aggiornaFiltro('prezzoMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="categoria-filtro-prezzo-max" className="text-xs font-bold text-gray-500 uppercase mb-1 block">Prezzo max</label>
                  <input
                    id="categoria-filtro-prezzo-max"
                    type="number"
                    placeholder="€ Max"
                    value={filtri.prezzoMax}
                    onChange={e => aggiornaFiltro('prezzoMax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="categoria-filtro-marca" className="text-xs font-bold text-gray-500 uppercase mb-1 block">Marca</label>
                  <select
                    id="categoria-filtro-marca"
                    value={filtri.marca}
                    onChange={e => aggiornaFiltro('marca', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:outline-none"
                  >
                    <option value="">Tutte le marche</option>
                    {marcheDisponibili.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="categoria-filtro-disponibilita" className="text-xs font-bold text-gray-500 uppercase mb-1 block">Disponibilita</label>
                  <select
                    id="categoria-filtro-disponibilita"
                    value={filtri.disponibilita}
                    onChange={e => aggiornaFiltro('disponibilita', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:outline-none"
                  >
                    <option value="">Tutti</option>
                    <option value="disponibile">Disponibile</option>
                    <option value="in_arrivo">In arrivo</option>
                    <option value="su_ordinazione">Su ordinazione</option>
                  </select>
                </div>
                <div>
                  <button
                    onClick={() => resetFiltri('expanded_panel')}
                    className="w-full px-3 py-2 text-sm text-green-600 font-semibold hover:text-green-700 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    Resetta filtri
                  </button>
                </div>
                <div className="category-figma-filter-actions">
                  <button
                    type="button"
                    onClick={handleApplyFilters}
                    className="category-figma-filter-apply"
                  >
                    Mostra {prodottiOrdinati.length} prodotti
                  </button>
                  <button
                    type="button"
                    onClick={() => resetFiltri('quick_action')}
                    className="category-figma-filter-clear"
                    disabled={filtriAttivi.length === 0}
                  >
                    Rimuovi tutti i filtri
                  </button>
                </div>
              </div>
            )}

            {prodottiOrdinati.length > 0 ? (
              <>
                <div className="category-figma-product-grid">
                  {paginatedProducts.map(prodotto => (
                    <ProductListingCard
                      key={prodotto.id}
                      product={prodotto}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                  <nav className="mt-8 flex items-center justify-center gap-1">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Pagina precedente"
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => {
                      let page: number;
                      if (totalPages <= 8) {
                        page = i + 1;
                      } else if (currentPage <= 4) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        page = totalPages - 7 + i;
                      } else {
                        page = currentPage - 3 + i;
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                            page === currentPage
                              ? 'bg-green-600 text-white'
                              : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Pagina successiva"
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <PackageSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Prodotti in arrivo</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Stiamo aggiornando il catalogo per questa categoria. Nel frattempo puoi richiedere un preventivo personalizzato.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="tel:+390541620526"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
                    onClick={() =>
                      trackUxEvent('empty_state_call_click', {
                        destination: 'tel:+390541620526',
                        ...getTrackingContext(),
                      })
                    }
                  >
                    <Phone className="w-4 h-4" /> Chiama per un preventivo
                  </a>
                  <Link
                    to={`/contatti?${preventivoQuery}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-green-600 text-green-600 font-bold rounded-xl hover:bg-green-50 transition-colors"
                    onClick={() =>
                      trackUxEvent('empty_state_preventivo_click', {
                        destination: `/contatti?${preventivoQuery}`,
                        ...getTrackingContext(),
                      })
                    }
                  >
                    <MessageCircle className="w-4 h-4" /> Richiedi preventivo online
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <section className="category-figma-structure-text">
            <p className="category-figma-structure-text-primary">
              {testoSottoBottoni}
            </p>
            <p className="category-figma-structure-text-secondary">
              Questa pagina mostra solo la struttura di navigazione per categorie e sottocategorie.
            </p>
          </section>
        )}
      </main>

      {/* ─── Reviews Section ─────────────────────── */}
      {showProductsGrid && (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 border-t border-gray-300 pt-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-3">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-sm font-bold text-green-600">4.8/5</span>
              <span className="text-xs text-gray-500">Feedaty</span>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Cosa dicono i nostri clienti</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {reviews.map((r, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-5">
                <div className="flex gap-0.5 mb-2">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`h-4 w-4 ${i <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">{r.name}</span>
                  <span className="text-xs text-gray-400">{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ─── Newsletter Bar ──────────────────────── */}
      {showProductsGrid && (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl bg-[#1a2332] px-6 py-6">
          <div>
            <h3 className="text-lg font-bold text-white">Iscriviti alla Newsletter</h3>
            <p className="text-sm text-gray-400">Ricevi offerte esclusive e novità dal mondo Bianchipro</p>
          </div>
          <form onSubmit={e => { e.preventDefault(); if (newsletterEmail) { toast.success('Iscrizione completata!'); setNewsletterEmail(''); } }} className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
              placeholder="La tua email"
              className="px-4 py-2.5 rounded-lg text-sm w-full md:w-64 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button type="submit" className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors flex items-center gap-2 flex-shrink-0">
              <Send className="w-4 h-4" />
              Iscriviti
            </button>
          </form>
        </div>
      </section>
      )}
    </>
  );
}
