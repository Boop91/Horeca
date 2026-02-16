/**
 * companyInfo.ts — Dati aziendali reali di BianchiPro
 *
 * Questo file contiene tutte le informazioni ufficiali dell'azienda,
 * estratte direttamente dal sito bianchipro.it.
 * Viene usato da: Footer, AboutPage, ContactPage, CheckoutPage e altri componenti
 * che mostrano dati aziendali (indirizzo, telefono, P.IVA, ecc.)
 *
 * "as const" rende tutti i valori readonly e letterali,
 * permettendo al TypeScript di inferire i tipi esatti (es. 'Fimar' invece di string).
 */
export const companyInfo = {
  /* ── Identità aziendale ───────────────────────────────────────── */
  name: 'Bianchi S.r.l.',                    // Nome commerciale breve
  tradeName: 'BianchiPro',                   // Marchio usato sul sito
  legalEntity: 'OMNIA SRL Unipersonale',     // Ragione sociale legale (come da fattura)
  vatNumber: 'IT03434940403',                // Partita IVA italiana

  /* ── Fondatori ────────────────────────────────────────────────── */
  founders: 'Enrico e Alberto Bianchi',      // Gestori attuali (seconda generazione)
  originalFounder: 'Giorgio Bianchi',        // Fondatore originale
  foundedYear: '1960',                       // Anno di fondazione (anni '60)

  /* ── Sede legale e punto vendita ──────────────────────────────── */
  address: {
    street: 'Via Giordano Bruno 10',
    city: 'Santarcangelo di Romagna',
    province: 'Rimini',                      // Sigla: RN
    cap: '47822',                            // Codice Avviamento Postale
    country: 'Italia',
  },

  /* ── Contatti diretti ─────────────────────────────────────────── */
  contacts: {
    phone: '+39 0541 620526',                // Telefono fisso (orario: Lun-Ven 8:30-18:00)
    email: 'clienti@bianchipro.it',          // Email principale per assistenza
    whatsapp: '+39 0541 620526',             // Stesso numero del telefono
  },

  /* ── Testi descrittivi (usati in "Chi Siamo" e nel footer) ──── */
  description:
    "Bianchi Pro è un'impresa familiare gestita da Enrico e Alberto Bianchi, figli del fondatore Giorgio che creò l'azienda negli anni '60. Specializzati in attrezzature per ristoranti, bar, pasticcerie e hotellerie, uniamo qualità e prezzi competitivi mantenendo relazioni personali autentiche.",
  mission:
    'Acquistare online non significa necessariamente rinunciare al rapporto con le persone. Lavoriamo a diretto contatto con i produttori, eliminando gli intermediari.',
  valueProposition:
    "Non siamo Amazon e non miriamo all'acquisto d'impulso. Priorizzamo acquisti consapevoli, rifiutando vendite quando riteniamo i prodotti inadatti al cliente.",

  /* ── Spedizioni ───────────────────────────────────────────────── */
  shipping: {
    carriers: ['SDA', 'GLS', 'DHL', 'BRT', 'ARCESE', 'FERCAM'],
    // SDA/GLS/DHL/BRT = corrieri espressi (24/48h)
    // ARCESE/FERCAM = corrieri specializzati per merce voluminosa/pesante
    deliveryTime: '24/48h in tutta Italia',
    pickupAvailable: true,                   // Ritiro in sede a Santarcangelo
    internationalShipping: true,             // Spedizioni all'estero su preventivo
    insuranceAvailable: true,                // Assicurazione extra disponibile
  },

  /* ── Metodi di pagamento accettati ────────────────────────────── */
  payment: {
    methods: [
      'Bonifico bancario',                   // Più usato nel B2B
      'Carta di credito',                    // Gestione immediata
      'PayPal',                              // Solo alcuni prodotti
      'Contrassegno',                        // Solo alcuni prodotti
      'Vaglia postale',                      // Metodo tradizionale
    ],
    cards: ['Visa', 'Mastercard', 'American Express', 'Postepay'],
  },

  /* ── Garanzia ─────────────────────────────────────────────────── */
  warranty: {
    professional: '12 mesi',                 // Garanzia standard per uso professionale
    covers: 'Vizi di fabbrica',              // Cosa copre la garanzia
  },

  /* ── Fatturazione elettronica ─────────────────────────────────── */
  invoicing: {
    electronic: true,                        // Fattura elettronica via SDI
    mepa: false,                             // NON aderisce al MEPA (PA)
    vatExemption: true,                      // Possibile esenzione IVA se requisiti
    privateCustomers: 'Solo alcuni prodotti', // Privati: vendita limitata
  },

  /* ── Prova sociale (recensioni) ───────────────────────────────── */
  socialProof: {
    platform: 'Feedaty',                     // Piattaforma di recensioni certificata
    averageRating: 4.7,                      // Valutazione media su 5
    totalReviews: 1200,                      // Numero approssimativo di recensioni
  },

  /* ── Marchi partner (produttori diretti) ──────────────────────── */
  brands: [
    'Fimar',                                 // Impastatrici, forni, fry top
    'Fama',                                  // Forni pizza, friggitrici
    'Forcar',                                // Refrigerazione professionale
    'SPM',                                   // Attrezzature bar
    'Easy line By Fimar',                    // Linea economica Fimar
    'Inox BIM',                              // Abbattitori
    'Forcold',                               // Accessori freddo
  ],
} as const;
