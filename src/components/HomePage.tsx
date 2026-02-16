import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft, Truck, ShieldCheck, BadgeEuro,
  Headphones, PackageCheck, CreditCard, Star, ChevronRight,
  ShoppingCart, BookOpen,
} from 'lucide-react';
import heroImage from '../assets/f4ed0b934aabb9cdf06af64854509a5ac97f8256.png';
import { catalogMenu } from '../data/catalogMenu';
import { realProducts } from '../data/products/realProducts';
import { companyInfo } from '../data/companyInfo';
import { useRef, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

/* ==========================================================================
 * Dati statici per le sezioni della Home
 * ========================================================================== */

/* Benefici — 6 card orizzontali sotto l'hero */
const benefits = [
  { icon: BadgeEuro, title: 'Prezzi competitivi', desc: 'I migliori prezzi del mercato per i professionisti' },
  { icon: Truck, title: 'Spedizioni rapide', desc: 'Consegna in 24/48h in tutta Italia' },
  { icon: PackageCheck, title: 'Installazione e servizi', desc: 'Supporto completo per l\'installazione' },
  { icon: Headphones, title: 'Consulenze specializzate', desc: 'Esperti a tua disposizione per ogni esigenza' },
  { icon: ShieldCheck, title: 'Vasto catalogo', desc: 'Migliaia di prodotti professionali selezionati' },
  { icon: CreditCard, title: 'Pagamenti sicuri', desc: 'Transazioni protette e metodi flessibili' },
];

/* Promo banners */
const promoBanners = [
  {
    title: 'Offerte Linea Freddo',
    desc: 'Scopri le migliori offerte su abbattitori, frigoriferi e congelatori professionali.',
    cta: 'Scopri l\'offerta',
    link: '/categoria/linea-freddo',
  },
  {
    title: 'Forni Professionali',
    desc: 'Selezione premium di forni per pizza, convezione e professionali a prezzi imbattibili.',
    cta: 'Scopri l\'offerta',
    link: '/categoria/linea-caldo/forni-professionali',
  },
  {
    title: 'Preparazione e Lavorazione',
    desc: 'Impastatrici, affettatrici e tutto per la preparazione professionale degli alimenti.',
    cta: 'Scopri l\'offerta',
    link: '/categoria/preparazione',
  },
];

/* Recensioni */
const reviews = [
  { name: 'Marco R.', city: 'Milano', rating: 5, text: 'Servizio eccellente, abbattitore arrivato in 3 giorni. Imballaggio perfetto e assistenza impeccabile.', date: '12/01/2025' },
  { name: 'Giulia T.', city: 'Roma', rating: 5, text: 'Prezzi imbattibili per i forni pizza. Gia il secondo ordine, sempre puntualissimi con le consegne.', date: '05/12/2024' },
  { name: 'Alessandro B.', city: 'Napoli', rating: 4, text: 'Frigorifero professionale di ottima qualita. Consiglio vivamente BianchiPro a tutti i colleghi ristoratori.', date: '18/11/2024' },
  { name: 'Laura F.', city: 'Firenze', rating: 5, text: 'Consulenza telefonica eccezionale. Mi hanno aiutato a scegliere l\'attrezzatura perfetta per il mio ristorante.', date: '02/10/2024' },
];

/* Categorie in evidenza — gruppi scelti dal catalogo */
const featuredGroupSlugs = [
  'cottura-a-contatto', 'forni-professionali', 'refrigerazione',
  'cottura-per-immersione', 'lavorazione-pasta', 'mantenimento-temperatura',
  'tavoli-refrigerati', 'attrezzature-per-bar', 'carrelli-neutri', 'cucina-professionale',
];

/* Slug prodotti selezionati */
const selectedProductSlugs = [
  'abbattitore-forcar-ab5514-14-teglie-gn1-1',
  'forno-pizzeria-fimar-fp-elettrico-1-camera',
  'friggitrice-fimar-fy8l-8-lt-monofase',
  'frigorifero-er400-350-lt-statico',
  'abbattitore-forcar-g-d5a-5-teglie-gn1-1',
  'forno-pizzeria-fama-b7-elettrico',
  'cantinetta-vini-bj118-24-bottiglie',
  'friggitrice-fimar-fr4n-6-lt-monofase',
];

/* Categorie principali (per le 6 category detail cards) */
const detailCategoryKeys = ['linea-caldo', 'linea-freddo', 'preparazione', 'carrelli-arredo', 'hotellerie', 'igiene'];

/* Blog posts fittizi */
const blogPosts = [
  { title: 'Come scegliere il forno professionale perfetto', excerpt: 'Guida completa alla scelta del forno ideale per la tua attivita ristorativa...', date: '10 Gen 2025', slug: '#' },
  { title: 'Manutenzione frigoriferi professionali', excerpt: 'Consigli pratici per mantenere i tuoi frigoriferi sempre efficienti e risparmiare energia...', date: '22 Dic 2024', slug: '#' },
  { title: 'Tendenze cucina professionale 2025', excerpt: 'Le novita e i trend che stanno rivoluzionando il settore della ristorazione professionale...', date: '15 Dic 2024', slug: '#' },
  { title: 'Normative HACCP: cosa sapere', excerpt: 'Tutto quello che devi sapere sulle normative igienico-sanitarie per la tua attivita...', date: '01 Dic 2024', slug: '#' },
];

/* ==========================================================================
 * 1) SEZIONE HERO
 * ========================================================================== */
function HeroSection() {
  return (
    <section className="relative min-h-[520px] flex items-center overflow-hidden">
      <img
        src={heroImage}
        alt="Cucina professionale"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-24">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full bg-green-500/20 px-4 py-1.5 text-sm font-semibold text-green-300 backdrop-blur-sm border border-green-500/30">
            Bianchipro
          </span>
          <h1 className="mt-4 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl leading-tight">
            Soluzioni ed attrezzature professionali per la ristorazione
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-lg">
            Dal 1960, selezioniamo le migliori attrezzature Made in Italy per ristoranti, bar, pizzerie e hotel.
          </p>
          <Link
            to="/categoria/linea-caldo"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-green-500 px-8 py-3.5 font-bold text-white shadow-lg hover:bg-green-600 transition-colors"
          >
            Inizia da qui
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
 * 2) BARRA BENEFICI — 6 card
 * ========================================================================== */
function BenefitsBar() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="flex flex-col items-center text-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-5 hover:shadow-sm transition-shadow">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50">
                  <Icon className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight">{b.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
 * 3) PRODOTTI SELEZIONATI CAROUSEL
 * ========================================================================== */
function SelectedProductsCarousel() {
  const { addItem } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);

  const products = selectedProductSlugs
    .map((slug) => realProducts.find((p) => p.slug === slug))
    .filter(Boolean);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const handleAddToCart = (product: NonNullable<typeof products[0]>) => {
    addItem({
      id: `product-${product.id}-${Date.now()}`,
      name: product.name,
      price: product.priceNet,
      quantity: 1,
      image: product.images[0] || heroImage,
    });
    toast.success('Prodotto aggiunto al carrello');
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900">
            Prodotti selezionati
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            >
              <ArrowRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => {
            if (!product) return null;
            const hasDiscount = product.originalPriceNet && product.originalPriceNet > product.priceNet;

            return (
              <div
                key={product.id}
                className="group flex-shrink-0 w-64 flex flex-col rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-green-300 transition-all"
              >
                <div className="relative">
                  <Link to={`/prodotto/${product.slug}`}>
                    <div className="aspect-square overflow-hidden rounded-t-xl bg-gray-50 p-3">
                      <img
                        src={product.images[0] || heroImage}
                        alt={product.name}
                        className="h-full w-full object-contain group-hover:scale-105 transition-transform"
                        onError={(e) => { (e.target as HTMLImageElement).src = heroImage; }}
                      />
                    </div>
                  </Link>
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && (
                      <span className="rounded-md bg-blue-500 px-2 py-0.5 text-xs font-bold text-white">nuovo</span>
                    )}
                    {product.isOnSale && (
                      <span className="rounded-md bg-orange-400 px-2 py-0.5 text-xs font-bold text-white">offerta</span>
                    )}
                    {hasDiscount && (
                      <span className="rounded-md bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">best seller</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <span className="mb-1.5 w-fit rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    {product.categorySlug.replace(/-/g, ' ')}
                  </span>

                  <Link to={`/prodotto/${product.slug}`}>
                    <h3 className="line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-green-600 transition-colors min-h-[2.5rem]">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mt-auto pt-3">
                    {hasDiscount && (
                      <span className="text-xs text-gray-400 line-through">
                        {product.originalPriceNet!.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                      </span>
                    )}
                    <div className="text-lg font-extrabold text-gray-900">
                      {product.priceNet.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                      <span className="ml-1 text-xs font-normal text-gray-500">+ IVA</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-green-500 py-2.5 text-sm font-bold text-white hover:bg-green-600 transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Acquista
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
 * 4) CATEGORY DETAIL CARDS — 6 card in griglia 3×2
 * ========================================================================== */
function CategoryDetailCards() {
  const detailCategories = detailCategoryKeys
    .map((key) => catalogMenu.find((c) => c.key === key))
    .filter(Boolean);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl font-extrabold text-gray-900">
          Esplora il Catalogo
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-gray-500">
          Naviga per categoria e trova esattamente cio che ti serve
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {detailCategories.map((cat) => {
            if (!cat) return null;
            return (
              <div
                key={cat.key}
                className="rounded-xl border border-blue-100 bg-white overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-0">
                  <div className="w-36 flex-shrink-0 bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
                    <img
                      src={cat.image || heroImage}
                      alt={cat.label}
                      className="h-28 w-28 object-contain"
                    />
                  </div>

                  <div className="flex-1 p-5 flex flex-col">
                    <h3 className="text-base font-bold text-gray-900 mb-1">{cat.label}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                      {cat.description}
                    </p>

                    <div className="grid grid-cols-2 gap-1.5 mb-4">
                      {cat.groups.slice(0, 4).map((group) => (
                        <Link
                          key={group.slug}
                          to={`/categoria/${cat.slug}/${group.slug}`}
                          className="rounded-full bg-slate-700 px-2.5 py-1 text-[10px] font-semibold text-white text-center truncate hover:bg-slate-600 transition-colors"
                        >
                          {group.title}
                        </Link>
                      ))}
                    </div>

                    <Link
                      to={`/categoria/${cat.slug}`}
                      className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-green-600 hover:text-green-700 transition-colors"
                    >
                      visualizza tutto
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
 * 5) SCOPRI LE NOSTRE PROPOSTE — immagini prodotto + 3 banner cards
 * ========================================================================== */
function ProposalsSection() {
  /* Primi 6 prodotti per la fila di immagini in alto */
  const topProducts = selectedProductSlugs
    .slice(0, 6)
    .map((slug) => realProducts.find((p) => p.slug === slug))
    .filter(Boolean);

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900">
            Scopri le nostre proposte
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Migliori offerte, qualita e servizi
          </p>
        </div>

        {/* Fila di immagini prodotto */}
        <div className="flex justify-center gap-4 mb-10 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {topProducts.map((p) => {
            if (!p) return null;
            return (
              <Link
                key={p.id}
                to={`/prodotto/${p.slug}`}
                className="flex-shrink-0 w-28 h-28 rounded-xl bg-white border border-gray-200 p-2 hover:shadow-md hover:border-green-300 transition-all"
              >
                <img
                  src={p.images[0] || heroImage}
                  alt={p.name}
                  className="h-full w-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).src = heroImage; }}
                />
              </Link>
            );
          })}
        </div>

        {/* 3 Banner promozionali */}
        <div className="grid gap-5 md:grid-cols-3">
          {promoBanners.map((banner, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-40 bg-gradient-to-br from-gray-100 to-blue-50 flex items-center justify-center">
                <img src={heroImage} alt={banner.title} className="h-full w-full object-cover opacity-80" />
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-gray-900 mb-2">{banner.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{banner.desc}</p>
                <Link
                  to={banner.link}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-600 transition-colors"
                >
                  {banner.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
 * 6) CHI SIAMO — dark background full-width
 * ========================================================================== */
function AboutSection() {
  return (
    <section className="relative min-h-[400px] flex items-center overflow-hidden">
      <img
        src={heroImage}
        alt="Cucina professionale BianchiPro"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gray-900/75" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full bg-green-500/20 px-4 py-1.5 text-sm font-semibold text-green-300 backdrop-blur-sm border border-green-500/30">
            Bianchipro
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-white md:text-4xl leading-tight">
            Soluzioni Made in Italy per la ristorazione
          </h2>
          <p className="mt-4 text-gray-300 leading-relaxed max-w-xl">
            {companyInfo.description}
          </p>
          <p className="mt-3 text-gray-400 leading-relaxed max-w-xl">
            {companyInfo.mission}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
 * 7) RECENSIONI — con Feedaty branding
 * ========================================================================== */
function ReviewsSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900">
            Leggi le recensioni
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Scopri le recensioni dei nostri clienti
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-2 flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i <= 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <span className="font-bold text-gray-900 text-sm">{companyInfo.socialProof.averageRating}/5</span>
              <span className="text-xs text-gray-500">su {companyInfo.socialProof.platform}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-100 bg-gray-50 p-5"
            >
              <div className="flex gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 mb-2">{r.date}</p>
              <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">"{r.text}"</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-xs font-bold text-green-600">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">{r.name}</span>
                  <span className="ml-1 text-xs text-gray-500">— {r.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
 * 8) CATEGORIE IN EVIDENZA — 2 righe di 5
 * ========================================================================== */
function FeaturedCategoriesGrid() {
  const featuredGroups = featuredGroupSlugs
    .map((gSlug) => {
      for (const cat of catalogMenu) {
        const group = cat.groups.find((g) => g.slug === gSlug);
        if (group) return { ...group, parentSlug: cat.slug };
      }
      return null;
    })
    .filter(Boolean) as Array<{ title: string; slug: string; parentSlug: string; sections: unknown[] }>;

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl font-extrabold text-gray-900">
          Categorie in evidenza
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-gray-500">
          Esplora le categorie piu richieste dai professionisti della ristorazione
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {featuredGroups.map((group) => (
            <Link
              key={group.slug}
              to={`/categoria/${group.parentSlug}/${group.slug}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-gray-100 bg-white p-5 text-center transition-all hover:border-green-300 hover:shadow-md"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 border border-gray-200 shadow-sm group-hover:border-green-300 transition-colors">
                <img src={heroImage} alt={group.title} className="h-10 w-10 rounded-full object-cover" />
              </div>
              <span className="text-xs font-bold text-gray-900 leading-tight">{group.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
 * 9) BLOG — hero dark + 4 blog cards
 * ========================================================================== */
function BlogSection() {
  return (
    <section className="bg-white py-0">
      {/* Dark hero header */}
      <div className="relative min-h-[320px] flex items-center overflow-hidden">
        <img
          src={heroImage}
          alt="Blog Bianchipro"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-900/80" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16">
          <div className="max-w-xl">
            <span className="inline-block rounded-full bg-green-500/20 px-4 py-1.5 text-sm font-semibold text-green-300 backdrop-blur-sm border border-green-500/30">
              Bianchipro
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-white leading-tight">
              Dietro le quinte del mondo della ristorazione
            </h2>
            <p className="mt-3 text-gray-300 leading-relaxed">
              Approfondimenti, guide e novita dal mondo delle attrezzature professionali per la ristorazione.
            </p>
            <Link
              to="/blog"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-green-400 hover:text-green-300 transition-colors"
            >
              Vai al blog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Blog cards */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {blogPosts.map((post, idx) => (
            <Link
              key={idx}
              to={post.slug}
              className="group rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-36 bg-gradient-to-br from-gray-100 to-green-50 flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-gray-300 group-hover:text-green-400 transition-colors" />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1">{post.date}</p>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">{post.excerpt}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                  Leggi tutto <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
 * 10) NEWSLETTER BAR — green bg + email input + social icons
 * ========================================================================== */
function NewsletterSection() {
  const [nlEmail, setNlEmail] = useState('');

  return (
    <section className="bg-green-600">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Left — email signup */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">Iscriviti alla Newsletter</h3>
            <p className="text-sm text-green-100 mb-4">Ricevi offerte esclusive e novita direttamente nella tua casella email.</p>
            <div className="flex gap-2 max-w-md">
              <input
                type="email"
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
                placeholder="La tua email"
                className="flex-1 rounded-lg border-0 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-300 focus:outline-none"
              />
              <button
                onClick={() => { toast.success('Iscrizione avvenuta con successo!'); setNlEmail(''); }}
                className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-gray-800 transition-colors"
              >
                Iscriviti
              </button>
            </div>
          </div>

          {/* Right — social icons */}
          <div className="flex flex-col items-start md:items-end gap-3">
            <h4 className="text-base font-bold text-white">Seguici</h4>
            <div className="flex gap-3">
              {/* Facebook */}
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              {/* Instagram */}
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* YouTube */}
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
 * HOMEPAGE — Composizione sezioni (ordine identico allo screenshot)
 * ========================================================================== */
export default function HomePage() {
  return (
    <main>
      {/* 1) Hero */}
      <HeroSection />

      {/* 2) Barra benefici 6 card */}
      <BenefitsBar />

      {/* 3) Prodotti selezionati carousel */}
      <SelectedProductsCarousel />

      {/* 4) Category detail cards 3×2 */}
      <CategoryDetailCards />

      {/* 5) Scopri le nostre proposte + 3 banner */}
      <ProposalsSection />

      {/* 6) Chi siamo — dark background */}
      <AboutSection />

      {/* 7) Recensioni con Feedaty */}
      <ReviewsSection />

      {/* 8) Categorie in evidenza */}
      <FeaturedCategoriesGrid />

      {/* 9) Blog section */}
      <BlogSection />

      {/* 10) Newsletter bar */}
      <NewsletterSection />
    </main>
  );
}
