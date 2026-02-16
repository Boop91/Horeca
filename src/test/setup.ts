/**
 * @file setup.ts
 * @description Configurazione globale per i test Vitest.
 *
 * Questo file viene eseguito PRIMA di ogni suite di test.
 * Configura:
 *   - @testing-library/jest-dom: aggiunge matcher personalizzati
 *     come .toBeInTheDocument(), .toHaveTextContent(), ecc.
 *   - Mock di matchMedia: necessario perché jsdom non supporta
 *     le media query CSS usate dai componenti responsive.
 *   - Mock di IntersectionObserver: necessario per componenti
 *     che usano lazy loading o infinite scroll.
 *
 * Riferimento: https://vitest.dev/config/#setupfiles
 */

import '@testing-library/jest-dom';

/* ── Guardia: i mock del DOM servono solo in ambiente jsdom ───
   Quando un file di test usa @vitest-environment node,
   l'oggetto window non esiste e i mock non sono necessari. */
if (typeof window !== 'undefined') {
  /* ── Mock: window.matchMedia ─────────────────────────────────
     jsdom non implementa matchMedia, ma molti componenti UI
     (es. sidebar, drawer responsive) lo usano per rilevare
     la dimensione dello schermo. Questo mock restituisce sempre
     "non corrisponde" (matches: false) per semplicità. */
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });

  /* ── Mock: IntersectionObserver ───────────────────────────────
     Necessario per componenti che rilevano la visibilità
     di un elemento nel viewport (lazy loading immagini, ecc.) */
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
  });
}
