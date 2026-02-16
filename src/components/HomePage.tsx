import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Star } from 'lucide-react';
import heroImage from '../assets/f4ed0b934aabb9cdf06af64854509a5ac97f8256.png';
import { catalogMenu } from '../data/catalogMenu';
import { realProducts } from '../data/products/realProducts';
import { companyInfo } from '../data/companyInfo';
import { useRef, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

/* ═══════ DATI STATICI ═══════ */

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

const businessTypes = [
  { label: 'Pizzeria', slug: 'pizzeria', emoji: '\uD83C\uDF55' },
  { label: 'Ristorante', slug: 'ristorante', emoji: '\uD83C\uDF7D' },
  { label: 'Bar e Gelateria', slug: 'bar-gelateria', emoji: '\u2615' },
  { label: 'Macelleria', slug: 'macelleria', emoji: '\uD83E\uDD69' },
  { label: 'Pasticceria', slug: 'pasticceria', emoji: '\uD83C\uDF70' },
  { label: 'Hotel', slug: 'hotel', emoji: '\uD83C\uDFE8' },
  { label: 'Catering', slug: 'catering-mensa', emoji: '\uD83C\uDF7E' },
  { label: 'Panetteria', slug: 'panetteria', emoji: '\uD83C\uDF5E' },
  { label: 'Food Truck', slug: 'food-truck', emoji: '\uD83D\uDE9A' },
];

const promoBanners = [
  { title: 'Offerte Linea Freddo', desc: 'Scopri le migliori offerte su abbattitori, frigoriferi e congelatori professionali.', link: '/categoria/linea-freddo' },
  { title: 'Forni Professionali', desc: 'Selezione premium di forni per pizza, convezione e professionali a prezzi imbattibili.', link: '/categoria/linea-caldo/forni-professionali' },
  { title: 'Preparazione e Lavorazione', desc: 'Impastatrici, affettatrici e tutto per la preparazione professionale degli alimenti.', link: '/categoria/preparazione' },
];

const reviews = [
  { name: 'Marco R.', city: 'Milano', rating: 5, text: 'Servizio eccellente, abbattitore arrivato in 3 giorni. Imballaggio perfetto e assistenza impeccabile.', date: '12/01/2025' },
  { name: 'Giulia T.', city: 'Roma', rating: 5, text: 'Prezzi imbattibili per i forni pizza. Gia il secondo ordine, sempre puntualissimi con le consegne.', date: '05/12/2024' },
  { name: 'Alessandro B.', city: 'Napoli', rating: 4, text: 'Frigorifero professionale di ottima qualita. Consiglio vivamente BianchiPro a tutti i colleghi ristoratori.', date: '18/11/2024' },
  { name: 'Laura F.', city: 'Firenze', rating: 5, text: 'Consulenza telefonica eccezionale. Mi hanno aiutato a scegliere l\'attrezzatura perfetta per il mio ristorante.', date: '02/10/2024' },
];

const detailCategoryKeys = ['linea-caldo', 'linea-freddo', 'preparazione', 'carrelli-arredo', 'hotellerie', 'igiene'];

const blogPosts = [
  { title: 'Guida alla sanificazione degli ambienti', date: '10 Gen 2025', slug: '/guide' },
  { title: 'Le tipologie di cottura', date: '22 Dic 2024', slug: '/guide' },
  { title: 'Guida al sottovuoto', date: '15 Dic 2024', slug: '/guide' },
  { title: 'Guida al microonde', date: '01 Dic 2024', slug: '/guide' },
];

/* ═══════ 1 · HERO ═══════ */
function HeroSection() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden">
      <img src={heroImage} alt="Cucina professionale" className="absolute inset-0 h-full w-full object-cover" />
      <div className="relative z-10 mx-auto w-full max-w-[1260px] px-6 py-20">
        <div className="max-w-lg rounded-2xl bg-white/80 p-10 shadow-lg backdrop-blur-md">
          <span className="text-sm font-semibold text-green-700">Bianchipro</span>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-gray-900 lg:text-[44px]">
            Soluzioni ed attrezzature professionali per la ristorazione
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-600">
            Siamo orgogliosi del Made in Italy, curiamo ogni dettaglio e puntiamo alla perfezione.
            Perche il vostro successo alimenta anche il nostro.
            Sempre al vostro fianco, con competenza, visione e responsabilita.
          </p>
          <Link to="/categoria/linea-caldo" className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-green-700 hover:text-green-800 transition-colors">
            Inizia da qui <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════ 2 · PRODOTTI SELEZIONATI (bozza: Prodotti selezionati.png) ═══════ */
function SelectedProductsCarousel() {
  const { addItem } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);

  const products = selectedProductSlugs
    .map((slug) => realProducts.find((p) => p.slug === slug))
    .filter(Boolean);

  const scroll = (dir: 'l' | 'r') => {
    scrollRef.current?.scrollBy({ left: dir === 'l' ? -320 : 320, behavior: 'smooth' });
  };

  const add = (p: NonNullable<(typeof products)[0]>) => {
    addItem({ id: `product-${p.id}-${Date.now()}`, name: p.name, price: p.priceNet, quantity: 1, image: p.images[0] || heroImage });
    toast.success('Prodotto aggiunto al carrello');
  };

  return (
    <section className="bg-[#f0f1f3] py-16">
      <div className="mx-auto max-w-[1260px] px-5">
        <h2 className="mb-10 text-center text-[28px] font-extrabold text-gray-900">Prodotti selezionati</h2>

        <div className="relative">
          {/* frecce */}
          <button onClick={() => scroll('l')} className="absolute -left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-green-600 text-white shadow-md hover:bg-green-700">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll('r')} className="absolute -right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-green-600 text-white shadow-md hover:bg-green-700">
            <ArrowRight className="h-4 w-4" />
          </button>

          <div ref={scrollRef} className="flex gap-5 overflow-x-auto scroll-smooth pb-2" style={{ scrollbarWidth: 'none' }}>
            {products.map((product) => {
              if (!product) return null;
              const hasDiscount = product.originalPriceNet && product.originalPriceNet > product.priceNet;

              return (
                <div key={product.id} className="group w-[260px] flex-shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-lg">
                  {/* badges */}
                  <div className="flex items-center justify-between px-4 pt-4">
                    <div className="flex gap-1.5">
                      {product.isNew && <span className="rounded-full bg-[#3b82f6] px-2.5 py-0.5 text-[10px] font-bold text-white">nuovo</span>}
                      {product.isOnSale && <span className="rounded-full bg-[#f59e0b] px-2.5 py-0.5 text-[10px] font-bold text-white">offerta</span>}
                    </div>
                    {hasDiscount && <span className="rounded-full bg-green-600 px-2.5 py-0.5 text-[10px] font-bold text-white">best seller</span>}
                  </div>

                  {/* image */}
                  <Link to={`/prodotto/${product.slug}`}>
                    <div className="flex aspect-square items-center justify-center bg-gray-50 p-6">
                      <img src={product.images[0] || heroImage} alt={product.name} className="h-full w-full object-contain transition-transform group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = heroImage; }} />
                    </div>
                  </Link>

                  {/* info */}
                  <div className="flex flex-col p-4">
                    <span className="mb-2 w-fit rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-[10px] font-semibold text-green-700">
                      {product.categorySlug.replace(/-/g, ' ')}
                    </span>
                    <Link to={`/prodotto/${product.slug}`}>
                      <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold text-gray-900 transition-colors group-hover:text-green-700">{product.name}</h3>
                    </Link>
                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <span className="text-lg font-extrabold text-gray-900">{product.priceNet.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                        {hasDiscount && <span className="ml-1 block text-xs text-green-700 line-through">{product.originalPriceNet!.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>}
                      </div>
                      <button onClick={() => add(product)} className="rounded-lg bg-green-600 px-4 py-2 text-[13px] font-bold text-white hover:bg-green-700 transition-colors">acquista</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════ 4 · SCEGLI PER LA TUA ATTIVITA ═══════ */
function BusinessTypeSection() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-[1260px] px-5">
        <h2 className="text-center text-2xl font-extrabold text-gray-900">Scegli per la tua attivita</h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-gray-500">Trova le attrezzature ideali per il tuo tipo di locale</p>
        <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {businessTypes.map((bt) => (
            <Link key={bt.slug} to={`/per-attivita/${bt.slug}`} className="group flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all hover:border-green-300 hover:shadow-sm">
              <span className="flex-shrink-0 text-xl">{bt.emoji}</span>
              <span className="text-xs font-bold text-gray-900 transition-colors group-hover:text-green-700">{bt.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════ 5 · PROPOSTE (bozza: Proposte.png) ═══════ */
function ProposalsSection() {
  return (
    <section className="bg-gradient-to-b from-green-50/60 to-gray-50 py-16">
      <div className="mx-auto max-w-[1260px] px-5">
        <h2 className="text-center text-2xl font-extrabold text-gray-900">Scopri le nostre proposte</h2>
        <p className="mt-2 text-center text-sm text-gray-500">Migliori offerte selezionate</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {promoBanners.map((b, i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg">
              <div className="h-48 overflow-hidden">
                <img src={heroImage} alt={b.title} className="h-full w-full object-cover" />
              </div>
              <div className="bg-gray-900/90 p-5">
                <h3 className="mb-1.5 text-base font-bold text-white">{b.title}</h3>
                <p className="mb-4 text-xs leading-relaxed text-gray-400">{b.desc}</p>
                <Link to={b.link} className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-green-700">
                  scopri l&apos;offerta
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════ 6 · CHI SIAMO ═══════ */
function AboutSection() {
  return (
    <section className="relative flex min-h-[400px] items-center overflow-hidden">
      <img src={heroImage} alt="BianchiPro" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gray-900/75" />
      <div className="relative z-10 mx-auto w-full max-w-[1260px] px-5 py-20">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full border border-green-600/30 bg-green-600/20 px-4 py-1.5 text-sm font-semibold text-green-300 backdrop-blur-sm">Bianchipro</span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white md:text-4xl">Soluzioni Made in Italy per la ristorazione</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-gray-300">{companyInfo.description}</p>
          <p className="mt-3 max-w-xl leading-relaxed text-gray-400">{companyInfo.mission}</p>
        </div>
      </div>
    </section>
  );
}

/* ═══════ 7 · RECENSIONI ═══════ */
function ReviewsSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1260px] px-5">
        <h2 className="text-center text-2xl font-extrabold text-gray-900">Leggi le recensioni</h2>
        <p className="mt-2 text-center text-sm text-gray-500">Scopri le recensioni dei nostri clienti</p>
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2">
            <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
            <span className="text-sm font-bold text-gray-900">{companyInfo.socialProof.averageRating}/5</span>
            <span className="text-xs text-gray-500">su {companyInfo.socialProof.platform}</span>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <div className="mb-2 flex gap-0.5">{[1,2,3,4,5].map(j => <Star key={j} className={`h-4 w-4 ${j <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />)}</div>
              <p className="mb-2 text-xs text-gray-400">{r.date}</p>
              <p className="line-clamp-3 text-sm leading-relaxed text-gray-700">&ldquo;{r.text}&rdquo;</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-xs font-bold text-green-700">{r.name.charAt(0)}</div>
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

/* ═══════ 8 · CATEGORIE IN EVIDENZA (bozza: card importanti categorie.png) ═══════
 *
 *  Ogni card: immagine sx + titolo/desc dx, 4 pill (2 verdi, 2 scuri) in griglia 2x2,
 *  pulsante "visualizza tutto →" full-width
 */
function CategoryDetailCards() {
  const cats = detailCategoryKeys.map((k) => catalogMenu.find((c) => c.key === k)).filter(Boolean);

  return (
    <section className="bg-[#1a2332] py-14">
      <div className="mx-auto max-w-[1260px] px-5">
        <h2 className="mb-2 text-center text-2xl font-extrabold text-white">Categorie in evidenza</h2>
        <p className="mx-auto mb-10 max-w-lg text-center text-sm text-gray-400">Naviga per categoria e trova cio che ti serve</p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((cat) => {
            if (!cat) return null;
            const pills = cat.groups.slice(0, 4);
            return (
              <div key={cat.key} className="flex h-[340px] flex-col rounded-2xl bg-white p-5">
                {/* top: img + testo */}
                <div className="mb-4 flex gap-4">
                  <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 p-2">
                    <img src={heroImage} alt={cat.label} className="h-full w-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{cat.label}</h3>
                    <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-gray-500">{cat.description}</p>
                  </div>
                </div>

                {/* 4 pill 2x2 */}
                <div className="mb-4 grid grid-cols-2 gap-2">
                  {pills.map((g, idx) => (
                    <Link
                      key={g.slug}
                      to={`/categoria/${cat.slug}/${g.slug}`}
                      className={`truncate rounded-full px-3 py-2 text-center text-xs font-semibold text-white transition-opacity hover:opacity-80 ${idx < 2 ? 'bg-green-600' : 'bg-[#3a5068]'}`}
                    >
                      {g.title}
                    </Link>
                  ))}
                </div>

                {/* visualizza tutto */}
                <Link
                  to={`/categoria/${cat.slug}`}
                  className="mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-[#3a5068] py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                >
                  visualizza tutto <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════ 9 · BLOG (bozza: Sezione blog.png) ═══════ */
function BlogSection() {
  return (
    <section className="bg-white">
      {/* hero con frosted panel */}
      <div className="relative flex min-h-[420px] items-center overflow-hidden">
        <img src={heroImage} alt="Blog" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gray-900/40" />
        <div className="relative z-10 mx-auto w-full max-w-[1260px] px-5 py-16">
          <div className="max-w-lg rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-md">
            <span className="mb-3 inline-block text-sm font-semibold text-green-700">Bianchipro</span>
            <h2 className="text-3xl font-extrabold leading-tight text-gray-900">Dietro le quinte del mondo della ristorazione</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Scopri il nostro blog e leggi tutti gli articoli e le guide utili dedicati al mondo Ho.Re.Ca.
              Idee, novita ed innovazioni utili a rendere la tua attivita piu efficiente.
            </p>
            <Link to="/guide" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-green-700 hover:text-green-800 transition-colors">
              Vedi tutti gli articoli <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 blog cards */}
      <div className="mx-auto max-w-[1260px] px-5 py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {blogPosts.map((post, i) => (
            <Link key={i} to={post.slug} className="group overflow-hidden rounded-2xl bg-white transition-shadow hover:shadow-md">
              <div className="h-40 overflow-hidden">
                <img src={heroImage} alt={post.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 flex-shrink-0 rounded-full bg-green-600" />
                  <span className="text-xs text-gray-400">{post.date}</span>
                </div>
                <h3 className="line-clamp-2 text-sm font-bold text-gray-900 transition-colors group-hover:text-green-700">{post.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════ 10 · NEWSLETTER ═══════ */
function NewsletterSection() {
  const [email, setEmail] = useState('');
  return (
    <section className="bg-[#1a2332]">
      <div className="mx-auto flex max-w-[1260px] flex-col gap-8 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h3 className="mb-1 text-xl font-bold text-white">Iscriviti alla Newsletter</h3>
          <p className="mb-4 text-sm text-gray-400">Ricevi offerte esclusive e novita direttamente nella tua casella email.</p>
          <div className="flex max-w-md gap-2">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="La tua email" className="flex-1 rounded-lg border-0 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300" />
            <button onClick={() => { toast.success('Iscrizione avvenuta!'); setEmail(''); }} className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-green-700">Iscriviti</button>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <h4 className="text-base font-bold text-white">Seguici</h4>
          <div className="flex gap-3">
            {['M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
              'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
            ].map((d, i) => (
              <a key={i} href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white transition-colors hover:bg-green-700">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d={d} /></svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════ HOME PAGE ═══════ */
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <SelectedProductsCarousel />
      <BusinessTypeSection />
      <ProposalsSection />
      <AboutSection />
      <ReviewsSection />
      <CategoryDetailCards />
      <BlogSection />
      <NewsletterSection />
    </main>
  );
}
