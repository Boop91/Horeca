// @vitest-environment node
/**
 * @file catalogMenu.test.ts
 * @description Test per la struttura del catalogo.
 *
 * Verifica:
 *   - Il menu ha almeno 6 categorie principali
 *   - Ogni categoria ha nome, slug e gruppi
 *   - I gruppi hanno sezioni con prodotti
 *   - Nessuno slug duplicato a livello di categoria
 */

import { catalogMenu } from './catalogMenu';

describe('catalogMenu — struttura catalogo', () => {
  it('contiene almeno 6 categorie principali', () => {
    expect(catalogMenu.length).toBeGreaterThanOrEqual(6);
  });

  it('ogni categoria ha nome e slug', () => {
    for (const cat of catalogMenu) {
      // Il campo "label" contiene il nome visualizzato della categoria
      expect(cat.label).toBeTruthy();
      expect(cat.slug).toBeTruthy();
    }
  });

  it('ogni categoria ha almeno un gruppo', () => {
    for (const cat of catalogMenu) {
      expect(cat.groups.length).toBeGreaterThan(0);
    }
  });

  it('ogni gruppo ha almeno una sezione', () => {
    for (const cat of catalogMenu) {
      for (const group of cat.groups) {
        expect(group.sections.length).toBeGreaterThan(0);
      }
    }
  });

  it('gli slug delle categorie sono unici', () => {
    const slugs = catalogMenu.map(c => c.slug);
    const unique = new Set(slugs);
    expect(unique.size).toBe(slugs.length);
  });

  it('include le categorie principali attese', () => {
    const names = catalogMenu.map(c => c.label.toLowerCase());
    // Verifica che ci siano le categorie Ho.Re.Ca. principali
    expect(names.some(n => n.includes('caldo'))).toBe(true);
    expect(names.some(n => n.includes('freddo'))).toBe(true);
    expect(names.some(n => n.includes('preparazione'))).toBe(true);
  });
});
