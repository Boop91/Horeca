/**
 * @file main.tsx
 * @description Punto di ingresso (entry point) dell'applicazione bianchipro.it.
 *
 * Questo file viene eseguito per primo dal bundler (Vite).
 * Responsabilità:
 *   1. Selezionare l'elemento DOM <div id="root"> presente in index.html
 *   2. Creare la radice React con createRoot (React 18+)
 *   3. Avvolgere l'intera app in <BrowserRouter> per abilitare il routing
 *      basato sulla History API del browser
 *   4. Importare gli stili globali (index.css)
 *
 * Il <BrowserRouter> è posizionato qui e NON dentro App.tsx, così da
 * separare la configurazione del router dalla definizione delle rotte.
 *
 * @see App.tsx — definizione delle rotte e dei Provider
 * @see index.html — contiene il <div id="root">
 */

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css'; // Stili globali e design tokens

// Monta l'applicazione React nel DOM.
// L'operatore `!` (non-null assertion) garantisce a TypeScript che l'elemento esiste.
createRoot(document.getElementById('root')!).render(
  // BrowserRouter abilita la navigazione client-side senza ricaricare la pagina
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
