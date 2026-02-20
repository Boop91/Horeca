import HomeV2Header from './HomeV2Header';
import HomeV2Hero from './HomeV2Hero';
import HomeV2FeaturedTypesSection from './HomeV2FeaturedTypesSection';
import HomeV2PromoSection from './HomeV2PromoSection';
import HomeV2Products from './HomeV2Products';
import HomeV2PlusSection from './HomeV2PlusSection';
import HomeV2CategoryCards from './HomeV2CategoryCards';
import HomeV2BlogPreviews from './HomeV2BlogPreviews';
import AppErrorBoundary from '../AppErrorBoundary';
import CartDrawer from '../CartDrawer';
import FavoritesDrawer from '../FavoritesDrawer';
import AuthModal from '../auth/AuthModal';
import Footer from '../Footer';
import { Toaster } from '../ui/sonner';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useUI } from '../../contexts/UIContext';
import './HomeV2.css';

export default function HomeV2Page() {
  const { items: cartItems, removeItem, updateQuantity, clearCart } = useCart();
  const { items: favoriteItems, removeItem: removeFavorite } = useFavorites();
  const {
    cartOpen,
    setCartOpen,
    favoritesOpen,
    setFavoritesOpen,
    authModalOpen,
    setAuthModalOpen,
  } = useUI();

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <a href="#home-main-content" className="skip-link">
        Vai al contenuto principale
      </a>

      <div className="home-v2-shell">
        <HomeV2Header
          cartItemCount={totalCartItems}
          onCartClick={() => setCartOpen(true)}
          favoritesCount={favoriteItems.length}
          onFavoritesClick={() => setFavoritesOpen(true)}
        />

        <HomeV2Hero />

        <main id="home-main-content" tabIndex={-1} className="home-v2-page">
          <div className="home-v2-frame" data-node-id="7718:6849">
            <div className="home-v2-inner-column">
              <HomeV2PlusSection />
              <HomeV2FeaturedTypesSection />
              <HomeV2PromoSection />
              <HomeV2Products />
              <HomeV2CategoryCards />
              <HomeV2BlogPreviews />
            </div>
          </div>
        </main>
      </div>
      <Footer />

      <AppErrorBoundary>
        <CartDrawer
          items={cartItems}
          onRemoveItem={removeItem}
          onUpdateQuantity={updateQuantity}
          onClearCart={clearCart}
          isExpanded={cartOpen}
          setIsExpanded={setCartOpen}
        />
      </AppErrorBoundary>

      <FavoritesDrawer
        items={favoriteItems}
        onRemoveItem={removeFavorite}
        isExpanded={favoritesOpen}
        setIsExpanded={setFavoritesOpen}
      />

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <Toaster position="bottom-right" />
    </>
  );
}
