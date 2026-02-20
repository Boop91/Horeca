/**
 * @file Layout.tsx
 * @description Layout condiviso per tutte le pagine dell'applicazione.
 *
 * Questo componente viene usato come "layout route" in App.tsx:
 *   <Route element={<Layout />}> ... rotte figlie ... </Route>
 *
 * Struttura della pagina:
 *   ┌──────────────────────────┐
 *   │        Header            │  ← barra di navigazione con carrello e preferiti
 *   ├──────────────────────────┤
 *   │        <Outlet />        │  ← qui viene renderizzata la rotta figlia corrente
 *   ├──────────────────────────┤
 *   │        Footer            │  ← pie' di pagina
 *   └──────────────────────────┘
 *
 * Elementi overlay (sempre presenti, visibili solo quando aperti):
 *   - CartDrawer       → pannello laterale carrello
 *   - FavoritesDrawer  → pannello laterale preferiti
 *   - AuthModal        → modale di login / registrazione
 *   - Toaster          → notifiche toast (in basso a destra)
 *
 * Ogni overlay critico è avvolto in un <AppErrorBoundary> per evitare
 * che un errore in un drawer faccia crashare l'intera pagina.
 *
 * @see App.tsx — dove questo Layout viene montato come rotta padre
 */

import { Outlet } from 'react-router-dom';
import HomeV2Header from './home_v2/HomeV2Header';
import AppBreadcrumbs from './AppBreadcrumbs';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import FavoritesDrawer from './FavoritesDrawer';
import AuthModal from './auth/AuthModal';
import AppErrorBoundary from './AppErrorBoundary';
import { Toaster } from './ui/sonner';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useUI } from '../contexts/UIContext';

export default function Layout() {
  // ── Stato globale da contesti ──────────────────────────────────
  const { items: cartItems, removeItem, updateQuantity, clearCart } = useCart();
  const { items: favoriteItems, removeItem: removeFavorite } = useFavorites();
  const {
    cartOpen, setCartOpen,
    favoritesOpen, setFavoritesOpen,
    authModalOpen, setAuthModalOpen,
  } = useUI();

  // Conta il totale degli articoli nel carrello (sommando le quantità)
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    // Error boundary globale: cattura errori di rendering nell'intero layout
    <AppErrorBoundary>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <a href="#main-content" className="skip-link">
          Vai al contenuto principale
        </a>

        {/* ── Intestazione con navigazione, icona carrello e preferiti ── */}
        <HomeV2Header
          cartItemCount={totalCartItems}
          onCartClick={() => setCartOpen(true)}
          favoritesCount={favoriteItems.length}
          onFavoritesClick={() => setFavoritesOpen(true)}
        />

        <AppBreadcrumbs />

        {/* ── Contenuto della rotta corrente (iniettato da React Router) ── */}
        <div id="main-content" tabIndex={-1}>
          <Outlet />
        </div>

        {/* ── Pie' di pagina ── */}
        <Footer />

        {/* ── Drawer carrello (pannello laterale) ── */}
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

        {/* ── Drawer preferiti (pannello laterale) ── */}
        <FavoritesDrawer
          items={favoriteItems}
          onRemoveItem={removeFavorite}
          isExpanded={favoritesOpen}
          setIsExpanded={setFavoritesOpen}
        />

        {/* ── Modale di autenticazione (login / registrazione) ── */}
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

        {/* ── Notifiche toast globali ── */}
        <Toaster position="bottom-right" />
      </div>
    </AppErrorBoundary>
  );
}
