/**
 * AboutPage.tsx — Pagina "Chi Siamo"
 *
 * Racconta la storia reale dell'azienda BianchiPro:
 * - Fondata negli anni '60 da Giorgio Bianchi
 * - Oggi gestita dai figli Enrico e Alberto (seconda generazione)
 * - Sede a Santarcangelo di Romagna (Rimini)
 * - Filosofia: consulenza personalizzata, NO acquisto d'impulso
 * - Collaborazioni dirette con produttori italiani (Fimar, Fama, Forcar, SPM)
 *
 * Sezioni:
 * 1. Hero con storia aziendale
 * 2. Filosofia ("Non siamo Amazon")
 * 3. Punti di forza (6 card con icone)
 * 4. Target clienti (ristoratori, albergatori, baristi)
 * 5. CTA per consulenza/contatto
 *
 * Rotta: /chi-siamo
 */
import { Link } from 'react-router-dom';
import { ChevronRight, Award, Users, Truck, HeadphonesIcon, ShieldCheck, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 mb-20">
      <nav className="flex items-center space-x-2 text-sm mb-8">
        <Link to="/" className="text-gray-600 hover:text-green-600">Home</Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium">Chi Siamo</span>
      </nav>

      {/* Hero */}
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Chi Siamo</h1>
        <p className="text-lg text-gray-600 max-w-3xl mb-6">
          Bianchi Pro è un'impresa familiare gestita da <strong>Enrico e Alberto Bianchi</strong>, figli del fondatore
          Giorgio che creò l'azienda negli anni '60. Da oltre 50 anni operiamo nel settore delle attrezzature
          professionali per la ristorazione e l'hotellerie.
        </p>
        <p className="text-gray-600 max-w-3xl mb-6">
          Siamo specializzati in attrezzature per ristoranti, bar, pasticcerie e strutture ricettive.
          Il nostro obiettivo è unire qualità e prezzi competitivi mantenendo relazioni personali autentiche,
          perché <em>acquistare online non significa necessariamente rinunciare al rapporto con le persone</em>.
        </p>
        <p className="text-gray-600 max-w-3xl">
          Lavoriamo a diretto contatto con i produttori italiani — Fimar, Fama, Forcar, SPM — eliminando
          gli intermediari. Questo ci permette di offrire prezzi competitivi senza compromettere la qualità
          e il servizio di consulenza.
        </p>
      </section>

      {/* La nostra filosofia */}
      <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">La nostra filosofia</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Non siamo Amazon</h3>
            <p className="text-gray-600">
              Non miriamo all'acquisto d'impulso. Privilegiamo acquisti consapevoli e siamo pronti a
              rifiutare una vendita quando riteniamo che il prodotto non sia adatto al cliente.
              La vostra soddisfazione viene prima del fatturato.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Consulenza personalizzata</h3>
            <p className="text-gray-600">
              Ogni attività è diversa. Che tu stia aprendo una pizzeria, un ristorante o un hotel,
              il nostro team è disponibile per consigliarti le attrezzature giuste per le tue esigenze
              specifiche e il tuo budget.
            </p>
          </div>
        </div>
      </section>

      {/* Numeri e punti di forza */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {[
          { icon: Award, title: 'Dagli anni \'60', desc: 'Oltre 50 anni di esperienza nel settore Ho.Re.Ca., due generazioni di competenza.' },
          { icon: Users, title: 'Impresa Familiare', desc: 'Enrico e Alberto Bianchi portano avanti la tradizione del fondatore Giorgio.' },
          { icon: Truck, title: 'Consegna in tutta Italia', desc: 'Spedizioni con SDA, GLS, DHL, BRT. Corrieri specializzati ARCESE e FERCAM per merce voluminosa.' },
          { icon: HeadphonesIcon, title: 'Assistenza Diretta', desc: 'Supporto telefonico, email e WhatsApp. Rispondiamo entro 24 ore lavorative.' },
          { icon: ShieldCheck, title: 'Garanzia 12 Mesi', desc: 'Tutti i prodotti professionali sono coperti da garanzia del produttore contro vizi di fabbrica.' },
          { icon: Heart, title: 'Produttori Italiani', desc: 'Collaborazioni dirette con Fimar, Fama, Forcar e SPM. Nessun intermediario, prezzi competitivi.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <Icon className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-bold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{desc}</p>
          </div>
        ))}
      </div>

      {/* I nostri clienti */}
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">A chi ci rivolgiamo</h2>
        <p className="text-gray-600 mb-4">
          Serviamo ristoratori, albergatori, baristi, gestori di agriturismi, pizzerie e tutte le strutture
          di ospitalità professionale. La vendita è riservata a possessori di Partita IVA.
        </p>
        <p className="text-gray-600">
          Offriamo consulenza online e la possibilità di visitare la nostra sede a
          Santarcangelo di Romagna (Rimini), dove potrai vedere e toccare con mano i prodotti
          prima dell'acquisto.
        </p>
      </section>

      {/* CTA */}
      <section className="bg-[#1a2332] text-white rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Hai bisogno di una consulenza?</h2>
        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          Contattaci per un preventivo personalizzato o per ricevere consigli sulle attrezzature
          più adatte alla tua attività.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="tel:+390541620526" className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors">
            Chiamaci: 0541 620526
          </a>
          <Link to="/contatti" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors">
            Scrivici
          </Link>
        </div>
      </section>
    </main>
  );
}
