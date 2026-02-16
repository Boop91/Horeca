import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft, Truck, ShieldCheck, BadgeEuro,
  Headphones, PackageCheck, CreditCard, Star, ChevronRight,
  ShoppingCart,
} from 'lucide-react';
import heroImage from '../assets/f4ed0b934aabb9cdf06af64854509a5ac97f8256.png';
import { catalogMenu } from '../data/catalogMenu';
import { realProducts } from '../data/products/realProducts';
import { companyInfo } from '../data/companyInfo';
import { useRef, useState, useCallback } from 'react';
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

/* Promo banners per il carousel */
const promoBanners = [
  {
    title: 'Offerte Linea Freddo',
    desc: 'Scopri le migliori offerte su abbattitori, frigoriferi e congelatori professionali.',
    cta: 'Scopri l\'offerta',
    link: '/categoria/linea-freddo',
    color: 'from-blue-50 to-white',
  },
  {
    title: 'Forni Professionali',
    desc: 'Selezione premium di forni per pizza, convezione e professionali a prezzi imbattibili.',
    cta: 'Scopri l\'offerta',
    link: '/categoria/linea-caldo/forni-professionali',
    color: 'from-orange-50 to-white',
  },
  {
    title: 'Preparazione e Lavorazione',
    desc: 'Impastatrici, affettatrici e tutto per la preparazione professionale degli alimenti.',
    cta: 'Scopri l\'offerta',
    link: '/categoria/preparazione',
    color: 'from-green-50 to-white',
  },
];

/* Recensioni di esempio */
const reviews = [
  { name: 'Marco R.', city: 'Milano', rating: 5, text: 'Servizio eccellente, abbattitore arrivato in 3 giorni. Imballaggio perfetto e assistenza impeccabile.' },
  { name: 'Giulia T.', city: 'Roma', rating: 5, text: 'Prezzi imbattibili per i forni pizza. Gia il secondo ordine, sempre puntualissimi con le consegne.' },
  { name: 'Alessandro B.', city: 'Napoli', rating: 4, text: 'Frigorifero professionale di ottima qualita. Consiglio vivamente BianchiPro a tutti i colleghi ristoratori.' },
  { name: 'Laura F.', city: 'Firenze', rating: 5, text: 'Consulenza telefonica eccezionale. Mi hanno aiutato a scegliere l\'attrezzatura perfetta per il mio ristorante.' },
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

/* ==========================================================================
 * A) SEZIONE HERO
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
 * B) BARRA BENEFICI — 6 card
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
 * C) CAROUSEL BANNER PROMOZIONALI
 * ========================================================================== */
function PromoBannersCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollTo = useCallback((index: number) => {
    if (!scrollRef.current) return;
    const child = scrollRef.current.children[index] as HTMLElement;
    if (child) {
      scrollRef.current.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
      setCurrentIndex(index);
    }
  }, []);

  const prev = () => scrollTo(Math.max(0, currentIndex - 1));
  const next = () => scrollTo(Math.min(promoBanners.length - 1, currentIndex + 1));

  return (
    <section className="bg-gray-50 py-14">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-2xl font-extrabold text-gray-900 mb-8">
          Offerte e Promozioni
        </h2>

        <div className="relative">
          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-50 disabled:opacity-40 transition-colors"
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 text-gray-700" />
          </button>
          <button
            onClick={next}
            className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-50 disabled:opacity-40 transition-colors"
            disabled={currentIndex === promoBanners.length - 1}
          >
            <ArrowRight className="h-4 w-4 text-gray-700" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {promoBanners.map((banner, idx) => (
              <div
                key={idx}
                className={`flex-shrink-0 w-full snap-center rounded-2xl bg-gradient-to-br ${banner.color} border border-gray-200 p-8 md:p-10 shadow-sm`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-extrabold text-gray-900">{banner.title}</h3>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-md">{banner.desc}</p>
                    <Link
                      to={banner.link}
                      className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-green-600 transition-colors"
                    >
                      {banner.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="hidden md:block w-48 h-32 rounded-xl bg-white/60 border border-gray-100 flex items-center justify-center">
                    <img src={heroImage} alt={banner.title} className="w-full h-full object-cover rounded-xl opacity-80" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-5">
            {promoBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'w-6 bg-green-500' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
 * D) CHI SIAMO — About section
 * ========================================================================== */
function AboutSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={heroImage}
              alt="Cucina professionale BianchiPro"
              className="h-full w-full object-cover aspect-[4/3]"
            />
          </div>
          <div>
            <span className="text-sm font-semibold text-green-600 uppercase tracking-wide">Chi siamo</span>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 leading-tight">
              Bianchipro — Soluzioni Made in Italy per la ristorazione
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              {companyInfo.description}
            </p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              {companyInfo.mission}
            </p>
            <Link
              to="/chi-siamo"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-bold text-white hover:bg-green-600 transition-colors"
            >
              Scopri la nostra storia
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
 * E) RECENSIONI — Feedaty
 * ========================================================================== */
function ReviewsSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900">
            Leggi le recensioni
          </h2>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-yellow-400/50 text-yellow-400/50'}`}
                />
              ))}
            </div>
            <span className="font-bold text-gray-900">{companyInfo.socialProof.averageRating} / 5</span>
            <span className="text-sm text-gray-500">— {companyInfo.socialProof.totalReviews}+ recensioni su {companyInfo.socialProof.platform}</span>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
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
 * F) CATEGORIE IN EVIDENZA — 2 righe di 5
 * ========================================================================== */
function FeaturedCategoriesGrid() {
  /* Trova i gruppi dal catalogo in base agli slug */
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
    <section className="bg-white py-16">
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
              className="group flex flex-col items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-5 text-center transition-all hover:border-green-300 hover:shadow-md hover:bg-white"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm group-hover:border-green-300 transition-colors">
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
 * G) CATEGORY DETAIL CARDS — 6 card in griglia 3×2
 * ========================================================================== */
function CategoryDetailCards() {
  const detailCategories = detailCategoryKeys
    .map((key) => catalogMenu.find((c) => c.key === key))
    .filter(Boolean);

  return (
    <section className="bg-gray-50 py-16">
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
                  {/* Immagine prodotto a sinistra */}
                  <div className="w-36 flex-shrink-0 bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
                    <img
                      src={cat.image || heroImage}
                      alt={cat.label}
                      className="h-28 w-28 object-contain"
                    />
                  </div>

                  {/* Contenuto a destra */}
                  <div className="flex-1 p-5 flex flex-col">
                    <h3 className="text-base font-bold text-gray-900 mb-1">{cat.label}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                      {cat.description}
                    </p>

                    {/* 4 sottocategorie in griglia 2×2 */}
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

                    {/* Pulsante verde */}
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
 * H) PROPOSTE CAROUSEL
 * ========================================================================== */
function ProposalsCarousel() {
  const proposals = [
    { title: 'Attrezzatura per Pizzeria', desc: 'Tutto il necessario per avviare o rinnovare la tua pizzeria', link: '/categoria/linea-caldo/forni-professionali' },
    { title: 'Linea Refrigerazione', desc: 'Frigoriferi, congelatori e abbattitori per la tua cucina', link: '/categoria/linea-freddo' },
    { title: 'Kit Bar Completo', desc: 'Granitore, spremiagrumi, frullatori e molto altro', link: '/categoria/preparazione/attrezzature-per-bar' },
    { title: 'Arredo Professionale', desc: 'Tavoli inox, carrelli e arredo per la tua attivita', link: '/categoria/carrelli-arredo' },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900">
            Scopri le nostre proposte
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
          {proposals.map((p, idx) => (
            <Link
              key={idx}
              to={p.link}
              className="group flex-shrink-0 w-72 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden hover:shadow-md hover:border-green-300 transition-all"
            >
              <div className="h-36 bg-gradient-to-br from-green-50 to-gray-100 flex items-center justify-center">
                <img src={heroImage} alt={p.title} className="h-28 w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-green-600 transition-colors">{p.title}</h3>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">{p.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
 * I) PRODOTTI SELEZIONATI CAROUSEL
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
                {/* Badges */}
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
                  {/* Category tag */}
                  <span className="mb-1.5 w-fit rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    {product.categorySlug.replace(/-/g, ' ')}
                  </span>

                  {/* Product name */}
                  <Link to={`/prodotto/${product.slug}`}>
                    <h3 className="line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-green-600 transition-colors min-h-[2.5rem]">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Price */}
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

                  {/* Buy button */}
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
 * HOMEPAGE — Composizione di tutte le sezioni
 * ========================================================================== */
export default function HomePage() {
  return (
    <main>
      {/* A) Hero con branding e CTA */}
      <HeroSection />

      {/* B) Barra benefici 6 card */}
      <BenefitsBar />

      {/* C) Carousel banner promozionali */}
      <PromoBannersCarousel />

      {/* D) Chi siamo — About section */}
      <AboutSection />

      {/* E) Recensioni clienti Feedaty */}
      <ReviewsSection />

      {/* F) Categorie in evidenza — 2 righe di 5 */}
      <FeaturedCategoriesGrid />

      {/* G) Category detail cards — 2×3 */}
      <CategoryDetailCards />

      {/* H) Proposte carousel */}
      <ProposalsCarousel />

      {/* I) Prodotti selezionati carousel */}
      <SelectedProductsCarousel />
    </main>
  );
}
