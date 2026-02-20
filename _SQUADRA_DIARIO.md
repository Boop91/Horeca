## 2026-02-20 14:45:00 - CAPO > INTERFACCIA > USABILITA > COLLAUDO > CAPO

### Cosa è stato fatto
- Audit UX globale delle pagine React principali (home, categoria, prodotto, checkout, account) e delle superfici condivise (header, footer) contro i principi di gerarchia informativa, affordance, feedback e microtesti.
- Identificate incoerenze che impattano i flussi (CTA fuori contesto, perdita di orientamento nella struttura catalogo, passi checkout non cliccabili) e lacune di chiarezza nei testi.
- Catalogata ogni criticità con riferimento al file corrispondente per facilitare priorizzazione e intervento.

### File toccati
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Leggere l'elenco delle criticità nell'audit (richiesta utente).
2. Validare i context di ciascuna sezione (header, home, categoria, scheda prodotto, checkout e account) confrontando i percorsi indicati.

### Nota revisione
- Verifica tecnica eseguita: `git status -sb`

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

## 2026-02-19 17:29:28 - COORDINATORE > AVVIO SQUADRA 4 RUOLI > SCANSIONE INIZIALE

### Cosa e stato fatto
- Attivata la modalita operativa a 4 ruoli:
  - Coordinatore (decisioni, priorita, merge logico delle attivita)
  - Progettista esperienza utente e interfaccia (usabilita, gerarchia visiva, microtesti, accessibilita)
  - Sviluppatore (implementazione sicura e coerente con architettura)
  - Revisore qualita (regressioni, performance, coerenza finale)
- Eseguita scansione iniziale del progetto per mappare entry point, routing e aree UX/UI principali prima di qualunque intervento.
- Identificato il file candidato principale per i requisiti di obiettivo progetto: `docs/ricerca-ux/00-indice-generale.md`.

### File toccati
- `_SQUADRA_DIARIO.md`

### Perche
- Applicare le regole operative di squadra e partire da una baseline condivisa e tracciabile.
- Ridurre rischio regressioni delimitando il perimetro tecnico prima delle modifiche.

### Verifica
1. Comando eseguito: `rg --files`
2. Comando eseguito: `sed -n '1,260p' src/App.tsx`
3. Comando eseguito: `sed -n '1,220p' src/main.tsx`
4. Comando eseguito: `sed -n '1,260p' src/components/home_v2/HomeV2Page.tsx`
5. Comando eseguito: `git status --short`
6. Controllo: voce presente in coda a `_SQUADRA_DIARIO.md`.

## 2026-02-19 18:38:01 - COORDINATORE > PIANO INTERVENTI PRIORITIZZATO (ALTO IMPATTO, BASSO RISCHIO)

### Cosa e stato fatto
- Letto e adottato come requisito primario `docs/ricerca-ux/00-indice-generale.md`.
- Coinvolti i 3 ruoli specialistici su chiamata del Coordinatore:
  - Progettista UX/UI per attriti, ipotesi e verifiche usabilita.
  - Sviluppatore per fattibilita low-risk sul codice esistente.
  - Revisore qualita per rischi regressione/performance/coerenza.
- Consolidato un piano unico di interventi prioritizzati focalizzato su:
  - conversione checkout B2B,
  - accessibilita WCAG 2.1 AA,
  - mobile-first,
  - coerenza dei percorsi categoria e home.

### File toccati
- `_SQUADRA_DIARIO.md`

### Perche
- Applicare i principi guida del file requisiti primario con una roadmap concreta e verificabile prima della fase di implementazione.

### Verifica
1. Comando eseguito: `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` (13 test passati).
2. Comando eseguito: `npm run build` (build OK).
3. Controllo: entry registrata in coda a `_SQUADRA_DIARIO.md`.

## 2026-02-19 18:53:32 - COORDINATORE > WAVE CHECKOUT 1-3 IMPLEMENTATA E VERIFICATA

### Cosa e stato fatto
- Implementata la wave prioritaria checkout (alto impatto, basso rischio) sui punti concordati:
  1. Inizializzazione Stripe in `CheckoutModal` spostata fuori dal render con `useEffect` idempotente.
  2. Rimossa la doppia anagrafica nel modal: i dati cliente arrivano dal checkout principale.
  3. Allineato `orderId` locale a quello backend per pagamenti carta.
  4. Migliorata accessibilita errori nei passi `dati` e `spedizione` (`id/htmlFor`, `aria-invalid`, `aria-describedby`, alert e focus primo campo invalido).
- Correzioni emerse dal revisore qualita:
  - evitato crash dal flusso pagamento aperto da `CartDrawer` rendendo `customer` opzionale in modal con guard e fallback a `/checkout`;
  - allineato shape ordine su `unitPrice` nei record checkout;
  - estesa persistenza dati fatturazione nel record ordine (`billingAddress`, `billingCity`, `billingCap`, `billingProvince`);
  - hardening a11y modal pagamento (`role=dialog`, `aria-modal`, `aria-labelledby`, `aria-label` close);
  - radio metodo spedizione resi semanticamente corretti (`fieldset/legend`, `name` condiviso, `sr-only` al posto di `hidden`).

### File toccati
- `src/components/CheckoutModal.tsx`
- `src/pages/CheckoutPage.tsx`
- `src/lib/storefrontStore.ts`
- `_SQUADRA_DIARIO.md`

### Perche
- Ridurre frizioni e incoerenze nel checkout B2B mantenendo rischio basso e compatibilita con l'architettura attuale.
- Eliminare mismatch ordine/ID e migliorare robustezza/accessibilita del flusso di pagamento.

### Verifica
1. Comando eseguito: `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` (13 test passati).
2. Comando eseguito: `npm run build` (build OK).
3. Revisione qualita dedicata sui file modificati: nessun blocco critico/alto residuo.

## 2026-02-19 19:05:18 - COORDINATORE > WAVE 4-6 (RICERCA HEADER, NAV MOBILE CATEGORIE, FILTRI CATEGORIA)

### Cosa e stato fatto
- Implementata ricerca header operativa in `home_v2`:
  - invio con Enter/click bottone `Trova prodotti`;
  - suggerimenti immediati su prodotti/categorie/sezioni;
  - feedback stati (`success`, `empty`, `error`) con microtesti chiari;
  - fallback rapido verso categorie popolari in caso di zero risultati.
- Implementato fallback mobile per categorie profonde senza hover:
  - nuovo trigger `Categorie` in nav mobile/tablet;
  - pannello espandibile con drill-down categoria > gruppo > sezione;
  - CTA contestuali `Apri sottocategorie`, `Indietro`, `Chiudi menu`.
- Migliorato pattern filtri in pagina categoria (mobile-first):
  - bottone filtri con conteggio attivi;
  - stato filtri attivi come chip removibili;
  - CTA esplicite `Mostra N prodotti` e `Rimuovi tutti i filtri`;
  - copy ordinamento e conteggio risultati resi piu chiari (`Rilevanza`, `Prodotti trovati: N`).
- Correzioni qualità successive a review:
  - fix rischio pagina vuota falsa su cambio categoria/paginazione (reset+clamp `currentPage` e condizione empty-state);
  - miglioramenti a11y (label/input associati nei filtri, `aria-label` paginazione);
  - resa thumbnail sottocategorie ripristinata (rimossa opacita forzata);
  - rimossa semantica `listbox` impropria sui suggerimenti ricerca.

### File toccati
- `src/components/home_v2/HomeV2Header.tsx`
- `src/components/home_v2/HomeV2.css`
- `src/components/CategoryPage.tsx`
- `src/components/CategoryPage.css`
- `_SQUADRA_DIARIO.md`

### Perche
- Aumentare efficacia di discovery e navigazione (soprattutto mobile) e ridurre attrito sui filtri in coerenza con requisiti primari (B2B-first, mobile-first, conversione, accessibilita).

### Verifica
1. Comando eseguito: `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` (13 test passati).
2. Comando eseguito: `npm run build` (build OK).
3. Revisione qualita dedicata sui file wave 4-6: nessun blocco alto residuo.

## 2026-02-19 19:15:43 - COORDINATORE > WAVE SUCCESSIVA (EMPTY-STATE CONCLUSIVO + HARDENING ASSET/FONT)

### Cosa e stato fatto
- Empty-state pagina categoria reso conclusivo:
  - CTA `Richiedi preventivo online` ora porta a `/contatti` con parametri precompilati (`oggetto`, `categoria`, `messaggio`).
- Pagina contatti aggiornata per supportare precompilazione richiesta:
  - prefill iniziale di `Oggetto` e `Messaggio` da query string;
  - banner contestuale quando la richiesta nasce da una categoria specifica;
  - sincronizzazione stato in caso di variazione query params sulla stessa route.
- Hardening performance/coerenza UI su home_v2:
  - ridotto carico font duplicato centralizzando il caricamento font globali e rimuovendo import ridondanti locali;
  - sostituiti fallback immagine remoti in componenti home_v2 con asset locale del progetto;
  - aggiunti `loading="lazy"` e `decoding="async"` sulle immagini card categoria.

### File toccati
- `src/components/CategoryPage.tsx`
- `src/pages/ContactPage.tsx`
- `src/styles/globals.css`
- `src/components/home_v2/HomeV2.css`
- `src/components/CategoryPage.css`
- `src/components/home_v2/HomeV2CategoryCards.tsx`
- `src/components/home_v2/HomeV2Products.tsx`
- `src/components/home_v2/HomeV2BlogPreviews.tsx`
- `src/components/home_v2/HomeV2Hero.tsx`
- `_SQUADRA_DIARIO.md`

### Perche
- Convertire il punto di attrito "categoria senza prodotti" in percorso utile di lead generation.
- Ridurre dipendenze esterne non necessarie e migliorare robustezza visuale/performance con fallback locali.

### Verifica
1. Comando eseguito: `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` (13 test passati).
2. Comando eseguito: `npm run build` (build OK).
3. Revisione qualita dedicata: nessun blocco critico/alto su questa wave.

## 2026-02-19 19:25:22 - COORDINATORE > UX/UI > SVILUPPO > REVISIONE QUALITA (TELEMETRIA + CWV)

### Cosa e stato fatto
- Completata la wave di telemetria UX ad alto impatto e basso rischio:
  - tracciamento filtri categoria (`filters_toggle`, `filters_apply`, `filters_reset`, `filter_chip_remove`);
  - tracciamento ordinamento e paginazione (`sort_change`, `pagination_navigate`);
  - tracciamento CTA empty-state categoria (`empty_state_call_click`, `empty_state_preventivo_click`);
  - tracciamento visualizzazione contatto precompilato (`contact_prefill_view`).
- Completate micro-ottimizzazioni immagini/CWV:
  - `HomeV2Hero`: `loading="eager"`, `fetchPriority="high"`, `decoding="async"` per immagine hero;
  - `HomeV2Products`: priorita immagini prime card + lazy sulle altre;
  - `HomeV2BlogPreviews`: `loading/decoding` su hero e card;
  - `CategoryPage`: thumbnail sottocategorie con `loading="lazy"`, `decoding="async"`, dimensioni esplicite.
- Hardening tecnico observers CWV:
  - fix listener `visibilitychange`/`pagehide` con riferimenti corretti;
  - prevenzione doppia emissione metriche LCP/CLS con guard di stop idempotente.

### File toccati
- `src/components/CategoryPage.tsx`
- `src/lib/uxTelemetry.ts`
- `src/lib/cwv.ts`
- `src/pages/ContactPage.tsx`
- `src/components/home_v2/HomeV2Hero.tsx`
- `src/components/home_v2/HomeV2Products.tsx`
- `src/components/home_v2/HomeV2BlogPreviews.tsx`
- `_SQUADRA_DIARIO.md`

### Perche
- Rendere misurabili le ipotesi UX principali sui percorsi categoria > contatto/preventivo.
- Migliorare performance percepita e stabilita visuale senza alterare architettura o flussi core.
- Ridurre rischio regressioni con modifiche additive, locali e verificabili.

### Verifica
1. Comando eseguito: `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` (13 test passati).
2. Comando eseguito: `npm run build` (build OK).
3. Controllo ragionato sui file toccati: nessun blocco critico/alto emerso in revisione finale.

## 2026-02-19 19:30:57 - COORDINATORE > UX/UI > SVILUPPO > REVISIONE QUALITA (WCAG SKIP LINK + FORM CONTATTI)

### Cosa e stato fatto
- Implementato skip link accessibile per navigazione da tastiera:
  - aggiunto link "Vai al contenuto principale" nel layout condiviso e nella home;
  - aggiunti target focusabili (`#main-content`, `#home-main-content`) per salto rapido oltre header/navigation.
- Rafforzata accessibilita e qualita del form contatti:
  - associazione esplicita `label/htmlFor` e `id` su tutti i campi;
  - validazione client-side su campi critici (nome, email, oggetto, messaggio);
  - messaggistica errore accessibile con `aria-invalid`, `aria-describedby`, summary `role="alert"`;
  - stato conferma invio con feedback `role="status"`.
- Estesa telemetria UX del contatto:
  - eventi `contact_submit_error` e `contact_submit_success` tracciati nel submit.
- Aggiunta suite test regressione accessibilita per bloccare regressioni future su skip link e form contatti.

### File toccati
- `src/styles/globals.css`
- `src/components/Layout.tsx`
- `src/components/home_v2/HomeV2Page.tsx`
- `src/pages/ContactPage.tsx`
- `src/lib/uxTelemetry.ts`
- `src/components/accessibility-regression.test.ts`
- `_SQUADRA_DIARIO.md`

### Perche
- Allineamento ai requisiti primari WCAG 2.1 AA (operabilita tastiera, comprensione errori form, label associate).
- Riduzione attrito nel funnel preventivo/contatti senza introdurre integrazioni esterne o cambi architetturali rischiosi.
- Migliore osservabilita del funnel contatti tramite eventi UX minimi e verificabili.

### Verifica
1. Comando eseguito: `npm run test -- src/components/accessibility-regression.test.ts src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` (16 test passati).
2. Comando eseguito: `npm run build` (build OK).
3. Controllo ragionato dei file toccati: nessun blocco critico/alto emerso in revisione finale.

## 2026-02-19 19:44:52 - COORDINATORE > UX/UI > SVILUPPO > REVISIONE QUALITA (CHECKOUT STRIPE + TYPOGRAPHY + PAGINE)

### Cosa e stato fatto
- Checkout: aggiunta configurazione Stripe direttamente nello step pagamento con icona impostazioni:
  - pannello inline con inserimento key `pk_...`, salvataggio e reset key;
  - blocco CTA carta quando Stripe non e configurato con messaggio guidato;
  - il modal pagamento rilegge la key aggiornata all'apertura.
- Home/Header: corretta ergonomia search CTA `Trova prodotti` e leggibilita tipografica:
  - bottone ricerca ingrandito e centrato;
  - input/search bar ridimensionati;
  - testo nav/header aumentato e resa mobile bilanciata.
- Font sistema: allineata identita tipografica a `Manrope` su tokens globali e componenti principali, rimuovendo incoerenze precedenti.
- FAQ: fix pagina non funzionante (import `Link` mancante) + hardening pulsante accordion.
- Contatti: pulsante `Invia messaggio` rinforzato a contrasto alto (background/border/shadow) per visibilita consistente.
- "La nostra Azienda": restyling completo con gerarchia visiva coerente al sito (hero, filosofia, punti di forza, CTA finale).
- Account pages: baseline UX/UI migliorata su tutto il pannello:
  - tema colori riallineato al verde brand su sidebar/azioni/CTA;
  - header contestuale account e leggibilita nav aumentata.
- Regressioni: estesi test statici su checkout Stripe e FAQ per prevenire ritorno dei bug.

### File toccati
- `src/pages/CheckoutPage.tsx`
- `src/components/CheckoutModal.tsx`
- `src/config/stripe.ts`
- `src/components/home_v2/HomeV2.css`
- `src/styles/globals.css`
- `src/styles/design-tokens.css`
- `src/pages/FaqPage.tsx`
- `src/pages/ContactPage.tsx`
- `src/pages/AboutPage.tsx`
- `src/components/auth/AccountPage.tsx`
- `src/components/ux-ui-regression.test.ts`
- `_SQUADRA_DIARIO.md`

### Perche
- Rispondere ai blocchi UX/UI segnalati dall'utente con massima priorita operativa (checkout, ricerca/header, FAQ, visibilita CTA, coerenza pagine istituzionali/account).
- Ridurre attrito conversione e migliorare leggibilita percepita senza avviare servizi locali o introdurre integrazioni esterne.

### Verifica
1. Comando eseguito: `npm run test -- src/components/accessibility-regression.test.ts src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` (18 test passati).
2. Comando eseguito: `npm run build` (build OK).
3. Controllo ragionato sui file toccati: nessun blocco critico/alto emerso in revisione finale.

## 2026-02-19 20:31:07 - COORDINATORE > UX/UI > SVILUPPO > REVISIONE QUALITA (ACCOUNT COMPLETO + WALLET + SEARCH HEADER)

### Cosa e stato fatto
- Completata ristrutturazione UX/UI di tutte le sezioni account (`/account/*`) con focus alto impatto/basso rischio:
  - dashboard resa operativa con alert contestuali, quick action reali e riepilogo ordini recenti;
  - profilo azienda rinforzato con microtesti guidati, campi obbligatori espliciti, `htmlFor/id`, `aria-invalid`, `aria-describedby`, toggle SDI/PEC con `aria-pressed`;
  - rubrica indirizzi migliorata con semantica form/accessibilita (label associate, helper formati, target obbligatori), CTA e bottoni tipizzati;
  - storico ordini esteso con ricerca/filtro stato, export CSV, azioni dettaglio (riordina/fattura/tracking), attributi `aria-expanded`/`aria-controls`, tabella responsive;
  - fatture estese con filtro stato, tabella responsive e CTA download piu visibile;
  - pagamenti estesi con stato configurazione Stripe, reset key in account, errori inline su key/carta e gestione rimozione carta;
  - preventivi estesi con conversione in ordine e azioni contestuali;
  - preferiti e assistenza trasformati da stub a sezioni operative con CTA visibili e coerenti.
- Area account estesa (`/wallet`) rifinita:
  - corretti className rotti (`trangray` -> `translate`) che impattavano micro-animazioni/posizionamento;
  - migliorata leggibilita economica con formattazione importi in valuta e testi tab piu leggibili.
- Header ricerca home ulteriormente bilanciato:
  - bottone "Trova prodotti" e barra ricerca ingranditi per allineare testo/contenitore e ridurre schiacciamento.

### File toccati
- `src/components/auth/AccountPage.tsx`
- `src/components/wallet/WalletPage.tsx`
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Perche
- Coprire in modo completo l'obiettivo richiesto dall'utente: ristrutturazione UX/UI su tutte le pagine account e miglioramento consistenza globale dei controlli critici.
- Ridurre attrito su flussi business (account, ordini, fatture, pagamenti, assistenza) senza introdurre integrazioni esterne e senza usare avvio/stop del server locale.

### Verifica
1. Comando eseguito: `npm run test -- src/components/accessibility-regression.test.ts src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` (18 test passati).
2. Comando eseguito: `npm run build` (build OK).
3. Controllo ragionato file-to-file su sezioni account/wallet/header: nessun blocco critico/alto emerso.
4. Rilancio verifica finale post-fix testuale/stilistico: stessi comandi ripetuti, esito invariato (18 test passati + build OK).

## 2026-02-19 20:46:00 - COORDINATORE > UX/UI > SVILUPPO > REVISIONE QUALITA (HELP WIDGET + ACCOUNT HUB + FONT UNICO)

### Cosa e stato fatto
- Aggiunto widget aiuto flottante in basso a destra con interazione hover/click:
  - bottone trasparente "Aiuto";
  - scelta rapida tra `Chat AI live`, `Messaggio veloce` (contatti precompilati), `WhatsApp`;
  - chat assistenza automatica in-page con risposte contestuali.
- Rifinito pannello account secondo richiesta:
  - layout hub principale su `/account` con card sezioni;
  - nelle sotto-sezioni sparisce il pannello elenco e resta solo la sezione corrente con percorso + ritorno a pannello.
- Estesa gestione Stripe in account:
  - mantenuta publishable key;
  - aggiunto supporto secret key locale (solo sviluppo) con validazione `sk_...` e reset.
- Migliorato header/home UX:
  - menu account con z-index corretto sopra navbar (niente sovrapposizione sotto nav);
  - icone azione con contorno, badge carrello ridisegnato e visibile solo se conteggio > 0.
- Uniformata tipografia:
  - allineamento a Manrope (font unico) su componenti principali e css card prodotto/home/header.
- Migliorato bottone `Aggiungi` nelle card prodotto:
  - contorno evidente, contrasto migliore, hover coerente brand.

### File toccati
- `src/components/SupportHelpWidget.tsx`
- `src/components/Layout.tsx`
- `src/components/HomePage.tsx`
- `src/lib/uxTelemetry.ts`
- `src/components/auth/AccountPage.tsx`
- `src/config/stripe.ts`
- `src/components/home_v2/HomeV2Header.tsx`
- `src/components/home_v2/HomeV2.css`
- `src/components/ProductListingCard.tsx`
- `src/components/ProductListingCard.css`
- `src/components/Header.tsx`
- `src/components/auth/AuthModal.tsx`
- `src/styles/globals.css`
- `src/styles/design-tokens.css`
- `src/main.tsx`
- `_SQUADRA_DIARIO.md`

### Perche
- Ridurre attrito reale su assistenza e account, migliorare coerenza visiva/contrasto/tipografia e risolvere problemi di layering/leggibilita segnalati dall'utente.
- Mantenere rischio basso: modifiche locali, nessuna integrazione esterna, nessun avvio/stop servizi locali.

### Verifica
1. Comando eseguito: `npm run test -- src/components/accessibility-regression.test.ts src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` (18 test passati).
2. Comando eseguito: `npm run build` (build OK).
3. Controllo ragionato su overlay, z-index, pulsanti e font: nessun blocco critico/alto emerso.
4. Verifica post-estensione widget aiuto: stessi comandi rilanciati con esito `19 test passati` + build OK.

## 2026-02-19 21:17:28 - CAPO > UX/UI > SVILUPPO > COLLAUDO > CAPO

### Cosa è stato fatto
- Checkout: aggiunta anche la gestione `Stripe Secret Key (sk_...)` nel pannello impostazioni del passo pagamento.
  - Salvataggio/validazione `pk_` + `sk_` (se valorizzata), reset con rimozione anche della secret locale.
  - Stato riepilogativo mostra ora sia publishable key che secret locale mascherata.
- Preferiti sopra la navbar:
  - alzato il layer del drawer preferiti (`z-[1500]`) per evitare che navbar/menu account restino sopra il pannello aperto.
- Widget Aiuto pinnato:
  - montato anche nella Home principale `home_v2` e non solo nel layout interno.
  - fissato in basso a destra con offset safe-area e trasparenza stabile.
- Frecce caroselli/etichette sopra le sezioni:
  - contenimento layering dei caroselli Home (`isolation + overflow hidden`) e frecce rientrate dentro area.
  - ridotto z-index frecce dei caroselli Home e blog.
  - contenimento e frecce ricalibrate anche nel carosello sottocategorie categoria.
  - ridotta animazione ingresso card prodotti Home per comportamento piu stabile.
- Navbar pinnata fino a meta pagina poi scompare:
  - implementato controllo scroll nel `HomeV2Header` con shell sticky visibile fino al 50% dello scroll utile; oltre soglia viene nascosta.

### File toccati
- `src/pages/CheckoutPage.tsx`
- `src/components/FavoritesDrawer.tsx`
- `src/components/SupportHelpWidget.tsx`
- `src/components/home_v2/HomeV2Page.tsx`
- `src/components/home_v2/HomeV2Header.tsx`
- `src/components/home_v2/HomeV2.css`
- `src/components/CategoryPage.css`
- `src/components/ux-ui-regression.test.ts`
- `src/components/home-routing-wiring.test.ts`
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Eseguire:
   - `npm run test -- src/components/ux-ui-regression.test.ts src/components/home-routing-wiring.test.ts src/components/accessibility-regression.test.ts`
   - `npm run build`
2. Verificare in UI (server necessario):
   - in checkout (`/checkout`) aprire impostazioni Stripe e inserire `pk_...` + `sk_...`, poi provare reset;
   - aprire `Preferiti` e controllare che sia sopra navbar/menu account;
   - controllare pulsante `Aiuto` fisso in basso a destra su home e pagine interne;
   - scorrere home: navbar resta pinnata fino a meta pagina e poi scompare;
   - controllare che le frecce dei caroselli restino nel proprio blocco senza sovrapporsi alle sezioni successive.

### Nota revisione
- Collaudo tecnico eseguito: test mirati OK (21/21), build OK.

## 2026-02-19 22:18:30 - CAPO > UX/UI > SVILUPPO > COLLAUDO > CAPO

### Cosa è stato fatto
- Audit globale layering/etichette su home, categoria e carrello.
- Fix critico richiesto utente: etichette `Nuovo/Offerta` non devono mai sovrapporsi al carrello.
  - normalizzato layering del carrello (collapsed + expanded) su livelli piu alti e coerenti;
  - aggiunta `isolation` + riduzione z-index + `pointer-events: none` sui badge prodotto;
  - uniformata tipografia etichette (peso/leggibilita) e testo (`Nuovo`, `Offerta`, `Best seller`).
- Rafforzata coerenza anche su CSS categoria per prevenire sovrapposizioni tra sezioni.
- Aggiornati test regressione con controlli espliciti su:
  - layer carrello/preferiti,
  - contenimento frecce,
  - etichette prodotto coerenti.

### File toccati
- `src/components/CartDrawer.tsx`
- `src/components/ProductListingCard.tsx`
- `src/components/ProductListingCard.css`
- `src/components/home_v2/HomeV2Products.tsx`
- `src/components/home_v2/HomeV2.css`
- `src/components/CategoryPage.css`
- `src/components/ux-ui-regression.test.ts`
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Eseguire:
   - `npm run test`
   - `npm run build`
2. Verifica visiva (server necessario sulla tua porta locale):
   - scorrere home/categoria con carrello visibile;
   - controllare che badge `Nuovo/Offerta` restino dentro le card e sotto i layer del carrello;
   - controllare che etichette non intercettino click su carrello/bottoni vicini.

### Nota revisione
- Collaudo tecnico eseguito: `npm run test` OK (104/104), `npm run build` OK.

## 2026-02-19 22:53:28 - CAPO > UX/UI > SVILUPPO > COLLAUDO > CAPO

### Cosa è stato fatto
- Fix blocco checkout segnalato utente:
  - dal `CartDrawer` il click su "Procedi al pagamento" ora naviga sempre alla pagina `/checkout`.
  - rimossa la dipendenza dal `CheckoutModal` nel drawer per evitare flussi che non partivano.
- Fix icona aiuto fissa non visibile:
  - widget aiuto montato globalmente in `App.tsx` (una sola istanza valida su tutte le rotte);
  - rimosso mount duplicato da `Layout` e `HomeV2Page`;
  - aumentata visibilita grafica e pinning bottom-right con fallback safe-area.
- Consolidato controllo etichette pill (overflow testo) gia richiesto:
  - badge con clamp/ellipsis, min-height e centratura uniforme.
- Aggiornati test regressione:
  - verifica mount globale widget aiuto in `App.tsx`;
  - verifica navigazione diretta checkout da `CartDrawer` e assenza `CheckoutModal` nel drawer.

### File toccati
- `src/components/CartDrawer.tsx`
- `src/App.tsx`
- `src/components/Layout.tsx`
- `src/components/home_v2/HomeV2Page.tsx`
- `src/components/SupportHelpWidget.tsx`
- `src/components/ux-ui-regression.test.ts`
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Eseguire:
   - `npm run test`
   - `npm run build`
2. Verifica UI (server necessario sulla tua porta locale):
   - aprire carrello e premere "Procedi al pagamento" (deve aprire `/checkout`);
   - controllare icona Aiuto sempre presente in basso a destra su home, categoria, prodotto, checkout, account;
   - verificare che il widget non compaia duplicato.

### Nota revisione
- Collaudo tecnico eseguito: `npm run test` OK (105/105), `npm run build` OK.

## 2026-02-19 23:58:19 - CAPO > UX/UI > SVILUPPO > COLLAUDO > CAPO

### Cosa è stato fatto
- Fix blocco checkout da carrello:
  - rimosso flusso modale nel drawer; il click su "Procedi al pagamento" ora porta direttamente a `/checkout`.
- Fix widget Aiuto non visibile/fisso:
  - reso globale con mount unico in `App.tsx`;
  - rimosso mount duplicato da `Layout` e `HomeV2Page`;
  - spostato piu vicino all'angolo (bottom/right 8px safe-area), contrasto alto e leggibilita migliorata.
- Restyling globale "piu corpo" su tutto il sito:
  - nuovo font base `Plus Jakarta Sans` (fallback Manrope);
  - migliorato contrasto testi grigi e bordi;
  - aggiunta profondita globale a card/pannelli bianchi;
  - bottoni principali piu marcati (border + shadow).
- Restyling Home V2 per UI meno "fine/secca":
  - titoli/testi/nav con pesi font piu corposi;
  - card prodotto con ombre piu evidenti;
  - testi descrittivi non piu italic dove penalizzava leggibilita;
  - mantenuto contenimento badge e frecce per evitare sovrapposizioni.
- Test aggiornati per coerenza nuove scelte visive e flussi.

### File toccati
- `src/components/CartDrawer.tsx`
- `src/App.tsx`
- `src/components/Layout.tsx`
- `src/components/home_v2/HomeV2Page.tsx`
- `src/components/SupportHelpWidget.tsx`
- `src/styles/design-tokens.css`
- `src/styles/globals.css`
- `src/components/home_v2/HomeV2.css`
- `src/components/ux-ui-regression.test.ts`
- `_SQUADRA_DIARIO.md`

### Come verificare
1. Eseguire:
   - `npm run test`
   - `npm run build`
2. Verifica UI (server necessario sulla tua porta):
   - apri carrello e premi "Procedi al pagamento" -> deve aprire subito `/checkout`;
   - controlla il pulsante `Aiuto` in basso a destra su ogni pagina;
   - verifica contrasto card/testi/bottoni nelle pagine: home, categoria, checkout, account, faq, contatti.

### Nota revisione
- Collaudo tecnico eseguito: `npm run test` OK (105/105), `npm run build` OK.

## 2026-02-20 00:15:27 - CAPO (coordinatore) > UX/UI (specialisti) > SVILUPPO > COLLAUDO > CAPO

### Cosa è stato fatto
- Inserita in Home la sezione Figma **"Categorie in evidenza"** (`node-id=4618:15262`) con 10 tipologie e immagini dedicate, mantenendo coerenza con routing reale del catalogo.
- Collegati i click delle card alle pagine categoria/sottocategoria esistenti:
  - `/categoria/linea-caldo/cottura-a-contatto`
  - `/categoria/linea-caldo/forni-professionali`
  - `/categoria/linea-caldo/cottura-per-immersione`
  - `/categoria/linea-freddo/refrigerazione`
  - `/categoria/linea-freddo/tavoli-refrigerati`
  - `/categoria/preparazione/carne-e-formaggio`
  - `/categoria/preparazione/mixer-pelatura-e-taglio`
  - `/categoria/preparazione/lavorazione-pasta`
  - `/categoria/carrelli-arredo/carrelli-neutri`
  - `/categoria/carrelli-arredo/carrelli-caldi-e-freddi`
- Integrata la nuova sezione nella `HomeV2Page` subito dopo la Hero.
- Rifattorizzata la sezione promo home da carousel fragile a griglia responsive (3/2/1 colonne) per ridurre sovrapposizioni e comportamenti instabili di frecce/track.
- Aggiornati test di regressione per coprire presenza della sezione tipologia in home e dei principali link.

### Ipotesi verificabile / confutazione
- Ipotesi: la sezione tipologia aumenta orientamento iniziale e velocizza accesso alle aree del catalogo senza introdurre regressioni di routing.
- Confutazione: se i link non puntano a route valide, il test wiring fallisce o la navigazione porta a 404/layout errati.

### Criteri di verifica applicati
1. Test regressione wiring/UI: passano tutti.
2. Build produzione: completata senza errori.
3. Controllo ragionato file toccati: classi CSS dedicate (`home-v2-featured-types-*`) senza collisioni con naming preesistente.

### File toccati
- `src/components/home_v2/HomeV2FeaturedTypesSection.tsx`
- `src/components/home_v2/HomeV2Page.tsx`
- `src/components/home_v2/HomeV2PromoSection.tsx`
- `src/components/home_v2/HomeV2.css`
- `src/components/home-routing-wiring.test.ts`
- `src/components/ux-ui-regression.test.ts`
- `_SQUADRA_DIARIO.md`

### Verifica (comandi eseguiti)
- `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` -> **OK (20/20 test)**
- `npm run build` -> **OK**

### Note operative
- Vincolo rispettato: nessun comando di avvio/arresto server locale.
- Integrazioni esterne ignorate in questa iterazione, salvo asset immagine Figma richiesti per fedeltà UI.

## 2026-02-20 00:29:55 - CAPO (coordinatore) > UX/UI > SVILUPPO > COLLAUDO > CAPO

### Cosa è stato fatto
- **Widget Aiuto** riposizionato in angolo basso-destro reale e reso meno invasivo:
  - ancoraggio `bottom/right` a `0` (con safe-area),
  - pulsante compatto circolare,
  - etichetta `Aiuto` mostrata solo su hover/focus,
  - menu/chat con apertura verso l'alto.
- Corretto il bug richiesto: la tendina aiuto ora si apre **sopra** il pulsante (ordine DOM invertito).
- Migliorata la stabilità navbar su metà pagina: introdotta isteresi (`hide 56%` / `show 44%`) + `requestAnimationFrame` per eliminare sfarfallio vicino alla soglia.
- Aggiornata la strip promo top:
  - rimosso il testo "Spedizione gratuita sopra 2.000 EUR + IVA in Italia".
  - impostato default e normalizzazione legacy su "Riservato solo a Partite IVA".
- Tolto sfondo verde dalle sezioni Home richieste (`Categorie in evidenza` e `Scopri le nostre proposte`) con adattamento alla palette neutra del sito.

### File toccati
- `src/components/SupportHelpWidget.tsx`
- `src/components/SupportHelpWidget.css`
- `src/components/home_v2/HomeV2Header.tsx`
- `src/components/home_v2/HomeV2.css`
- `src/lib/storefrontStore.ts`
- `src/components/home-routing-wiring.test.ts`
- `src/components/ux-ui-regression.test.ts`
- `_SQUADRA_DIARIO.md`

### Verifica (comandi eseguiti)
- `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` -> **OK (20/20 test)**
- `npm run build` -> **OK**

### Note
- Vincolo rispettato: nessun avvio/arresto server locale.

## 2026-02-20 00:50:00 - CAPO (coordinatore) > UX > INTERFACCIA > SVILUPPO > COLLAUDO > CAPO

### Cosa è stato fatto
- Eseguita revisione trasversale di coerenza UI su pagine principali e area account, con focus su:
  - font unico,
  - scala tipografica coerente,
  - shell/layout pagina uniforme,
  - CTA primaria/secondaria consistenti,
  - superfici/card con contrasto e profondità allineate.
- Uniformato il font globale a **Manrope** per tutto il sito tramite design tokens.
- Introdotte classi globali condivise in `globals.css`:
  - `app-page-shell`
  - `app-page-title`
  - `app-page-subtitle`
  - `app-surface`
  - `app-action-primary`
  - `app-action-secondary`
- Applicata la shell coerente (`app-page-shell`) e tipografia titolo/sottotitolo alle principali pagine:
  - `About`, `Contact`, `FAQ`, `Guides`, `Guide`, `Glossary`, `Cart`, `Checkout`, `Product`, `BusinessType`, `Terms`, `NotFound`.
- Uniformati pulsanti CTA principali/secondari sulle pagine chiave (`Cart`, `Checkout`, `FAQ`, `BusinessType`, `Contact`, `Product`, `NotFound`).
- Estesa coerenza anche al contenitore account (`AccountPage`) con shell condivisa.
- Aggiornati test di regressione UI per verificare:
  - font token su Manrope,
  - presenza della shell pagina sulle pagine core,
  - presenza dei nuovi pattern globali.

### Ipotesi verificabile / confutazione
- Ipotesi: centralizzando shell/typography/CTA in stili condivisi si riducono incoerenze visive e frammentazione tra pagine senza introdurre regressioni funzionali.
- Confutazione: se i componenti principali non importano/consumano i pattern condivisi, i test di regressione falliscono o la build segnala rotture.

### Criteri di verifica applicati
1. Test regressione wiring/UI aggiornati e passati.
2. Build produzione completata senza errori.
3. Controllo ragionato su pagine principali + account dopo normalizzazione classi.

### File toccati
- `src/styles/design-tokens.css`
- `src/styles/globals.css`
- `src/pages/AboutPage.tsx`
- `src/pages/BusinessTypePage.tsx`
- `src/pages/CartPage.tsx`
- `src/pages/CheckoutPage.tsx`
- `src/pages/ContactPage.tsx`
- `src/pages/FaqPage.tsx`
- `src/pages/GlossaryPage.tsx`
- `src/pages/GuidePage.tsx`
- `src/pages/GuidesPage.tsx`
- `src/pages/NotFoundPage.tsx`
- `src/pages/ProductPage.tsx`
- `src/pages/TermsPage.tsx`
- `src/components/auth/AccountPage.tsx`
- `src/components/ux-ui-regression.test.ts`
- `_SQUADRA_DIARIO.md`

### Verifica (comandi eseguiti)
- `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` -> **OK (21/21 test)**
- `npm run build` -> **OK**

### Note
- Vincolo rispettato: nessun avvio/arresto server locale.

## 2026-02-20 00:51:30 - CAPO > COLLAUDO FINALE COERENZA UI

### Cosa è stato fatto
- Rifinitura di sicurezza su `globals.css`: rimossi override troppo generici su `.app-page-shell h1` e `.app-page-shell p` per evitare conflitti di contrasto in sezioni scure.

### File toccati
- `src/styles/globals.css`
- `_SQUADRA_DIARIO.md`

### Verifica
- `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` -> **OK**
- `npm run build` -> **OK**

## 2026-02-20 01:36:30 - CAPO (coordinatore) > UX/Interfaccia > Sviluppo > Collaudo > CAPO

### Cosa è stato fatto
- Uniformata la **larghezza delle sezioni principali** con un unico riferimento (`--container-max`) su:
  - shell pagine (`app-page-shell`),
  - contenitori Home v2 (header, nav, mega-menu, hero overlay, featured, promo, plus, products, category cards, blog),
  - container footer.
- Rimossi i `max-w-*` locali su pagine principali/account che creavano larghezze diverse tra sezioni; ora la larghezza è governata dalla shell condivisa.
- Riordinata la home: la sezione **Plus** è stata spostata subito sotto l'hero.
- Migliorato il carousel blog: frecce centrate e fuori dall'area contenuto (non sovrapposte alle card), con comportamento responsive.
- Widget aiuto rifinito:
  - più piccolo e meno invasivo,
  - colore verde meno aggressivo,
  - posizionamento fisso con margine dai bordi (`safe-area + 16px`),
  - menu/chat ancorati sopra il pulsante con pannelli assoluti (evita aperture da area "sotto" il bottone).
- Checkout (UX/UI + prevenzione errori):
  - **Partita IVA resa obbligatoria** nel passo dati,
  - aggiunta **conferma dati fatturazione** obbligatoria prima del pagamento,
  - scelta metodo pagamento resa esplicita (stato iniziale vuoto + errore guidato),
  - messaggio preventivo per pagamento carta su modulo Stripe sicuro,
  - stile pulsanti impostazioni Stripe reso coerente con pattern primario/secondario.
- Aggiornati test di regressione UX/UI con nuove verifiche su:
  - larghezza uniforme tokenizzata,
  - vincoli checkout (P.IVA, conferma fatturazione, scelta metodo).

### Ipotesi verificabile / confutazione
- Ipotesi: unificando i container e rimuovendo `max-w` locali si elimina la disomogeneità di larghezza tra sezioni senza rompere i flussi.
- Confutazione: se restano container locali divergenti o regressioni funzionali, i test di regressione e/o la build falliscono.

### Criteri di verifica applicati
1. Test regressione UI/wiring eseguiti e passati.
2. Build produzione completata senza errori.
3. Controllo ragionato sui file toccati per coerenza visuale e prevenzione errori checkout.

### File toccati
- `src/styles/globals.css`
- `src/components/home_v2/HomeV2.css`
- `src/components/home_v2/HomeV2Page.tsx`
- `src/components/Footer.css`
- `src/components/SupportHelpWidget.tsx`
- `src/components/SupportHelpWidget.css`
- `src/pages/AboutPage.tsx`
- `src/pages/BusinessTypePage.tsx`
- `src/pages/CartPage.tsx`
- `src/pages/CheckoutPage.tsx`
- `src/pages/ContactPage.tsx`
- `src/pages/FaqPage.tsx`
- `src/pages/GlossaryPage.tsx`
- `src/pages/GuidePage.tsx`
- `src/pages/GuidesPage.tsx`
- `src/pages/NotFoundPage.tsx`
- `src/pages/ProductPage.tsx`
- `src/pages/TermsPage.tsx`
- `src/components/auth/AccountPage.tsx`
- `src/components/ux-ui-regression.test.ts`
- `_SQUADRA_DIARIO.md`

### Verifica (comandi eseguiti)
- `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` -> **OK (23/23 test)**
- `npm run build` -> **OK**

### Note
- Vincolo rispettato: nessun avvio/arresto server locale.
- Integrazioni esterne ignorate in questa iterazione.

## 2026-02-20 01:38:10 - CAPO > Rifinitura larghezze globali

### Cosa è stato fatto
- Completata uniformazione larghezze residue su componenti legacy/non-home che mantenevano limiti `1600px`.
- Allineati i container a `--container-max` anche per category layout CSS e header/home legacy.

### File toccati
- `src/components/CategoryPage.css`
- `src/components/Header.tsx`
- `src/components/HomePage.tsx`
- `_SQUADRA_DIARIO.md`

### Verifica
- `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` -> **OK (23/23 test)**
- `npm run build` -> **OK**

## 2026-02-20 01:46:20 - CAPO > Correzione allineamento header/nav + widget aiuto

### Cosa è stato fatto
- Ripristinato blocco brand in header con bordo e struttura leggibile:
  - `Bianchipro`
  - `Soluzioni ed attrezzature professionali per la ristorazione`
- Corretta la percezione di barra coperta:
  - aumento z-index shell header,
  - z-index esplicito su barra nav.
- Riallineata la strip promo alla griglia contenuti (non più centrata artificialmente).
- Widget aiuto:
  - meno trasparente (più visibile),
  - spostato più in alto su mobile per stare sopra barra bassa carrello,
  - mantenuto distacco dai bordi schermo.

### File toccati
- `src/components/home_v2/HomeV2Header.tsx`
- `src/components/home_v2/HomeV2.css`
- `src/components/SupportHelpWidget.tsx`
- `src/components/SupportHelpWidget.css`
- `_SQUADRA_DIARIO.md`

### Verifica
- `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` -> **OK (23/23 test)**
- `npm run build` -> **OK**

### Note
- Vincolo rispettato: nessun avvio/arresto server locale.

## 2026-02-20 02:03:40 - CAPO > Allineamento header/nav richiesto dal cliente

### Cosa è stato fatto
- Allineata la griglia orizzontale di header/nav alle sezioni card della home impostando padding shell home a `16px`.
- Rimossa la capsule bianca del logo per far partire `Bianchipro` sulla stessa linea d'inizio delle card/sezioni sotto.
- Ridotto l'effetto "fascia bianca" area ricerca rendendo il blocco top trasparente e i controlli su fondo grigio chiaro coerente.

### File toccati
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Verifica
- `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` -> **OK (23/23 test)**
- `npm run build` -> **OK**

## 2026-02-20 02:22:10 - CAPO > Allineamento header con card "Abbiamo prezzi super competitivi"

### Cosa è stato fatto
- Allineato tutto il blocco header (logo, ricerca, nav) alla stessa colonna di inizio card Plus impostando il padding shell header desktop a `0`.
- Mantenuto padding mobile a `16px` per non perdere leggibilità su schermi piccoli.

### File toccati
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Verifica
- `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` -> **OK (23/23 test)**
- `npm run build` -> **OK**

## 2026-02-20 02:25:30 - CAPO > Fix definitivo allineamento header/nav con card Plus

### Cosa è stato fatto
- Corretto allineamento inizio/fine di logo + nav rispetto alla riga card Plus con formula unica:
  - contenuto sezioni: `--home-v2-shell-max-width`
  - header/nav: `--home-v2-header-max-width = shell + 2 * padding`
- Spostata la resa visiva della nav-bar (sfondo e bordi) dal wrapper full-width al blocco interno allineato, per evitare effetto "attaccato ai lati".

### File toccati
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Verifica
- `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` -> **OK (23/23 test)**
- `npm run build` -> **OK**

## 2026-02-20 02:28:45 - CAPO > Spostamento verso centro logo e azioni header

### Cosa è stato fatto
- Spostato `Bianchipro` verso destra aggiungendo offset controllato al blocco logo.
- Spostato `Account/Preferiti/Carrello` verso sinistra aggiungendo offset controllato al blocco azioni.
- Offset disattivati su tablet/mobile per non compromettere il layout responsive.

### File toccati
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Verifica
- `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` -> **OK (23/23 test)**
- `npm run build` -> **OK**

## 2026-02-20 02:31:50 - CAPO > Ripristino centratura header come richiesto

### Cosa è stato fatto
- Annullato spostamento ai lati di logo e azioni header.
- Centrata la riga promo (`Riservato solo a Partite IVA`) nel suo contenitore.
- Ripristinato sfondo pieno dietro blocco `Bianchipro` per evitare effetto testi senza barra durante scroll.
- Ripristinato nav wrapper con sfondo/bordi full-width e contenuto interno centrato come comportamento originale.

### File toccati
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Verifica
- `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` -> **OK (23/23 test)**
- `npm run build` -> **OK**

## 2026-02-20 02:41:55 - CAPO > Fix posizionamento richiesto (logo/azioni/hero)

### Cosa è stato fatto
- Allineata la partenza del sottotitolo `Soluzioni...` alla stessa linea di `Bianchipro`:
  - lockup logo passato a allineamento sinistro.
- Spostati verso il centro i blocchi top header su desktop:
  - logo/brand traslato a destra,
  - account/preferiti/carrello traslati a sinistra.
- Spostato a destra anche il card hero con testo (`Siamo orgogliosi...`) per coerenza con richiesta "come prima".
- Applicato comportamento responsive:
  - offset ridotti su 1280,
  - azzerati su tablet/mobile.

### File toccati
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Verifica
- `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` -> **OK (23/23 test)**
- `npm run build` -> **OK**

## 2026-02-20 02:54:45 - CAPO > Avvicinamento voci nav (Home/Contatti)

### Cosa è stato fatto
- Ridotta la distanza tra le voci testuali della navbar desktop (`Home ... Contatti`).
- Reso il gruppo nav più compatto verso il centro:
  - `justify-content: center` sulla lista nav,
  - gap ridotti nei gruppi sinistra/centro/destra,
  - rimosso l'effetto di spinta estrema del gruppo centrale (`flex: 0 1 auto`).

### File toccati
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Verifica
- `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` -> **OK (23/23 test)**
- `npm run build` -> **OK**

## 2026-02-20 03:08:30 - CAPO > Avvicinamento blocchi top header (logo/azioni)

### Cosa è stato fatto
- Riorganizzato il blocco top header desktop in griglia centrata (logo, ricerca, azioni) per avere i gruppi più vicini al centro.
- Allineato meglio il lockup `Bianchipro + Soluzioni...`:
  - sottotitolo attaccato e allineato all'inizio del titolo.
- Ridotta distanza interna blocco azioni (`Account/Preferiti/Carrello`) con gap più compatto.
- Mantenuto fallback responsive: sotto 1024px il layout torna flex/wrap.

### File toccati
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Verifica
- `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` -> **OK (23/23 test)**
- `npm run build` -> **OK**

## 2026-02-20 03:27:20 - CAPO + UX + Interfaccia + Collaudo > Analisi homepage e riallineamento stile

### Analisi squadra (sintesi operativa)
- Attrito 1: blocco brand/header e hero non allineati alla direzione visiva richiesta (necessario shift a destra).
- Attrito 2: bottoni top action percepiti troppo "stretti" tra loro.
- Attrito 3: percezione di sovrapposizione nav con barra chiara inferiore durante scroll.
- Attrito 4: homepage con superfici troppo eterogenee rispetto alla pagina prodotto (che usa card bianche con bordo soft + ombra leggera).

### Interventi applicati
- Spostamento a destra del blocco brand `Bianchipro + Soluzioni...` tramite variabile desktop dedicata.
- Spostamento a destra del card hero con testo `Siamo orgogliosi...` tramite variabile desktop dedicata.
- Top action (`Account/Preferiti/Carrello`) resi meno ravvicinati con gap aumentato e larghezza minima maggiore.
- Risolto layering header/nav:
  - rimosso clipping da `max-height` nello stato sticky hidden,
  - alzati i livelli z-index di shell/nav.
- Riallineamento estetico homepage verso pagina prodotto:
  - featured shell/promo shell convertite a superfici bianche con bordo `#e2e8f0` e ombra sobria,
  - sezione plus resa neutra (no fondo pieno),
  - plus card rese bianche con bordo soft e shadow coerente.
- Responsive preservato:
  - shift ridotti su 1280,
  - azzerati su <=1024.

### File toccati
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Verifica
- `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` -> **OK (23/23 test)**
- `npm run build` -> **OK**

### Note
- Vincolo rispettato: nessun avvio/arresto server locale.

## 2026-02-20 03:30:55 - CAPO > Distacco nav da brand + tendina adattata

### Cosa è stato fatto
- Abbassata la nav della homepage per staccarla visivamente dal blocco `Bianchipro`.
- Adattata la tendina mega-menu alle nuove larghezze:
  - non più full-width viewport,
  - ora centrata e limitata a `--home-v2-shell-max-width`,
  - bordo inferiore arrotondato e clipping coerente.
- Aggiustato offset anche su tablet/mobile con valore ridotto.

### File toccati
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Verifica
- `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` -> **OK (23/23 test)**
- `npm run build` -> **OK**

## 2026-02-20 03:34:20 - CAPO > Fix overlap header su nav home

### Cosa è stato fatto
- Risolto overlap del blocco `Bianchipro + ricerca` sulla nav:
  - rimosso vincolo di altezza fissa del top header,
  - impostato `height: auto` + `min-height` coerente con barra ricerca,
  - ridotto padding verticale del top header per equilibrio.
- Abbassata ulteriormente la nav per separazione visiva stabile dal blocco superiore.

### File toccati
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Verifica
- `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts` -> **OK (23/23 test)**
- `npm run build` -> **OK**

## 2026-02-20 11:24:30 - CAPO + Esperienza d'uso + Interfaccia + Microtesti + Collaudo > Revisione profonda UX/UI home (focus top) e allineamento a ProductPage

### Cosa e stato fatto
- Coordinamento a 4 ruoli con analisi separate su:
  - euristiche usabilita (NNG),
  - interfaccia/griglia/spazi,
  - microtesti operativi,
  - collaudo accessibilita.
- Priorita applicata alla parte alta homepage (`promo strip`, `header`, `ricerca`, `nav`, `hero`) con allineamento visuale al linguaggio della pagina prodotto.

### Interventi implementati (codice)
- `src/components/home_v2/HomeV2Header.tsx`
  - Aggiunta semantica navigazione: wrapper `nav` con `aria-label`.
  - Ricerca resa piu accessibile: label esplicita sopra input, combobox/listbox ARIA, gestione tastiera suggerimenti (`ArrowUp/Down`, `Enter`, `Escape`), stato suggerimento attivo.
  - Migliorati microtesti ricerca (placeholder e feedback errore/empty) in chiave operativa B2B.
  - Mega-menu categoria con attributi ARIA (`aria-expanded`, `aria-controls`, `aria-haspopup`) e apertura via tastiera.
  - Sticky header reso robusto: resta visibile quando il focus tastiera e dentro l'header; supporto preferenze `prefers-reduced-motion`.
- `src/components/home_v2/HomeV2.css`
  - Rifinitura visiva top area e hero per coerenza con ProductPage (superficie, bordo, ombra, gerarchie tipografiche, CTA primaria verde ad alto contrasto).
  - Hero reso responsive (desktop/tablet/mobile) con card non debordante e CTA usabile su mobile.
  - Migliorata barra ricerca (label, focus ring, layout small-screen) e stato selezione suggerimento.
  - Aggiunti stati `:focus-visible` coerenti su controlli interattivi top-home (logo, azioni, nav, ricerca, hero CTA, menu mobile).
  - Ridotto distacco nav-top non necessario (`margin-top` nav zone da 14px a 0).
- `src/lib/storefrontStore.ts`
  - Aggiornati default hero copy e CTA con messaggio B2B piu operativo.
- `src/components/home_v2/HomeV2PromoSection.tsx`
  - Sostituiti testi placeholder dei tre banner promozionali con contenuti concreti e CTA specifiche.

### File toccati
- `src/components/home_v2/HomeV2Header.tsx`
- `src/components/home_v2/HomeV2.css`
- `src/lib/storefrontStore.ts`
- `src/components/home_v2/HomeV2PromoSection.tsx`
- `_SQUADRA_DIARIO.md`

### Verifica
- Test regressione mirati:
  - `npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts src/components/accessibility-regression.test.ts` -> **OK (26/26 test)**
- Build produzione:
  - `npm run build` -> **OK**
- Verifica visiva reale (porta 3000 gia gestita da Federico, nessun avvio/arresto eseguito):
  - baseline desktop: `_tmp/home-before-desktop-1920x1080.png`
  - baseline mobile: `_tmp/home-before-mobile-390x844.png`
  - post-fix intermedio desktop: `_tmp/home-after-desktop-1920x1080.png`
  - post-fix intermedio mobile: `_tmp/home-after-mobile-390x844.png`
  - post-fix finale desktop: `_tmp/home-final3-desktop-1920x1080.png`
  - post-fix finale mobile: `_tmp/home-final3-mobile-390x844.png`
- Controllo errori runtime: fixato errore JSX in `HomeV2Header.tsx` rilevato da `_LOG/vite_err.log` durante validazione intermedia.
- Build finale dopo micro-fix responsive:
  - `npm run build` -> **OK**

### Note
- Vincolo non negoziabile rispettato: nessun comando di start/stop servizio locale.

## 2026-02-20 11:55:17 - CAPO + 4 ruoli > Bonifica UX/UI top-home (header/nav/search/hero) ciclo 2

### Cosa e stato fatto
- Eseguita analisi rapida a 4 ruoli (esperienza d'uso, interfaccia, collaudo, microtesti) e integrata nel ciclo di fix.
- Corretto il problema segnalato di nav "appiccicata" e non centrata verticalmente.
- Applicato pacchetto esteso di correzioni top-home:
  - centratura verticale nav con piu respiro sopra/sotto,
  - target touch minimi migliorati (icone header e CTA buy card),
  - contrasto migliorato del prezzo barrato,
  - hint preventiva nella ricerca (prima del submit),
  - pannello categorie mobile con semantica dialog + focus iniziale + chiusura con ESC,
  - struttura mobile nav piu leggibile (toggle categorie su riga dedicata, link con area clic piu ampia),
  - riduzione compressione blocco azioni su viewport stretti.

### File toccati
- `src/components/home_v2/HomeV2Header.tsx`
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Perche
- Risolvere incoerenze UX/UI evidenti nella parte alta (allineamento nav, spaziatura, leggibilita, touch targets, accessibilita interazione mobile) che impattavano percezione di qualita e usabilita.

### Verifica
- Test regressione mirati:
  - `TMPDIR=/tmp npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts src/components/accessibility-regression.test.ts` -> **OK (26/26 test)**
- Verifica visiva reale (nessun avvio/arresto server):
  - desktop aggiornato: `_tmp/home-next-desktop-1920x1080.png`
  - mobile aggiornato: `_tmp/home-next-mobile-390x844.png`

### Note
- Vincolo rispettato: non sono stati eseguiti comandi di start/stop del servizio locale.

## 2026-02-20 12:32:00 - CAPO > Audit responsive header/nav/hero + pagine principali

### Cosa e stato fatto
- Analisi mirata header/nav/hero (HomeV2Header.tsx/HomeV2Hero.tsx) e sezioni principali (HomeV2.css, HomeV2Products.tsx) per evidenziare criticità responsive su desktop e mobile.
- Individuate due criticità tecniche: le css vars per i container non raggiungono header/hero e la carousel dei prodotti perde i controlli su viewport stretti.
- Documentate le cause tecniche e ipotizzati interventi minimali per riallineare i layout agli obiettivi mobile-first descritti in docs/ricerca-ux/00-indice-generale.md.

### File toccati
- `_SQUADRA_DIARIO.md`

### Perche
- Tracciare le osservazioni UX/UI emerse durante l'audit per mantenere cronologia e fornire un riferimento condiviso per i prossimi fix.

### Verifica
- `git status -sb` -> stato dell'albero dopo l'aggiornamento del diario e senza altre modifiche.

## 2026-02-20 12:41:27 - CAPO + 4 ruoli > Fix strutturali UX/UI cross-page (home top + coerenza card + navigazione)

### Cosa e stato fatto
- Eseguito audit parallelo a 4 ruoli (esperienza d'uso, interfaccia visiva, responsive/layout, collaudo) con priorita su criticita trasversali.
- Risolto bug strutturale della home: variabili container/griglia non ereditate da header+hero (causa layout "appiccicato a sinistra").
- Migliorata navbar top-home (allineamento verticale e respiro coerente) e consolidata coerenza visiva delle superfici/card.
- Corretto comportamento sezione "Esplora tutte le sottocategorie":
  - eliminato effetto visivo di card "vuote" durante espansione,
  - introdotta action area coerente (vai categoria + visualizza tutto/mostra meno),
  - mantenuto comportamento click card per compatibilita regressioni.
- Migliorato carousel prodotti su mobile: ora scorre orizzontalmente con `scroll-snap` anche senza frecce visibili.
- Estesi fix UX/UI anche fuori home:
  - evidenza sottocategoria attiva in pagina categoria,
  - normalizzazione radius/shadow/border su card listino e card categoria,
  - step checkout resi cliccabili sui passaggi gia completati,
  - microtesto footer newsletter allineato al comportamento reale (link a contatti con intento iscrizione).

### File toccati
- `src/components/home_v2/HomeV2Page.tsx`
- `src/components/home_v2/HomeV2.css`
- `src/components/home_v2/HomeV2CategoryCards.tsx`
- `src/components/CategoryPage.tsx`
- `src/components/CategoryPage.css`
- `src/components/ProductListingCard.css`
- `src/components/Footer.tsx`
- `src/pages/CheckoutPage.tsx`
- `_SQUADRA_DIARIO.md`

### Perche
- Correggere incongruenze UX/UI sistemiche (griglia, allineamenti, coerenza componenti, orientamento utente nei flussi) e non solo difetti puntuali della home.

### Verifica
- Test regressione mirati (primo tentativo fallito per permessi temp Windows; rilancio con `TMPDIR`):
  - `TMPDIR=/tmp npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts src/components/accessibility-regression.test.ts` -> **OK (26/26 test)**
- Build produzione:
  - `npm run build` -> **OK**
- Verifica visiva reale su servizio locale gia attivo (nessun avvio/arresto eseguito):
  - desktop: `_tmp/home-audit-desktop-1920x1080.png`
  - mobile: `_tmp/home-audit-mobile-390x844.png`

### Note
- Vincolo rispettato: nessun comando di start/stop del servizio locale.

## 2026-02-20 12:44:05 - CAPO > Micro-fix UX cross-page CTA home

### Cosa e stato fatto
- Corretto il percorso della card "Spedizioni e consegne rapide" in home: non punta piu al checkout (che poteva risultare vuoto), ma a una categoria reale navigabile.

### File toccati
- `src/components/home_v2/HomeV2PlusSection.tsx`
- `_SQUADRA_DIARIO.md`

### Perche
- Evitare dead-end UX e mantenere coerenza del funnel (prima esplorazione catalogo, poi checkout).

### Verifica
- `TMPDIR=/tmp npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts src/components/accessibility-regression.test.ts` -> **OK (26/26 test)**
- `npm run build` -> **OK**

## 2026-02-20 13:31:07 - CAPO > Passo successivo UX/UI globale (header/nav home + account/admin)

### Cosa e stato fatto
- Rifinita la parte alta Home con focus su problemi segnalati:
  - logo semplificato in `BIANCHI`,
  - spazi e centratura verticale menu principale migliorati,
  - coerenza radius/bordi pulsanti top,
  - allineamento tecnico mega-menu rispetto al trigger `Linea Caldo` tramite geometria runtime.
- Corretto comportamento sezione `Esplora tutte le sottocategorie`:
  - espansione indipendente per card,
  - ridotta percezione di card "vuote" (azioni non piu ancorate con `margin-top:auto`),
  - uniformita visiva card in stato espanso.
- Estese correzioni UX a pagine account/admin:
  - `AccountSidebar` reintegrata nel layout reale,
  - profilo azienda convertito in form semantico con submit nativo,
  - toggle SDI/PEC convertito in radio-group accessibile,
  - tabelle ordini/fatture con `caption` e `scope` nelle intestazioni,
  - overview admin con blocco priorita operative,
  - CTA `Applica sconto massivo` resa piu evidente e coerente.

### File toccati
- `src/components/home_v2/HomeV2Header.tsx`
- `src/components/home_v2/HomeV2.css`
- `src/components/home_v2/HomeV2CategoryCards.tsx`
- `src/components/auth/AccountPage.tsx`
- `src/components/admin/AdminDashboard.tsx`
- `_SQUADRA_DIARIO.md`

### Perche
- Chiudere i difetti visuali e strutturali piu impattanti indicati dall'utente (header/nav/mega-menu/card home) e migliorare coerenza UX/UI nelle aree account e admin senza regressioni funzionali.

### Verifica
- Test regressione mirati:
  - `TMPDIR=/tmp npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts src/components/accessibility-regression.test.ts` -> **OK (26/26 test)**
- Build produzione:
  - `npm run build` -> **OK**
- Verifica visiva reale su servizio locale gia attivo (nessun avvio/arresto eseguito):
  - desktop: `_tmp/home-after-pass-desktop-1920x1080.png`
  - mobile: `_tmp/home-after-pass-mobile-390x844.png`

### Note
- Vincolo rispettato: nessun comando di start/stop del servizio locale.

## 2026-02-20 13:48:22 - CAPO > Fix richieste puntuali utente (account diretto, mega-menu allineato, larghezza sito, griglia 4 colonne)

### Cosa e stato fatto
- Eliminata la tendina account da header home e header layout:
  - click su `Account/Accedi` ora porta direttamente a `/account` se loggato,
  - se non loggato apre la modale auth,
  - rimosso overlay menu che finiva sotto la navbar.
- Inserito pulsante `Esci account` dentro la pagina `account/profilo` (oltre ai controlli gia presenti in area account).
- Riallineato mega-menu desktop sulla fascia categorie dalla prima voce (`Linea Caldo`) all'ultima (`Ricambi`) usando misure runtime di entrambi i trigger.
- Rimossa la scritta sopra la barra di ricerca in home (label visiva non mostrata).
- Sito reso leggermente piu largo su tutta la UI:
  - `--container-max` aumentato,
  - ridotti i padding laterali desktop/tablet.
- Pagina categoria/lista prodotti:
  - griglia desktop impostata a 4 colonne,
  - breakpoint aggiornati a 3/2/1 colonne,
  - card listing resa `width: 100%` con `max-width` per adattarsi alla griglia.
- Rimozione bordi dai bottoni principali (specialmente verdi) su home/categoria/listing e override globali coerenti.

### File toccati
- `src/components/home_v2/HomeV2Header.tsx`
- `src/components/home_v2/HomeV2.css`
- `src/components/Header.tsx`
- `src/components/auth/AccountPage.tsx`
- `src/components/CategoryPage.css`
- `src/components/ProductListingCard.css`
- `src/styles/design-tokens.css`
- `src/styles/globals.css`
- `_SQUADRA_DIARIO.md`

### Perche
- Chiudere i difetti UX/UI segnalati dall'utente su header/account/mega-menu e uniformare la densita visiva (larghezza contenuto + griglia prodotti + bottoni senza bordi).

### Verifica
- Test regressione mirati:
  - `TMPDIR=/tmp npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts src/components/accessibility-regression.test.ts` -> **OK (26/26 test)**
- Build produzione:
  - `npm run build` -> **OK**
- Verifica visiva reale su servizio locale gia attivo (nessun avvio/arresto eseguito):
  - home desktop: `_tmp/home-fix2-desktop-1920x1080.png`
  - home mobile: `_tmp/home-fix2-mobile-390x844.png`
  - categoria erogatori desktop: `_tmp/category-erogatori-fix2-1920x1400.png` (griglia 4 colonne)

### Note
- Vincolo rispettato: nessun comando di start/stop servizio locale.
- Differenze percepite tra locale e URL condiviso possono dipendere da stato sessione/cache browser differente sull'host tunnel; codice e routing sono stati unificati lato sorgente.

## 2026-02-20 14:40:09 - CAPO > Fix round 2 richieste utente (mega-menu, cart dock, caroselli, footer PLUS)

### Cosa e stato fatto
- Mega-menu desktop riallineato per coprire la fascia nav dalla prima voce (`Home`) all'ultima (`Contatti`) con geometria runtime su boundary reali.
- Navbar desktop stabilizzata (nessuna sovrapposizione etichette) con layout a griglia e spaziatura coerente.
- Voci `Linea Caldo`/macro-categorie rese piu leggibili e mega-menu allargato (colonne e spazi interni piu larghi).
- Barra carrello in basso resa condizionale: compare solo con prodotti presenti; rimossa la versione vuota che copriva il fondo pagina.
- Aggiunta riserva layout dinamica (`--cart-dock-offset`) per evitare copertura contenuti quando il dock carrello e visibile.
- Icona aiuto in basso-destra rialzata e resa compatibile con il dock carrello tramite offset CSS condiviso.
- Carosello blog in home reso realmente operativo:
  - piu card disponibili,
  - abilitazione/disabilitazione frecce su stato reale embla (`canScrollPrev/Next`),
  - autoplay con restart.
- Carosello sottocategorie nelle pagine categoria/sottocategoria:
  - spacing uniforme modulato per quantita elementi (`wide/balanced/dense`),
  - distanza frecce/track corretta.
- Sezione PLUS rimossa dal footer; mantenuti i PLUS in home (gia presenti sopra `Categorie in evidenza`).
- Container globale allargato ulteriormente (`--container-max: 1500px`) per ridurre compressione generale e mantenere 4 card dove previsto.

### File toccati
- `src/components/home_v2/HomeV2Header.tsx`
- `src/components/home_v2/HomeV2.css`
- `src/components/home_v2/HomeV2BlogPreviews.tsx`
- `src/components/CartDrawer.tsx`
- `src/components/SupportHelpWidget.css`
- `src/components/CategoryPage.tsx`
- `src/components/CategoryPage.css`
- `src/components/Footer.tsx`
- `src/components/Footer.css`
- `src/styles/globals.css`
- `src/styles/design-tokens.css`
- `src/components/ux-ui-regression.test.ts`
- `_SQUADRA_DIARIO.md`

### Perche
- Chiudere i problemi UX/UI ancora aperti segnalati dall'utente su allineamenti menu, overlay persistenti in basso, coerenza spaziature caroselli e struttura home/footer.

### Verifica
- Test regressione mirati:
  - `TMPDIR=/tmp npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts src/components/accessibility-regression.test.ts` -> **OK (26/26 test)**
- Build produzione:
  - `npm run build` -> **OK**
- Verifica visiva reale su servizio locale gia attivo (nessun avvio/arresto eseguito):
  - home desktop: `_tmp/home-pass6-desktop-1920x1080.png`
  - home mobile: `_tmp/home-pass6-mobile-390x844.png`
  - categoria (sottocategorie top carousel): `_tmp/category-subcat-pass6-1920x1080.png`
  - step intermedi di controllo: `_tmp/home-pass4-desktop-1920x1080.png`, `_tmp/home-pass5-desktop-1920x1080.png`

### Note
- Vincolo rispettato: nessun comando di start/stop del servizio locale.
- Tentata verifica dinamica Playwright per hover mega-menu/click carousel: bloccata dal sandbox Linux; controllo visuale confermato via screenshot Edge headless Windows.

## 2026-02-20 15:11:46 - CAPO > Correzione finale richiesta utente (sezione Esplora + tendina centrata)

### Cosa e stato fatto
- Sezione `Esplora tutte le sottocategorie` allargata a piena larghezza container (come le altre sezioni):
  - griglia da colonne fisse a colonne fluide `repeat(3, minmax(0, 1fr))`,
  - rimozione limite `max-width` sulle card per evitare effetto "strette".
- Tendina mega-menu ricentrata:
  - boundary ancorati alla fascia categorie (`Linea Caldo` -> `Ricambi`),
  - calcolo geometria centrato sulla navbar (non piu sbilanciato a sinistra).

### File toccati
- `src/components/home_v2/HomeV2Header.tsx`
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Perche
- Allineare visivamente la sezione card con la larghezza del resto della home e risolvere lo sbilanciamento orizzontale della tendina.

### Verifica
- Test regressione:
  - `TMPDIR=/tmp npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts src/components/accessibility-regression.test.ts` -> **OK (26/26 test)**
- Build:
  - `npm run build` -> **OK**
- Screenshot aggiornati:
  - `_tmp/home-pass7-desktop-1920x1400.png`
  - `_tmp/home-pass7-mobile-390x844.png`
  - `_tmp/home-pass7-cards-1920x2200.png`

## 2026-02-20 17:12:00 - CAPO > Tendina nav ancorata esattamente da Linea Caldo a Ricambi + stabilita navbar desktop

### Cosa e stato fatto
- Rafforzato il calcolo geometrico del mega-menu desktop:
  - ancoraggio su marker espliciti `data-mega-boundary="start"` (Linea Caldo) e `data-mega-boundary="end"` (Ricambi),
  - fallback automatico alla fascia categorie se i marker non sono disponibili,
  - clamp della posizione orizzontale per evitare offset anomali a sinistra/destra.
- Aggiornata la navbar desktop per ridurre sovrapposizioni in viewport intermedi:
  - categoria links distribuiti con `justify-content: space-between`,
  - spaziature e padding compattati,
  - media query dedicata `1025px-1500px` con tipografia e gap ridotti.

### File toccati
- `src/components/home_v2/HomeV2Header.tsx`
- `src/components/home_v2/HomeV2.css`
- `_SQUADRA_DIARIO.md`

### Perche
- Correggere in modo deterministico la richiesta utente: tendina allineata dalla voce `Linea Caldo` alla voce `Ricambi`, evitando disallineamenti e sovrapposizioni della riga nav.

### Verifica
- Test regressione:
  - `TMPDIR=/tmp npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts src/components/accessibility-regression.test.ts` -> **OK (26/26 test)**
- Build:
  - `npm run build` -> **OK**
- Verifica endpoint locale dal contesto WSL corrente:
  - `curl -I --max-time 5 http://127.0.0.1:3000` -> **KO (porta non raggiungibile da questa sessione WSL)**.

## 2026-02-20 17:34:35 - CAPO > Mega-menu allungato e spostato verso destra (richiesta utente diretta)

### Cosa e stato fatto
- Aggiornata la geometria della tendina desktop in `HomeV2Header`:
  - larghezza aumentata con `minimumDesktopWidthPx` (finestra mega-menu piu lunga),
  - estensione laterale con `sideBleedPx`,
  - offset esplicito verso destra con `rightShiftPx`.

### File toccati
- `src/components/home_v2/HomeV2Header.tsx`
- `_SQUADRA_DIARIO.md`

### Perche
- Rispondere alla richiesta utente: tendina "piu lunga" e spostata "verso destra".

### Verifica
- Test regressione:
  - `TMPDIR=/tmp npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts src/components/accessibility-regression.test.ts` -> **OK (26/26 test)**
- Build:
  - `npm run build` -> **OK**

## 2026-02-20 17:41:53 - CAPO > Mega-menu ancora piu lungo + spostamento forte a destra con centratura pagina

### Cosa e stato fatto
- Ritoccata nuovamente la formula della tendina desktop:
  - larghezza aumentata in modo deciso (`sideBleedPx` alto + `minimumDesktopWidthPx` elevato),
  - spostamento marcato verso destra (`rightShiftPx` incrementato),
  - centratura migliorata con blend tra centro pagina e centro fascia categorie.

### File toccati
- `src/components/home_v2/HomeV2Header.tsx`
- `_SQUADRA_DIARIO.md`

### Perche
- Richiesta utente esplicita: allungare molto la tendina verso destra e, se possibile, centrarla meglio nella pagina.

### Verifica
- Test regressione:
  - `TMPDIR=/tmp npm run test -- src/components/home-routing-wiring.test.ts src/components/ux-ui-regression.test.ts src/components/accessibility-regression.test.ts` -> **OK (26/26 test)**
- Build:
  - `npm run build` -> **OK**
