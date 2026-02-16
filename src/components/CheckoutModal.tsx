import { useEffect, useMemo, useState } from 'react';
import { X, CreditCard, Lock, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { STRIPE_CONFIG, getStripePublishableKey, persistStripePublishableKey } from '../config/stripe';
import { projectId } from '../utils/supabase/info';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  items: any[];
  onSuccess: (orderId: string) => void;
}

function apiCandidates(path: string) {
  return [
    `/api/${path}`,
    `https://${projectId}.supabase.co/functions/v1/make-server-d9742687/${path}`,
  ];
}

async function postApi(path: string, payload: unknown) {
  let lastError = 'Errore API';
  for (const url of apiCandidates(path)) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) return data;
      lastError = data.error || data.details || lastError;
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError;
    }
  }
  throw new Error(lastError);
}

function CheckoutForm({ total, items, onClose, onSuccess }: { total: number; items: any[]; onClose: () => void; onSuccess: (orderId: string) => void; }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!customerName || !customerEmail || !customerPhone) {
      setError('Compila tutti i campi obbligatori');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: submitError, paymentIntent } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Errore durante il pagamento');
        return;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
          receipt_email: customerEmail,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setError(confirmError.message || 'Pagamento non riuscito');
        return;
      }

      const data = await postApi('orders', {
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        items,
        total,
        paymentIntentId: paymentIntent?.id,
      });

      onSuccess(data.orderId);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Errore durante il checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h3 className="font-bold text-gray-900 text-lg">Dati di Fatturazione</h3>
        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-base" placeholder="Nome e Cognome *" required />
        <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-base" placeholder="Email *" required />
        <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-base" placeholder="Telefono *" required />
        <textarea value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-base resize-none" placeholder="Indirizzo di spedizione" rows={2} />
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2"><CreditCard className="w-5 h-5 text-green-700" />Metodo di Pagamento</h3>
        <PaymentElement />
      </div>

      {error && <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3"><p className="text-sm font-semibold text-red-800">{error}</p></div>}

      <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-900">Totale da pagare:</span>
          <span className="text-2xl font-black text-green-700">€ {total.toFixed(2)}</span>
        </div>
        <button type="submit" disabled={!stripe || loading} className="w-full bg-green-700 text-white font-black text-lg py-4 rounded-xl hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg">
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Elaborazione...</> : <><Lock className="w-5 h-5" /> PAGA ORA € {total.toFixed(2)}</>}
        </button>
        <p className="text-xs text-gray-600 text-center mt-2">🔒 Pagamento sicuro protetto da Stripe</p>
      </div>
    </form>
  );
}

export default function CheckoutModal({ isOpen, onClose, total, items, onSuccess }: CheckoutModalProps) {
  const [publishableKey, setPublishableKey] = useState(getStripePublishableKey());
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localKeyInput, setLocalKeyInput] = useState('');

  /* Blocca lo scroll del body quando il modal è aperto */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const stripePromise = useMemo(() => {
    if (!publishableKey || publishableKey === 'pk_test_INSERISCI_QUI_LA_TUA_PUBLISHABLE_KEY') return null;
    return loadStripe(publishableKey);
  }, [publishableKey]);

  const initializePayment = async () => {
    if (clientSecret) return;
    setLoading(true);
    setError(null);
    try {
      const data = await postApi('create-payment-intent', { amount: total, currency: STRIPE_CONFIG.currency });
      setClientSecret(data.clientSecret);
    } catch (err: any) {
      setError(err.message || 'Impossibile inizializzare il pagamento');
    } finally {
      setLoading(false);
    }
  };

  if (isOpen && !clientSecret && !loading && !error) initializePayment();
  if (!isOpen) return null;

  const options = {
    clientSecret: clientSecret || undefined,
    appearance: {
      theme: 'stripe' as const,
      variables: { colorPrimary: '#16a34a', colorText: '#1f2937', fontFamily: 'system-ui, sans-serif', borderRadius: '0.75rem' },
    },
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-black text-gray-900">Completa il Pagamento</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" disabled={loading}><X className="w-6 h-6 text-gray-600" /></button>
        </div>

        <div className="p-6">
          {!stripePromise && (
            <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6">
              <h3 className="text-lg font-bold text-orange-900 mb-3">⚠️ Publishable Key Non Configurata</h3>
              <p className="text-sm text-orange-800 mb-4">Inserisci la Publishable key (pk_test...) per abilitare i pagamenti.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" value={localKeyInput} onChange={(event) => setLocalKeyInput(event.target.value)} placeholder="pk_test_..." className="flex-1 px-3 py-2 text-sm border border-orange-200 rounded-md" />
                <button type="button" onClick={() => { if (!localKeyInput.trim()) return; persistStripePublishableKey(localKeyInput.trim()); setPublishableKey(localKeyInput.trim()); }} className="px-4 py-2 text-sm font-bold text-white bg-orange-600 rounded-md hover:bg-orange-700">Salva chiave</button>
              </div>
            </div>
          )}

          {stripePromise && loading && !clientSecret && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-green-700 animate-spin mb-4" />
              <p className="text-lg font-semibold text-gray-700">Inizializzazione pagamento...</p>
            </div>
          )}

          {stripePromise && error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-red-800">{error}</p>
              <button onClick={() => { setError(null); setClientSecret(null); initializePayment(); }} className="mt-3 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">Riprova</button>
            </div>
          )}

          {stripePromise && clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm total={total} items={items} onClose={onClose} onSuccess={onSuccess} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
