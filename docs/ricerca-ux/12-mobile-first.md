# 12 - Approccio Mobile-First

## Obiettivo
Documentare la strategia mobile-first per bianchipro.it, basata su dati di settore che dimostrano la predominanza del mobile nel traffico e-commerce B2B.

## Principi scientifici
- **Mobile-First Design** (Wroblewski, 2011): progettare prima per il vincolo piu stretto forza decisioni migliori
- **Thumb Zone** (Hoober, 2011): il 75% delle interazioni mobile avviene con il pollice
- **Touch Target Size** (WCAG 2.1): minimo 44x44px per elementi interattivi
- **Performance Budget**: ogni 100ms di latenza riduce la conversione dell'1% (Akamai, 2017)

## Statistiche chiave
- Il **78% del traffico e-commerce** e da dispositivi mobile (Statista, 2024)
- Il **65% dei siti B2B** prioritizza il mobile-first (Forrester, 2023)
- Il **53% degli utenti** abbandona se il caricamento supera i 3 secondi (Google, 2023)
- Il **70% delle ricerche** su siti e-commerce avviene da mobile

## Strategia responsive

### Breakpoint approach
CSS scritto mobile-first: stili base per mobile, media query `min-width` per tablet e desktop.

```
mobile (default): 0-639px    -> 4 colonne
tablet:           640-1023px -> 8 colonne
desktop:          1024-1279px -> 12 colonne
wide:             1280px+     -> 12 colonne
```

### Adattamenti per componente

#### Header mobile
- Hamburger menu (sinistra) + Logo (centro) + Carrello (destra)
- Ricerca: icona che espande a full-width
- Sticky con altezza ridotta (56px)

#### Bottom Navigation Bar
5 icone nella thumb zone: Home, Categorie, Cerca, Carrello, Account.
Dimensione minima: 44x44px per icona con label.

#### Mega Menu mobile
- Pannello full-screen con apertura slide-left
- Navigazione a livelli con animazione
- Back button per tornare al livello precedente
- Chiusura con X o swipe-right

#### Product Card mobile
- Griglia 2 colonne
- Immagine aspect ratio 1:1
- Info essenziali: nome, prezzo, badge disponibilita
- CTA compatta con icona carrello

#### Filtri mobile
- Bottone "Filtri" sticky in bottom bar
- Apertura bottom sheet full-height
- Chip filtri attivi scrollabili orizzontalmente
- Bottone "Mostra X risultati" per applicare

#### Buy Section mobile
- Immagine full-width con swipe gallery
- Info prodotto sotto l'immagine
- CTA sticky in bottom bar (always visible)
- Prezzo e disponibilita sempre visibili

#### Checkout mobile
- Un campo per riga (full-width)
- Tastiera numerica per campi numerici (inputmode="numeric")
- Step indicator compatto
- Totale sticky in bottom bar

## Performance mobile
- **LCP target**: < 2.5s su 3G
- **Immagini**: WebP/AVIF con srcset per density
- **Lazy loading**: per immagini below the fold
- **Font**: subset e preload per Inter
- **JS Bundle**: code splitting per route

## Touch interactions
- Swipe: gallery prodotto, categorie homepage
- Pull-to-refresh: liste prodotti
- Long press: anteprima rapida prodotto
- Pinch-to-zoom: immagini prodotto dettaglio

## Applicazione a bianchipro.it
- Tutto il CSS e scritto mobile-first con min-width breakpoints
- Bottom navigation come pattern primario mobile
- CTA sticky per pagina prodotto e checkout
- Performance budget rigoroso per 3G

## Decisioni prese
1. CSS mobile-first obbligatorio (base mobile, min-width per desktop)
2. Bottom navigation bar con 5 icone su mobile
3. Touch target minimo 44x44px su tutti gli elementi interattivi
4. CTA sticky bottom bar su pagina prodotto e checkout
5. Filtri in bottom sheet su mobile
6. LCP target < 2.5s su connessione 3G
