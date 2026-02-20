import { useEffect, useState } from 'react';
import type { Product } from '../data/products/sampleProducts';
import { sampleProducts } from '../data/products/sampleProducts';
import type { Guide } from '../data/guides';
import { realProducts } from '../data/products/realProducts';
import { guides } from '../data/guides';
import { catalogMenu } from '../data/catalogMenu';

const PRODUCTS_KEY = 'bianchipro.store.products.v1';
const BLOG_KEY = 'bianchipro.store.blog.v1';
const HOME_CONTENT_KEY = 'bianchipro.store.home-content.v1';
const ORDERS_KEY = 'bianchipro.store.orders.v1';

const PRODUCTS_EVENT = 'bianchipro:products-updated';
const BLOG_EVENT = 'bianchipro:blog-updated';
const HOME_CONTENT_EVENT = 'bianchipro:home-content-updated';
const ORDERS_EVENT = 'bianchipro:orders-updated';

export type BlogStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  image: string;
  readTime: number;
  publishedAt: string;
  status: BlogStatus;
  scheduledAt?: string;
  relatedCategories: string[];
}

export interface HomeContentConfig {
  promoText: string;
  serviceText: string;
  heroImage: string;
  heroKicker: string;
  heroTitle: string;
  heroDescription: string;
  heroCtaLabel: string;
  heroCtaPath: string;
}

export type OrderStatus =
  | 'pending_payment'
  | 'pending_bank_transfer'
  | 'processing'
  | 'paid'
  | 'cancelled';

export interface OrderRecord {
  id: string;
  createdAt: string;
  status: OrderStatus;
  paymentMethod: 'card' | 'bank_transfer';
  subtotalNet: number;
  vat: number;
  shipping: number;
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    companyName?: string;
    vatNumber?: string;
    fiscalCode?: string;
    address: string;
    city: string;
    cap: string;
    province: string;
    billingAddressSameAsShipping: boolean;
    billingAddress?: string;
    billingCity?: string;
    billingCap?: string;
    billingProvince?: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    image: string;
  }>;
}

const DEFAULT_HOME_CONTENT: HomeContentConfig = {
  promoText: 'Riservato solo a Partite IVA',
  serviceText: 'Consulenza tecnica professionale dedicata al mondo Ho.Re.Ca.',
  heroImage: 'https://www.figma.com/api/mcp/asset/ceef92ec-53bf-49ed-bfb9-430c7917ad14',
  heroKicker: 'Bianchipro',
  heroTitle: "Soluzioni certificate per l'operativita Ho.Re.Ca.",
  heroDescription:
    'Attrezzature, installazione e supporto tecnico per professionisti con Partita IVA: riduci i fermi macchina e metti subito in servizio la tua cucina.',
  heroCtaLabel: 'Sfoglia il catalogo B2B',
  heroCtaPath: '/categoria/linea-caldo',
};

const LEGACY_PROMO_TEXT = 'Spedizione gratuita sopra 2.000 EUR + IVA in Italia';

function canUseDOM() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function parseJSON<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function emit(eventName: string) {
  if (!canUseDOM()) return;
  window.dispatchEvent(new CustomEvent(eventName));
}

function normalizeProduct(product: Product): Product {
  const vatRate = Number.isFinite(product.vatRate) ? product.vatRate : 22;
  const priceNet = Number.isFinite(product.priceNet) ? product.priceNet : 0;
  const priceGross = Math.round(priceNet * (1 + vatRate / 100) * 100) / 100;

  return {
    ...product,
    priceNet,
    vatRate,
    priceGross,
    isOnSale: Boolean(product.originalPriceNet && product.originalPriceNet > product.priceNet),
  };
}

function withSampleFallback(products: Product[]): Product[] {
  const merged = [...products];
  const existingSlugs = new Set(products.map((product) => product.slug));

  sampleProducts.forEach((sampleProduct) => {
    if (!existingSlugs.has(sampleProduct.slug)) {
      merged.push(sampleProduct);
      existingSlugs.add(sampleProduct.slug);
    }
  });

  return merged;
}

function buildAutoLeafProduct(
  seed: Product | undefined,
  leaf: {
    name: string;
    slug: string;
    sectionTitle: string;
    groupTitle: string;
    categoryLabel: string;
  },
  index: number,
  variant: number,
): Product {
  const vatRate = Number.isFinite(seed?.vatRate) ? (seed?.vatRate as number) : 22;
  const priceNet = Number.isFinite(seed?.priceNet) ? (seed?.priceNet as number) : 990;
  const priceGross = Math.round(priceNet * (1 + vatRate / 100) * 100) / 100;
  const code = String(index + 1).padStart(4, '0');
  const variantCode = String(variant + 1).padStart(2, '0');
  const displayNumber = variant + 1;

  return {
    id: `AUTO-${code}-${variantCode}`,
    sku: `AUTO-${leaf.slug.toUpperCase().replace(/[^A-Z0-9]/g, '-').slice(0, 18) || code}-${variantCode}`,
    name: `${leaf.name} professionale ${displayNumber}`,
    slug: `${leaf.slug}-catalogo-auto-${variantCode}`,
    brand: seed?.brand || 'BIANCHIPRO',
    priceNet,
    priceGross,
    vatRate,
    originalPriceNet: Math.round(priceNet * 1.14 * 100) / 100,
    availability: 'disponibile',
    weight: seed?.weight || 1,
    dimensions: seed?.dimensions || { width: 60, depth: 60, height: 90 },
    description: `${leaf.name} professionale dedicato alla ${leaf.categoryLabel.toLowerCase()}. Soluzione pensata per uso Ho.Re.Ca.`,
    shortDescription: `${leaf.name} professionale per cucina e ristorazione.`,
    specs: {
      'Informazioni Prodotto': {
        Categoria: leaf.categoryLabel,
        Sottocategoria: leaf.groupTitle,
        Sezione: leaf.sectionTitle,
      },
      'Dettagli Tecnici': {
        Utilizzo: 'Professionale',
        Ambito: 'Ho.Re.Ca.',
      },
    },
    images: seed?.images?.length ? seed.images : sampleProducts[0]?.images || [],
    documents: seed?.documents || [],
    categorySlug: leaf.slug,
    rating: seed?.rating || 4.5,
    reviewCount: seed?.reviewCount || 1,
    deliveryDays: seed?.deliveryDays || 7,
    isNew: true,
    isOnSale: true,
  };
}

function withLeafCoverage(products: Product[]): Product[] {
  const MIN_PRODUCTS_PER_LEAF = 8;
  const leafItems = catalogMenu.flatMap((category) =>
    category.groups.flatMap((group) =>
      group.sections.flatMap((section) =>
        section.items.map((item) => ({
          name: item.name,
          slug: item.slug,
          sectionTitle: section.title,
          groupTitle: group.title,
          categoryLabel: category.label,
        })),
      ),
    ),
  );

  const merged = [...products];
  const byCategory = new Map<string, number>();
  const existingProductSlugs = new Set<string>(products.map((product) => product.slug));
  const existingIds = new Set<string>(products.map((product) => product.id));
  const defaultSeed = products[0] || sampleProducts[0];

  merged.forEach((product) => {
    byCategory.set(product.categorySlug, (byCategory.get(product.categorySlug) || 0) + 1);
  });

  leafItems.forEach((leaf, index) => {
    let count = byCategory.get(leaf.slug) || 0;
    if (count >= MIN_PRODUCTS_PER_LEAF) return;

    while (count < MIN_PRODUCTS_PER_LEAF) {
      const seed = merged.find((product) => product.categorySlug === leaf.slug) || defaultSeed;
      const generated = buildAutoLeafProduct(seed, leaf, index, count);

      let safeSlug = generated.slug;
      let slugIndex = 1;
      while (existingProductSlugs.has(safeSlug)) {
        safeSlug = `${generated.slug}-${slugIndex}`;
        slugIndex += 1;
      }

      let safeId = generated.id;
      let idIndex = 1;
      while (existingIds.has(safeId)) {
        safeId = `${generated.id}-${idIndex}`;
        idIndex += 1;
      }

      const product: Product = {
        ...generated,
        slug: safeSlug,
        id: safeId,
      };

      merged.push(product);
      count += 1;
      byCategory.set(leaf.slug, count);
      existingProductSlugs.add(product.slug);
      existingIds.add(product.id);
    }
  });

  return merged;
}

function asISO(dateString: string | undefined, fallback: string) {
  if (!dateString) return fallback;
  const timestamp = Date.parse(dateString);
  if (Number.isNaN(timestamp)) return fallback;
  return new Date(timestamp).toISOString();
}

function guideToArticle(guide: Guide): BlogArticle {
  return {
    id: guide.id,
    title: guide.title,
    slug: guide.slug,
    category: guide.category,
    excerpt: guide.excerpt,
    content: guide.content,
    author: guide.author,
    image: guide.image,
    readTime: guide.readTime,
    publishedAt: asISO(guide.publishedAt, new Date().toISOString()),
    status: 'published',
    relatedCategories: guide.relatedCategories,
  };
}

export function getStoreProducts(): Product[] {
  if (!canUseDOM()) {
    return withLeafCoverage(withSampleFallback(realProducts)).map(normalizeProduct);
  }

  const fallback = withLeafCoverage(withSampleFallback(realProducts)).map(normalizeProduct);
  const fromStorage = parseJSON<Product[]>(window.localStorage.getItem(PRODUCTS_KEY), fallback);
  return withLeafCoverage(withSampleFallback(fromStorage)).map(normalizeProduct);
}

export function saveStoreProducts(products: Product[]) {
  if (!canUseDOM()) return;
  window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products.map(normalizeProduct)));
  emit(PRODUCTS_EVENT);
}

export function updateStoreProduct(slug: string, updates: Partial<Product>) {
  const current = getStoreProducts();
  const next = current.map((product) => {
    if (product.slug !== slug) return product;
    return normalizeProduct({ ...product, ...updates });
  });
  saveStoreProducts(next);
}

export function getStoreProductBySlug(slug: string): Product | undefined {
  return getStoreProducts().find((product) => product.slug === slug);
}

export function useStoreProducts() {
  const [products, setProducts] = useState<Product[]>(() => getStoreProducts());

  useEffect(() => {
    const refresh = () => setProducts(getStoreProducts());
    window.addEventListener(PRODUCTS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(PRODUCTS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return products;
}

export function getStoreBlogArticles(includeUnpublished = false): BlogArticle[] {
  const fallback = guides.map(guideToArticle);

  if (!canUseDOM()) {
    return includeUnpublished ? fallback : fallback.filter((article) => article.status === 'published');
  }

  const stored = parseJSON<BlogArticle[]>(window.localStorage.getItem(BLOG_KEY), fallback);
  const now = Date.now();

  return stored
    .map((article) => {
      if (
        article.status === 'scheduled' &&
        article.scheduledAt &&
        Date.parse(article.scheduledAt) <= now
      ) {
        return {
          ...article,
          status: 'published' as const,
          publishedAt: asISO(article.scheduledAt, article.publishedAt),
          scheduledAt: undefined,
        };
      }
      return article;
    })
    .filter((article) => includeUnpublished || article.status === 'published')
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export function saveStoreBlogArticles(articles: BlogArticle[]) {
  if (!canUseDOM()) return;
  window.localStorage.setItem(BLOG_KEY, JSON.stringify(articles));
  emit(BLOG_EVENT);
}

export function upsertStoreBlogArticle(article: BlogArticle) {
  const current = getStoreBlogArticles(true);
  const existingIndex = current.findIndex((item) => item.id === article.id);

  const normalized: BlogArticle = {
    ...article,
    publishedAt: asISO(article.publishedAt, new Date().toISOString()),
  };

  const next = [...current];
  if (existingIndex >= 0) {
    next[existingIndex] = normalized;
  } else {
    next.push(normalized);
  }

  saveStoreBlogArticles(next);
}

export function deleteStoreBlogArticle(articleId: string) {
  const current = getStoreBlogArticles(true);
  const next = current.filter((article) => article.id !== articleId);
  saveStoreBlogArticles(next);
}

export function getStoreBlogArticleBySlug(slug: string, includeUnpublished = false): BlogArticle | undefined {
  return getStoreBlogArticles(includeUnpublished).find((article) => article.slug === slug);
}

export function useStoreBlogArticles(includeUnpublished = false) {
  const [articles, setArticles] = useState<BlogArticle[]>(() => getStoreBlogArticles(includeUnpublished));

  useEffect(() => {
    const refresh = () => setArticles(getStoreBlogArticles(includeUnpublished));
    window.addEventListener(BLOG_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(BLOG_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [includeUnpublished]);

  return articles;
}

export function getHomeContentConfig(): HomeContentConfig {
  if (!canUseDOM()) return DEFAULT_HOME_CONTENT;
  const parsed = parseJSON<HomeContentConfig>(window.localStorage.getItem(HOME_CONTENT_KEY), DEFAULT_HOME_CONTENT);
  const normalizedPromoText = parsed.promoText?.trim() === LEGACY_PROMO_TEXT
    ? DEFAULT_HOME_CONTENT.promoText
    : parsed.promoText || DEFAULT_HOME_CONTENT.promoText;

  return {
    ...DEFAULT_HOME_CONTENT,
    ...parsed,
    promoText: normalizedPromoText,
  };
}

export function saveHomeContentConfig(config: HomeContentConfig) {
  if (!canUseDOM()) return;
  window.localStorage.setItem(HOME_CONTENT_KEY, JSON.stringify(config));
  emit(HOME_CONTENT_EVENT);
}

export function useHomeContentConfig() {
  const [config, setConfig] = useState<HomeContentConfig>(() => getHomeContentConfig());

  useEffect(() => {
    const refresh = () => setConfig(getHomeContentConfig());
    window.addEventListener(HOME_CONTENT_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(HOME_CONTENT_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return config;
}

export function getOrderRecords(): OrderRecord[] {
  if (!canUseDOM()) return [];
  return parseJSON<OrderRecord[]>(window.localStorage.getItem(ORDERS_KEY), []);
}

export function saveOrderRecords(orders: OrderRecord[]) {
  if (!canUseDOM()) return;
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  emit(ORDERS_EVENT);
}

export function createOrderRecord(order: Omit<OrderRecord, 'id' | 'createdAt'>, preferredOrderId?: string): OrderRecord {
  const existing = getOrderRecords();
  const sequence = String(existing.length + 1).padStart(5, '0');
  const generatedOrderId = `ORD-${new Date().getFullYear()}-${sequence}`;
  const normalizedPreferredOrderId = preferredOrderId?.trim();
  const canUsePreferredOrderId = Boolean(
    normalizedPreferredOrderId &&
    !existing.some((entry) => entry.id === normalizedPreferredOrderId),
  );

  const record: OrderRecord = {
    ...order,
    id: canUsePreferredOrderId ? (normalizedPreferredOrderId as string) : generatedOrderId,
    createdAt: new Date().toISOString(),
  };

  saveOrderRecords([record, ...existing]);
  return record;
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  const orders = getOrderRecords();
  const next = orders.map((order) => (order.id === orderId ? { ...order, status } : order));
  saveOrderRecords(next);
}

export function useOrderRecords() {
  const [orders, setOrders] = useState<OrderRecord[]>(() => getOrderRecords());

  useEffect(() => {
    const refresh = () => setOrders(getOrderRecords());
    window.addEventListener(ORDERS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(ORDERS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return orders;
}
