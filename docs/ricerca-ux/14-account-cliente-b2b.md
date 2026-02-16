# 14 - Account Cliente B2B

## Obiettivo
Progettare l'area account per clienti professionali B2B con gestione completa dei dati fiscali italiani, storico ordini e funzionalita specifiche per il settore HoReCa.

## Principi scientifici
- **Self-Service Preference** (Forrester, 2023): il 72% dei clienti B2B preferisce gestire autonomamente il proprio account
- **Retention through UX** (Harvard Business Review): aumentare la retention del 5% incrementa i profitti del 25-95%
- **Personalization** (McKinsey, 2023): la personalizzazione aumenta le revenue del 10-15%

## Struttura account B2B

### Dashboard account
- Riepilogo ordini recenti (ultimi 5)
- Stato ordini in corso con tracking
- Quick actions: riordina, preventivo, supporto
- Notifiche (offerte personalizzate, stato ordini)

### Dati aziendali
| Sezione | Campi | Note |
|---------|-------|------|
| Anagrafica | Ragione Sociale, P.IVA, CF | Validati con VIES |
| Fatturazione | SDI, PEC, regime fiscale | Obbligatori per e-fattura |
| Indirizzo fatturazione | Via, CAP, Citta, Provincia | Principale + secondari |
| Indirizzi spedizione | Multipli | Per sedi diverse |
| Referenti | Nome, ruolo, email, telefono | Multi-utente per azienda |

### Validazione P.IVA
- Formato: IT + 11 cifre numeriche
- Validazione algoritmo: cifra di controllo con modulo 10
- Verifica VIES per operazioni intracomunitarie
- Auto-compilazione dati aziendali da lookup

### Storico ordini
- Lista ordini con filtro per data, stato, importo
- Dettaglio ordine con PDF fattura scaricabile
- Tracking spedizione integrato
- Funzione "Riordina" con un click (replica carrello)
- Export lista ordini in CSV/Excel

### Gestione preventivi
- Lista preventivi richiesti con stato
- Preventivo convertibile in ordine con un click
- Validita preventivo con scadenza visibile
- Storico comunicazioni per preventivo

### Wishlist / Liste prodotti
- Liste multiple (es. "Cucina sede A", "Rinnovo bar")
- Condivisione lista con colleghi (link)
- Notifica disponibilita per prodotti out of stock
- Confronto prodotti salvati (max 3)

### Programma fedelta (futuro)
- Punti accumulati per ordine
- Sconti progressivi per volume
- Accesso anticipato a promozioni
- Consulente dedicato sopra soglia

## Sicurezza account
- Autenticazione con Supabase Auth
- Password policy: min 8 chars, 1 maiuscola, 1 numero
- 2FA opzionale (TOTP o SMS)
- Sessioni attive visibili e revocabili
- Log accessi con IP e device

## Multi-utente aziendale
Un'azienda puo avere piu utenti con ruoli:
| Ruolo | Permessi |
|-------|----------|
| Admin | Tutto: ordini, dati aziendali, utenti |
| Buyer | Ordini, preventivi, wishlist |
| Viewer | Solo visualizzazione ordini e catalogo |

## Applicazione a bianchipro.it
- Supabase Auth per autenticazione
- Profilo B2B con dati fiscali completi
- Storico ordini con riordino rapido
- Gestione preventivi integrata
- Wishlist multiple condivisibili

## Decisioni prese
1. Account B2B con dati fiscali completi (SDI, PEC, P.IVA)
2. Auto-compilazione da P.IVA obbligatoria alla registrazione
3. Funzione "Riordina" per ordini precedenti
4. Wishlist multiple e condivisibili
5. Multi-utente aziendale con 3 livelli di ruolo
6. 2FA opzionale per sicurezza aggiuntiva
