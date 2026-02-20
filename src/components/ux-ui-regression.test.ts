// @vitest-environment node

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function readSource(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

describe('UX/UI regression checks', () => {
  it('applica sfondo globale e mantiene home con base neutra coerente', () => {
    const globalsSource = readSource('src/styles/globals.css');
    const homeCssSource = readSource('src/components/home_v2/HomeV2.css');
    const designTokensSource = readSource('src/styles/design-tokens.css');

    expect(globalsSource).toContain('--background: #ebebeb;');
    expect(homeCssSource).toContain('background: linear-gradient(180deg, #eff2f5 0%, #e8ebef 100%);');
    expect(designTokensSource).toContain("--font-family: 'Manrope'");
  });

  it('usa page shell e titoli coerenti nelle principali pagine informative/commerciali', () => {
    const aboutSource = readSource('src/pages/AboutPage.tsx');
    const contactSource = readSource('src/pages/ContactPage.tsx');
    const faqSource = readSource('src/pages/FaqPage.tsx');
    const guidesSource = readSource('src/pages/GuidesPage.tsx');
    const glossarySource = readSource('src/pages/GlossaryPage.tsx');
    const checkoutSource = readSource('src/pages/CheckoutPage.tsx');
    const accountSource = readSource('src/components/auth/AccountPage.tsx');
    const globalsSource = readSource('src/styles/globals.css');

    expect(aboutSource).toContain('app-page-shell');
    expect(contactSource).toContain('app-page-shell');
    expect(faqSource).toContain('app-page-shell');
    expect(guidesSource).toContain('app-page-shell');
    expect(glossarySource).toContain('app-page-shell');
    expect(checkoutSource).toContain('app-page-shell');
    expect(accountSource).toContain('app-page-shell');
    expect(globalsSource).toContain('.app-page-shell');
    expect(globalsSource).toContain('.app-page-title');
    expect(globalsSource).toContain('.app-action-primary');
  });

  it('include la sezione categorie in evidenza per tipologia nella home', () => {
    const featuredSource = readSource('src/components/home_v2/HomeV2FeaturedTypesSection.tsx');
    const homeSource = readSource('src/components/home_v2/HomeV2Page.tsx');
    const homeCssSource = readSource('src/components/home_v2/HomeV2.css');

    expect(featuredSource).toContain('Categorie in evidenza');
    expect(featuredSource).toContain('Inizia il tuo shopping da qui');
    expect(featuredSource).toContain('/categoria/linea-freddo/tavoli-refrigerati');
    expect(homeSource).toContain('<HomeV2FeaturedTypesSection />');
    expect(homeCssSource).toContain('.home-v2-featured-types-grid');
  });

  it('mostra etichetta account "Accedi!" accanto icona utente nella navbar', () => {
    const headerSource = readSource('src/components/home_v2/HomeV2Header.tsx');
    const cssSource = readSource('src/components/home_v2/HomeV2.css');

    expect(headerSource).toContain("{user ? 'Account' : 'Accedi!'}");
    expect(headerSource).toContain('className="home-v2-account-cta"');
    expect(cssSource).toContain('.home-v2-account-cta-label');
  });

  it('mostra prodotti solo in categoria foglia (livello 3)', () => {
    const categorySource = readSource('src/components/CategoryPage.tsx');

    expect(categorySource).toContain('const showProductsGrid = livello === 3;');
    expect(categorySource).toContain('{showProductsGrid ? (');
    expect(categorySource).toContain('Questa pagina mostra solo la struttura di navigazione per categorie e sottocategorie.');
  });

  it('usa registrazione a tipo account unico senza selettore client/pro', () => {
    const authSource = readSource('src/components/auth/AuthModal.tsx');
    const authContextSource = readSource('src/contexts/AuthContext.tsx');

    expect(authSource).not.toContain('Tipo di account');
    expect(authSource).not.toContain("setRole('pro')");
    expect(authContextSource).toContain("role: 'client'");
  });

  it('checkout gestisce carta Stripe e bonifico nel flusso professionale', () => {
    const checkoutSource = readSource('src/pages/CheckoutPage.tsx');

    expect(checkoutSource).toContain("type PaymentMethod = 'card' | 'bank_transfer';");
    expect(checkoutSource).toContain('Procedi al pagamento con Stripe');
    expect(checkoutSource).toContain('Conferma ordine con bonifico');
    expect(checkoutSource).toContain('createOrderRecord({');
  });

  it('admin usa sorgente dati unica e audit modifiche', () => {
    const adminSource = readSource('src/components/admin/AdminDashboard.tsx');

    expect(adminSource).toContain('useStoreProducts');
    expect(adminSource).toContain('updateStoreProduct');
    expect(adminSource).toContain('useStoreBlogArticles');
    expect(adminSource).toContain('saveHomeContentConfig');
    expect(adminSource).toContain('appendAudit(');
  });

  it('checkout espone configurazione Stripe nel passo pagamento con save/reset key', () => {
    const checkoutSource = readSource('src/pages/CheckoutPage.tsx');
    const stripeConfigSource = readSource('src/config/stripe.ts');

    expect(checkoutSource).toContain('Configurazione Stripe checkout');
    expect(checkoutSource).toContain('Salva key');
    expect(checkoutSource).toContain('Reset key');
    expect(checkoutSource).toContain('Stripe secret key locale (sk_...) - opzionale');
    expect(checkoutSource).toContain('persistStripePublishableKey');
    expect(checkoutSource).toContain('persistStripeSecretKeyForLocalDev');
    expect(checkoutSource).toContain('resetStripeKeyFromCheckout');
    expect(stripeConfigSource).toContain('export function resetStripePublishableKey()');
    expect(stripeConfigSource).toContain('export function resetStripeSecretKeyForLocalDev()');
  });

  it('uniforma la larghezza dei contenitori principali su token globali', () => {
    const globalsSource = readSource('src/styles/globals.css');
    const homeCssSource = readSource('src/components/home_v2/HomeV2.css');
    const footerCssSource = readSource('src/components/Footer.css');

    expect(globalsSource).toContain('max-width: var(--container-max);');
    expect(homeCssSource).toContain('--home-v2-shell-max-width: var(--container-max);');
    expect(homeCssSource).toContain('.home-v2-frame');
    expect(footerCssSource).toContain('max-width: var(--container-max);');
  });

  it('checkout richiede P.IVA, conferma fatturazione e scelta metodo pagamento', () => {
    const checkoutSource = readSource('src/pages/CheckoutPage.tsx');

    expect(checkoutSource).toContain('La Partita IVA e obbligatoria per completare il checkout B2B.');
    expect(checkoutSource).toContain('billingConfirmed');
    expect(checkoutSource).toContain('Conferma i dati di fatturazione');
    expect(checkoutSource).toContain('paymentMethodError');
  });

  it('faq include collegamenti React Router per CTA e stato empty', () => {
    const faqSource = readSource('src/pages/FaqPage.tsx');

    expect(faqSource).toContain("import { Link } from 'react-router-dom';");
    expect(faqSource).toContain('to="/contatti"');
    expect(faqSource).toContain('type="button" onClick={() => toggle(key)}');
  });

  it('espone widget aiuto flottante con chat AI, messaggio veloce e WhatsApp', () => {
    const widgetSource = readSource('src/components/SupportHelpWidget.tsx');
    const appSource = readSource('src/App.tsx');
    const widgetCssSource = readSource('src/components/SupportHelpWidget.css');

    expect(widgetSource).toContain('Aiuto');
    expect(widgetSource).toContain('Chat AI live');
    expect(widgetSource).toContain('Messaggio veloce');
    expect(widgetSource).toContain('WhatsApp');
    expect(widgetSource).toContain('support-help-trigger');
    expect(widgetCssSource).toContain('.support-help-trigger');
    expect(widgetCssSource).toContain('support-help-float');
    expect(appSource).toContain('<SupportHelpWidget />');
  });

  it('mantiene il drawer preferiti sopra navbar e menu header', () => {
    const favoritesSource = readSource('src/components/FavoritesDrawer.tsx');
    const cartSource = readSource('src/components/CartDrawer.tsx');

    expect(favoritesSource).toContain('z-[1500]');
    expect(cartSource).toContain('z-[1400]');
    expect(cartSource).toContain('z-[1450]');
  });

  it('contiene le frecce dei caroselli entro la sezione e riduce overlay', () => {
    const homeCssSource = readSource('src/components/home_v2/HomeV2.css');
    const categoryCssSource = readSource('src/components/CategoryPage.css');
    const listingCssSource = readSource('src/components/ProductListingCard.css');
    const listingSource = readSource('src/components/ProductListingCard.tsx');
    const homeProductsSource = readSource('src/components/home_v2/HomeV2Products.tsx');

    expect(homeCssSource).toContain('.home-v2-products-carousel-area');
    expect(homeCssSource).toContain('isolation: isolate;');
    expect(homeCssSource).toContain('.home-v2-carousel-arrow-left');
    expect(homeCssSource).toContain('left: 8px;');
    expect(homeCssSource).toContain('.home-v2-carousel-arrow-right');
    expect(homeCssSource).toContain('right: 8px;');
    expect(categoryCssSource).toContain('.category-figma-subcategories-shell');
    expect(categoryCssSource).toContain('overflow: hidden;');
    expect(categoryCssSource).toContain('.category-figma-subcat-arrow-left');
    expect(categoryCssSource).toContain('left: 2px;');
    expect(listingCssSource).toContain('pointer-events: none;');
    expect(listingSource).toContain('Nuovo');
    expect(listingSource).toContain('Offerta');
    expect(homeProductsSource).toContain('Nuovo');
    expect(homeProductsSource).toContain('Offerta');
  });

  it('dal carrello porta direttamente alla rotta checkout', () => {
    const cartSource = readSource('src/components/CartDrawer.tsx');

    expect(cartSource).toContain("navigate('/checkout')");
    expect(cartSource).not.toContain('<CheckoutModal');
  });
});
