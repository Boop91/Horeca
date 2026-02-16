# 08 - Pagina Categoria e Filtri

## Obiettivo
Progettare pagine categoria che permettano ai professionisti HoReCa di trovare e confrontare prodotti rapidamente attraverso filtri sfaccettati e ordinamento intelligente.

## Principi scientifici
- **Faceted Navigation** (Hearst, 2006): i filtri sfaccettati riducono il tempo di ricerca del 50%
- **Paradosso della scelta** (Schwartz, 2004): troppe opzioni causano paralisi decisionale
- **Satisficing vs Maximizing** (Simon, 1956): la maggior parte degli utenti cerca "abbastanza buono", non "il migliore"
- **Progressive Disclosure** (Nielsen, 2006): mostrare solo le informazioni rilevanti al momento

## Layout pagina categoria

### Header categoria
- Breadcrumb completo: Home > Cottura > Forni Professionali
- Titolo categoria con conteggio prodotti (es. "Forni Professionali (47)")
- Descrizione SEO breve (1-2 righe, espandibile)

### Barra strumenti
- **Ordinamento**: Rilevanza, Prezzo (crescente/decrescente), Novita, Piu venduti
- **Vista**: griglia (default) / lista
- **Prodotti per pagina**: 24 (default) / 48 / 96

### Filtri sfaccettati

#### Desktop: sidebar sinistra
- Filtri espandibili con checkbox
- Conteggio risultati per ogni opzione
- "Cancella filtri" sempre visibile
- Filtri attivi mostrati come chip rimovibili sopra la griglia

#### Mobile: bottom sheet / drawer
- Bottone "Filtri" sticky in basso
- Apertura a pannello full-screen
- Applicazione con bottone "Mostra X risultati"
- Reset filtri con un tap

#### Filtri standard per bianchipro.it
| Filtro | Tipo | Priorita |
|--------|------|----------|
| Disponibilita | Toggle "Pronta Consegna" | Alta |
| Prezzo | Range slider con input | Alta |
| Brand | Checkbox multi-selezione | Alta |
| Alimentazione | Gas / Elettrico / Misto | Media |
| Dimensioni | Range o fasce predefinite | Media |
| Potenza | Range kW | Media |
| Garanzia | 12 / 24 / 36 mesi | Bassa |

### Card prodotto nella griglia
- Immagine prodotto (aspect ratio 1:1)
- Badge: "Pronta Consegna", "Novita", "-X%"
- Nome prodotto (max 2 righe, troncamento con ellipsis)
- Brand
- Prezzo IVA esclusa (primario) + IVA inclusa (secondario)
- Rating stelle (se disponibile)
- CTA: "Aggiungi al Carrello" + icona preferiti

### Paginazione
- Paginazione numerica con prev/next
- Scroll infinito come opzione alternativa (con lazy loading)
- Indicatore posizione: "Prodotti 1-24 di 47"

## Statistiche di supporto
- Il 78% dei top siti usa filtri sfaccettati (Baymard)
- Filtri riducono il tempo di ricerca del 50% (Hearst, 2006)
- Il 42% degli utenti mobile abbandona se i filtri sono difficili da usare (Google, 2023)

## Applicazione a bianchipro.it
- Filtro "Pronta Consegna" come primo filtro, sempre visibile
- Filtri sfaccettati con conteggio risultati in tempo reale
- Card prodotto con prezzo IVA esclusa e badge disponibilita
- Mobile: filtri in bottom sheet con bottone sticky

## Decisioni prese
1. "Pronta Consegna" come filtro primario, toggle sempre visibile
2. Desktop: sidebar filtri a sinistra; Mobile: bottom sheet
3. Griglia come vista default; lista come alternativa
4. 24 prodotti per pagina come default (bilanciamento performance/usabilita)
5. Prezzo IVA esclusa come valore primario nelle card
6. Card con CTA "Aggiungi al Carrello" diretto dalla griglia
