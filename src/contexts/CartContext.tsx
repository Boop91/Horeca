/**
 * @file CartContext.tsx
 * @description Contesto React per la gestione del carrello acquisti.
 *
 * Fornisce a tutta l'applicazione:
 *   - La lista degli articoli nel carrello (items)
 *   - Metodi per aggiungere, rimuovere, aggiornare quantità e svuotare il carrello
 *   - Valori calcolati: numero totale articoli e prezzo totale
 *
 * Utilizzato da:
 *   - Layout.tsx (per passare dati al CartDrawer)
 *   - Header.tsx (per mostrare il badge con il conteggio)
 *   - ProductDetails.tsx (per aggiungere prodotti al carrello)
 *   - CartPage.tsx, CheckoutPage.tsx
 *
 * Lo stato è in memoria (useState): al refresh della pagina il carrello si svuota.
 * Per la persistenza si potrebbe aggiungere localStorage o Supabase in futuro.
 */

import { createContext, useContext, useState, type ReactNode } from 'react';

// ── Interfaccia articolo carrello ─────────────────────────────────
/**
 * Rappresenta un singolo articolo nel carrello.
 */
export interface CartItem {
  /** Identificativo univoco del prodotto */
  id: string;
  /** Nome visualizzato del prodotto */
  name: string;
  /** Prezzo unitario in euro (senza accessori) */
  price: number;
  /** Quantità selezionata dall'utente */
  quantity: number;
  /** URL dell'immagine di anteprima */
  image: string;
  /** Opzioni scelte (es. colore, dimensione) — facoltative */
  options?: string[];
  /** Accessori aggiunti al prodotto, ognuno con nome e prezzo aggiuntivo */
  accessories?: { name: string; price: number }[];
}

// ── Tipo del contesto ─────────────────────────────────────────────
/** Definisce tutte le proprietà e i metodi esposti dal contesto carrello. */
interface CartContextType {
  /** Lista corrente degli articoli nel carrello */
  items: CartItem[];
  /** Aggiunge un articolo (o incrementa la quantità se già presente con stesse opzioni) */
  addItem: (item: CartItem) => void;
  /** Rimuove completamente un articolo dal carrello tramite il suo id */
  removeItem: (id: string) => void;
  /** Aggiorna la quantità di un articolo; se <= 0 lo rimuove */
  updateQuantity: (id: string, quantity: number) => void;
  /** Svuota completamente il carrello */
  clearCart: () => void;
  /** Numero totale di pezzi nel carrello (somma delle quantità) */
  totalItems: number;
  /** Prezzo totale in euro (prezzo + accessori) * quantità per ogni articolo */
  totalPrice: number;
}

// Contesto inizializzato a null; verrà valorizzato dal Provider
const CartContext = createContext<CartContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────
/**
 * Provider del carrello. Va posizionato in App.tsx per rendere
 * lo stato del carrello accessibile a tutta l'applicazione.
 *
 * @param children — componenti figli che avranno accesso al contesto
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  /**
   * Aggiunge un articolo al carrello.
   * Se esiste già un articolo con lo stesso nome, prezzo, opzioni e accessori,
   * ne incrementa la quantità invece di creare un duplicato.
   */
  const addItem = (newItem: CartItem) => {
    setItems(prev => {
      // Cerca un articolo identico (stesso prodotto con stesse configurazioni)
      const existingIndex = prev.findIndex(item => {
        const sameName = item.name === newItem.name;
        const samePrice = item.price === newItem.price;
        // Confronto opzioni tramite serializzazione JSON
        const sameOptions = JSON.stringify(item.options || []) === JSON.stringify(newItem.options || []);
        // Ordina gli accessori per nome prima del confronto, così l'ordine non conta
        const itemAcc = [...(item.accessories || [])].sort((a, b) => a.name.localeCompare(b.name));
        const newAcc = [...(newItem.accessories || [])].sort((a, b) => a.name.localeCompare(b.name));
        const sameAccessories = JSON.stringify(itemAcc) === JSON.stringify(newAcc);
        return sameName && samePrice && sameOptions && sameAccessories;
      });

      if (existingIndex >= 0) {
        // Articolo già presente: somma le quantità
        return prev.map((item, i) =>
          i === existingIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      // Articolo nuovo: aggiungilo alla fine della lista
      return [...prev, newItem];
    });
  };

  /**
   * Rimuove un articolo dal carrello in base al suo id.
   * @param id — identificativo dell'articolo da rimuovere
   */
  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  /**
   * Aggiorna la quantità di un articolo.
   * Se la nuova quantità è <= 0, l'articolo viene rimosso dal carrello.
   *
   * @param id — identificativo dell'articolo
   * @param quantity — nuova quantità desiderata
   */
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  /** Svuota completamente il carrello. */
  const clearCart = () => setItems([]);

  // ── Valori calcolati (derivati dallo stato) ─────────────────────
  // Numero totale di pezzi (somma di tutte le quantità)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Prezzo totale: per ogni articolo, (prezzo base + somma prezzi accessori) * quantità
  const totalPrice = items.reduce((sum, item) => {
    const accessoriesTotal = (item.accessories || []).reduce((a, acc) => a + acc.price, 0);
    return sum + (item.price + accessoriesTotal) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

// ── Hook personalizzato ───────────────────────────────────────────
/**
 * Hook per accedere al contesto del carrello.
 * Deve essere usato all'interno di un <CartProvider>.
 *
 * @returns oggetto con items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice
 * @throws Error se usato fuori dal CartProvider
 */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
