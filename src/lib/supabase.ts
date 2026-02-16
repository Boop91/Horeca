/**
 * @file supabase.ts
 * @description Configurazione del client Supabase con modalità duale.
 *
 * Questo modulo gestisce la connessione a Supabase in due modalità:
 *
 *   1. MODALITÀ REALE (produzione):
 *      Se le variabili d'ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
 *      sono configurate (nel file .env), viene creato un client Supabase reale
 *      che si connette al database e all'autenticazione.
 *
 *   2. MODALITÀ FALLBACK (sviluppo locale senza Supabase):
 *      Se le variabili d'ambiente mancano, `supabase` sarà `null`.
 *      I componenti che usano questo client devono gestire il caso null
 *      (tipicamente mostrando dati mock o disabilitando le funzionalità backend).
 *
 * Variabili d'ambiente richieste (file .env):
 *   VITE_SUPABASE_URL      → URL del progetto Supabase (es. https://xxx.supabase.co)
 *   VITE_SUPABASE_ANON_KEY → Chiave anonima pubblica (safe per il client)
 *
 * Utilizzato da:
 *   - AuthContext.tsx (autenticazione utente)
 *   - Funzioni di fetch dati (prodotti, ordini, ecc.)
 *   - BackendStatus.tsx (per verificare la connessione)
 *
 * @see https://supabase.com/docs/reference/javascript/initializing
 */

import { createClient } from '@supabase/supabase-js';

// Legge le credenziali dalle variabili d'ambiente di Vite.
// Se non sono definite, usa stringa vuota (il client non verrà creato).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Client Supabase globale.
 * - Se URL e chiave sono presenti → client reale connesso a Supabase
 * - Se mancano → null (modalità fallback / sviluppo locale)
 *
 * I consumatori devono sempre verificare: if (supabase) { ... }
 */
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Verifica se Supabase è configurato e disponibile.
 * @returns true se il client è stato creato correttamente, false altrimenti
 */
export const isSupabaseConfigured = () => !!supabase;
