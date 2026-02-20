// @vitest-environment node

import { getStoreProducts } from './storefrontStore';
import { catalogMenu } from '../data/catalogMenu';

describe('storefrontStore fallback products', () => {
  it('garantisce almeno 8 prodotti per ogni slug foglia finale del catalogo', () => {
    const products = getStoreProducts();
    const leafSlugs = new Set(
      catalogMenu.flatMap((category) =>
        category.groups.flatMap((group) =>
          group.sections.flatMap((section) => section.items.map((item) => item.slug)),
        ),
      ),
    );

    const lowCoverageLeafSlugs = [...leafSlugs].filter(
      (leafSlug) =>
        products.filter((product) => product.categorySlug === leafSlug).length < 8,
    );

    expect(lowCoverageLeafSlugs).toEqual([]);
  });
});
