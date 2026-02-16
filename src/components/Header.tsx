import {
  Search, User, Heart, ShoppingCart, ChevronRight, Shield, LogOut,
  Flame, Snowflake, UtensilsCrossed, LayoutGrid, Building2, SprayCan, Wrench, Tag,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { catalogMenu } from '../data/catalogMenu';
import type { CatalogMenuItem } from '../data/catalogMenu';

const categoryIcons: Record<string, LucideIcon> = {
  'linea-caldo': Flame,
  'linea-freddo': Snowflake,
  'preparazione': UtensilsCrossed,
  'carrelli-arredo': LayoutGrid,
  'hotellerie': Building2,
  'igiene': SprayCan,
  'ricambi': Wrench,
  'seconda-scelta': Tag,
};

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  favoritesCount: number;
  onFavoritesClick: () => void;
}

export default function Header({
  cartItemCount, onCartClick, favoritesCount, onFavoritesClick,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const { setAuthModalOpen } = useUI();
  const navigate = useNavigate();
  const location = useLocation();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeCatalogKey, setActiveCatalogKey] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const megaRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isPro = user?.role === 'pro';
  const isAdmin = user?.role === 'admin';
  const shortName = user?.name ? user.name.split(' ')[0].slice(0, 10) : null;

  const activeCatalog: CatalogMenuItem | null =
    catalogMenu.find((c) => c.key === activeCatalogKey) ?? null;

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) {
        setUserMenuOpen(false);
        setActiveCatalogKey(null);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    setActiveCatalogKey(null);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => () => { if (megaRef.current) clearTimeout(megaRef.current); }, []);

  const catEnter = useCallback((key: string) => {
    if (megaRef.current) { clearTimeout(megaRef.current); megaRef.current = null; }
    setActiveCatalogKey(key);
  }, []);

  const catLeave = useCallback(() => {
    megaRef.current = setTimeout(() => setActiveCatalogKey(null), 120);
  }, []);

  const megaEnter = useCallback(() => {
    if (megaRef.current) { clearTimeout(megaRef.current); megaRef.current = null; }
  }, []);

  const megaLeave = useCallback(() => setActiveCatalogKey(null), []);

  const onAccount = () => {
    if (user) setUserMenuOpen(!userMenuOpen);
    else setAuthModalOpen(true);
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-50 shadow-md">

      {/* ── ROW 1: barra verde top ── */}
      <div className="bg-green-600 py-1 text-center text-[11px] font-semibold tracking-wide text-white">
        Vendita riservata solo a possessori di Partita IVA
      </div>

      {/* ── ROW 2: logo + search + icone ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto flex max-w-[1100px] items-center gap-8 px-6 py-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 hover:opacity-80 transition-opacity">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg viewBox="0 0 48 48" className="absolute inset-0 w-full h-full">
                <path d="M8 36 A20 20 0 0 1 24 4" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M24 4 A20 20 0 0 1 33 8" fill="none" stroke="#e5e7eb" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M33 8 A20 20 0 0 1 40 16" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
              <span className="text-xl font-black text-gray-900">B.</span>
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">BIANCHI</span>
          </Link>

          {/* Search — centrata, dimensione giusta */}
          <div className="hidden flex-1 sm:block" style={{ maxWidth: 480 }}>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca nel catalogo"
                className="h-10 w-full rounded-full border border-gray-300 bg-gray-50 pl-11 pr-24 text-sm text-gray-800 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
              />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 rounded-full bg-green-600 px-5 text-xs font-bold text-white hover:bg-green-700 transition-colors">
                Cerca
              </button>
            </div>
          </div>

          {/* Icons — destra */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Account */}
            <div className="relative" ref={userMenuRef}>
              <button onClick={onAccount} className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                <User className="h-5 w-5" />
                {user && shortName && <span className="hidden text-xs font-semibold sm:inline">{shortName}</span>}
              </button>
              {userMenuOpen && user && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                  <div className={`p-3 ${isPro ? 'bg-amber-50' : isAdmin ? 'bg-gray-50' : 'bg-green-50'}`}>
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{isPro ? 'Account Pro' : isAdmin ? 'Admin' : 'Cliente'}</p>
                  </div>
                  <div className="p-1">
                    <Link to="/account" onClick={() => setUserMenuOpen(false)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="h-4 w-4 text-gray-400" /> Il mio account
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Shield className="h-4 w-4 text-gray-400" /> Pannello Admin
                      </Link>
                    )}
                    <button onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="h-4 w-4" /> Esci
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Favorites */}
            <button onClick={onFavoritesClick} className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors" aria-label="Preferiti">
              <Heart className={`h-5 w-5 ${favoritesCount > 0 ? 'fill-green-600 text-green-600' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-bold text-white">{favoritesCount}</span>
              )}
            </button>

            {/* Cart */}
            <button onClick={onCartClick} className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors" aria-label="Carrello">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-bold text-white">{cartItemCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="px-5 pb-3 sm:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Cerca nel catalogo" className="h-10 w-full rounded-full border border-gray-300 bg-gray-50 pl-10 pr-20 text-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100" />
            <button className="absolute right-1.5 top-1.5 bottom-1.5 rounded-full bg-green-600 px-4 text-xs font-bold text-white">Cerca</button>
          </div>
        </div>
      </div>

      {/* ── ROW 3: dark navigation bar ── */}
      <nav className="bg-[#2d3a4a]">
        <div className="mx-auto max-w-[1100px] px-5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <ul className="flex items-center whitespace-nowrap">
            <li>
              <Link to="/" className={`block px-3.5 py-2.5 text-[12px] font-semibold transition-colors ${location.pathname === '/' ? 'text-white' : 'text-gray-300 hover:text-white'}`}>Home</Link>
            </li>
            <li>
              <Link to="/chi-siamo" className={`block px-3.5 py-2.5 text-[12px] font-semibold transition-colors ${location.pathname === '/chi-siamo' ? 'text-white' : 'text-gray-300 hover:text-white'}`}>La nostra Azienda</Link>
            </li>

            {catalogMenu.map(({ key, label }) => {
              const open = activeCatalogKey === key;
              const current = location.pathname.startsWith(`/categoria/${key}`);
              const CatIcon = categoryIcons[key];
              return (
                <li key={key} onMouseEnter={() => catEnter(key)} onMouseLeave={catLeave}>
                  <Link
                    to={`/categoria/${key}`}
                    onClick={() => setActiveCatalogKey(null)}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[12px] font-semibold transition-colors ${open || current ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                  >
                    {CatIcon && <CatIcon className="h-3.5 w-3.5" />}
                    {label}
                    <ChevronRight className={`h-2.5 w-2.5 transition-transform ${open ? 'rotate-90' : ''}`} />
                  </Link>
                </li>
              );
            })}

            <li>
              <Link to="/faq" className={`block px-3.5 py-2.5 text-[12px] font-semibold transition-colors ${location.pathname === '/faq' ? 'text-white' : 'text-gray-300 hover:text-white'}`}>Domande Frequenti</Link>
            </li>
            <li>
              <Link to="/contatti" className={`block px-3.5 py-2.5 text-[12px] font-semibold transition-colors ${location.pathname === '/contatti' ? 'text-white' : 'text-gray-300 hover:text-white'}`}>Contattaci</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* ── MEGA MENU ── */}
      {activeCatalog && (
        <div
          className="absolute left-0 right-0 z-40 bg-[#2d3a4a] shadow-2xl"
          onMouseEnter={megaEnter}
          onMouseLeave={megaLeave}
        >
          <div className="mx-auto max-w-[1100px] px-6 py-6">
            <div className="flex flex-wrap gap-x-10 gap-y-5">
              {activeCatalog.groups.map((group) => (
                <div key={group.slug} className="min-w-[150px]">
                  <Link
                    to={`/categoria/${activeCatalog.slug}/${group.slug}`}
                    onClick={() => setActiveCatalogKey(null)}
                    className="block text-[13px] font-bold text-white mb-2.5 hover:text-green-400 transition-colors"
                  >
                    {group.title}
                  </Link>
                  <ul className="space-y-1.5">
                    {group.sections.map((s) => (
                      <li key={s.slug}>
                        <Link
                          to={`/categoria/${activeCatalog.slug}/${group.slug}/${s.slug}`}
                          onClick={() => setActiveCatalogKey(null)}
                          className="block text-[12px] text-gray-400 hover:text-white transition-colors"
                        >
                          {s.title}
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
    </header>
  );
}
