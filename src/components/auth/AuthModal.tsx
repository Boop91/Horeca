import { useMemo, useState } from 'react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Shield, Crown, CheckCircle2, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register, resendVerificationEmail, verifyEmail } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'client' | 'pro'>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const actionLabel = useMemo(() => {
    if (loading) return 'Verifica in corso...';
    return mode === 'login' ? 'Conferma credenziali' : 'Crea account e invia conferma email';
  }, [loading, mode]);

  if (!isOpen) return null;

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
          if (result.requiresEmailVerification && result.email) {
            setPendingVerificationEmail(result.email);
          }
          setLoading(false);
          return;
        }
        setLoading(false);
        onClose();
        resetForm();
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
      setInfo(`Ti abbiamo inviato una mail di conferma a ${registeredEmail}.`);
      setMode('login');
      setLoading(false);
    }, 350);
  };

  const handleResend = () => {
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
    setInfo(`Mail di conferma reinviata a ${targetEmail}. Controlla anche Spam/Promozioni.`);
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

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setError('');
    setInfo('');
    setPendingVerificationEmail('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[92vh] overflow-hidden border border-emerald-100">
        <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-5 rounded-t-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-3 pr-8">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{mode === 'login' ? 'Accedi al tuo account' : 'Registrati'}</h2>
              <p className="text-emerald-100 text-sm mt-0.5">Flusso semplice: compila, conferma email, poi accedi.</p>
            </div>
          </div>
        </div>

        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${mode === 'login' ? 'text-emerald-700 border-b-2 border-emerald-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Accedi
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${mode === 'register' ? 'text-emerald-700 border-b-2 border-emerald-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Registrati
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(92vh-142px)]">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tipo di account</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${role === 'client' ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <User className={`w-5 h-5 mb-1 ${role === 'client' ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <div className={`text-sm font-bold ${role === 'client' ? 'text-emerald-700' : 'text-gray-700'}`}>Cliente</div>
                  <div className="text-xs text-gray-500 mt-0.5">Acquista prodotti</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('pro')}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${role === 'pro' ? 'border-amber-500 bg-amber-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <Crown className={`w-5 h-5 mb-1 ${role === 'pro' ? 'text-amber-600' : 'text-gray-400'}`} />
                  <div className={`text-sm font-bold ${role === 'pro' ? 'text-amber-700' : 'text-gray-700'}`}>Pro</div>
                  <div className="text-xs text-gray-500 mt-0.5">Guadagna commissioni</div>
                </button>
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Nome e Cognome</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Mario Rossi" className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" required />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="mario@esempio.it" className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Inserisci password" className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" required minLength={mode === 'register' ? 6 : undefined} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Telefono</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+39 333 123 4567" className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" required />
              </div>
            </div>
          )}

          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm font-semibold text-red-700">{error}</div>}
          {info && <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm font-semibold text-emerald-700">{info}</div>}

          {pendingVerificationEmail && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-2">
              <p className="text-sm text-blue-900 font-semibold">Non hai ricevuto la mail di conferma?</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={handleResend} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700">
                  <Send className="w-4 h-4" /> Reinvia email
                </button>
                <button type="button" onClick={handleConfirmVerified} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700">
                  <CheckCircle2 className="w-4 h-4" /> Ho confermato la mail
                </button>
              </div>
            </div>
          )}

          <div className="pt-1 space-y-2">
            <button type="submit" disabled={loading} className="w-full min-h-11 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionLabel}</span>
            </button>
            <button type="button" onClick={onClose} className="w-full py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50">Annulla</button>
          </div>
        </form>
      </div>
    </div>
  );
}
