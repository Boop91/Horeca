/* ═══════════════════════════════════════════════════════════════════════════
 *  Header.tsx — Navbar orizzontale completa (NO hamburger)
 *
 *  Struttura (3 righe):
 *    1. Barra verde "Vendita riservata a P.IVA"
 *    2. Logo BIANCHI + Barra ricerca + Icone (account, preferiti, carrello)
 *    3. Menu categorie orizzontale con icone + mega menu al hover
 *       - Include: Home, La nostra Azienda, [catalogo], Domande Frequenti, Contattaci
 *       - Su mobile: scrollabile orizzontalmente
 * ═══════════════════════════════════════════════════════════════════════════ */

import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Flame,
  Snowflake,
  ChefHat,
  Package,
  Hotel,
  ShieldPlus,
  Wrench,
  ChevronRight,
  Shield,
  LogOut,
  Home,
  Building2,
  HelpCircle,
  Phone,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { catalogMenu } from '../data/catalogMenu';
import type { CatalogMenuItem, CatalogGroup } from '../data/catalogMenu';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  favoritesCount: number;
  onFavoritesClick: () => void;
}

/* Mappa icone per le categorie del catalogo */
const iconByKey: Record<string, typeof Flame> = {
  'linea-caldo': Flame,
  'linea-freddo': Snowflake,
  preparazione: ChefHat,
  'carrelli-arredo': Package,
  hotellerie: Hotel,
  igiene: ShieldPlus,
  ricambi: Wrench,
  'seconda-scelta': Package,
};

export default function Header({
  cartItemCount,
  onCartClick,
  favoritesCount,
  onFavoritesClick,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const { setAuthModalOpen } = useUI();
  const navigate = useNavigate();
  const location = useLocation();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeCatalogKey, setActiveCatalogKey] = useState<string | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const megaMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Chiudi menu al click fuori */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) {
        setUserMenuOpen(false);
        setActiveCatalogKey(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Chiudi menu al cambio rotta */
  useEffect(() => {
    setActiveCatalogKey(null);
    setUserMenuOpen(false);
  }, [location.pathname]);

  /* Cleanup timeout */
  useEffect(() => {
    return () => {
      if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    };
  }, []);

  const isPro = user?.role === 'pro';
  const isAdmin = user?.role === 'admin';

  /* Mega menu hover handlers */
  const activeCatalog: CatalogMenuItem | null =
    catalogMenu.find((item) => item.key === activeCatalogKey) ?? null;

  const handleCategoryEnter = useCallback((key: string) => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setActiveCatalogKey(key);
  }, []);

  const handleCategoryLeave = useCallback(() => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveCatalogKey(null);
    }, 150);
  }, []);

  const handleMegaMenuEnter = useCallback(() => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
  }, []);

  const handleMegaMenuLeave = useCallback(() => {
    setActiveCatalogKey(null);
  }, []);

  const handleAccountClick = () => {
    if (user) {
      setUserMenuOpen(!userMenuOpen);
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-white shadow-md">
      {/* ═══════════════════════════════════════════
       *  RIGA 1 — Barra verde "Vendita riservata a P.IVA"
       * ═══════════════════════════════════════════ */}
      <div className="bg-green-500 py-1.5 text-center text-xs font-semibold tracking-wide text-white">
        Vendita riservata solo a possessori di Partita IVA
      </div>

      {/* ═══════════════════════════════════════════
       *  RIGA 2 — Logo + Search + Icone
       * ═══════════════════════════════════════════ */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">
            {/* Logo BIANCHI */}
            <Link to="/" className="flex-shrink-0 transition-opacity hover:opacity-80">
              <div className="border-t-[3px] border-green-500 pt-1">
                <span className="text-2xl font-black tracking-tight text-gray-900">
                  BIANCHI
                </span>
              </div>
            </Link>

            {/* Barra di ricerca centrale */}
            <div className="mx-4 hidden flex-1 items-center sm:flex" style={{ maxWidth: '520px' }}>
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cerca prodotti, categorie, marchi..."
                  className="w-full rounded-l-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm font-medium text-gray-800 placeholder-gray-400 transition-colors focus:border-green-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-200"
                />
                <button className="absolute right-0 top-0 h-full rounded-r-lg bg-green-500 px-6 text-sm font-bold text-white transition-colors hover:bg-green-600">
                  Cerca
                </button>
              </div>
            </div>

            {/* Icone azioni: Account, Preferiti, Carrello */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Account */}
              <button
                onClick={handleAccountClick}
                className={`relative flex items-center justify-center rounded-full p-2.5 transition-colors ${
                  user
                    ? isPro
                      ? 'text-amber-600 hover:bg-amber-50'
                      : isAdmin
                        ? 'text-gray-600 hover:bg-gray-100'
                        : 'text-green-600 hover:bg-green-50'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
                aria-label="Account"
              >
                <User className="h-5 w-5" />
                {user && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                )}
              </button>

              {/* Preferiti */}
              <button
                onClick={onFavoritesClick}
                className="relative p-2.5 text-gray-500 transition-colors hover:text-gray-900"
                aria-label="Preferiti"
              >
                <Heart
                  className={`h-5 w-5 ${
                    favoritesCount > 0 ? 'fill-rose-400 text-rose-500' : ''
                  }`}
                />
                {favoritesCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-bold text-white shadow-sm">
                    {favoritesCount}
                  </span>
                )}
              </button>

              {/* Carrello */}
              <button
                onClick={onCartClick}
                className="relative p-2.5 text-gray-500 transition-colors hover:text-gray-900"
                aria-label="Carrello"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-green-500 px-1 text-xs font-bold text-white shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Dropdown menu utente */}
            {userMenuOpen && user && (
              <div className="absolute right-4 top-[100px] z-50 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                <div
                  className={`p-3 ${
                    isPro
                      ? 'bg-amber-50'
                      : isAdmin
                        ? 'bg-gray-50'
                        : 'bg-green-50'
                  }`}
                >
                  <p className="text-sm font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">
                    {isPro ? 'Account Pro' : isAdmin ? 'Admin' : 'Cliente'}
                  </p>
                </div>
                <div className="p-1">
                  <Link
                    to="/account"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
                  >
                    <User className="h-4 w-4 text-gray-500" />
                    Il mio account
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
                    >
                      <Shield className="h-4 w-4 text-gray-500" />
                      Pannello Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                      navigate('/');
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Esci
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
       *  RIGA 3 — Menu categorie orizzontale (sfondo chiaro)
       *  Scrollabile su mobile, fisso su desktop
       * ═══════════════════════════════════════════ */}
      <nav className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
          <ul className="flex items-center overflow-x-auto scrollbar-hide">
            {/* Home */}
            <li className="flex-shrink-0">
              <Link
                to="/"
                className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors ${
                  location.pathname === '/'
                    ? 'bg-green-500 text-white rounded-md my-1'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </li>

            {/* La nostra Azienda */}
            <li className="flex-shrink-0">
              <Link
                to="/chi-siamo"
                className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors ${
                  location.pathname === '/chi-siamo'
                    ? 'bg-green-500 text-white rounded-md my-1'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                <Building2 className="h-4 w-4" />
                <span>La nostra Azienda</span>
              </Link>
            </li>

            {/* Separatore sottile */}
            <li className="flex-shrink-0 mx-1 h-5 w-px bg-gray-300" aria-hidden="true" />

            {/* Categorie catalogo con mega menu */}
            {catalogMenu.map(({ key, label }) => {
              const Icon = iconByKey[key] || Package;
              const isActive = activeCatalogKey === key;
              const isCurrentPage = location.pathname.startsWith(`/categoria/${key}`);

              return (
                <li
                  key={key}
                  className="relative flex-shrink-0"
                  onMouseEnter={() => handleCategoryEnter(key)}
                  onMouseLeave={handleCategoryLeave}
                >
                  <Link
                    to={`/categoria/${key}`}
                    onClick={() => setActiveCatalogKey(null)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors ${
                      isActive || isCurrentPage
                        ? 'bg-green-500 text-white rounded-md my-1'
                        : 'text-gray-700 hover:text-green-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                    <ChevronRight className={`h-3 w-3 ${isActive || isCurrentPage ? 'text-white/80' : 'text-gray-400'}`} />
                  </Link>
                </li>
              );
            })}

            {/* Separatore sottile */}
            <li className="flex-shrink-0 mx-1 h-5 w-px bg-gray-300" aria-hidden="true" />

            {/* Domande Frequenti */}
            <li className="flex-shrink-0">
              <Link
                to="/faq"
                className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors ${
                  location.pathname === '/faq'
                    ? 'bg-green-500 text-white rounded-md my-1'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                <HelpCircle className="h-4 w-4" />
                <span>Domande Frequenti</span>
              </Link>
            </li>

            {/* Contattaci */}
            <li className="flex-shrink-0">
              <Link
                to="/contatti"
                className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors ${
                  location.pathname === '/contatti'
                    ? 'bg-green-500 text-white rounded-md my-1'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                <Phone className="h-4 w-4" />
                <span>Contattaci</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
       *  MEGA MENU — Pannello dropdown al hover sulle categorie
       * ═══════════════════════════════════════════ */}
      {activeCatalog && (
        <div
          className="absolute left-0 right-0 z-40 border-b border-gray-200 bg-white shadow-lg"
          onMouseEnter={handleMegaMenuEnter}
          onMouseLeave={handleMegaMenuLeave}
        >
          <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
            {/* Intestazione mega menu */}
            <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {activeCatalog.label}
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  {activeCatalog.description}
                </p>
              </div>
              <Link
                to={`/categoria/${activeCatalog.slug}`}
                onClick={() => setActiveCatalogKey(null)}
                className="whitespace-nowrap text-xs font-semibold text-green-600 transition-colors hover:text-green-700 hover:underline"
              >
                Vedi tutto &rarr;
              </Link>
            </div>

            {/* Griglia dei gruppi */}
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activeCatalog.groups.map((group: CatalogGroup) => (
                <div key={group.slug}>
                  <Link
                    to={`/categoria/${activeCatalog.slug}/${group.slug}`}
                    onClick={() => setActiveCatalogKey(null)}
                    className="inline-block border-b-2 border-green-500 pb-1 text-sm font-bold text-gray-900 transition-colors hover:text-green-600"
                  >
                    {group.title}
                  </Link>
                  <ul className="mt-2.5 space-y-1">
                    {group.sections.map((section) => (
                      <li key={section.slug}>
                        <Link
                          to={`/categoria/${activeCatalog.slug}/${group.slug}/${section.slug}`}
                          onClick={() => setActiveCatalogKey(null)}
                          className="block py-0.5 text-[13px] text-gray-600 transition-all hover:pl-1 hover:text-green-600"
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

      {/* Linea accento inferiore */}
      <div className="h-[2px] bg-green-600" />
    </header>
  );
}
