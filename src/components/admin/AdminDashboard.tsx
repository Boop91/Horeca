import { useState } from 'react';
import {
  Shield, LayoutDashboard, Package, ShoppingCart, Users, FileText,
  Star, Settings, Search, Plus, Eye, Pencil, Trash2, Check, X,
  ChevronRight, TrendingUp, UserPlus, BarChart3, Wrench, Lock,
  CreditCard, Save, CheckCircle, AlertTriangle, Clock, Euro,
  Truck, FileBarChart, Tag, Mail, Phone, MapPin, Calendar,
  ArrowUpRight, ArrowDownRight, RefreshCw, Download, Filter,
  MessageSquare, Bell, Globe, Percent, CircleDollarSign,
  ClipboardList, BadgeCheck, PackageSearch, Receipt,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getStripePublishableKey, persistStripePublishableKey, isStripeConfigured } from '../../config/stripe';

/* ═══════════════════════════════════════════════════════════════
 * TIPI
 * ═══════════════════════════════════════════════════════════════ */

type AdminTab =
  | 'dashboard'
  | 'ordini'
  | 'catalogo'
  | 'clienti'
  | 'preventivi'
  | 'finanza'
  | 'marketing'
  | 'spedizioni'
  | 'contenuti'
  | 'impostazioni';

interface OrderStatus {
  key: string;
  label: string;
  color: string;
  bg: string;
}

const ORDER_STATUSES: Record<string, OrderStatus> = {
  nuovo: { key: 'nuovo', label: 'Nuovo', color: 'text-blue-800', bg: 'bg-blue-100' },
  confermato: { key: 'confermato', label: 'Confermato', color: 'text-green-800', bg: 'bg-green-100' },
  in_lavorazione: { key: 'in_lavorazione', label: 'In lavorazione', color: 'text-amber-800', bg: 'bg-amber-100' },
  spedito: { key: 'spedito', label: 'Spedito', color: 'text-purple-800', bg: 'bg-purple-100' },
  consegnato: { key: 'consegnato', label: 'Consegnato', color: 'text-green-800', bg: 'bg-green-100' },
  annullato: { key: 'annullato', label: 'Annullato', color: 'text-red-800', bg: 'bg-red-100' },
};

/* ═══════════════════════════════════════════════════════════════
 * DATI MOCK REALISTICI — SETTORE HORECA
 * ═══════════════════════════════════════════════════════════════ */

const MOCK_ORDERS = [
  { id: 'ORD-2026-0201', data: '16/02/2026', cliente: 'Ristorante Da Mario', email: 'mario@ristdamario.it', piva: 'IT01234567890', totale: 6140.00, stato: 'nuovo', prodotti: 3, metodo: 'Bonifico 30gg', zona: 'Lombardia' },
  { id: 'ORD-2026-0200', data: '15/02/2026', cliente: 'Hotel Belvedere', email: 'acquisti@belvedere.com', piva: 'IT09876543210', totale: 12480.00, stato: 'confermato', prodotti: 7, metodo: 'Carta credito', zona: 'Toscana' },
  { id: 'ORD-2026-0199', data: '15/02/2026', cliente: 'Pizzeria Napoli', email: 'info@pizzerianapoli.it', piva: 'IT11223344556', totale: 3250.00, stato: 'spedito', prodotti: 1, metodo: 'Bonifico anticipato', zona: 'Campania' },
  { id: 'ORD-2026-0198', data: '14/02/2026', cliente: 'Catering Rossi S.r.l.', email: 'ordini@cateringrossi.it', piva: 'IT66778899001', totale: 8920.00, stato: 'consegnato', prodotti: 5, metodo: 'Bonifico 60gg', zona: 'Emilia-Romagna' },
  { id: 'ORD-2026-0197', data: '14/02/2026', cliente: 'Bar Centrale', email: 'barcentrale@pec.it', piva: 'IT33445566778', totale: 1540.00, stato: 'annullato', prodotti: 2, metodo: 'Carta credito', zona: 'Veneto' },
  { id: 'ORD-2026-0196', data: '13/02/2026', cliente: 'Trattoria Il Borgo', email: 'info@ilborgo.it', piva: 'IT55667788990', totale: 4380.00, stato: 'in_lavorazione', prodotti: 3, metodo: 'Bonifico 30gg', zona: 'Piemonte' },
  { id: 'ORD-2026-0195', data: '13/02/2026', cliente: 'Mensa Aziendale Alfa', email: 'logistica@alfa.com', piva: 'IT99001122334', totale: 15200.00, stato: 'consegnato', prodotti: 12, metodo: 'Bonifico 90gg', zona: 'Lombardia' },
  { id: 'ORD-2026-0194', data: '12/02/2026', cliente: 'Pasticceria Dolce Vita', email: 'acquisti@dolcevita.it', piva: 'IT44556677889', totale: 5670.00, stato: 'confermato', prodotti: 4, metodo: 'Carta credito', zona: 'Lazio' },
];

const MOCK_CLIENTS = [
  { id: 'CLI-001', nome: 'Ristorante Da Mario', referente: 'Mario Bianchi', email: 'mario@ristdamario.it', piva: 'IT01234567890', telefono: '+39 02 1234567', citta: 'Milano', tipo: 'Ristorante', ordini: 15, fatturato: 45230, ultimoOrdine: '16/02/2026', stato: 'attivo', credito: 10000, creditoUsato: 6140 },
  { id: 'CLI-002', nome: 'Hotel Belvedere', referente: 'Giulia Verdi', email: 'acquisti@belvedere.com', piva: 'IT09876543210', telefono: '+39 055 9876543', citta: 'Firenze', tipo: 'Hotel', ordini: 32, fatturato: 128400, ultimoOrdine: '15/02/2026', stato: 'attivo', credito: 30000, creditoUsato: 12480 },
  { id: 'CLI-003', nome: 'Pizzeria Napoli', referente: 'Luca Ferrari', email: 'info@pizzerianapoli.it', piva: 'IT11223344556', telefono: '+39 081 1122334', citta: 'Napoli', tipo: 'Pizzeria', ordini: 8, fatturato: 18750, ultimoOrdine: '15/02/2026', stato: 'attivo', credito: 5000, creditoUsato: 3250 },
  { id: 'CLI-004', nome: 'Catering Rossi S.r.l.', referente: 'Anna Colombo', email: 'ordini@cateringrossi.it', piva: 'IT66778899001', telefono: '+39 051 6677889', citta: 'Bologna', tipo: 'Catering', ordini: 22, fatturato: 89600, ultimoOrdine: '14/02/2026', stato: 'attivo', credito: 20000, creditoUsato: 8920 },
  { id: 'CLI-005', nome: 'Bar Centrale', referente: 'Roberto Esposito', email: 'barcentrale@pec.it', piva: 'IT33445566778', telefono: '+39 041 3344556', citta: 'Venezia', tipo: 'Bar/Caffe', ordini: 4, fatturato: 6200, ultimoOrdine: '14/02/2026', stato: 'inattivo', credito: 3000, creditoUsato: 0 },
  { id: 'CLI-006', nome: 'Mensa Aziendale Alfa', referente: 'Paolo Ricci', email: 'logistica@alfa.com', piva: 'IT99001122334', telefono: '+39 02 9900112', citta: 'Milano', tipo: 'Mensa aziendale', ordini: 18, fatturato: 152000, ultimoOrdine: '13/02/2026', stato: 'attivo', credito: 50000, creditoUsato: 15200 },
];

const MOCK_QUOTES = [
  { id: 'PRV-001', data: '16/02/2026', cliente: 'Hotel Belvedere', totale: 24500, prodotti: 8, stato: 'in_attesa', scadenza: '02/03/2026' },
  { id: 'PRV-002', data: '14/02/2026', cliente: 'Mensa Aziendale Alfa', totale: 18900, prodotti: 15, stato: 'approvato', scadenza: '28/02/2026' },
  { id: 'PRV-003', data: '12/02/2026', cliente: 'Pasticceria Dolce Vita', totale: 7800, prodotti: 3, stato: 'scaduto', scadenza: '12/02/2026' },
  { id: 'PRV-004', data: '10/02/2026', cliente: 'Ristorante Da Mario', totale: 3200, prodotti: 2, stato: 'convertito', scadenza: '24/02/2026' },
];

const MOCK_INVOICES = [
  { id: 'FT-2026-0045', data: '16/02/2026', cliente: 'Catering Rossi S.r.l.', totale: 8920, iva: 1962.40, stato: 'pagata', scadenza: '16/04/2026', metodo: 'Bonifico 60gg' },
  { id: 'FT-2026-0044', data: '15/02/2026', cliente: 'Hotel Belvedere', totale: 12480, iva: 2745.60, stato: 'emessa', scadenza: '17/03/2026', metodo: 'Carta credito' },
  { id: 'FT-2026-0043', data: '13/02/2026', cliente: 'Mensa Aziendale Alfa', totale: 15200, iva: 3344.00, stato: 'scaduta', scadenza: '13/02/2026', metodo: 'Bonifico 90gg' },
  { id: 'FT-2026-0042', data: '10/02/2026', cliente: 'Ristorante Da Mario', totale: 6140, iva: 1350.80, stato: 'pagata', scadenza: '12/03/2026', metodo: 'Bonifico 30gg' },
];

const MOCK_STOCK_ALERTS = [
  { sku: 'AB5514', nome: 'Abbattitore Forcar AB5514', giacenza: 1, minimo: 3 },
  { sku: 'FP-ELEC', nome: 'Forno Pizzeria Fimar FP', giacenza: 0, minimo: 2 },
  { sku: 'FY8L', nome: 'Friggitrice Fimar FY8L', giacenza: 2, minimo: 5 },
];

const MOCK_PROMOS = [
  { id: 'PRM-001', nome: 'Sconto Linea Freddo -15%', tipo: 'Percentuale', valore: '15%', attiva: true, scadenza: '28/02/2026', utilizzi: 12 },
  { id: 'PRM-002', nome: 'Spedizione gratis > 2000', tipo: 'Spedizione', valore: 'Free shipping', attiva: true, scadenza: '31/03/2026', utilizzi: 34 },
  { id: 'PRM-003', nome: 'BENVENUTO10 - Primo ordine', tipo: 'Coupon', valore: '10%', attiva: true, scadenza: '31/12/2026', utilizzi: 8 },
  { id: 'PRM-004', nome: 'Bundle Pizzeria completo', tipo: 'Bundle', valore: '-350 EUR', attiva: false, scadenza: '01/02/2026', utilizzi: 5 },
];

const MOCK_SHIPMENTS = [
  { id: 'SPD-001', ordine: 'ORD-2026-0199', corriere: 'BRT', tracking: 'BRT-2026-123456', stato: 'in_transito', partenza: '15/02/2026', consegna: '18/02/2026', destinazione: 'Napoli' },
  { id: 'SPD-002', ordine: 'ORD-2026-0198', corriere: 'GLS', tracking: 'GLS-2026-789012', stato: 'consegnato', partenza: '13/02/2026', consegna: '14/02/2026', destinazione: 'Bologna' },
  { id: 'SPD-003', ordine: 'ORD-2026-0195', corriere: 'DHL Freight', tracking: 'DHL-2026-345678', stato: 'consegnato', partenza: '12/02/2026', consegna: '13/02/2026', destinazione: 'Milano' },
];

/* ═══════════════════════════════════════════════════════════════
 * SIDEBAR CONFIG
 * ═══════════════════════════════════════════════════════════════ */

const SIDEBAR_ITEMS: { id: AdminTab; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'ordini', label: 'Ordini', icon: ShoppingCart, badge: MOCK_ORDERS.filter(o => o.stato === 'nuovo').length },
  { id: 'catalogo', label: 'Catalogo', icon: Package },
  { id: 'clienti', label: 'Clienti / CRM', icon: Users },
  { id: 'preventivi', label: 'Preventivi', icon: ClipboardList, badge: MOCK_QUOTES.filter(q => q.stato === 'in_attesa').length },
  { id: 'finanza', label: 'Finanza', icon: CircleDollarSign },
  { id: 'marketing', label: 'Marketing', icon: Tag },
  { id: 'spedizioni', label: 'Spedizioni', icon: Truck },
  { id: 'contenuti', label: 'Contenuti', icon: FileText },
  { id: 'impostazioni', label: 'Impostazioni', icon: Settings },
];

/* ═══════════════════════════════════════════════════════════════
 * HELPERS
 * ═══════════════════════════════════════════════════════════════ */

function KpiCard({ label, value, icon: Icon, trend, trendUp, color }: {
  label: string; value: string; icon: typeof Euro; trend?: string; trendUp?: boolean; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-green-700' : 'text-red-500'}`}>
            {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function StatBadge({ text, variant }: { text: string; variant: 'green' | 'red' | 'amber' | 'blue' | 'gray' }) {
  const colors = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    amber: 'bg-amber-100 text-amber-800',
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-600',
  };
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${colors[variant]}`}>{text}</span>;
}

/* ═══════════════════════════════════════════════════════════════
 * COMPONENTE PRINCIPALE
 * ═══════════════════════════════════════════════════════════════ */

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [clientSearch, setClientSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  /* Stripe settings */
  const [stripeKey, setStripeKey] = useState(() => {
    const current = getStripePublishableKey();
    return current.includes('INSERISCI') ? '' : current;
  });
  const [stripeSaved, setStripeSaved] = useState(false);

  /* Gmail settings */
  const [gmailUser, setGmailUser] = useState('');
  const [gmailSaved, setGmailSaved] = useState(false);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Accesso negato</h2>
        <p className="text-gray-600 mb-6">Solo gli amministratori possono accedere a questa sezione.</p>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">
          Torna alla home
        </button>
      </div>
    );
  }

  const filteredOrders = MOCK_ORDERS.filter(o =>
    !orderFilter || o.stato === orderFilter
  );

  const filteredClients = MOCK_CLIENTS.filter(c =>
    !clientSearch ||
    c.nome.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.piva.includes(clientSearch)
  );

  /* Calcoli KPI */
  const fatturatoMese = MOCK_ORDERS.reduce((s, o) => s + o.totale, 0);
  const ordiniNuovi = MOCK_ORDERS.filter(o => o.stato === 'nuovo').length;
  const aov = fatturatoMese / MOCK_ORDERS.length;
  const creditiInSospeso = MOCK_INVOICES.filter(f => f.stato !== 'pagata').reduce((s, f) => s + f.totale, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top header ── */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Pannello Amministratore</h1>
            <p className="text-gray-400 text-xs">BianchiPro — Gestione completa e-commerce Horeca</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">3</span>
            </button>
            <div className="text-right">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto flex">
        {/* ── Sidebar ── */}
        <aside className="w-56 shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-72px)] py-4 px-3 hidden md:block">
          <nav className="space-y-1">
            {SIDEBAR_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                  activeTab === item.id ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Mobile tabs ── */}
        <div className="md:hidden w-full overflow-x-auto border-b border-gray-200 bg-white px-3 py-2 flex gap-2">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === item.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════
         * MAIN CONTENT
         * ══════════════════════════════════════════════════ */}
        <main className="flex-1 p-6 overflow-auto">

          {/* ═══ DASHBOARD ═══ */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
                <span className="text-xs text-gray-500">Aggiornamento: {new Date().toLocaleDateString('it-IT')}</span>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <KpiCard label="Fatturato mese" value={`\u20AC${(fatturatoMese).toLocaleString('it-IT')}`} icon={Euro} trend="+12.3%" trendUp color="bg-green-50 text-green-700" />
                <KpiCard label="Ordini totali" value={MOCK_ORDERS.length.toString()} icon={ShoppingCart} trend="+8%" trendUp color="bg-blue-50 text-blue-700" />
                <KpiCard label="Valore medio ordine" value={`\u20AC${Math.round(aov).toLocaleString('it-IT')}`} icon={BarChart3} trend="+5.2%" trendUp color="bg-purple-50 text-purple-700" />
                <KpiCard label="Ordini da evadere" value={ordiniNuovi.toString()} icon={Clock} color="bg-amber-50 text-amber-700" />
                <KpiCard label="Crediti in sospeso" value={`\u20AC${creditiInSospeso.toLocaleString('it-IT')}`} icon={AlertTriangle} trend="2 scadute" color="bg-red-50 text-red-700" />
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Ordini recenti */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Ordini recenti</h3>
                    <button onClick={() => setActiveTab('ordini')} className="text-xs font-semibold text-green-700 hover:text-green-700 flex items-center gap-1">
                      Vedi tutti <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 text-left">
                          <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
                          <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                          <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Totale</th>
                          <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Stato</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_ORDERS.slice(0, 5).map(o => {
                          const status = ORDER_STATUSES[o.stato];
                          return (
                            <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                              <td className="px-5 py-3 font-mono text-xs font-semibold text-gray-700">{o.id}</td>
                              <td className="px-5 py-3 font-medium text-gray-900">{o.cliente}</td>
                              <td className="px-5 py-3 font-semibold text-gray-900">{'\u20AC'}{o.totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</td>
                              <td className="px-5 py-3"><span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${status.bg} ${status.color}`}>{status.label}</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Alerts sidebar */}
                <div className="space-y-4">
                  {/* Stock alerts */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> Scorte basse
                    </h4>
                    <div className="space-y-2">
                      {MOCK_STOCK_ALERTS.map(s => (
                        <div key={s.sku} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                          <div>
                            <p className="text-xs font-semibold text-gray-900 truncate max-w-[160px]">{s.nome}</p>
                            <p className="text-[10px] text-gray-500">SKU: {s.sku}</p>
                          </div>
                          <StatBadge text={s.giacenza === 0 ? 'Esaurito' : `${s.giacenza} pz`} variant={s.giacenza === 0 ? 'red' : 'amber'} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preventivi in attesa */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-blue-500" /> Preventivi in attesa
                    </h4>
                    {MOCK_QUOTES.filter(q => q.stato === 'in_attesa').map(q => (
                      <div key={q.id} className="flex items-center justify-between py-1.5">
                        <div>
                          <p className="text-xs font-semibold text-gray-900">{q.cliente}</p>
                          <p className="text-[10px] text-gray-500">{q.id} — Scade: {q.scadenza}</p>
                        </div>
                        <span className="text-xs font-bold text-gray-900">{'\u20AC'}{q.totale.toLocaleString('it-IT')}</span>
                      </div>
                    ))}
                  </div>

                  {/* Fatture scadute */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-red-500" /> Fatture scadute
                    </h4>
                    {MOCK_INVOICES.filter(f => f.stato === 'scaduta').map(f => (
                      <div key={f.id} className="flex items-center justify-between py-1.5">
                        <div>
                          <p className="text-xs font-semibold text-gray-900">{f.cliente}</p>
                          <p className="text-[10px] text-gray-500">{f.id} — Scaduta: {f.scadenza}</p>
                        </div>
                        <span className="text-xs font-bold text-red-600">{'\u20AC'}{f.totale.toLocaleString('it-IT')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ ORDINI ═══ */}
          {activeTab === 'ordini' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-xl font-bold text-gray-900">Gestione Ordini</h2>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                    <Plus className="w-4 h-4" /> Ordine manuale
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" /> Esporta CSV
                  </button>
                </div>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => setOrderFilter('')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${!orderFilter ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  Tutti ({MOCK_ORDERS.length})
                </button>
                {Object.values(ORDER_STATUSES).map(s => {
                  const count = MOCK_ORDERS.filter(o => o.stato === s.key).length;
                  return (
                    <button key={s.key} onClick={() => setOrderFilter(s.key)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${orderFilter === s.key ? 'bg-gray-900 text-white' : `${s.bg} ${s.color} hover:opacity-80`}`}>
                      {s.label} ({count})
                    </button>
                  );
                })}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left bg-gray-50">
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ordine</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Data</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Prodotti</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Totale</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Pagamento</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stato</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(o => {
                        const status = ORDER_STATUSES[o.stato];
                        return (
                          <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">{o.id}</td>
                            <td className="px-4 py-3 text-gray-600 text-xs">{o.data}</td>
                            <td className="px-4 py-3">
                              <p className="font-medium text-gray-900 text-xs">{o.cliente}</p>
                              <p className="text-[10px] text-gray-500">{o.zona}</p>
                            </td>
                            <td className="px-4 py-3 text-center text-gray-700">{o.prodotti}</td>
                            <td className="px-4 py-3 font-bold text-gray-900">{'\u20AC'}{o.totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</td>
                            <td className="px-4 py-3 text-xs text-gray-600">{o.metodo}</td>
                            <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${status.bg} ${status.color}`}>{status.label}</span></td>
                            <td className="px-4 py-3">
                              <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Dettagli">
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══ CATALOGO ═══ */}
          {activeTab === 'catalogo' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Catalogo Prodotti</h2>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                    <Plus className="w-4 h-4" /> Nuovo prodotto
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-semibold rounded-lg hover:bg-gray-50">
                    <Download className="w-4 h-4" /> Importa CSV
                  </button>
                </div>
              </div>

              {/* Alerts stock */}
              {MOCK_STOCK_ALERTS.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-amber-900">{MOCK_STOCK_ALERTS.length} prodotti sotto la soglia minima</p>
                    <p className="text-xs text-amber-700 mt-1">
                      {MOCK_STOCK_ALERTS.map(s => s.nome).join(', ')}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
                <PackageSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-1">Gestione catalogo avanzata</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Attributi tecnici (voltaggio, certificazioni CE, HACCP), listini personalizzati per cliente,
                  sconti volume, ricambi collegati, schede tecniche PDF, immagini multiple.
                </p>
                <p className="mt-3 text-xs text-gray-400">Collega Supabase per gestire il catalogo reale</p>
              </div>
            </div>
          )}

          {/* ═══ CLIENTI / CRM ═══ */}
          {activeTab === 'clienti' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-xl font-bold text-gray-900">Clienti / CRM</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                  <Plus className="w-4 h-4" /> Nuovo cliente
                </button>
              </div>

              {/* KPI clienti */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <KpiCard label="Clienti attivi" value={MOCK_CLIENTS.filter(c => c.stato === 'attivo').length.toString()} icon={Users} color="bg-green-50 text-green-700" />
                <KpiCard label="Fatturato totale clienti" value={`\u20AC${MOCK_CLIENTS.reduce((s, c) => s + c.fatturato, 0).toLocaleString('it-IT')}`} icon={Euro} color="bg-blue-50 text-blue-700" />
                <KpiCard label="Credito totale concesso" value={`\u20AC${MOCK_CLIENTS.reduce((s, c) => s + c.credito, 0).toLocaleString('it-IT')}`} icon={CreditCard} color="bg-purple-50 text-purple-700" />
                <KpiCard label="Clienti inattivi" value={MOCK_CLIENTS.filter(c => c.stato === 'inattivo').length.toString()} icon={AlertTriangle} color="bg-red-50 text-red-700" />
              </div>

              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text" value={clientSearch} onChange={e => setClientSearch(e.target.value)}
                  placeholder="Cerca per nome, email, P.IVA..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200 bg-white"
                />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left bg-gray-50">
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Azienda</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Citta</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ordini</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Fatturato</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Credito</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stato</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ultimo ordine</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map(c => (
                        <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">{c.nome}</p>
                            <p className="text-[10px] text-gray-500">{c.referente} — {c.piva}</p>
                          </td>
                          <td className="px-4 py-3"><StatBadge text={c.tipo} variant="blue" /></td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{c.citta}</td>
                          <td className="px-4 py-3 text-center font-semibold text-gray-900">{c.ordini}</td>
                          <td className="px-4 py-3 font-semibold text-gray-900">{'\u20AC'}{c.fatturato.toLocaleString('it-IT')}</td>
                          <td className="px-4 py-3">
                            <div className="text-xs">
                              <span className="font-semibold text-gray-900">{'\u20AC'}{c.creditoUsato.toLocaleString('it-IT')}</span>
                              <span className="text-gray-400"> / {'\u20AC'}{c.credito.toLocaleString('it-IT')}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3"><StatBadge text={c.stato === 'attivo' ? 'Attivo' : 'Inattivo'} variant={c.stato === 'attivo' ? 'green' : 'red'} /></td>
                          <td className="px-4 py-3 text-xs text-gray-600">{c.ultimoOrdine}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══ PREVENTIVI ═══ */}
          {activeTab === 'preventivi' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Preventivi / RFQ</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                  <Plus className="w-4 h-4" /> Nuovo preventivo
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left bg-gray-50">
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Data</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Prodotti</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Totale</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Scadenza</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Stato</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_QUOTES.map(q => (
                        <tr key={q.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-5 py-3 font-mono text-xs font-semibold text-gray-700">{q.id}</td>
                          <td className="px-5 py-3 text-gray-600 text-xs">{q.data}</td>
                          <td className="px-5 py-3 font-medium text-gray-900">{q.cliente}</td>
                          <td className="px-5 py-3 text-center text-gray-700">{q.prodotti}</td>
                          <td className="px-5 py-3 font-bold text-gray-900">{'\u20AC'}{q.totale.toLocaleString('it-IT')}</td>
                          <td className="px-5 py-3 text-xs text-gray-600">{q.scadenza}</td>
                          <td className="px-5 py-3">
                            <StatBadge
                              text={q.stato === 'in_attesa' ? 'In attesa' : q.stato === 'approvato' ? 'Approvato' : q.stato === 'convertito' ? 'Convertito' : 'Scaduto'}
                              variant={q.stato === 'in_attesa' ? 'amber' : q.stato === 'approvato' ? 'green' : q.stato === 'convertito' ? 'blue' : 'red'}
                            />
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1">
                              {q.stato === 'in_attesa' && (
                                <button className="p-1.5 text-green-700 hover:bg-green-50 rounded-lg text-xs font-semibold" title="Approva">
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              {(q.stato === 'approvato' || q.stato === 'in_attesa') && (
                                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Converti in ordine">
                                  <ShoppingCart className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══ FINANZA ═══ */}
          {activeTab === 'finanza' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Finanza e Fatturazione</h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <KpiCard label="Fatture emesse" value={MOCK_INVOICES.length.toString()} icon={Receipt} color="bg-blue-50 text-blue-700" />
                <KpiCard label="Totale fatturato" value={`\u20AC${MOCK_INVOICES.reduce((s, f) => s + f.totale, 0).toLocaleString('it-IT')}`} icon={Euro} color="bg-green-50 text-green-700" />
                <KpiCard label="Da incassare" value={`\u20AC${MOCK_INVOICES.filter(f => f.stato !== 'pagata').reduce((s, f) => s + f.totale, 0).toLocaleString('it-IT')}`} icon={Clock} color="bg-amber-50 text-amber-700" />
                <KpiCard label="Fatture scadute" value={MOCK_INVOICES.filter(f => f.stato === 'scaduta').length.toString()} icon={AlertTriangle} color="bg-red-50 text-red-700" />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Registro fatture</h3>
                  <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-xs font-semibold rounded-lg hover:bg-gray-50">
                    <Download className="w-3.5 h-3.5" /> Esporta
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left bg-gray-50">
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Fattura</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Data</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Imponibile</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">IVA</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Scadenza</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Stato</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_INVOICES.map(f => (
                        <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-5 py-3 font-mono text-xs font-semibold text-gray-700">{f.id}</td>
                          <td className="px-5 py-3 text-gray-600 text-xs">{f.data}</td>
                          <td className="px-5 py-3 font-medium text-gray-900">{f.cliente}</td>
                          <td className="px-5 py-3 font-semibold text-gray-900">{'\u20AC'}{f.totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</td>
                          <td className="px-5 py-3 text-gray-600">{'\u20AC'}{f.iva.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</td>
                          <td className="px-5 py-3 text-xs text-gray-600">{f.scadenza}</td>
                          <td className="px-5 py-3">
                            <StatBadge text={f.stato === 'pagata' ? 'Pagata' : f.stato === 'emessa' ? 'Emessa' : 'Scaduta'} variant={f.stato === 'pagata' ? 'green' : f.stato === 'emessa' ? 'blue' : 'red'} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══ MARKETING ═══ */}
          {activeTab === 'marketing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Marketing e Promozioni</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                  <Plus className="w-4 h-4" /> Nuova promozione
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <KpiCard label="Promozioni attive" value={MOCK_PROMOS.filter(p => p.attiva).length.toString()} icon={Tag} color="bg-green-50 text-green-700" />
                <KpiCard label="Coupon utilizzati" value={MOCK_PROMOS.reduce((s, p) => s + p.utilizzi, 0).toString()} icon={Percent} color="bg-blue-50 text-blue-700" />
                <KpiCard label="Tasso conversione" value="3.2%" icon={TrendingUp} trend="+0.4%" trendUp color="bg-purple-50 text-purple-700" />
                <KpiCard label="Carrelli abbandonati" value="18" icon={ShoppingCart} color="bg-amber-50 text-amber-700" />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left bg-gray-50">
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Promozione</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Valore</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Utilizzi</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Scadenza</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Stato</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_PROMOS.map(p => (
                        <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-5 py-3 font-medium text-gray-900">{p.nome}</td>
                          <td className="px-5 py-3"><StatBadge text={p.tipo} variant="blue" /></td>
                          <td className="px-5 py-3 font-semibold text-gray-900">{p.valore}</td>
                          <td className="px-5 py-3 text-center text-gray-700">{p.utilizzi}</td>
                          <td className="px-5 py-3 text-xs text-gray-600">{p.scadenza}</td>
                          <td className="px-5 py-3"><StatBadge text={p.attiva ? 'Attiva' : 'Scaduta'} variant={p.attiva ? 'green' : 'gray'} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══ SPEDIZIONI ═══ */}
          {activeTab === 'spedizioni' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Spedizioni e Logistica</h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <KpiCard label="In transito" value={MOCK_SHIPMENTS.filter(s => s.stato === 'in_transito').length.toString()} icon={Truck} color="bg-blue-50 text-blue-700" />
                <KpiCard label="Consegnate (mese)" value={MOCK_SHIPMENTS.filter(s => s.stato === 'consegnato').length.toString()} icon={CheckCircle} color="bg-green-50 text-green-700" />
                <KpiCard label="Corrieri attivi" value="3" icon={Globe} color="bg-purple-50 text-purple-700" />
                <KpiCard label="Tempo medio consegna" value="2.1 gg" icon={Clock} color="bg-amber-50 text-amber-700" />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left bg-gray-50">
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Spedizione</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Ordine</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Corriere</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Tracking</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Destinazione</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Partenza</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Consegna</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Stato</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_SHIPMENTS.map(s => (
                        <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-5 py-3 font-mono text-xs font-semibold text-gray-700">{s.id}</td>
                          <td className="px-5 py-3 font-mono text-xs text-gray-600">{s.ordine}</td>
                          <td className="px-5 py-3 font-medium text-gray-900">{s.corriere}</td>
                          <td className="px-5 py-3 font-mono text-xs text-blue-600">{s.tracking}</td>
                          <td className="px-5 py-3 text-gray-600">{s.destinazione}</td>
                          <td className="px-5 py-3 text-xs text-gray-600">{s.partenza}</td>
                          <td className="px-5 py-3 text-xs text-gray-600">{s.consegna}</td>
                          <td className="px-5 py-3"><StatBadge text={s.stato === 'in_transito' ? 'In transito' : 'Consegnato'} variant={s.stato === 'in_transito' ? 'blue' : 'green'} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══ CONTENUTI ═══ */}
          {activeTab === 'contenuti' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Gestione Contenuti</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                  <Plus className="w-4 h-4" /> Nuova guida
                </button>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-1">Gestione guide, banner e pagine</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Guide all'acquisto, articoli tecnici, banner promozionali, pagine informative, FAQ e SEO.
                </p>
              </div>
            </div>
          )}

          {/* ═══ IMPOSTAZIONI ═══ */}
          {activeTab === 'impostazioni' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Impostazioni</h2>

              {/* Stripe */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Stripe — Pagamenti</h3>
                    <p className="text-xs text-gray-500">Configura le chiavi API per accettare pagamenti</p>
                  </div>
                  <div className="ml-auto">
                    {isStripeConfigured() ? (
                      <StatBadge text="Configurato" variant="green" />
                    ) : (
                      <StatBadge text="Non configurato" variant="amber" />
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Publishable Key</label>
                    <div className="flex gap-3">
                      <input type="text" value={stripeKey} onChange={e => { setStripeKey(e.target.value); setStripeSaved(false); }}
                        placeholder="pk_test_..." className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:outline-none font-mono" />
                      <button onClick={() => { if (stripeKey.trim()) { persistStripePublishableKey(stripeKey.trim()); setStripeSaved(true); setTimeout(() => setStripeSaved(false), 3000); } }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-bold text-sm rounded-xl hover:bg-green-700 transition-colors">
                        <Save className="w-4 h-4" /> Salva
                      </button>
                    </div>
                    {stripeSaved && <p className="mt-1.5 text-sm text-green-700 font-semibold flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Salvata</p>}
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <p className="text-xs text-amber-800">
                      <strong>Secret Key</strong>: va su Cloudflare Pages &gt; Settings &gt; Environment Variables &gt; <code className="bg-amber-100 px-1 rounded">STRIPE_SECRET_KEY</code>
                    </p>
                  </div>
                </div>
              </div>

              {/* Email SMTP */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Email — Gmail SMTP</h3>
                    <p className="text-xs text-gray-500">Configura l'invio email (verifica, password, ordini)</p>
                  </div>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-2">
                  <p className="text-sm font-semibold text-blue-900">Variabili d'ambiente da configurare su Cloudflare Pages:</p>
                  <div className="bg-white rounded-lg p-3 font-mono text-xs space-y-1">
                    <p><span className="text-blue-600">GMAIL_USER</span> = tua-email@gmail.com</p>
                    <p><span className="text-blue-600">GMAIL_APP_PASSWORD</span> = xxxx xxxx xxxx xxxx</p>
                  </div>
                  <p className="text-xs text-blue-700">
                    Vai su <strong>Cloudflare Pages &gt; Settings &gt; Environment Variables</strong> e aggiungi queste due variabili.
                    La App Password la generi da <strong>Google Account &gt; Sicurezza &gt; Password per le app</strong>.
                  </p>
                </div>
              </div>

              {/* Supabase */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Supabase — Database e Auth</h3>
                    <p className="text-xs text-gray-500">Backend, database, autenticazione reale e storage</p>
                  </div>
                  <div className="ml-auto"><StatBadge text="Piano Free" variant="green" /></div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Stato attuale: Mock locale</p>
                  <p className="text-xs text-gray-600 mb-3">
                    Il sistema usa dati locali (localStorage). Per passare alla produzione, collega un progetto Supabase.
                    Piano Free: 50.000 utenti, 500MB database, 1GB storage — perfetto per il test.
                  </p>
                  <div className="bg-white rounded-lg p-3 font-mono text-xs space-y-1">
                    <p><span className="text-green-700">VITE_SUPABASE_URL</span> = https://xxx.supabase.co</p>
                    <p><span className="text-green-700">VITE_SUPABASE_ANON_KEY</span> = eyJ...</p>
                  </div>
                </div>
              </div>

              {/* Sicurezza e ruoli */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Sicurezza e Ruoli</h3>
                    <p className="text-xs text-gray-500">Gestione permessi e log attivita</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <Shield className="w-5 h-5 text-gray-700 mb-1" />
                    <p className="text-sm font-bold text-gray-900">Admin</p>
                    <p className="text-xs text-gray-500">Accesso completo</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <Users className="w-5 h-5 text-green-700 mb-1" />
                    <p className="text-sm font-bold text-gray-900">Cliente B2B</p>
                    <p className="text-xs text-gray-500">Ordini, fatture, profilo</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <BadgeCheck className="w-5 h-5 text-amber-600 mb-1" />
                    <p className="text-sm font-bold text-gray-900">Pro / Rivenditore</p>
                    <p className="text-xs text-gray-500">Commissioni, referral</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
