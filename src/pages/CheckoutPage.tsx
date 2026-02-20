import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  ChevronRight,
  CreditCard,
  Building2,
  FileText,
  Truck,
  ArrowLeft,
  ArrowRight,
  Landmark,
  RotateCcw,
  Settings,
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { createOrderRecord } from '../lib/storefrontStore';
import {
  getStripePublishableKey,
  getStripeSecretKeyForLocalDev,
  isStripeConfigured,
  persistStripePublishableKey,
  persistStripeSecretKeyForLocalDev,
  resetStripePublishableKey,
  resetStripeSecretKeyForLocalDev,
} from '../config/stripe';
import {
  validateEmail,
  validatePhone,
  validatePartitaIVA,
  validateCodiceFiscale,
  validateCAP,
  validateProvincia,
} from '../lib/validation';
import CheckoutModal from '../components/CheckoutModal';
import { toast } from 'sonner';

type CheckoutStep = 'riepilogo' | 'dati' | 'spedizione' | 'pagamento' | 'conferma';

type PaymentMethod = 'card' | 'bank_transfer';

type ShippingMethod = 'standard' | 'express';

const steps: Array<{ key: CheckoutStep; label: string; icon: React.ReactNode }> = [
  { key: 'riepilogo', label: 'Carrello', icon: <FileText className="w-4 h-4" /> },
  { key: 'dati', label: 'Dati cliente', icon: <Building2 className="w-4 h-4" /> },
  { key: 'spedizione', label: 'Spedizione', icon: <Truck className="w-4 h-4" /> },
  { key: 'pagamento', label: 'Pagamento', icon: <CreditCard className="w-4 h-4" /> },
  { key: 'conferma', label: 'Conferma', icon: <Check className="w-4 h-4" /> },
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('riepilogo');

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    vatNumber: '',
    fiscalCode: '',
    shippingAddress: '',
    shippingCity: '',
    shippingCap: '',
    shippingProvince: '',
    billingAddress: '',
    billingCity: '',
    billingCap: '',
    billingProvince: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');
  const [billingConfirmed, setBillingConfirmed] = useState(false);
  const [billingConfirmError, setBillingConfirmError] = useState('');
  const [paymentMethodError, setPaymentMethodError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [placingOrder, setPlacingOrder] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [stripeOpen, setStripeOpen] = useState(false);
  const [stripeSettingsOpen, setStripeSettingsOpen] = useState(false);
  const [stripeConfigured, setStripeConfigured] = useState(() => isStripeConfigured());
  const [stripePublishableKey, setStripePublishableKey] = useState(() => {
    const current = getStripePublishableKey();
    return current === 'pk_test_INSERISCI_QUI_LA_TUA_PUBLISHABLE_KEY' ? '' : current;
  });
  const [stripeSecretKey, setStripeSecretKey] = useState(() => getStripeSecretKeyForLocalDev());
  const [stripeSettingsError, setStripeSettingsError] = useState('');

  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);

  const goToCompletedStep = (stepKey: CheckoutStep) => {
    const targetIndex = steps.findIndex((step) => step.key === stepKey);
    if (targetIndex < 0 || targetIndex > currentStepIndex) return;
    setCurrentStep(stepKey);
  };

  const shippingCost = shippingMethod === 'express' ? 49 : 24;
  const totalNet = totalPrice;
  const totalVat = (totalNet + shippingCost) * 0.22;
  const totalGross = totalNet + shippingCost + totalVat;

  const checkoutItems = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        image: item.image,
      })),
    [items],
  );

  const checkoutCustomer = useMemo(
    () => ({
      name: customer.name.trim(),
      email: customer.email.trim(),
      phone: customer.phone.trim(),
      shippingAddress: customer.shippingAddress.trim(),
    }),
    [customer.email, customer.name, customer.phone, customer.shippingAddress],
  );

  useEffect(() => {
    if (currentStep !== 'pagamento') return;
    const current = getStripePublishableKey();
    setStripeConfigured(isStripeConfigured());
    setStripePublishableKey(current === 'pk_test_INSERISCI_QUI_LA_TUA_PUBLISHABLE_KEY' ? '' : current);
    setStripeSecretKey(getStripeSecretKeyForLocalDev());
    setStripeSettingsError('');
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== 'spedizione') {
      setBillingConfirmError('');
    }
    if (currentStep !== 'pagamento') {
      setPaymentMethodError('');
    }
  }, [currentStep]);
  const maskedStripeKey = useMemo(() => {
    if (!stripePublishableKey) return 'Non configurata';
    if (stripePublishableKey.length < 14) return stripePublishableKey;
    return `${stripePublishableKey.slice(0, 8)}...${stripePublishableKey.slice(-4)}`;
  }, [stripePublishableKey]);
  const maskedStripeSecretKey = useMemo(() => {
    if (!stripeSecretKey) return 'Non configurata';
    if (stripeSecretKey.length < 14) return stripeSecretKey;
    return `${stripeSecretKey.slice(0, 8)}...${stripeSecretKey.slice(-4)}`;
  }, [stripeSecretKey]);

  if (items.length === 0) {
    return (
      <main className="app-page-shell py-16 text-center">
        <h1 className="app-page-title text-2xl font-bold text-gray-900 mb-4">Carrello vuoto</h1>
        <p className="app-page-subtitle text-gray-600 mb-6">Aggiungi prodotti prima di procedere al checkout.</p>
        <Link to="/" className="app-action-primary px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Torna al catalogo
        </Link>
      </main>
    );
  }

  const setCustomerValue = (field: keyof typeof customer, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const fieldId = (field: keyof typeof customer) => `checkout-${field}`;
  const fieldErrorId = (field: keyof typeof customer) => `${fieldId(field)}-error`;

  const focusFirstInvalidField = (
    errors: Record<string, string>,
    fieldsInPriorityOrder: Array<keyof typeof customer>,
  ) => {
    if (typeof document === 'undefined') return;

    for (const field of fieldsInPriorityOrder) {
      if (!errors[field]) continue;
      const target = document.getElementById(fieldId(field));
      if (target instanceof HTMLElement) {
        target.focus();
        return;
      }
    }
  };

  const getFieldA11yProps = (field: keyof typeof customer) => ({
    id: fieldId(field),
    'aria-invalid': fieldErrors[field] ? true : undefined,
    'aria-describedby': fieldErrors[field] ? fieldErrorId(field) : undefined,
  });

  const customerStepFields: Array<keyof typeof customer> = ['name', 'email', 'phone', 'vatNumber', 'fiscalCode'];
  const shippingStepFields: Array<keyof typeof customer> = [
    'shippingAddress',
    'shippingCity',
    'shippingCap',
    'shippingProvince',
    'billingAddress',
    'billingCity',
    'billingCap',
    'billingProvince',
  ];

  const customerStepErrorMessages = customerStepFields
    .filter((field) => Boolean(fieldErrors[field]))
    .map((field) => fieldErrors[field]);

  const shippingStepErrorMessages = shippingStepFields
    .filter((field) => Boolean(fieldErrors[field]))
    .map((field) => fieldErrors[field]);

  const validateCustomerStep = () => {
    const nextErrors: Record<string, string> = {};

    if (!customer.name.trim()) nextErrors.name = 'Inserisci nome e cognome.';

    const emailCheck = validateEmail(customer.email);
    if (!emailCheck.valid) nextErrors.email = emailCheck.error || 'Email non valida.';

    const phoneCheck = validatePhone(customer.phone);
    if (!phoneCheck.valid) nextErrors.phone = phoneCheck.error || 'Telefono non valido.';

    if (!customer.vatNumber.trim()) {
      nextErrors.vatNumber = 'La Partita IVA e obbligatoria per completare il checkout B2B.';
    } else {
      const vatCheck = validatePartitaIVA(customer.vatNumber);
      if (!vatCheck.valid) nextErrors.vatNumber = vatCheck.error || 'Partita IVA non valida.';
    }

    if (customer.fiscalCode.trim()) {
      const cfCheck = validateCodiceFiscale(customer.fiscalCode);
      if (!cfCheck.valid) nextErrors.fiscalCode = cfCheck.error || 'Codice fiscale non valido.';
    }

    setFieldErrors(nextErrors);
    const isValid = Object.keys(nextErrors).length === 0;
    if (!isValid) {
      focusFirstInvalidField(nextErrors, customerStepFields);
    }
    return isValid;
  };

  const validateShippingStep = () => {
    const nextErrors: Record<string, string> = {};

    if (!customer.shippingAddress.trim()) nextErrors.shippingAddress = 'Inserisci l\'indirizzo di spedizione.';
    if (!customer.shippingCity.trim()) nextErrors.shippingCity = 'Inserisci la citta.';

    const shippingCapCheck = validateCAP(customer.shippingCap);
    if (!shippingCapCheck.valid) nextErrors.shippingCap = shippingCapCheck.error || 'CAP non valido.';

    const shippingProvinceCheck = validateProvincia(customer.shippingProvince);
    if (!shippingProvinceCheck.valid) {
      nextErrors.shippingProvince = shippingProvinceCheck.error || 'Provincia non valida.';
    }

    if (!billingSameAsShipping) {
      if (!customer.billingAddress.trim()) nextErrors.billingAddress = 'Inserisci l\'indirizzo di fatturazione.';
      if (!customer.billingCity.trim()) nextErrors.billingCity = 'Inserisci la citta di fatturazione.';

      const billingCapCheck = validateCAP(customer.billingCap);
      if (!billingCapCheck.valid) nextErrors.billingCap = billingCapCheck.error || 'CAP non valido.';

      const billingProvinceCheck = validateProvincia(customer.billingProvince);
      if (!billingProvinceCheck.valid) {
        nextErrors.billingProvince = billingProvinceCheck.error || 'Provincia non valida.';
      }
    }

    setFieldErrors(nextErrors);
    const isValid = Object.keys(nextErrors).length === 0;
    if (!isValid) {
      focusFirstInvalidField(nextErrors, shippingStepFields);
    }
    return isValid;
  };

  const goNext = () => {
    if (currentStep === 'riepilogo') {
      setCurrentStep('dati');
      return;
    }

    if (currentStep === 'dati') {
      if (!validateCustomerStep()) return;
      setCurrentStep('spedizione');
      return;
    }

    if (currentStep === 'spedizione') {
      if (!validateShippingStep()) return;
      if (!billingConfirmed) {
        setBillingConfirmError('Conferma i dati di fatturazione per procedere al pagamento.');
        toast.error('Conferma i dati di fatturazione prima di continuare.');
        return;
      }
      setBillingConfirmError('');
      setCurrentStep('pagamento');
      return;
    }

    if (currentStep === 'pagamento') {
      if (!paymentMethod) {
        setPaymentMethodError('Seleziona un metodo di pagamento prima di procedere.');
        toast.error('Seleziona un metodo di pagamento.');
        return;
      }
      setPaymentMethodError('');
      if (paymentMethod === 'card') {
        if (!stripeConfigured) {
          toast.error("Configura prima la chiave Stripe con l'icona impostazioni.");
          setStripeSettingsOpen(true);
          return;
        }
        toast.info('Compila i dati della carta nel modulo Stripe sicuro prima di confermare il pagamento.');
        setStripeOpen(true);
        return;
      }
      void handleBankTransferOrder();
    }
  };

  const saveStripeKeyFromCheckout = () => {
    const trimmedKey = stripePublishableKey.trim();
    const trimmedSecret = stripeSecretKey.trim();
    if (!trimmedKey || !trimmedKey.startsWith('pk_')) {
      setStripeSettingsError('La publishable key deve iniziare con pk_.');
      toast.error('Inserisci una chiave Stripe publishable valida (pk_...).');
      return;
    }
    if (trimmedSecret && !trimmedSecret.startsWith('sk_')) {
      setStripeSettingsError('La secret key deve iniziare con sk_ (se valorizzata).');
      toast.error('Inserisci una secret key Stripe valida (sk_...) oppure lascia vuoto.');
      return;
    }
    persistStripePublishableKey(trimmedKey);
    if (trimmedSecret) {
      persistStripeSecretKeyForLocalDev(trimmedSecret);
    } else {
      resetStripeSecretKeyForLocalDev();
    }
    setStripePublishableKey(trimmedKey);
    setStripeSecretKey(trimmedSecret);
    setStripeConfigured(true);
    setStripeSettingsError('');
    toast.success('Chiavi Stripe aggiornate. Puoi procedere al pagamento con carta.');
  };

  const resetStripeKeyFromCheckout = () => {
    resetStripePublishableKey();
    resetStripeSecretKeyForLocalDev();
    const current = getStripePublishableKey();
    const configured = isStripeConfigured();
    setStripeConfigured(configured);
    setStripePublishableKey(current === 'pk_test_INSERISCI_QUI_LA_TUA_PUBLISHABLE_KEY' ? '' : current);
    setStripeSecretKey('');
    setStripeSettingsError('');
    toast.success(
      configured
        ? 'Chiave locale rimossa. E stata ripristinata la configurazione Stripe di default.'
        : 'Configurazione Stripe rimossa. Inserisci una nuova chiave per i pagamenti carta.',
    );
  };

  const goBack = () => {
    if (currentStep === 'dati') setCurrentStep('riepilogo');
    if (currentStep === 'spedizione') setCurrentStep('dati');
    if (currentStep === 'pagamento') setCurrentStep('spedizione');
    if (currentStep === 'conferma') setCurrentStep('pagamento');
  };

  const handleCardPaymentSuccess = (paymentOrderId: string) => {
    const created = createOrderRecord({
      status: 'paid',
      paymentMethod: 'card',
      subtotalNet: totalNet,
      vat: totalVat,
      shipping: shippingCost,
      total: totalGross,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        companyName: customer.companyName,
        vatNumber: customer.vatNumber,
        fiscalCode: customer.fiscalCode,
        address: customer.shippingAddress,
        city: customer.shippingCity,
        cap: customer.shippingCap,
        province: customer.shippingProvince,
        billingAddressSameAsShipping: billingSameAsShipping,
        billingAddress: billingSameAsShipping ? customer.shippingAddress : customer.billingAddress,
        billingCity: billingSameAsShipping ? customer.shippingCity : customer.billingCity,
        billingCap: billingSameAsShipping ? customer.shippingCap : customer.billingCap,
        billingProvince: billingSameAsShipping ? customer.shippingProvince : customer.billingProvince,
      },
      items: checkoutItems,
    }, paymentOrderId);

    clearCart();
    setConfirmedOrderId(created.id);
    setCurrentStep('conferma');
    toast.success('Ordine confermato e pagato con carta');
  };

  const handleBankTransferOrder = async () => {
    if (placingOrder) return;

    setPlacingOrder(true);
    try {
      const order = createOrderRecord({
        status: 'pending_bank_transfer',
        paymentMethod: 'bank_transfer',
        subtotalNet: totalNet,
        vat: totalVat,
        shipping: shippingCost,
        total: totalGross,
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          companyName: customer.companyName,
          vatNumber: customer.vatNumber,
          fiscalCode: customer.fiscalCode,
          address: customer.shippingAddress,
          city: customer.shippingCity,
          cap: customer.shippingCap,
          province: customer.shippingProvince,
          billingAddressSameAsShipping: billingSameAsShipping,
          billingAddress: billingSameAsShipping ? customer.shippingAddress : customer.billingAddress,
          billingCity: billingSameAsShipping ? customer.shippingCity : customer.billingCity,
          billingCap: billingSameAsShipping ? customer.shippingCap : customer.billingCap,
          billingProvince: billingSameAsShipping ? customer.shippingProvince : customer.billingProvince,
        },
        items: checkoutItems,
      });

      clearCart();
      setConfirmedOrderId(order.id);
      setCurrentStep('conferma');
      toast.success('Ordine registrato in attesa di bonifico');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <>
      <main className="app-page-shell py-8 mb-20">
        <h1 className="app-page-title text-2xl font-bold text-gray-900 mb-8">Checkout professionale</h1>

        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => goToCompletedStep(step.key)}
                disabled={index > currentStepIndex}
                aria-current={index === currentStepIndex ? 'step' : undefined}
                aria-label={
                  index <= currentStepIndex
                    ? `Vai allo step ${step.label}`
                    : `Step ${step.label} disponibile dopo i passaggi precedenti`
                }
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  index === currentStepIndex
                    ? 'bg-green-600 text-white'
                    : index < currentStepIndex
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500 opacity-70 cursor-not-allowed'
                }`}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-[11px] font-bold">
                  {index + 1}
                </span>
                {step.icon}
                <span>{step.label}</span>
              </button>
              {index < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300" />}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr,350px]">
          <div className="app-surface bg-white rounded-xl border border-gray-200 p-6">
            {currentStep === 'riepilogo' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Riepilogo carrello</h2>
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={item.image} alt={item.name} className="h-14 w-14 rounded-md object-cover" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Quantita: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-900">€ {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 'dati' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Dati cliente e fatturazione</h2>
                {customerStepErrorMessages.length > 0 && (
                  <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
                    Correggi i campi evidenziati prima di continuare.
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor={fieldId('name')} className="block text-sm font-medium text-gray-700 mb-1">Nome e Cognome *</label>
                    <input
                      type="text"
                      {...getFieldA11yProps('name')}
                      value={customer.name}
                      onChange={(event) => setCustomerValue('name', event.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                    />
                    {fieldErrors.name && <p id={fieldErrorId('name')} className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor={fieldId('email')} className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      {...getFieldA11yProps('email')}
                      value={customer.email}
                      onChange={(event) => setCustomerValue('email', event.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                    />
                    {fieldErrors.email && <p id={fieldErrorId('email')} className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor={fieldId('phone')} className="block text-sm font-medium text-gray-700 mb-1">Telefono *</label>
                    <input
                      type="tel"
                      {...getFieldA11yProps('phone')}
                      value={customer.phone}
                      onChange={(event) => setCustomerValue('phone', event.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                    />
                    {fieldErrors.phone && <p id={fieldErrorId('phone')} className="text-xs text-red-600 mt-1">{fieldErrors.phone}</p>}
                  </div>

                  <div className="sm:col-span-2 h-px bg-gray-100 my-1" />

                  <div className="sm:col-span-2">
                    <label htmlFor={fieldId('companyName')} className="block text-sm font-medium text-gray-700 mb-1">Ragione Sociale</label>
                    <input
                      type="text"
                      {...getFieldA11yProps('companyName')}
                      value={customer.companyName}
                      onChange={(event) => setCustomerValue('companyName', event.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                      placeholder="Opzionale"
                    />
                  </div>

                  <div>
                    <label htmlFor={fieldId('vatNumber')} className="block text-sm font-medium text-gray-700 mb-1">Partita IVA *</label>
                    <input
                      type="text"
                      {...getFieldA11yProps('vatNumber')}
                      value={customer.vatNumber}
                      onChange={(event) => setCustomerValue('vatNumber', event.target.value.toUpperCase())}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                      placeholder="IT01234567890"
                    />
                    {fieldErrors.vatNumber && <p id={fieldErrorId('vatNumber')} className="text-xs text-red-600 mt-1">{fieldErrors.vatNumber}</p>}
                  </div>

                  <div>
                    <label htmlFor={fieldId('fiscalCode')} className="block text-sm font-medium text-gray-700 mb-1">Codice Fiscale</label>
                    <input
                      type="text"
                      {...getFieldA11yProps('fiscalCode')}
                      value={customer.fiscalCode}
                      onChange={(event) => setCustomerValue('fiscalCode', event.target.value.toUpperCase())}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                    />
                    {fieldErrors.fiscalCode && <p id={fieldErrorId('fiscalCode')} className="text-xs text-red-600 mt-1">{fieldErrors.fiscalCode}</p>}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'spedizione' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Spedizione e recapito</h2>
                {shippingStepErrorMessages.length > 0 && (
                  <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
                    Correggi i dati di spedizione/fatturazione evidenziati.
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor={fieldId('shippingAddress')} className="block text-sm font-medium text-gray-700 mb-1">Via e numero civico *</label>
                    <input
                      type="text"
                      {...getFieldA11yProps('shippingAddress')}
                      value={customer.shippingAddress}
                      onChange={(event) => setCustomerValue('shippingAddress', event.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                    />
                    {fieldErrors.shippingAddress && <p id={fieldErrorId('shippingAddress')} className="text-xs text-red-600 mt-1">{fieldErrors.shippingAddress}</p>}
                  </div>

                  <div>
                    <label htmlFor={fieldId('shippingCity')} className="block text-sm font-medium text-gray-700 mb-1">Citta *</label>
                    <input
                      type="text"
                      {...getFieldA11yProps('shippingCity')}
                      value={customer.shippingCity}
                      onChange={(event) => setCustomerValue('shippingCity', event.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                    />
                    {fieldErrors.shippingCity && <p id={fieldErrorId('shippingCity')} className="text-xs text-red-600 mt-1">{fieldErrors.shippingCity}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor={fieldId('shippingCap')} className="block text-sm font-medium text-gray-700 mb-1">CAP *</label>
                      <input
                        type="text"
                        {...getFieldA11yProps('shippingCap')}
                        value={customer.shippingCap}
                        onChange={(event) => setCustomerValue('shippingCap', event.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                      />
                      {fieldErrors.shippingCap && <p id={fieldErrorId('shippingCap')} className="text-xs text-red-600 mt-1">{fieldErrors.shippingCap}</p>}
                    </div>
                    <div>
                      <label htmlFor={fieldId('shippingProvince')} className="block text-sm font-medium text-gray-700 mb-1">Provincia *</label>
                      <input
                        type="text"
                        {...getFieldA11yProps('shippingProvince')}
                        value={customer.shippingProvince}
                        onChange={(event) => setCustomerValue('shippingProvince', event.target.value.toUpperCase())}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                      />
                      {fieldErrors.shippingProvince && <p id={fieldErrorId('shippingProvince')} className="text-xs text-red-600 mt-1">{fieldErrors.shippingProvince}</p>}
                    </div>
                  </div>
                </div>

                <fieldset className="rounded-lg border border-gray-200 p-4 space-y-3">
                  <legend className="text-sm font-bold text-gray-900">Metodo di spedizione</legend>
                  <label className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer ${shippingMethod === 'standard' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                    <span className="text-sm text-gray-800">Standard (3-5 giorni)</span>
                    <span className="text-sm font-semibold">€ 24,00</span>
                    <input type="radio" name="shippingMethod" className="sr-only" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} />
                  </label>
                  <label className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer ${shippingMethod === 'express' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                    <span className="text-sm text-gray-800">Express (24-48h)</span>
                    <span className="text-sm font-semibold">€ 49,00</span>
                    <input type="radio" name="shippingMethod" className="sr-only" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} />
                  </label>
                </fieldset>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={billingSameAsShipping}
                    onChange={(event) => setBillingSameAsShipping(event.target.checked)}
                    className="rounded text-green-700 focus:ring-green-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Usa lo stesso indirizzo per la fatturazione</span>
                </label>

                {!billingSameAsShipping && (
                  <div className="grid gap-4 sm:grid-cols-2 rounded-lg border border-gray-200 p-4">
                    <div className="sm:col-span-2">
                      <label htmlFor={fieldId('billingAddress')} className="block text-sm font-medium text-gray-700 mb-1">Indirizzo fatturazione *</label>
                      <input
                        type="text"
                        {...getFieldA11yProps('billingAddress')}
                        value={customer.billingAddress}
                        onChange={(event) => setCustomerValue('billingAddress', event.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                      />
                      {fieldErrors.billingAddress && <p id={fieldErrorId('billingAddress')} className="text-xs text-red-600 mt-1">{fieldErrors.billingAddress}</p>}
                    </div>

                    <div>
                      <label htmlFor={fieldId('billingCity')} className="block text-sm font-medium text-gray-700 mb-1">Citta *</label>
                      <input
                        type="text"
                        {...getFieldA11yProps('billingCity')}
                        value={customer.billingCity}
                        onChange={(event) => setCustomerValue('billingCity', event.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                      />
                      {fieldErrors.billingCity && <p id={fieldErrorId('billingCity')} className="text-xs text-red-600 mt-1">{fieldErrors.billingCity}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor={fieldId('billingCap')} className="block text-sm font-medium text-gray-700 mb-1">CAP *</label>
                        <input
                          type="text"
                          {...getFieldA11yProps('billingCap')}
                          value={customer.billingCap}
                          onChange={(event) => setCustomerValue('billingCap', event.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                        />
                        {fieldErrors.billingCap && <p id={fieldErrorId('billingCap')} className="text-xs text-red-600 mt-1">{fieldErrors.billingCap}</p>}
                      </div>

                      <div>
                        <label htmlFor={fieldId('billingProvince')} className="block text-sm font-medium text-gray-700 mb-1">Provincia *</label>
                        <input
                          type="text"
                          {...getFieldA11yProps('billingProvince')}
                          value={customer.billingProvince}
                          onChange={(event) => setCustomerValue('billingProvince', event.target.value.toUpperCase())}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                        />
                        {fieldErrors.billingProvince && <p id={fieldErrorId('billingProvince')} className="text-xs text-red-600 mt-1">{fieldErrors.billingProvince}</p>}
                      </div>
                    </div>
                  </div>
                )}

                <label className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={billingConfirmed}
                    onChange={(event) => {
                      setBillingConfirmed(event.target.checked);
                      if (event.target.checked && billingConfirmError) {
                        setBillingConfirmError('');
                      }
                    }}
                    className="mt-1 rounded text-green-700 focus:ring-green-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Confermo che i dati di fatturazione inseriti sono corretti e completi.
                  </span>
                </label>
                {billingConfirmError && (
                  <p className="text-xs font-semibold text-red-600">{billingConfirmError}</p>
                )}
              </div>
            )}

            {currentStep === 'pagamento' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Pagamento</h2>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Configurazione Stripe checkout</p>
                      <p className="text-xs text-gray-600">
                        Stato: {stripeConfigured ? 'attivo' : 'non configurato'} · Key: {maskedStripeKey}
                      </p>
                      <p className="text-xs text-gray-600">
                        Secret locale: {maskedStripeSecretKey}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStripeSettingsOpen((prev) => !prev)}
                      className="app-action-secondary inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      aria-expanded={stripeSettingsOpen}
                    >
                      <Settings className="h-4 w-4" />
                      Impostazioni
                    </button>
                  </div>

                  {stripeSettingsOpen && (
                    <div className="mt-4 space-y-3 rounded-lg border border-gray-200 bg-white p-3">
                      <label htmlFor="checkout-stripe-key" className="block text-xs font-semibold text-gray-700">
                        Stripe publishable key (pk_...)
                      </label>
                      <input
                        id="checkout-stripe-key"
                        type="text"
                        value={stripePublishableKey}
                        onChange={(event) => {
                          setStripePublishableKey(event.target.value);
                          if (stripeSettingsError) setStripeSettingsError('');
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-200"
                        placeholder="pk_test_..."
                      />
                      <label htmlFor="checkout-stripe-secret-key" className="block text-xs font-semibold text-gray-700">
                        Stripe secret key locale (sk_...) - opzionale
                      </label>
                      <input
                        id="checkout-stripe-secret-key"
                        type="password"
                        value={stripeSecretKey}
                        onChange={(event) => {
                          setStripeSecretKey(event.target.value);
                          if (stripeSettingsError) setStripeSettingsError('');
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-200"
                        placeholder="sk_test_..."
                      />
                      {stripeSettingsError && (
                        <p className="text-xs font-medium text-red-600">{stripeSettingsError}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={saveStripeKeyFromCheckout}
                          className="app-action-primary rounded-lg bg-green-700 px-4 py-2 text-sm font-bold text-white hover:bg-green-800"
                        >
                          Salva key
                        </button>
                        <button
                          type="button"
                          onClick={resetStripeKeyFromCheckout}
                          className="app-action-secondary inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Reset key
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  paymentMethod === 'card' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => {
                      setPaymentMethod('card');
                      if (paymentMethodError) setPaymentMethodError('');
                    }}
                    className="mt-0.5 text-green-700 focus:ring-green-600"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Carta di credito/debito (Stripe)</p>
                    <p className="text-sm text-gray-500">Pagamento immediato e conferma ordine automatica.</p>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  paymentMethod === 'bank_transfer' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => {
                      setPaymentMethod('bank_transfer');
                      if (paymentMethodError) setPaymentMethodError('');
                    }}
                    className="mt-0.5 text-green-700 focus:ring-green-600"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Bonifico bancario</p>
                    <p className="text-sm text-gray-500">L\'ordine viene preso in carico dopo la verifica del bonifico.</p>
                  </div>
                </label>

                {paymentMethod === 'bank_transfer' && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                    <p className="font-semibold mb-2 inline-flex items-center gap-2"><Landmark className="w-4 h-4" /> Dati bonifico</p>
                    <p>Intestatario: Bianchi Pro S.r.l.</p>
                    <p>IBAN: IT60X0542811101000000123456</p>
                    <p>Causale: Numero ordine (verra indicato in conferma)</p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
                    Prima di confermare l&apos;ordine si aprira il modulo Stripe sicuro dove inserire i dati carta.
                  </div>
                )}
                {paymentMethodError && (
                  <p className="text-xs font-semibold text-red-600">{paymentMethodError}</p>
                )}
              </div>
            )}

            {currentStep === 'conferma' && (
              <div className="space-y-4">
                <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                  <h2 className="text-lg font-bold text-green-800">Ordine confermato</h2>
                  <p className="text-sm text-green-700 mt-1">Numero ordine: <strong>{confirmedOrderId}</strong></p>
                  <p className="text-sm text-green-700 mt-2">
                    Abbiamo registrato l\'ordine e inviato il riepilogo all\'indirizzo {customer.email}.
                  </p>
                </div>

                <Link to="/account/ordini" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800">
                  Vai ai tuoi ordini <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {currentStep !== 'conferma' && (
              <div className="flex gap-3 mt-8">
                {currentStep !== 'riepilogo' && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="app-action-secondary flex-1 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50"
                  >
                    Indietro
                  </button>
                )}
                <button
                  type="button"
                  onClick={goNext}
                  disabled={placingOrder}
                  className="app-action-primary flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {currentStep === 'pagamento'
                    ? !paymentMethod
                      ? 'Seleziona metodo di pagamento'
                      : paymentMethod === 'card'
                        ? stripeConfigured
                          ? 'Procedi al pagamento con Stripe'
                          : 'Configura Stripe per continuare'
                        : 'Conferma ordine con bonifico'
                    : 'Continua'}
                </button>
              </div>
            )}
          </div>

          <aside className="app-surface bg-white rounded-xl border border-gray-200 p-6 h-fit sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Riepilogo economico</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotale prodotti (ex IVA)</span><span>€ {totalNet.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Spedizione (ex IVA)</span><span>€ {shippingCost.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">IVA (22%)</span><span>€ {totalVat.toFixed(2)}</span></div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between text-lg"><span className="font-bold">Totale</span><span className="font-extrabold">€ {totalGross.toFixed(2)}</span></div>
            </div>
          </aside>
        </div>
      </main>

      <CheckoutModal
        isOpen={stripeOpen}
        onClose={() => setStripeOpen(false)}
        total={totalGross}
        items={checkoutItems}
        customer={checkoutCustomer}
        onSuccess={handleCardPaymentSuccess}
      />
    </>
  );
}
