import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'client' | 'pro' | 'admin';

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'commission' | 'withdrawal_request';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'approved' | 'rejected';
  relatedUser?: string;
  orderId?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  iban?: string;
  method: 'bank_transfer' | 'card';
}

export interface ReferralUsage {
  userId: string;
  userName: string;
  orderId: string;
  orderTotal: number;
  shippingCost: number;
  commissionAmount: number;
  date: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  // B2B fields
  ragione_sociale?: string;
  partita_iva?: string;
  codice_fiscale?: string;
  codice_destinatario_sdi?: string;
  pec?: string;
  // Pro-specific fields
  referralCode?: string;
  referralUsages?: ReferralUsage[];
  // Wallet
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  withdrawalRequests: WithdrawalRequest[];
  // Stripe
  stripeCustomerId?: string;
  emailVerified?: boolean;
  verificationSentAt?: string;
}

interface AuthContextType {
  user: User | null;
  allUsers: User[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; requiresEmailVerification?: boolean; email?: string }> | { success: boolean; error?: string; requiresEmailVerification?: boolean; email?: string };
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string; requiresEmailVerification?: boolean; email?: string }> | { success: boolean; error?: string; requiresEmailVerification?: boolean; email?: string };
  resendVerificationEmail: (email: string) => { success: boolean; error?: string };
  verifyEmail: (email: string) => { success: boolean; error?: string };
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string; temporaryPassword?: string }> | { success: boolean; error?: string; temporaryPassword?: string };
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addWalletTransaction: (transaction: Omit<WalletTransaction, 'id' | 'date'>) => void;
  requestWithdrawal: (amount: number, method: 'bank_transfer' | 'card', iban?: string) => { success: boolean; error?: string };
  approveWithdrawal: (requestId: string, userId: string) => void;
  rejectWithdrawal: (requestId: string, userId: string) => void;
  applyReferralCode: (code: string, orderId: string, orderTotal: number, shippingCost: number, buyerName: string, buyerId: string) => { success: boolean; discount: number; error?: string };
  getAllWithdrawalRequests: () => (WithdrawalRequest & { userEmail: string })[];
  getUserById: (id: string) => User | undefined;
  depositToWallet: (amount: number) => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  companyName?: string;
  vatNumber?: string;
  fiscalCode?: string;
  address?: string;
  city?: string;
  cap?: string;
  province?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ──────────────────────────────────────────────
// Mock (localStorage) helpers – used when Supabase is not configured
// ──────────────────────────────────────────────

const STORAGE_KEY = 'bianchipro_users';
const SESSION_KEY = 'bianchipro_session';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function generateTemporaryPassword(): string {
  return `Tmp-${Math.random().toString(36).slice(2, 6)}${Math.floor(100 + Math.random() * 900)}`;
}

function loadUsers(): (User & { password: string })[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data) as (User & { password: string })[];
      return parsed.map(u => ({
        ...u,
        emailVerified: typeof u.emailVerified === 'boolean' ? u.emailVerified : true,
      }));
    }
  } catch { /* empty */ }

  const admin: User & { password: string } = {
    id: 'admin-001',
    email: 'admin@bianchipro.it',
    password: 'admin123',
    name: 'Admin Bianchi',
    phone: '+39 000 000 0000',
    role: 'admin',
    createdAt: new Date().toISOString(),
    walletBalance: 0,
    walletTransactions: [],
    withdrawalRequests: [],
    emailVerified: true,
  };

  const demoClient: User & { password: string } = {
    id: 'client-001',
    email: 'cliente@test.it',
    password: 'test123',
    name: 'Mario Rossi',
    phone: '+39 333 123 4567',
    role: 'client',
    createdAt: new Date().toISOString(),
    walletBalance: 150.00,
    walletTransactions: [
      { id: 'tx-1', type: 'deposit', amount: 200, description: 'Ricarica wallet con carta', date: new Date(Date.now() - 86400000 * 5).toISOString(), status: 'completed' },
      { id: 'tx-2', type: 'withdrawal', amount: -50, description: 'Pagamento ordine #ORD-001', date: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'completed' },
    ],
    withdrawalRequests: [],
    emailVerified: true,
  };

  const demoPro: User & { password: string } = {
    id: 'pro-001',
    email: 'pro@test.it',
    password: 'test123',
    name: 'Luca Bianchi',
    phone: '+39 333 987 6543',
    role: 'pro',
    createdAt: new Date().toISOString(),
    referralCode: 'PRO-LUCA-A1B2',
    referralUsages: [
      { userId: 'client-001', userName: 'Mario Rossi', orderId: 'ORD-DEMO-1', orderTotal: 4106.52, shippingCost: 120, commissionAmount: 6.00, date: new Date(Date.now() - 86400000 * 3).toISOString() },
    ],
    walletBalance: 56.00,
    walletTransactions: [
      { id: 'tx-p1', type: 'commission', amount: 6.00, description: 'Commissione 5% su spedizione - Mario Rossi', date: new Date(Date.now() - 86400000 * 3).toISOString(), status: 'completed', relatedUser: 'Mario Rossi', orderId: 'ORD-DEMO-1' },
      { id: 'tx-p2', type: 'deposit', amount: 50, description: 'Ricarica wallet con carta', date: new Date(Date.now() - 86400000 * 7).toISOString(), status: 'completed' },
    ],
    withdrawalRequests: [],
    emailVerified: true,
  };

  const users = [admin, demoClient, demoPro];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  return users;
}

function saveUsers(users: (User & { password: string })[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// ──────────────────────────────────────────────
// Supabase helpers
// ──────────────────────────────────────────────

function mapSupabaseUser(su: SupabaseUser, profile?: Record<string, unknown> | null): User {
  return {
    id: su.id,
    email: su.email ?? '',
    name: (profile?.name as string) ?? su.user_metadata?.name ?? '',
    phone: (profile?.telefono as string) ?? su.phone ?? '',
    role: ((profile?.ruolo as string) ?? 'client') as UserRole,
    createdAt: su.created_at,
    ragione_sociale: profile?.ragione_sociale as string | undefined,
    partita_iva: profile?.partita_iva as string | undefined,
    codice_fiscale: profile?.codice_fiscale as string | undefined,
    codice_destinatario_sdi: profile?.codice_destinatario_sdi as string | undefined,
    pec: profile?.pec as string | undefined,
    walletBalance: 0,
    walletTransactions: [],
    withdrawalRequests: [],
    emailVerified: !!su.email_confirmed_at,
  };
}

async function fetchProfile(userId: string): Promise<Record<string, unknown> | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from('users_profile')
    .select('*')
    .eq('user_id', userId)
    .single();
  return data;
}

// ──────────────────────────────────────────────
// Supabase Auth Provider
// ──────────────────────────────────────────────

function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        const profile = await fetchProfile(s.user.id);
        setUser(mapSupabaseUser(s.user, profile));
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        setSession(s);
        if (s?.user) {
          const profile = await fetchProfile(s.user.id);
          setUser(mapSupabaseUser(s.user, profile));
        } else {
          setUser(null);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!supabase) return { success: false, error: 'Supabase non configurato' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const register = async (data: RegisterData) => {
    if (!supabase) return { success: false, error: 'Supabase non configurato' };
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          phone: data.phone,
          role: 'client',
          companyName: data.companyName,
          vatNumber: data.vatNumber,
          fiscalCode: data.fiscalCode,
          address: data.address,
          city: data.city,
          cap: data.cap,
          province: data.province,
        },
      },
    });
    if (error) return { success: false, error: error.message };

    // Create profile row
    if (authData.user) {
      await supabase.from('users_profile').insert({
        user_id: authData.user.id,
        telefono: data.phone,
        ruolo: 'client', // DB only has admin|client
        ragione_sociale: data.companyName,
        partita_iva: data.vatNumber,
        codice_fiscale: data.fiscalCode,
      });
    }

    return { success: true, requiresEmailVerification: true, email: data.email };
  };

  const resendVerificationEmail = (_email: string) => {
    // Supabase handles this via resend endpoint; keeping sync signature for compat
    if (supabase) {
      supabase.auth.resend({ type: 'signup', email: _email });
    }
    return { success: true };
  };

  const verifyEmail = (_email: string) => {
    // Handled automatically by Supabase email confirmation link
    return { success: true };
  };

  const requestPasswordReset = async (email: string) => {
    if (!supabase) return { success: false, error: 'Supabase non configurato' };
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const logout = () => {
    supabase?.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!session?.user || !supabase) return;
    // Update profile in Supabase (fire-and-forget)
    const profileUpdates: Record<string, unknown> = {};
    if (updates.ragione_sociale !== undefined) profileUpdates.ragione_sociale = updates.ragione_sociale;
    if (updates.partita_iva !== undefined) profileUpdates.partita_iva = updates.partita_iva;
    if (updates.codice_fiscale !== undefined) profileUpdates.codice_fiscale = updates.codice_fiscale;
    if (updates.codice_destinatario_sdi !== undefined) profileUpdates.codice_destinatario_sdi = updates.codice_destinatario_sdi;
    if (updates.pec !== undefined) profileUpdates.pec = updates.pec;
    if (updates.phone !== undefined) profileUpdates.telefono = updates.phone;

    if (Object.keys(profileUpdates).length > 0) {
      supabase.from('users_profile').update(profileUpdates).eq('user_id', session.user.id).then();
    }

    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  // Wallet operations are not yet backed by Supabase – local state stubs
  const addWalletTransaction = (_transaction: Omit<WalletTransaction, 'id' | 'date'>) => {};
  const depositToWallet = (_amount: number) => {};
  const requestWithdrawal = (_amount: number, _method: 'bank_transfer' | 'card', _iban?: string) => ({ success: false as const, error: 'Non disponibile in modalita Supabase' });
  const approveWithdrawal = (_requestId: string, _userId: string) => {};
  const rejectWithdrawal = (_requestId: string, _userId: string) => {};
  const applyReferralCode = (_code: string, _orderId: string, _orderTotal: number, _shippingCost: number, _buyerName: string, _buyerId: string) => ({ success: false as const, discount: 0, error: 'Non disponibile in modalita Supabase' });
  const getAllWithdrawalRequests = () => [] as (WithdrawalRequest & { userEmail: string })[];
  const getUserById = (_id: string) => undefined as User | undefined;

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{
      user,
      allUsers: [],
      login,
      register,
      resendVerificationEmail,
      verifyEmail,
      requestPasswordReset,
      logout,
      updateUser,
      addWalletTransaction,
      requestWithdrawal,
      approveWithdrawal,
      rejectWithdrawal,
      applyReferralCode,
      getAllWithdrawalRequests,
      getUserById,
      depositToWallet,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ──────────────────────────────────────────────
// Mock Auth Provider (localStorage fallback)
// ──────────────────────────────────────────────

function MockAuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<(User & { password: string })[]>(() => loadUsers());
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(SESSION_KEY);
    } catch { return null; }
  });

  const user = users.find(u => u.id === currentUserId) || null;

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(SESSION_KEY, currentUserId);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [currentUserId]);

  const login = (email: string, password: string) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return { success: false, error: 'Email o password non corretti' };
    if (found.role !== 'admin' && !found.emailVerified) {
      return {
        success: false,
        error: 'Devi confermare la tua email prima di accedere.',
        requiresEmailVerification: true,
        email: found.email,
      };
    }
    setCurrentUserId(found.id);
    return { success: true };
  };

  const register = (data: RegisterData) => {
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'Email già registrata' };
    }
    const newUser: User & { password: string } = {
      id: `client-${generateId()}`,
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      role: 'client',
      createdAt: new Date().toISOString(),
      ragione_sociale: data.companyName,
      partita_iva: data.vatNumber,
      codice_fiscale: data.fiscalCode,
      walletBalance: 0,
      walletTransactions: [],
      withdrawalRequests: [],
      emailVerified: false,
      verificationSentAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    return { success: true, requiresEmailVerification: true, email: newUser.email };
  };

  const resendVerificationEmail = (email: string) => {
    const target = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!target) return { success: false, error: 'Utente non trovato' };
    setUsers(prev => prev.map(u =>
      u.id === target.id
        ? { ...u, verificationSentAt: new Date().toISOString() }
        : u
    ));
    return { success: true };
  };

  const verifyEmail = (email: string) => {
    const target = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!target) return { success: false, error: 'Utente non trovato' };
    setUsers(prev => prev.map(u =>
      u.id === target.id
        ? { ...u, emailVerified: true }
        : u
    ));
    return { success: true };
  };

  const requestPasswordReset = (email: string) => {
    const target = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!target) return { success: false, error: 'Email non trovata' };

    const temporaryPassword = generateTemporaryPassword();
    setUsers(prev => prev.map(u =>
      u.id === target.id
        ? { ...u, password: temporaryPassword }
        : u
    ));

    return { success: true, temporaryPassword };
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!currentUserId) return;
    setUsers(prev => prev.map(u => u.id === currentUserId ? { ...u, ...updates } : u));
  };

  const addWalletTransaction = (transaction: Omit<WalletTransaction, 'id' | 'date'>) => {
    if (!currentUserId) return;
    const tx: WalletTransaction = {
      ...transaction,
      id: `tx-${generateId()}`,
      date: new Date().toISOString(),
    };
    setUsers(prev => prev.map(u => {
      if (u.id !== currentUserId) return u;
      return {
        ...u,
        walletBalance: u.walletBalance + transaction.amount,
        walletTransactions: [tx, ...u.walletTransactions],
      };
    }));
  };

  const depositToWallet = (amount: number) => {
    addWalletTransaction({
      type: 'deposit',
      amount,
      description: `Ricarica wallet con carta`,
      status: 'completed',
    });
  };

  const requestWithdrawal = (amount: number, method: 'bank_transfer' | 'card', iban?: string) => {
    if (!user) return { success: false, error: 'Non autenticato' };
    if (amount <= 0) return { success: false, error: 'Importo non valido' };
    if (amount > user.walletBalance) return { success: false, error: 'Saldo insufficiente' };

    const request: WithdrawalRequest = {
      id: `wr-${generateId()}`,
      userId: user.id,
      userName: user.name,
      amount,
      date: new Date().toISOString(),
      status: 'pending',
      iban,
      method,
    };

    setUsers(prev => prev.map(u => {
      if (u.id !== user.id) return u;
      return {
        ...u,
        walletBalance: u.walletBalance - amount,
        withdrawalRequests: [request, ...u.withdrawalRequests],
        walletTransactions: [{
          id: `tx-${generateId()}`,
          type: 'withdrawal_request',
          amount: -amount,
          description: `Richiesta prelievo - ${method === 'bank_transfer' ? 'Bonifico' : 'Carta'}`,
          date: new Date().toISOString(),
          status: 'pending',
        }, ...u.walletTransactions],
      };
    }));

    return { success: true };
  };

  const approveWithdrawal = (requestId: string, userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      return {
        ...u,
        withdrawalRequests: u.withdrawalRequests.map(r =>
          r.id === requestId ? { ...r, status: 'approved' as const } : r
        ),
        walletTransactions: u.walletTransactions.map(t =>
          t.description.includes('Richiesta prelievo') && t.status === 'pending'
            ? { ...t, status: 'completed' as const, description: t.description.replace('Richiesta prelievo', 'Prelievo approvato') }
            : t
        ),
      };
    }));
  };

  const rejectWithdrawal = (requestId: string, userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      const request = u.withdrawalRequests.find(r => r.id === requestId);
      const refundAmount = request ? request.amount : 0;
      return {
        ...u,
        walletBalance: u.walletBalance + refundAmount,
        withdrawalRequests: u.withdrawalRequests.map(r =>
          r.id === requestId ? { ...r, status: 'rejected' as const } : r
        ),
        walletTransactions: [{
          id: `tx-${generateId()}`,
          type: 'deposit',
          amount: refundAmount,
          description: 'Rimborso - Richiesta prelievo rifiutata',
          date: new Date().toISOString(),
          status: 'completed',
        }, ...u.walletTransactions.map(t =>
          t.description.includes('Richiesta prelievo') && t.status === 'pending'
            ? { ...t, status: 'rejected' as const }
            : t
        )],
      };
    }));
  };

  const applyReferralCode = (code: string, orderId: string, orderTotal: number, shippingCost: number, buyerName: string, buyerId: string) => {
    const proUser = users.find(u => u.role === 'pro' && u.referralCode === code.toUpperCase());
    if (!proUser) return { success: false, discount: 0, error: 'Codice referral non valido' };
    if (proUser.id === currentUserId) return { success: false, discount: 0, error: 'Non puoi usare il tuo stesso codice' };

    const discount = shippingCost * 0.05;
    const commission = shippingCost * 0.05;

    const usage: ReferralUsage = {
      userId: buyerId,
      userName: buyerName,
      orderId,
      orderTotal,
      shippingCost,
      commissionAmount: commission,
      date: new Date().toISOString(),
    };

    setUsers(prev => prev.map(u => {
      if (u.id === proUser.id) {
        return {
          ...u,
          walletBalance: u.walletBalance + commission,
          referralUsages: [...(u.referralUsages || []), usage],
          walletTransactions: [{
            id: `tx-${generateId()}`,
            type: 'commission',
            amount: commission,
            description: `Commissione 5% su spedizione - ${buyerName}`,
            date: new Date().toISOString(),
            status: 'completed',
            relatedUser: buyerName,
            orderId,
          }, ...u.walletTransactions],
        };
      }
      return u;
    }));

    return { success: true, discount };
  };

  const getAllWithdrawalRequests = () => {
    const requests: (WithdrawalRequest & { userEmail: string })[] = [];
    users.forEach(u => {
      u.withdrawalRequests.forEach(r => {
        requests.push({ ...r, userEmail: u.email });
      });
    });
    return requests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getUserById = (id: string) => users.find(u => u.id === id);

  const allUsers = users.filter(u => u.role !== 'admin');

  return (
    <AuthContext.Provider value={{
      user: user ? { ...user, password: undefined } as unknown as User : null,
      allUsers: allUsers.map(u => ({ ...u, password: undefined } as unknown as User)),
      login,
      register,
      resendVerificationEmail,
      verifyEmail,
      requestPasswordReset,
      logout,
      updateUser,
      addWalletTransaction,
      requestWithdrawal,
      approveWithdrawal,
      rejectWithdrawal,
      applyReferralCode,
      getAllWithdrawalRequests,
      getUserById,
      depositToWallet,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ──────────────────────────────────────────────
// Exported provider – switches automatically
// ──────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  if (isSupabaseConfigured()) {
    return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>;
  }
  return <MockAuthProvider>{children}</MockAuthProvider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
