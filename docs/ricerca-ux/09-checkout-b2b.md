# 09 - Checkout B2B con Fatturazione Italiana

## Obiettivo
Progettare un processo di checkout ottimizzato per il B2B italiano, integrando nativamente la fatturazione elettronica (SDI/PEC) e riducendo l'abbandono del carrello.

## Principi scientifici
- **Checkout Abandonment**: il 70% degli utenti abbandona il carrello (Baymard Institute)
- **Form Optimization**: il checkout ideale ha 12-14 campi; la media dei siti e 23.48 (Baymard)
- **Progress Indicator** (Krug, 2000): gli utenti completano piu facilmente processi con indicatore di avanzamento
- **Default Effect** (Johnson & Goldstein, 2003): le opzioni pre-selezionate vengono scelte il 70% in piu

## Flusso checkout

### Step 1: Riepilogo Carrello
- Lista prodotti con immagine, nome, quantita modificabile, prezzo
- Calcolo totale in tempo reale (subtotale, IVA, spedizione)
- Codice sconto / codice promozionale
- CTA: "Procedi al Checkout"

### Step 2: Dati di Fatturazione
#### Toggle Privato / Azienda (default: Azienda)
Applicazione del Default Effect: il toggle e preimpostato su "Azienda" dato il target B2B.

**Campi Azienda** (B2B):
| Campo | Tipo | Validazione | Obbligatorio |
|-------|------|-------------|--------------|
| Ragione Sociale | text | min 2 chars | Si |
| Partita IVA | text | IT + 11 cifre | Si |
| Codice Fiscale | text | 16 chars alfanum | Si |
| Codice SDI | text | 7 chars alfanum | Si* |
| PEC | email | formato email | Si* |
| Indirizzo | text | - | Si |
| CAP | text | 5 cifre | Si |
| Citta | text | - | Si |
| Provincia | select | 2 lettere | Si |

*SDI o PEC: almeno uno dei due e obbligatorio.

**Auto-compilazione da P.IVA**: lookup VIES/API Agenzia Entrate per compilare automaticamente Ragione Sociale, indirizzo e CF, riducendo i campi manuali da 9 a 4.

**Campi Privato**:
| Campo | Tipo | Validazione | Obbligatorio |
|-------|------|-------------|--------------|
| Nome | text | min 2 chars | Si |
| Cognome | text | min 2 chars | Si |
| Codice Fiscale | text | 16 chars | Si |
| Indirizzo | text | - | Si |
| CAP | text | 5 cifre | Si |
| Citta | text | - | Si |

### Step 3: Spedizione
- Indirizzo di spedizione (checkbox "Stesso della fatturazione")
- Opzioni di spedizione con costi e tempi stimati
- Note per il corriere (opzionale)

### Step 4: Pagamento
- Carte di credito/debito (Stripe)
- Bonifico bancario (standard B2B)
- PayPal
- Pagamento alla consegna (per ordini sotto soglia)
- Riepilogo finale con tutti i costi

### Step 5: Conferma
- Riepilogo ordine completo
- Numero ordine e tracking
- Email di conferma automatica
- CTA: "Vai ai tuoi ordini" / "Continua lo shopping"

## Riduzione campi
- Target: 12-14 campi totali (da 23.48 media settore)
- Auto-compilazione P.IVA riduce a ~10 campi effettivi per B2B
- Indirizzo spedizione = fatturazione come default (elimina 5+ campi)

## Statistiche di supporto
- 70% abandonment rate (Baymard)
- Ogni campo in piu riduce la conversione del 3-5% (Formstack, 2022)
- Auto-compilazione aumenta il completion rate del 30% (Baymard)
- Progress bar aumenta il completion del 10% (CXL, 2021)

## Applicazione a bianchipro.it
- Checkout a step con progress bar
- Toggle Privato/Azienda con default su Azienda
- Auto-compilazione da P.IVA
- SDI/PEC come campi nativi (non aggiunti dopo)
- Stripe come payment gateway primario

## Decisioni prese
1. Checkout a 5 step con progress bar
2. Default su "Azienda" per il toggle tipologia cliente
3. Auto-compilazione obbligatoria da lookup P.IVA
4. SDI e PEC come campi nativi nel form fatturazione
5. Indirizzo spedizione = fatturazione come default
6. Target massimo 14 campi visibili per step
