import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  User, Phone, Eye, EyeOff,
  CheckCircle2, Send, Building2, MapPin, FileText, Crown, X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { projectId } from '../../utils/supabase/info';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register, resendVerificationEmail, verifyEmail, requestPasswordReset } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'client' | 'pro'>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  /* Blocca lo scroll del body quando il modal è aperto */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const actionLabel = useMemo(() => {
    if (loading) return 'Verifica in corso...';
    return mode === 'login' ? 'Accedi' : 'Crea account';
  }, [loading, mode]);

  /* Il portal NON deve essere chiamato condizionalmente — il hook useEffect
     sopra gestisce già il caso !isOpen. Ma per evitare rendering inutile: */
  if (!isOpen) return null;

  const resetForm = () => {
    setEmail(''); setPassword(''); setName(''); setPhone('');
    setCompanyName(''); setVatNumber(''); setAddress(''); setCity('');
    setError(''); setInfo(''); setPendingVerificationEmail('');
    setForgotPasswordMode(false);
  };

  const handleClose = () => { onClose(); resetForm(); };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode); setError(''); setInfo(''); setForgotPasswordMode(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setInfo(''); setLoading(true);
    setTimeout(() => {
      if (mode === 'login') {
        const result = login(email, password);
        if (!result.success) {
          setError(result.error || 'Errore di accesso');
          if (result.requiresEmailVerification && result.email) setPendingVerificationEmail(result.email);
          setLoading(false); return;
        }
        setLoading(false); handleClose(); return;
      }
      if (!name.trim()) { setError('Inserisci nome e cognome'); setLoading(false); return; }
      if (!phone.trim()) { setError('Inserisci il telefono'); setLoading(false); return; }
      if (password.length < 6) { setError('La password deve avere almeno 6 caratteri'); setLoading(false); return; }
      const result = register({ email, password, name, phone, role });
      if (!result.success) { setError(result.error || 'Errore di registrazione'); setLoading(false); return; }
      const registeredEmail = result.email || email;
      setPendingVerificationEmail(registeredEmail);
      void postEmailApi('send-verification-email', { email: registeredEmail });
      setInfo(`Account creato. Ti abbiamo inviato una mail di conferma a ${registeredEmail}.`);
      setMode('login'); setLoading(false);
    }, 200);
  };

  const handleResend = async () => {
    const targetEmail = pendingVerificationEmail || email;
    if (!targetEmail) { setError('Inserisci una email valida.'); return; }
    const result = resendVerificationEmail(targetEmail);
    if (!result.success) { setError(result.error || 'Impossibile reinviare la mail.'); return; }
    await postEmailApi('send-verification-email', { email: targetEmail });
    setInfo(`Nuova email inviata a ${targetEmail}. Controlla anche Spam.`);
    setError(''); setPendingVerificationEmail('');
  };

  const handleConfirmVerified = () => {
    const targetEmail = pendingVerificationEmail || email;
    if (!targetEmail) { setError('Nessuna email da verificare.'); return; }
    const result = verifyEmail(targetEmail);
    if (!result.success) { setError(result.error || 'Verifica non riuscita.'); return; }
    setInfo('Email confermata. Ora puoi accedere.'); setError(''); setPendingVerificationEmail('');
  };

  const handlePasswordReset = async () => {
    setError(''); setInfo('');
    if (!email.trim()) { setError('Inserisci la tua email per recuperare la password.'); return; }
    const result = requestPasswordReset(email);
    if (!result.success || !result.temporaryPassword) { setError(result.error || 'Impossibile recuperare la password.'); return; }
    const sent = await postEmailApi('send-reset-password-email', { email, temporaryPassword: result.temporaryPassword });
    if (sent) { setInfo(`Email di recupero inviata a ${email}.`); return; }
    setInfo(`Password temporanea: ${result.temporaryPassword}`);
  };

  /* Stile input condiviso */
  const inputCls = 'w-full rounded-xl border border-gray-300 py-2.5 px-4 text-sm focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors';
  const inputWithIconCls = 'w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors';

  return createPortal(
    /* Overlay scuro — z-[99999] + portal + isolation per stare SOPRA TUTTO */
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/70"
      style={{ zIndex: 99999, isolation: 'isolate', pointerEvents: 'auto' }}
      onClick={handleClose}
    >
      {/* Container modale — scrollabile se contenuto troppo alto */}
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto mx-4 my-8 rounded-2xl bg-white shadow-2xl"
        style={{ zIndex: 100000, pointerEvents: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pulsante chiudi */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Chiudi"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 pt-8">
          {/* Tab toggle Accedi / Registrati */}
          {!forgotPasswordMode && (
            <div className="mx-auto max-w-xs flex rounded-full bg-gray-100 p-1 mb-6">
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

          {/* Google button */}
          {!forgotPasswordMode && (
            <>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continua con Google
              </button>

              {/* Divider "oppure" — senza rettangolo bianco */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wide">oppure</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo account (solo registrazione) */}
            {mode === 'register' && !forgotPasswordMode && (
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-800">Tipo di account</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button" onClick={() => setRole('client')}
                    className={`rounded-xl border-2 p-3 text-left transition-all ${
                      role === 'client' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <User className={`mb-1 h-5 w-5 ${role === 'client' ? 'text-green-700' : 'text-gray-400'}`} />
                    <p className="text-sm font-bold text-gray-800">Cliente</p>
                    <p className="text-xs text-gray-500">Acquista prodotti</p>
                  </button>
                  <button
                    type="button" onClick={() => setRole('pro')}
                    className={`rounded-xl border-2 p-3 text-left transition-all ${
                      role === 'pro' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Crown className={`mb-1 h-5 w-5 ${role === 'pro' ? 'text-amber-600' : 'text-gray-400'}`} />
                    <p className="text-sm font-bold text-gray-800">Pro</p>
                    <p className="text-xs text-gray-500">Rivenditore / Professionista</p>
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && !forgotPasswordMode && (
              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-800">Nome e Cognome *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputWithIconCls} placeholder="Mario Rossi" required />
                </div>
              </div>
            )}

            {mode === 'register' && !forgotPasswordMode && (
              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-800">Ragione Sociale</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className={inputWithIconCls} placeholder="Nome azienda S.r.l." />
                </div>
              </div>
            )}

            {mode === 'register' && !forgotPasswordMode && (
              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-800">Partita IVA</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={vatNumber} onChange={e => setVatNumber(e.target.value)} className={inputWithIconCls} placeholder="IT01234567890" />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-800">Email{!forgotPasswordMode && ' *'}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} placeholder="La tua email" required />
            </div>

            {!forgotPasswordMode && (
              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-800">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    minLength={mode === 'register' ? 6 : undefined}
                    className={inputCls + ' pr-10'} placeholder="La tua password" required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && !forgotPasswordMode && (
              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-800">Telefono *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputWithIconCls} placeholder="+39 333 123 4567" required />
                </div>
              </div>
            )}

            {mode === 'register' && !forgotPasswordMode && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-800">Indirizzo</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} className={inputWithIconCls} placeholder="Via Roma 1" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-800">Citta</label>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)} className={inputCls} placeholder="Milano" />
                </div>
              </div>
            )}

            {mode === 'login' && !forgotPasswordMode && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-600" />
                <span className="text-sm text-gray-600">Ricordami</span>
              </label>
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
                  <button type="button" onClick={handleResend} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                    <Send className="h-4 w-4" /> Invia nuova email
                  </button>
                  <button type="button" onClick={handleConfirmVerified} className="inline-flex items-center gap-1.5 rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors">
                    <CheckCircle2 className="h-4 w-4" /> Ho confermato
                  </button>
                </div>
              </div>
            )}

            {forgotPasswordMode ? (
              <div className="space-y-3 pt-2">
                <button type="button" onClick={handlePasswordReset} className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 transition-colors">
                  Invia email di recupero
                </button>
                <button type="button" onClick={() => { setForgotPasswordMode(false); setError(''); setInfo(''); }}
                  className="w-full rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  Torna al login
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <button type="submit" disabled={loading}
                  className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60 transition-colors">
                  {actionLabel}
                </button>
                {mode === 'login' && (
                  <p className="text-center text-sm text-gray-500">
                    Hai dimenticato la password?{' '}
                    <button type="button" onClick={() => { setForgotPasswordMode(true); setError(''); setInfo(''); }}
                      className="font-bold text-green-700 hover:text-green-700 transition-colors">
                      Recupera Password
                    </button>
                  </p>
                )}
              </div>
            )}

            {mode === 'register' && !forgotPasswordMode && (
              <p className="text-center text-xs text-gray-400 pt-1">
                La vendita e riservata a possessori di Partita IVA. I dati fiscali saranno verificati dopo la registrazione.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}
