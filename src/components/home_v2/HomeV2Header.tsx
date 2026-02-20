import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { ChevronDown, ShoppingCart } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { catalogMenu } from '../../data/catalogMenu';
import { useHomeContentConfig, useStoreProducts } from '../../lib/storefrontStore';
import { trackUxEvent } from '../../lib/uxTelemetry';
import './HomeV2.css';

type CategoryKey =
  | 'linea-caldo'
  | 'linea-freddo'
  | 'preparazione'
  | 'carrelli-arredo'
  | 'hotellerie'
  | 'igiene'
  | 'ricambi';

interface HomeV2HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  favoritesCount: number;
  onFavoritesClick: () => void;
}

type NavItem =
  | { type: 'link'; label: string; to: string }
  | { type: 'category'; label: string; key: CategoryKey; icon: string; iconWeight: 'solid' | 'regular' };

const navItems: NavItem[] = [
  { type: 'link', label: 'Home', to: '/' },
  { type: 'link', label: 'La nostra Azienda', to: '/chi-siamo' },
  { type: 'category', label: 'Linea Caldo', key: 'linea-caldo', icon: '\uf7e4', iconWeight: 'solid' },
  { type: 'category', label: 'Linea Freddo', key: 'linea-freddo', icon: '\uf2dc', iconWeight: 'regular' },
  { type: 'category', label: 'Preparazione', key: 'preparazione', icon: '\uf517', iconWeight: 'solid' },
  { type: 'category', label: 'Carrelli ed Arredo', key: 'carrelli-arredo', icon: '\uf472', iconWeight: 'solid' },
  { type: 'category', label: 'Hotellerie', key: 'hotellerie', icon: '\uf2e7', iconWeight: 'solid' },
  { type: 'category', label: 'Cura ed Igiene', key: 'igiene', icon: '\uf5d0', iconWeight: 'solid' },
  { type: 'category', label: 'Ricambi', key: 'ricambi', icon: '\uf0ad', iconWeight: 'solid' },
  { type: 'link', label: 'Domande Frequenti', to: '/faq' },
  { type: 'link', label: 'Contatti', to: '/contatti' },
];

const leftLinkLabels = new Set(['Home', 'La nostra Azienda']);
const rightLinkLabels = new Set(['Domande Frequenti', 'Contatti']);

type SearchFeedback = 'idle' | 'success' | 'empty' | 'error';

interface SearchSuggestion {
  id: string;
  title: string;
  subtitle: string;
  to: string;
}

function normalizeSearchValue(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function Icon({ glyph, weight }: { glyph: string; weight: 'solid' | 'regular' }) {
  return (
    <span
      className={`home-v2-fa home-v2-fa-${weight}`}
      aria-hidden="true"
    >
      {glyph}
    </span>
  );
}

function TopAction({
  glyph,
  weight,
  customIcon,
  onClick,
  ariaLabel,
  dataTestId,
  dataCount,
  pressed,
  showCountBadge = false,
  emphasis = 'default',
}: {
  glyph: string;
  weight: 'solid' | 'regular';
  customIcon?: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
  dataTestId: string;
  dataCount?: number;
  pressed?: boolean;
  showCountBadge?: boolean;
  emphasis?: 'default' | 'cart';
}) {
  const count = typeof dataCount === 'number' && dataCount > 0 ? dataCount : undefined;

  return (
    <button
      type="button"
      className={`home-v2-top-action ${emphasis === 'cart' ? 'home-v2-top-action-cart' : ''}`}
      aria-label={ariaLabel}
      aria-pressed={pressed}
      data-testid={dataTestId}
      data-count={count}
      onClick={onClick}
    >
      {customIcon || <Icon glyph={glyph} weight={weight} />}
      {showCountBadge && count && (
        <span className="home-v2-top-action-count" aria-hidden="true">
          {count}
        </span>
      )}
    </button>
  );
}

function toStableId(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function HomeV2Header({
  cartItemCount,
  onCartClick,
  favoritesCount,
  onFavoritesClick,
}: HomeV2HeaderProps) {
  const { user } = useAuth();
  const { setAuthModalOpen } = useUI();
  const homeContent = useHomeContentConfig();
  const products = useStoreProducts();
  const navigate = useNavigate();
  const location = useLocation();
  const headerShellRef = useRef<HTMLDivElement>(null);
  const navZoneRef = useRef<HTMLElement>(null);
  const navBarRef = useRef<HTMLDivElement>(null);
  const firstNavBoundaryRef = useRef<HTMLAnchorElement>(null);
  const lastNavBoundaryRef = useRef<HTMLAnchorElement>(null);
  const categoryAnchorZoneRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLFormElement>(null);
  const mobileCatalogToggleRef = useRef<HTMLButtonElement>(null);
  const mobileCatalogCloseRef = useRef<HTMLButtonElement>(null);
  const searchInputId = 'home-v2-search-input';
  const searchSuggestionsListId = 'home-v2-search-suggestions';
  const [activeMegaCategoryKey, setActiveMegaCategoryKey] = useState<CategoryKey | null>(null);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
  const [mobileExpandedCategoryKey, setMobileExpandedCategoryKey] = useState<CategoryKey | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchFeedback, setSearchFeedback] = useState<SearchFeedback>('idle');
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [headerPinnedVisible, setHeaderPinnedVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [megaMenuInlineStyle, setMegaMenuInlineStyle] = useState<CSSProperties | undefined>(undefined);

  const categoryRoutes = useMemo(
    () => new Map(catalogMenu.map((category) => [category.key, `/categoria/${category.key}`])),
    [],
  );
  const categoryByKey = useMemo(
    () => new Map(catalogMenu.map((category) => [category.key, category])),
    [],
  );
  const activeMegaCategory = activeMegaCategoryKey
    ? categoryByKey.get(activeMegaCategoryKey) ?? null
    : null;
  const leftLinks = navItems.filter(
    (item): item is Extract<NavItem, { type: 'link' }> => item.type === 'link' && leftLinkLabels.has(item.label),
  );
  const categoryLinks = navItems.filter(
    (item): item is Extract<NavItem, { type: 'category' }> => item.type === 'category',
  );
  const rightLinks = navItems.filter(
    (item): item is Extract<NavItem, { type: 'link' }> => item.type === 'link' && rightLinkLabels.has(item.label),
  );
  const popularCategorySuggestions = categoryLinks.slice(0, 3).map((item) => ({
    label: item.label,
    to: categoryRoutes.get(item.key) ?? '/',
  }));
  const normalizedSearchQuery = normalizeSearchValue(searchQuery);
  const searchSuggestions = useMemo(() => {
    if (normalizedSearchQuery.length < 2) return [] as SearchSuggestion[];

    const categorySuggestions: SearchSuggestion[] = [];
    for (const category of catalogMenu) {
      const categoryPath = `/categoria/${category.key}`;
      const categoryMatchText = `${category.label} ${category.key} ${category.slug}`;
      if (normalizeSearchValue(categoryMatchText).includes(normalizedSearchQuery)) {
        categorySuggestions.push({
          id: `category-${category.key}`,
          title: category.label,
          subtitle: 'Categoria',
          to: categoryPath,
        });
      }

      for (const group of category.groups) {
        const groupPath = `${categoryPath}/${group.slug}`;
        const groupMatchText = `${group.title} ${group.slug}`;
        if (normalizeSearchValue(groupMatchText).includes(normalizedSearchQuery)) {
          categorySuggestions.push({
            id: `group-${category.key}-${group.slug}`,
            title: group.title,
            subtitle: `In ${category.label}`,
            to: groupPath,
          });
        }

        for (const section of group.sections) {
          const sectionPath = `${groupPath}/${section.slug}`;
          const sectionMatchText = `${section.title} ${section.slug}`;
          if (normalizeSearchValue(sectionMatchText).includes(normalizedSearchQuery)) {
            categorySuggestions.push({
              id: `section-${category.key}-${group.slug}-${section.slug}`,
              title: section.title,
              subtitle: `${category.label} / ${group.title}`,
              to: sectionPath,
            });
          }
        }
      }
    }

    const productSuggestions = products
      .filter((product) => {
        const productMatchText = `${product.name} ${product.brand} ${product.sku}`;
        return normalizeSearchValue(productMatchText).includes(normalizedSearchQuery);
      })
      .slice(0, 6)
      .map((product) => ({
        id: `product-${product.id}`,
        title: product.name,
        subtitle: `${product.brand} · ${product.sku}`,
        to: `/prodotto/${product.slug}`,
      }));

    const deduped = new Map<string, SearchSuggestion>();
    [...productSuggestions, ...categorySuggestions].forEach((suggestion) => {
      if (!deduped.has(suggestion.to)) {
        deduped.set(suggestion.to, suggestion);
      }
    });

    return [...deduped.values()].slice(0, 8);
  }, [normalizedSearchQuery, products]);
  const searchSuggestionsOpen = searchFocused && normalizedSearchQuery.length >= 2;
  const searchHintVisible = searchFocused && normalizedSearchQuery.length > 0 && normalizedSearchQuery.length < 2;
  const activeSuggestion =
    activeSuggestionIndex >= 0 && activeSuggestionIndex < searchSuggestions.length
      ? searchSuggestions[activeSuggestionIndex]
      : undefined;
  const activeSuggestionDomId = activeSuggestion
    ? `${searchSuggestionsListId}-${activeSuggestion.id}`
    : undefined;

  useEffect(() => {
    const onPointerDown = (event: globalThis.MouseEvent) => {
      if (!searchContainerRef.current?.contains(event.target as Node)) {
        setSearchFocused(false);
        setActiveSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);
    syncPreference();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', syncPreference);
      return () => mediaQuery.removeEventListener('change', syncPreference);
    }

    mediaQuery.addListener(syncPreference);
    return () => mediaQuery.removeListener(syncPreference);
  }, []);

  useEffect(() => {
    setActiveMegaCategoryKey(null);
    setMobileCatalogOpen(false);
    setMobileExpandedCategoryKey(null);
    setSearchFocused(false);
    setActiveSuggestionIndex(-1);
  }, [location.pathname]);

  useEffect(() => {
    if (searchFeedback !== 'success') return undefined;
    const timer = window.setTimeout(() => setSearchFeedback('idle'), 2400);
    return () => window.clearTimeout(timer);
  }, [searchFeedback]);

  useEffect(() => {
    if (!searchSuggestionsOpen) {
      setActiveSuggestionIndex(-1);
      return;
    }

    if (searchSuggestions.length === 0) {
      setActiveSuggestionIndex(-1);
      return;
    }

    setActiveSuggestionIndex((prev) => {
      if (prev < 0 || prev >= searchSuggestions.length) {
        return 0;
      }
      return prev;
    });
  }, [searchSuggestionsOpen, searchSuggestions.length]);

  const closeMobileCatalog = useCallback((restoreFocus = false) => {
    setMobileCatalogOpen(false);
    setMobileExpandedCategoryKey(null);
    if (restoreFocus) {
      window.requestAnimationFrame(() => {
        mobileCatalogToggleRef.current?.focus();
      });
    }
  }, []);

  useEffect(() => {
    if (!mobileCatalogOpen) return undefined;
    const rafId = window.requestAnimationFrame(() => {
      mobileCatalogCloseRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [mobileCatalogOpen]);

  useEffect(() => {
    if (!mobileCatalogOpen) return undefined;

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      closeMobileCatalog(true);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileCatalogOpen, closeMobileCatalog]);

  useEffect(() => {
    let rafId = 0;

    const applyHeaderVisibility = () => {
      rafId = 0;
      const root = document.documentElement;
      const maxScrollable = Math.max(0, root.scrollHeight - window.innerHeight);
      if (maxScrollable < 200) {
        setHeaderPinnedVisible(true);
        return;
      }

      const activeElement = document.activeElement;
      if (
        headerShellRef.current &&
        activeElement instanceof HTMLElement &&
        headerShellRef.current.contains(activeElement)
      ) {
        setHeaderPinnedVisible(true);
        return;
      }

      const hideThreshold = maxScrollable * 0.56;
      const showThreshold = maxScrollable * 0.44;
      const currentScroll = window.scrollY;

      setHeaderPinnedVisible((prev) => {
        if (prev) {
          return currentScroll <= hideThreshold;
        }
        return currentScroll <= showThreshold;
      });
    };

    const evaluateHeaderVisibility = () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
      rafId = window.requestAnimationFrame(applyHeaderVisibility);
    };

    applyHeaderVisibility();
    window.addEventListener('scroll', evaluateHeaderVisibility, { passive: true });
    window.addEventListener('resize', evaluateHeaderVisibility);
    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', evaluateHeaderVisibility);
      window.removeEventListener('resize', evaluateHeaderVisibility);
    };
  }, [location.pathname]);

  const onAccountClick = () => {
    if (user) {
      navigate('/account');
      return;
    }

    setAuthModalOpen(true);
  };

  const runSearch = (path?: string, source: 'submit' | 'suggestion' | 'empty_fallback' = 'submit') => {
    const query = searchQuery.trim();
    if (path) {
      setSearchFeedback('success');
      setSearchFocused(false);
      setActiveSuggestionIndex(-1);
      trackUxEvent(source === 'suggestion' ? 'search_suggestion_click' : 'search_submit', {
        query,
        source,
        suggestionsCount: searchSuggestions.length,
        destination: path,
      });
      navigate(path);
      return;
    }

    if (query.length < 2) {
      setSearchFeedback('error');
      setSearchFocused(true);
      setActiveSuggestionIndex(-1);
      trackUxEvent('search_submit', { query, source, suggestionsCount: searchSuggestions.length, outcome: 'error_short_query' });
      return;
    }

    if (searchSuggestions.length > 0) {
      setSearchFeedback('success');
      setSearchFocused(false);
      setActiveSuggestionIndex(-1);
      trackUxEvent('search_submit', {
        query,
        source,
        suggestionsCount: searchSuggestions.length,
        outcome: 'success',
        destination: searchSuggestions[0].to,
      });
      navigate(searchSuggestions[0].to);
      return;
    }

    setSearchFeedback('empty');
    setSearchFocused(true);
    setActiveSuggestionIndex(-1);
    trackUxEvent('search_submit', { query, source, suggestionsCount: 0, outcome: 'empty' });
  };

  const onSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runSearch(undefined, 'submit');
  };

  const onSearchInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setSearchFocused(false);
      setActiveSuggestionIndex(-1);
      return;
    }

    if (!searchSuggestionsOpen || searchSuggestions.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveSuggestionIndex((prev) => {
        if (prev < 0) return 0;
        return prev >= searchSuggestions.length - 1 ? 0 : prev + 1;
      });
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveSuggestionIndex((prev) => {
        if (prev < 0) return searchSuggestions.length - 1;
        return prev <= 0 ? searchSuggestions.length - 1 : prev - 1;
      });
      return;
    }

    if (event.key === 'Enter' && activeSuggestionIndex >= 0) {
      const suggestion = searchSuggestions[activeSuggestionIndex];
      if (!suggestion) return;
      event.preventDefault();
      runSearch(suggestion.to, 'suggestion');
    }
  };

  const toggleMobileCatalog = () => {
    setMobileCatalogOpen((prev) => {
      const next = !prev;
      trackUxEvent('mobile_catalog_toggle', { open: next });
      if (prev) {
        setMobileExpandedCategoryKey(null);
      }
      return next;
    });
  };

  const syncMegaMenuGeometry = useCallback(() => {
    const navBarEl = navBarRef.current;
    if (!navBarEl) {
      setMegaMenuInlineStyle(undefined);
      return;
    }

    const queryStartEl = navBarEl.querySelector<HTMLAnchorElement>('[data-mega-boundary="start"]');
    const queryEndEl = navBarEl.querySelector<HTMLAnchorElement>('[data-mega-boundary="end"]');
    const firstBoundaryEl = queryStartEl ?? firstNavBoundaryRef.current;
    const lastBoundaryEl = queryEndEl ?? lastNavBoundaryRef.current;
    const categoryAnchorZoneEl =
      navBarEl.querySelector<HTMLDivElement>('[data-mega-anchor-zone="categories"]')
      ?? categoryAnchorZoneRef.current;
    const navRect = navBarEl.getBoundingClientRect();
    const firstRect = firstBoundaryEl?.getBoundingClientRect();
    const lastRect = lastBoundaryEl?.getBoundingClientRect();
    const anchorZoneRect = categoryAnchorZoneEl?.getBoundingClientRect();

    const anchorLeft = firstRect?.left ?? anchorZoneRect?.left;
    const anchorRight = lastRect?.right ?? anchorZoneRect?.right;
    if (anchorLeft === undefined || anchorRight === undefined) {
      setMegaMenuInlineStyle(undefined);
      return;
    }

    const navWidthPx = Math.round(navRect.width);
    const sideBleedPx = 128;
    const rightShiftPx = 96;
    const anchorSpanPx = Math.max(320, Math.round(anchorRight - anchorLeft));
    const minimumDesktopWidthPx = Math.min(navWidthPx - 8, 1240);
    const requestedWidthPx = Math.max(anchorSpanPx + sideBleedPx * 2, minimumDesktopWidthPx);
    const targetWidthPx = Math.min(navWidthPx - 8, requestedWidthPx);
    const anchorCenterPx = Math.round(((anchorLeft + anchorRight) / 2) - navRect.left);
    const pageCenterPx = Math.round(navWidthPx / 2);
    const blendedCenterPx = Math.round(pageCenterPx * 0.55 + anchorCenterPx * 0.45 + rightShiftPx);
    const unclampedLeftPx = Math.round(blendedCenterPx - targetWidthPx / 2);
    const boundedLeftPx = Math.max(0, Math.min(unclampedLeftPx, navWidthPx - targetWidthPx));

    setMegaMenuInlineStyle({
      left: `${boundedLeftPx}px`,
      width: `${targetWidthPx}px`,
      transform: 'none',
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let rafId = 0;
    const scheduleSync = () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        syncMegaMenuGeometry();
      });
    };

    scheduleSync();
    window.addEventListener('resize', scheduleSync);

    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(scheduleSync);
      if (navBarRef.current) observer.observe(navBarRef.current);
      if (firstNavBoundaryRef.current) observer.observe(firstNavBoundaryRef.current);
      if (lastNavBoundaryRef.current) observer.observe(lastNavBoundaryRef.current);
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', scheduleSync);
      observer?.disconnect();
    };
  }, [syncMegaMenuGeometry]);

  useEffect(() => {
    if (!activeMegaCategoryKey) return;
    syncMegaMenuGeometry();
  }, [activeMegaCategoryKey, syncMegaMenuGeometry]);

  return (
    <div
      ref={headerShellRef}
      className={`home-v2-header-shell ${headerPinnedVisible ? 'home-v2-header-shell-visible' : 'home-v2-header-shell-hidden'}${prefersReducedMotion ? ' home-v2-header-shell-reduced-motion' : ''}`}
      data-testid="home-v2-header-shell"
    >
      <div className="home-v2-promo-strip" data-testid="home-v2-promo-strip">
        <div className="home-v2-promo-strip-inner">
          <span className="home-v2-promo-primary">{homeContent.promoText}</span>
          <span className="home-v2-promo-divider" aria-hidden="true">•</span>
          <span className="home-v2-promo-secondary">{homeContent.serviceText}</span>
        </div>
      </div>

      <div className="home-v2-header-top-bg">
        <div className="home-v2-header-top" data-node-id="7718:6629">
          <Link
            to="/"
            className="home-v2-logo-wrap"
            style={{ textDecoration: 'none' }}
            data-testid="home-v2-logo"
          >
            <span className="home-v2-logo-lockup">
              <span className="home-v2-logo-text">BIANCHI</span>
            </span>
          </Link>

          <div className="home-v2-search-margin">
            <form
              ref={searchContainerRef}
              className="home-v2-search-shell"
              onSubmit={onSearchSubmit}
            >
              <div className="home-v2-search-bar" data-testid="home-v2-search">
                <div className="home-v2-search-input-wrap">
                  <Icon glyph={'\uf002'} weight="solid" />
                  <input
                    id={searchInputId}
                    type="text"
                    placeholder="Cerca SKU, brand o categoria"
                    className="home-v2-search-input"
                    aria-label="Cerca nel catalogo professionale"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={searchSuggestionsOpen}
                    aria-controls={searchSuggestionsListId}
                    aria-activedescendant={activeSuggestionDomId}
                    data-testid="home-v2-search-input"
                    value={searchQuery}
                    onFocus={() => {
                      setSearchFocused(true);
                      setSearchFeedback('idle');
                    }}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      setSearchFeedback('idle');
                      setActiveSuggestionIndex(-1);
                    }}
                    onKeyDown={onSearchInputKeyDown}
                  />
                </div>
                <button
                  type="submit"
                  className="home-v2-search-button"
                  aria-label="Cerca nel catalogo professionale"
                  data-testid="home-v2-search-button"
                >
                  Cerca catalogo
                </button>
              </div>

              {searchHintVisible && (
                <p className="home-v2-search-hint" role="status" aria-live="polite">
                  Digita almeno 2 caratteri per cercare nel catalogo.
                </p>
              )}

              {searchSuggestionsOpen && (
                <div
                  id={searchSuggestionsListId}
                  className="home-v2-search-suggestions"
                  role="listbox"
                  aria-label="Suggerimenti ricerca"
                >
                  {searchSuggestions.length > 0 ? (
                    searchSuggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.id}
                        id={`${searchSuggestionsListId}-${suggestion.id}`}
                        type="button"
                        className="home-v2-search-suggestion-item"
                        role="option"
                        aria-selected={activeSuggestionIndex === index}
                        onMouseDown={(event) => event.preventDefault()}
                        onMouseEnter={() => setActiveSuggestionIndex(index)}
                        onFocus={() => setActiveSuggestionIndex(index)}
                        onClick={() => runSearch(suggestion.to, 'suggestion')}
                      >
                        <span className="home-v2-search-suggestion-title">{suggestion.title}</span>
                        <span className="home-v2-search-suggestion-subtitle">{suggestion.subtitle}</span>
                      </button>
                    ))
                  ) : (
                    <div className="home-v2-search-suggestions-empty">
                      <p className="home-v2-search-suggestions-empty-title">
                        Nessun risultato per &quot;{searchQuery.trim()}&quot;
                      </p>
                      <p className="home-v2-search-suggestions-empty-subtitle">
                        Verifica SKU, brand o categoria. In alternativa usa una scorciatoia qui sotto.
                      </p>
                      <div className="home-v2-search-empty-actions">
                        {popularCategorySuggestions.map((entry) => (
                          <button
                            key={entry.to}
                            type="button"
                            className="home-v2-search-empty-chip"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => runSearch(entry.to, 'empty_fallback')}
                          >
                            {entry.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {searchFeedback !== 'idle' && !searchFocused && (
                <p
                  className={`home-v2-search-feedback home-v2-search-feedback-${searchFeedback}`}
                  role={searchFeedback === 'error' || searchFeedback === 'empty' ? 'alert' : 'status'}
                >
                  {searchFeedback === 'success' && `Risultati per “${searchQuery.trim()}”`}
                  {searchFeedback === 'empty' && `Nessun risultato per “${searchQuery.trim()}”. Prova con SKU, brand o categoria.`}
                  {searchFeedback === 'error' && 'Inserisci almeno 2 caratteri: SKU, brand o categoria.'}
                </p>
              )}
            </form>
          </div>
          <div className="home-v2-actions-wrap">
            <button
              type="button"
              className="home-v2-account-cta"
              onClick={onAccountClick}
              aria-label={user ? 'Apri account' : 'Accedi'}
              data-testid="home-v2-account"
            >
              <Icon glyph={'\uf007'} weight="regular" />
              <span className="home-v2-account-cta-label">{user ? 'Account' : 'Accedi!'}</span>
            </button>

            <TopAction
              glyph={'\uf004'}
              weight={favoritesCount > 0 ? 'solid' : 'regular'}
              onClick={onFavoritesClick}
              ariaLabel="Preferiti"
              dataTestId="home-v2-favorites"
              dataCount={favoritesCount}
              pressed={favoritesCount > 0}
            />

            <TopAction
              glyph={'\uf07a'}
              weight="regular"
              customIcon={<ShoppingCart className="home-v2-lucide-icon" aria-hidden="true" />}
              onClick={onCartClick}
              ariaLabel={`Carrello${cartItemCount > 0 ? ` (${cartItemCount})` : ''}`}
              dataTestId="home-v2-cart"
              dataCount={cartItemCount}
              showCountBadge
              emphasis="cart"
            />
          </div>
        </div>
      </div>

      <nav
        ref={navZoneRef}
        className="home-v2-nav-zone"
        aria-label="Navigazione principale"
        onMouseLeave={() => setActiveMegaCategoryKey(null)}
        onBlurCapture={(event) => {
          const nextTarget = event.relatedTarget as Node | null;
          if (nextTarget && navZoneRef.current?.contains(nextTarget)) {
            return;
          }
          setActiveMegaCategoryKey(null);
        }}
      >
        <div className="home-v2-nav-bar-bg">
          <div ref={navBarRef} className="home-v2-nav-bar" data-node-id="7718:6654">
            <div className="home-v2-nav-list" data-node-id="7718:6655">
              <button
                ref={mobileCatalogToggleRef}
                type="button"
                className="home-v2-mobile-catalog-toggle"
                aria-expanded={mobileCatalogOpen}
                aria-controls="home-v2-mobile-catalog-panel"
                aria-label={mobileCatalogOpen ? 'Chiudi categorie' : 'Apri categorie'}
                data-testid="home-v2-mobile-catalog-toggle"
                onClick={toggleMobileCatalog}
              >
                Categorie
                <ChevronDown
                  className={`home-v2-mobile-catalog-toggle-icon${mobileCatalogOpen ? ' home-v2-mobile-catalog-toggle-icon-open' : ''}`}
                  aria-hidden="true"
                />
              </button>

              <div className="home-v2-nav-left-links">
                {leftLinks.map((item) => {
                  const isActive =
                    item.to === '/'
                      ? location.pathname === '/'
                      : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);

                  return (
                    <span key={item.label} className="home-v2-nav-item">
                      <Link
                        ref={undefined}
                        to={item.to}
                        className={`home-v2-nav-link${isActive ? ' home-v2-nav-link-active' : ''}`}
                        style={{ textDecoration: 'none' }}
                        aria-current={isActive ? 'page' : undefined}
                        data-testid={`home-v2-nav-${toStableId(item.label)}`}
                        onMouseEnter={() => setActiveMegaCategoryKey(null)}
                      >
                        {item.label}
                      </Link>
                    </span>
                  );
                })}
              </div>

              <div
                ref={categoryAnchorZoneRef}
                className="home-v2-nav-category-links"
                data-mega-anchor-zone="categories"
              >
                {categoryLinks.map((item) => {
                  const to = categoryRoutes.get(item.key) ?? '/';
                  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
                  const isHighlighted = isActive || activeMegaCategoryKey === item.key;

                  return (
                    <span key={item.label} className="home-v2-nav-item">
                      <Link
                        ref={
                          item.key === 'linea-caldo'
                            ? firstNavBoundaryRef
                            : item.key === 'ricambi'
                              ? lastNavBoundaryRef
                              : undefined
                        }
                        to={to}
                        className={`home-v2-nav-category${isHighlighted ? ' home-v2-nav-category-active' : ''}`}
                        style={{ textDecoration: 'none' }}
                        aria-current={isActive ? 'page' : undefined}
                        aria-haspopup="menu"
                        aria-expanded={activeMegaCategoryKey === item.key}
                        aria-controls={`home-v2-mega-menu-${item.key}`}
                        data-mega-boundary={item.key === 'linea-caldo' ? 'start' : item.key === 'ricambi' ? 'end' : undefined}
                        data-testid={`home-v2-nav-${toStableId(item.label)}`}
                        onMouseEnter={() => setActiveMegaCategoryKey(item.key)}
                        onFocus={() => setActiveMegaCategoryKey(item.key)}
                        onKeyDown={(event) => {
                          if (event.key === 'ArrowDown') {
                            event.preventDefault();
                            setActiveMegaCategoryKey(item.key);
                          }
                        }}
                      >
                        <Icon glyph={item.icon} weight={item.iconWeight} />
                        <span className="home-v2-nav-category-label">{item.label}</span>
                        <ChevronDown className="home-v2-nav-arrow" aria-hidden="true" />
                      </Link>
                    </span>
                  );
                })}
              </div>

              <div className="home-v2-nav-right-links">
                {rightLinks.map((item) => {
                  const isActive =
                    location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);

                  return (
                    <span key={item.label} className="home-v2-nav-item">
                      <Link
                        ref={undefined}
                        to={item.to}
                        className={`home-v2-nav-link${isActive ? ' home-v2-nav-link-active' : ''}`}
                        style={{ textDecoration: 'none' }}
                        aria-current={isActive ? 'page' : undefined}
                        data-testid={`home-v2-nav-${toStableId(item.label)}`}
                        onMouseEnter={() => setActiveMegaCategoryKey(null)}
                      >
                        {item.label}
                      </Link>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {mobileCatalogOpen && (
          <div
            id="home-v2-mobile-catalog-panel"
            className="home-v2-mobile-catalog-panel"
            data-testid="home-v2-mobile-catalog-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-v2-mobile-catalog-title"
          >
            <div className="home-v2-mobile-catalog-header">
              <p id="home-v2-mobile-catalog-title" className="home-v2-mobile-catalog-title">Categorie</p>
              <button
                ref={mobileCatalogCloseRef}
                type="button"
                className="home-v2-mobile-catalog-close"
                onClick={() => closeMobileCatalog(true)}
              >
                Chiudi menu
              </button>
            </div>

            <div className="home-v2-mobile-catalog-list">
              {categoryLinks.map((item) => {
                const category = categoryByKey.get(item.key);
                const to = categoryRoutes.get(item.key) ?? '/';
                const isExpanded = mobileExpandedCategoryKey === item.key;

                return (
                  <div key={item.key} className="home-v2-mobile-catalog-item">
                    <div className="home-v2-mobile-catalog-item-row">
                      <Link
                        to={to}
                        className="home-v2-mobile-catalog-item-link"
                        onClick={() => closeMobileCatalog()}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        className="home-v2-mobile-catalog-expand"
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? `Comprimi ${item.label}` : `Espandi ${item.label}`}
                        onClick={() =>
                          setMobileExpandedCategoryKey((prev) => {
                            const next = prev === item.key ? null : item.key;
                            trackUxEvent('mobile_catalog_expand', {
                              categoryKey: item.key,
                              expanded: next === item.key,
                            });
                            return next;
                          })
                        }
                      >
                        {isExpanded ? 'Indietro' : 'Apri sottocategorie'}
                      </button>
                    </div>

                    {isExpanded && category && (
                      <div className="home-v2-mobile-catalog-groups">
                        {category.groups.map((group) => (
                          <div key={group.slug} className="home-v2-mobile-catalog-group">
                            <Link
                              to={`/categoria/${category.key}/${group.slug}`}
                              className="home-v2-mobile-catalog-group-link"
                              onClick={() => closeMobileCatalog()}
                            >
                              {group.title}
                            </Link>
                            <div className="home-v2-mobile-catalog-sections">
                              {group.sections.map((section) => (
                                <Link
                                  key={section.slug}
                                  to={`/categoria/${category.key}/${group.slug}/${section.slug}`}
                                  className="home-v2-mobile-catalog-section-link"
                                  onClick={() => closeMobileCatalog()}
                                >
                                  {section.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeMegaCategory && (
          <div
            id={`home-v2-mega-menu-${activeMegaCategory.key}`}
            className="home-v2-mega-menu-shell"
            style={megaMenuInlineStyle}
            data-testid="home-v2-mega-menu"
            role="menu"
            aria-label={`Sottocategorie ${activeMegaCategory.label}`}
          >
            <div className="home-v2-mega-menu" data-node-id="4565:15302">
              <div className="home-v2-mega-menu-grid" data-node-id="4565:15303">
                {activeMegaCategory.groups.map((group) => (
                  <div key={group.slug} className="home-v2-mega-menu-group">
                    <Link
                      to={`/categoria/${activeMegaCategory.key}/${group.slug}`}
                      className="home-v2-mega-menu-group-title"
                      onClick={() => setActiveMegaCategoryKey(null)}
                    >
                      {group.title}
                    </Link>

                    <ul className="home-v2-mega-menu-sections">
                      {group.sections.map((section) => (
                        <li key={section.slug}>
                          <Link
                            to={`/categoria/${activeMegaCategory.key}/${group.slug}/${section.slug}`}
                            className="home-v2-mega-menu-section-link"
                            onClick={() => setActiveMegaCategoryKey(null)}
                          >
                            {section.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
