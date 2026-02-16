export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  priceNet: number;
  priceGross: number;
  vatRate: number;
  originalPriceNet?: number;
  availability: 'disponibile' | 'in_arrivo' | 'esaurito' | 'su_ordinazione';
  weight?: number;
  dimensions?: { width: number; depth: number; height: number };
  description: string;
  shortDescription: string;
  specs: Record<string, Record<string, string>>; // grouped specs
  images: string[];
  documents: { name: string; url: string; type: string }[];
  categorySlug: string;
  rating: number;
  reviewCount: number;
  deliveryDays: number;
  isNew?: boolean;
  isOnSale?: boolean;
  accessories?: string[]; // product IDs
  spareParts?: string[]; // product IDs
}

export const sampleProducts: Product[] = [
  {
    id: 'AB5514',
    sku: 'AB5514',
    name: 'Abbattitore di Temperatura AB5514 Forcar',
    slug: 'abbattitore-temperatura-ab5514-forcar',
    brand: 'FORCAR',
    priceNet: 4106.52,
    priceGross: 5009.95,
    vatRate: 22,
    originalPriceNet: 4800.00,
    availability: 'disponibile',
    weight: 85,
    dimensions: { width: 80, depth: 80, height: 152 },
    description: 'Abbattitore di temperatura professionale a 5 teglie GN 1/1 o 600x400 mm. Abbattimento positivo da +90\u00b0C a +3\u00b0C in meno di 90 minuti. Abbattimento negativo da +90\u00b0C a -18\u00b0C in meno di 240 minuti. Pannello di controllo digitale con sonda al cuore. Struttura interamente in acciaio inox AISI 304.',
    shortDescription: 'Abbattitore professionale 5 teglie, +90\u00b0C a +3\u00b0C in 90 min',
    specs: {
      'Dimensioni e Peso': {
        'Larghezza': '800 mm',
        'Profondit\u00e0': '800 mm',
        'Altezza': '1520 mm',
        'Peso netto': '85 kg',
      },
      'Prestazioni': {
        'Capacit\u00e0': '5 teglie GN 1/1',
        'Abbattimento positivo': 'da +90\u00b0C a +3\u00b0C in 90 min',
        'Abbattimento negativo': 'da +90\u00b0C a -18\u00b0C in 240 min',
        'Capacit\u00e0 abbattimento': '25 kg',
      },
      'Caratteristiche Tecniche': {
        'Alimentazione': '220V / 50Hz',
        'Potenza': '1400W',
        'Gas refrigerante': 'R452A',
        'Materiale': 'Acciaio Inox AISI 304',
        'Pannello': 'Digitale con sonda al cuore',
      },
    },
    images: [
      '/images/products/ab5514-front.jpg',
      '/images/products/ab5514-open.jpg',
      '/images/products/ab5514-panel.jpg',
      '/images/products/ab5514-interior.jpg',
    ],
    documents: [
      { name: 'Scheda Tecnica', url: '/docs/ab5514-scheda.pdf', type: 'datasheet' },
      { name: 'Manuale d\'Uso', url: '/docs/ab5514-manuale.pdf', type: 'manual' },
    ],
    categorySlug: 'abbattitori',
    rating: 4.6,
    reviewCount: 23,
    deliveryDays: 5,
    isOnSale: true,
  },
  {
    id: 'FRY-TOP-E400',
    sku: 'FRY-TOP-E400',
    name: 'Fry Top Elettrico Liscio FTE400 Forcar',
    slug: 'fry-top-elettrico-liscio-fte400-forcar',
    brand: 'FORCAR',
    priceNet: 892.00,
    priceGross: 1088.24,
    vatRate: 22,
    availability: 'disponibile',
    weight: 38,
    dimensions: { width: 40, depth: 70, height: 28 },
    description: 'Fry top elettrico professionale con piastra liscia in acciaio. Ideale per cottura a contatto di carni, pesce e verdure.',
    shortDescription: 'Fry top elettrico piastra liscia 400mm professionale',
    specs: {
      'Dimensioni e Peso': {
        'Larghezza': '400 mm',
        'Profondit\u00e0': '700 mm',
        'Altezza': '280 mm',
        'Peso netto': '38 kg',
      },
      'Prestazioni': {
        'Superficie cottura': '395 x 560 mm',
        'Temperatura max': '300\u00b0C',
        'Tipo piastra': 'Liscia',
      },
      'Caratteristiche Tecniche': {
        'Alimentazione': '400V / 3N / 50Hz',
        'Potenza': '5400W',
        'Materiale piastra': 'Acciaio speciale',
        'Termostato': 'Regolabile 50-300\u00b0C',
      },
    },
    images: ['/images/products/fry-top-e400.jpg'],
    documents: [],
    categorySlug: 'fry-top',
    rating: 4.4,
    reviewCount: 12,
    deliveryDays: 3,
  },
  {
    id: 'FRIGO-700L',
    sku: 'FRIGO-700L',
    name: 'Frigorifero Professionale 700 Litri GN 2/1',
    slug: 'frigorifero-professionale-700l-gn21',
    brand: 'FORCAR',
    priceNet: 1450.00,
    priceGross: 1769.00,
    vatRate: 22,
    availability: 'disponibile',
    weight: 98,
    dimensions: { width: 71, depth: 80, height: 205 },
    description: 'Frigorifero professionale ventilato 700 litri con porta cieca. Temperatura +2\u00b0C / +8\u00b0C. Struttura in acciaio inox AISI 304.',
    shortDescription: 'Frigorifero ventilato 700L professionale GN 2/1',
    specs: {
      'Dimensioni e Peso': {
        'Larghezza': '710 mm',
        'Profondit\u00e0': '800 mm',
        'Altezza': '2050 mm',
        'Peso': '98 kg',
      },
      'Prestazioni': {
        'Volume': '700 litri',
        'Temperatura': '+2\u00b0C / +8\u00b0C',
        'Tipo': 'Ventilato',
        'Formato': 'GN 2/1',
      },
      'Caratteristiche Tecniche': {
        'Alimentazione': '220V / 50Hz',
        'Potenza assorbita': '350W',
        'Gas refrigerante': 'R290',
        'Classe energetica': 'B',
      },
    },
    images: ['/images/products/frigo-700l.jpg'],
    documents: [
      { name: 'Scheda Tecnica', url: '/docs/frigo-700l-scheda.pdf', type: 'datasheet' },
    ],
    categorySlug: 'frigoriferi-professionali',
    rating: 4.7,
    reviewCount: 31,
    deliveryDays: 7,
    isNew: true,
  },
  {
    id: 'FORNO-CONV-5T',
    sku: 'FORNO-CONV-5T',
    name: 'Forno a Convezione Elettrico 5 Teglie GN 1/1',
    slug: 'forno-convezione-elettrico-5-teglie-gn11',
    brand: 'FORCAR',
    priceNet: 1680.00,
    priceGross: 2049.60,
    vatRate: 22,
    availability: 'disponibile',
    weight: 65,
    dimensions: { width: 59, depth: 66, height: 58 },
    description: 'Forno a convezione professionale elettrico da 5 teglie GN 1/1. Umidificazione manuale, timer digitale, doppio vetro, illuminazione interna.',
    shortDescription: 'Forno a convezione 5 teglie GN 1/1 professionale',
    specs: {
      'Dimensioni e Peso': {
        'Larghezza': '590 mm',
        'Profondit\u00e0': '660 mm',
        'Altezza': '580 mm',
        'Peso': '65 kg',
      },
      'Prestazioni': {
        'Capacit\u00e0': '5 teglie GN 1/1',
        'Temperatura max': '300\u00b0C',
        'Umidificazione': 'Manuale',
      },
      'Caratteristiche Tecniche': {
        'Alimentazione': '380V / 3N / 50Hz',
        'Potenza': '6300W',
        'Timer': 'Digitale 0-120 min',
        'Porta': 'Doppio vetro temperato',
      },
    },
    images: ['/images/products/forno-conv-5t.jpg'],
    documents: [],
    categorySlug: 'forni-a-convezione',
    rating: 4.5,
    reviewCount: 18,
    deliveryDays: 5,
  },
];
