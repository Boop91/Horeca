export interface BusinessType {
  key: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  icon: string; // lucide icon name
  image?: string;
  essentialCategories: string[]; // slugs from catalogMenu leaf sections
  essentialEquipment: string[];
  guideTitle: string;
}

export const businessTypes: BusinessType[] = [
  {
    key: 'pizzeria',
    name: 'Pizzeria',
    slug: 'pizzeria',
    description: 'Attrezzature essenziali per pizzerie professionali',
    longDescription: 'Dalla preparazione dell\'impasto alla cottura: tutto il necessario per una pizzeria di successo.',
    icon: 'pizza',
    essentialCategories: ['forni-per-pizza', 'sfogliatrici-stendipizza', 'impastatrice-a-spirale', 'tavoli-frigo', 'banchi-pizza', 'friggitrici-professionali'],
    essentialEquipment: ['Forno per pizza professionale', 'Impastatrice a spirale', 'Stendipizza', 'Banco pizza refrigerato', 'Tavolo da lavoro in acciaio', 'Frigorifero professionale'],
    guideTitle: 'Come attrezzare la tua pizzeria',
  },
  {
    key: 'ristorante',
    name: 'Ristorante',
    slug: 'ristorante',
    description: 'Soluzioni complete per la ristorazione professionale',
    longDescription: 'Tutto ciò che serve per gestire un ristorante efficiente e produttivo.',
    icon: 'utensils-crossed',
    essentialCategories: ['cucine', 'forni-a-convezione', 'frigoriferi-professionali', 'abbattitori', 'lavastoviglie', 'gastronorm'],
    essentialEquipment: ['Cucina professionale completa', 'Forno a convezione', 'Frigorifero e congelatore', 'Abbattitore di temperatura', 'Lavastoviglie industriale', 'Tavoli da lavoro'],
    guideTitle: 'Come attrezzare il tuo ristorante',
  },
  {
    key: 'macelleria',
    name: 'Macelleria',
    slug: 'macelleria',
    description: 'Attrezzature per macellerie e lavorazione carni',
    longDescription: 'Strumenti professionali per la lavorazione, conservazione e vendita della carne.',
    icon: 'beef',
    essentialCategories: ['tritacarne', 'segaossi', 'sottovuoto-a-campana', 'vetrine-refrigerate', 'congelatori-professionali', 'affettatrici'],
    essentialEquipment: ['Tritacarne professionale', 'Segaossi', 'Confezionatrice sottovuoto', 'Vetrina refrigerata', 'Cella frigorifera', 'Affettatrice professionale'],
    guideTitle: 'Come attrezzare la tua macelleria',
  },
  {
    key: 'bar-gelateria',
    name: 'Bar e Gelateria',
    slug: 'bar-gelateria',
    description: 'Tutto per bar, caffetterie e gelaterie artigianali',
    longDescription: 'Dalla macchina per il caffè alle vetrine gelato: soluzioni per bar e gelaterie.',
    icon: 'coffee',
    essentialCategories: ['distributori-bevande-calde', 'vetrine-refrigerate', 'espositori-freddi', 'vaschette-gelato', 'carrelli-per-dolci-formaggi-e-antipasti'],
    essentialEquipment: ['Macchina caffè espresso', 'Macinacaffè', 'Vetrina refrigerata da banco', 'Vetrina gelato', 'Lavabicchieri', 'Frigo sottobanco'],
    guideTitle: 'Come attrezzare il tuo bar o gelateria',
  },
  {
    key: 'pasticceria',
    name: 'Pasticceria',
    slug: 'pasticceria',
    description: 'Attrezzature per pasticcerie e laboratori dolciari',
    longDescription: 'Forni, impastatrici e attrezzature per una pasticceria artigianale.',
    icon: 'cake',
    essentialCategories: ['forni-a-convezione', 'impastatrice-a-spirale', 'abbattitori', 'vetrine-refrigerate', 'lievitatori-per-forni-gastronomia', 'teglie-da-forno'],
    essentialEquipment: ['Forno a convezione ventilato', 'Impastatrice planetaria', 'Abbattitore di temperatura', 'Vetrina refrigerata', 'Cella di lievitazione', 'Teglie e stampi'],
    guideTitle: 'Come attrezzare la tua pasticceria',
  },
  {
    key: 'panetteria',
    name: 'Panetteria',
    slug: 'panetteria',
    description: 'Attrezzature per panifici e forni artigianali',
    longDescription: 'Impastatrici, forni e attrezzature per la produzione di pane artigianale.',
    icon: 'wheat',
    essentialCategories: ['impastatrice-a-spirale', 'sfogliatrici-stendipizza', 'forni-a-convezione', 'lievitatori-per-forni-gastronomia', 'teglie-da-forno'],
    essentialEquipment: ['Impastatrice a spirale', 'Forno a piani o rotativo', 'Cella di lievitazione', 'Sfogliatrice', 'Teglie e attrezzature per panificazione'],
    guideTitle: 'Come attrezzare il tuo panificio',
  },
  {
    key: 'hotel',
    name: 'Hotel',
    slug: 'hotel',
    description: 'Soluzioni complete per strutture ricettive',
    longDescription: 'Dalle camere alla cucina: tutto per gestire un hotel professionale.',
    icon: 'hotel',
    essentialCategories: ['bollitori', 'minibar', 'casseforti', 'asciugacapelli-phon', 'linea-cortesia', 'carrelli-per-hotel'],
    essentialEquipment: ['Minibar', 'Bollitore elettrico', 'Cassaforte a muro', 'Asciugacapelli', 'Linea cortesia bagno', 'Carrello portabiancheria'],
    guideTitle: 'Come attrezzare il tuo hotel',
  },
  {
    key: 'catering',
    name: 'Catering e Mensa',
    slug: 'catering-mensa',
    description: 'Attrezzature per catering, mense e ristorazione collettiva',
    longDescription: 'Soluzioni per la ristorazione collettiva, eventi e servizi di catering.',
    icon: 'chef-hat',
    essentialCategories: ['carrelli-caldi', 'chafing-dish', 'vasche-bagnomaria', 'carrelli-di-servizio', 'gastronorm', 'tavole-calde'],
    essentialEquipment: ['Carrello termico', 'Chafing dish', 'Bagnomaria professionale', 'Gastronorm complete', 'Tavola calda', 'Carrello di servizio'],
    guideTitle: 'Come attrezzare il tuo servizio catering',
  },
  {
    key: 'food-truck',
    name: 'Food Truck',
    slug: 'food-truck',
    description: 'Attrezzature compatte per cucine mobili e food truck',
    longDescription: 'Soluzioni compatte e versatili per la ristorazione su strada.',
    icon: 'truck',
    essentialCategories: ['friggitrici-professionali', 'fry-top', 'piastre-elettriche', 'frigoriferi-professionali', 'fornetti-elettrici'],
    essentialEquipment: ['Friggitrice compatta', 'Piastra/Fry top', 'Frigorifero compatto', 'Fornetto professionale', 'Lavello portatile'],
    guideTitle: 'Come attrezzare il tuo food truck',
  },
  {
    key: 'kebab',
    name: 'Kebab',
    slug: 'kebab',
    description: 'Attrezzature specifiche per kebab e fast food etnico',
    longDescription: 'Grill verticali, piastre e attrezzature per un kebab shop di successo.',
    icon: 'flame',
    essentialCategories: ['fry-top', 'piastre-elettriche', 'friggitrici-professionali', 'vetrine-refrigerate', 'tavoli-frigo'],
    essentialEquipment: ['Grill verticale per kebab', 'Piastra grill', 'Friggitrice', 'Vetrina refrigerata', 'Tavolo refrigerato'],
    guideTitle: 'Come attrezzare il tuo kebab shop',
  },
];
