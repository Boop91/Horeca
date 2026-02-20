// @vitest-environment node

import { resolveCatalogPath, resolveCatalogTrail } from './catalogRouting';

describe('catalogRouting', () => {
  it('risolve slug foglia e alias verso rotte catalogo valide', () => {
    expect(resolveCatalogPath('fry-top')).toBe('/categoria/linea-caldo/cottura-a-contatto/fry-top');
    expect(resolveCatalogPath('friggitrici')).toBe('/categoria/linea-caldo/cottura-per-immersione/friggitrici-professionali');
    expect(resolveCatalogPath('linea-freddo')).toBe('/categoria/linea-freddo');
  });

  it('restituisce trail completo per breadcrumb prodotto/categoria', () => {
    const trail = resolveCatalogTrail('friggitrici');

    expect(trail?.category.path).toBe('/categoria/linea-caldo');
    expect(trail?.group?.path).toBe('/categoria/linea-caldo/cottura-per-immersione');
    expect(trail?.section?.path).toBe('/categoria/linea-caldo/cottura-per-immersione/friggitrici-professionali');
  });
});
