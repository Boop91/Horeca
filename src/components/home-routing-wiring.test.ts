// @vitest-environment node

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function readSource(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

describe('Home wiring and regressions', () => {
  it('usa la nuova Home come rotta principale e rimuove la rotta /home-v2', () => {
    const appSource = readSource('src/App.tsx');

    expect(appSource).toContain('<Route path="/" element={<HomePage />} />');
    expect(appSource).not.toMatch(/path="home-v2"/);
  });

  it('forza lo scroll in alto sulle navigazioni standard e preserva hash intenzionali', () => {
    const scrollSource = readSource('src/components/ScrollToTop.tsx');
    const categorySource = readSource('src/components/CategoryPage.tsx');
    const reviewsSource = readSource('src/components/FeedatyReviews.tsx');

    expect(scrollSource).toContain('if (hash)');
    expect(scrollSource).toContain('target.scrollIntoView({ block: \'start\' });');
    expect(scrollSource).toContain("window.scrollTo({ top: 0, left: 0, behavior: 'auto' });");
    expect(categorySource).toContain("window.scrollTo({ top: 0, left: 0, behavior: 'auto' });");
    expect(reviewsSource).not.toContain('href="#"');
  });

  it('mantiene il cablaggio delle interazioni header (menu, icone, freccia down)', () => {
    const headerSource = readSource('src/components/home_v2/HomeV2Header.tsx');

    expect(headerSource).toContain('ChevronDown');
    expect(headerSource).toContain("{ type: 'link', label: 'Contatti', to: '/contatti' }");
    expect(headerSource).toContain("{ type: 'category', label: 'Linea Freddo', key: 'linea-freddo'");
    expect(headerSource).toContain('onFavoritesClick');
    expect(headerSource).toContain('onCartClick');
    expect(headerSource).toContain('home-v2-header-shell');
    expect(headerSource).toContain('const hideThreshold = maxScrollable * 0.56;');
    expect(headerSource).toContain('const showThreshold = maxScrollable * 0.44;');
  });

  it('rende cliccabili sezione categorie e sezione blog verso rotte reali', () => {
    const categoriesSource = readSource('src/components/home_v2/HomeV2CategoryCards.tsx');
    const blogSource = readSource('src/components/home_v2/HomeV2BlogPreviews.tsx');
    const featuredSource = readSource('src/components/home_v2/HomeV2FeaturedTypesSection.tsx');
    const homeSource = readSource('src/components/home_v2/HomeV2Page.tsx');

    expect(categoriesSource).toContain('onClick={() => navigate(`/categoria/${card.slug}`)}');
    expect(categoriesSource).toContain('to: `/categoria/${category.key}/${group.slug}/${section.slug}`,');
    expect(categoriesSource).toContain('Esplora tutte le sottocategorie');

    expect(blogSource).toContain('to="/guide"');
    expect(blogSource).toContain('to={`/guide/${guide.slug}`}');
    expect(blogSource).toContain('const FEATURED_GUIDE_SLUGS = [');
    expect(blogSource).toContain("allArticles.find((article) => article.slug === slug)");
    expect(blogSource).toContain("'come-scegliere-abbattitore'");
    expect(blogSource).toContain("'forno-pizza-elettrico-gas'");
    expect(blogSource).toContain("'come-attrezzare-pizzeria'");
    expect(blogSource).toContain("'manutenzione-frigorifero-professionale'");

    expect(featuredSource).toContain('Categorie in evidenza');
    expect(featuredSource).toContain('/categoria/preparazione/mixer-pelatura-e-taglio');
    expect(featuredSource).toContain('/categoria/carrelli-arredo/carrelli-caldi-e-freddi');

    expect(homeSource).toContain('<HomeV2FeaturedTypesSection />');
    expect(homeSource).toContain('<HomeV2CategoryCards />');
    expect(homeSource).toContain('<HomeV2BlogPreviews />');
  });

  it('usa un componente card prodotto riutilizzabile nelle pagine elenco', () => {
    const categorySource = readSource('src/components/CategoryPage.tsx');
    const listingCardSource = readSource('src/components/ProductListingCard.tsx');
    const layoutSource = readSource('src/components/Layout.tsx');
    const breadcrumbSource = readSource('src/components/AppBreadcrumbs.tsx');

    expect(categorySource).toContain('import ProductListingCard from \'./ProductListingCard\';');
    expect(categorySource).toContain('<ProductListingCard');
    expect(listingCardSource).toContain('export default function ProductListingCard');
    expect(listingCardSource).toContain('to={`/prodotto/${product.slug}`}');
    expect(layoutSource).toContain('import AppBreadcrumbs from \'./AppBreadcrumbs\';');
    expect(layoutSource).toContain('<AppBreadcrumbs />');
    expect(breadcrumbSource).toContain('resolveCatalogTrail(product.categorySlug)');
    expect(breadcrumbSource).toContain('case \'categoria\':');
  });

  it('gestisce correttamente toggle sottocategorie e deduplica nel carosello categoria', () => {
    const categoriesSource = readSource('src/components/home_v2/HomeV2CategoryCards.tsx');
    const categorySource = readSource('src/components/CategoryPage.tsx');

    expect(categoriesSource).toContain('.slice(0, 8);');
    expect(categoriesSource).toContain('const baseChips = card.chips.slice(0, 4);');
    expect(categoriesSource).toContain('const extraChips = card.chips.slice(4, 8);');
    expect(categoriesSource).toContain('aria-expanded={expanded}');
    expect(categoriesSource).toContain('event.stopPropagation();');

    expect(categorySource).toContain('const subcatItemsUnique = useMemo(() => {');
    expect(categorySource).toContain('const key = `${item.slug}::${item.title}`.toLowerCase();');
    expect(categorySource).toContain("subcatItemsUnique.length <= 7 ? ' category-figma-subcat-track-centered' : ''");
  });

  it('mantiene Stripe configurabile solo in account/pagamenti e non nel checkout esterno', () => {
    const checkoutSource = readSource('src/components/CheckoutModal.tsx');
    const accountSource = readSource('src/components/auth/AccountPage.tsx');

    expect(checkoutSource).toContain('to="/account/pagamenti"');
    expect(checkoutSource).toContain('La chiave Stripe va configurata solo in area account');
    expect(checkoutSource).not.toContain('persistStripePublishableKey(');

    expect(accountSource).toContain("{ to: '/account/pagamenti', label: 'Gestione Pagamenti', icon: CreditCard }");
    expect(accountSource).toContain('function PaymentsSection() {');
    expect(accountSource).toContain('persistStripePublishableKey(stripeKey.trim());');
  });
});
