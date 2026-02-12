import { ArrowRight, BadgeEuro, Compass, Globe, ShieldCheck, Truck, Wrench } from 'lucide-react';
import heroImage from '../assets/f4ed0b934aabb9cdf06af64854509a5ac97f8256.png';

interface HomePageProps {
  onOpenProduct: () => void;
}

const valueCards = [
  { title: 'Abbiamo prezzi super competitivi', subtitle: 'Scopri i prodotti', icon: BadgeEuro },
  { title: 'Spedizioni e consegne rapide', subtitle: 'Prepara il tuo ordine', icon: Truck },
  { title: 'Installazione e servizi aggiuntivi', subtitle: 'Scopri di più', icon: Wrench },
  { title: 'Reali consulenze specializzate', subtitle: 'Come lavoriamo', icon: Compass },
  { title: 'Vasto e selezionato catalogo prodotti', subtitle: 'Inizia i tuoi acquisti', icon: Globe },
  { title: 'Transazioni e pagamenti sicuri', subtitle: 'Domande Frequenti', icon: ShieldCheck },
];

export default function HomePage({ onOpenProduct }: HomePageProps) {
  return (
    <main className="bg-[#e9ecef] pb-16">
      <section className="relative min-h-[420px] overflow-hidden border-b border-slate-200">
        <img src={heroImage} alt="Cucina professionale" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-slate-900/25" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-2xl rounded-3xl border border-white/80 bg-white/85 p-8 backdrop-blur-sm">
            <p className="text-sm font-bold text-emerald-700">Bianchipro</p>
            <h1 className="mt-2 text-4xl font-extrabold leading-tight text-slate-800">Soluzioni ed attrezzature professionali per la ristorazione</h1>
            <p className="mt-4 text-base text-slate-700">Siamo orgogliosi del Made in Italy, curiamo ogni dettaglio e puntiamo alla perfezione.</p>
            <button onClick={onOpenProduct} className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">
              Inizia da qui
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-4 grid max-w-7xl grid-cols-1 gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {valueCards.map(({ title, subtitle, icon: Icon }) => (
          <article key={title} className="rounded-3xl border border-emerald-200 bg-[#f4fbf7] p-5 shadow-sm">
            <Icon className="h-8 w-8 text-emerald-600" />
            <h3 className="mt-4 text-xl leading-6 font-bold text-slate-700">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">{subtitle} →</p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-4xl font-extrabold text-slate-700">Prodotti selezionati</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((idx) => (
            <article key={idx} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <img src={heroImage} alt="Prodotto" className="h-44 w-full rounded-2xl object-cover" />
              <p className="mt-3 inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">categoria prodotto</p>
              <h3 className="mt-2 text-base font-bold text-slate-800">Nome completo del prodotto disposto su massimo due righe</h3>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">1.250,00€</p>
                  <p className="text-sm text-violet-300 line-through">2.500,00€</p>
                </div>
                <button onClick={onOpenProduct} className="rounded-full bg-emerald-500 px-3 py-1.5 text-sm font-bold text-white hover:bg-emerald-600">acquista</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0b1531] py-12 text-white mt-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <img src={heroImage} alt="Team Bianchi" className="h-full w-full rounded-3xl object-cover" />
          <div>
            <p className="text-sm font-semibold text-emerald-300">Bianchipro</p>
            <h2 className="mt-2 text-4xl font-extrabold leading-tight">Soluzioni Made in Italy per la ristorazione</h2>
            <p className="mt-5 text-sm leading-relaxed text-slate-200">Crediamo che una cucina professionale non sia solo un luogo di lavoro, ma il cuore operativo di ogni successo. Da oltre generazioni selezioniamo attrezzature affidabili e supportiamo i professionisti nel loro lavoro quotidiano.</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">Sempre al vostro fianco, con competenza, visione e responsabilità.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
