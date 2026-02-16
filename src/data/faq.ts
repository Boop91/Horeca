export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  title: string;
  slug: string;
  items: FaqItem[];
}

export const faqData: FaqCategory[] = [
  {
    title: 'Consegne',
    slug: 'consegne',
    items: [
      {
        question: 'Come posso conoscere le spese di spedizione?',
        answer:
          "Le spese di spedizione per un singolo prodotto si possono consultare nella sezione 'Spedizione' all'interno della scheda prodotto.",
      },
      {
        question:
          'Posso inserire un indirizzo di spedizione diverso da quello di fatturazione?',
        answer:
          "Sì, durante il checkout è possibile cliccare su 'Inserisci nuovo indirizzo di spedizione' per specificare una destinazione differente.",
      },
      {
        question: 'Quali corrieri utilizzate?',
        answer:
          'Utilizziamo diversi corrieri: corrieri Espressi come SDA, GLS, DHL o BRT che consegnano in 24/48h in tutta Italia, e corrieri specializzati come ARCESE e FERCAM per merce voluminosa.',
      },
      {
        question: 'È possibile assicurare le spedizioni?',
        answer:
          "Sì, è disponibile un'assicurazione extra per il rimborso totale del valore della merce in caso di danni durante il trasporto.",
      },
      {
        question: 'Posso ritirare personalmente il prodotto?',
        answer:
          'Sì, è possibile ritirare personalmente la maggior parte dei prodotti presso il nostro punto vendita di Santarcangelo di Romagna (Rimini).',
      },
      {
        question: 'Posso ricevere merce all\'estero?',
        answer:
          'Quasi tutti i prodotti possono essere spediti all\'estero. Contattaci per ricevere un preventivo personalizzato di spedizione.',
      },
      {
        question: 'Cosa devo fare quando ricevo la merce?',
        answer:
          "Verificare l'integrità dei pacchi, firmare con riserva di controllo e segnalare eventuali anomalie per far valere l'assicurazione.",
      },
      {
        question: 'Come posso installare i prodotti acquistati?',
        answer:
          "L'installazione può essere effettuata da qualunque tecnico abilitato. L'assemblaggio dei carrelli non richiede specifiche competenze tecniche.",
      },
      {
        question: "Cosa significa consegna a 'Bordo Strada'?",
        answer:
          'La consegna standard prevede che il corriere consegni la merce al piano terra, senza percorrere rampe o scalini. Per consegne al piano, contattaci per un preventivo dedicato.',
      },
    ],
  },
  {
    title: 'Pagamenti',
    slug: 'pagamenti',
    items: [
      {
        question: 'Quali metodi di pagamento accettate?',
        answer:
          'Accettiamo bonifico bancario, carta di credito (Visa, Mastercard, American Express), vaglia postale, PayPal (solo alcuni prodotti) e contrassegno (solo alcuni prodotti).',
      },
      {
        question: 'Quali sono i metodi più immediati?',
        answer:
          "Carta di credito, PayPal o contrassegno permettono la gestione immediata dell'ordine senza tempi di attesa.",
      },
      {
        question: 'Accettate Postepay?',
        answer:
          'Sì, se il pagamento viene effettuato tramite la modalità carta di credito.',
      },
      {
        question: 'Se ritiro in negozio posso pagare al momento?',
        answer:
          'Versando un acconto anticipato come prenotazione del prodotto è possibile successivamente effettuare il saldo della merce al momento del ritiro.',
      },
      {
        question: 'Il pagamento con carta di credito è sicuro?',
        answer:
          'Assolutamente sì. Abbiamo scelto il livello di sicurezza massimo per garantire totale protezione dei tuoi dati durante la transazione.',
      },
      {
        question: 'I miei dati bancari sono protetti?',
        answer:
          'Nel pagamento con bonifico bancario, nessun dato sarà visibile da noi o da terzi, oltre alla tua banca.',
      },
    ],
  },
  {
    title: 'Fatturazione e Garanzia',
    slug: 'fatturazione-e-garanzia',
    items: [
      {
        question: 'Emettete la fattura?',
        answer:
          "Sì, la fattura elettronica verrà inviata automaticamente nel cassetto fiscale, entro pochi giorni dall'ordine.",
      },
      {
        question: 'Ho inserito dati di fatturazione errati, cosa faccio?',
        answer:
          "Contattaci comunicando i riferimenti dell'ordine e le modifiche necessarie. Provvederemo alla correzione.",
      },
      {
        question: 'Quanto dura la garanzia?',
        answer:
          'La garanzia per tutti i prodotti ad utilizzo professionale è di 12 mesi. La garanzia copre eventuali vizi di fabbrica.',
      },
      {
        question: 'Effettuate fatturazione per pubbliche amministrazioni?',
        answer:
          'No, al momento non aderiamo al MEPA (Mercato Elettronico della Pubblica Amministrazione).',
      },
      {
        question: 'Potete emettere fattura in esenzione IVA?',
        answer:
          'Sì, in presenza dei requisiti necessari previsti dalla normativa vigente.',
      },
      {
        question: 'Sono un privato, posso acquistare?',
        answer:
          'Alcuni prodotti possono essere acquistati anche da consumatori privati. Contattaci per verificare la disponibilità specifica.',
      },
    ],
  },
  {
    title: 'Assistenza Post Vendita',
    slug: 'assistenza-post-vendita',
    items: [
      {
        question: 'A chi posso rivolgermi per assistenza in garanzia?',
        answer:
          'Puoi contattarci via e-mail (clienti@bianchipro.it), telefono (+39 0541 620526) o WhatsApp. Ti aiuteremo a risolvere qualsiasi problema.',
      },
      {
        question: 'Ho bisogno di ricambi specifici, come faccio?',
        answer:
          "Visita la nostra sezione ricambi oppure contattaci fornendo marca, modello e possibilmente una foto dell'etichetta del prodotto.",
      },
      {
        question: 'Posso lasciare una recensione?',
        answer:
          'Certamente! Puoi farlo su Feedaty o sulla nostra pagina Google. Le tue opinioni ci aiutano a migliorare.',
      },
    ],
  },
  {
    title: 'Prodotti e Prezzi',
    slug: 'prodotti-e-prezzi',
    items: [
      {
        question: 'Come posso cercare un prodotto?',
        answer:
          'Puoi utilizzare la barra di ricerca in alto per cercare per modello o codice, oppure navigare le categorie dal menu principale.',
      },
      {
        question: 'I prodotti sono sempre disponibili?',
        answer:
          'Nella maggior parte dei casi sì. In caso di ritardi ti avviseremo tempestivamente.',
      },
      {
        question: 'Posso richiedere sconti per acquisti multipli?',
        answer:
          'Sì, contattaci per ricevere offerte personalizzate su acquisti di più prodotti.',
      },
      {
        question: 'I prezzi sono uguali online e in negozio?',
        answer:
          'Sì, i prezzi sono identici sia online che presso il nostro punto vendita.',
      },
      {
        question: 'Perché i vostri prezzi sono così bassi?',
        answer:
          'Lavoriamo a diretto contatto con i produttori, eliminando gli intermediari. Questo ci permette di offrire prezzi competitivi.',
      },
      {
        question: "I prezzi comprendono l'IVA?",
        answer:
          'No, i prezzi pubblicati sono sempre al netto dell\'IVA (22%).',
      },
    ],
  },
  {
    title: 'Ordini',
    slug: 'ordini',
    items: [
      {
        question: 'Come posso verificare lo stato del mio ordine?',
        answer:
          'Accedi alla tua Area Cliente per verificare lo stato di tutti i tuoi ordini in tempo reale.',
      },
      {
        question: "Posso modificare o annullare l'ordine?",
        answer:
          'Solo prima che venga gestito dal nostro magazzino. Comunicaci la richiesta via email il prima possibile.',
      },
      {
        question: 'Devo registrarmi per acquistare?',
        answer:
          'No, per effettuare acquisti non è obbligatorio registrarsi. Puoi acquistare anche come Ospite.',
      },
      {
        question: 'Perché registrarsi alla newsletter?',
        answer:
          'La newsletter ti permette di restare aggiornato su novità, sconti esclusivi e guide utili per la tua attività.',
      },
    ],
  },
];
