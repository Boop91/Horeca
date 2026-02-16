import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, Truck, Phone, FileText, ShieldCheck,
  BadgeEuro, Globe, Star, BookOpen, Clock,
  Flame, Snowflake, ChefHat, Package, Hotel, SprayCan,
  Pizza, UtensilsCrossed, Coffee, Beef, Cake, IceCreamCone,
  Wheat, ConciergeBell, Store,
} from 'lucide-react';
import heroImage from '../assets/f4ed0b934aabb9cdf06af64854509a5ac97f8256.png';
import { catalogMenu } from '../data/catalogMenu';
import { realProducts } from '../data/products/realProducts';
import { guides } from '../data/guides';
import { useState } from 'react';

/* ==========================================================================
 * Icone per le categorie del catalogo (mappatura key -> icona)
 * ========================================================================== */
const categoryIcons: Record<string, React.ReactNode> = {
  'linea-caldo': <Flame className="h-6 w-6 text-green-600" />,
  'linea-freddo': <Snowflake className="h-6 w-6 text-green-600" />,
  'preparazione': <ChefHat className="h-6 w-6 text-green-600" />,
  'carrelli-arredo': <Package className="h-6 w-6 text-green-600" />,
  'hotellerie': <Hotel className="h-6 w-6 text-green-600" />,
  'igiene': <SprayCan className="h-6 w-6 text-green-600" />,
};

/* Icone per le tipologie di attivita */
const businessTypes = [
  { name: 'Pizzeria', slug: 'pizzeria', icon: Pizza },
  { name: 'Ristorante', slug: 'ristorante', icon: UtensilsCrossed },
  { name: 'Bar', slug: 'bar', icon: Coffee },
  { name: 'Macelleria', slug: 'macelleria', icon: Beef },
  { name: 'Pasticceria', slug: 'pasticceria', icon: Cake },
  { name: 'Gelateria', slug: 'gelateria', icon: IceCreamCone },
  { name: 'Hotel', slug: 'hotel', icon: Hotel },
  { name: 'Catering', slug: 'catering', icon: ConciergeBell },
  { name: 'Panetteria', slug: 'panetteria', icon: Wheat },
  { name: 'Food Truck', slug: 'food-truck', icon: Store },
];

/* Slug dei prodotti consigliati */
const featuredSlugs = [
  'abbattitore-forcar-ab5514-14-teglie-gn1-1',
  'forno-pizzeria-fimar-fp-elettrico-1-camera',
  'friggitrice-fimar-fy8l-8-lt-monofase',
  'frigorifero-er400-350-lt-statico',
  'abbattitore-forcar-g-d5a-5-teglie-gn1-1',
  'forno-pizzeria-fama-b7-elettrico',
  'cantinetta-vini-bj118-24-bottiglie',
  'friggitrice-fimar-fr4n-6-lt-monofase',
];

/* Dati delle proposte di valore */
const valueProps = [
  { icon: Truck, title: 'Spedizione Veloce', desc: 'Consegna rapida in tutta Italia con corriere espresso e tracking.' },
  { icon: Phone, title: 'Assistenza Telefonica', desc: 'Supporto tecnico e commerciale dal lunedi al venerdi, 9-18.' },
  { icon: FileText, title: 'Fatturazione Elettronica', desc: 'Fattura elettronica immediata per ogni ordine professionale.' },
  { icon: ShieldCheck, title: 'Garanzia 2 Anni', desc: 'Tutti i prodotti coperti da garanzia ufficiale del produttore.' },
  { icon: BadgeEuro, title: 'Prezzi Competitivi', desc: 'I migliori prezzi del mercato con offerte esclusive per i professionisti.' },
  { icon: Globe, title: 'Made in Italy', desc: 'Selezione di attrezzature fabbricate in Italia da brand leader.' },
];

/* Recensioni di esempio */
const reviews = [
  { name: 'Marco R.', city: 'Milano', rating: 5, text: 'Servizio eccellente, abbattitore arrivato in 3 giorni. Imballaggio perfetto e assistenza impeccabile.' },
  { name: 'Giulia T.', city: 'Roma', rating: 5, text: 'Prezzi imbattibili per i forni pizza. Gia il secondo ordine, sempre puntualissimi con le consegne.' },
  { name: 'Alessandro B.', city: 'Napoli', rating: 4, text: 'Frigorifero professionale di ottima qualita. Consiglio vivamente BianchiPro a tutti i colleghi ristoratori.' },
];

/* Categorie in evidenza per la sezione Esplora il Catalogo */
const featuredCatalogKeys = ['linea-caldo', 'linea-freddo', 'preparazione'];

/* ==========================================================================
 * A) SEZIONE HERO — Immagine di sfondo con barra di ricerca prominente
 * ========================================================================== */
function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cerca?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative min-h-[480px] flex items-center overflow-hidden">
      {/* Immagine di sfondo a tutta larghezza */}
      <img
        src={heroImage}
        alt="Cucina professionale"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Gradiente scuro per leggibilita del testo */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/75 to-gray-900/45" />

      {/* Contenuto del hero */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-20 text-center">
        <h1 className="text-4xl font-extrabold text-white md:text-5xl lg:text-6xl leading-tight">
          Attrezzature professionali<br />per la ristorazione
        </h1>
        <p className="mt-4 text-lg text-gray-200 md:text-xl">
          Dal 1965 — Made in Italy
        </p>

        {/* Barra di ricerca */}
        <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-2xl items-center rounded-xl bg-white shadow-xl">
          <Search className="ml-4 h-5 w-5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca attrezzature, brand, modelli..."
            className="flex-1 bg-transparent px-4 py-4 text-gray-900 placeholder:text-gray-400 outline-none"
          />
          <button
            type="submit"
            className="m-1.5 rounded-lg bg-green-500 px-6 py-3 font-extrabold text-white hover:bg-green-600 transition-colors"
          >
            Cerca
          </button>
        </form>
      </div>
    </section>
  );
}

/* ==========================================================================
 * B) ETICHETTE CATEGORIE — 6 categorie principali con card sovrapposta al hero
 * ========================================================================== */
function CategoryLabels() {
  /* Filtra solo le 6 categorie principali (escludi ricambi e seconda-scelta) */
  const mainCategories = catalogMenu.filter(
    (c) => c.key !== 'ricambi' && c.key !== 'seconda-scelta'
  );

  return (
    <section className="relative z-20 mx-auto -mt-8 max-w-6xl px-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {mainCategories.map((cat) => (
          <Link
            key={cat.key}
            to={`/categoria/${cat.slug}`}
            className="flex flex-col items-center gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-md transition-all hover:shadow-lg hover:border-green-300"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              {categoryIcons[cat.key] ?? <Package className="h-6 w-6 text-green-600" />}
            </div>
            <span className="text-center text-sm font-bold text-gray-900">{cat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ==========================================================================
 * C) TIPOLOGIA ATTIVITA — "Scegli per la tua attivita"
 * ========================================================================== */
function BusinessTypeSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-center text-3xl font-extrabold text-gray-900">
        Scegli per la tua attivita
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-gray-600">
        Attrezzature selezionate per ogni tipologia di attivita nel settore Ho.Re.Ca.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {businessTypes.map((bt) => {
          const Icon = bt.icon;
          return (
            <Link
              key={bt.slug}
              to={`/per-attivita/${bt.slug}`}
              className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-green-400 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                <Icon className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm font-bold text-gray-900">{bt.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ==========================================================================
 * D) PROPOSTE DI VALORE — "Perche scegliere BianchiPro"
 * ========================================================================== */
function ValuePropsSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Perche scegliere BianchiPro
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-gray-600">
          Da oltre 50 anni al servizio dei professionisti della ristorazione
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {valueProps.map((vp) => {
            const Icon = vp.icon;
            return (
              <div
                key={vp.title}
                className="flex gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50">
                  <Icon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{vp.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{vp.desc}</p>
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
 * E) RECENSIONI — Valutazioni dei clienti
 * ========================================================================== */
function ReviewsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          La voce dei professionisti
        </h2>
        <div className="mt-3 flex items-center justify-center gap-2">
          {/* Stelle di valutazione media */}
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-yellow-400/50 text-yellow-400/50'}`}
              />
            ))}
          </div>
          <span className="font-bold text-gray-900">4.7 / 5</span>
          <span className="text-gray-500">su Feedaty</span>
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            {/* Stelle della singola recensione */}
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                />
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-800 leading-relaxed">"{r.text}"</p>
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
    </section>
  );
}

/* ==========================================================================
 * F) PRODOTTI CONSIGLIATI — "I piu scelti dai professionisti"
 * ========================================================================== */
function RecommendedProducts() {
  /* Recupera i prodotti in base agli slug richiesti, mantenendo l'ordine */
  const products = featuredSlugs
    .map((slug) => realProducts.find((p) => p.slug === slug))
    .filter(Boolean);

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          I piu scelti dai professionisti
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-gray-600">
          Le attrezzature preferite dai nostri clienti Ho.Re.Ca.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            if (!product) return null;
            const hasDiscount = product.originalPriceNet && product.originalPriceNet > product.priceNet;
            const discountPct = hasDiscount
              ? Math.round((1 - product.priceNet / product.originalPriceNet!) * 100)
              : 0;

            return (
              <Link
                key={product.id}
                to={`/prodotto/${product.slug}`}
                className="group flex flex-col rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg hover:border-green-300"
              >
                {/* Immagine prodotto */}
                <div className="relative aspect-square overflow-hidden rounded-t-xl bg-gray-50">
                  <img
                    src={product.images[0] || heroImage}
                    alt={product.name}
                    className="h-full w-full object-contain p-4 transition-transform group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = heroImage;
                    }}
                  />
                  {/* Badge sconto */}
                  {hasDiscount && (
                    <span className="absolute left-2 top-2 rounded-md bg-orange-400 px-2 py-0.5 text-xs font-bold text-white">
                      -{discountPct}%
                    </span>
                  )}
                </div>

                {/* Dettagli prodotto */}
                <div className="flex flex-1 flex-col p-4">
                  {/* Badge categoria */}
                  <span className="mb-1 w-fit rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                    {product.categorySlug.replace(/-/g, ' ')}
                  </span>

                  {/* Brand */}
                  <span className="text-xs text-gray-500">{product.brand}</span>

                  {/* Nome prodotto */}
                  <h3 className="mt-1 line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-green-600">
                    {product.name}
                  </h3>

                  {/* Stelle */}
                  <div className="mt-2 flex items-center gap-1">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">({product.reviewCount})</span>
                  </div>

                  {/* Prezzo */}
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
                </div>
              </Link>
            );
          })}
        </div>

        {/* Pulsante per vedere tutto il catalogo */}
        <div className="mt-10 text-center">
          <Link
            to="/categoria/linea-caldo"
            className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-8 py-3 font-extrabold text-white hover:bg-green-600 transition-colors"
          >
            Scopri tutto il catalogo
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
 * G) CATEGORIE IN EVIDENZA — "Esplora il Catalogo"
 * ========================================================================== */
function FeaturedCategories() {
  const featured = catalogMenu.filter((c) => featuredCatalogKeys.includes(c.key));

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-center text-3xl font-extrabold text-gray-900">
        Esplora il Catalogo
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-gray-600">
        Naviga per categoria e trova esattamente cio che ti serve
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {featured.map((cat) => (
          <div
            key={cat.key}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            {/* Intestazione categoria */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                {categoryIcons[cat.key] ?? <Package className="h-5 w-5 text-green-600" />}
              </div>
              <Link
                to={`/categoria/${cat.slug}`}
                className="text-lg font-extrabold text-gray-900 hover:text-green-600"
              >
                {cat.label}
              </Link>
            </div>

            {/* Pill con sottocategorie */}
            <div className="mt-4 flex flex-wrap gap-2">
              {cat.groups.slice(0, 6).map((group) => (
                <Link
                  key={group.slug}
                  to={`/categoria/${cat.slug}/${group.slug}`}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-800 transition-all hover:bg-green-50 hover:border-green-400 hover:text-green-700"
                >
                  {group.title}
                </Link>
              ))}
            </div>

            {/* Link "vedi tutto" */}
            <Link
              to={`/categoria/${cat.slug}`}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#6B9BD1] hover:text-[#5A8AC0] transition-colors"
            >
              Vedi tutti
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ==========================================================================
 * H) SEZIONE PAUSA — Sfondo scuro con la storia di BianchiPro
 * ========================================================================== */
function PauseSection() {
  return (
    <section className="bg-[#111827] py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Colonna testo */}
          <div>
            <h2 className="text-3xl font-extrabold text-white">
              La qualita professionale,<br />dal 1965
            </h2>
            <p className="mt-4 leading-relaxed text-gray-300">
              BianchiPro nasce dalla passione per la ristorazione e dalla volonta
              di fornire ai professionisti le migliori attrezzature Made in Italy.
              Da oltre mezzo secolo selezioniamo forni, abbattitori, frigoriferi e
              tutta la gamma di prodotti per l'Ho.Re.Ca., garantendo qualita,
              assistenza dedicata e prezzi competitivi.
            </p>
            <p className="mt-3 leading-relaxed text-gray-300">
              Ogni prodotto nel nostro catalogo e scelto con cura per rispondere
              alle esigenze reali di ristoranti, pizzerie, bar, hotel e
              catering professionali.
            </p>
            <Link
              to="/chi-siamo"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-500 px-8 py-3 font-extrabold text-white hover:bg-green-600 transition-colors"
            >
              Scopri la nostra storia
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Colonna immagine */}
          <div className="overflow-hidden rounded-2xl">
            <img
              src={heroImage}
              alt="Cucina professionale BianchiPro"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
 * I) GUIDE — "Le Guide di BianchiPro"
 * ========================================================================== */
function GuidesSection() {
  /* Prendi le prime 3 guide */
  const displayGuides = guides.slice(0, 3);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-center text-3xl font-extrabold text-gray-900">
        Le Guide di BianchiPro
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-gray-600">
        Consigli e approfondimenti per aiutarti nella scelta delle attrezzature
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayGuides.map((guide) => (
          <Link
            key={guide.id}
            to={`/guide/${guide.slug}`}
            className="group flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-green-300"
          >
            {/* Icona e categoria */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
                <BookOpen className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-green-700">{guide.category}</span>
            </div>

            {/* Titolo */}
            <h3 className="mt-3 text-lg font-bold text-gray-900 group-hover:text-green-600 line-clamp-2">
              {guide.title}
            </h3>

            {/* Estratto */}
            <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-3">
              {guide.excerpt}
            </p>

            {/* Tempo di lettura */}
            <div className="mt-4 flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span>{guide.readTime} min di lettura</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Link a tutte le guide */}
      <div className="mt-10 text-center">
        <Link
          to="/guide"
          className="inline-flex items-center gap-2 rounded-lg border border-[#6B9BD1] px-6 py-3 font-bold text-[#6B9BD1] hover:text-[#5A8AC0] hover:border-[#5A8AC0] transition-colors"
        >
          Tutte le guide
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}

/* ==========================================================================
 * HOMEPAGE — Composizione di tutte le sezioni (A -> I)
 * ========================================================================== */
export default function HomePage() {
  return (
    <main>
      {/* A) Hero con barra di ricerca */}
      <HeroSection />

      {/* B) Etichette categorie sovrapposte al hero */}
      <CategoryLabels />

      {/* C) Tipologia di attivita */}
      <BusinessTypeSection />

      {/* D) Proposte di valore */}
      <ValuePropsSection />

      {/* E) Recensioni clienti */}
      <ReviewsSection />

      {/* F) Prodotti consigliati */}
      <RecommendedProducts />

      {/* G) Categorie in evidenza */}
      <FeaturedCategories />

      {/* H) Sezione pausa — storia BianchiPro */}
      <PauseSection />

      {/* I) Guide professionali */}
      <GuidesSection />
    </main>
  );
}
