import { Link } from 'react-router-dom';
import {
  Award,
  Users,
  Truck,
  HeadphonesIcon,
  ShieldCheck,
  Heart,
  Building2,
  Store,
} from 'lucide-react';

const strengthCards = [
  {
    icon: Award,
    title: "Dagli anni '60",
    description: 'Oltre 50 anni di esperienza nel settore Ho.Re.Ca. con due generazioni di competenza.',
  },
  {
    icon: Users,
    title: 'Impresa familiare',
    description: 'Enrico e Alberto Bianchi portano avanti la tradizione del fondatore Giorgio.',
  },
  {
    icon: Truck,
    title: 'Consegna in tutta Italia',
    description: 'Spedizioni con corrieri espressi e trasporti specializzati per merce voluminosa.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Assistenza diretta',
    description: 'Supporto via telefono, email e WhatsApp con presa in carico rapida.',
  },
  {
    icon: ShieldCheck,
    title: 'Garanzia professionale',
    description: 'Garanzia 12 mesi sui prodotti professionali per coprire eventuali vizi di fabbrica.',
  },
  {
    icon: Heart,
    title: 'Filiera italiana',
    description: 'Collaborazioni dirette con produttori italiani: meno intermediari, piu valore.',
  },
];

export default function AboutPage() {
  return (
    <main className="app-page-shell py-10 mb-20 space-y-10">
      <section className="rounded-3xl border border-green-100 bg-gradient-to-br from-white via-green-50 to-white p-8 md:p-10 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-[1.4fr,0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-green-700 mb-3">
              Storia e identita
            </p>
            <h1 className="app-page-title text-4xl font-extrabold text-gray-900 mb-4">La nostra Azienda</h1>
            <p className="app-page-subtitle text-lg text-gray-700 leading-relaxed mb-4">
              Bianchi Pro nasce negli anni &#39;60 dall&#39;iniziativa di Giorgio Bianchi e oggi e gestita da
              Enrico e Alberto Bianchi. Da oltre 50 anni supportiamo ristoranti, bar, pasticcerie e strutture
              ricettive con attrezzature professionali affidabili.
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
              La nostra idea e semplice: vendita online con consulenza reale. Acquistare in digitale non deve
              significare rinunciare al confronto con persone competenti.
            </p>
          </div>

          <div className="rounded-2xl border border-green-200 bg-white p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-green-100 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Sede</p>
                <p className="text-sm font-semibold text-gray-900">Santarcangelo di Romagna (RN)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-green-100 flex items-center justify-center">
                <Store className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Modello</p>
                <p className="text-sm font-semibold text-gray-900">Consulenza + e-commerce B2B</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Collaboriamo direttamente con produttori italiani come Fimar, Fama, Forcar e SPM per mantenere
              prezzi competitivi e controllo qualita lungo tutta la filiera.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-8 md:p-10 shadow-sm">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">La nostra filosofia</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Niente acquisti impulsivi</h3>
            <p className="text-gray-600 leading-relaxed">
              Non inseguiamo vendite veloci: preferiamo guidarti verso la scelta corretta, anche quando significa
              suggerire una soluzione diversa dal primo prodotto visto.
            </p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Consulenza su misura</h3>
            <p className="text-gray-600 leading-relaxed">
              Ogni attivita Ho.Re.Ca ha esigenze specifiche. Ti aiutiamo a comporre una dotazione tecnica
              coerente con spazio, volume di lavoro e budget.
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-8 md:p-10 shadow-sm">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Perche scegliere Bianchi Pro</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {strengthCards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="mb-3 h-11 w-11 rounded-xl bg-green-100 flex items-center justify-center">
                <card.icon className="h-5 w-5 text-green-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{card.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-[#1a2332] p-8 md:p-10 text-white">
        <h2 className="text-2xl font-extrabold mb-3">Hai bisogno di una consulenza tecnica?</h2>
        <p className="text-gray-300 max-w-2xl mb-6">
          Ti aiutiamo a individuare le attrezzature giuste per la tua attivita e a costruire un preventivo
          completo con tempi e costi chiari.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="tel:+390541620526"
            className="inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700 transition-colors"
          >
            Chiamaci: 0541 620526
          </a>
          <Link
            to="/contatti"
            className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-bold text-white hover:bg-white/20 transition-colors"
          >
            Scrivici
          </Link>
        </div>
      </section>
    </main>
  );
}
