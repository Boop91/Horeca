## 2026-02-17 01:27:00 - CAPO > ARCHITETTURA > INTERFACCIA > LOGICA > REVISIONE > CAPO

### Cosa è stato fatto
- Rifatto il layout desktop dell'header in stile bozza:
- Riga 1 chiara con logo, search pill e icone account/preferiti/carrello.
- Riga 2 chiara con voci menu e categorie con icona + freccia.
- Restyling completo del mega-menu categoria (sfondo blu scuro, colonne, titoli verdi chiari e link secondari chiari) con comportamento hover.
- Aggiornata la sezione iniziale hero della home (immagine full, card traslucida, tipografia più ampia e CTA) per allinearla ai riferimenti visivi forniti.

### File toccati
- `src/components/Header.tsx`
- `src/components/HomePage.tsx`
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Eseguire `npm run build` e verificare build senza errori.
2. Avviare in locale `npm run dev`.
3. Aprire home e confrontare visivamente con:
- `Immagini  bozza Horeca/Nav bar e parte iniziale del sito.png`
- `Immagini  bozza Horeca/Tendina menu.png`
- `Immagini  bozza Horeca/Home tendina menu.png`
4. In desktop: passare col mouse su `Linea Caldo` e verificare apertura mega-menu a colonne.
5. Verificare che account/preferiti/carrello continuino a funzionare come prima.

### Nota revisione
- Verifica tecnica eseguita: `npm run build` OK.

## 2026-02-17 18:02:03 - CAPO > ARCHITETTURA > INTERFACCIA > LOGICA > REVISIONE > CAPO

### Cosa è stato fatto
- Applicate alla `home-v2` le stesse interazioni della Home vecchia, riusando gli stessi gestori/contesti/componenti funzionali:
  - apertura carrello (`CartDrawer`) tramite `setCartOpen(true)`;
  - apertura preferiti (`FavoritesDrawer`) tramite `setFavoritesOpen(true)`;
  - apertura login/registrazione (`AuthModal`) per utente non autenticato;
  - menu account per utente autenticato con link account/admin e logout.
- Collegata la navigazione `home-v2` alle stesse rotte usate nella Home vecchia:
  - logo e voci menu (`/`, `/chi-siamo`, `/faq`, `/contatti`);
  - categorie via `catalogMenu` verso `/categoria/:slug`;
  - CTA hero `Inizia da qui` verso `/categoria/linea-caldo`.
- Collegate le frecce carousel prodotti allo stesso comportamento della Home vecchia (`scrollBy` con step `324` e `behavior: smooth`).
- Aggiunti attributi stabili `data-testid` sugli elementi interattivi principali (`header`, nav, CTA hero, frecce carousel) senza impatto visivo.

### File toccati
- `src/components/home_v2/HomeV2Page.tsx`
- `src/components/home_v2/HomeV2Header.tsx`
- `src/components/home_v2/HomeV2Hero.tsx`
- `src/components/home_v2/HomeV2Products.tsx`
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Eseguire `npm run build`.
2. Avviare `npm run dev`.
3. Aprire `http://localhost:3000/home-v2`.
4. Verificare:
   - click su account non loggato apre `AuthModal`;
   - click su preferiti apre `FavoritesDrawer`;
   - click su carrello apre `CartDrawer`;
   - nav e logo cambiano rotta correttamente;
   - CTA hero porta a `/categoria/linea-caldo`;
   - frecce carosello scorrono le card.

### Nota revisione
- Verifica tecnica eseguita: `npm run build` OK.

## 2026-02-17 10:35:41 - CAPO > ARCHITETTURA > INTERFACCIA > LOGICA > REVISIONE > CAPO

### Cosa è stato fatto
- Home iniziale rifatta da zero seguendo il frame Figma `7718:6850`.
- Riscritta completamente l'intestazione (`Header`) in stile Figma:
  - barra superiore con logo, search bar pill, azioni account/preferiti/carrello;
  - barra navigazione inferiore con voci e categorie con icone + freccia.
- Riscritta completamente la `HomePage` in stile Figma:
  - sezione hero con immagine full width, card overlay traslucida e tipografia Roboto;
  - sezione `Prodotti selezionati` con sfondo grigio chiaro, 4 card placeholder, badge, prezzi e frecce laterali.
- Aggiornati gli import font globali per includere Roboto e Nunito (coerenti con Figma).

### File toccati
- `src/components/Header.tsx`
- `src/components/HomePage.tsx`
- `src/styles/globals.css`
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Eseguire `npm run build`.
2. Avviare `npm run dev`.
3. Aprire la home (`/`) e confrontarla con il riferimento Figma:
   - `https://www.figma.com/design/TPHsuexgjzwEvxdgfNZvIA/bianchipro-Ecommerce--Copy-?node-id=7718-6850&t=YnqikkPaZeeAi31b-4`
4. Verificare in particolare:
   - header a due righe con logo/search/icone e menu;
   - hero con card overlay (titolo, testo corsivo, link "Inizia da qui");
   - sezione "Prodotti selezionati" con 4 card e pulsanti freccia laterali.

### Nota revisione
- Verifica tecnica eseguita: `npm run build` OK.

## 2026-02-17 11:23:19 - CAPO > ARCHITETTURA > INTERFACCIA > LOGICA > REVISIONE > CAPO

### Cosa è stato fatto
- Correzione completa della home iniziale allineata al nodo Figma `7718:6849`.
- Rifinito `Header` per aderire a misure/spaziature del frame:
  - top bar con altezza e padding coerenti,
  - search bar con struttura e proporzioni Figma,
  - blocco azioni utente (account/preferiti/carrello) con allineamento corretto,
  - nav secondaria con spacing verticale/orizzontale del riferimento.
- Riscritta la struttura della `HomePage` per fedeltà visiva 1:1 (desktop):
  - hero `650px` con overlay card traslucida, tipografia e interlinee Figma,
  - sezione `Prodotti selezionati` con heading, griglia/scroll cards, badge, prezzi, CTA,
  - frecce laterali riposizionate come nel nodo.
- Sostituite le immagini della hero e delle card con asset del nodo Figma corrente.
- Mantenuta una resa responsive minima per mobile senza alterare il layout desktop target.

### File toccati
- `src/components/Header.tsx`
- `src/components/HomePage.tsx`
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Eseguire `npm run build` (atteso: build OK).
2. Aprire la home e confrontare con il riferimento:
   - `https://www.figma.com/design/TPHsuexgjzwEvxdgfNZvIA/bianchipro-Ecommerce--Copy-?node-id=7718-6849&t=xExXjbvnM1mzVyGO-4`
3. Verificare in particolare:
   - header a due righe (logo/search/icone + nav);
   - hero con overlay card (tipografia, spaziature, CTA);
   - sezione prodotti con 4 card, immagine chef, badge e frecce esterne.

### Nota revisione
- Verifica tecnica eseguita: `npm run build` OK.
- Tentativo preview locale (`npm run dev`) non eseguibile in questo ambiente per errore permessi porta (`EPERM`).

## 2026-02-17 11:24:06 - CAPO > ARCHITETTURA > INTERFACCIA > LOGICA > REVISIONE > CAPO

### Cosa è stato fatto
- Home rifatta completamente sul riferimento Figma richiesto (`node-id=7718:6849`), allineando layout e proporzioni della schermata.
- Header riscritto in stile Figma:
  - barra superiore con logo, barra di ricerca pill e azioni account/preferiti/carrello;
  - barra di navigazione inferiore con voci testuali e categorie con icona + freccia.
- Home riscritta in stile Figma:
  - hero da `650px` con immagine full-width e card overlay traslucida (tipografia/spaziature aggiornate);
  - sezione `Prodotti selezionati` con sfondo grigio chiaro, 4 card da `300x503`, badge, prezzi, CTA e frecce laterali.
- Aggiornate le immagini della schermata usando gli asset del nodo Figma (hero e card prodotto).

### File toccati
- `src/components/Header.tsx`
- `src/components/HomePage.tsx`
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Eseguire `npm run build`.
2. Avviare `npm run dev`.
3. Aprire `/` e confrontare con:
   - `https://www.figma.com/design/TPHsuexgjzwEvxdgfNZvIA/bianchipro-Ecommerce--Copy-?node-id=7718-6849&t=xExXjbvnM1mzVyGO-4`
4. Verificare in particolare:
   - struttura header in due righe con search pill e icone azioni;
   - hero con card overlay (titolo su 3 righe, testo corsivo, link `Inizia da qui`);
   - sezione prodotti con 4 card complete, badge e frecce carousel laterali.

### Nota revisione
- Verifica tecnica eseguita: `npm run build` OK.

## 2026-02-17 11:25:52 - CAPO > ARCHITETTURA > INTERFACCIA > LOGICA > REVISIONE > CAPO

### Cosa è stato fatto
- Rifinitura finale della correzione Figma `7718:6849` per eliminare disallineamenti residui.
- Riscritti in forma definitiva:
  - `Header`: icone categorie allineate (incluso `Hotellerie`), layout search/actions e spaziature top/nav aderenti al frame.
  - `HomePage`: hero + cards confermate con asset Figma correnti (`hero` e immagine chef), misure/offset/padding coerenti.

### File toccati
- `src/components/Header.tsx`
- `src/components/HomePage.tsx`
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Eseguire `npm run build`.
2. Confrontare la home con il nodo Figma:
   - `https://www.figma.com/design/TPHsuexgjzwEvxdgfNZvIA/bianchipro-Ecommerce--Copy-?node-id=7718-6849&t=xExXjbvnM1mzVyGO-4`
3. Controllare in particolare:
   - proporzioni header (logo/search/azioni);
   - hero overlay (tipografia Roboto, interlinee, CTA);
   - 4 card con immagine chef e frecce esterne.

### Nota revisione
- Verifica tecnica eseguita: `npm run build` OK.

## 2026-02-17 17:40:55 - CAPO > ARCHITETTURA > INTERFACCIA > LOGICA > REVISIONE > CAPO

### Cosa è stato fatto
- Gestita richiesta "Home_v2" senza toccare la Home esistente:
  - creata nuova pagina dedicata `HomeV2Page` con componenti separati (`Header`, `Hero`, `Products`) in cartella `src/components/home_v2/`;
  - aggiunta route dedicata `home-v2` in `App.tsx`, fuori dal layout condiviso, per avere una resa fotocopia senza Header/Footer globali.
- Applicato stile completamente isolato con file nuovo `HomeV2.css`:
  - classi prefissate `home-v2-*`;
  - misure in pixel;
  - colori/spaziature/tipografia coerenti al nodo Figma `7718:6849`;
  - ombre applicate solo ai blocchi presenti nel frame.
- Per i problemi IDE segnalati ("39 problemi"), aggiunto shim TypeScript locale offline (`src/types/ide-shims.d.ts`) per risolvere errori di dichiarazioni mancanti in ambiente senza package types scaricabili.

### File toccati
- `src/components/home_v2/HomeV2Page.tsx`
- `src/components/home_v2/HomeV2Header.tsx`
- `src/components/home_v2/HomeV2Hero.tsx`
- `src/components/home_v2/HomeV2Products.tsx`
- `src/components/home_v2/HomeV2.css`
- `src/types/ide-shims.d.ts`
- `src/App.tsx`
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Eseguire `npm run build`.
2. Eseguire `npm test`.
3. Aprire la route `home-v2` e verificare la nuova Home isolata.

### Nota revisione
- Verifica tecnica eseguita: `npm run build` OK, `npm test` OK.

## 2026-02-17 17:46:07 - CAPO > ARCHITETTURA > INTERFACCIA > LOGICA > REVISIONE > CAPO

### Cosa è stato fatto
- Correzione compatibilità editor su `HomeV2Header.tsx` per errori TSX segnalati in IDE:
  - aggiunto `import React from 'react'` esplicito;
  - sostituito fragment shorthand (`<>...</>`) con `React.Fragment` esplicito.
- Verifica tecnica dopo fix: build completata senza errori.

### File toccati
- `src/components/home_v2/HomeV2Header.tsx`
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Eseguire `npm run build`.
2. Aprire `src/components/home_v2/HomeV2Header.tsx` in editor e verificare che gli errori TSX siano spariti/ridotti.
3. Aprire `http://localhost:3000/home-v2` con dev server attivo.

### Nota revisione
- Verifica tecnica eseguita: `npm run build` OK.

## 2026-02-17 17:50:35 - CAPO > ARCHITETTURA > INTERFACCIA > LOGICA > REVISIONE > CAPO

### Cosa è stato fatto
- Applicata la richiesta "centrare tutto" sulla pagina `home-v2`.
- Centrato orizzontalmente il layout principale:
  - `home-v2-page` ora usa contenitore full-width con `display: flex` e `justify-content: center`;
  - `home-v2-inner-column` ora ha margine automatico orizzontale (`margin: 19px auto 0`) invece dell'offset fisso a sinistra.

### File toccati
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Eseguire `npm run build`.
2. Avviare `npm run dev`.
3. Aprire `http://localhost:3000/home-v2`.
4. Verificare che l'intero frame da 1460px sia centrato nella viewport (niente offset a sinistra).

### Nota revisione
- Verifica tecnica eseguita: `npm run build` OK.

## 2026-02-17 17:52:02 - CAPO > ARCHITETTURA > INTERFACCIA > LOGICA > REVISIONE > CAPO

### Cosa è stato fatto
- Rimossa la cornice nera del riquadro principale della nuova Home (`home-v2`).
- Eliminato il bordo dal contenitore `.home-v2-frame` mantenendo invariati dimensioni, layout e resto degli stili.

### File toccati
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Eseguire `npm run build`.
2. Avviare `npm run dev`.
3. Aprire `http://localhost:3000/home-v2` (o la porta del tuo dev server).
4. Verificare che il riquadro grande non abbia più il bordo nero.

### Nota revisione
- Verifica tecnica eseguita: `npm run build` OK.

## 2026-02-17 18:26:22 - CAPO > ARCHITETTURA > INTERFACCIA > LOGICA > REVISIONE > CAPO

### Cosa è stato fatto
- Spostata la `home-v2` come homepage reale dell'app:
  - `/` ora renderizza `HomeV2Page`;
  - `/home-v2` ora fa redirect a `/`.
- Estese su `HomeV2Page` le funzionalità globali già presenti nella home precedente:
  - aggiunti `Footer`, `Toaster` e `BackendStatus`;
  - mantenuti e collegati `CartDrawer`, `FavoritesDrawer`, `AuthModal` con i context globali.
- Corretto bug UX dello spostamento orizzontale pagina all'apertura overlay (es. Preferiti):
  - introdotto `src/utils/bodyScrollLock.ts` con lock scroll centralizzato e compensazione larghezza scrollbar;
  - applicato il lock centralizzato a `CartDrawer`, `FavoritesDrawer`, `CheckoutModal`, `AuthModal`.
- Rifiniti comportamenti header v2 per parità funzionale con la home precedente:
  - badge conteggio sul carrello;
  - icona preferiti piena quando presenti elementi;
  - cursore `pointer` sui controlli cliccabili principali.

### File toccati
- `src/App.tsx`
- `src/components/home_v2/HomeV2Page.tsx`
- `src/components/home_v2/HomeV2Header.tsx`
- `src/components/home_v2/HomeV2.css`
- `src/components/CartDrawer.tsx`
- `src/components/FavoritesDrawer.tsx`
- `src/components/CheckoutModal.tsx`
- `src/components/auth/AuthModal.tsx`
- `src/utils/bodyScrollLock.ts`
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Eseguire `npm run build`.
2. Eseguire `npm test`.
3. Avviare il server locale e aprire `http://localhost:3000/`.
4. Verificare che `http://localhost:3000/home-v2` reindirizzi a `/`.
5. Verificare in homepage:
   - click su account/preferiti/carrello;
   - apertura/chiusura drawer e modali;
   - assenza di spostamento laterale della pagina all'apertura dei drawer.

### Nota revisione
- Verifica tecnica eseguita: `npm run build` OK, `npm test` OK.
- Verifica browser automatizzata Playwright non completabile in questa sessione (timeout tool), quindi controllo UX finale da confermare in browser locale.

## 2026-02-17 18:36:31 - CAPO > ARCHITETTURA > INTERFACCIA > LOGICA > REVISIONE > CAPO

### Cosa è stato fatto
- Sostituita la navbar globale del sito con la versione `HomeV2Header` (stesso blocco con logo, ricerca, account, preferiti, carrello e voci menu richieste).
- Applicata la stessa intestazione anche al resto del sito, rimpiazzando quella precedente nel `Layout`.
- Corretto il comportamento di background della nav:
  - introdotti wrapper `home-v2-header-top-bg` e `home-v2-nav-bar-bg` a larghezza piena;
  - i soli colori di sfondo (grigio / panna) ora si estendono fino ai lati viewport, mentre il contenuto resta centrato.
- In `HomeV2Page` l'header è stato spostato fuori dal frame centrale per mantenere la stessa resa full-width anche in homepage.
- Rifinite alcune dimensioni del frame/colonna della home v2 per evitare clipping dopo il cambio struttura header.

### File toccati
- `src/components/Layout.tsx`
- `src/components/home_v2/HomeV2Page.tsx`
- `src/components/home_v2/HomeV2Header.tsx`
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Eseguire `npm run build`.
2. Eseguire `npm test`.
3. Avviare il server locale e aprire:
   - `http://localhost:3000/`
   - una pagina interna, ad esempio `http://localhost:3000/categoria/linea-caldo`
4. Verificare che la navbar sia la stessa su home e pagine interne.
5. Verificare che gli sfondi top bar + nav bar arrivino ai lati schermo, mentre il contenuto della navbar resti centrato.

### Nota revisione
- Verifica tecnica eseguita: `npm run build` OK, `npm test` OK.

## 2026-02-17 18:52:33 - CAPO > ARCHITETTURA > INTERFACCIA > LOGICA > REVISIONE > CAPO

### Cosa è stato fatto
- Hero home resa full-width: l'immagine ora tocca i lati dello schermo.
- Spostata la hero fuori dal frame centrale della home per mantenere contenuto overlay allineato ma sfondo esteso a tutta viewport.
- Rimosso lo sfondo della sezione `Prodotti selezionati` (ora trasparente).
- Implementato mega-menu hover sulle voci categoria della nav (stile ordinato tipo e-commerce):
  - apertura al passaggio mouse sulle categorie principali;
  - chiusura all'uscita dal blocco nav;
  - visualizzazione gruppi (prime sottocategorie) e, sotto ogni gruppo, sezioni (seconde sottocategorie) con link.
- Mantenute le rotte coerenti con il catalogo (`/categoria/:slug/:gruppo/:sezione`).

### File toccati
- `src/components/home_v2/HomeV2Page.tsx`
- `src/components/home_v2/HomeV2Hero.tsx`
- `src/components/home_v2/HomeV2Header.tsx`
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Eseguire `npm run build`.
2. Eseguire `npm test`.
3. Aprire `http://localhost:3000/`.
4. Verificare che la hero arrivi ai lati schermo.
5. Verificare che `Prodotti selezionati` non abbia più il blocco sfondo colorato.
6. Passare il mouse su `Linea Caldo`, `Linea Freddo`, ecc. e verificare il mega-menu con gruppi + sezioni ordinati e linkabili.

### Nota revisione
- Verifica tecnica eseguita: `npm run build` OK, `npm test` OK.

## 2026-02-17 18:55:44 - CAPO > ARCHITETTURA > INTERFACCIA > LOGICA > REVISIONE > CAPO

### Cosa è stato fatto
- Applicato `#f2f4f6` come sfondo globale del sito (resto pagine oltre alla navbar).
- Aggiornata la variabile tema globale `--background` a `#f2f4f6`.
- Aggiornato il wrapper principale del `Layout` per usare `bg-background` (coerente col tema).
- Allineata anche la home v2:
  - `home-v2-page` ora usa sfondo `#f2f4f6`;
  - `home-v2-frame` reso trasparente per non reintrodurre il bianco centrale.

### File toccati
- `src/styles/globals.css`
- `src/components/Layout.tsx`
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Eseguire `npm run build`.
2. Eseguire `npm test`.
3. Aprire `http://localhost:3000/` e una pagina interna (es. `/categoria/linea-caldo`).
4. Verificare che lo sfondo generale della pagina sia `#f2f4f6`.

### Nota revisione
- Verifica tecnica eseguita: `npm run build` OK, `npm test` OK.

## 2026-02-17 19:01:51 - CAPO > ARCHITETTURA > INTERFACCIA > LOGICA > REVISIONE > CAPO

### Cosa è stato fatto
- Sezione `Prodotti selezionati` corretta e centrata:
  - container e viewport del carosello ora centrati nel frame;
  - frecce riposizionate ai lati con z-index corretto (non sovrapposte alle card).
- Trasformata in carosello funzionante con i bottoni esistenti:
  - stato `currentIndex` con avanzamento/indietro;
  - transizione animata `translate3d` sul track;
  - loop automatico agli estremi.
- Card rese cliccabili: ogni card porta a un prodotto diverso (`/prodotto/:slug`) preso dal catalogo reale (`realProducts`).
- Aggiunte animazioni UX:
  - entrata card (fade + slide);
  - hover card con lift e shadow;
  - interazione dei bottoni carosello (hover/active).

### File toccati
- `src/components/home_v2/HomeV2Products.tsx`
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Eseguire `npm run build`.
2. Eseguire `npm test`.
3. Aprire `http://localhost:3000/`.
4. Verificare che le card siano centrate nella sezione.
5. Usare i pulsanti freccia per scorrere il carosello con animazione.
6. Cliccare ogni card e verificare apertura di prodotti differenti.

### Nota revisione
- Verifica tecnica eseguita: `npm run build` OK, `npm test` OK.

## 2026-02-18 02:39:39 - CAPO > ARCHITETTURA > INTERFACCIA > LOGICA > REVISIONE > CAPO

### Cosa è stato fatto
- Home v2: aggiunta nuova sezione card categorie sotto `Prodotti selezionati` seguendo struttura Figma del nodo `7720:6626`.
  - nuova sezione con canvas fisso `1400x900`;
  - 6 card posizionate in griglia 3x2 con dimensioni `400x478`;
  - card con immagine, titolo, descrizione, 4 chip sottocategoria e CTA `visualizza tutto`.
- Header Home v2: refactor della navigazione per riprendere la struttura della tendina densa del nodo `4565:15239`.
  - nav divisa in blocchi sinistra / categorie / destra;
  - hover category con evidenziazione verde;
  - mega-menu scuro `#2e3a47` con colonne dense (titolo gruppo + lista sezioni) per ogni categoria.
- Category page: riallineata la parte iniziale al riferimento `4567:15390`.
  - header iniziale con tipografia e spaziature in stile Figma;
  - carosello sottocategorie con card rettangolari arrotondate e frecce laterali;
  - barra filtri iniziale (bottone, conteggio, sort pill) in stile Figma;
  - griglia prodotti iniziale restilizzata (card, badge, media block, raggi, ombre).
- Logica categoria: esteso il dataset prodotti anche ai livelli 1/2 (non solo livello 3), così la parte iniziale della pagina categoria mostra prodotti reali fin da `/categoria/:slug`.

### File toccati
- `src/components/home_v2/HomeV2CategoryCards.tsx` (nuovo)
- `src/components/home_v2/HomeV2Page.tsx`
- `src/components/home_v2/HomeV2Header.tsx`
- `src/components/home_v2/HomeV2.css`
- `src/components/CategoryPage.css` (nuovo)
- `src/components/CategoryPage.tsx`
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Eseguire `npm run build`.
2. Eseguire `npm test -- --run`.
3. Aprire `http://localhost:3000/`.
4. Verificare in home che sotto `Prodotti selezionati` compaia la nuova sezione con 6 card categorie.
5. Passare il mouse sulle categorie della nav (`Linea Caldo`, `Linea Freddo`, ecc.) e verificare mega-menu denso a colonne.
6. Aprire una categoria (es. `/categoria/linea-caldo`) e verificare la parte iniziale: titolo+descrizione, carosello sottocategorie, barra filtri e griglia prodotti in stile Figma.

### Nota revisione
- Verifica tecnica eseguita: `npm run build` OK, `npm test -- --run` OK.
