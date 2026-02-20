import {
  Building2,
  ChevronRight,
  Flame,
  Heart,
  LayoutGrid,
  Search,
  ShoppingCart,
  Snowflake,
  SprayCan,
  User,
  UtensilsCrossed,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { catalogMenu } from '../data/catalogMenu';

const logoIcon = 'https://www.figma.com/api/mcp/asset/a0279feb-6f64-40f7-a6d4-487a25fbbb31';

type CategoryKey =
  | 'linea-caldo'
  | 'linea-freddo'
  | 'preparazione'
  | 'carrelli-arredo'
  | 'hotellerie'
  | 'igiene'
  | 'ricambi';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  favoritesCount: number;
  onFavoritesClick: () => void;
}

const categoryIcons: Record<CategoryKey, LucideIcon> = {
  'linea-caldo': Flame,
  'linea-freddo': Snowflake,
  preparazione: UtensilsCrossed,
  'carrelli-arredo': LayoutGrid,
  hotellerie: Building2,
  igiene: SprayCan,
  ricambi: Wrench,
};

const navItems: Array<
  | { label: string; to: string; type: 'link' }
  | { label: string; key: CategoryKey; type: 'category' }
> = [
  { label: 'Home', to: '/', type: 'link' },
  { label: 'La nostra Azienda', to: '/chi-siamo', type: 'link' },
  { label: 'Linea Caldo', key: 'linea-caldo', type: 'category' },
  { label: 'Linea Freddo', key: 'linea-freddo', type: 'category' },
  { label: 'Preparazione', key: 'preparazione', type: 'category' },
  { label: 'Carrelli ed Arredo', key: 'carrelli-arredo', type: 'category' },
  { label: 'Hotellerie', key: 'hotellerie', type: 'category' },
  { label: 'Cura ed Igiene', key: 'igiene', type: 'category' },
  { label: 'Ricambi', key: 'ricambi', type: 'category' },
  { label: 'Domande Frequenti', to: '/faq', type: 'link' },
  { label: 'Contatti', to: '/contatti', type: 'link' },
];

export default function Header({
  cartItemCount,
  onCartClick,
  favoritesCount,
  onFavoritesClick,
}: HeaderProps) {
  const { user } = useAuth();
  const { setAuthModalOpen } = useUI();
  const navigate = useNavigate();
  const location = useLocation();

  const categoryRoutes = useMemo(
    () => new Map(catalogMenu.map((category) => [category.key, `/categoria/${category.slug}`])),
    [],
  );

  const onAccountClick = () => {
    if (user) {
      navigate('/account');
      return;
    }

    setAuthModalOpen(true);
  };

  return (
    <header className="relative z-50 bg-[#f2f4f6]" data-node-id="7718:6629">
      <div className="mx-auto flex min-h-[90px] w-full max-w-7xl flex-wrap items-center gap-x-4 gap-y-4 px-4 py-[20px] sm:px-6 lg:flex-nowrap lg:px-[24px]">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3 text-[#20252b] transition-opacity hover:opacity-90"
        >
          <div className="h-12 w-12 overflow-hidden rounded-full">
            <img src={logoIcon} alt="Bianchi logo" className="h-full w-full object-contain" />
          </div>
          <span className="font-['Manrope'] text-[30px] font-normal leading-[36px] tracking-[0.75px]">
            BIANCHI
          </span>
        </Link>

        <div className="order-3 w-full lg:order-2 lg:flex-1 lg:px-[32px]">
          <div className="mx-auto w-full max-w-[736px]">
            <div className="relative flex items-center rounded-full border border-[#d1d5db] bg-white px-[9px] py-[5px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
              <div className="relative min-w-0 flex-1 pl-[40px] pr-[16px] py-[12px]">
                <Search className="pointer-events-none absolute left-[11px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#16a34a]" />
                <input
                  type="text"
                  placeholder="Cerca nel catalogo"
                  className="w-full border-none bg-transparent font-['Manrope'] text-[14px] font-normal leading-[normal] text-[#20252b] outline-none placeholder:text-[#6b7280]"
                />
              </div>
              <button
                type="button"
                className="h-[40px] rounded-full bg-[#28a745] px-[32px] font-['Manrope'] text-[16px] font-normal leading-[24px] text-white transition-colors hover:bg-[#23933f]"
              >
                Cerca
              </button>
            </div>
          </div>
        </div>

        <div className="order-2 ml-auto flex w-[120px] shrink-0 items-center justify-between gap-[24px] text-[#20252b] lg:order-3">
          <button
            onClick={onAccountClick}
            className="flex h-8 w-[21px] items-center justify-center"
            aria-label="Account"
            type="button"
          >
            <User className="h-6 w-6" strokeWidth={1.9} />
          </button>

          <button
            type="button"
            onClick={onFavoritesClick}
            className="relative flex h-8 w-6 items-center justify-center"
            aria-label="Preferiti"
          >
            <Heart className={`h-6 w-6 ${favoritesCount > 0 ? 'fill-[#20252b]' : ''}`} strokeWidth={1.9} />
          </button>

          <button
            type="button"
            onClick={onCartClick}
            className="relative flex h-8 w-[27px] items-center justify-center"
            aria-label="Carrello"
          >
            <ShoppingCart className="h-6 w-6" strokeWidth={1.9} />
            {cartItemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex min-w-[18px] items-center justify-center rounded-full bg-[#16a34a] px-1 text-[10px] font-semibold text-white">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <nav className="border-y border-[#d1d5db] bg-[#efefef] px-4 py-px sm:px-6" data-node-id="7718:6654">
        <ul
          className="mx-auto flex w-full max-w-7xl items-center justify-start gap-x-6 overflow-x-auto py-[12px] text-[#4a4a4a] lg:justify-center"
          style={{ scrollbarWidth: 'none' }}
        >
          {navItems.map((item) => {
            if (item.type === 'link') {
              const isActive =
                item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);

              return (
                <li key={item.label} className="shrink-0">
                  <Link
                    to={item.to}
                    className={`font-['Manrope'] text-[13px] font-normal leading-[19.5px] whitespace-nowrap transition-colors hover:text-[#20252b] ${
                      isActive ? 'text-[#20252b]' : 'text-[#4a4a4a]'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }

            const Icon = categoryIcons[item.key];
            const to = categoryRoutes.get(item.key) ?? '/';
            const isActive = location.pathname.startsWith(to);

            return (
              <li key={item.label} className="shrink-0">
                <Link
                  to={to}
                  className={`inline-flex items-center gap-1 font-['Manrope'] text-[13px] font-normal leading-[19.5px] whitespace-nowrap transition-colors hover:text-[#20252b] ${
                    isActive ? 'text-[#20252b]' : 'text-[#4a4a4a]'
                  }`}
                >
                  <Icon className="h-[13px] w-[13px]" strokeWidth={1.8} />
                  <span>{item.label}</span>
                  <ChevronRight className="h-[10px] w-[10px]" strokeWidth={2.3} />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
