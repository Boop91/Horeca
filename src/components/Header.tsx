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
  ChevronDown,
  Wallet,
  Shield,
  Crown,
  LogOut,
} from 'lucide-react';
import { type User as UserType, useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { catalogMenu } from '../data/catalogMenu';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  favoritesCount: number;
  onFavoritesClick: () => void;
  onAccountClick: () => void;
  onLogoClick: () => void;
  user: UserType | null;
  currentPage: string;
  onNavigate: (page: string) => void;
  onCategorySelect: (categoryKey: string) => void;
}

const iconByKey = {
  'linea-caldo': Flame,
  'linea-freddo': Snowflake,
  preparazione: ChefHat,
  'carrelli-arredo': Package,
  hotellerie: Hotel,
  igiene: ShieldPlus,
  ricambi: Wrench,
  'seconda-scelta': Package,
};

export default function Header({ cartItemCount, onCartClick, favoritesCount, onFavoritesClick, onAccountClick, onLogoClick, user, currentPage, onNavigate, onCategorySelect }: HeaderProps) {
  const { logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeCatalogKey, setActiveCatalogKey] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

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

  const isPro = user?.role === 'pro';
  const isAdmin = user?.role === 'admin';
  const activeCatalog = catalogMenu.find(item => item.key === activeCatalogKey) || null;

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-slate-300 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.10)]">
      <div className="h-1 bg-orange-500" />
      <div className="border-b border-emerald-200 bg-emerald-50 py-1 text-center text-[11px] font-semibold tracking-wide text-emerald-900">
        Vendita riservata solo a possessori di Partita IVA
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-3">
          <button onClick={onLogoClick} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">BIANCHI PRO</span>
          </button>

          <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input type="text" placeholder="Cerca nel catalogo" className="w-full pl-10 pr-20 py-2.5 bg-white border border-slate-300 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400" />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors">Cerca</button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={() => onNavigate('wallet')} className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${currentPage === 'wallet' ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Wallet className="w-4 h-4" /> <span>Wallet</span>
              {user && <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{user.walletBalance.toFixed(0)}</span>}
            </button>

            <button onClick={() => user ? setUserMenuOpen(!userMenuOpen) : onAccountClick()} className={`relative flex items-center justify-center transition-colors p-1.5 rounded-full ${user ? (isPro ? 'text-amber-600 hover:bg-amber-50' : isAdmin ? 'text-slate-700 hover:bg-slate-100' : 'text-emerald-600 hover:bg-emerald-50') : 'text-slate-700 hover:text-slate-900'}`} aria-label="Account">
              <User className="w-5 h-5" />
              {user && <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />}
            </button>

            <button onClick={onFavoritesClick} className="text-slate-700 hover:text-slate-900 transition-colors relative" aria-label="Preferiti">
              <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-rose-400 text-rose-500' : ''}`} />
              {favoritesCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">{favoritesCount}</span>}
            </button>

            <button onClick={onCartClick} className="text-slate-700 hover:text-slate-900 relative transition-colors" aria-label="Carrello">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">{cartItemCount}</span>}
            </button>

            {userMenuOpen && user && (
              <div className="absolute right-4 top-[72px] w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                <div className={`p-3 ${isPro ? 'bg-amber-50' : isAdmin ? 'bg-slate-50' : 'bg-emerald-50'}`}>
                  <p className="text-sm font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{isPro ? 'Account Pro' : isAdmin ? 'Admin' : 'Cliente'}</p>
                </div>
                <div className="p-1">
                  <button onClick={() => { onNavigate('account'); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"><User className="w-4 h-4 text-gray-400" />Il mio account</button>
                  <button onClick={() => { logout(); setUserMenuOpen(false); onNavigate('home'); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"><LogOut className="w-4 h-4" />Esci</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="hidden md:flex items-center justify-center gap-1 py-2 overflow-x-auto">
            {catalogMenu.map(({ key, label }) => {
              const Icon = iconByKey[key as keyof typeof iconByKey] || Package;
              const isActive = activeCatalogKey === key;
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => {
                      onCategorySelect(key);
                      setActiveCatalogKey((prev) => prev === key ? null : key);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${isActive ? 'bg-slate-900 text-white' : 'text-slate-800 hover:bg-slate-100'}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 ${isActive ? 'text-slate-200' : 'text-slate-500'}`} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
      <div className="h-1 bg-teal-700" />

      {activeCatalog && (
        <div className="hidden md:block border-t border-slate-200 bg-white shadow-lg">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <h3 className="text-sm font-bold text-slate-900">{activeCatalog.label}</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeCatalog.groups.flatMap(group => group.sections).map(section => (
                <button
                  key={section.title}
                  type="button"
                  onClick={() => onCategorySelect(activeCatalog.key)}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <p className="text-sm font-semibold text-slate-800">{section.title}</p>
                  <ul className="mt-2 space-y-1">
                    {section.items.slice(0, 6).map(item => (
                      <li key={item} className="text-xs text-slate-600">• {item}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
