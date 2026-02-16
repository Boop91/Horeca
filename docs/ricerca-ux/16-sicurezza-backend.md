# 16 - Sicurezza Backend

## Obiettivo
Definire i requisiti di sicurezza per il backend di bianchipro.it, coprendo autenticazione, sessioni, database e API per proteggere dati aziendali e transazioni B2B.

## Principi scientifici
- **Defense in Depth** (NIST): molteplici livelli di sicurezza riducono il rischio complessivo
- **Principle of Least Privilege** (Saltzer & Schroeder, 1975): ogni componente ha solo i permessi necessari
- **OWASP Top 10** (2021): riferimento per le vulnerabilita web piu comuni

## Autenticazione

### Supabase Auth
- Provider: email/password come metodo primario
- Password policy: min 8 caratteri, 1 maiuscola, 1 numero, 1 speciale
- Rate limiting: max 5 tentativi login in 15 minuti
- Lockout: blocco account per 30 minuti dopo 5 tentativi falliti
- 2FA opzionale: TOTP (app authenticator)

### Gestione sessioni
- JWT tokens con scadenza 1 ora (access token)
- Refresh token con scadenza 7 giorni
- Refresh token rotation (invalida il token precedente)
- Logout: invalida tutti i token attivi
- Sessioni multiple visibili nell'account utente

### OAuth (futuro)
- Google Sign-In per accesso rapido
- Mapping account OAuth a profilo B2B esistente

## Sicurezza Database (Supabase/PostgreSQL)

### Row Level Security (RLS)
- Ogni tabella ha policy RLS attive
- Gli utenti vedono solo i propri ordini e dati
- Gli admin hanno policy separate con ruoli verificati
- Nessun accesso diretto al database senza autenticazione

### Policy esempio
```
-- Utente vede solo i propri ordini
CREATE POLICY "users_own_orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Admin vede tutti gli ordini
CREATE POLICY "admin_all_orders" ON orders
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### Protezione dati sensibili
- P.IVA e dati fiscali: crittografia a riposo (AES-256)
- Password: hash con bcrypt (costo 12)
- PII: accesso loggato e auditabile
- Backup: crittografati e testati mensilmente

## Sicurezza API

### Protezione endpoint
- HTTPS obbligatorio (TLS 1.3)
- CORS configurato solo per domini autorizzati
- Rate limiting per endpoint: 100 req/min per utente
- Request size limit: 10MB
- Input validation su tutti i parametri

### Headers di sicurezza
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
```

### Protezione OWASP Top 10
| Rischio | Mitigazione |
|---------|-------------|
| Injection (SQL/XSS) | Query parametrizzate, sanitizzazione input, CSP |
| Broken Authentication | Supabase Auth, rate limiting, 2FA |
| Sensitive Data Exposure | HTTPS, crittografia a riposo, RLS |
| Broken Access Control | RLS, policy per ruolo, least privilege |
| Security Misconfiguration | Headers sicurezza, CORS restrittivo |
| CSRF | Token anti-CSRF, SameSite cookies |

## Pagamenti (Stripe)
- Chiavi API solo server-side (mai nel frontend)
- Webhook con verifica firma
- PCI DSS compliance tramite Stripe Elements
- Nessun dato carta memorizzato nel nostro database

## Logging e monitoring
- Log accessi con IP, device, timestamp
- Log azioni admin (audit trail)
- Alert per pattern sospetti (brute force, injection attempts)
- Retention log: 90 giorni

## Applicazione a bianchipro.it
- Supabase Auth come provider autenticazione
- RLS su tutte le tabelle
- Stripe per pagamenti PCI-compliant
- Headers di sicurezza su Netlify

## Decisioni prese
1. Supabase Auth con email/password + 2FA opzionale
2. JWT con access token 1h + refresh token 7g con rotation
3. RLS obbligatorio su tutte le tabelle Supabase
4. HTTPS + headers di sicurezza completi
5. Rate limiting 100 req/min per utente
6. Audit log per tutte le azioni admin e accessi sensibili
