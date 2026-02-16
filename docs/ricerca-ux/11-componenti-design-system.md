# 11 - Componenti del Design System

## Obiettivo
Definire la libreria di componenti riutilizzabili per bianchipro.it, garantendo coerenza visiva, accessibilita e efficienza di sviluppo.

## Principi scientifici
- **Consistency Principle** (Nielsen, 1994): componenti coerenti riducono il carico cognitivo
- **Atomic Design** (Frost, 2016): atomi > molecole > organismi > template > pagine
- **WCAG 2.1 AA**: tutti i componenti interattivi devono essere accessibili

## Componenti base (Atomi)

### Bottoni
| Variante | Uso | Stile |
|----------|-----|-------|
| Primary | CTA principale (Aggiungi al Carrello) | Sfondo primary-600, testo bianco, rounded-lg |
| Secondary | CTA secondaria (Richiedi Preventivo) | Bordo primary-600, testo primary-600 |
| Ghost | Azioni terziarie | Testo primary-600, no bordo |
| Danger | Azioni distruttive (Rimuovi) | Sfondo error-600, testo bianco |
| Disabled | Stato non interattivo | Sfondo gray-200, testo gray-400 |

**Specifiche comuni**: min-height 44px (Fitts/WCAG), padding 12px 24px, font-weight 600, transizione 150ms.

### Badge
| Variante | Uso | Stile |
|----------|-----|-------|
| Pronta Consegna | Disponibilita immediata | Sfondo success-50, testo success-700 |
| Novita | Prodotto nuovo | Sfondo primary-50, testo primary-700 |
| Sconto | Percentuale sconto | Sfondo error-50, testo error-700 |
| Su Ordinazione | Non disponibile subito | Sfondo warning-50, testo warning-700 |

### Input
- **Text input**: bordo gray-300, focus ring primary-500, placeholder gray-400
- **Select**: dropdown nativo con icona chevron
- **Checkbox**: 20x20px, bordo gray-300, checked primary-600
- **Radio**: 20x20px, cerchio, stessa palette checkbox
- **Textarea**: min-height 80px, resize verticale
- **States**: default, hover, focus, error, disabled

### Form field
- Label sopra l'input (non placeholder come label)
- Messaggio errore in rosso sotto l'input
- Asterisco per campi obbligatori
- Helper text in gray-500

## Componenti composti (Molecole)

### Product Card
- Immagine 1:1 con lazy loading
- Badge posizionati in alto a sinistra (stack verticale)
- Brand in text-sm gray-500
- Nome prodotto in text-base, max 2 righe
- Prezzo IVA esclusa in text-lg font-bold
- Prezzo IVA inclusa in text-sm gray-500
- Rating stelle (se disponibile)
- CTA "Aggiungi" con icona carrello
- Icona cuore per wishlist in alto a destra

### Search Bar
- Input con icona lente
- Dropdown autocomplete con:
  - Sezione "Prodotti" con thumbnail
  - Sezione "Categorie" con icona
  - Sezione "Guide" con icona documento
- Keyboard navigation (frecce + enter)

### Mega Menu Item
- Icona categoria (24x24px)
- Label categoria
- Conteggio prodotti opzionale
- Hover state con background gray-50

### Trust Badge
- Icona (24x24px) + testo
- Varianti: spedizione, garanzia, pagamento sicuro, assistenza
- Layout orizzontale (desktop) / griglia 2x2 (mobile)

## Componenti complessi (Organismi)

### Header
- Logo + mega menu + search + icons (carrello, account, preferiti)
- Sticky con riduzione altezza allo scroll
- Mobile: hamburger + search + carrello

### Footer
- 4 colonne: Chi siamo, Categorie, Supporto, Contatti
- Newsletter signup
- Metodi di pagamento (icone)
- Copyright + P.IVA + link legali

### Cart Drawer
- Slide-in da destra
- Lista prodotti con quantita modificabile
- Totale aggiornato in tempo reale
- CTA "Vai al Checkout"

## Stati dei componenti
Ogni componente interattivo supporta: default, hover, active, focus, disabled, loading, error.

## Applicazione a bianchipro.it
- Componenti basati su shadcn/ui customizzati con i token del design system
- Tailwind CSS per lo styling con classe utility
- Componenti React con TypeScript per type safety

## Decisioni prese
1. shadcn/ui come base componenti, customizzato con token bianchipro
2. Ogni bottone interattivo ha min-height 44px
3. Label sempre sopra l'input, mai come placeholder
4. Product Card con prezzo IVA esclusa come valore primario
5. Tutti i componenti supportano gli stati: default, hover, focus, disabled, error
6. Trust badges presenti in header/footer su tutte le pagine
