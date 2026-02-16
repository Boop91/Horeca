# 06 - Navigazione e Architettura dell'Informazione

## Obiettivo
Progettare un sistema di navigazione che permetta a professionisti HoReCa di trovare qualsiasi prodotto in massimo 3 click, supportando sia la ricerca esplorativa che quella mirata.

## Principi scientifici
- **Legge dei 3 Click** (Zeldman, 2001): gli utenti si frustrante se non raggiungono il contenuto in 3 click
- **Information Scent** (Pirolli, 2007): gli utenti seguono il "profumo" dell'informazione attraverso label chiare
- **Recognition over Recall** (Nielsen, 1994): mostrare opzioni e preferibile a chiedere all'utente di ricordare

## Architettura di navigazione

### Livello 1 - Navigazione primaria (Mega Menu)
Il 88% dei top siti e-commerce usa mega menu (Baymard Institute). Hover delay di 0.5s per evitare aperture accidentali.

**Voci principali** (max 7 per Hick's Law):
1. Cottura (forni, fuochi, friggitrici, piastre)
2. Refrigerazione (frigo, congelatori, abbattitori, vetrine)
3. Lavaggio (lavastoviglie, lavatazzine, lavapavimenti)
4. Preparazione (impastatrici, affettatrici, robot cucina)
5. Arredamento (tavoli, scaffalature, carrelli, neutri inox)
6. Bar & Beverage (macchine caffe, granitori, spillatori)
7. Per il tuo Mestiere (link a percorsi dedicati)

### Livello 2 - Sotto-categorie nel mega menu
- Griglia visiva con icone per ogni sotto-categoria
- Max 12 sotto-categorie per colonna
- Link "Vedi tutti" a fine colonna

### Livello 3 - Pagina categoria con filtri
- Breadcrumb completo per orientamento
- Filtri sfaccettati laterali (desktop) / bottom sheet (mobile)

### Navigazione per mestiere
Percorso alternativo validato dal pattern "Shop by Business Type" di WebstaurantStore:
- Pizzeria > Forni pizza, Impastatrici, Banchi refrigerati, Vetrine
- Ristorante > Forni combinati, Fuochi, Lavastoviglie, Abbattitori
- Bar > Macchine caffe, Granitori, Vetrine bar, Lavabicchieri
- Hotel > Minibar, Lavanderia, Buffet, Carrelli
- Macelleria > Affettatrici, Celle frigo, Bilance, Confezionatrici
- Pasticceria > Forni, Impastatrici, Abbattitori, Vetrine

### Ricerca
- Autocomplete con suggerimenti prodotto, categoria e guide
- Ricerca fuzzy per gestire errori di digitazione
- Risultati raggruppati per tipologia
- Storico ricerche per utenti autenticati

## Statistiche di supporto
- L'82% dei top siti ha ricerca con autocomplete (Baymard)
- Il 78% usa filtri sfaccettati (Baymard)
- Il 70% degli utenti usa la ricerca come primo metodo su mobile

## Mobile navigation
- Hamburger menu con apertura a pannello full-width
- Navigazione a livelli con animazione slide
- Barra di ricerca sempre accessibile
- Bottom bar con: Home, Categorie, Cerca, Carrello, Account

## Applicazione a bianchipro.it
- Mega menu desktop con griglia visiva e hover delay 0.5s
- Mobile: menu a pannello con navigazione progressiva
- Percorsi per mestiere accessibili da homepage e menu
- Ricerca con autocomplete che mostra prodotti + categorie

## Decisioni prese
1. Mega menu come navigazione primaria desktop (88% best practice)
2. Max 7 voci di primo livello (Hick's Law)
3. Hover delay 0.5s per prevenire aperture accidentali
4. "Per il tuo Mestiere" come voce di navigazione primaria
5. Bottom navigation bar su mobile con 5 icone
6. Ricerca autocomplete con risultati misti (prodotti + categorie)
