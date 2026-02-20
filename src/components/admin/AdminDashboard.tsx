import { useMemo, useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  Package,
  FileText,
  Image,
  ShoppingCart,
  Users,
  CreditCard,
  ClipboardCheck,
  Save,
  Plus,
  Trash2,
  Search,
  Filter,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { catalogMenu } from '../../data/catalogMenu';
import type { Product } from '../../data/products/sampleProducts';
import {
  useStoreProducts,
  updateStoreProduct,
  useStoreBlogArticles,
  upsertStoreBlogArticle,
  deleteStoreBlogArticle,
  useHomeContentConfig,
  saveHomeContentConfig,
  useOrderRecords,
  updateOrderStatus,
  type BlogArticle,
  type HomeContentConfig,
  type OrderStatus,
} from '../../lib/storefrontStore';
import { getStripePublishableKey, isStripeConfigured } from '../../config/stripe';
import { toast } from 'sonner';

type AdminTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'blog'
  | 'home'
  | 'orders'
  | 'customers'
  | 'payments'
  | 'audit';

interface AuditItem {
  id: string;
  at: string;
  actor: string;
  action: string;
  target: string;
  details: string;
}

const AUDIT_STORAGE_KEY = 'bianchipro.admin.audit.v1';

function loadAudit(): AuditItem[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(AUDIT_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as AuditItem[];
  } catch {
    return [];
  }
}

function saveAudit(logs: AuditItem[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

const availabilityOptions: Array<Product['availability']> = [
  'disponibile',
  'in_arrivo',
  'su_ordinazione',
  'esaurito',
];

const orderStatusOptions: OrderStatus[] = [
  'pending_payment',
  'pending_bank_transfer',
  'processing',
  'paid',
  'cancelled',
];

const tabItems: Array<{ id: AdminTab; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Prodotti', icon: Package },
  { id: 'categories', label: 'Categorie', icon: Filter },
  { id: 'blog', label: 'Blog', icon: FileText },
  { id: 'home', label: 'Home', icon: Image },
  { id: 'orders', label: 'Ordini', icon: ShoppingCart },
  { id: 'customers', label: 'Clienti', icon: Users },
  { id: 'payments', label: 'Pagamenti', icon: CreditCard },
  { id: 'audit', label: 'Audit', icon: ClipboardCheck },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const products = useStoreProducts();
  const blogArticles = useStoreBlogArticles(true);
  const homeContent = useHomeContentConfig();
  const orders = useOrderRecords();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [bulkDiscountPercent, setBulkDiscountPercent] = useState('');
  const [productDrafts, setProductDrafts] = useState<Record<string, Partial<Product>>>({});

  const [articleForm, setArticleForm] = useState<BlogArticle>({
    id: '',
    title: '',
    slug: '',
    category: "Guida all'acquisto",
    excerpt: '',
    content: '',
    author: user?.name || 'Redazione BianchiPro',
    image: '',
    readTime: 5,
    publishedAt: new Date().toISOString(),
    status: 'draft',
    scheduledAt: '',
    relatedCategories: [],
  });

  const [homeForm, setHomeForm] = useState<HomeContentConfig>(homeContent);
  const [auditItems, setAuditItems] = useState<AuditItem[]>(() => loadAudit());

  const appendAudit = (action: string, target: string, details: string) => {
    const next: AuditItem = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
      at: new Date().toISOString(),
      actor: user?.email || 'admin',
      action,
      target,
      details,
    };

    setAuditItems((prev) => {
      const logs = [next, ...prev].slice(0, 250);
      saveAudit(logs);
      return logs;
    });
  };

  const getDraft = (product: Product): Product => ({
    ...product,
    ...productDrafts[product.slug],
  });

  const filteredProducts = useMemo(() => {
    const text = productSearch.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        text.length === 0 ||
        product.name.toLowerCase().includes(text) ||
        product.sku.toLowerCase().includes(text) ||
        product.slug.toLowerCase().includes(text);

      const matchesCategory = !categoryFilter || product.categorySlug === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, productSearch, categoryFilter]);

  const customers = useMemo(() => {
    const map = new Map<string, { email: string; name: string; orders: number; total: number }>();

    for (const order of orders) {
      const key = order.customer.email.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.orders += 1;
        existing.total += order.total;
      } else {
        map.set(key, {
          email: order.customer.email,
          name: order.customer.name,
          orders: 1,
          total: order.total,
        });
      }
    }

    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [orders]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Accesso negato</h2>
        <p className="text-gray-600 mb-6">Solo gli amministratori possono accedere a questa sezione.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
        >
          Torna alla home
        </button>
      </div>
    );
  }

  const metrics = {
    products: products.length,
    publishedArticles: blogArticles.filter((article) => article.status === 'published').length,
    orders: orders.length,
    revenue: orders.reduce((acc, order) => acc + order.total, 0),
    pendingPayments: orders.filter((order) => order.status === 'pending_payment' || order.status === 'pending_bank_transfer').length,
    processing: orders.filter((order) => order.status === 'processing').length,
    customers: customers.length,
  };

  const handleSaveProduct = (product: Product) => {
    const draft = getDraft(product);

    updateStoreProduct(product.slug, {
      name: draft.name,
      images: draft.images,
      availability: draft.availability,
      priceNet: Number(draft.priceNet || 0),
      originalPriceNet: draft.originalPriceNet ? Number(draft.originalPriceNet) : undefined,
      shortDescription: draft.shortDescription,
    });

    setProductDrafts((prev) => {
      const next = { ...prev };
      delete next[product.slug];
      return next;
    });

    appendAudit('update_product', product.slug, `Prezzo netto aggiornato a ${draft.priceNet}`);
    toast.success(`Prodotto aggiornato: ${draft.name}`);
  };

  const handleBulkDiscount = () => {
    const discount = Number.parseFloat(bulkDiscountPercent.replace(',', '.'));
    if (!Number.isFinite(discount) || discount <= 0 || discount >= 90) {
      toast.error('Inserisci una percentuale valida tra 0 e 90.');
      return;
    }

    if (filteredProducts.length === 0) {
      toast.error('Nessun prodotto nel filtro corrente.');
      return;
    }

    if (!window.confirm(`Applicare sconto ${discount}% a ${filteredProducts.length} prodotti filtrati?`)) {
      return;
    }

    filteredProducts.forEach((product) => {
      const currentNet = product.priceNet;
      const discounted = Math.max(0.01, Number((currentNet * (1 - discount / 100)).toFixed(2)));
      updateStoreProduct(product.slug, {
        originalPriceNet: currentNet,
        priceNet: discounted,
      });
    });

    appendAudit('bulk_discount', 'products', `Sconto ${discount}% su ${filteredProducts.length} prodotti`);
    toast.success(`Sconto applicato a ${filteredProducts.length} prodotti`);
  };

  const handleLoadArticle = (article: BlogArticle) => {
    setArticleForm({ ...article, scheduledAt: article.scheduledAt || '' });
  };

  const handleNewArticle = () => {
    setArticleForm({
      id: '',
      title: '',
      slug: '',
      category: "Guida all'acquisto",
      excerpt: '',
      content: '',
      author: user.name,
      image: '',
      readTime: 5,
      publishedAt: new Date().toISOString(),
      status: 'draft',
      scheduledAt: '',
      relatedCategories: [],
    });
  };

  const handleSaveArticle = () => {
    if (!articleForm.title.trim() || !articleForm.excerpt.trim() || !articleForm.content.trim()) {
      toast.error('Titolo, estratto e contenuto sono obbligatori.');
      return;
    }

    const slug = articleForm.slug.trim() || slugify(articleForm.title);
    const id = articleForm.id || `blog-${Date.now()}`;

    const nextArticle: BlogArticle = {
      ...articleForm,
      id,
      slug,
      publishedAt: articleForm.status === 'published'
        ? new Date().toISOString()
        : articleForm.publishedAt,
      scheduledAt: articleForm.status === 'scheduled' ? articleForm.scheduledAt : '',
    };

    upsertStoreBlogArticle(nextArticle);
    appendAudit('upsert_blog_article', nextArticle.slug, `Stato: ${nextArticle.status}`);
    toast.success('Articolo blog salvato');
    setArticleForm(nextArticle);
  };

  const handleDeleteArticle = (article: BlogArticle) => {
    if (!window.confirm(`Eliminare definitivamente l'articolo "${article.title}"?`)) {
      return;
    }
    deleteStoreBlogArticle(article.id);
    appendAudit('delete_blog_article', article.slug, 'Articolo eliminato');
    if (articleForm.id === article.id) handleNewArticle();
    toast.success('Articolo eliminato');
  };

  const handleSaveHomeContent = () => {
    saveHomeContentConfig(homeForm);
    appendAudit('update_home_content', 'home', 'Testi promozionali e hero aggiornati');
    toast.success('Contenuti Home aggiornati');
  };

  const orderStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment':
        return 'In attesa pagamento';
      case 'pending_bank_transfer':
        return 'In attesa bonifico';
      case 'processing':
        return 'In lavorazione';
      case 'paid':
        return 'Pagato';
      case 'cancelled':
        return 'Annullato';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="bg-[#1f2937] text-white px-6 py-4">
        <div className="max-w-[1520px] mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Pannello Amministrazione</h1>
            <p className="text-gray-300 text-xs">Controllo centralizzato catalogo, blog, ordini e contenuti storefront</p>
          </div>
          <span className="ml-auto text-xs text-gray-300">Admin: {user.email}</span>
        </div>
      </div>

      <div className="max-w-[1520px] mx-auto flex gap-6 px-4 py-6">
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="rounded-xl border border-gray-200 bg-white p-2 sticky top-6">
            {tabItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="lg:hidden mb-4 overflow-x-auto flex gap-2" style={{ scrollbarWidth: 'none' }}>
            {tabItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold ${
                  activeTab === item.id ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <section className="space-y-6">
              <div className="rounded-xl border border-green-200 bg-gradient-to-r from-white via-green-50 to-emerald-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Priorita operative</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-700">
                  <span className="inline-flex rounded-full bg-white px-3 py-1 font-semibold text-gray-800 ring-1 ring-gray-200">
                    Pagamenti in attesa: {metrics.pendingPayments}
                  </span>
                  <span className="inline-flex rounded-full bg-white px-3 py-1 font-semibold text-gray-800 ring-1 ring-gray-200">
                    Ordini in lavorazione: {metrics.processing}
                  </span>
                  <span className="inline-flex rounded-full bg-white px-3 py-1 font-semibold text-gray-800 ring-1 ring-gray-200">
                    Clienti attivi: {metrics.customers}
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-700">
                  Aggiorna prima ordini e pagamenti in sospeso, poi allinea catalogo e contenuti home.
                </p>
              </div>

              <h2 className="text-xl font-bold text-gray-900">Overview operativo</h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Prodotti gestiti</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.products}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Articoli pubblicati</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.publishedArticles}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Ordini registrati</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.orders}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Fatturato ordini</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(metrics.revenue)}</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-3">Checklist controllo qualità</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Prezzi e sconti aggiornati da fonte unica prodotto</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Blog pubblicato/schedulato con contenuti editabili</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Hero Home e testi promozionali gestibili da pannello</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Tracciamento modifiche con audit locale</li>
                </ul>
              </div>
            </section>
          )}

          {activeTab === 'products' && (
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-gray-900">Prodotti: prezzi, disponibilita e immagini</h2>
                <div className="flex items-center gap-2">
                  <input
                    value={bulkDiscountPercent}
                    onChange={(event) => setBulkDiscountPercent(event.target.value)}
                    placeholder="Sconto %"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={handleBulkDiscount}
                    className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
                  >
                    Applica sconto massivo
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr,240px]">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={productSearch}
                    onChange={(event) => setProductSearch(event.target.value)}
                    placeholder="Cerca nome, SKU o slug"
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-gray-300 text-sm"
                >
                  <option value="">Tutte le categorie finali</option>
                  {[...new Set(products.map((product) => product.categorySlug))].sort().map((slug) => (
                    <option key={slug} value={slug}>{slug}</option>
                  ))}
                </select>
              </div>

              <div className="overflow-auto border border-gray-200 rounded-xl bg-white">
                <table className="w-full min-w-[1100px] text-sm">
                  <thead>
                    <tr className="text-left bg-gray-50 border-b border-gray-200">
                      <th className="px-3 py-3">Prodotto</th>
                      <th className="px-3 py-3">Categoria finale</th>
                      <th className="px-3 py-3">Disponibilita</th>
                      <th className="px-3 py-3">Prezzo netto</th>
                      <th className="px-3 py-3">Prezzo barrato</th>
                      <th className="px-3 py-3">Immagine principale</th>
                      <th className="px-3 py-3">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const draft = getDraft(product);
                      return (
                        <tr key={product.id} className="border-b border-gray-100 align-top">
                          <td className="px-3 py-3">
                            <input
                              value={draft.name}
                              onChange={(event) => {
                                setProductDrafts((prev) => ({
                                  ...prev,
                                  [product.slug]: {
                                    ...prev[product.slug],
                                    name: event.target.value,
                                  },
                                }));
                              }}
                              className="w-full rounded-md border border-gray-300 px-2 py-1.5"
                            />
                            <p className="text-[11px] text-gray-500 mt-1">SKU: {product.sku}</p>
                          </td>
                          <td className="px-3 py-3 text-xs text-gray-600">{product.categorySlug}</td>
                          <td className="px-3 py-3">
                            <select
                              value={draft.availability}
                              onChange={(event) => {
                                setProductDrafts((prev) => ({
                                  ...prev,
                                  [product.slug]: {
                                    ...prev[product.slug],
                                    availability: event.target.value as Product['availability'],
                                  },
                                }));
                              }}
                              className="w-full rounded-md border border-gray-300 px-2 py-1.5"
                            >
                              {availabilityOptions.map((status) => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-3">
                            <input
                              type="number"
                              value={Number(draft.priceNet).toString()}
                              onChange={(event) => {
                                setProductDrafts((prev) => ({
                                  ...prev,
                                  [product.slug]: {
                                    ...prev[product.slug],
                                    priceNet: Number(event.target.value),
                                  },
                                }));
                              }}
                              className="w-full rounded-md border border-gray-300 px-2 py-1.5"
                            />
                          </td>
                          <td className="px-3 py-3">
                            <input
                              type="number"
                              value={draft.originalPriceNet || ''}
                              onChange={(event) => {
                                setProductDrafts((prev) => ({
                                  ...prev,
                                  [product.slug]: {
                                    ...prev[product.slug],
                                    originalPriceNet: event.target.value ? Number(event.target.value) : undefined,
                                  },
                                }));
                              }}
                              className="w-full rounded-md border border-gray-300 px-2 py-1.5"
                            />
                          </td>
                          <td className="px-3 py-3">
                            <input
                              value={draft.images?.[0] || ''}
                              onChange={(event) => {
                                setProductDrafts((prev) => ({
                                  ...prev,
                                  [product.slug]: {
                                    ...prev[product.slug],
                                    images: [event.target.value],
                                  },
                                }));
                              }}
                              className="w-full rounded-md border border-gray-300 px-2 py-1.5"
                            />
                          </td>
                          <td className="px-3 py-3">
                            <button
                              onClick={() => handleSaveProduct(product)}
                              className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-white text-xs font-semibold hover:bg-green-700"
                            >
                              <Save className="w-3.5 h-3.5" /> Salva
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'categories' && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Struttura categorie (3 livelli)</h2>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-sm text-gray-600 mb-4">
                  Questa sezione governa la tassonomia del catalogo. Ogni categoria principale contiene
                  sottocategorie di livello 1, che a loro volta contengono le categorie finali (foglie) dove si mostrano i prodotti.
                </p>

                <div className="space-y-4">
                  {catalogMenu.map((category) => (
                    <div key={category.key} className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <h3 className="font-semibold text-gray-900">{category.label}</h3>
                        <span className="text-xs text-gray-500">{category.groups.length} sottocategorie livello 1</span>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {category.groups.map((group) => (
                          <div key={group.slug} className="rounded-md border border-gray-100 bg-gray-50 p-3">
                            <p className="text-sm font-semibold text-gray-900">{group.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{group.sections.length} categorie finali</p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {group.sections.slice(0, 4).map((section) => (
                                <span key={section.slug} className="rounded-full bg-white px-2 py-0.5 text-[11px] text-gray-600 border border-gray-200">
                                  {section.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'blog' && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Gestione Blog</h2>
                <button
                  onClick={handleNewArticle}
                  className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4" /> Nuovo articolo
                </button>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1fr,1.1fr]">
                <div className="bg-white border border-gray-200 rounded-xl overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left bg-gray-50 border-b border-gray-200">
                        <th className="px-3 py-3">Titolo</th>
                        <th className="px-3 py-3">Stato</th>
                        <th className="px-3 py-3">Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogArticles.map((article) => (
                        <tr key={article.id} className="border-b border-gray-100">
                          <td className="px-3 py-3">
                            <p className="font-semibold text-gray-900">{article.title}</p>
                            <p className="text-xs text-gray-500">/{article.slug}</p>
                          </td>
                          <td className="px-3 py-3 text-xs text-gray-600">{article.status}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleLoadArticle(article)}
                                className="text-xs font-semibold text-blue-700 hover:text-blue-900"
                              >
                                Modifica
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(article)}
                                className="text-xs font-semibold text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Elimina
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900">Editor articolo</h3>
                  <input
                    value={articleForm.title}
                    onChange={(event) => {
                      const title = event.target.value;
                      setArticleForm((prev) => ({ ...prev, title, slug: prev.slug || slugify(title) }));
                    }}
                    placeholder="Titolo articolo"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <input
                    value={articleForm.slug}
                    onChange={(event) => setArticleForm((prev) => ({ ...prev, slug: slugify(event.target.value) }))}
                    placeholder="slug-articolo"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <input
                    value={articleForm.image}
                    onChange={(event) => setArticleForm((prev) => ({ ...prev, image: event.target.value }))}
                    placeholder="URL immagine copertina"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <textarea
                    value={articleForm.excerpt}
                    onChange={(event) => setArticleForm((prev) => ({ ...prev, excerpt: event.target.value }))}
                    placeholder="Estratto breve"
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                  <textarea
                    value={articleForm.content}
                    onChange={(event) => setArticleForm((prev) => ({ ...prev, content: event.target.value }))}
                    placeholder="Contenuto articolo"
                    rows={10}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <select
                      value={articleForm.category}
                      onChange={(event) => setArticleForm((prev) => ({ ...prev, category: event.target.value }))}
                      className="rounded-lg border border-gray-300 px-3 py-2"
                    >
                      <option value="Guida all'acquisto">Guida all'acquisto</option>
                      <option value="Guida operativa">Guida operativa</option>
                      <option value="Manutenzione">Manutenzione</option>
                    </select>

                    <select
                      value={articleForm.status}
                      onChange={(event) => setArticleForm((prev) => ({ ...prev, status: event.target.value as BlogArticle['status'] }))}
                      className="rounded-lg border border-gray-300 px-3 py-2"
                    >
                      <option value="draft">Bozza</option>
                      <option value="scheduled">Programmato</option>
                      <option value="published">Pubblicato</option>
                      <option value="archived">Archiviato</option>
                    </select>
                  </div>

                  {articleForm.status === 'scheduled' && (
                    <input
                      type="datetime-local"
                      value={articleForm.scheduledAt ? articleForm.scheduledAt.slice(0, 16) : ''}
                      onChange={(event) => setArticleForm((prev) => ({ ...prev, scheduledAt: event.target.value ? new Date(event.target.value).toISOString() : '' }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  )}

                  <button
                    onClick={handleSaveArticle}
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    <Save className="w-4 h-4" /> Salva articolo
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'home' && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Contenuti Home e barra promozionale</h2>
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                <input
                  value={homeForm.promoText}
                  onChange={(event) => setHomeForm((prev) => ({ ...prev, promoText: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Testo promozionale barra"
                />
                <input
                  value={homeForm.serviceText}
                  onChange={(event) => setHomeForm((prev) => ({ ...prev, serviceText: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Messaggio di servizio"
                />
                <input
                  value={homeForm.heroImage}
                  onChange={(event) => setHomeForm((prev) => ({ ...prev, heroImage: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="URL immagine hero"
                />
                <input
                  value={homeForm.heroTitle}
                  onChange={(event) => setHomeForm((prev) => ({ ...prev, heroTitle: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Titolo hero"
                />
                <textarea
                  value={homeForm.heroDescription}
                  onChange={(event) => setHomeForm((prev) => ({ ...prev, heroDescription: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  rows={4}
                  placeholder="Descrizione hero"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={homeForm.heroCtaLabel}
                    onChange={(event) => setHomeForm((prev) => ({ ...prev, heroCtaLabel: event.target.value }))}
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="Testo pulsante"
                  />
                  <input
                    value={homeForm.heroCtaPath}
                    onChange={(event) => setHomeForm((prev) => ({ ...prev, heroCtaPath: event.target.value }))}
                    className="rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="/categoria/linea-caldo"
                  />
                </div>
                <button
                  onClick={handleSaveHomeContent}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                >
                  <Save className="w-4 h-4" /> Salva contenuti Home
                </button>
              </div>
            </section>
          )}

          {activeTab === 'orders' && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Ordini e stati</h2>
              <div className="bg-white border border-gray-200 rounded-xl overflow-auto">
                <table className="w-full min-w-[980px] text-sm">
                  <thead>
                    <tr className="text-left bg-gray-50 border-b border-gray-200">
                      <th className="px-3 py-3">Ordine</th>
                      <th className="px-3 py-3">Cliente</th>
                      <th className="px-3 py-3">Pagamento</th>
                      <th className="px-3 py-3">Totale</th>
                      <th className="px-3 py-3">Stato</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100">
                        <td className="px-3 py-3">
                          <p className="font-semibold text-gray-900">{order.id}</p>
                          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString('it-IT')}</p>
                        </td>
                        <td className="px-3 py-3">
                          <p className="font-medium text-gray-900">{order.customer.name}</p>
                          <p className="text-xs text-gray-500">{order.customer.email}</p>
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-600">{order.paymentMethod === 'card' ? 'Carta (Stripe)' : 'Bonifico'}</td>
                        <td className="px-3 py-3 font-semibold text-gray-900">{formatCurrency(order.total)}</td>
                        <td className="px-3 py-3">
                          <select
                            value={order.status}
                            onChange={(event) => {
                              const nextStatus = event.target.value as OrderStatus;
                              updateOrderStatus(order.id, nextStatus);
                              appendAudit('update_order_status', order.id, `Nuovo stato: ${nextStatus}`);
                              toast.success(`Ordine ${order.id} aggiornato`);
                            }}
                            className="rounded-md border border-gray-300 px-2 py-1.5"
                          >
                            {orderStatusOptions.map((status) => (
                              <option key={status} value={status}>{orderStatusLabel(status)}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'customers' && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Clienti e account B2B</h2>
              <div className="bg-white border border-gray-200 rounded-xl overflow-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="text-left bg-gray-50 border-b border-gray-200">
                      <th className="px-3 py-3">Cliente</th>
                      <th className="px-3 py-3">Email</th>
                      <th className="px-3 py-3">Ordini</th>
                      <th className="px-3 py-3">Totale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.email} className="border-b border-gray-100">
                        <td className="px-3 py-3 font-medium text-gray-900">{customer.name}</td>
                        <td className="px-3 py-3 text-gray-600">{customer.email}</td>
                        <td className="px-3 py-3 text-gray-700">{customer.orders}</td>
                        <td className="px-3 py-3 font-semibold text-gray-900">{formatCurrency(customer.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'payments' && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Pagamenti e controllo coerenza</h2>
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${isStripeConfigured() ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {isStripeConfigured() ? 'Stripe configurato' : 'Stripe non configurato'}
                  </span>
                  <span className="text-xs text-gray-500">Publishable key: {getStripePublishableKey().slice(0, 16)}...</span>
                </div>
                <p className="text-sm text-gray-700">
                  La configurazione della chiave Stripe resta confinata nell&apos;area account (Gestione Pagamenti)
                  come richiesto. Qui in admin viene mostrato solo lo stato operativo.
                </p>
                <p className="text-sm text-gray-700">
                  Tutti i prezzi esposti su lista prodotti, pagina prodotto, carrello e checkout derivano
                  dalla stessa sorgente dati prodotto e vengono aggiornati centralmente.
                </p>
              </div>
            </section>
          )}

          {activeTab === 'audit' && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Audit modifiche</h2>
                <button
                  onClick={() => {
                    if (!window.confirm('Vuoi svuotare il registro audit?')) return;
                    setAuditItems([]);
                    saveAudit([]);
                    toast.success('Registro audit svuotato');
                  }}
                  className="text-xs font-semibold text-red-600 hover:text-red-800"
                >
                  Svuota registro
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-auto max-h-[70vh]">
                <table className="w-full text-sm min-w-[900px]">
                  <thead>
                    <tr className="text-left bg-gray-50 border-b border-gray-200">
                      <th className="px-3 py-3">Quando</th>
                      <th className="px-3 py-3">Operatore</th>
                      <th className="px-3 py-3">Azione</th>
                      <th className="px-3 py-3">Target</th>
                      <th className="px-3 py-3">Dettaglio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="px-3 py-3 text-xs text-gray-600">{new Date(item.at).toLocaleString('it-IT')}</td>
                        <td className="px-3 py-3 text-xs text-gray-600">{item.actor}</td>
                        <td className="px-3 py-3 font-medium text-gray-800">{item.action}</td>
                        <td className="px-3 py-3 text-gray-700">{item.target}</td>
                        <td className="px-3 py-3 text-xs text-gray-600">{item.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="max-w-[1520px] mx-auto px-4 pb-6 text-xs text-gray-500 inline-flex items-center gap-1">
        <ArrowUpRight className="w-3.5 h-3.5" />
        Workflow sicuro: modifica -&gt; conferma -&gt; audit -&gt; propagazione storefront.
      </div>
    </div>
  );
}
