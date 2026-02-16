import { useMemo, useState } from 'react';
import {
  X, Mail, Lock, User, Phone, Eye, EyeOff, Shield, Crown,
  CheckCircle2, Send, KeyRound, Building2, MapPin, FileText,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { projectId } from '../../utils/supabase/info';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emailApiCandidates = (path: string) => [
  `/.netlify/functions/${path}`,
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

  /* Campi form */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  /* Campi aggiuntivi registrazione B2B */
  const [companyName, setCompanyName] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const actionLabel = useMemo(() => {
    if (loading) return 'Verifica in corso...';
    return mode === 'login' ? 'Accedi' : 'Crea account';
  }, [loading, mode]);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setCompanyName('');
    setVatNumber('');
    setAddress('');
    setCity('');
    setError('');
    setInfo('');
    setPendingVerificationEmail('');
    setForgotPasswordMode(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError('');
    setInfo('');
    setForgotPasswordMode(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    setTimeout(() => {
      if (mode === 'login') {
        const result = login(email, password);
        if (!result.success) {
          setError(result.error || 'Errore di accesso');
          if (result.requiresEmailVerification && result.email) setPendingVerificationEmail(result.email);
          setLoading(false);
          return;
        }
        setLoading(false);
        handleClose();
        return;
      }

      if (!name.trim()) { setError('Inserisci nome e cognome'); setLoading(false); return; }
      if (!phone.trim()) { setError('Inserisci il telefono'); setLoading(false); return; }
      if (password.length < 6) { setError('La password deve avere almeno 6 caratteri'); setLoading(false); return; }

      const result = register({ email, password, name, phone, role });
      if (!result.success) {
        setError(result.error || 'Errore di registrazione');
        setLoading(false);
        return;
      }

      const registeredEmail = result.email || email;
      setPendingVerificationEmail(registeredEmail);
      void postEmailApi('send-verification-email', { email: registeredEmail });
      setInfo(`Account creato. Ti abbiamo inviato una mail di conferma a ${registeredEmail}.`);
      setMode('login');
      setLoading(false);
    }, 200);
  };

  const handleResend = async () => {
    const targetEmail = pendingVerificationEmail || email;
    if (!targetEmail) {
      setError('Inserisci una email valida prima di richiedere un nuovo invio.');
      return;
    }
    const result = resendVerificationEmail(targetEmail);
    if (!result.success) {
      setError(result.error || 'Impossibile reinviare la mail in questo momento.');
      return;
    }
    await postEmailApi('send-verification-email', { email: targetEmail });
    setInfo(`Ti abbiamo inviato una nuova email di conferma a ${targetEmail}. Controlla anche Spam/Promozioni.`);
    setError('');
    setInfo('');
    setPendingVerificationEmail('');
  };

  const handleConfirmVerified = () => {
    const targetEmail = pendingVerificationEmail || email;
    if (!targetEmail) {
      setError('Nessuna email da verificare.');
      return;
    }
    const result = verifyEmail(targetEmail);
    if (!result.success) {
      setError(result.error || 'Verifica non riuscita.');
      return;
    }
    setInfo('Email confermata con successo. Ora puoi accedere.');
    setError('');
    setPendingVerificationEmail('');
  };

  const handlePasswordReset = async () => {
    setError('');
    setInfo('');
    if (!email.trim()) {
      setError('Inserisci la tua email per recuperare la password.');
      return;
    }
    const result = requestPasswordReset(email);
    if (!result.success || !result.temporaryPassword) {
      setError(result.error || 'Impossibile recuperare la password.');
      return;
    }
    const sent = await postEmailApi('send-reset-password-email', {
      email,
      temporaryPassword: result.temporaryPassword,
    });
    if (sent) {
      setInfo(`Email di recupero inviata a ${email}. Controlla anche Spam/Promozioni.`);
      return;
    }
    setInfo(`Password temporanea generata: ${result.temporaryPassword}. Configura endpoint email per invio automatico.`);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={handleClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Intestazione ── */}
        <div className="relative bg-gradient-to-r from-green-500 to-green-600 px-6 py-5">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            aria-label="Chiudi"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {forgotPasswordMode
                  ? 'Recupera password'
                  : mode === 'login'
                    ? 'Accedi al tuo account'
                    : 'Crea il tuo account'}
              </h2>
              <p className="text-sm text-white/80">
                {forgotPasswordMode
                  ? 'Inserisci la tua email per il recupero'
                  : mode === 'login'
                    ? 'Accedi per gestire ordini e preferiti'
                    : 'Registrati per acquistare attrezzature professionali'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Toggle Login / Registrazione ── */}
        {!forgotPasswordMode && (
          <div className="mx-6 mt-5 grid grid-cols-2 rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
                mode === 'login'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Accedi
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
                mode === 'register'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Registrati
            </button>
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6 max-h-[65vh] overflow-y-auto">

          {/* Tipo account (solo registrazione) */}
          {mode === 'register' && !forgotPasswordMode && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Tipo di account</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`rounded-xl border-2 p-3 text-left transition-all ${
                    role === 'client'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User className={`mb-1 h-5 w-5 ${role === 'client' ? 'text-green-600' : 'text-gray-400'}`} />
                  <p className="text-sm font-bold text-gray-800">Cliente</p>
                  <p className="text-xs text-gray-500">Acquista prodotti</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('pro')}
                  className={`rounded-xl border-2 p-3 text-left transition-all ${
                    role === 'pro'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Crown className={`mb-1 h-5 w-5 ${role === 'pro' ? 'text-amber-600' : 'text-gray-400'}`} />
                  <p className="text-sm font-bold text-gray-800">Pro</p>
                  <p className="text-xs text-gray-500">Rivenditore / Professionista</p>
                </button>
              </div>
            </div>
          )}

          {/* Nome e Cognome */}
          {mode === 'register' && !forgotPasswordMode && (
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Nome e Cognome *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors"
                  placeholder="Mario Rossi" required
                />
              </div>
            </div>
          )}

          {/* Ragione Sociale */}
          {mode === 'register' && !forgotPasswordMode && (
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Ragione Sociale</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors"
                  placeholder="Nome azienda S.r.l."
                />
              </div>
            </div>
          )}

          {/* Partita IVA */}
          {mode === 'register' && !forgotPasswordMode && (
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Partita IVA</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text" value={vatNumber} onChange={e => setVatNumber(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors"
                  placeholder="IT01234567890"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors"
                placeholder="mario@esempio.it" required
              />
            </div>
          </div>

          {/* Password */}
          {!forgotPasswordMode && (
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  minLength={mode === 'register' ? 6 : undefined}
                  className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-10 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors"
                  placeholder={mode === 'register' ? 'Minimo 6 caratteri' : 'Inserisci password'} required
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Telefono */}
          {mode === 'register' && !forgotPasswordMode && (
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Telefono *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors"
                  placeholder="+39 333 123 4567" required
                />
              </div>
            </div>
          )}

          {/* Indirizzo e Citta (registrazione) */}
          {mode === 'register' && !forgotPasswordMode && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Indirizzo</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text" value={address} onChange={e => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors"
                    placeholder="Via Roma 1"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Citta</label>
                <input
                  type="text" value={city} onChange={e => setCity(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 py-2.5 px-3 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors"
                  placeholder="Milano"
                />
              </div>
            </div>
          )}

          {/* Messaggi errore e info */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}
          {info && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
              {info}
            </div>
          )}

          {/* Verifica email pendente */}
          {pendingVerificationEmail && !forgotPasswordMode && (
            <div className="space-y-2 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-900">Conferma email richiesta</p>
              <p className="text-xs text-blue-700">
                Abbiamo inviato una email di conferma a {pendingVerificationEmail}. Controlla anche la cartella Spam.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button" onClick={handleResend}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  <Send className="h-4 w-4" /> Invia nuova email
                </button>
                <button
                  type="button" onClick={handleConfirmVerified}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4" /> Ho confermato
                </button>
              </div>
            </div>
          )}

          {/* Bottoni azione */}
          {forgotPasswordMode ? (
            <div className="space-y-3 pt-2">
              <button
                type="button" onClick={handlePasswordReset}
                className="w-full rounded-xl bg-green-500 py-3 text-sm font-bold text-white hover:bg-green-600 transition-colors"
              >
                Invia email di recupero
              </button>
              <button
                type="button"
                onClick={() => { setForgotPasswordMode(false); setError(''); setInfo(''); }}
                className="w-full rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Torna al login
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <button
                type="submit" disabled={loading}
                className="w-full rounded-xl bg-green-500 py-3 text-sm font-bold text-white hover:bg-green-600 disabled:opacity-60 transition-colors"
              >
                {actionLabel}
              </button>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => { setForgotPasswordMode(true); setError(''); setInfo(''); }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <KeyRound className="h-4 w-4" /> Password dimenticata?
                </button>
              )}
            </div>
          )}

          {/* Nota P.IVA per registrazione */}
          {mode === 'register' && !forgotPasswordMode && (
            <p className="text-center text-xs text-gray-400 pt-1">
              La vendita e riservata a possessori di Partita IVA. I dati fiscali saranno verificati dopo la registrazione.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
