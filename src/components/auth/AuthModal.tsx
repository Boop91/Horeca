import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  Send,
  Building2,
  MapPin,
  FileText,
  X,
  Mail,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { projectId } from '../../utils/supabase/info';
import { lockBodyScroll, unlockBodyScroll } from '../../utils/bodyScrollLock';
import {
  validateEmail,
  validatePhone,
  validatePartitaIVA,
  validateCodiceFiscale,
  validateCAP,
  validateProvincia,
} from '../../lib/validation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  phone: string;
  companyName: string;
  vatNumber: string;
  fiscalCode: string;
  address: string;
  city: string;
  cap: string;
  province: string;
}

const emailApiCandidates = (path: string) => [
  `/api/${path}`,
  `https://${projectId}.supabase.co/functions/v1/make-server-d9742687/${path}`,
];

async function postEmailApi(path: string, payload: unknown) {
  for (const url of emailApiCandidates(path)) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) return true;
    } catch {
      // prova endpoint successivo
    }
  }
  return false;
}

const emptyRegisterForm: RegisterFormState = {
  name: '',
  email: '',
  password: '',
  phone: '',
  companyName: '',
  vatNumber: '',
  fiscalCode: '',
  address: '',
  city: '',
  cap: '',
  province: '',
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register, resendVerificationEmail, verifyEmail, requestPasswordReset } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const [includeBillingDetails, setIncludeBillingDetails] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerForm, setRegisterForm] = useState<RegisterFormState>(emptyRegisterForm);

  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const registerProgress = useMemo(() => (registerStep === 1 ? 50 : 100), [registerStep]);

  useEffect(() => {
    if (!isOpen) return undefined;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [isOpen]);

  if (!isOpen) return null;

  const resetForm = () => {
    setLoginEmail('');
    setLoginPassword('');
    setRegisterForm(emptyRegisterForm);
    setRegisterStep(1);
    setIncludeBillingDetails(false);
    setShowPassword(false);
    setError('');
    setInfo('');
    setLoading(false);
    setPendingVerificationEmail('');
    setForgotPasswordMode(false);
    setFieldErrors({});
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setRegisterStep(1);
    setIncludeBillingDetails(false);
    setError('');
    setInfo('');
    setPendingVerificationEmail('');
    setForgotPasswordMode(false);
    setFieldErrors({});
  };

  const setRegisterValue = (key: keyof RegisterFormState, value: string) => {
    setRegisterForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validateRegisterStepOne = () => {
    const nextErrors: Record<string, string> = {};

    if (!registerForm.name.trim()) {
      nextErrors.name = 'Inserisci nome e cognome.';
    }

    const emailCheck = validateEmail(registerForm.email);
    if (!emailCheck.valid) {
      nextErrors.email = emailCheck.error || 'Email non valida.';
    }

    const phoneCheck = validatePhone(registerForm.phone);
    if (!phoneCheck.valid) {
      nextErrors.phone = phoneCheck.error || 'Numero di telefono non valido.';
    }

    if (registerForm.password.length < 8) {
      nextErrors.password = 'La password deve avere almeno 8 caratteri.';
    }

    setFieldErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const validateBillingFields = () => {
    if (!includeBillingDetails) return true;

    const nextErrors: Record<string, string> = {};

    if (registerForm.vatNumber.trim()) {
      const vatCheck = validatePartitaIVA(registerForm.vatNumber);
      if (!vatCheck.valid) {
        nextErrors.vatNumber = vatCheck.error || 'Partita IVA non valida.';
      }
    }

    if (registerForm.fiscalCode.trim()) {
      const fiscalCheck = validateCodiceFiscale(registerForm.fiscalCode);
      if (!fiscalCheck.valid) {
        nextErrors.fiscalCode = fiscalCheck.error || 'Codice fiscale non valido.';
      }
    }

    if (registerForm.cap.trim()) {
      const capCheck = validateCAP(registerForm.cap);
      if (!capCheck.valid) {
        nextErrors.cap = capCheck.error || 'CAP non valido.';
      }
    }

    if (registerForm.province.trim()) {
      const provinceCheck = validateProvincia(registerForm.province);
      if (!provinceCheck.valid) {
        nextErrors.province = provinceCheck.error || 'Provincia non valida.';
      }
    }

    setFieldErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async () => {
    const loginEmailCheck = validateEmail(loginEmail);
    if (!loginEmailCheck.valid) {
      setError(loginEmailCheck.error || 'Inserisci una email valida.');
      return;
    }

    if (!loginPassword.trim()) {
      setError('Inserisci la password per accedere.');
      return;
    }

    const result = await Promise.resolve(login(loginEmail, loginPassword));
    if (!result.success) {
      setError(result.error || 'Errore di accesso');
      if (result.requiresEmailVerification && result.email) {
        setPendingVerificationEmail(result.email);
      }
      return;
    }

    handleClose();
  };

  const handleRegister = async () => {
    if (!validateRegisterStepOne()) {
      setRegisterStep(1);
      setError('Controlla i campi obbligatori del primo passaggio.');
      return;
    }

    if (!validateBillingFields()) {
      setRegisterStep(2);
      setError('Controlla i dati di fatturazione inseriti.');
      return;
    }

    const result = await Promise.resolve(register({
      email: registerForm.email,
      password: registerForm.password,
      name: registerForm.name,
      phone: registerForm.phone,
      companyName: includeBillingDetails ? registerForm.companyName : '',
      vatNumber: includeBillingDetails ? registerForm.vatNumber : '',
      fiscalCode: includeBillingDetails ? registerForm.fiscalCode : '',
      address: includeBillingDetails ? registerForm.address : '',
      city: includeBillingDetails ? registerForm.city : '',
      cap: includeBillingDetails ? registerForm.cap : '',
      province: includeBillingDetails ? registerForm.province : '',
    }));

    if (!result.success) {
      setError(result.error || 'Errore di registrazione');
      return;
    }

    const registeredEmail = result.email || registerForm.email;
    setPendingVerificationEmail(registeredEmail);
    void postEmailApi('send-verification-email', { email: registeredEmail });

    setInfo(`Account creato. Ti abbiamo inviato una mail di conferma a ${registeredEmail}.`);
    setMode('login');
    setLoginEmail(registeredEmail);
    setLoginPassword('');
    setRegisterStep(1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      if (forgotPasswordMode) {
        if (!loginEmail.trim()) {
          setError('Inserisci la tua email per recuperare la password.');
          return;
        }

        const result = await Promise.resolve(requestPasswordReset(loginEmail));
        if (!result.success || !result.temporaryPassword) {
          setError(result.error || 'Impossibile recuperare la password.');
          return;
        }

        const sent = await postEmailApi('send-reset-password-email', {
          email: loginEmail,
          temporaryPassword: result.temporaryPassword,
        });

        if (sent) {
          setInfo(`Email di recupero inviata a ${loginEmail}.`);
        } else {
          setInfo(`Password temporanea: ${result.temporaryPassword}`);
        }

        return;
      }

      if (mode === 'login') {
        await handleLogin();
        return;
      }

      if (registerStep === 1) {
        if (!validateRegisterStepOne()) {
          setError('Compila correttamente i campi obbligatori per continuare.');
          return;
        }
        setRegisterStep(2);
        return;
      }

      await handleRegister();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const targetEmail = pendingVerificationEmail || loginEmail || registerForm.email;
    if (!targetEmail) {
      setError('Inserisci una email valida.');
      return;
    }

    const result = resendVerificationEmail(targetEmail);
    if (!result.success) {
      setError(result.error || 'Impossibile reinviare la mail.');
      return;
    }

    await postEmailApi('send-verification-email', { email: targetEmail });
    setInfo(`Nuova email inviata a ${targetEmail}. Controlla anche Spam.`);
    setError('');
    setPendingVerificationEmail(targetEmail);
  };

  const handleConfirmVerified = () => {
    const targetEmail = pendingVerificationEmail || loginEmail;
    if (!targetEmail) {
      setError('Nessuna email da verificare.');
      return;
    }

    const result = verifyEmail(targetEmail);
    if (!result.success) {
      setError(result.error || 'Verifica non riuscita.');
      return;
    }

    setInfo('Email confermata. Ora puoi accedere.');
    setError('');
    setPendingVerificationEmail('');
  };

  const inputCls = 'w-full rounded-xl border border-gray-300 py-2.5 px-4 text-sm focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors';
  const inputWithIconCls = 'w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors';

  const registerActionLabel = loading
    ? 'Elaborazione...'
    : registerStep === 1
      ? 'Continua'
      : 'Crea account';

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-[2px]"
      style={{ zIndex: 99999, isolation: 'isolate', pointerEvents: 'auto' }}
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 my-8 rounded-2xl bg-white shadow-2xl"
        style={{ zIndex: 100000, pointerEvents: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white/95 px-6 py-4 backdrop-blur">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-green-700">Area cliente</p>
            <h2 className="text-lg font-bold text-gray-900">{mode === 'register' ? 'Registrazione account' : 'Accesso account'}</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="Chiudi"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 pt-6">
          {!forgotPasswordMode && (
            <div className="mx-auto max-w-sm flex rounded-full bg-gray-100 p-1 mb-6">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
                  mode === 'login' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Accedi
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`flex-1 rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
                  mode === 'register' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Registrati
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && !forgotPasswordMode && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center justify-between mb-2 text-xs font-semibold text-gray-700">
                  <span>Registrazione professionale</span>
                  <span>Step {registerStep}/2</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full bg-green-600 transition-all" style={{ width: `${registerProgress}%` }} />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-bold text-gray-800">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(event) => setLoginEmail(event.target.value)}
                        className={inputWithIconCls}
                        placeholder="nome@azienda.it"
                        required
                      />
                    </div>
                  </div>

                  {!forgotPasswordMode && (
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-bold text-gray-800">Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(event) => setLoginPassword(event.target.value)}
                          className={`${inputWithIconCls} pr-10`}
                          placeholder="La tua password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {!forgotPasswordMode && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-600"
                    />
                    <span className="text-sm text-gray-600">Ricordami su questo dispositivo</span>
                  </label>
                )}
              </>
            )}

            {mode === 'register' && !forgotPasswordMode && registerStep === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-bold text-gray-800">Nome e Cognome *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={registerForm.name}
                      onChange={e => setRegisterValue('name', e.target.value)}
                      className={inputWithIconCls}
                      placeholder="Mario Rossi"
                      required
                    />
                  </div>
                  {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-800">Email *</label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={e => setRegisterValue('email', e.target.value)}
                    className={inputCls}
                    placeholder="acquisti@azienda.it"
                    required
                  />
                  {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-800">Telefono *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={registerForm.phone}
                      onChange={e => setRegisterValue('phone', e.target.value)}
                      className={inputWithIconCls}
                      placeholder="+39 333 1234567"
                      required
                    />
                  </div>
                  {fieldErrors.phone && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-bold text-gray-800">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerForm.password}
                      onChange={e => setRegisterValue('password', e.target.value)}
                      minLength={8}
                      className={`${inputCls} pr-10`}
                      placeholder="Almeno 8 caratteri"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
                </div>
              </div>
            )}

            {mode === 'register' && !forgotPasswordMode && registerStep === 2 && (
              <div className="space-y-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeBillingDetails}
                    onChange={(event) => setIncludeBillingDetails(event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-600"
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    Aggiungi ora i dati aziendali e di fatturazione
                  </span>
                </label>

                {includeBillingDetails && (
                  <div className="grid gap-4 sm:grid-cols-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-bold text-gray-800">Ragione Sociale</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={registerForm.companyName}
                          onChange={e => setRegisterValue('companyName', e.target.value)}
                          className={inputWithIconCls}
                          placeholder="Azienda S.r.l."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-gray-800">Partita IVA</label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={registerForm.vatNumber}
                          onChange={e => setRegisterValue('vatNumber', e.target.value.toUpperCase())}
                          className={inputWithIconCls}
                          placeholder="IT01234567890"
                        />
                      </div>
                      {fieldErrors.vatNumber && <p className="mt-1 text-xs text-red-600">{fieldErrors.vatNumber}</p>}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-gray-800">Codice Fiscale</label>
                      <input
                        type="text"
                        value={registerForm.fiscalCode}
                        onChange={e => setRegisterValue('fiscalCode', e.target.value.toUpperCase())}
                        className={inputCls}
                        placeholder="RSSMRA85M01H501Z"
                      />
                      {fieldErrors.fiscalCode && <p className="mt-1 text-xs text-red-600">{fieldErrors.fiscalCode}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-bold text-gray-800">Indirizzo</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={registerForm.address}
                          onChange={e => setRegisterValue('address', e.target.value)}
                          className={inputWithIconCls}
                          placeholder="Via Roma 12"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-bold text-gray-800">Citta</label>
                      <input
                        type="text"
                        value={registerForm.city}
                        onChange={e => setRegisterValue('city', e.target.value)}
                        className={inputCls}
                        placeholder="Milano"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-sm font-bold text-gray-800">CAP</label>
                        <input
                          type="text"
                          value={registerForm.cap}
                          onChange={e => setRegisterValue('cap', e.target.value)}
                          className={inputCls}
                          placeholder="20100"
                        />
                        {fieldErrors.cap && <p className="mt-1 text-xs text-red-600">{fieldErrors.cap}</p>}
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-bold text-gray-800">Provincia</label>
                        <input
                          type="text"
                          value={registerForm.province}
                          onChange={e => setRegisterValue('province', e.target.value.toUpperCase())}
                          className={inputCls}
                          placeholder="MI"
                        />
                        {fieldErrors.province && <p className="mt-1 text-xs text-red-600">{fieldErrors.province}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>
            )}
            {info && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">{info}</div>
            )}

            {pendingVerificationEmail && !forgotPasswordMode && (
              <div className="space-y-2 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-900">Conferma email richiesta</p>
                <p className="text-xs text-blue-700">Email inviata a {pendingVerificationEmail}. Controlla anche Spam.</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleResend}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    <Send className="h-4 w-4" /> Invia nuova email
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmVerified}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Ho confermato
                  </button>
                </div>
              </div>
            )}

            {forgotPasswordMode ? (
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60 transition-colors"
                >
                  {loading ? 'Invio in corso...' : 'Invia email di recupero'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordMode(false);
                    setError('');
                    setInfo('');
                  }}
                  className="w-full rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Torna al login
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {mode === 'register' && registerStep === 2 && (
                  <button
                    type="button"
                    onClick={() => setRegisterStep(1)}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" /> Torna allo step precedente
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60 transition-colors"
                >
                  {mode === 'register' ? registerActionLabel : loading ? 'Accesso in corso...' : 'Accedi'}
                </button>

                {mode === 'login' && (
                  <p className="text-center text-sm text-gray-500">
                    Hai dimenticato la password?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordMode(true);
                        setError('');
                        setInfo('');
                      }}
                      className="font-bold text-green-700 hover:text-green-700 transition-colors"
                    >
                      Recupera Password
                    </button>
                  </p>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}
