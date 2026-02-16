// @vitest-environment node
/**
 * @file realProducts.test.ts
 * @description Test per i dati dei prodotti reali da bianchipro.it.
 *
 * Verifica:
 *   - I prodotti hanno tutti i campi obbligatori
 *   - Gli SKU sono unici
 *   - I prezzi lordi sono calcolati correttamente (netto * 1.22)
 *   - Le funzioni helper funzionano
 */

import { realProducts, getAllProducts, getProductBySlug } from './realProducts';

describe('realProducts — prodotti reali BianchiPro', () => {
  it('contiene almeno 20 prodotti', () => {
    expect(realProducts.length).toBeGreaterThanOrEqual(20);
  });

  it('ogni prodotto ha i campi obbligatori', () => {
    for (const p of realProducts) {
      expect(p.name).toBeTruthy();
      expect(p.slug).toBeTruthy();
      expect(p.sku).toBeTruthy();
      expect(p.priceNet).toBeGreaterThan(0);
      expect(p.priceGross).toBeGreaterThan(0);
      expect(p.categorySlug).toBeTruthy();
      expect(p.brand).toBeTruthy();
    }
  });

  it('gli SKU sono tutti unici', () => {
    const skus = realProducts.map(p => p.sku);
    const uniqueSkus = new Set(skus);
    expect(uniqueSkus.size).toBe(skus.length);
  });

  it('il prezzo lordo è corretto (netto * 1.22 arrotondato)', () => {
    for (const p of realProducts) {
      const expected = Math.round(p.priceNet * 1.22 * 100) / 100;
      expect(p.priceGross).toBeCloseTo(expected, 1);
    }
  });

  it('getAllProducts() restituisce tutti i prodotti', () => {
    const all = getAllProducts();
    expect(all.length).toBe(realProducts.length);
  });

  it('getProductBySlug() trova un prodotto esistente', () => {
    const firstSlug = realProducts[0].slug;
    const found = getProductBySlug(firstSlug);
    expect(found).toBeDefined();
    expect(found!.slug).toBe(firstSlug);
  });

  it('getProductBySlug() restituisce undefined per slug inesistente', () => {
    const result = getProductBySlug('prodotto-inesistente-xyz');
    expect(result).toBeUndefined();
  });
});
