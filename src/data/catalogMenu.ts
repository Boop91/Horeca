export interface CatalogLeafSection {
  title: string;
  items: string[];
}

export interface CatalogGroup {
  title: string;
  sections: CatalogLeafSection[];
}

export interface CatalogMenuItem {
  key: string;
  label: string;
  groups: CatalogGroup[];
}

export const catalogMenu: CatalogMenuItem[] = [
  {
    key: 'linea-caldo',
    label: 'Linea Caldo',
    groups: [
      {
        title: 'Prodotti Linea Caldo',
        sections: [
          { title: 'Cottura a contatto', items: ['Fry Top', 'Piastre elettriche', 'Piastre a induzione', 'Pietra lavica'] },
          { title: 'Mantenimento temperatura', items: ['Vasche bagnomaria', 'Carrelli riscaldati', 'Vetrinette riscaldate', 'Piani caldi', 'Tavole calde', 'Distributori bevande calde', 'Chafing Dish'] },
          { title: 'Cottura per immersione', items: ['Friggitrici Professionali', 'Cuocipasta', 'Sous-vide'] },
          { title: 'Forni professionali', items: ['Forni per pizza', 'Forni a convezione', 'Fornetti elettrici', 'Microonde professionale'] },
          { title: 'Cucina professionale', items: ['Cucine', 'Gastronorm', 'Teglie da forno', 'Griglie per forno'] },
          { title: 'Lievitazione', items: ['Lievitatori per forni gastronomia'] },
        ],
      },
    ],
  },
  {
    key: 'linea-freddo',
    label: 'Linea Freddo',
    groups: [
      {
        title: 'Refrigerazione',
        sections: [
          { title: 'Freddo professionale', items: ['Frigoriferi professionali', 'Congelatori professionali', 'Abbattitori', 'Vetrine refrigerate', 'Espositori freddi'] },
          { title: 'Tavoli refrigerati', items: ['Tavoli frigo', 'Tavoli congelatori', 'Portaingredienti', 'Saladette', 'Banchi pizza'] },
          { title: 'Carrelli e vasche refrigerate', items: ['Carrelli refrigerati', 'Vasche refrigerate'] },
          { title: 'Bacinelle e contenitori', items: ['Gastronorm', 'Vaschette gelato'] },
        ],
      },
    ],
  },
  {
    key: 'preparazione',
    label: 'Preparazione',
    groups: [
      {
        title: 'Preparazione alimenti',
        sections: [
          { title: 'Carne e formaggio', items: ['Tritacarne', 'Tritacarne e grattugia', 'Grattugia', 'Presshamburger', 'Impastatrici per carne', 'Segaossi'] },
          { title: 'Mixer, pelatura e taglio', items: ['Mixer', 'Pelapatate'] },
          { title: 'Lavorazione Pasta', items: ['Sfogliatrici stendipizza', 'Impastatrice a spirale'] },
          { title: 'Conservazione e contenitori', items: ['Sottovuoto a campana', 'Sottovuoto a barra', 'Buste per sottovuoto', 'Termosigillatrici', 'Contenitori asporto e delivery'] },
        ],
      },
    ],
  },
  {
    key: 'carrelli-arredo',
    label: 'Carrelli ed Arredo',
    groups: [
      {
        title: 'Carrelli e Mobili',
        sections: [
          { title: 'Carrelli neutri', items: ['Carrelli di servizio', 'Carrelli per dolci, formaggi e antipasti', 'Portavassoi', 'Portateglie', 'Porta piatti, bicchieri e cestelli'] },
          { title: 'Carrelli Caldi e Freddi', items: ['Carrelli caldi', 'Espositori riscaldati', 'Scalda piatti, teglie e bicchieri', 'Carrelli refrigerati portateglie e piatti'] },
          { title: 'Flambe e hotel', items: ['Carrelli per hotel', 'Carrelli porta cestelli', 'Carrelli per colazione'] },
        ],
      },
    ],
  },
  {
    key: 'hotellerie',
    label: 'Hotellerie',
    groups: [
      {
        title: 'Hotellerie (attrezzature per alberghi)',
        sections: [
          { title: 'Camera', items: ['Bollitori', 'Minibar', 'Reti', 'Casseforti', 'Guanciali', 'Fasciatoi', 'Stiro e grucce'] },
          { title: 'Bagno', items: ['Linea cortesia', 'Dispenser a muro', 'Asciugacapelli (phon)', 'Supporti a muro', 'Ricariche', 'Distributori di carta'] },
          { title: 'Tavola', items: ['Secchielli per ghiaccio'] },
        ],
      },
    ],
  },
  {
    key: 'igiene',
    label: 'Cura ed Igiene',
    groups: [
      {
        title: 'Igiene e Pulizia',
        sections: [
          { title: 'Macchinari per sanificazione', items: ['Pulizia e vapore'] },
          { title: 'Detergenza Professionale', items: ['Detersivi piatti', 'Detersivi bucato', 'Detergenti speciali', 'Sgrassatori e anticalcare'] },
          { title: 'Linee dedicate', items: ['Carrelli', 'Linea Stiro'] },
        ],
      },
    ],
  },
  {
    key: 'ricambi',
    label: 'Ricambi',
    groups: [
      {
        title: 'Ricambi professionali',
        sections: [
          { title: 'Ricambi Linea Caldo', items: ['Cottura a contatto', 'Forni professionali', 'Mantenimento temperatura', 'Cottura per immersione', 'Cucine professionali'] },
          { title: 'Ricambi Preparazione', items: ['Lavorazione carne e formaggio', 'Mixer, pelatura e taglio', 'Lavorazione pasta', 'Conservazione'] },
          { title: 'Altre sezioni', items: ['Ricambi Linea Freddo', 'Ricambi Sanificazione e Pulizia', 'Ricambi Carrelli e Arredo', 'Ricambi Senza Esploso'] },
        ],
      },
    ],
  },
  {
    key: 'seconda-scelta',
    label: 'Seconda Scelta',
    groups: [
      {
        title: 'Seconda Scelta',
        sections: [
          { title: 'Prodotti disponibili', items: ['Seconda scelta professionale'] },
        ],
      },
    ],
  },
];
