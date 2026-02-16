/**
 * FaqPage.tsx — Pagina FAQ (Domande Frequenti)
 *
 * Contiene 34 domande e risposte REALI estratte dalla pagina FAQ di bianchipro.it,
 * organizzate in 6 categorie:
 *
 * 1. Consegne (9 domande) — corrieri, tempi, assicurazione, ritiro in sede, estero
 * 2. Pagamenti (6 domande) — metodi accettati, Postepay, sicurezza
 * 3. Fatturazione e Garanzia (6 domande) — fattura elettronica, SDI, garanzia 12 mesi
 * 4. Assistenza Post Vendita (3 domande) — contatti, ricambi, recensioni
 * 5. Prodotti e Prezzi (6 domande) — disponibilità, sconti, IVA esclusa
 * 6. Ordini (4 domande) — stato ordine, modifiche, registrazione opzionale
 *
 * Funzionalità:
 * - Barra di ricerca che filtra domande e risposte in tempo reale
 * - Accordion espandibile per ogni domanda (click per aprire/chiudere)
 * - CTA in fondo per contattare l'assistenza se la risposta non è stata trovata
 *
 * Rotta: /faq
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, ChevronUp, Search } from 'lucide-react';

const faqs = [
  {
    category: 'Consegne',
    questions: [
      { q: 'Come posso conoscere le spese di spedizione?', a: 'Le spese di spedizione per un singolo prodotto si possono consultare nella sezione "Spedizione" all\'interno della scheda prodotto.' },
      { q: 'Posso inserire un indirizzo di spedizione diverso da quello di fatturazione?', a: 'Sì, durante il checkout è possibile cliccare su "Inserisci nuovo indirizzo di spedizione" per specificare una destinazione differente.' },
      { q: 'Quali corrieri utilizzate?', a: 'Utilizziamo diversi corrieri: corrieri Espressi come SDA, GLS, DHL o BRT che consegnano in 24/48h in tutta Italia, e corrieri specializzati come ARCESE e FERCAM per merce voluminosa.' },
      { q: 'È possibile assicurare le spedizioni?', a: 'Sì, è disponibile un\'assicurazione extra per il rimborso totale del valore della merce in caso di danni durante il trasporto.' },
      { q: 'Posso ritirare personalmente il prodotto?', a: 'Sì, è possibile ritirare personalmente la maggior parte dei prodotti presso il nostro punto vendita di Santarcangelo di Romagna (Rimini).' },
      { q: 'Posso ricevere merce all\'estero?', a: 'Quasi tutti i prodotti possono essere spediti all\'estero. Contattaci per ricevere un preventivo personalizzato di spedizione.' },
      { q: 'Cosa devo fare quando ricevo la merce?', a: 'Verificare l\'integrità dei pacchi, firmare con riserva di controllo e segnalare eventuali anomalie per far valere l\'assicurazione.' },
      { q: 'Come posso installare i prodotti acquistati?', a: 'L\'installazione può essere effettuata da qualunque tecnico abilitato. L\'assemblaggio dei carrelli non richiede specifiche competenze tecniche.' },
      { q: 'Cosa significa consegna a "Bordo Strada"?', a: 'La consegna standard prevede che il corriere consegni la merce al piano terra, senza percorrere rampe o scalini. Per consegne al piano, contattaci per un preventivo dedicato.' },
    ],
  },
  {
    category: 'Pagamenti',
    questions: [
      { q: 'Quali metodi di pagamento accettate?', a: 'Accettiamo bonifico bancario, carta di credito (Visa, Mastercard, American Express), vaglia postale, PayPal (solo alcuni prodotti) e contrassegno (solo alcuni prodotti).' },
      { q: 'Quali sono i metodi più immediati?', a: 'Carta di credito, PayPal o contrassegno permettono la gestione immediata dell\'ordine senza tempi di attesa.' },
      { q: 'Accettate Postepay?', a: 'Sì, se il pagamento viene effettuato tramite la modalità carta di credito.' },
      { q: 'Se ritiro in negozio posso pagare al momento?', a: 'Versando un acconto anticipato come prenotazione del prodotto è possibile successivamente effettuare il saldo della merce al momento del ritiro.' },
      { q: 'Il pagamento con carta di credito è sicuro?', a: 'Assolutamente sì. Abbiamo scelto il livello di sicurezza massimo per garantire totale protezione dei tuoi dati durante la transazione.' },
      { q: 'I miei dati bancari sono protetti?', a: 'Nel pagamento con bonifico bancario, nessun dato sarà visibile da noi o da terzi, oltre alla tua banca.' },
    ],
  },
  {
    category: 'Fatturazione e Garanzia',
    questions: [
      { q: 'Emettete la fattura?', a: 'Sì, la fattura elettronica verrà inviata automaticamente nel cassetto fiscale, entro pochi giorni dall\'ordine.' },
      { q: 'Ho inserito dati di fatturazione errati, cosa faccio?', a: 'Contattaci comunicando i riferimenti dell\'ordine e le modifiche necessarie. Provvederemo alla correzione.' },
      { q: 'Quanto dura la garanzia?', a: 'La garanzia per tutti i prodotti ad utilizzo professionale è di 12 mesi. La garanzia copre eventuali vizi di fabbrica.' },
      { q: 'Effettuate fatturazione per pubbliche amministrazioni?', a: 'No, al momento non aderiamo al MEPA (Mercato Elettronico della Pubblica Amministrazione).' },
      { q: 'Potete emettere fattura in esenzione IVA?', a: 'Sì, in presenza dei requisiti necessari previsti dalla normativa vigente.' },
      { q: 'Sono un privato, posso acquistare?', a: 'Alcuni prodotti possono essere acquistati anche da consumatori privati. Contattaci per verificare la disponibilità specifica.' },
    ],
  },
  {
    category: 'Assistenza Post Vendita',
    questions: [
      { q: 'A chi posso rivolgermi per assistenza in garanzia?', a: 'Puoi contattarci via e-mail (clienti@bianchipro.it), telefono (+39 0541 620526) o WhatsApp. Ti aiuteremo a risolvere qualsiasi problema.' },
      { q: 'Ho bisogno di ricambi specifici, come faccio?', a: 'Visita la nostra sezione ricambi oppure contattaci fornendo marca, modello e possibilmente una foto dell\'etichetta del prodotto.' },
      { q: 'Posso lasciare una recensione?', a: 'Certamente! Puoi farlo su Feedaty o sulla nostra pagina Google. Le tue opinioni ci aiutano a migliorare.' },
    ],
  },
  {
    category: 'Prodotti e Prezzi',
    questions: [
      { q: 'Come posso cercare un prodotto?', a: 'Puoi utilizzare la barra di ricerca in alto per cercare per modello o codice, oppure navigare le categorie dal menu principale.' },
      { q: 'I prodotti sono sempre disponibili?', a: 'Nella maggior parte dei casi sì. In caso di ritardi ti avviseremo tempestivamente.' },
      { q: 'Posso richiedere sconti per acquisti multipli?', a: 'Sì, contattaci per ricevere offerte personalizzate su acquisti di più prodotti.' },
      { q: 'I prezzi sono uguali online e in negozio?', a: 'Sì, i prezzi sono identici sia online che presso il nostro punto vendita.' },
      { q: 'Perché i vostri prezzi sono così bassi?', a: 'Lavoriamo a diretto contatto con i produttori, eliminando gli intermediari. Questo ci permette di offrire prezzi competitivi.' },
      { q: 'I prezzi comprendono l\'IVA?', a: 'No, i prezzi pubblicati sono sempre al netto dell\'IVA (22%).' },
    ],
  },
  {
    category: 'Ordini',
    questions: [
      { q: 'Come posso verificare lo stato del mio ordine?', a: 'Accedi alla tua Area Cliente per verificare lo stato di tutti i tuoi ordini in tempo reale.' },
      { q: 'Posso modificare o annullare l\'ordine?', a: 'Solo prima che venga gestito dal nostro magazzino. Comunicaci la richiesta via email il prima possibile.' },
      { q: 'Devo registrarmi per acquistare?', a: 'No, per effettuare acquisti non è obbligatorio registrarsi. Puoi acquistare anche come Ospite.' },
      { q: 'Perché registrarsi alla newsletter?', a: 'La newsletter ti permette di restare aggiornato su novità, sconti esclusivi e guide utili per la tua attività.' },
    ],
  },
];

export default function FaqPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const toggle = (key: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filteredFaqs = searchQuery.trim()
    ? faqs.map(section => ({
        ...section,
        questions: section.questions.filter(
          ({ q, a }) =>
            q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(section => section.questions.length > 0)
    : faqs;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 mb-20">
      <nav className="flex items-center space-x-2 text-sm mb-8">
        <Link to="/" className="text-gray-600 hover:text-green-600">Home</Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium">FAQ</span>
      </nav>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Domande Frequenti</h1>
      <p className="text-lg text-gray-600 mb-6">
        Risposte alle domande più comuni dei nostri clienti professionisti.
      </p>

      {/* Barra di ricerca */}
      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Cerca nelle FAQ..."
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
        />
      </div>

      <div className="space-y-8">
        {filteredFaqs.map(section => (
          <div key={section.category}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{section.category}</h2>
            <div className="space-y-2">
              {section.questions.map(({ q, a }) => {
                const key = `${section.category}-${q}`;
                const isOpen = openItems.has(key);
                return (
                  <div key={key} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <button onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50">
                      <span className="font-medium text-gray-900 pr-4">{q}</span>
                      {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4">
                        <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">Nessun risultato trovato per "{searchQuery}"</p>
            <p className="text-sm text-gray-400">Prova con parole chiave diverse o <Link to="/contatti" className="text-green-600 hover:underline">contattaci</Link> direttamente.</p>
          </div>
        )}
      </div>

      {/* CTA contatti */}
      <div className="mt-12 bg-green-50 rounded-2xl border border-green-200 p-6 text-center">
        <h3 className="font-bold text-green-900 text-lg mb-2">Non hai trovato la risposta che cercavi?</h3>
        <p className="text-green-700 text-sm mb-4">
          Il nostro team è a disposizione per rispondere a qualsiasi domanda.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="tel:+390541620526" className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors text-sm">
            Chiama: 0541 620526
          </a>
          <Link to="/contatti" className="px-5 py-2.5 bg-white border border-green-300 text-green-700 font-bold rounded-xl hover:bg-green-100 transition-colors text-sm">
            Scrivici
          </Link>
        </div>
      </div>
    </main>
  );
}
