import { useMemo, useState } from 'react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Shield, Crown, CheckCircle2, Send, KeyRound } from 'lucide-react';
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const actionLabel = useMemo(() => {
    if (loading) return 'Verifica in corso...';
    return mode === 'login' ? 'Accedi' : 'Registrati';
  }, [loading, mode]);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setError('');
    setInfo('');
    setPendingVerificationEmail('');
    setForgotPasswordMode(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
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
    <div className="fixed inset-0 z-[60] bg-black/55 p-4" onClick={handleClose}>
      <div className="mx-auto mt-8 flex min-h-[calc(100vh-2rem)] items-start justify-center sm:mt-10 md:mt-14">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="relative rounded-t-2xl border-b border-slate-200 bg-white px-5 py-4">
            <button onClick={handleClose} className="absolute right-3 top-3 rounded-full p-1.5 hover:bg-slate-100" aria-label="Chiudi modal">
              <X className="h-5 w-5 text-slate-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
                <Shield className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{forgotPasswordMode ? 'Recupera password' : mode === 'login' ? 'Accedi al tuo account' : 'Crea il tuo account'}</h2>
                <p className="text-xs text-slate-500">Pannello compatto, centrato e leggibile.</p>
              </div>
            </div>
          </div>

          {!forgotPasswordMode && (
            <div className="mx-5 mt-4 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <button type="button" onClick={() => { setMode('login'); setError(''); setInfo(''); }} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${mode === 'login' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:bg-white'}`}>
                Accedi
              </button>
              <button type="button" onClick={() => { setMode('register'); setError(''); setInfo(''); }} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${mode === 'register' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:bg-white'}`}>
                Registrati
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 p-5">
            {mode === 'register' && !forgotPasswordMode && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Tipo di account</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setRole('client')} className={`rounded-xl border p-3 text-left ${role === 'client' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}>
                    <User className={`mb-1 h-5 w-5 ${role === 'client' ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <p className="text-sm font-bold text-slate-800">Cliente</p>
                    <p className="text-xs text-slate-500">Acquista prodotti</p>
                  </button>
                  <button type="button" onClick={() => setRole('pro')} className={`rounded-xl border p-3 text-left ${role === 'pro' ? 'border-amber-500 bg-amber-50' : 'border-slate-200'}`}>
                    <Crown className={`mb-1 h-5 w-5 ${role === 'pro' ? 'text-amber-600' : 'text-slate-400'}`} />
                    <p className="text-sm font-bold text-slate-800">Pro</p>
                    <p className="text-xs text-slate-500">Guadagna commissioni</p>
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && !forgotPasswordMode && (
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Nome e Cognome</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none" placeholder="Mario Rossi" required />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none" placeholder="mario@esempio.it" required />
              </div>
            </div>

            {!forgotPasswordMode && (
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} minLength={mode === 'register' ? 6 : undefined} className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-10 text-sm focus:border-emerald-500 focus:outline-none" placeholder="Inserisci password" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && !forgotPasswordMode && (
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Telefono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none" placeholder="+39 333 123 4567" required />
                </div>
              </div>
            )}

            {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>}
            {info && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">{info}</div>}

            {pendingVerificationEmail && !forgotPasswordMode && (
              <div className="space-y-2 rounded-xl border border-blue-200 bg-blue-50 p-3">
                <p className="text-sm font-semibold text-blue-900">Conferma email richiesta</p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={handleResend} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    <Send className="h-4 w-4" /> Invia nuova email
                  </button>
                  <button type="button" onClick={handleConfirmVerified} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                    <CheckCircle2 className="h-4 w-4" /> Ho confermato
                  </button>
                </div>
              </div>
            )}

            {forgotPasswordMode ? (
              <>
                <button type="button" onClick={handlePasswordReset} className="w-full rounded-xl bg-emerald-700 py-2.5 text-sm font-bold text-white hover:bg-emerald-800">
                  Invia email recupero password
                </button>
                <button type="button" onClick={() => { setForgotPasswordMode(false); setError(''); setInfo(''); }} className="w-full rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Torna al login
                </button>
              </>
            ) : (
              <>
                <button type="submit" disabled={loading} className="w-full rounded-xl bg-emerald-700 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-60">
                  {actionLabel}
                </button>
                {mode === 'login' && (
                  <button type="button" onClick={() => { setForgotPasswordMode(true); setError(''); setInfo(''); }} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <KeyRound className="h-4 w-4" /> Recupera Password
                  </button>
                )}
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
