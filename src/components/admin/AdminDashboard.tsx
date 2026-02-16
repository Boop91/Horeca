import { useState } from 'react';
import {
  Shield, LayoutDashboard, Package, ShoppingCart, Users, FileText,
  Star, Settings, Search, Plus, Eye, Pencil, Trash2, Check, X,
  ChevronRight, TrendingUp, UserPlus, BarChart3, Wrench, Lock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// ── Types ──────────────────────────────────────────────

type AdminTab =
  | 'dashboard'
  | 'catalogo'
  | 'ordini'
  | 'clienti'
  | 'contenuti'
  | 'recensioni'
  | 'ricambi'
  | 'sicurezza';

interface OrderStatus {
  key: string;
  label: string;
  color: string;
  bg: string;
}

const ORDER_STATUSES: Record<string, OrderStatus> = {
  in_attesa: { key: 'in_attesa', label: 'In attesa', color: 'text-yellow-800', bg: 'bg-yellow-100' },
  confermato: { key: 'confermato', label: 'Confermato', color: 'text-blue-800', bg: 'bg-blue-100' },
  spedito: { key: 'spedito', label: 'Spedito', color: 'text-purple-800', bg: 'bg-purple-100' },
  consegnato: { key: 'consegnato', label: 'Consegnato', color: 'text-green-800', bg: 'bg-green-100' },
  annullato: { key: 'annullato', label: 'Annullato', color: 'text-red-800', bg: 'bg-red-100' },
};

// ── Mock Data ──────────────────────────────────────────

const MOCK_PRODUCTS = [
  { sku: 'BP-LG-001', nome: 'Lavastoviglie Industriale BP-50', marca: 'BianchiPro', prezzo: 3250.00, disponibilita: 12 },
  { sku: 'BP-FR-002', nome: 'Frigorifero Professionale 700L', marca: 'BianchiPro', prezzo: 2890.00, disponibilita: 5 },
  { sku: 'BP-FO-003', nome: 'Forno Convezione 10 Teglie GN', marca: 'BianchiPro', prezzo: 4150.00, disponibilita: 8 },
  { sku: 'SM-AB-004', nome: 'Abbattitore Rapido 5 Teglie', marca: 'Sagi', prezzo: 3780.00, disponibilita: 3 },
  { sku: 'BP-TA-005', nome: 'Tavolo Refrigerato 3 Porte', marca: 'BianchiPro', prezzo: 1950.00, disponibilita: 15 },
  { sku: 'EL-PI-006', nome: 'Pianeta Cottura 6 Fuochi', marca: 'Electrolux', prezzo: 2340.00, disponibilita: 0 },
  { sku: 'BP-LA-007', nome: 'Lavello Industriale 2 Vasche', marca: 'BianchiPro', prezzo: 890.00, disponibilita: 22 },
  { sku: 'HO-IC-008', nome: 'Ice Maker 80kg/giorno', marca: 'Hoshizaki', prezzo: 5200.00, disponibilita: 2 },
];

const MOCK_CATEGORIES = [
  'Lavaggio', 'Refrigerazione', 'Cottura', 'Preparazione', 'Ghiaccio', 'Arredamento Inox',
];

const MOCK_ORDERS = [
  { id: 'ORD-2024-0156', data: '15/02/2026', cliente: 'Ristorante Da Mario', totale: 6140.00, stato: 'in_attesa' },
  { id: 'ORD-2024-0155', data: '14/02/2026', cliente: 'Hotel Belvedere', totale: 12480.00, stato: 'confermato' },
  { id: 'ORD-2024-0154', data: '14/02/2026', cliente: 'Pizzeria Napoli', totale: 3250.00, stato: 'spedito' },
  { id: 'ORD-2024-0153', data: '13/02/2026', cliente: 'Catering Rossi S.r.l.', totale: 8920.00, stato: 'consegnato' },
  { id: 'ORD-2024-0152', data: '12/02/2026', cliente: 'Bar Centrale', totale: 1540.00, stato: 'annullato' },
  { id: 'ORD-2024-0151', data: '12/02/2026', cliente: 'Trattoria Il Borgo', totale: 4380.00, stato: 'consegnato' },
  { id: 'ORD-2024-0150', data: '11/02/2026', cliente: 'Mensa Aziendale Alfa', totale: 15200.00, stato: 'consegnato' },
];

const MOCK_CLIENTS = [
  { nome: 'Mario Bianchi', email: 'mario@ristorantedamario.it', piva: '01234567890', ordini: 5, registrato: '10/01/2025' },
  { nome: 'Giulia Verdi', email: 'giulia@hotelbelvedere.com', piva: '09876543210', ordini: 12, registrato: '05/06/2024' },
  { nome: 'Luca Ferrari', email: 'luca@pizzerianapoli.it', piva: '11223344556', ordini: 3, registrato: '22/11/2025' },
  { nome: 'Anna Colombo', email: 'anna@cateringrossi.it', piva: '66778899001', ordini: 8, registrato: '15/03/2024' },
  { nome: 'Roberto Esposito', email: 'roberto@barcentrale.it', piva: '33445566778', ordini: 2, registrato: '01/02/2026' },
  { nome: 'Francesca Russo', email: 'francesca@ilborgo.it', piva: '55667788990', ordini: 6, registrato: '18/08/2024' },
];

const MOCK_GUIDES = [
  { id: 1, titolo: 'Guida alla scelta della lavastoviglie', categoria: 'Lavaggio', pubblicato: true },
  { id: 2, titolo: 'Manutenzione frigoriferi professionali', categoria: 'Refrigerazione', pubblicato: true },
  { id: 3, titolo: 'Normative HACCP: cosa sapere', categoria: 'Normative', pubblicato: false },
  { id: 4, titolo: 'Come scegliere il forno professionale', categoria: 'Cottura', pubblicato: true },
  { id: 5, titolo: 'Guida al risparmio energetico in cucina', categoria: 'Efficienza', pubblicato: false },
];

const MOCK_REVIEWS = [
  { id: 1, prodotto: 'Lavastoviglie Industriale BP-50', rating: 5, testo: 'Eccellente! Lava perfettamente anche le pentole piu incrostate. Consigliata per ristoranti ad alto volume.', autore: 'Mario Bianchi' },
  { id: 2, prodotto: 'Frigorifero Professionale 700L', rating: 4, testo: 'Ottimo frigorifero, silenzioso e capiente. Un punto in meno per la maniglia che sembra fragile.', autore: 'Giulia Verdi' },
  { id: 3, prodotto: 'Forno Convezione 10 Teglie GN', rating: 3, testo: 'Buon forno ma la temperatura non e sempre precisa. Servizio assistenza rapido.', autore: 'Luca Ferrari' },
  { id: 4, prodotto: 'Abbattitore Rapido 5 Teglie', rating: 5, testo: 'Indispensabile in cucina professionale. Abbatte in tempi record.', autore: 'Anna Colombo' },
];

const MOCK_SPARE_PARTS = [
  { sku: 'RP-LG-001', nome: 'Braccio lavaggio superiore BP-50', compatibilita: 'BP-LG-001', prezzo: 45.00, disponibilita: 30 },
  { sku: 'RP-LG-002', nome: 'Resistenza riscaldamento BP-50', compatibilita: 'BP-LG-001', prezzo: 120.00, disponibilita: 12 },
  { sku: 'RP-FR-001', nome: 'Termostato digitale 700L', compatibilita: 'BP-FR-002', prezzo: 85.00, disponibilita: 8 },
  { sku: 'RP-FO-001', nome: 'Ventola convezione GN', compatibilita: 'BP-FO-003', prezzo: 95.00, disponibilita: 15 },
  { sku: 'RP-FO-002', nome: 'Guarnizione porta forno GN', compatibilita: 'BP-FO-003', prezzo: 35.00, disponibilita: 40 },
];

const MOCK_AUDIT_LOG = [
  { data: '15/02/2026 14:32', utente: 'admin@bianchipro.it', azione: 'Login', dettagli: 'Accesso al pannello admin' },
  { data: '15/02/2026 14:28', utente: 'admin@bianchipro.it', azione: 'Ordine aggiornato', dettagli: 'ORD-2024-0155 stato -> confermato' },
  { data: '15/02/2026 10:15', utente: 'admin@bianchipro.it', azione: 'Prodotto modificato', dettagli: 'BP-FR-002 prezzo aggiornato' },
  { data: '14/02/2026 16:45', utente: 'admin@bianchipro.it', azione: 'Recensione approvata', dettagli: 'Review #4 - Abbattitore Rapido' },
  { data: '14/02/2026 09:00', utente: 'admin@bianchipro.it', azione: 'Guida pubblicata', dettagli: '"Come scegliere il forno professionale"' },
  { data: '13/02/2026 17:30', utente: 'admin@bianchipro.it', azione: 'Cliente registrato', dettagli: 'Roberto Esposito - Bar Centrale' },
  { data: '13/02/2026 11:20', utente: 'admin@bianchipro.it', azione: 'Ricambio aggiunto', dettagli: 'RP-FO-002 Guarnizione porta forno' },
];

// ── Sidebar config ─────────────────────────────────────

const SIDEBAR_ITEMS: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'catalogo', label: 'Catalogo', icon: Package },
  { id: 'ordini', label: 'Ordini', icon: ShoppingCart },
  { id: 'clienti', label: 'Clienti', icon: Users },
  { id: 'contenuti', label: 'Contenuti', icon: FileText },
  { id: 'recensioni', label: 'Recensioni', icon: Star },
  { id: 'ricambi', label: 'Ricambi', icon: Wrench },
  { id: 'sicurezza', label: 'Sicurezza', icon: Lock },
];

// ── Component ──────────────────────────────────────────

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [clientSearch, setClientSearch] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Accesso negato</h2>
        <p className="text-gray-600 mb-6">Solo gli amministratori possono accedere a questa sezione.</p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
        >
          Torna alla home
        </button>
      </div>
    );
  }

  const filteredClients = MOCK_CLIENTS.filter(c =>
    !clientSearch ||
    c.nome.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.piva.includes(clientSearch)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top header bar */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Pannello Amministratore</h1>
            <p className="text-gray-400 text-xs">BianchiPro - Gestione completa</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto flex">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-72px)] py-4 px-3 hidden md:block">
          <nav className="space-y-1">
            {SIDEBAR_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                  activeTab === item.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
                {item.id === 'recensioni' && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {MOCK_REVIEWS.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile tab bar */}
        <div className="md:hidden w-full overflow-x-auto border-b border-gray-200 bg-white px-3 py-2 flex gap-2">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === item.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">

          {/* ═══ DASHBOARD TAB ═══ */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { label: 'Ordini oggi', value: '12', icon: ShoppingCart, color: 'bg-blue-50 text-blue-700' },
                  { label: 'Ordini settimana', value: '47', icon: TrendingUp, color: 'bg-green-50 text-green-700' },
                  { label: 'Fatturato mese', value: '\u20AC45.230', icon: BarChart3, color: 'bg-amber-50 text-amber-700' },
                  { label: 'Clienti nuovi', value: '8', icon: UserPlus, color: 'bg-purple-50 text-purple-700' },
                  { label: 'Prodotti venduti', value: '156', icon: Package, color: 'bg-rose-50 text-rose-700' },
                ].map(kpi => (
                  <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${kpi.color}`}>
                      <kpi.icon className="w-4.5 h-4.5" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent orders */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Ordini recenti</h3>
                  <button onClick={() => setActiveTab('ordini')} className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1">
                    Vedi tutti <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left">
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Data</th>
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
                            <td className="px-5 py-3 text-gray-600">{o.data}</td>
                            <td className="px-5 py-3 font-medium text-gray-900">{o.cliente}</td>
                            <td className="px-5 py-3 font-semibold text-gray-900">{'\u20AC'}{o.totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</td>
                            <td className="px-5 py-3">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${status.bg} ${status.color}`}>
                                {status.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mini chart placeholder */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">Andamento vendite</h3>
                <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <BarChart3 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 font-medium">Grafico vendite - prossimamente</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ CATALOGO TAB ═══ */}
          {activeTab === 'catalogo' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Catalogo Prodotti</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                  <Plus className="w-4 h-4" /> Nuovo prodotto
                </button>
              </div>

              <div className="flex gap-6">
                {/* Category sidebar */}
                <div className="hidden lg:block w-48 shrink-0">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Categorie</h4>
                    <ul className="space-y-1">
                      {MOCK_CATEGORIES.map(cat => (
                        <li key={cat}>
                          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                            {cat}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Product table */}
                <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 text-left bg-gray-50">
                          <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">SKU</th>
                          <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nome</th>
                          <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Marca</th>
                          <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Prezzo</th>
                          <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Disp.</th>
                          <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Azioni</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_PRODUCTS.map(p => (
                          <tr key={p.sku} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-600">{p.sku}</td>
                            <td className="px-4 py-3 font-medium text-gray-900">{p.nome}</td>
                            <td className="px-4 py-3 text-gray-600">{p.marca}</td>
                            <td className="px-4 py-3 font-semibold text-gray-900">{'\u20AC'}{p.prezzo.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${
                                p.disponibilita > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {p.disponibilita > 0 ? p.disponibilita : 'Esaurito'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifica">
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Elimina">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ ORDINI TAB ═══ */}
          {activeTab === 'ordini' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Gestione Ordini</h2>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left bg-gray-50">
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Data</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Totale</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Stato</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_ORDERS.map(o => {
                        const status = ORDER_STATUSES[o.stato];
                        const isExpanded = expandedOrder === o.id;
                        return (
                          <>
                            <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                              <td className="px-5 py-3 font-mono text-xs font-semibold text-gray-700">{o.id}</td>
                              <td className="px-5 py-3 text-gray-600">{o.data}</td>
                              <td className="px-5 py-3 font-medium text-gray-900">{o.cliente}</td>
                              <td className="px-5 py-3 font-semibold text-gray-900">{'\u20AC'}{o.totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</td>
                              <td className="px-5 py-3">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${status.bg} ${status.color}`}>
                                  {status.label}
                                </span>
                              </td>
                              <td className="px-5 py-3">
                                <button
                                  onClick={() => setExpandedOrder(isExpanded ? null : o.id)}
                                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Dettagli"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr key={`${o.id}-detail`} className="bg-gray-50">
                                <td colSpan={6} className="px-5 py-4">
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <p className="text-xs text-gray-500 font-semibold mb-1">Indirizzo spedizione</p>
                                      <p className="text-gray-900">Via Roma 15, 20100 Milano (MI)</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 font-semibold mb-1">Metodo pagamento</p>
                                      <p className="text-gray-900">Bonifico bancario</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 font-semibold mb-1">Note</p>
                                      <p className="text-gray-900">Consegna piano terra</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 font-semibold mb-1">Tracking</p>
                                      <p className="text-gray-900 font-mono text-xs">{o.stato === 'spedito' || o.stato === 'consegnato' ? 'BRT-123456789' : '-'}</p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══ CLIENTI TAB ═══ */}
          {activeTab === 'clienti' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Gestione Clienti</h2>

              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -trangray-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={clientSearch}
                  onChange={e => setClientSearch(e.target.value)}
                  placeholder="Cerca per nome, email o P.IVA..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-500 bg-white"
                />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left bg-gray-50">
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Nome</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">P.IVA</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Ordini</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Registrato il</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map(c => (
                        <tr key={c.email} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-5 py-3 font-medium text-gray-900">{c.nome}</td>
                          <td className="px-5 py-3 text-gray-600">{c.email}</td>
                          <td className="px-5 py-3 font-mono text-xs text-gray-600">{c.piva}</td>
                          <td className="px-5 py-3 text-center font-semibold text-gray-900">{c.ordini}</td>
                          <td className="px-5 py-3 text-gray-600">{c.registrato}</td>
                        </tr>
                      ))}
                      {filteredClients.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-5 py-12 text-center text-gray-400 font-medium">
                            Nessun cliente trovato
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══ CONTENUTI TAB ═══ */}
          {activeTab === 'contenuti' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Gestione Contenuti</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                  <Plus className="w-4 h-4" /> Nuova guida
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left bg-gray-50">
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Titolo</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Categoria</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Stato</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_GUIDES.map(g => (
                        <tr key={g.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-5 py-3 font-medium text-gray-900">{g.titolo}</td>
                          <td className="px-5 py-3 text-gray-600">{g.categoria}</td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${
                              g.pubblicato ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {g.pubblicato ? 'Pubblicato' : 'Bozza'}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1">
                              <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifica">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Elimina">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
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

          {/* ═══ RECENSIONI TAB ═══ */}
          {activeTab === 'recensioni' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Moderazione Recensioni</h2>
              <div className="space-y-4">
                {MOCK_REVIEWS.map(r => (
                  <div key={r.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{r.prodotto}</h4>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{r.testo}</p>
                        <p className="text-xs text-gray-400">di {r.autore}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 text-sm font-semibold rounded-lg hover:bg-green-100 transition-colors">
                          <Check className="w-4 h-4" /> Approva
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-100 transition-colors">
                          <X className="w-4 h-4" /> Rifiuta
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ RICAMBI TAB ═══ */}
          {activeTab === 'ricambi' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Gestione Ricambi</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                  <Plus className="w-4 h-4" /> Nuovo ricambio
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left bg-gray-50">
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">SKU</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nome</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Compatibilita</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Prezzo</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Disp.</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_SPARE_PARTS.map(p => (
                        <tr key={p.sku} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-600">{p.sku}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">{p.nome}</td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.compatibilita}</td>
                          <td className="px-4 py-3 font-semibold text-gray-900">{'\u20AC'}{p.prezzo.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                              {p.disponibilita}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifica">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Elimina">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
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

          {/* ═══ SICUREZZA TAB ═══ */}
          {activeTab === 'sicurezza' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Sicurezza e Ruoli</h2>

              {/* Role management */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-4">Ruoli del sistema</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-gray-700" />
                      <h4 className="font-bold text-gray-900">Admin</h4>
                    </div>
                    <p className="text-sm text-gray-600">Accesso completo a tutte le funzionalita. Gestione utenti, ordini, catalogo, contenuti e impostazioni di sicurezza.</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-green-600" />
                      <h4 className="font-bold text-gray-900">Client</h4>
                    </div>
                    <p className="text-sm text-gray-600">Accesso al catalogo, gestione ordini personali, profilo e wallet. Nessun accesso al pannello admin.</p>
                  </div>
                </div>
              </div>

              {/* Audit log */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">Log attivita</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left bg-gray-50">
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Data</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Utente</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Azione</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Dettagli</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_AUDIT_LOG.map((entry, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">{entry.data}</td>
                          <td className="px-5 py-3 font-mono text-xs text-gray-600">{entry.utente}</td>
                          <td className="px-5 py-3 font-medium text-gray-900">{entry.azione}</td>
                          <td className="px-5 py-3 text-gray-600">{entry.dettagli}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
