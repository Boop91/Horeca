# Roadmap e Strategia di Autenticazione (Auth) - Progetto Horeca B2B

Questo documento definisce la strategia, l'architettura e la roadmap per l'implementazione del sistema di Autenticazione (Registration, Login, Session Management, e Autorizzazioni) del progetto e-commerce Horeca B2B.

## 1. Obiettivi e Requisiti B2B
- **Flusso Differenziato**: Il sistema deve gestire la registrazione specifica per utenti Business (Horeca) che richiede campi come Ragione Sociale, Partita IVA, PEC e Codice SDI.
- **Validazione P.IVA/VIES**: Implementazione di un controllo sulla validità della Partita IVA o approvazione manuale degli account B2B prima di mostrare i prezzi riservati o permettere l'acquisto.
- **Sicurezza e UX**: Login fluido, recupero password sicuro (Magic Link o OTP), e sessioni persistenti sicure (JWT/Cookies).

## 2. Architettura Proposta
- **Provider / Tecnologia**: [Da definire, es: NextAuth/Auth.js, Supabase Auth, Firebase, o Custom Backend JWT].
- **Gestione Sessione**: HTTP-Only Cookies per una maggiore sicurezza contro attachi XSS, oppure JWT nel local storage a seconda dell'infrastruttura.
- **Ruoli (RBAC - Role Based Access Control)**:
  - `Guest`: Può navigare il catalogo (senza visualizzare prezzi o con prezzi al pubblico, a seconda delle regole di business).
  - `Customer (B2B Approved)`: Visualizza listini riservati, effettua checkout B2B, accede all'Area Account Cliente.
  - `Customer (B2B Pending)`: Registrato ma in attesa di validazione manuale aziendale.
  - `Admin`: Accesso all'Area Account Admin per gestione ordini, catalogo, approvazione utenti.

## 3. Roadmap di Implementazione

### Fase 1: Setup dell'Infrastruttura Auth Naturale
1. Scelta del provider di autenticazione o setup librerie backend.
2. Definizione del modello Dati Utente (User Schema) nel database (inclusi i campi estesi: `vat_number`, `sdi_code`, `company_name`, `role`, `status`).
3. Setup iniziale configurazione auth (chiavi API, secret).

### Fase 2: Sviluppo UI e Flussi Frontend (Ispirati a Bianchi Pro)
1. **Pagina di Login / Modal Login**: Creazione componente pulito e moderno (email, password, 'Ricordami', 'Password Dimenticata').
2. **Pagina di Registrazione B2B**:
   - Step 1: Dati base (Email, Password).
   - Step 2: Dati Aziendali (Ragione Sociale, P.IVA, SDI, Indirizzo sede legale).
3. **Flusso "Password Dimenticata" / Reset Password**: Invio email con token e pagina di impostazione nuova password.

### Fase 3: Integrazione Backend e Logiche di Ruolo
1. Protezione API Routes: Solo utenti autenticati e approvati possono effettuare richieste al checkout.
2. Gestione Middleware: Redirect utenti `Guest` dalle pagine protette (es: Dashboard, Checkout).
3. Logica Approvazione Utente B2B: Notifica all'admin al momento della registrazione e sblocco manuale status `Approved`.

### Fase 4: Integrazione Area Account (Come da piano UX/UI)
1. Collegamento dei dati dell'utente loggato alla **Dashboard Cliente**.
2. Collegamento all'**Area Admin Horeca** per validare gli utenti registrati.

### Fase 5: Sicurezza e Test
1. Validazione input form (es: formato P.IVA, forza della password).
2. Rate limiting su login e reset password per evitare attacchi Brute Force.
3. Test end-to-end del flusso completo (Registrazione -> Approvazione Admin -> Login -> Acquisto).

---

*Nota: Questo documento servirà da guida passo-passo durante lo sviluppo vero e proprio dell'infrastruttura auth.*
