import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Check, CreditCard, Building2, FileText } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

type CheckoutStep = 'dati' | 'indirizzi' | 'pagamento' | 'riepilogo';

const steps: { key: CheckoutStep; label: string; icon: React.ReactNode }[] = [
  { key: 'dati', label: 'Dati Aziendali', icon: <Building2 className="w-4 h-4" /> },
  { key: 'indirizzi', label: 'Indirizzi', icon: <FileText className="w-4 h-4" /> },
  { key: 'pagamento', label: 'Pagamento', icon: <CreditCard className="w-4 h-4" /> },
  { key: 'riepilogo', label: 'Riepilogo', icon: <Check className="w-4 h-4" /> },
];

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('dati');

  // Form state
  const [ragioneSociale, setRagioneSociale] = useState('');
  const [partitaIva, setPartitaIva] = useState('');
  const [codiceFiscale, setCodiceFiscale] = useState('');
  const [codiceSDI, setCodiceSDI] = useState('0000000');
  const [pec, setPec] = useState('');
  const [usePec, setUsePec] = useState(false);
  const [telefono, setTelefono] = useState('');

  // Address state
  const [shippingAddress, setShippingAddress] = useState({ via: '', citta: '', cap: '', provincia: '' });
  const [billingAddress, setBillingAddress] = useState({ via: '', citta: '', cap: '', provincia: '' });
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bonifico' | 'noleggio'>('card');

  const totalNet = totalPrice;
  const totalVat = totalNet * 0.22;
  const totalGross = totalNet + totalVat;

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  const validatePartitaIva = (piva: string) => {
    const cleaned = piva.replace(/^IT/i, '').replace(/\s/g, '');
    return /^\d{11}$/.test(cleaned);
  };

  if (items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Carrello vuoto</h1>
        <p className="text-gray-600 mb-6">Aggiungi prodotti prima di procedere al checkout.</p>
        <Link to="/" className="px-6 py-3 bg-green-700 text-white font-bold rounded-xl hover:bg-green-700">
          Torna al catalogo
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 mb-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-10">
        {steps.map((step, i) => (
          <div key={step.key} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
              i === currentStepIndex
                ? 'bg-green-700 text-white'
                : i < currentStepIndex
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-400'
            }`}>
              {step.icon}
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300" />}
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,350px]">
        {/* Step Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {currentStep === 'dati' && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-6">Dati Aziendali</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ragione Sociale *</label>
                  <input type="text" value={ragioneSociale} onChange={e => setRagioneSociale(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                    placeholder="Es. Ristorante Da Mario S.r.l." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Partita IVA *</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-600 font-medium">IT</span>
                    <input type="text" value={partitaIva} onChange={e => setPartitaIva(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                      placeholder="12345678901" maxLength={11} />
                  </div>
                  {partitaIva && !validatePartitaIva(partitaIva) && (
                    <p className="text-xs text-red-500 mt-1">La Partita IVA deve contenere 11 cifre</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Codice Fiscale</label>
                  <input type="text" value={codiceFiscale} onChange={e => setCodiceFiscale(e.target.value.toUpperCase().slice(0, 16))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                    placeholder="RSSMRA80A01H501U" maxLength={16} />
                </div>

                {/* SDI / PEC Toggle */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-3">Fatturazione Elettronica</p>
                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={!usePec} onChange={() => setUsePec(false)}
                        className="text-green-700 focus:ring-green-600" />
                      <span className="text-sm font-medium">Codice Destinatario</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={usePec} onChange={() => setUsePec(true)}
                        className="text-green-700 focus:ring-green-600" />
                      <span className="text-sm font-medium">PEC</span>
                    </label>
                  </div>
                  {!usePec ? (
                    <div>
                      <input type="text" value={codiceSDI} onChange={e => setCodiceSDI(e.target.value.toUpperCase().slice(0, 7))}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                        placeholder="0000000" maxLength={7} />
                      <p className="text-xs text-blue-700 mt-1">7 caratteri alfanumerici. Usa 0000000 se non conosci il tuo codice.</p>
                    </div>
                  ) : (
                    <input type="email" value={pec} onChange={e => setPec(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                      placeholder="azienda@pec.it" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefono *</label>
                  <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                    placeholder="+39 02 1234567" />
                </div>
              </div>
              <button onClick={() => setCurrentStep('indirizzi')}
                className="mt-6 w-full py-3 bg-green-700 text-white font-bold rounded-xl hover:bg-green-700 transition-colors">
                Continua
              </button>
            </div>
          )}

          {currentStep === 'indirizzi' && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-6">Indirizzo di Spedizione</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Via e numero civico *</label>
                  <input type="text" value={shippingAddress.via} onChange={e => setShippingAddress(p => ({ ...p, via: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Città *</label>
                    <input type="text" value={shippingAddress.citta} onChange={e => setShippingAddress(p => ({ ...p, citta: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CAP *</label>
                      <input type="text" value={shippingAddress.cap} onChange={e => setShippingAddress(p => ({ ...p, cap: e.target.value.slice(0, 5) }))}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600" maxLength={5} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prov. *</label>
                      <input type="text" value={shippingAddress.provincia} onChange={e => setShippingAddress(p => ({ ...p, provincia: e.target.value.toUpperCase().slice(0, 2) }))}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600" maxLength={2} />
                    </div>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 mt-6 cursor-pointer">
                <input type="checkbox" checked={sameAsShipping} onChange={e => setSameAsShipping(e.target.checked)}
                  className="rounded text-green-700 focus:ring-green-600" />
                <span className="text-sm font-medium text-gray-700">Indirizzo di fatturazione uguale a quello di spedizione</span>
              </label>

              {!sameAsShipping && (
                <div className="mt-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Indirizzo di Fatturazione</h2>
                  <div className="space-y-4">
                    <input type="text" value={billingAddress.via} onChange={e => setBillingAddress(p => ({ ...p, via: e.target.value }))}
                      placeholder="Via e numero civico"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600" />
                    <div className="grid grid-cols-3 gap-4">
                      <input type="text" value={billingAddress.citta} onChange={e => setBillingAddress(p => ({ ...p, citta: e.target.value }))}
                        placeholder="Città" className="px-4 py-2.5 border border-gray-300 rounded-lg" />
                      <input type="text" value={billingAddress.cap} onChange={e => setBillingAddress(p => ({ ...p, cap: e.target.value.slice(0, 5) }))}
                        placeholder="CAP" maxLength={5} className="px-4 py-2.5 border border-gray-300 rounded-lg" />
                      <input type="text" value={billingAddress.provincia} onChange={e => setBillingAddress(p => ({ ...p, provincia: e.target.value.toUpperCase().slice(0, 2) }))}
                        placeholder="Prov." maxLength={2} className="px-4 py-2.5 border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setCurrentStep('dati')}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50">
                  Indietro
                </button>
                <button onClick={() => setCurrentStep('pagamento')}
                  className="flex-1 py-3 bg-green-700 text-white font-bold rounded-xl hover:bg-green-700">
                  Continua
                </button>
              </div>
            </div>
          )}

          {currentStep === 'pagamento' && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-6">Metodo di Pagamento</h2>
              <div className="space-y-3">
                {([
                  { key: 'card', label: 'Carta di Credito / Debito', desc: 'Visa, Mastercard, American Express' },
                  { key: 'bonifico', label: 'Bonifico Bancario', desc: 'Riceverai i dati bancari via email' },
                  { key: 'noleggio', label: 'Noleggio Operativo', desc: 'Rate mensili senza anticipo' },
                ] as const).map(pm => (
                  <label key={pm.key} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    paymentMethod === pm.key ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input type="radio" name="payment" checked={paymentMethod === pm.key} onChange={() => setPaymentMethod(pm.key)}
                      className="mt-0.5 text-green-700 focus:ring-green-600" />
                    <div>
                      <p className="font-semibold text-gray-900">{pm.label}</p>
                      <p className="text-sm text-gray-500">{pm.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setCurrentStep('indirizzi')}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50">
                  Indietro
                </button>
                <button onClick={() => setCurrentStep('riepilogo')}
                  className="flex-1 py-3 bg-green-700 text-white font-bold rounded-xl hover:bg-green-700">
                  Continua
                </button>
              </div>
            </div>
          )}

          {currentStep === 'riepilogo' && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-6">Riepilogo Ordine</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Dati Aziendali</p>
                  <p className="text-sm text-gray-600">{ragioneSociale}</p>
                  <p className="text-sm text-gray-600">P.IVA: IT{partitaIva}</p>
                  {!usePec ? (
                    <p className="text-sm text-gray-600">SDI: {codiceSDI}</p>
                  ) : (
                    <p className="text-sm text-gray-600">PEC: {pec}</p>
                  )}
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Spedizione</p>
                  <p className="text-sm text-gray-600">{shippingAddress.via}, {shippingAddress.cap} {shippingAddress.citta} ({shippingAddress.provincia})</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Pagamento</p>
                  <p className="text-sm text-gray-600">{paymentMethod === 'card' ? 'Carta di Credito' : paymentMethod === 'bonifico' ? 'Bonifico Bancario' : 'Noleggio Operativo'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Prodotti</p>
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm py-1">
                      <span className="text-gray-600">{item.name} × {item.quantity}</span>
                      <span className="font-medium">€ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setCurrentStep('pagamento')}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50">
                  Indietro
                </button>
                <button className="flex-1 py-3 bg-green-700 text-white font-bold rounded-xl hover:bg-green-700">
                  Conferma Ordine
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit sticky top-24">
          <h3 className="font-bold text-gray-900 mb-4">Totale</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Subtotale (ex IVA)</span><span>€ {totalNet.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">IVA (22%)</span><span>€ {totalVat.toFixed(2)}</span></div>
            <div className="h-px bg-gray-200 my-2" />
            <div className="flex justify-between text-lg"><span className="font-bold">Totale</span><span className="font-extrabold">€ {totalGross.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </main>
  );
}
