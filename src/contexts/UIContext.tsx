/**
 * @file UIContext.tsx
 * @description Contesto React per la gestione dello stato visuale (UI) globale.
 *
 * Gestisce l'apertura / chiusura di elementi overlay che possono essere
 * attivati da qualsiasi punto dell'applicazione:
 *   - Drawer del carrello (pannello laterale)
 *   - Drawer dei preferiti (pannello laterale)
 *   - Modale di autenticazione (login / registrazione)
 *
 * Questo contesto evita il "prop drilling": qualsiasi componente figlio
 * può aprire/chiudere un overlay senza dover passare callback attraverso
 * molti livelli di componenti.
 *
 * Utilizzato principalmente da:
 *   - Layout.tsx (legge lo stato per controllare i drawer e la modale)
 *   - Header.tsx (apre il carrello e i preferiti al click sulle icone)
 *   - Pulsanti "Accedi" sparsi nell'app (aprono la modale auth)
 */

import { createContext, useContext, useState, type ReactNode } from 'react';

// ── Tipo del contesto ─────────────────────────────────────────────
/**
 * Definisce lo stato UI globale: per ogni overlay c'è un booleano
 * e la funzione setter corrispondente.
 */
interface UIContextType {
  /** true quando il drawer del carrello è aperto */
  cartOpen: boolean;
  /** Apre o chiude il drawer del carrello */
  setCartOpen: (open: boolean) => void;
  /** true quando il drawer dei preferiti è aperto */
  favoritesOpen: boolean;
  /** Apre o chiude il drawer dei preferiti */
  setFavoritesOpen: (open: boolean) => void;
  /** true quando la modale di autenticazione è visibile */
  authModalOpen: boolean;
  /** Apre o chiude la modale di autenticazione */
  setAuthModalOpen: (open: boolean) => void;
}

// Contesto inizializzato a null; verrà valorizzato dal Provider
const UIContext = createContext<UIContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────
/**
 * Provider dello stato UI. Va posizionato in App.tsx come provider
 * più interno (dopo Auth, Cart e Favorites).
 *
 * @param children — componenti figli che avranno accesso al contesto
 */
export function UIProvider({ children }: { children: ReactNode }) {
  // Tutti i drawer e modali partono chiusi (false)
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <UIContext.Provider value={{
      cartOpen, setCartOpen,
      favoritesOpen, setFavoritesOpen,
      authModalOpen, setAuthModalOpen,
    }}>
      {children}
    </UIContext.Provider>
  );
}

// ── Hook personalizzato ───────────────────────────────────────────
/**
 * Hook per accedere allo stato UI globale.
 * Deve essere usato all'interno di un <UIProvider>.
 *
 * @returns oggetto con cartOpen, favoritesOpen, authModalOpen e i rispettivi setter
 * @throws Error se usato fuori dal UIProvider
 */
export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
