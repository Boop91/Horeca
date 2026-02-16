# 13 - Fiducia e Conversione

## Obiettivo
Definire la strategia di trust signals e ottimizzazione del tasso di conversione per bianchipro.it, specifica per acquisti B2B di alto valore nel settore HoReCa.

## Principi scientifici
- **Social Proof** (Cialdini, 1984): le persone seguono il comportamento degli altri in situazioni di incertezza
- **Trust Signals** (Fogg, 2003): la credibilita web si basa su presunta, superficiale, guadagnata e reputazione
- **Loss Aversion** (Kahneman & Tversky, 1979): le perdite pesano 2x rispetto ai guadagni equivalenti
- **Scarcity Principle** (Cialdini, 1984): cio che e scarso e percepito come piu prezioso

## Statistiche di riferimento
- L'86% degli acquirenti B2B vuole social proof prima dell'acquisto (G2, 2023)
- Conversione acquisti alto valore: 0.5-1.5% (Baymard Institute)
- Il 70% degli utenti abbandona il carrello (Baymard Institute)
- Font leggibili aumentano la fiducia del 40% (MIT AgeLab, 2019)
- Colori consistenti aumentano il riconoscimento brand del 60-80% (University of Loyola)

## Trust signals implementati

### Livello 1 - Visibili su ogni pagina
- **Header**: numero telefono, orari assistenza, WhatsApp
- **Trust bar**: "Spedizione Gratuita sopra X EUR" | "Garanzia 24 mesi" | "Pagamento Sicuro" | "Assistenza Dedicata"
- **Footer**: P.IVA, indirizzo fisico, certificazioni, metodi di pagamento

### Livello 2 - Pagina prodotto
- **Recensioni verificate**: badge "Acquisto Verificato", rating medio, distribuzione stelle
- **Disponibilita in tempo reale**: "Pronta Consegna" con icona verde o "Su Ordinazione: X giorni"
- **Garanzia esplicita**: durata e condizioni visibili nella buy section
- **Contatore vendite**: "Acquistato da X professionisti questo mese" (social proof numerico)
- **Sigilli sicurezza**: Stripe, SSL, metodi di pagamento accettati

### Livello 3 - Checkout
- **Progress bar**: indica il punto del processo
- **Riepilogo ordine**: sempre visibile durante il checkout
- **Garanzia soddisfatti**: politica reso chiara prima del pagamento
- **Sigilli pagamento**: Visa, Mastercard, PayPal, bonifico
- **Lucchetto**: icona accanto al bottone di pagamento

## Strategie di conversione

### Urgenza e scarsita (uso etico)
- "Solo X pezzi disponibili" (solo se reale)
- "Ordina entro le 14:00 per spedizione oggi"
- Timer per offerte a tempo limitato

### Riduzione attrito
- Auto-compilazione P.IVA per ridurre i campi
- Checkout guest (senza registrazione obbligatoria)
- Salvataggio carrello per utenti registrati
- Exit-intent popup con offerta/consulenza

### Recupero carrello
- Email automatica dopo 1 ora dall'abbandono
- Reminder dopo 24 ore con eventuale incentivo
- Notifica push per utenti con app/PWA

### Dual path conversion
- "Aggiungi al Carrello" per acquisti immediati
- "Richiedi Preventivo" per acquisti considerati
- Il dual path aumenta la CR del 15-25% nel B2B (Forrester)

## KPI di conversione target
| Metrica | Attuale (stimato) | Target |
|---------|-------------------|--------|
| Conversion Rate | 0.5% | 1.2% |
| Cart Abandonment | 75% | 60% |
| Average Order Value | - | +15% |
| Quote Request Rate | - | 5% |

## Applicazione a bianchipro.it
- Trust bar su tutte le pagine
- Recensioni con badge "Acquisto Verificato"
- CTA duale su ogni prodotto
- Checkout con auto-compilazione P.IVA
- Email recupero carrello automatica

## Decisioni prese
1. Trust bar con 4 messaggi chiave su tutte le pagine
2. Social proof numerico sulla pagina prodotto
3. CTA duale obbligatoria: carrello + preventivo
4. Checkout guest disponibile (registrazione opzionale)
5. Recupero carrello via email a 1h e 24h
6. Scarsita solo su dati reali di magazzino
