/**
 * @file App.tsx
 * @description Componente radice dell'applicazione bianchipro.it.
 *
 * Responsabilità principali:
 *   1. Definire la gerarchia dei Provider (contesti globali)
 *   2. Dichiarare tutte le rotte dell'applicazione tramite React Router v6
 *
 * Ordine di annidamento dei Provider (dall'esterno verso l'interno):
 *   AuthProvider   → gestione autenticazione utente
 *   CartProvider   → stato del carrello (può dipendere da Auth)
 *   FavoritesProvider → lista preferiti dell'utente
 *   UIProvider     → stato visuale globale (drawer aperti, modale login, ecc.)
 *
 * Mappa delle rotte:
 *   /                                → HomePage (pagina principale)
 *   /categoria/:slug                 → CategoryPage (lista prodotti per categoria)
 *   /categoria/:slug/:sottocategoria → CategoryPage (sotto-categoria)
 *   /categoria/:slug/:sotto/:foglia  → CategoryPage (categoria foglia, 3° livello)
 *   /prodotto/:slug                  → ProductPage (scheda prodotto singolo)
 *   /per-attivita/:mestiere          → BusinessTypePage (prodotti per tipo di attività)
 *   /carrello                        → CartPage (riepilogo carrello)
 *   /checkout                        → CheckoutPage (pagamento)
 *   /account, /account/*             → AccountPage (area personale utente)
 *   /admin, /admin/*                 → AdminDashboard (pannello amministrazione)
 *   /wallet                          → WalletPage (saldo / crediti)
 *   /guide, /guide/:slug             → GuidesPage / GuidePage (articoli / guide)
 *   /chi-siamo                       → AboutPage
 *   /contatti                        → ContactPage
 *   /faq                             → FaqPage
 *   /glossario                       → GlossaryPage
 *   /condizioni-vendita              → TermsPage
 *   * (qualsiasi altro percorso)     → NotFoundPage (errore 404)
 *
 * Tutte le rotte sono figli di <Layout />, che fornisce Header, Footer,
 * drawer carrello/preferiti e modale autenticazione.
 *
 * @see Layout.tsx — layout condiviso con Outlet
 * @see main.tsx  — punto di ingresso dove viene montato <BrowserRouter>
 */

import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { UIProvider } from './contexts/UIContext';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import ProductPage from './pages/ProductPage';
import BusinessTypePage from './pages/BusinessTypePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './components/auth/AccountPage';
import AdminDashboard from './components/admin/AdminDashboard';
import WalletPage from './components/wallet/WalletPage';
import GuidesPage from './pages/GuidesPage';
import GuidePage from './pages/GuidePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import GlossaryPage from './pages/GlossaryPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Componente principale dell'app.
 * Non gestisce stato proprio: delega tutto ai Provider e al routing.
 */
export default function App() {
  return (
    // ── Provider globali ──────────────────────────────────────────
    // L'ordine è importante: i provider interni possono accedere a quelli esterni.
    // Esempio: CartProvider può leggere l'utente da AuthProvider.
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <UIProvider>
            {/* ── Definizione rotte ────────────────────────────── */}
            <Routes>
              {/* Layout condiviso: Header + Footer + Drawer + Modale Auth */}
              <Route element={<Layout />}>

                {/* ── Pagina principale ── */}
                <Route index element={<HomePage />} />

                {/* ── Catalogo: navigazione per categoria fino a 3 livelli ── */}
                <Route path="categoria/:slug" element={<CategoryPage />} />
                <Route path="categoria/:slug/:sottocategoria" element={<CategoryPage />} />
                <Route path="categoria/:slug/:sottocategoria/:foglia" element={<CategoryPage />} />

                {/* ── Scheda prodotto singolo ── */}
                <Route path="prodotto/:slug" element={<ProductPage />} />

                {/* ── Pagine per tipo di attività (es. ristorante, bar, hotel) ── */}
                <Route path="per-attivita/:mestiere" element={<BusinessTypePage />} />

                {/* ── Carrello e processo di checkout ── */}
                <Route path="carrello" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />

                {/* ── Area account utente (con sotto-rotte interne) ── */}
                <Route path="account" element={<AccountPage />} />
                <Route path="account/*" element={<AccountPage />} />

                {/* ── Pannello amministrazione (con sotto-rotte interne) ── */}
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/*" element={<AdminDashboard />} />

                {/* ── Wallet / crediti utente ── */}
                <Route path="wallet" element={<WalletPage />} />

                {/* ── Sezione guide e articoli ── */}
                <Route path="guide" element={<GuidesPage />} />
                <Route path="guide/:slug" element={<GuidePage />} />

                {/* ── Pagine statiche informative ── */}
                <Route path="chi-siamo" element={<AboutPage />} />
                <Route path="contatti" element={<ContactPage />} />
                <Route path="faq" element={<FaqPage />} />
                <Route path="glossario" element={<GlossaryPage />} />
                <Route path="condizioni-vendita" element={<TermsPage />} />

                {/* ── Fallback 404: qualsiasi URL non riconosciuto ── */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </UIProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
