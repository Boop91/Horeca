/**
 * @file FavoritesContext.tsx
 * @description Contesto React per la gestione della lista dei preferiti (wishlist).
 *
 * Permette all'utente di salvare prodotti come preferiti tramite l'icona "cuore".
 * Fornisce metodi per aggiungere, rimuovere e verificare lo stato di un prodotto.
 *
 * Utilizzato da:
 *   - Layout.tsx (per passare dati al FavoritesDrawer)
 *   - Header.tsx (per mostrare il conteggio dei preferiti)
 *   - Schede prodotto (per il toggle cuore)
 *
 * Lo stato è in memoria (useState): al refresh della pagina i preferiti si perdono.
 */

import { createContext, useContext, useState, type ReactNode } from 'react';

// ── Interfaccia articolo preferito ────────────────────────────────
/**
 * Rappresenta un prodotto salvato nella lista preferiti.
 * Contiene solo i dati necessari per la visualizzazione nel drawer.
 */
export interface FavoriteItem {
  /** Identificativo univoco del prodotto */
  id: string;
  /** Nome visualizzato del prodotto */
  name: string;
  /** Prezzo in euro */
  price: number;
  /** URL dell'immagine di anteprima */
  image: string;
  /** Marca / brand del prodotto */
  brand: string;
}

// ── Tipo del contesto ─────────────────────────────────────────────
/** Definisce tutte le proprietà e i metodi esposti dal contesto preferiti. */
interface FavoritesContextType {
  /** Lista corrente dei prodotti preferiti */
  items: FavoriteItem[];
  /** Aggiunge un prodotto ai preferiti (ignora se già presente) */
  addItem: (item: FavoriteItem) => void;
  /** Rimuove un prodotto dai preferiti tramite id */
  removeItem: (id: string) => void;
  /** Aggiunge se non presente, rimuove se già presente (toggle) */
  toggleItem: (item: FavoriteItem) => void;
  /** Verifica se un prodotto è nella lista preferiti */
  isFavorite: (id: string) => boolean;
}

// Contesto inizializzato a null; verrà valorizzato dal Provider
const FavoritesContext = createContext<FavoritesContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────
/**
 * Provider dei preferiti. Va posizionato in App.tsx all'interno di CartProvider.
 *
 * @param children — componenti figli che avranno accesso al contesto
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([]);

  /**
   * Aggiunge un prodotto ai preferiti.
   * Se il prodotto è già presente (stesso id), non fa nulla per evitare duplicati.
   */
  const addItem = (item: FavoriteItem) => {
    setItems(prev => {
      if (prev.some(f => f.id === item.id)) return prev; // Già presente, ignora
      return [...prev, item];
    });
  };

  /**
   * Rimuove un prodotto dai preferiti in base al suo id.
   * @param id — identificativo del prodotto da rimuovere
   */
  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  /**
   * Toggle: se il prodotto è già nei preferiti lo rimuove,
   * altrimenti lo aggiunge. Usato tipicamente dal click sull'icona cuore.
   *
   * @param item — prodotto da aggiungere o rimuovere
   */
  const toggleItem = (item: FavoriteItem) => {
    setItems(prev => {
      if (prev.some(f => f.id === item.id)) {
        // Già presente: rimuovilo
        return prev.filter(f => f.id !== item.id);
      }
      // Non presente: aggiungilo
      return [...prev, item];
    });
  };

  /**
   * Controlla se un prodotto è attualmente nei preferiti.
   * @param id — identificativo del prodotto
   * @returns true se il prodotto è nella lista, false altrimenti
   */
  const isFavorite = (id: string) => items.some(item => item.id === id);

  return (
    <FavoritesContext.Provider value={{ items, addItem, removeItem, toggleItem, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// ── Hook personalizzato ───────────────────────────────────────────
/**
 * Hook per accedere al contesto dei preferiti.
 * Deve essere usato all'interno di un <FavoritesProvider>.
 *
 * @returns oggetto con items, addItem, removeItem, toggleItem, isFavorite
 * @throws Error se usato fuori dal FavoritesProvider
 */
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
