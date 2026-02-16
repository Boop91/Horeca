export interface CatalogProduct {
  name: string;
  slug: string;
}

export interface CatalogLeafSection {
  title: string;
  slug: string;
  items: CatalogProduct[];
}

export interface CatalogGroup {
  title: string;
  slug: string;
  sections: CatalogLeafSection[];
}

export interface CatalogMenuItem {
  key: string;
  label: string;
  slug: string;
  description: string;
  image?: string;
  groups: CatalogGroup[];
}

export const catalogMenu: CatalogMenuItem[] = [
  // ─── LINEA CALDO ───────────────────────────────────────────────────
  {
    key: 'linea-caldo',
    label: 'Linea Caldo',
    slug: 'linea-caldo',
    description:
      'Attrezzature professionali per la cottura, il mantenimento e la preparazione a caldo: forni, friggitrici, fry top, bagnomaria e molto altro.',
    groups: [
      {
        title: 'Cottura a contatto',
        slug: 'cottura-a-contatto',
        sections: [
          {
            title: 'Fry Top',
            slug: 'fry-top',
            items: [{ name: 'Fry Top', slug: 'fry-top' }],
          },
          {
            title: 'Piastre elettriche',
            slug: 'piastre-elettriche',
            items: [{ name: 'Piastre elettriche', slug: 'piastre-elettriche' }],
          },
          {
            title: 'Piastre a induzione',
            slug: 'piastre-a-induzione',
            items: [{ name: 'Piastre a induzione', slug: 'piastre-a-induzione' }],
          },
          {
            title: 'Pietra lavica',
            slug: 'pietra-lavica',
            items: [
              { name: 'Pietra lavica', slug: 'pietra-lavica' },
              { name: 'Accessori per griglie a pietra lavica', slug: 'accessori-per-griglie-a-pietra-lavica' },
            ],
          },
          {
            title: 'Fornetti Toast',
            slug: 'fornetti-toast',
            items: [
              { name: 'Fornetti Toast', slug: 'fornetti-toast' },
              { name: 'Accessori Fornetti Toast', slug: 'accessori-fornetti-toast' },
            ],
          },
          {
            title: 'Tostapane',
            slug: 'tostapane',
            items: [{ name: 'Tostapane', slug: 'tostapane' }],
          },
          {
            title: 'Hot Dog',
            slug: 'hot-dog',
            items: [{ name: 'Hot Dog', slug: 'hot-dog' }],
          },
          {
            title: 'Waffle',
            slug: 'waffle',
            items: [{ name: 'Waffle', slug: 'waffle' }],
          },
          {
            title: 'Salamandre',
            slug: 'salamandre',
            items: [{ name: 'Salamandre', slug: 'salamandre' }],
          },
        ],
      },
      {
        title: 'Cucina professionale',
        slug: 'cucina-professionale',
        sections: [
          {
            title: 'Cucine',
            slug: 'cucine',
            items: [{ name: 'Cucine', slug: 'cucine' }],
          },
          {
            title: 'Macchine Kebab - Gyros',
            slug: 'macchine-kebab-gyros',
            items: [
              { name: 'Macchine Kebab - Gyros', slug: 'macchine-kebab-gyros' },
              { name: 'Accessori per Gyros - Kebab', slug: 'accessori-per-gyros-kebab' },
            ],
          },
          {
            title: 'Gastronorm',
            slug: 'gastronorm',
            items: [
              { name: 'Gastronorm', slug: 'gastronorm' },
              { name: 'Accessori per Gastronorm', slug: 'accessori-per-gastronorm' },
              { name: 'Coperchi Gastronorm', slug: 'coperchi-gastronorm' },
              { name: 'Griglie Gastronorm', slug: 'griglie-gastronorm' },
            ],
          },
          {
            title: 'Teglie da forno',
            slug: 'teglie-da-forno',
            items: [{ name: 'Teglie da forno', slug: 'teglie-da-forno' }],
          },
          {
            title: 'Griglie per forno',
            slug: 'griglie-per-forno',
            items: [{ name: 'Griglie per forno', slug: 'griglie-per-forno' }],
          },
        ],
      },
      {
        title: 'Forni professionali',
        slug: 'forni-professionali',
        sections: [
          {
            title: 'Forni per pizza',
            slug: 'forni-per-pizza',
            items: [
              { name: 'Forni per pizza', slug: 'forni-per-pizza' },
              { name: 'Cappe aspiranti per forni pizza', slug: 'cappe-aspiranti-per-forni-pizza' },
              { name: 'Supporti per forni pizza', slug: 'supporti-per-forni-pizza' },
              { name: 'Accessori per forni pizza', slug: 'accessori-per-forni-pizza' },
            ],
          },
          {
            title: 'Forni a convezione',
            slug: 'forni-a-convezione',
            items: [
              { name: 'Forni a convezione', slug: 'forni-a-convezione' },
              { name: 'Accessori forni a convezione', slug: 'accessori-forni-a-convezione' },
            ],
          },
          {
            title: 'Fornetti Elettrici',
            slug: 'fornetti-elettrici',
            items: [{ name: 'Fornetti Elettrici', slug: 'fornetti-elettrici' }],
          },
          {
            title: 'Microonde Professionale',
            slug: 'microonde-professionale',
            items: [{ name: 'Microonde Professionale', slug: 'microonde-professionale' }],
          },
        ],
      },
      {
        title: 'Mantenimento temperatura',
        slug: 'mantenimento-temperatura',
        sections: [
          {
            title: 'Vasche bagnomaria',
            slug: 'vasche-bagnomaria',
            items: [{ name: 'Vasche bagnomaria', slug: 'vasche-bagnomaria' }],
          },
          {
            title: 'Carrelli riscaldati',
            slug: 'carrelli-riscaldati',
            items: [{ name: 'Carrelli riscaldati', slug: 'carrelli-riscaldati' }],
          },
          {
            title: 'Vetrinette riscaldate',
            slug: 'vetrinette-riscaldate',
            items: [{ name: 'Vetrinette riscaldate', slug: 'vetrinette-riscaldate' }],
          },
          {
            title: 'Piani caldi',
            slug: 'piani-caldi',
            items: [{ name: 'Piani caldi', slug: 'piani-caldi' }],
          },
          {
            title: 'Chafing Dish',
            slug: 'chafing-dish',
            items: [{ name: 'Chafing Dish', slug: 'chafing-dish' }],
          },
          {
            title: 'Distributori bevande calde',
            slug: 'distributori-bevande-calde',
            items: [{ name: 'Distributori bevande calde', slug: 'distributori-bevande-calde' }],
          },
          {
            title: 'Tavole calde',
            slug: 'tavole-calde',
            items: [{ name: 'Tavole calde', slug: 'tavole-calde' }],
          },
        ],
      },
      {
        title: 'Cottura per immersione',
        slug: 'cottura-per-immersione',
        sections: [
          {
            title: 'Friggitrici Professionali',
            slug: 'friggitrici-professionali',
            items: [
              { name: 'Friggitrici Professionali', slug: 'friggitrici-professionali' },
              { name: 'Cesti per Friggitrici', slug: 'cesti-per-friggitrici' },
            ],
          },
          {
            title: 'Cuocipasta',
            slug: 'cuocipasta',
            items: [
              { name: 'Cuocipasta', slug: 'cuocipasta' },
              { name: 'Accessori per cuocipasta', slug: 'accessori-per-cuocipasta' },
            ],
          },
          {
            title: 'Sous-vide',
            slug: 'sous-vide',
            items: [{ name: 'Sous-vide', slug: 'sous-vide' }],
          },
        ],
      },
      {
        title: 'Lievitazione',
        slug: 'lievitazione',
        sections: [
          {
            title: 'Teglie',
            slug: 'teglie',
            items: [{ name: 'Teglie', slug: 'teglie' }],
          },
          {
            title: 'Lievitatori per forni gastronomia',
            slug: 'lievitatori',
            items: [{ name: 'Lievitatori per forni gastronomia', slug: 'lievitatori' }],
          },
        ],
      },
    ],
  },

  // ─── LINEA FREDDO ──────────────────────────────────────────────────
  {
    key: 'linea-freddo',
    label: 'Linea Freddo',
    slug: 'linea-freddo',
    description:
      'Refrigerazione e conservazione professionale: frigoriferi, congelatori, abbattitori, vetrine e tavoli refrigerati.',
    groups: [
      {
        title: 'Refrigerazione',
        slug: 'refrigerazione',
        sections: [
          {
            title: 'Frigoriferi professionali',
            slug: 'frigoriferi-professionali',
            items: [
              { name: 'Frigoriferi professionali', slug: 'frigoriferi-professionali' },
              { name: 'Accessori Frigo positivi', slug: 'accessori-frigo-positivi' },
            ],
          },
          {
            title: 'Congelatori professionali',
            slug: 'congelatori-professionali',
            items: [
              { name: 'Congelatori professionali', slug: 'congelatori-professionali' },
              { name: 'Accessori Frigo negativi', slug: 'accessori-frigo-negativi' },
            ],
          },
          {
            title: 'Abbattitori',
            slug: 'abbattitori',
            items: [{ name: 'Abbattitori', slug: 'abbattitori' }],
          },
          {
            title: 'Vetrine refrigerate',
            slug: 'vetrine-refrigerate',
            items: [
              { name: 'Vetrine refrigerate', slug: 'vetrine-refrigerate' },
              { name: 'Accessori per vetrine refrigerate', slug: 'accessori-per-vetrine-refrigerate' },
            ],
          },
          {
            title: 'Espositori freddi',
            slug: 'espositori-freddi',
            items: [{ name: 'Espositori freddi', slug: 'espositori-freddi' }],
          },
          {
            title: 'Congelatore a Pozzetto',
            slug: 'congelatore-a-pozzetto',
            items: [{ name: 'Congelatore a Pozzetto', slug: 'congelatore-a-pozzetto' }],
          },
          {
            title: 'Frigobar e minibar',
            slug: 'frigobar-e-minibar',
            items: [{ name: 'Frigobar e minibar', slug: 'frigobar-e-minibar' }],
          },
        ],
      },
      {
        title: 'Tavoli refrigerati',
        slug: 'tavoli-refrigerati',
        sections: [
          {
            title: 'Tavoli frigo',
            slug: 'tavoli-frigo',
            items: [{ name: 'Tavoli frigo', slug: 'tavoli-frigo' }],
          },
          {
            title: 'Tavoli congelatori',
            slug: 'tavoli-congelatori',
            items: [{ name: 'Tavoli congelatori', slug: 'tavoli-congelatori' }],
          },
          {
            title: 'Banchi pizza',
            slug: 'banchi-pizza',
            items: [
              { name: 'Banchi pizza', slug: 'banchi-pizza' },
              { name: 'Accessori banchi pizza', slug: 'accessori-banchi-pizza' },
            ],
          },
          {
            title: 'Portaingredienti',
            slug: 'portaingredienti',
            items: [{ name: 'Portaingredienti', slug: 'portaingredienti' }],
          },
          {
            title: 'Saladette',
            slug: 'saladette',
            items: [
              { name: 'Saladette', slug: 'saladette' },
              { name: 'Accessori per Saladette', slug: 'accessori-per-saladette' },
            ],
          },
        ],
      },
      {
        title: 'Carrelli e vasche refrigerate',
        slug: 'carrelli-e-vasche-refrigerate',
        sections: [
          {
            title: 'Carrelli refrigerati',
            slug: 'carrelli-refrigerati',
            items: [
              { name: 'Carrelli refrigerati', slug: 'carrelli-refrigerati' },
              { name: 'Accessori per carrelli refrigerati', slug: 'accessori-per-carrelli-refrigerati' },
            ],
          },
          {
            title: 'Vasche refrigerate',
            slug: 'vasche-refrigerate',
            items: [
              { name: 'Vasche refrigerate', slug: 'vasche-refrigerate' },
              { name: 'Accessori per vasche refrigerate', slug: 'accessori-per-vasche-refrigerate' },
            ],
          },
        ],
      },
      {
        title: 'Bacinelle e Contenitori',
        slug: 'bacinelle-e-contenitori',
        sections: [
          {
            title: 'Gastronorm',
            slug: 'gastronorm',
            items: [
              { name: 'Gastronorm', slug: 'gastronorm' },
              { name: 'Accessori per Gastronorm', slug: 'accessori-per-gastronorm' },
              { name: 'Coperchi Gastronorm', slug: 'coperchi-gastronorm' },
              { name: 'Griglie Gastronorm', slug: 'griglie-gastronorm' },
            ],
          },
          {
            title: 'Vaschette gelato',
            slug: 'vaschette-gelato',
            items: [{ name: 'Vaschette gelato', slug: 'vaschette-gelato' }],
          },
        ],
      },
    ],
  },

  // ─── PREPARAZIONE ──────────────────────────────────────────────────
  {
    key: 'preparazione',
    label: 'Preparazione',
    slug: 'preparazione',
    description:
      'Macchine e attrezzature per la lavorazione degli alimenti: tritacarne, affettatrici, impastatrici, confezionatrici sottovuoto e altro.',
    groups: [
      {
        title: 'Carne e formaggio',
        slug: 'carne-e-formaggio',
        sections: [
          {
            title: 'Tritacarne e grattugia',
            slug: 'tritacarne-e-grattugia',
            items: [{ name: 'Tritacarne e grattugia', slug: 'tritacarne-e-grattugia' }],
          },
          {
            title: 'Tritacarne',
            slug: 'tritacarne',
            items: [{ name: 'Tritacarne', slug: 'tritacarne' }],
          },
          {
            title: 'Grattugia',
            slug: 'grattugia',
            items: [{ name: 'Grattugia', slug: 'grattugia' }],
          },
          {
            title: 'Presshamburger',
            slug: 'presshamburger',
            items: [{ name: 'Presshamburger', slug: 'presshamburger' }],
          },
          {
            title: 'Insaccatrici',
            slug: 'insaccatrici',
            items: [{ name: 'Insaccatrici', slug: 'insaccatrici' }],
          },
          {
            title: 'Segaossi',
            slug: 'segaossi',
            items: [{ name: 'Segaossi', slug: 'segaossi' }],
          },
          {
            title: 'Affettatrici e affettacarne',
            slug: 'affettatrici-e-affettacarne',
            items: [{ name: 'Affettatrici e affettacarne', slug: 'affettatrici-e-affettacarne' }],
          },
          {
            title: 'Tagliamozzarella',
            slug: 'tagliamozzarella',
            items: [{ name: 'Tagliamozzarella', slug: 'tagliamozzarella' }],
          },
          {
            title: 'Impastatrici per carne',
            slug: 'impastatrici-per-carne',
            items: [{ name: 'Impastatrici per carne', slug: 'impastatrici-per-carne' }],
          },
        ],
      },
      {
        title: 'Mixer, pelatura e taglio',
        slug: 'mixer-pelatura-e-taglio',
        sections: [
          {
            title: 'Mixer',
            slug: 'mixer',
            items: [{ name: 'Mixer', slug: 'mixer' }],
          },
          {
            title: 'Cutter professionali',
            slug: 'cutter-professionali',
            items: [{ name: 'Cutter professionali', slug: 'cutter-professionali' }],
          },
          {
            title: 'Tagliaverdura',
            slug: 'tagliaverdura',
            items: [{ name: 'Tagliaverdura', slug: 'tagliaverdura' }],
          },
          {
            title: 'Affettatrici e Affettacarne',
            slug: 'affettatrici',
            items: [{ name: 'Affettatrici e Affettacarne', slug: 'affettatrici' }],
          },
          {
            title: 'Tagliamozzarella',
            slug: 'tagliamozzarella-2',
            items: [{ name: 'Tagliamozzarella', slug: 'tagliamozzarella-2' }],
          },
          {
            title: 'Puliscicozze',
            slug: 'puliscicozze',
            items: [{ name: 'Puliscicozze', slug: 'puliscicozze' }],
          },
          {
            title: 'Pelapatate',
            slug: 'pelapatate',
            items: [{ name: 'Pelapatate', slug: 'pelapatate' }],
          },
          {
            title: 'Lavaverdure',
            slug: 'lavaverdure',
            items: [{ name: 'Lavaverdure', slug: 'lavaverdure' }],
          },
          {
            title: 'Lavatartufi',
            slug: 'lavatartufi',
            items: [{ name: 'Lavatartufi', slug: 'lavatartufi' }],
          },
          {
            title: 'Coltelli professionali',
            slug: 'coltelli-professionali',
            items: [{ name: 'Coltelli professionali', slug: 'coltelli-professionali' }],
          },
        ],
      },
      {
        title: 'Lavorazione Pasta',
        slug: 'lavorazione-pasta',
        sections: [
          {
            title: 'Impastatrice a spirale',
            slug: 'impastatrice-a-spirale',
            items: [{ name: 'Impastatrice a spirale', slug: 'impastatrice-a-spirale' }],
          },
          {
            title: 'Impastatrice planetaria',
            slug: 'impastatrice-planetaria',
            items: [{ name: 'Impastatrice planetaria', slug: 'impastatrice-planetaria' }],
          },
          {
            title: 'Impastatrici a forcella',
            slug: 'impastatrici-a-forcella',
            items: [{ name: 'Impastatrici a forcella', slug: 'impastatrici-a-forcella' }],
          },
          {
            title: 'Macchinari per la pasta',
            slug: 'macchinari-per-la-pasta',
            items: [{ name: 'Macchinari per la pasta', slug: 'macchinari-per-la-pasta' }],
          },
          {
            title: 'Sfogliatrici',
            slug: 'sfogliatrici',
            items: [{ name: 'Sfogliatrici', slug: 'sfogliatrici' }],
          },
          {
            title: 'Stendipizza',
            slug: 'stendipizza',
            items: [{ name: 'Stendipizza', slug: 'stendipizza' }],
          },
          {
            title: 'Sporzionatrici e arrotondatrici',
            slug: 'sporzionatrici-e-arrotondatrici',
            items: [{ name: 'Sporzionatrici e arrotondatrici', slug: 'sporzionatrici-e-arrotondatrici' }],
          },
        ],
      },
      {
        title: 'Attrezzature per Bar',
        slug: 'attrezzature-per-bar',
        sections: [
          {
            title: 'Erogatori',
            slug: 'erogatori',
            items: [{ name: 'Erogatori', slug: 'erogatori' }],
          },
          {
            title: 'Prodotti solubili',
            slug: 'prodotti-solubili',
            items: [{ name: 'Prodotti solubili', slug: 'prodotti-solubili' }],
          },
          {
            title: 'Dosatori caffè',
            slug: 'dosatori-caffe',
            items: [{ name: 'Dosatori caffè', slug: 'dosatori-caffe' }],
          },
          {
            title: 'Granitore',
            slug: 'granitore',
            items: [{ name: 'Granitore', slug: 'granitore' }],
          },
          {
            title: 'Macchina Gelato Soft',
            slug: 'macchina-gelato-soft',
            items: [{ name: 'Macchina Gelato Soft', slug: 'macchina-gelato-soft' }],
          },
          {
            title: 'Macchina sorbetti e creme',
            slug: 'macchina-sorbetti-e-creme',
            items: [{ name: 'Macchina sorbetti e creme', slug: 'macchina-sorbetti-e-creme' }],
          },
          {
            title: 'Centrifughe e estrattori',
            slug: 'centrifughe-e-estrattori',
            items: [{ name: 'Centrifughe e estrattori', slug: 'centrifughe-e-estrattori' }],
          },
          {
            title: 'Spremiagrumi',
            slug: 'spremiagrumi',
            items: [{ name: 'Spremiagrumi', slug: 'spremiagrumi' }],
          },
          {
            title: 'Frullatori',
            slug: 'frullatori',
            items: [{ name: 'Frullatori', slug: 'frullatori' }],
          },
          {
            title: 'Frappè',
            slug: 'frappe',
            items: [{ name: 'Frappè', slug: 'frappe' }],
          },
          {
            title: 'Tritaghiaccio',
            slug: 'tritaghiaccio',
            items: [{ name: 'Tritaghiaccio', slug: 'tritaghiaccio' }],
          },
          {
            title: 'Tostapane e fornetti',
            slug: 'tostapane-e-fornetti',
            items: [{ name: 'Tostapane e fornetti', slug: 'tostapane-e-fornetti' }],
          },
          {
            title: 'Vetrinette',
            slug: 'vetrinette',
            items: [{ name: 'Vetrinette', slug: 'vetrinette' }],
          },
          {
            title: 'Macchine Caffè',
            slug: 'macchine-caffe',
            items: [{ name: 'Macchine Caffè', slug: 'macchine-caffe' }],
          },
          {
            title: 'Gelatiere',
            slug: 'gelatiere',
            items: [{ name: 'Gelatiere', slug: 'gelatiere' }],
          },
        ],
      },
      {
        title: 'Conservazione e contenitori',
        slug: 'conservazione-e-contenitori',
        sections: [
          {
            title: 'Termosigillatrici',
            slug: 'termosigillatrici',
            items: [{ name: 'Termosigillatrici', slug: 'termosigillatrici' }],
          },
          {
            title: 'Sottovuoto a barra',
            slug: 'sottovuoto-a-barra',
            items: [{ name: 'Sottovuoto a barra', slug: 'sottovuoto-a-barra' }],
          },
          {
            title: 'Sottovuoto a campana',
            slug: 'sottovuoto-a-campana',
            items: [{ name: 'Sottovuoto a campana', slug: 'sottovuoto-a-campana' }],
          },
          {
            title: 'Buste per sottovuoto',
            slug: 'buste-per-sottovuoto',
            items: [{ name: 'Buste per sottovuoto', slug: 'buste-per-sottovuoto' }],
          },
          {
            title: 'Bacinelle Gastronorm',
            slug: 'bacinelle-gastronorm',
            items: [{ name: 'Bacinelle Gastronorm', slug: 'bacinelle-gastronorm' }],
          },
          {
            title: 'Teglie per cottura',
            slug: 'teglie-per-cottura',
            items: [{ name: 'Teglie per cottura', slug: 'teglie-per-cottura' }],
          },
          {
            title: 'Vaschette Gelato',
            slug: 'vaschette-gelato-prep',
            items: [{ name: 'Vaschette Gelato', slug: 'vaschette-gelato-prep' }],
          },
          {
            title: 'Contenitori Asporto e Delivery',
            slug: 'contenitori-asporto-e-delivery',
            items: [{ name: 'Contenitori Asporto e Delivery', slug: 'contenitori-asporto-e-delivery' }],
          },
        ],
      },
      {
        title: 'Cucina e Pizzeria',
        slug: 'cucina-e-pizzeria',
        sections: [
          {
            title: 'Sterilizza coltelli UV',
            slug: 'sterilizza-coltelli-uv',
            items: [{ name: 'Sterilizza coltelli UV', slug: 'sterilizza-coltelli-uv' }],
          },
          {
            title: 'Ceppi e taglieri Batticarne',
            slug: 'ceppi-e-taglieri-batticarne',
            items: [{ name: 'Ceppi e taglieri Batticarne', slug: 'ceppi-e-taglieri-batticarne' }],
          },
          {
            title: 'Accessori per pizzeria',
            slug: 'accessori-per-pizzeria',
            items: [{ name: 'Accessori per pizzeria', slug: 'accessori-per-pizzeria' }],
          },
          {
            title: 'Accessori per cucina',
            slug: 'accessori-per-cucina',
            items: [{ name: 'Accessori per cucina', slug: 'accessori-per-cucina' }],
          },
          {
            title: 'Bilance',
            slug: 'bilance',
            items: [{ name: 'Bilance', slug: 'bilance' }],
          },
          {
            title: 'Antinfortunistica',
            slug: 'antinfortunistica',
            items: [{ name: 'Antinfortunistica', slug: 'antinfortunistica' }],
          },
          {
            title: 'Bacinelle e contenitori',
            slug: 'bacinelle-e-contenitori-prep',
            items: [{ name: 'Bacinelle e contenitori', slug: 'bacinelle-e-contenitori-prep' }],
          },
          {
            title: 'Coltelli professionali',
            slug: 'coltelli-professionali-cucina',
            items: [{ name: 'Coltelli professionali', slug: 'coltelli-professionali-cucina' }],
          },
          {
            title: 'Pale pizza',
            slug: 'pale-pizza',
            items: [{ name: 'Pale pizza', slug: 'pale-pizza' }],
          },
        ],
      },
    ],
  },

  // ─── CARRELLI ED ARREDO ────────────────────────────────────────────
  {
    key: 'carrelli-arredo',
    label: 'Carrelli ed Arredo',
    slug: 'carrelli-arredo',
    description:
      'Carrelli di servizio, portateglie, espositori e arredi professionali per sale e cucine.',
    groups: [
      {
        title: 'Carrelli neutri',
        slug: 'carrelli-neutri',
        sections: [
          {
            title: 'Carrelli di servizio',
            slug: 'carrelli-di-servizio',
            items: [{ name: 'Carrelli di servizio', slug: 'carrelli-di-servizio' }],
          },
          {
            title: 'Carrelli per dolci, formaggi e antipasti',
            slug: 'carrelli-dolci-formaggi',
            items: [{ name: 'Carrelli per dolci, formaggi e antipasti', slug: 'carrelli-dolci-formaggi' }],
          },
          {
            title: 'Portavassoi',
            slug: 'portavassoi',
            items: [{ name: 'Portavassoi', slug: 'portavassoi' }],
          },
          {
            title: 'Portateglie',
            slug: 'portateglie',
            items: [{ name: 'Portateglie', slug: 'portateglie' }],
          },
          {
            title: 'Porta piatti, bicchieri e cestelli',
            slug: 'porta-piatti-bicchieri',
            items: [{ name: 'Porta piatti, bicchieri e cestelli', slug: 'porta-piatti-bicchieri' }],
          },
        ],
      },
      {
        title: 'Carrelli Caldi e Freddi',
        slug: 'carrelli-caldi-e-freddi',
        sections: [
          {
            title: 'Carrelli caldi',
            slug: 'carrelli-caldi',
            items: [{ name: 'Carrelli caldi', slug: 'carrelli-caldi' }],
          },
          {
            title: 'Espositori riscaldati',
            slug: 'espositori-riscaldati',
            items: [{ name: 'Espositori riscaldati', slug: 'espositori-riscaldati' }],
          },
          {
            title: 'Flambè',
            slug: 'flambe',
            items: [{ name: 'Flambè', slug: 'flambe' }],
          },
          {
            title: 'Scalda piatti, teglie e bicchieri',
            slug: 'scalda-piatti',
            items: [{ name: 'Scalda piatti, teglie e bicchieri', slug: 'scalda-piatti' }],
          },
          {
            title: 'Carrelli refrigerati portateglie e piatti',
            slug: 'carrelli-refrig-portateglie',
            items: [{ name: 'Carrelli refrigerati portateglie e piatti', slug: 'carrelli-refrig-portateglie' }],
          },
          {
            title: 'Vasche refrigerate',
            slug: 'vasche-refrig-carrelli',
            items: [{ name: 'Vasche refrigerate', slug: 'vasche-refrig-carrelli' }],
          },
        ],
      },
      {
        title: 'Carrelli per hotel',
        slug: 'carrelli-per-hotel',
        sections: [
          {
            title: 'Carrelli per colazione',
            slug: 'carrelli-per-colazione',
            items: [{ name: 'Carrelli per colazione', slug: 'carrelli-per-colazione' }],
          },
          {
            title: 'Portavaligie',
            slug: 'portavaligie',
            items: [{ name: 'Portavaligie', slug: 'portavaligie' }],
          },
          {
            title: 'Carrelli per pulizie',
            slug: 'carrelli-per-pulizie',
            items: [{ name: 'Carrelli per pulizie', slug: 'carrelli-per-pulizie' }],
          },
          {
            title: 'Portabiancheria',
            slug: 'portabiancheria',
            items: [{ name: 'Portabiancheria', slug: 'portabiancheria' }],
          },
          {
            title: 'Trasporto pesante',
            slug: 'trasporto-pesante',
            items: [{ name: 'Trasporto pesante', slug: 'trasporto-pesante' }],
          },
          {
            title: 'Carrelli porta cestelli',
            slug: 'carrelli-porta-cestelli',
            items: [{ name: 'Carrelli porta cestelli', slug: 'carrelli-porta-cestelli' }],
          },
        ],
      },
      {
        title: 'Arredo Sala',
        slug: 'arredo-sala',
        sections: [
          {
            title: 'Mobili in Legno',
            slug: 'mobili-in-legno',
            items: [{ name: 'Mobili in Legno', slug: 'mobili-in-legno' }],
          },
          {
            title: 'Pattumiere',
            slug: 'pattumiere',
            items: [{ name: 'Pattumiere', slug: 'pattumiere' }],
          },
          {
            title: 'Aste delimita corsie',
            slug: 'aste-delimita-corsie',
            items: [{ name: 'Aste delimita corsie', slug: 'aste-delimita-corsie' }],
          },
          {
            title: 'Elettroinsetticida',
            slug: 'elettroinsetticida',
            items: [{ name: 'Elettroinsetticida', slug: 'elettroinsetticida' }],
          },
          {
            title: 'Lampade da tavolo',
            slug: 'lampade-da-tavolo',
            items: [{ name: 'Lampade da tavolo', slug: 'lampade-da-tavolo' }],
          },
        ],
      },
      {
        title: 'Arredo Giardino',
        slug: 'arredo-giardino',
        sections: [
          {
            title: 'Salotti da esterno',
            slug: 'salotti-da-esterno',
            items: [{ name: 'Salotti da esterno', slug: 'salotti-da-esterno' }],
          },
          {
            title: 'Lettini prendisole',
            slug: 'lettini-prendisole',
            items: [{ name: 'Lettini prendisole', slug: 'lettini-prendisole' }],
          },
          {
            title: 'Tavoli e Sedie da esterno',
            slug: 'tavoli-sedie-esterno',
            items: [{ name: 'Tavoli e Sedie da esterno', slug: 'tavoli-sedie-esterno' }],
          },
          {
            title: 'Riscaldatori da esterno',
            slug: 'riscaldatori-da-esterno',
            items: [{ name: 'Riscaldatori da esterno', slug: 'riscaldatori-da-esterno' }],
          },
          {
            title: 'Piante artificiali',
            slug: 'piante-artificiali',
            items: [{ name: 'Piante artificiali', slug: 'piante-artificiali' }],
          },
        ],
      },
      {
        title: 'Neutro inox',
        slug: 'neutro-inox',
        sections: [
          {
            title: 'Tavoli Inox',
            slug: 'tavoli-inox',
            items: [{ name: 'Tavoli Inox', slug: 'tavoli-inox' }],
          },
          {
            title: 'Tavoli armadiati inox',
            slug: 'tavoli-armadiati-inox',
            items: [{ name: 'Tavoli armadiati inox', slug: 'tavoli-armadiati-inox' }],
          },
          {
            title: 'Pensili inox',
            slug: 'pensili-inox',
            items: [{ name: 'Pensili inox', slug: 'pensili-inox' }],
          },
          {
            title: 'Armadi Inox',
            slug: 'armadi-inox',
            items: [{ name: 'Armadi Inox', slug: 'armadi-inox' }],
          },
          {
            title: 'Lavelli Inox',
            slug: 'lavelli-inox',
            items: [{ name: 'Lavelli Inox', slug: 'lavelli-inox' }],
          },
          {
            title: 'Casseforti',
            slug: 'casseforti-inox',
            items: [{ name: 'Casseforti', slug: 'casseforti-inox' }],
          },
          {
            title: 'Lavamani Inox',
            slug: 'lavamani-inox',
            items: [{ name: 'Lavamani Inox', slug: 'lavamani-inox' }],
          },
        ],
      },
    ],
  },

  // ─── HOTELLERIE ────────────────────────────────────────────────────
  {
    key: 'hotellerie',
    label: 'Hotellerie',
    slug: 'hotellerie',
    description:
      'Attrezzature e accessori per alberghi e strutture ricettive: minibar, bollitori, casseforti, linea cortesia e altro.',
    groups: [
      {
        title: 'Cucina',
        slug: 'cucina-hotel',
        sections: [
          {
            title: 'Casseruole e pentole',
            slug: 'casseruole-e-pentole',
            items: [{ name: 'Casseruole e pentole', slug: 'casseruole-e-pentole' }],
          },
          {
            title: 'Padelle e tegami',
            slug: 'padelle-e-tegami',
            items: [{ name: 'Padelle e tegami', slug: 'padelle-e-tegami' }],
          },
          {
            title: 'Coperchi',
            slug: 'coperchi',
            items: [{ name: 'Coperchi', slug: 'coperchi' }],
          },
          {
            title: 'Coltelli professionali',
            slug: 'coltelli-professionali-hotel',
            items: [{ name: 'Coltelli professionali', slug: 'coltelli-professionali-hotel' }],
          },
          {
            title: 'Ceppi e Taglieri',
            slug: 'ceppi-e-taglieri',
            items: [{ name: 'Ceppi e Taglieri', slug: 'ceppi-e-taglieri' }],
          },
          {
            title: 'Accessori Cucina',
            slug: 'accessori-cucina-hotel',
            items: [{ name: 'Accessori Cucina', slug: 'accessori-cucina-hotel' }],
          },
          {
            title: 'Altri accessori Cucina',
            slug: 'altri-accessori-cucina',
            items: [{ name: 'Altri accessori Cucina', slug: 'altri-accessori-cucina' }],
          },
          {
            title: 'Altri formati',
            slug: 'altri-formati',
            items: [{ name: 'Altri formati', slug: 'altri-formati' }],
          },
        ],
      },
      {
        title: 'Tavola',
        slug: 'tavola',
        sections: [
          {
            title: 'Piatti per ristoranti',
            slug: 'piatti-per-ristoranti',
            items: [{ name: 'Piatti per ristoranti', slug: 'piatti-per-ristoranti' }],
          },
          {
            title: 'Porcellane',
            slug: 'porcellane',
            items: [{ name: 'Porcellane', slug: 'porcellane' }],
          },
          {
            title: 'Posate',
            slug: 'posate',
            items: [{ name: 'Posate', slug: 'posate' }],
          },
          {
            title: 'Vassoi e zuppiere inox',
            slug: 'vassoi-e-zuppiere-inox',
            items: [{ name: 'Vassoi e zuppiere inox', slug: 'vassoi-e-zuppiere-inox' }],
          },
          {
            title: 'Secchielli per ghiaccio',
            slug: 'secchielli-per-ghiaccio',
            items: [{ name: 'Secchielli per ghiaccio', slug: 'secchielli-per-ghiaccio' }],
          },
        ],
      },
      {
        title: 'Camera',
        slug: 'camera',
        sections: [
          {
            title: 'Minibar',
            slug: 'minibar',
            items: [{ name: 'Minibar', slug: 'minibar' }],
          },
          {
            title: 'Casseforti',
            slug: 'casseforti-camera',
            items: [{ name: 'Casseforti', slug: 'casseforti-camera' }],
          },
          {
            title: 'Reggi valigia',
            slug: 'reggi-valigia',
            items: [{ name: 'Reggi valigia', slug: 'reggi-valigia' }],
          },
          {
            title: 'Lettini Baby',
            slug: 'lettini-baby',
            items: [{ name: 'Lettini Baby', slug: 'lettini-baby' }],
          },
          {
            title: 'Stiro e Grucce',
            slug: 'stiro-e-grucce',
            items: [{ name: 'Stiro e Grucce', slug: 'stiro-e-grucce' }],
          },
          {
            title: 'Fasciatoi',
            slug: 'fasciatoi',
            items: [{ name: 'Fasciatoi', slug: 'fasciatoi' }],
          },
          {
            title: 'Materassi',
            slug: 'materassi',
            items: [{ name: 'Materassi', slug: 'materassi' }],
          },
          {
            title: 'Guanciali',
            slug: 'guanciali',
            items: [{ name: 'Guanciali', slug: 'guanciali' }],
          },
          {
            title: 'Reti',
            slug: 'reti',
            items: [{ name: 'Reti', slug: 'reti' }],
          },
          {
            title: 'Bollitori',
            slug: 'bollitori',
            items: [{ name: 'Bollitori', slug: 'bollitori' }],
          },
          {
            title: 'Linea Cortesia',
            slug: 'linea-cortesia-camera',
            items: [{ name: 'Linea Cortesia', slug: 'linea-cortesia-camera' }],
          },
        ],
      },
      {
        title: 'Bagno',
        slug: 'bagno',
        sections: [
          {
            title: 'Asciugacapelli/Phon',
            slug: 'asciugacapelli-phon',
            items: [{ name: 'Asciugacapelli/Phon', slug: 'asciugacapelli-phon' }],
          },
          {
            title: 'Asciugamani',
            slug: 'asciugamani',
            items: [{ name: 'Asciugamani', slug: 'asciugamani' }],
          },
          {
            title: 'Distributori di Carta',
            slug: 'distributori-di-carta',
            items: [{ name: 'Distributori di Carta', slug: 'distributori-di-carta' }],
          },
          {
            title: 'Linea Cortesia',
            slug: 'linea-cortesia-bagno',
            items: [{ name: 'Linea Cortesia', slug: 'linea-cortesia-bagno' }],
          },
          {
            title: 'Supporti a muro',
            slug: 'supporti-a-muro',
            items: [{ name: 'Supporti a muro', slug: 'supporti-a-muro' }],
          },
          {
            title: 'Dispenser a muro',
            slug: 'dispenser-a-muro',
            items: [{ name: 'Dispenser a muro', slug: 'dispenser-a-muro' }],
          },
          {
            title: 'Ricariche',
            slug: 'ricariche',
            items: [{ name: 'Ricariche', slug: 'ricariche' }],
          },
        ],
      },
      {
        title: 'Buffet e Colazione',
        slug: 'buffet-e-colazione',
        sections: [
          {
            title: 'Carrelli caldi',
            slug: 'carrelli-caldi-buffet',
            items: [{ name: 'Carrelli caldi', slug: 'carrelli-caldi-buffet' }],
          },
          {
            title: 'Espositori riscaldati',
            slug: 'espositori-riscaldati-buffet',
            items: [{ name: 'Espositori riscaldati', slug: 'espositori-riscaldati-buffet' }],
          },
          {
            title: 'Distributori bevande',
            slug: 'distributori-bevande',
            items: [{ name: 'Distributori bevande', slug: 'distributori-bevande' }],
          },
          {
            title: 'Vetrinette',
            slug: 'vetrinette-buffet',
            items: [{ name: 'Vetrinette', slug: 'vetrinette-buffet' }],
          },
          {
            title: 'Tostapane e fornetti',
            slug: 'tostapane-e-fornetti-buffet',
            items: [{ name: 'Tostapane e fornetti', slug: 'tostapane-e-fornetti-buffet' }],
          },
          {
            title: 'Chafing Dish',
            slug: 'chafing-dish-buffet',
            items: [{ name: 'Chafing Dish', slug: 'chafing-dish-buffet' }],
          },
          {
            title: 'Tavole Calde',
            slug: 'tavole-calde-buffet',
            items: [{ name: 'Tavole Calde', slug: 'tavole-calde-buffet' }],
          },
          {
            title: 'Distribuzione Cibi',
            slug: 'distribuzione-cibi',
            items: [{ name: 'Distribuzione Cibi', slug: 'distribuzione-cibi' }],
          },
          {
            title: 'Gastronorm',
            slug: 'gastronorm-buffet',
            items: [{ name: 'Gastronorm', slug: 'gastronorm-buffet' }],
          },
          {
            title: 'Vaschette Gelato',
            slug: 'vaschette-gelato-buffet',
            items: [{ name: 'Vaschette Gelato', slug: 'vaschette-gelato-buffet' }],
          },
          {
            title: 'Centrifughe Estrattori',
            slug: 'centrifughe-estrattori-buffet',
            items: [{ name: 'Centrifughe Estrattori', slug: 'centrifughe-estrattori-buffet' }],
          },
        ],
      },
      {
        title: 'Food',
        slug: 'food',
        sections: [
          {
            title: 'Creme Fredde',
            slug: 'creme-fredde',
            items: [{ name: 'Creme Fredde', slug: 'creme-fredde' }],
          },
          {
            title: 'Bevande Fredde',
            slug: 'bevande-fredde',
            items: [{ name: 'Bevande Fredde', slug: 'bevande-fredde' }],
          },
          {
            title: 'Sorbetti - Granite - Gelati Soft',
            slug: 'sorbetti-granite-gelati-soft',
            items: [{ name: 'Sorbetti - Granite - Gelati Soft', slug: 'sorbetti-granite-gelati-soft' }],
          },
          {
            title: 'Bevande Calde',
            slug: 'bevande-calde',
            items: [{ name: 'Bevande Calde', slug: 'bevande-calde' }],
          },
          {
            title: 'Cereali e Frutta Secca',
            slug: 'cereali-e-frutta-secca',
            items: [{ name: 'Cereali e Frutta Secca', slug: 'cereali-e-frutta-secca' }],
          },
          {
            title: 'Confetture',
            slug: 'confetture',
            items: [{ name: 'Confetture', slug: 'confetture' }],
          },
        ],
      },
    ],
  },

  // ─── IGIENE E PULIZIA ──────────────────────────────────────────────
  {
    key: 'igiene',
    label: 'Igiene e Pulizia',
    slug: 'igiene',
    description:
      'Prodotti e macchinari per la pulizia, sanificazione e igiene professionale: detergenti, vapore e linea stiro.',
    groups: [
      {
        title: 'Macchinari per sanificazione',
        slug: 'macchinari-per-sanificazione',
        sections: [
          {
            title: 'Pulizia e vapore',
            slug: 'pulizia-e-vapore',
            items: [{ name: 'Pulizia e vapore', slug: 'pulizia-e-vapore' }],
          },
          {
            title: 'Ozonizzatori',
            slug: 'ozonizzatori',
            items: [{ name: 'Ozonizzatori', slug: 'ozonizzatori' }],
          },
        ],
      },
      {
        title: 'Detergenza Professionale',
        slug: 'detergenza-professionale',
        sections: [
          {
            title: 'Igienizzanti per mani',
            slug: 'igienizzanti-per-mani',
            items: [{ name: 'Igienizzanti per mani', slug: 'igienizzanti-per-mani' }],
          },
          {
            title: 'Detersivi Piatti',
            slug: 'detersivi-piatti',
            items: [{ name: 'Detersivi Piatti', slug: 'detersivi-piatti' }],
          },
          {
            title: 'Detersivi pavimento',
            slug: 'detersivi-pavimento',
            items: [{ name: 'Detersivi pavimento', slug: 'detersivi-pavimento' }],
          },
          {
            title: 'Detersivi Bagno',
            slug: 'detersivi-bagno',
            items: [{ name: 'Detersivi Bagno', slug: 'detersivi-bagno' }],
          },
          {
            title: 'Sgrassatori e anticalcare',
            slug: 'sgrassatori-e-anticalcare',
            items: [{ name: 'Sgrassatori e anticalcare', slug: 'sgrassatori-e-anticalcare' }],
          },
          {
            title: 'Detersivi bucato',
            slug: 'detersivi-bucato',
            items: [{ name: 'Detersivi bucato', slug: 'detersivi-bucato' }],
          },
          {
            title: 'Detergenti Speciali',
            slug: 'detergenti-speciali',
            items: [{ name: 'Detergenti Speciali', slug: 'detergenti-speciali' }],
          },
        ],
      },
      {
        title: 'Carrelli',
        slug: 'carrelli-igiene',
        sections: [
          {
            title: 'Per pulizie',
            slug: 'per-pulizie',
            items: [{ name: 'Per pulizie', slug: 'per-pulizie' }],
          },
          {
            title: 'Portabiancheria',
            slug: 'portabiancheria-igiene',
            items: [{ name: 'Portabiancheria', slug: 'portabiancheria-igiene' }],
          },
        ],
      },
      {
        title: 'Linea Stiro',
        slug: 'linea-stiro',
        sections: [
          {
            title: 'Ferri da stiro professionali',
            slug: 'ferri-da-stiro-professionali',
            items: [{ name: 'Ferri da stiro professionali', slug: 'ferri-da-stiro-professionali' }],
          },
          {
            title: 'Tavoli da stiro professionali',
            slug: 'tavoli-da-stiro-professionali',
            items: [{ name: 'Tavoli da stiro professionali', slug: 'tavoli-da-stiro-professionali' }],
          },
          {
            title: 'Accessori stiro',
            slug: 'accessori-stiro',
            items: [{ name: 'Accessori stiro', slug: 'accessori-stiro' }],
          },
        ],
      },
    ],
  },

  // ─── RICAMBI (kept as-is) ──────────────────────────────────────────
  {
    key: 'ricambi',
    label: 'Ricambi',
    slug: 'ricambi',
    description:
      'Ricambi originali e compatibili per tutte le attrezzature professionali: linea caldo, freddo, preparazione e altro.',
    groups: [
      {
        title: 'Ricambi professionali',
        slug: 'ricambi-professionali',
        sections: [
          {
            title: 'Ricambi Linea Caldo',
            slug: 'ricambi-linea-caldo',
            items: [
              { name: 'Cottura a contatto', slug: 'cottura-a-contatto' },
              { name: 'Forni professionali', slug: 'forni-professionali' },
              { name: 'Mantenimento temperatura', slug: 'mantenimento-temperatura' },
              { name: 'Cottura per immersione', slug: 'cottura-per-immersione' },
              { name: 'Cucine professionali', slug: 'cucine-professionali' },
            ],
          },
          {
            title: 'Ricambi Preparazione',
            slug: 'ricambi-preparazione',
            items: [
              { name: 'Lavorazione carne e formaggio', slug: 'lavorazione-carne-e-formaggio' },
              { name: 'Mixer, pelatura e taglio', slug: 'mixer-pelatura-e-taglio' },
              { name: 'Lavorazione pasta', slug: 'lavorazione-pasta' },
              { name: 'Conservazione', slug: 'conservazione' },
            ],
          },
          {
            title: 'Altre sezioni',
            slug: 'altre-sezioni',
            items: [
              { name: 'Ricambi Linea Freddo', slug: 'ricambi-linea-freddo' },
              { name: 'Ricambi Sanificazione e Pulizia', slug: 'ricambi-sanificazione-e-pulizia' },
              { name: 'Ricambi Carrelli e Arredo', slug: 'ricambi-carrelli-e-arredo' },
              { name: 'Ricambi Senza Esploso', slug: 'ricambi-senza-esploso' },
            ],
          },
        ],
      },
    ],
  },

  // ─── SECONDA SCELTA (kept as-is) ──────────────────────────────────
  {
    key: 'seconda-scelta',
    label: 'Seconda Scelta',
    slug: 'seconda-scelta',
    description:
      'Prodotti professionali di seconda scelta a prezzi scontati: occasioni e offerte su attrezzature con piccoli difetti estetici.',
    groups: [
      {
        title: 'Seconda Scelta',
        slug: 'seconda-scelta',
        sections: [
          {
            title: 'Prodotti disponibili',
            slug: 'prodotti-disponibili',
            items: [
              { name: 'Seconda scelta professionale', slug: 'seconda-scelta-professionale' },
            ],
          },
        ],
      },
    ],
  },
];
