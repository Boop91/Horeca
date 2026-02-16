# 15 - Admin Dashboard

## Obiettivo
Definire le specifiche del pannello di amministrazione per bianchipro.it, permettendo la gestione completa di prodotti, ordini, clienti e contenuti.

## Principi scientifici
- **Dashboard Design** (Few, 2006): le dashboard efficaci mostrano le informazioni critiche "at a glance"
- **Information Hierarchy** (Tufte, 2001): organizzare i dati dal piu importante al meno importante
- **Action-Oriented UI**: ogni dato mostrato deve suggerire un'azione possibile

## Struttura admin dashboard

### Sidebar navigazione
- **Dashboard**: panoramica KPI
- **Ordini**: gestione ordini e preventivi
- **Prodotti**: catalogo e inventario
- **Clienti**: anagrafica e segmentazione
- **Contenuti**: pagine, blog, banner
- **Marketing**: promozioni, coupon, email
- **Report**: analytics e export
- **Impostazioni**: configurazione sito

### Dashboard principale (Overview)
#### KPI cards (riga superiore)
- Ordini oggi / settimana / mese (con trend %)
- Fatturato periodo (con confronto periodo precedente)
- Tasso di conversione (con trend)
- Carrelli abbandonati (con valore potenziale)

#### Grafici
- Andamento vendite (linea, ultimi 30 giorni)
- Top 10 prodotti venduti (barre orizzontali)
- Distribuzione ordini per regione (mappa Italia)
- Ordini per canale (torta: diretto, ricerca, referral)

#### Quick actions
- Ordini da processare (badge contatore)
- Preventivi in attesa di risposta
- Prodotti esauriti
- Recensioni da moderare

### Gestione ordini
- Lista ordini con filtri: stato, data, importo, cliente
- Stati ordine: Nuovo, Confermato, In Preparazione, Spedito, Consegnato, Annullato
- Dettaglio ordine con timeline eventi
- Generazione DDT e fattura
- Integrazione tracking corriere
- Note interne per ordine

### Gestione prodotti
- Lista prodotti con ricerca e filtri
- Editor prodotto: nome, descrizione, prezzo, immagini, specifiche
- Gestione varianti (dimensioni, colori, configurazioni)
- Inventario: quantita, soglia riordino, alert stock basso
- Import/export CSV per aggiornamenti massivi
- Gestione categorie drag-and-drop

### Gestione clienti
- Lista clienti con segmentazione (B2B/privato, fatturato, frequenza)
- Dettaglio cliente con storico ordini e comunicazioni
- Gruppi clienti per sconti differenziati
- Export clienti per campagne marketing

### Gestione contenuti
- Editor homepage: ordine sezioni, banner, prodotti in evidenza
- Blog: editor markdown con anteprima
- Pagine statiche: chi siamo, condizioni, privacy
- Banner promozionali con scheduling

### Report e analytics
- Report vendite per periodo, categoria, brand
- Report clienti: nuovi vs ricorrenti, lifetime value
- Report prodotti: best seller, margini, rotazione
- Export in CSV/Excel/PDF

## Requisiti tecnici
- Autenticazione admin con ruoli (Super Admin, Editor, Viewer)
- Audit log per tutte le azioni admin
- Responsive ma ottimizzato per desktop
- Caricamento dati con paginazione server-side

## Applicazione a bianchipro.it
- Dashboard React con componenti shadcn/ui
- API Supabase per dati real-time
- Grafici con libreria Recharts
- Tabelle con sorting, filtering, paginazione

## Decisioni prese
1. Sidebar navigation con 8 sezioni principali
2. Dashboard overview con 4 KPI cards e 4 grafici
3. Gestione ordini con 6 stati e timeline eventi
4. Editor prodotti con gestione varianti e inventario
5. Report esportabili in CSV/Excel/PDF
6. Audit log obbligatorio per tutte le azioni admin
