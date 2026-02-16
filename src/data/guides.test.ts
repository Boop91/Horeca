// @vitest-environment node
/**
 * @file guides.test.ts
 * @description Test per i dati delle guide professionali.
 *
 * Verifica:
 *   - L'array guides contiene almeno 1 guida
 *   - Ogni guida ha tutti i campi obbligatori (title, slug, category, content, ecc.)
 *   - Gli slug sono unici (nessun duplicato)
 *   - getGuideBySlug() restituisce la guida corretta
 *   - getGuideBySlug() con slug inesistente restituisce undefined
 */

import { guides, getGuideBySlug } from './guides';

describe('guides — dati guide professionali', () => {
  it('contiene almeno una guida', () => {
    expect(guides.length).toBeGreaterThan(0);
  });

  it('ogni guida ha tutti i campi obbligatori', () => {
    for (const guide of guides) {
      expect(guide.title).toBeTruthy();
      expect(guide.slug).toBeTruthy();
      expect(guide.category).toBeTruthy();
      expect(guide.content).toBeTruthy();
      expect(guide.excerpt).toBeTruthy();
      expect(guide.author).toBeTruthy();
      expect(guide.readTime).toBeGreaterThan(0);
      expect(guide.publishedAt).toBeTruthy();
    }
  });

  it('gli slug sono tutti unici', () => {
    const slugs = guides.map(g => g.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it('getGuideBySlug() trova una guida esistente', () => {
    const firstSlug = guides[0].slug;
    const found = getGuideBySlug(firstSlug);
    expect(found).toBeDefined();
    expect(found!.slug).toBe(firstSlug);
  });

  it('getGuideBySlug() restituisce undefined per slug inesistente', () => {
    const result = getGuideBySlug('slug-che-non-esiste-xyz');
    expect(result).toBeUndefined();
  });
});
