import { useState } from 'react';
import { Link, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { toast } from 'sonner';
import {
  User, Crown, Shield, Mail, Phone, Calendar, LogOut, Wallet,
  ChevronRight, Copy, Check, Building2, MapPin, Package, FileText,
  MessageSquare, Heart, ClipboardList, Plus, Trash2, Star,
  Lock, ChevronDown, ChevronUp,
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
  { to: '/account/preventivi', label: 'Preventivi', icon: ClipboardList },
  { to: '/account/preferiti', label: 'Preferiti', icon: Heart },
  { to: '/account/assistenza', label: 'Assistenza', icon: MessageSquare },
];

function AccountSidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname.startsWith(to);

  const isPro = user?.role === 'pro';
  const isAdmin = user?.role === 'admin';

  const roleConfig: Record<string, { label: string; bg: string }> = {
    client: { label: 'Cliente', bg: 'from-green-500 to-teal-600' },
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
      <nav className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {sidebarLinks.map((link) => {
          const active = isActive(link.to, link.exact);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-gray-100 last:border-b-0 ${
                active
                  ? 'bg-sky-50 text-sky-700 border-l-2 border-l-sky-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <link.icon className={`w-4 h-4 ${active ? 'text-sky-600' : 'text-gray-400'}`} />
              {link.label}
            </Link>
          );
        })}

        {/* Wallet link */}
        <Link
          to="/wallet"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors"
        >
          <Wallet className="w-4 h-4 text-gray-400" />
          Wallet
          <span className="ml-auto text-xs font-bold text-green-600">
            {user?.walletBalance.toFixed(2)} &euro;
          </span>
        </Link>

        {isAdmin && (
          <Link
            to="/admin"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors"
          >
            <Shield className="w-4 h-4 text-gray-400" />
            Pannello Admin
          </Link>
        )}

        {/* Logout */}
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
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
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <AccountSidebar />
        <main className="flex-1 min-w-0">
          <Routes>
            <Route index element={<DashboardSection />} />
            <Route path="profilo" element={<CompanyProfileSection />} />
            <Route path="indirizzi" element={<AddressBookSection />} />
            <Route path="ordini" element={<OrderHistorySection />} />
            <Route path="fatture" element={<InvoicesSection />} />
            <Route path="preventivi" element={<QuotesSection />} />
            <Route path="preferiti" element={<FavoritesSection />} />
            <Route path="assistenza" element={<SupportSection />} />
            <Route path="*" element={<Navigate to="/account" replace />} />
          </Routes>
        </main>
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
    { to: '/wallet', icon: Wallet, label: 'Wallet', desc: `Saldo: ${user.walletBalance.toFixed(2)} \u20ac` },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Bentornato, {user.name.split(' ')[0]}!</h1>

      {/* Info card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Informazioni account</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-semibold text-gray-900">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Telefono</p>
              <p className="text-sm font-semibold text-gray-900">{user.phone || '-'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Registrato il</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          {isPro && user.referralCode && (
            <div className="flex items-center gap-3">
              <Crown className="w-4 h-4 text-amber-500" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Codice Referral</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono font-bold text-amber-700">{user.referralCode}</p>
                  <button onClick={copyReferralCode} className="p-1 hover:bg-gray-100 rounded transition-colors">
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
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
            <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center">
              <ql.icon className="w-5 h-5 text-sky-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm">{ql.label}</p>
              <p className="text-xs text-gray-500">{ql.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: COMPANY PROFILE
   ================================================================ */

function CompanyProfileSection() {
  const { user, updateUser } = useAuth();
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
    if (form.partita_iva && !/^IT\d{11}$/.test(form.partita_iva)) {
      e.partita_iva = 'Formato: IT seguito da 11 cifre (es. IT12345678901)';
    }
    if (form.codice_fiscale && form.codice_fiscale.length !== 16) {
      e.codice_fiscale = 'Il Codice Fiscale deve essere di 16 caratteri';
    }
    if (!usePec && form.codice_destinatario_sdi && form.codice_destinatario_sdi.length !== 7) {
      e.codice_destinatario_sdi = 'Il Codice Destinatario SDI deve essere di 7 caratteri';
    }
    if (usePec && form.pec && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.pec)) {
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
      <h1 className="text-2xl font-bold text-gray-900">Profilo Azienda</h1>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
        {/* Ragione Sociale */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ragione Sociale</label>
          <input
            type="text"
            value={form.ragione_sociale}
            onChange={(e) => setForm(p => ({ ...p, ragione_sociale: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="Es. Mario Rossi S.r.l."
          />
        </div>

        {/* Partita IVA */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Partita IVA</label>
          <input
            type="text"
            value={form.partita_iva}
            onChange={(e) => setForm(p => ({ ...p, partita_iva: e.target.value.toUpperCase() }))}
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${errors.partita_iva ? 'border-red-400' : 'border-gray-300'}`}
            placeholder="IT12345678901"
            maxLength={13}
          />
          {errors.partita_iva && <p className="text-xs text-red-500 mt-1">{errors.partita_iva}</p>}
        </div>

        {/* Codice Fiscale */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Codice Fiscale</label>
          <input
            type="text"
            value={form.codice_fiscale}
            onChange={(e) => setForm(p => ({ ...p, codice_fiscale: e.target.value.toUpperCase() }))}
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${errors.codice_fiscale ? 'border-red-400' : 'border-gray-300'}`}
            placeholder="RSSMRA80A01H501U"
            maxLength={16}
          />
          {errors.codice_fiscale && <p className="text-xs text-red-500 mt-1">{errors.codice_fiscale}</p>}
        </div>

        {/* SDI / PEC toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fatturazione Elettronica</label>
          <div className="flex gap-4 mb-3">
            <button
              onClick={() => setUsePec(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!usePec ? 'bg-sky-100 text-sky-700 ring-1 ring-sky-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Codice SDI
            </button>
            <button
              onClick={() => setUsePec(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${usePec ? 'bg-sky-100 text-sky-700 ring-1 ring-sky-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              PEC
            </button>
          </div>
          {!usePec ? (
            <div>
              <input
                type="text"
                value={form.codice_destinatario_sdi}
                onChange={(e) => setForm(p => ({ ...p, codice_destinatario_sdi: e.target.value.toUpperCase() }))}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${errors.codice_destinatario_sdi ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="0000000"
                maxLength={7}
              />
              {errors.codice_destinatario_sdi && <p className="text-xs text-red-500 mt-1">{errors.codice_destinatario_sdi}</p>}
            </div>
          ) : (
            <div>
              <input
                type="email"
                value={form.pec}
                onChange={(e) => setForm(p => ({ ...p, pec: e.target.value }))}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${errors.pec ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="azienda@pec.it"
              />
              {errors.pec && <p className="text-xs text-red-500 mt-1">{errors.pec}</p>}
            </div>
          )}
        </div>

        {/* Telefono */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="+39 333 123 4567"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="flex items-center gap-2">
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
            />
            <Lock className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-400 mt-1">L'email non puo essere modificata</p>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="w-full sm:w-auto bg-sky-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-sky-700 transition-colors"
        >
          Salva Modifiche
        </button>
      </div>
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
        <h1 className="text-2xl font-bold text-gray-900">Rubrica Indirizzi</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-sky-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Aggiungi
        </button>
      </div>

      {/* New address form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-sky-200 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900">Nuovo indirizzo</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Etichetta</label>
              <input
                type="text"
                value={newAddr.label}
                onChange={(e) => setNewAddr(p => ({ ...p, label: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Es. Sede, Magazzino"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
              <select
                value={newAddr.type}
                onChange={(e) => setNewAddr(p => ({ ...p, type: e.target.value as 'shipping' | 'billing' }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="shipping">Spedizione</option>
                <option value="billing">Fatturazione</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Intestatario</label>
              <input
                type="text"
                value={newAddr.name}
                onChange={(e) => setNewAddr(p => ({ ...p, name: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Ragione Sociale o nome"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Indirizzo *</label>
              <input
                type="text"
                value={newAddr.street}
                onChange={(e) => setNewAddr(p => ({ ...p, street: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Via, numero civico"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Citta *</label>
              <input
                type="text"
                value={newAddr.city}
                onChange={(e) => setNewAddr(p => ({ ...p, city: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Prov.</label>
                <input
                  type="text"
                  value={newAddr.province}
                  onChange={(e) => setNewAddr(p => ({ ...p, province: e.target.value.toUpperCase() }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  maxLength={2}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">CAP *</label>
                <input
                  type="text"
                  value={newAddr.zip}
                  onChange={(e) => setNewAddr(p => ({ ...p, zip: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  maxLength={5}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addAddress} className="bg-sky-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-sky-700 transition-colors">
              Salva Indirizzo
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              Annulla
            </button>
          </div>
        </div>
      )}

      {/* Address list */}
      <div className="space-y-3">
        {addresses.map((addr) => (
          <div key={addr.id} className={`bg-white rounded-xl border p-4 shadow-sm ${addr.isDefault ? 'border-sky-300 ring-1 ring-sky-100' : 'border-gray-200'}`}>
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
                  <button onClick={() => setDefault(addr.id)} className="p-2 text-gray-400 hover:text-sky-600 transition-colors" title="Imposta come predefinito">
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => removeAddress(addr.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Rimuovi">
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Storico Ordini</h1>

      <div className="space-y-3">
        {MOCK_ORDERS.map((order) => {
          const expanded = expandedId === order.id;
          const statusCfg = STATUS_CONFIG[order.status];
          return (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => setExpandedId(expanded ? null : order.id)}
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
                    {new Date(order.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <span className="font-bold text-gray-900 text-sm whitespace-nowrap">
                  {order.total.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                </span>
                {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>

              {expanded && (
                <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-500">
                        <th className="text-left pb-2 font-medium">Prodotto</th>
                        <th className="text-center pb-2 font-medium">Qta</th>
                        <th className="text-right pb-2 font-medium">Prezzo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, i) => (
                        <tr key={i} className="border-t border-gray-200">
                          <td className="py-2 text-gray-700">{item.name}</td>
                          <td className="py-2 text-center text-gray-500">{item.qty}</td>
                          <td className="py-2 text-right font-medium text-gray-900">
                            {item.price.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: INVOICES (stub)
   ================================================================ */

function InvoicesSection() {
  const invoices = [
    { id: 'inv-1', number: 'FT-2024/0042', date: '2024-12-20', amount: 4209.00, status: 'Pagata' },
    { id: 'inv-2', number: 'FT-2025/0005', date: '2025-01-25', amount: 1561.60, status: 'Pagata' },
    { id: 'inv-3', number: 'FT-2025/0011', date: '2025-02-12', amount: 692.35, status: 'In attesa' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Fatture</h1>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Numero</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Data</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Importo</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Stato</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-900">{inv.number}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(inv.date).toLocaleDateString('it-IT')}</td>
                <td className="px-4 py-3 text-right font-medium">{inv.amount.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${inv.status === 'Pagata' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-sky-600 hover:text-sky-700 text-xs font-medium">
                    Scarica PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: QUOTES (stub)
   ================================================================ */

function QuotesSection() {
  const quotes = [
    { id: 'qt-1', number: 'PRV-2025/003', date: '2025-02-01', amount: 12500.00, status: 'In attesa', expires: '2025-03-01' },
    { id: 'qt-2', number: 'PRV-2025/001', date: '2025-01-10', amount: 8200.00, status: 'Approvato', expires: '2025-02-10' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Preventivi</h1>
      <div className="space-y-3">
        {quotes.map((q) => (
          <div key={q.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900 text-sm">{q.number}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${q.status === 'Approvato' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {q.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Richiesto il {new Date(q.date).toLocaleDateString('it-IT')} &middot; Scade il {new Date(q.expires).toLocaleDateString('it-IT')}
                </p>
              </div>
              <span className="font-bold text-gray-900">
                {q.amount.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
              </span>
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
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Preferiti</h1>
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center">
        <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">I tuoi prodotti preferiti appariranno qui.</p>
        <Link to="/" className="inline-block mt-4 text-sky-600 hover:text-sky-700 text-sm font-medium">
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
      <h1 className="text-2xl font-bold text-gray-900">Assistenza</h1>
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <p className="text-sm text-gray-600">
          Hai bisogno di aiuto? Contattaci tramite uno dei seguenti canali:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-xl p-4">
            <Phone className="w-5 h-5 text-sky-600 mb-2" />
            <p className="font-bold text-gray-900 text-sm">Telefono</p>
            <p className="text-sm text-gray-500">+39 035 123 4567</p>
            <p className="text-xs text-gray-400 mt-1">Lun-Ven 8:30-18:00</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <Mail className="w-5 h-5 text-sky-600 mb-2" />
            <p className="font-bold text-gray-900 text-sm">Email</p>
            <p className="text-sm text-gray-500">assistenza@bianchipro.it</p>
            <p className="text-xs text-gray-400 mt-1">Risposta entro 24h</p>
          </div>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <MessageSquare className="w-5 h-5 text-sky-600 mb-2" />
          <p className="font-bold text-gray-900 text-sm">Apri un ticket</p>
          <p className="text-sm text-gray-500 mb-3">Descrivi il tuo problema e ti ricontatteremo al piu presto.</p>
          <button className="bg-sky-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-sky-700 transition-colors">
            Nuovo Ticket
          </button>
        </div>
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
        className="bg-sky-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-sky-700 transition-colors"
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
