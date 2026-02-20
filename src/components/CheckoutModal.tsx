import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X, CreditCard, Lock, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Link } from 'react-router-dom';
import { STRIPE_CONFIG, getStripePublishableKey } from '../config/stripe';
import { projectId } from '../utils/supabase/info';
import { lockBodyScroll, unlockBodyScroll } from '../utils/bodyScrollLock';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  items: any[];
  customer?: {
    name: string;
    email: string;
    phone: string;
    shippingAddress: string;
  };
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

function CheckoutForm({
  total,
  items,
  customer,
  onClose,
  onSuccess,
}: {
  total: number;
  items: any[];
  customer: {
    name: string;
    email: string;
    phone: string;
    shippingAddress: string;
  };
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!customer.name || !customer.email || !customer.phone) {
      setError('Dati cliente mancanti. Torna al checkout e completa i campi obbligatori.');
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
          receipt_email: customer.email,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setError(confirmError.message || 'Pagamento non riuscito');
        return;
      }

      const data = await postApi('orders', {
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerAddress: customer.shippingAddress,
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
        <h3 className="font-bold text-gray-900 text-lg">Dati cliente</h3>
        <p className="text-sm text-gray-700"><strong>Nome:</strong> {customer.name}</p>
        <p className="text-sm text-gray-700"><strong>Email:</strong> {customer.email}</p>
        <p className="text-sm text-gray-700"><strong>Telefono:</strong> {customer.phone}</p>
        <p className="text-sm text-gray-700"><strong>Indirizzo:</strong> {customer.shippingAddress || 'Non specificato'}</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2"><CreditCard className="w-5 h-5 text-green-700" />Metodo di Pagamento</h3>
        <PaymentElement />
      </div>

      {error && <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3" role="alert"><p className="text-sm font-semibold text-red-800">{error}</p></div>}

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

export default function CheckoutModal({ isOpen, onClose, total, items, customer, onSuccess }: CheckoutModalProps) {
  const normalizedCustomer = customer ?? {
    name: '',
    email: '',
    phone: '',
    shippingAddress: '',
  };
  const [publishableKey, setPublishableKey] = useState(getStripePublishableKey());
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initRequestKeyRef = useRef<string | null>(null);
  const requestIdRef = useRef(0);
  const hasRequiredCustomerData = Boolean(
    normalizedCustomer.name.trim() &&
    normalizedCustomer.email.trim() &&
    normalizedCustomer.phone.trim(),
  );

  /* Blocca lo scroll del body quando il modal è aperto */
  useEffect(() => {
    if (!isOpen) return undefined;

    setPublishableKey(getStripePublishableKey());
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [isOpen]);

  const stripePromise = useMemo(() => {
    if (!publishableKey || publishableKey === 'pk_test_INSERISCI_QUI_LA_TUA_PUBLISHABLE_KEY') return null;
    return loadStripe(publishableKey);
  }, [publishableKey]);

  const initializePayment = useCallback(async () => {
    if (clientSecret) return;
    const requestKey = `${publishableKey}|${total.toFixed(2)}|${normalizedCustomer.email}`;
    if (initRequestKeyRef.current === requestKey) return;

    initRequestKeyRef.current = requestKey;
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const data = await postApi('create-payment-intent', {
        amount: total,
        currency: STRIPE_CONFIG.currency,
        customerEmail: normalizedCustomer.email,
      });
      if (requestId !== requestIdRef.current) return;
      setClientSecret(data.clientSecret);
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return;
      initRequestKeyRef.current = null;
      setError(err.message || 'Impossibile inizializzare il pagamento');
    } finally {
      if (requestId !== requestIdRef.current) return;
      setLoading(false);
    }
  }, [clientSecret, normalizedCustomer.email, publishableKey, total]);

  useEffect(() => {
    if (isOpen) return;
    requestIdRef.current += 1;
    setClientSecret(null);
    setLoading(false);
    setError(null);
    initRequestKeyRef.current = null;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !stripePromise || !hasRequiredCustomerData || clientSecret || loading || error) return;
    void initializePayment();
  }, [clientSecret, error, hasRequiredCustomerData, initializePayment, isOpen, loading, stripePromise]);

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
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
      >
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-4 flex items-center justify-between z-10">
          <h2 id="checkout-modal-title" className="text-2xl font-black text-gray-900">Completa il Pagamento</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" disabled={loading} aria-label="Chiudi pagamento"><X className="w-6 h-6 text-gray-600" /></button>
        </div>

        <div className="p-6">
          {!stripePromise && (
            <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6">
              <h3 className="text-lg font-bold text-orange-900 mb-3">⚠️ Pagamenti non configurati</h3>
              <p className="text-sm text-orange-800 mb-4">
                La chiave Stripe va configurata solo in area account, sezione gestione pagamenti.
              </p>
              <Link
                to="/account/pagamenti"
                className="inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-700"
                onClick={onClose}
              >
                Vai a Gestione Pagamenti
              </Link>
            </div>
          )}

          {stripePromise && !hasRequiredCustomerData && (
            <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6">
              <h3 className="text-lg font-bold text-orange-900 mb-3">Dati cliente incompleti</h3>
              <p className="text-sm text-orange-800 mb-4">
                Per procedere al pagamento completa prima i dati cliente nel checkout.
              </p>
              <Link
                to="/checkout"
                className="inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-700"
                onClick={onClose}
              >
                Vai al checkout
              </Link>
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
              <button
                onClick={() => {
                  setError(null);
                  setClientSecret(null);
                  initRequestKeyRef.current = null;
                  void initializePayment();
                }}
                className="mt-3 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
              >
                Riprova
              </button>
            </div>
          )}

          {stripePromise && clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm total={total} items={items} customer={normalizedCustomer} onClose={onClose} onSuccess={onSuccess} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
