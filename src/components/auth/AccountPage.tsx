import { useMemo, useState } from 'react';
import { Link, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import {
  getStripePublishableKey,
  getStripeSecretKeyForLocalDev,
  persistStripePublishableKey,
  persistStripeSecretKeyForLocalDev,
  resetStripePublishableKey,
  resetStripeSecretKeyForLocalDev,
} from '../../config/stripe';
import { toast } from 'sonner';
import {
  User, Crown, Shield, Mail, Phone, Calendar, LogOut, Wallet,
  ChevronRight, Copy, Check, Building2, MapPin, Package, FileText,
  MessageSquare, Heart, ClipboardList, Plus, Trash2, Star,
  Lock, ChevronDown, ChevronUp, CreditCard, Settings, RotateCcw, Download, BellRing, ArrowLeft,
} from 'lucide-react';

/* ================================================================
   SIDEBAR NAVIGATION
   ================================================================ */

const sidebarLinks = [
  { to: '/account', label: 'Dashboard', icon: User, exact: true },
  { to: '/account/profilo', label: 'Profilo Azienda', icon: Building2 },
  { to: '/account/indirizzi', label: 'Rubrica Indirizzi', icon: MapPin },
  { to: '/account/ordini', label: 'Storico Ordini', icon: Package },
  { to: '/account/fatture', label: 'Fatture', icon: FileText },
  { to: '/account/pagamenti', label: 'Gestione Pagamenti', icon: CreditCard },
  { to: '/account/preventivi', label: 'Preventivi', icon: ClipboardList },
  { to: '/account/preferiti', label: 'Preferiti', icon: Heart },
  { to: '/account/assistenza', label: 'Assistenza', icon: MessageSquare },
];

const accountSectionMeta: Record<string, { title: string; description: string }> = {
  profilo: { title: 'Profilo Azienda', description: 'Dati fiscali e contatti operativi.' },
  indirizzi: { title: 'Rubrica Indirizzi', description: 'Sedi di spedizione e fatturazione.' },
  ordini: { title: 'Storico Ordini', description: 'Monitoraggio ordini e riordino rapido.' },
  fatture: { title: 'Fatture', description: 'Download documenti fiscali e filtri stato.' },
  pagamenti: { title: 'Gestione Pagamenti', description: 'Carte salvate e configurazione Stripe.' },
  preventivi: { title: 'Preventivi', description: 'Richieste aperte e conversione in ordine.' },
  preferiti: { title: 'Preferiti', description: 'Liste prodotto per acquisti ricorrenti.' },
  assistenza: { title: 'Assistenza', description: 'Ticket, telefono e contatti diretti.' },
};

const moneyFormatter = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });
const formatEuro = (value: number) => moneyFormatter.format(value);
const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });

const DASHBOARD_ALERTS = [
  { id: 'alert-order', type: 'info', text: 'Hai un ordine in attesa di conferma. Controlla lo stato in tempo reale.' },
  { id: 'alert-quote', type: 'success', text: 'Nuova promozione attiva sui forni professionali fino al 30 del mese.' },
] as const;

const MOCK_INVOICES = [
  { id: 'inv-1', number: 'FT-2024/0042', date: '2024-12-20', amount: 4209.00, status: 'Pagata' },
  { id: 'inv-2', number: 'FT-2025/0005', date: '2025-01-25', amount: 1561.60, status: 'Pagata' },
  { id: 'inv-3', number: 'FT-2025/0011', date: '2025-02-12', amount: 692.35, status: 'In attesa' },
] as const;

const MOCK_QUOTES = [
  { id: 'qt-1', number: 'PRV-2025/003', date: '2025-02-01', amount: 12500.00, status: 'In attesa', expires: '2025-03-01' },
  { id: 'qt-2', number: 'PRV-2025/001', date: '2025-01-10', amount: 8200.00, status: 'Approvato', expires: '2025-02-10' },
] as const;

function AccountSidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname.startsWith(to);

  const isPro = user?.role === 'pro';
  const isAdmin = user?.role === 'admin';

  const roleConfig: Record<string, { label: string; bg: string }> = {
    client: { label: 'Cliente', bg: 'from-green-600 to-green-700' },
    pro: { label: 'Professionista', bg: 'from-amber-500 to-orange-600' },
    admin: { label: 'Amministratore', bg: 'from-gray-700 to-gray-900' },
  };

  const config = roleConfig[user?.role ?? 'client'];

  return (
    <aside className="w-full lg:w-64 shrink-0">
      {/* User card */}
      <div className={`bg-gradient-to-br ${config.bg} rounded-2xl p-5 mb-4 text-white`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            {isPro ? <Crown className="w-6 h-6" /> : isAdmin ? <Shield className="w-6 h-6" /> : <User className="w-6 h-6" />}
          </div>
          <div className="min-w-0">
            <p className="font-bold truncate">{user?.name}</p>
            <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
              {config.label}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm" aria-label="Navigazione account">
        <p className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Pannello account</p>
        {sidebarLinks.map((link) => {
          const active = isActive(link.to, link.exact);
          return (
            <Link
              key={link.to}
              to={link.to}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-11 items-center gap-3 px-4 py-3 text-base font-medium transition-colors border-b border-gray-100 last:border-b-0 ${
                active
                  ? 'bg-green-50 text-green-700 border-l-2 border-l-green-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <link.icon className={`w-4 h-4 ${active ? 'text-green-600' : 'text-gray-400'}`} />
              {link.label}
            </Link>
          );
        })}

        {/* Wallet link */}
        <Link
          to="/wallet"
          className="flex min-h-11 items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors"
        >
          <Wallet className="w-4 h-4 text-gray-400" />
          Wallet
          <span className="ml-auto text-xs font-bold text-green-700">
            {user?.walletBalance.toFixed(2)} &euro;
          </span>
        </Link>

        {isAdmin && (
          <Link
            to="/admin"
            className="flex min-h-11 items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors"
          >
            <Shield className="w-4 h-4 text-gray-400" />
            Pannello Admin
          </Link>
        )}

        {/* Logout */}
        <button
          type="button"
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex min-h-11 items-center gap-3 px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Esci
        </button>
      </nav>
    </aside>
  );
}

/* ================================================================
   ACCOUNT LAYOUT (sidebar + content)
   ================================================================ */

function AccountLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const activeOrders = MOCK_ORDERS.filter((order) => order.status === 'in_attesa' || order.status === 'confermato').length;
  const openQuotes = MOCK_QUOTES.filter((quote) => quote.status === 'In attesa').length;
  const isDashboard = pathname === '/account' || pathname === '/account/';
  const sectionKey = pathname.startsWith('/account/') ? pathname.replace('/account/', '').split('/')[0] : '';
  const activeSectionMeta = accountSectionMeta[sectionKey];
  const sectionCards = sidebarLinks.filter((entry) => !entry.exact);

  return (
    <div className="app-page-shell py-8 mb-20">
      <div className="grid gap-6 lg:grid-cols-[260px,minmax(0,1fr)] lg:items-start">
        <AccountSidebar />

        <div className="min-w-0 space-y-6">
          <section className="rounded-2xl border border-green-100 bg-gradient-to-r from-white via-green-50 to-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
              {isDashboard ? 'Area riservata' : 'Sezione account'}
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">
              {isDashboard ? 'Pannello Account' : activeSectionMeta?.title || 'Account Cliente'}
            </h1>
            <p className="mt-2 text-base text-gray-700">
              {isDashboard
                ? 'Gestisci ordini, pagamenti, fatture e assistenza in un unico hub.'
                : activeSectionMeta?.description || 'Gestione sezione account in corso.'}
              {user?.email ? ` Accesso attivo per ${user.email}.` : ''}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-700 ring-1 ring-gray-200">
                Ordini attivi: {activeOrders}
              </span>
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-700 ring-1 ring-gray-200">
                Preventivi aperti: {openQuotes}
              </span>
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-700 ring-1 ring-gray-200">
                Fatture disponibili: {MOCK_INVOICES.length}
              </span>
            </div>
          </section>

          {isDashboard ? (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Seleziona una sezione</h2>
              <p className="mt-1 text-sm text-gray-600">Quando entri in una sezione, visualizzerai solo quel contenuto con il percorso di ritorno.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {sectionCards.map((entry) => (
                  <Link
                    key={entry.to}
                    to={entry.to}
                    className="group rounded-xl border border-gray-200 bg-green-50/40 px-4 py-4 transition-colors hover:border-green-300 hover:bg-green-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                        <entry.icon className="h-5 w-5 text-green-700" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-gray-900">{entry.label}</p>
                        <p className="text-sm text-gray-600">{accountSectionMeta[entry.to.replace('/account/', '')]?.description || 'Apri sezione'}</p>
                      </div>
                      <ChevronRight className="ml-auto h-4 w-4 text-green-700 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <Link
                to="/account"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Torna al pannello account
              </Link>
              <p className="mt-2 text-sm font-medium text-gray-600">
                Percorso: <span className="text-gray-900">Account / {activeSectionMeta?.title || 'Sezione'}</span>
              </p>
            </div>
          )}

          <main className="min-w-0">
            <Routes>
              <Route index element={<DashboardSection />} />
              <Route path="profilo" element={<CompanyProfileSection />} />
              <Route path="indirizzi" element={<AddressBookSection />} />
              <Route path="ordini" element={<OrderHistorySection />} />
              <Route path="fatture" element={<InvoicesSection />} />
              <Route path="pagamenti" element={<PaymentsSection />} />
              <Route path="preventivi" element={<QuotesSection />} />
              <Route path="preferiti" element={<FavoritesSection />} />
              <Route path="assistenza" element={<SupportSection />} />
              <Route path="*" element={<Navigate to="/account" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: DASHBOARD
   ================================================================ */

function DashboardSection() {
  const { user } = useAuth();
  const [copiedCode, setCopiedCode] = useState(false);
  if (!user) return null;

  const isPro = user.role === 'pro';
  const firstName = user.name.split(' ')[0];
  const recentOrders = [...MOCK_ORDERS]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);
  const pendingOrders = MOCK_ORDERS.filter((order) => order.status === 'in_attesa' || order.status === 'confermato').length;
  const pendingQuotes = MOCK_QUOTES.filter((quote) => quote.status === 'In attesa').length;

  const copyReferralCode = () => {
    if (user.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopiedCode(true);
      toast.success('Codice copiato!');
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const quickLinks = [
    { to: '/account/ordini', icon: Package, label: 'I tuoi ordini', desc: 'Visualizza lo storico' },
    { to: '/account/profilo', icon: Building2, label: 'Profilo azienda', desc: 'Dati di fatturazione' },
    { to: '/account/indirizzi', icon: MapPin, label: 'Indirizzi', desc: 'Gestisci le sedi' },
    { to: '/wallet', icon: Wallet, label: 'Wallet', desc: `Saldo: ${formatEuro(user.walletBalance)}` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Bentornato, {firstName}!</h1>
        <p className="mt-1 text-base text-gray-600">
          Oggi hai {pendingOrders} ordini da monitorare e {pendingQuotes} preventivi aperti.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <button
          type="button"
          onClick={() => toast.success('Riordino rapido avviato dall\'ultimo ordine.')}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800 hover:bg-green-100 transition-colors"
        >
          Riordina ultimo ordine
        </button>
        <Link
          to="/account/preventivi"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Richiedi o conferma preventivo
        </Link>
        <Link
          to="/account/assistenza"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Apri richiesta assistenza
        </Link>
      </div>

      <div className="space-y-3">
        {DASHBOARD_ALERTS.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-start gap-3 rounded-xl border p-4 ${
              alert.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-900'
                : 'border-blue-200 bg-blue-50 text-blue-900'
            }`}
          >
            <BellRing className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-sm font-medium leading-6">{alert.text}</p>
          </div>
        ))}
      </div>

      {/* Info card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Informazioni account</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-semibold text-gray-900">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Telefono</p>
              <p className="text-base font-semibold text-gray-900">{user.phone || '-'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Registrato il</p>
              <p className="text-base font-semibold text-gray-900">{formatDate(user.createdAt)}</p>
            </div>
          </div>
          {isPro && user.referralCode && (
            <div className="flex items-center gap-3">
              <Crown className="w-4 h-4 text-amber-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Codice Referral</p>
                <div className="flex items-center gap-2">
                  <p className="text-base font-mono font-bold text-amber-700">{user.referralCode}</p>
                  <button
                    type="button"
                    aria-label="Copia codice referral"
                    onClick={copyReferralCode}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 gap-3">
        {quickLinks.map((ql) => (
          <Link
            key={ql.to}
            to={ql.to}
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <ql.icon className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-base">{ql.label}</p>
              <p className="text-sm text-gray-500">{ql.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-gray-900">Ultimi ordini</h3>
          <Link to="/account/ordini" className="text-sm font-semibold text-green-700 hover:text-green-800">
            Vai allo storico
          </Link>
        </div>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
              <div>
                <p className="text-sm font-bold text-gray-900">{order.number}</p>
                <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{formatEuro(order.total)}</p>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_CONFIG[order.status].className}`}>
                  {STATUS_CONFIG[order.status].label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: COMPANY PROFILE
   ================================================================ */

function CompanyProfileSection() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  if (!user) return null;

  const [form, setForm] = useState({
    ragione_sociale: user.ragione_sociale ?? '',
    partita_iva: user.partita_iva ?? '',
    codice_fiscale: user.codice_fiscale ?? '',
    codice_destinatario_sdi: user.codice_destinatario_sdi ?? '0000000',
    pec: user.pec ?? '',
    phone: user.phone ?? '',
  });
  const [usePec, setUsePec] = useState(!!user.pec && !user.codice_destinatario_sdi);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.ragione_sociale.trim()) {
      e.ragione_sociale = 'Inserisci la ragione sociale della tua azienda';
    }

    if (!form.partita_iva.trim()) {
      e.partita_iva = 'Inserisci la partita IVA (IT + 11 cifre)';
    } else if (!/^IT\d{11}$/.test(form.partita_iva)) {
      e.partita_iva = 'Formato: IT seguito da 11 cifre (es. IT12345678901)';
    }

    if (!form.codice_fiscale.trim()) {
      e.codice_fiscale = 'Inserisci il codice fiscale aziendale';
    } else if (form.codice_fiscale.length !== 16) {
      e.codice_fiscale = 'Il Codice Fiscale deve essere di 16 caratteri';
    }

    if (!usePec && !form.codice_destinatario_sdi.trim()) {
      e.codice_destinatario_sdi = 'Inserisci il codice SDI oppure seleziona PEC';
    } else if (!usePec && form.codice_destinatario_sdi.length !== 7) {
      e.codice_destinatario_sdi = 'Il Codice Destinatario SDI deve essere di 7 caratteri';
    }

    if (usePec && !form.pec.trim()) {
      e.pec = 'Inserisci l\'indirizzo PEC';
    } else if (usePec && form.pec && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.pec)) {
      e.pec = 'Indirizzo PEC non valido';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    updateUser({
      ragione_sociale: form.ragione_sociale,
      partita_iva: form.partita_iva,
      codice_fiscale: form.codice_fiscale.toUpperCase(),
      codice_destinatario_sdi: usePec ? '' : form.codice_destinatario_sdi,
      pec: usePec ? form.pec : '',
      phone: form.phone,
    });
    toast.success('Profilo aggiornato con successo');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profilo Azienda</h1>
        <p className="mt-1 text-base text-gray-600">
          Mantieni aggiornati i dati fiscali per fatturazione elettronica, SDI e contatti operativi.
        </p>
      </div>

      <form
        className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          handleSave();
        }}
        noValidate
      >
        {/* Ragione Sociale */}
        <div>
          <label htmlFor="account-ragione-sociale" className="block text-sm font-medium text-gray-700 mb-1">
            Ragione Sociale <span aria-hidden="true">*</span>
          </label>
          <input
            id="account-ragione-sociale"
            type="text"
            value={form.ragione_sociale}
            onChange={(e) => setForm(p => ({ ...p, ragione_sociale: e.target.value }))}
            aria-invalid={Boolean(errors.ragione_sociale)}
            aria-describedby={errors.ragione_sociale ? 'account-ragione-sociale-error' : undefined}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.ragione_sociale ? 'border-red-400' : 'border-gray-300'}`}
            placeholder="Es. Mario Rossi S.r.l."
          />
          {errors.ragione_sociale && <p id="account-ragione-sociale-error" className="text-xs text-red-600 mt-1">{errors.ragione_sociale}</p>}
        </div>

        {/* Partita IVA */}
        <div>
          <label htmlFor="account-partita-iva" className="block text-sm font-medium text-gray-700 mb-1">
            Partita IVA <span aria-hidden="true">*</span>
          </label>
          <input
            id="account-partita-iva"
            type="text"
            value={form.partita_iva}
            onChange={(e) => setForm(p => ({ ...p, partita_iva: e.target.value.toUpperCase() }))}
            aria-invalid={Boolean(errors.partita_iva)}
            aria-describedby={errors.partita_iva ? 'account-partita-iva-error' : 'account-partita-iva-help'}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.partita_iva ? 'border-red-400' : 'border-gray-300'}`}
            placeholder="IT12345678901"
            maxLength={13}
          />
          {!errors.partita_iva && (
            <p id="account-partita-iva-help" className="text-xs text-gray-500 mt-1">
              Formato richiesto: prefisso IT seguito da 11 cifre.
            </p>
          )}
          {errors.partita_iva && <p id="account-partita-iva-error" className="text-xs text-red-600 mt-1">{errors.partita_iva}</p>}
        </div>

        {/* Codice Fiscale */}
        <div>
          <label htmlFor="account-codice-fiscale" className="block text-sm font-medium text-gray-700 mb-1">
            Codice Fiscale <span aria-hidden="true">*</span>
          </label>
          <input
            id="account-codice-fiscale"
            type="text"
            value={form.codice_fiscale}
            onChange={(e) => setForm(p => ({ ...p, codice_fiscale: e.target.value.toUpperCase() }))}
            aria-invalid={Boolean(errors.codice_fiscale)}
            aria-describedby={errors.codice_fiscale ? 'account-codice-fiscale-error' : undefined}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.codice_fiscale ? 'border-red-400' : 'border-gray-300'}`}
            placeholder="RSSMRA80A01H501U"
            maxLength={16}
          />
          {errors.codice_fiscale && <p id="account-codice-fiscale-error" className="text-xs text-red-600 mt-1">{errors.codice_fiscale}</p>}
        </div>

        {/* SDI / PEC toggle */}
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-2">Fatturazione Elettronica</legend>
          <div className="flex gap-4 mb-3">
            <label
              className={`min-h-11 px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center cursor-pointer ${
                !usePec ? 'bg-green-100 text-green-700 ring-1 ring-green-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <input
                type="radio"
                name="account-fatturazione"
                className="sr-only"
                checked={!usePec}
                onChange={() => setUsePec(false)}
              />
              Codice SDI
            </label>
            <label
              className={`min-h-11 px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center cursor-pointer ${
                usePec ? 'bg-green-100 text-green-700 ring-1 ring-green-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <input
                type="radio"
                name="account-fatturazione"
                className="sr-only"
                checked={usePec}
                onChange={() => setUsePec(true)}
              />
              PEC
            </label>
          </div>
          {!usePec ? (
            <div>
              <label htmlFor="account-codice-sdi" className="block text-sm font-medium text-gray-700 mb-1">
                Codice SDI <span aria-hidden="true">*</span>
              </label>
              <input
                id="account-codice-sdi"
                type="text"
                value={form.codice_destinatario_sdi}
                onChange={(e) => setForm(p => ({ ...p, codice_destinatario_sdi: e.target.value.toUpperCase() }))}
                aria-invalid={Boolean(errors.codice_destinatario_sdi)}
                aria-describedby={errors.codice_destinatario_sdi ? 'account-codice-sdi-error' : 'account-codice-sdi-help'}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.codice_destinatario_sdi ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="0000000"
                maxLength={7}
              />
              {!errors.codice_destinatario_sdi && (
                <p id="account-codice-sdi-help" className="text-xs text-gray-500 mt-1">
                  Deve contenere 7 caratteri alfanumerici.
                </p>
              )}
              {errors.codice_destinatario_sdi && <p id="account-codice-sdi-error" className="text-xs text-red-600 mt-1">{errors.codice_destinatario_sdi}</p>}
            </div>
          ) : (
            <div>
              <label htmlFor="account-pec" className="block text-sm font-medium text-gray-700 mb-1">
                Indirizzo PEC <span aria-hidden="true">*</span>
              </label>
              <input
                id="account-pec"
                type="email"
                value={form.pec}
                onChange={(e) => setForm(p => ({ ...p, pec: e.target.value }))}
                aria-invalid={Boolean(errors.pec)}
                aria-describedby={errors.pec ? 'account-pec-error' : undefined}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.pec ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="azienda@pec.it"
              />
              {errors.pec && <p id="account-pec-error" className="text-xs text-red-600 mt-1">{errors.pec}</p>}
            </div>
          )}
        </fieldset>

        {/* Telefono */}
        <div>
          <label htmlFor="account-phone" className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
          <input
            id="account-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="+39 333 123 4567"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label htmlFor="account-email-readonly" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="flex items-center gap-2">
            <input
              id="account-email-readonly"
              type="email"
              value={user.email}
              disabled
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
            />
            <Lock className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1">L'email non puo essere modificata da questa sezione.</p>
        </div>

        {/* Save */}
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <button
            type="submit"
            className="w-full sm:w-auto min-h-11 bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
          >
            Salva Modifiche
          </button>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full sm:w-auto min-h-11 bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
          >
            Esci account
          </button>
        </div>
      </form>
    </div>
  );
}

/* ================================================================
   SECTION: ADDRESS BOOK
   ================================================================ */

interface Address {
  id: string;
  label: string;
  type: 'shipping' | 'billing';
  name: string;
  street: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

const MOCK_ADDRESSES: Address[] = [
  { id: 'addr-1', label: 'Sede principale', type: 'billing', name: 'Mario Rossi S.r.l.', street: 'Via Roma 42', city: 'Milano', province: 'MI', zip: '20121', country: 'Italia', isDefault: true },
  { id: 'addr-2', label: 'Magazzino', type: 'shipping', name: 'Mario Rossi S.r.l.', street: 'Via Industriale 8', city: 'Bergamo', province: 'BG', zip: '24121', country: 'Italia', isDefault: false },
];

function AddressBookSection() {
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [showForm, setShowForm] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<Address, 'id' | 'isDefault'>>({
    label: '', type: 'shipping', name: '', street: '', city: '', province: '', zip: '', country: 'Italia',
  });

  const setDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    toast.success('Indirizzo predefinito aggiornato');
  };

  const removeAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast.success('Indirizzo rimosso');
  };

  const addAddress = () => {
    if (!newAddr.street || !newAddr.city || !newAddr.zip) {
      toast.error('Compila i campi obbligatori');
      return;
    }
    const addr: Address = {
      ...newAddr,
      id: `addr-${Date.now()}`,
      isDefault: addresses.length === 0,
    };
    setAddresses(prev => [...prev, addr]);
    setNewAddr({ label: '', type: 'shipping', name: '', street: '', city: '', province: '', zip: '', country: 'Italia' });
    setShowForm(false);
    toast.success('Indirizzo aggiunto');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rubrica Indirizzi</h1>
          <p className="mt-1 text-base text-gray-600">
            Salva sedi operative e indirizzi di fatturazione per velocizzare il checkout.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex min-h-11 items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Aggiungi
        </button>
      </div>

      {/* New address form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-green-200 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900">Nuovo indirizzo</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="account-address-label" className="block text-sm font-medium text-gray-700 mb-1">Etichetta</label>
              <input
                id="account-address-label"
                type="text"
                value={newAddr.label}
                onChange={(e) => setNewAddr(p => ({ ...p, label: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                placeholder="Es. Sede, Magazzino"
              />
            </div>
            <div>
              <label htmlFor="account-address-type" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                id="account-address-type"
                value={newAddr.type}
                onChange={(e) => setNewAddr(p => ({ ...p, type: e.target.value as 'shipping' | 'billing' }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              >
                <option value="shipping">Spedizione</option>
                <option value="billing">Fatturazione</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="account-address-name" className="block text-sm font-medium text-gray-700 mb-1">Intestatario</label>
              <input
                id="account-address-name"
                type="text"
                value={newAddr.name}
                onChange={(e) => setNewAddr(p => ({ ...p, name: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                placeholder="Ragione Sociale o nome"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="account-address-street" className="block text-sm font-medium text-gray-700 mb-1">
                Indirizzo <span aria-hidden="true">*</span>
              </label>
              <input
                id="account-address-street"
                type="text"
                value={newAddr.street}
                onChange={(e) => setNewAddr(p => ({ ...p, street: e.target.value }))}
                aria-required="true"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                placeholder="Via, numero civico"
              />
            </div>
            <div>
              <label htmlFor="account-address-city" className="block text-sm font-medium text-gray-700 mb-1">
                Citta <span aria-hidden="true">*</span>
              </label>
              <input
                id="account-address-city"
                type="text"
                value={newAddr.city}
                onChange={(e) => setNewAddr(p => ({ ...p, city: e.target.value }))}
                aria-required="true"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="account-address-province" className="block text-sm font-medium text-gray-700 mb-1">Prov.</label>
                <input
                  id="account-address-province"
                  type="text"
                  value={newAddr.province}
                  onChange={(e) => setNewAddr(p => ({ ...p, province: e.target.value.toUpperCase() }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                  maxLength={2}
                />
                <p className="mt-1 text-xs text-gray-500">Formato: 2 lettere (es. MI)</p>
              </div>
              <div>
                <label htmlFor="account-address-zip" className="block text-sm font-medium text-gray-700 mb-1">
                  CAP <span aria-hidden="true">*</span>
                </label>
                <input
                  id="account-address-zip"
                  type="text"
                  value={newAddr.zip}
                  onChange={(e) => setNewAddr(p => ({ ...p, zip: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
                  aria-required="true"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                  maxLength={5}
                />
                <p className="mt-1 text-xs text-gray-500">Formato: 5 cifre numeriche</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={addAddress} className="min-h-11 bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors">
              Salva Indirizzo
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="min-h-11 bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              Annulla
            </button>
          </div>
        </div>
      )}

      {/* Address list */}
      <div className="space-y-3">
        {addresses.map((addr) => (
          <div key={addr.id} className={`bg-white rounded-xl border p-4 shadow-sm ${addr.isDefault ? 'border-green-300 ring-1 ring-green-100' : 'border-gray-200'}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900 text-sm">{addr.label || 'Indirizzo'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${addr.type === 'billing' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {addr.type === 'billing' ? 'Fatturazione' : 'Spedizione'}
                  </span>
                  {addr.isDefault && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">
                      Predefinito
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700">{addr.name}</p>
                <p className="text-sm text-gray-500">{addr.street}, {addr.zip} {addr.city} ({addr.province})</p>
              </div>
              <div className="flex items-center gap-1">
                {!addr.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefault(addr.id)}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    title="Imposta come predefinito"
                    aria-label={`Imposta ${addr.label || 'indirizzo'} come predefinito`}
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeAddress(addr.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Rimuovi"
                  aria-label={`Rimuovi ${addr.label || 'indirizzo'}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {addresses.length === 0 && (
          <p className="text-center text-gray-400 py-8 text-sm">Nessun indirizzo salvato</p>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: ORDER HISTORY
   ================================================================ */

type OrderStatus = 'in_attesa' | 'confermato' | 'spedito' | 'consegnato';

interface Order {
  id: string;
  number: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: { name: string; qty: number; price: number }[];
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  in_attesa: { label: 'In attesa', className: 'bg-yellow-100 text-yellow-800' },
  confermato: { label: 'Confermato', className: 'bg-blue-100 text-blue-800' },
  spedito: { label: 'Spedito', className: 'bg-purple-100 text-purple-800' },
  consegnato: { label: 'Consegnato', className: 'bg-green-100 text-green-800' },
};

const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1', number: 'ORD-2024-001', date: '2024-12-15', status: 'consegnato', total: 3450.00,
    items: [
      { name: 'Forno Combinato Professionale', qty: 1, price: 2890.00 },
      { name: 'Kit Teglie GN 1/1', qty: 4, price: 140.00 },
    ],
  },
  {
    id: 'ord-2', number: 'ORD-2025-002', date: '2025-01-20', status: 'spedito', total: 1280.00,
    items: [
      { name: 'Lavastoviglie a Cappotta', qty: 1, price: 1280.00 },
    ],
  },
  {
    id: 'ord-3', number: 'ORD-2025-003', date: '2025-02-10', status: 'confermato', total: 567.50,
    items: [
      { name: 'Tavolo Refrigerato 2 Porte', qty: 1, price: 520.00 },
      { name: 'Termometro Digitale HACCP', qty: 1, price: 47.50 },
    ],
  },
  {
    id: 'ord-4', number: 'ORD-2025-004', date: '2025-02-14', status: 'in_attesa', total: 890.00,
    items: [
      { name: 'Planetaria 20L', qty: 1, price: 890.00 },
    ],
  },
];

function OrderHistorySection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchOrder, setSearchOrder] = useState('');

  const filteredOrders = useMemo(
    () =>
      MOCK_ORDERS.filter((order) => {
        const byStatus = statusFilter === 'all' || order.status === statusFilter;
        const bySearch = order.number.toLowerCase().includes(searchOrder.trim().toLowerCase());
        return byStatus && bySearch;
      }),
    [searchOrder, statusFilter],
  );

  const exportOrdersCsv = () => {
    const header = 'numero,data,stato,totale';
    const rows = filteredOrders.map((order) =>
      [order.number, order.date, STATUS_CONFIG[order.status].label, order.total.toFixed(2)].join(','),
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ordini-account.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Export ordini completato');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Storico Ordini</h1>
          <p className="mt-1 text-base text-gray-600">
            Filtra ordini per stato e cerca rapidamente un numero ordine.
          </p>
        </div>
        <button
          type="button"
          onClick={exportOrdersCsv}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-100"
        >
          <Download className="h-4 w-4" />
          Esporta CSV
        </button>
      </div>

      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-[1fr,220px]">
        <input
          type="text"
          value={searchOrder}
          onChange={(event) => setSearchOrder(event.target.value)}
          placeholder="Cerca numero ordine (es. ORD-2025-003)"
          className="min-h-11 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          aria-label="Cerca numero ordine"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as OrderStatus | 'all')}
          className="min-h-11 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          aria-label="Filtra ordini per stato"
        >
          <option value="all">Tutti gli stati</option>
          <option value="in_attesa">In attesa</option>
          <option value="confermato">Confermato</option>
          <option value="spedito">Spedito</option>
          <option value="consegnato">Consegnato</option>
        </select>
      </div>

      <div className="space-y-3">
        {filteredOrders.map((order) => {
          const expanded = expandedId === order.id;
          const statusCfg = STATUS_CONFIG[order.status];
          return (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedId(expanded ? null : order.id)}
                aria-expanded={expanded}
                aria-controls={`order-details-${order.id}`}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-gray-900 text-sm">{order.number}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCfg.className}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatDate(order.date)}
                  </p>
                </div>
                <span className="font-bold text-gray-900 text-sm whitespace-nowrap">
                  {formatEuro(order.total)}
                </span>
                {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>

              {expanded && (
                <div id={`order-details-${order.id}`} className="border-t border-gray-100 px-4 py-3 bg-gray-50 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toast.success(`Riordino avviato per ${order.number}`)}
                      className="min-h-11 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                    >
                      Riordina
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.success(`Download fattura per ${order.number}`)}
                      className="min-h-11 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-100 transition-colors"
                    >
                      Scarica fattura
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.success(`Tracking spedizione per ${order.number}`)}
                      className="min-h-11 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-100 transition-colors"
                    >
                      Traccia spedizione
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <caption className="sr-only">Dettaglio prodotti ordine {order.number}</caption>
                      <thead>
                        <tr className="text-xs text-gray-500">
                          <th scope="col" className="text-left pb-2 font-medium">Prodotto</th>
                          <th scope="col" className="text-center pb-2 font-medium">Qta</th>
                          <th scope="col" className="text-right pb-2 font-medium">Prezzo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, i) => (
                          <tr key={i} className="border-t border-gray-200">
                            <td className="py-2 text-gray-700">{item.name}</td>
                            <td className="py-2 text-center text-gray-500">{item.qty}</td>
                            <td className="py-2 text-right font-medium text-gray-900">
                              {formatEuro(item.price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filteredOrders.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
            Nessun ordine trovato con i filtri selezionati.
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: INVOICES (stub)
   ================================================================ */

function InvoicesSection() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pagata' | 'In attesa'>('all');
  const invoices = useMemo(
    () => MOCK_INVOICES.filter((invoice) => statusFilter === 'all' || invoice.status === statusFilter),
    [statusFilter],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fatture</h1>
        <p className="mt-1 text-base text-gray-600">Consulta lo storico fatture e scarica i PDF fiscali.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <label htmlFor="account-invoices-status" className="block text-sm font-medium text-gray-700 mb-2">
          Filtra per stato
        </label>
        <select
          id="account-invoices-status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as 'all' | 'Pagata' | 'In attesa')}
          className="min-h-11 w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="all">Tutti gli stati</option>
          <option value="Pagata">Pagata</option>
          <option value="In attesa">In attesa</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <caption className="sr-only">Elenco fatture account</caption>
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="text-left px-4 py-3 font-semibold text-gray-600">Numero</th>
                <th scope="col" className="text-left px-4 py-3 font-semibold text-gray-600">Data</th>
                <th scope="col" className="text-right px-4 py-3 font-semibold text-gray-600">Importo</th>
                <th scope="col" className="text-center px-4 py-3 font-semibold text-gray-600">Stato</th>
                <th scope="col" className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{inv.number}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(inv.date)}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatEuro(inv.amount)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${inv.status === 'Pagata' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => toast.success(`Download PDF ${inv.number}`)}
                      className="min-h-11 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-semibold text-green-800 hover:bg-green-100"
                    >
                      Scarica PDF
                    </button>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                    Nessuna fattura disponibile con questo filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: PAYMENTS
   ================================================================ */

interface SavedCard {
  id: string;
  holder: string;
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
}

function PaymentsSection() {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [stripeKey, setStripeKey] = useState(() => {
    const current = getStripePublishableKey();
    return current === 'pk_test_INSERISCI_QUI_LA_TUA_PUBLISHABLE_KEY' ? '' : current;
  });
  const [stripeSecretKey, setStripeSecretKey] = useState(() => getStripeSecretKeyForLocalDev());
  const [form, setForm] = useState({
    holder: '',
    brand: 'Visa',
    last4: '',
    expMonth: '',
    expYear: '',
  });
  const [stripeError, setStripeError] = useState('');
  const [stripeSecretError, setStripeSecretError] = useState('');
  const [cardError, setCardError] = useState('');
  const maskedStripeKey = stripeKey.length > 12 ? `${stripeKey.slice(0, 10)}...${stripeKey.slice(-4)}` : stripeKey || 'Non configurata';
  const maskedStripeSecretKey = stripeSecretKey.length > 12
    ? `${stripeSecretKey.slice(0, 8)}...${stripeSecretKey.slice(-4)}`
    : stripeSecretKey || 'Non configurata';

  const resetStripeKey = () => {
    resetStripePublishableKey();
    resetStripeSecretKeyForLocalDev();
    setStripeKey('');
    setStripeSecretKey('');
    setStripeError('');
    setStripeSecretError('');
    toast.success('Configurazione Stripe ripristinata');
  };

  const saveCard = () => {
    setStripeError('');
    setCardError('');

    if (!stripeKey.trim() || !stripeKey.startsWith('pk_')) {
      setStripeError('Inserisci una chiave Stripe publishable valida (pk_...)');
      return;
    }
    if (stripeSecretKey.trim() && !stripeSecretKey.trim().startsWith('sk_')) {
      setStripeSecretError('La secret key deve iniziare con sk_.');
      return;
    }

    const monthNum = Number(form.expMonth);
    if (
      !form.holder.trim()
      || !/^\d{4}$/.test(form.last4)
      || !/^\d{2}$/.test(form.expMonth)
      || !/^\d{2}$/.test(form.expYear)
      || Number.isNaN(monthNum)
      || monthNum < 1
      || monthNum > 12
    ) {
      setCardError('Completa i dati carta con formato corretto.');
      return;
    }

    persistStripePublishableKey(stripeKey.trim());
    if (stripeSecretKey.trim()) {
      persistStripeSecretKeyForLocalDev(stripeSecretKey.trim());
    }

    setCards((prev) => [
      {
        id: `card-${Date.now()}`,
        holder: form.holder.trim(),
        brand: form.brand,
        last4: form.last4,
        expMonth: form.expMonth,
        expYear: form.expYear,
      },
      ...prev,
    ]);

    setForm({
      holder: '',
      brand: 'Visa',
      last4: '',
      expMonth: '',
      expYear: '',
    });
    setShowAddCard(false);
    setCardError('');
    toast.success('Carta aggiunta e pagamenti Stripe configurati');
  };

  const removeCard = (cardId: string) => {
    setCards((prev) => prev.filter((card) => card.id !== cardId));
    toast.success('Carta rimossa');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestione Pagamenti</h1>
        <p className="mt-1 text-base text-gray-600">
          Configura Stripe, salva carte e mantieni il checkout sempre operativo.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
              <Settings className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Stato configurazione Stripe</p>
              <p className="text-sm text-gray-600">Key attiva: {maskedStripeKey}</p>
              <p className="text-sm text-gray-600">Secret locale: {maskedStripeSecretKey}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={resetStripeKey}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-100"
          >
            <RotateCcw className="h-4 w-4" />
            Reset key
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowAddCard((prev) => !prev)}
          className="flex min-h-11 items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {showAddCard ? 'Chiudi form carta' : 'Aggiungi carta'}
        </button>
      </div>

      {showAddCard && (
        <div className="bg-white rounded-2xl border border-green-200 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900">Nuova carta di pagamento</h3>
          <p className="text-sm text-gray-600">
            La configurazione Stripe è disponibile solo qui, durante l&apos;aggiunta di una nuova carta.
          </p>

          <div>
            <label htmlFor="account-stripe-key" className="block text-sm font-medium text-gray-700 mb-1">Stripe Publishable Key (pk_...)</label>
            <input
              id="account-stripe-key"
              type="text"
              value={stripeKey}
              onChange={(event) => {
                setStripeKey(event.target.value);
                if (stripeError) setStripeError('');
              }}
              aria-invalid={Boolean(stripeError)}
              aria-describedby={stripeError ? 'account-stripe-key-error' : 'account-stripe-key-help'}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm ${stripeError ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="pk_test_..."
            />
            {!stripeError && (
              <p id="account-stripe-key-help" className="mt-1 text-xs text-gray-500">
                Inserisci la publishable key Stripe in formato pk_...
              </p>
            )}
            {stripeError && <p id="account-stripe-key-error" className="mt-1 text-xs text-red-600">{stripeError}</p>}
          </div>

          <div>
            <label htmlFor="account-stripe-secret-key" className="block text-sm font-medium text-gray-700 mb-1">
              Stripe Secret Key (sk_...) - solo sviluppo locale
            </label>
            <input
              id="account-stripe-secret-key"
              type="password"
              value={stripeSecretKey}
              onChange={(event) => {
                setStripeSecretKey(event.target.value);
                if (stripeSecretError) setStripeSecretError('');
              }}
              aria-invalid={Boolean(stripeSecretError)}
              aria-describedby={stripeSecretError ? 'account-stripe-secret-key-error' : 'account-stripe-secret-key-help'}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm ${stripeSecretError ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="sk_test_..."
            />
            {!stripeSecretError && (
              <p id="account-stripe-secret-key-help" className="mt-1 text-xs text-amber-700">
                La secret key non viene usata dal frontend nei pagamenti. Serve solo per test locali.
              </p>
            )}
            {stripeSecretError && (
              <p id="account-stripe-secret-key-error" className="mt-1 text-xs text-red-600">{stripeSecretError}</p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="account-card-holder" className="block text-sm font-medium text-gray-700 mb-1">Intestatario carta</label>
              <input
                id="account-card-holder"
                type="text"
                value={form.holder}
                onChange={(event) => setForm((prev) => ({ ...prev, holder: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                placeholder="Nome Cognome"
              />
            </div>
            <div>
              <label htmlFor="account-card-brand" className="block text-sm font-medium text-gray-700 mb-1">Circuito</label>
              <select
                id="account-card-brand"
                value={form.brand}
                onChange={(event) => setForm((prev) => ({ ...prev, brand: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              >
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="American Express">American Express</option>
                <option value="Maestro">Maestro</option>
              </select>
            </div>
            <div>
              <label htmlFor="account-card-last4" className="block text-sm font-medium text-gray-700 mb-1">Ultime 4 cifre</label>
              <input
                id="account-card-last4"
                type="text"
                value={form.last4}
                onChange={(event) => setForm((prev) => ({ ...prev, last4: event.target.value.replace(/\D/g, '').slice(0, 4) }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                placeholder="1234"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="account-card-exp-month" className="block text-sm font-medium text-gray-700 mb-1">Mese</label>
                <input
                  id="account-card-exp-month"
                  type="text"
                  value={form.expMonth}
                  onChange={(event) => setForm((prev) => ({ ...prev, expMonth: event.target.value.replace(/\D/g, '').slice(0, 2) }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                  placeholder="MM"
                />
              </div>
              <div>
                <label htmlFor="account-card-exp-year" className="block text-sm font-medium text-gray-700 mb-1">Anno</label>
                <input
                  id="account-card-exp-year"
                  type="text"
                  value={form.expYear}
                  onChange={(event) => setForm((prev) => ({ ...prev, expYear: event.target.value.replace(/\D/g, '').slice(0, 2) }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                  placeholder="AA"
                />
              </div>
            </div>
          </div>

          {cardError && <p className="text-xs font-medium text-red-600">{cardError}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={saveCard}
              className="min-h-11 bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
            >
              Salva carta
            </button>
            <button
              type="button"
              onClick={() => setShowAddCard(false)}
              className="min-h-11 bg-green-50 text-green-800 border border-green-200 px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
            >
              Annulla
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {cards.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-sm text-gray-500">
            Nessuna carta salvata. Usa "Aggiungi carta" per collegare i pagamenti.
          </div>
        ) : (
          cards.map((card) => (
            <div key={card.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-gray-900">{card.brand} •••• {card.last4}</p>
                <p className="text-xs text-gray-500">
                  {card.holder} - Scadenza {card.expMonth}/{card.expYear}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                <button
                  type="button"
                  onClick={() => removeCard(card.id)}
                  className="min-h-11 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                >
                  Rimuovi
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: QUOTES (stub)
   ================================================================ */

function QuotesSection() {
  const [quotes, setQuotes] = useState(() => MOCK_QUOTES.map((quote) => ({ ...quote })));

  const approveQuote = (quoteId: string) => {
    setQuotes((prev) =>
      prev.map((quote) => (quote.id === quoteId ? { ...quote, status: 'Approvato' } : quote)),
    );
    toast.success('Preventivo convertito in ordine');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Preventivi</h1>
        <p className="mt-1 text-base text-gray-600">
          Monitora scadenze e converti i preventivi approvati in ordini.
        </p>
      </div>
      <div className="space-y-3">
        {quotes.map((q) => (
          <div key={q.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900 text-sm">{q.number}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${q.status === 'Approvato' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {q.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Richiesto il {formatDate(q.date)} - Scade il {formatDate(q.expires)}
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="font-bold text-gray-900">{formatEuro(q.amount)}</span>
                {q.status === 'In attesa' ? (
                  <button
                    type="button"
                    onClick={() => approveQuote(q.id)}
                    className="min-h-11 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                  >
                    Converti in ordine
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => toast.success(`Download PDF ${q.number}`)}
                    className="min-h-11 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-100"
                  >
                    Scarica PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: FAVORITES (stub)
   ================================================================ */

function FavoritesSection() {
  const favoriteLists = [
    { id: 'fav-1', name: 'Cucina sede centrale', items: 12, updatedAt: '2025-02-15' },
    { id: 'fav-2', name: 'Rinnovo attrezzature bar', items: 6, updatedAt: '2025-02-03' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Preferiti</h1>
        <p className="mt-1 text-base text-gray-600">
          Organizza i prodotti in liste riutilizzabili per sedi e riordini rapidi.
        </p>
      </div>

      <div className="grid gap-3">
        {favoriteLists.map((list) => (
          <article key={list.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">{list.name}</h3>
                <p className="text-sm text-gray-500">
                  {list.items} prodotti - Aggiornata il {formatDate(list.updatedAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast.success(`Apertura lista ${list.name}`)}
                className="min-h-11 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-100"
              >
                Apri lista
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center">
        <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600 text-sm">Aggiungi nuovi prodotti dal catalogo per costruire liste dedicate.</p>
        <Link to="/" className="inline-flex min-h-11 items-center mt-4 text-green-700 hover:text-green-800 text-sm font-semibold">
          Sfoglia il catalogo
        </Link>
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: SUPPORT (stub)
   ================================================================ */

function SupportSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assistenza</h1>
        <p className="mt-1 text-base text-gray-600">
          Apri una richiesta o scegli il canale piu rapido per ricevere supporto tecnico e commerciale.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="border border-gray-200 rounded-xl p-4">
            <Phone className="w-5 h-5 text-green-600 mb-2" />
            <p className="font-bold text-gray-900 text-base">Telefono</p>
            <p className="text-sm text-gray-600">+39 0541 620526</p>
            <p className="text-xs text-gray-500 mt-1">Lun-Ven 8:30-18:00</p>
            <a
              href="tel:+390541620526"
              className="mt-3 inline-flex min-h-11 items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Chiama ora
            </a>
          </article>

          <article className="border border-gray-200 rounded-xl p-4">
            <Mail className="w-5 h-5 text-green-600 mb-2" />
            <p className="font-bold text-gray-900 text-base">Email</p>
            <p className="text-sm text-gray-600">assistenza@bianchipro.it</p>
            <p className="text-xs text-gray-500 mt-1">Risposta entro 24h lavorative</p>
            <a
              href="mailto:assistenza@bianchipro.it"
              className="mt-3 inline-flex min-h-11 items-center rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-100"
            >
              Invia email
            </a>
          </article>
        </div>

        <article className="border border-gray-200 rounded-xl p-4">
          <MessageSquare className="w-5 h-5 text-green-600 mb-2" />
          <p className="font-bold text-gray-900 text-base">Apri un ticket</p>
          <p className="text-sm text-gray-600 mb-3">Descrivi il problema e il nostro team ti ricontattera con priorita.</p>
          <Link
            to="/contatti?oggetto=assistenza"
            className="inline-flex min-h-11 items-center rounded-lg bg-green-700 px-5 py-2 text-sm font-bold text-white hover:bg-green-800 transition-colors"
          >
            Nuovo ticket
          </Link>
        </article>
      </div>
    </div>
  );
}

/* ================================================================
   LOGIN PROMPT (shown when user is not authenticated)
   ================================================================ */

function LoginPrompt() {
  const { setAuthModalOpen } = useUI();

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Lock className="w-8 h-8 text-gray-400" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Area Riservata</h1>
      <p className="text-gray-500 mb-6">Accedi al tuo account per gestire ordini, indirizzi e dati aziendali.</p>
      <button
        onClick={() => setAuthModalOpen(true)}
        className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
      >
        Accedi o Registrati
      </button>
    </div>
  );
}

/* ================================================================
   MAIN EXPORT
   ================================================================ */

export default function AccountPage() {
  const { user } = useAuth();

  if (!user) return <LoginPrompt />;
  return <AccountLayout />;
}
