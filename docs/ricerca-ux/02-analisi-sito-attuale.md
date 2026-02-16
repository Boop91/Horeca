# 02 - Analisi del Sito Attuale

## Obiettivo
Documentare lo stato attuale di bianchipro.it per identificare criticita, punti di forza e priorita di intervento nel redesign.

## Principi scientifici
- **Heuristic Evaluation** (Nielsen, 1994): valutazione sistematica contro 10 euristiche di usabilita
- **Cognitive Walkthrough** (Wharton et al., 1994): simulazione dei percorsi utente per identificare ostacoli
- **Performance Budget** (Grigorik, 2013): ogni secondo di caricamento riduce le conversioni del 7%

## Stato attuale della piattaforma

### Stack tecnologico
- **CMS**: PrestaShop con tema basato su Bootstrap 3
- **Frontend**: HTML server-rendered, jQuery, CSS non ottimizzato
- **Limiti**: navigazione state-based, catalogo limitato, assenza di PWA

### Criticita identificate

#### Navigazione (Severita: Alta)
- Menu a discesa tradizionale senza mega menu
- Assenza di navigazione per tipologia di attivita
- Ricerca senza autocomplete ne suggerimenti
- 3+ click per raggiungere un prodotto specifico

#### Pagina prodotto (Severita: Alta)
- Immagini di bassa qualita, assenza di zoom
- Informazioni tecniche frammentate
- Nessun sistema di recensioni integrato
- CTA singola (solo carrello, nessun preventivo)

#### Checkout (Severita: Critica)
- Processo multi-pagina con 20+ campi
- Nessuna distinzione Privato/Azienda
- Mancanza di integrazione SDI/PEC nativa
- Assenza di calcolo spedizione in tempo reale

#### Mobile (Severita: Alta)
- Layout non fully responsive
- Touch target sotto i 44px minimi (WCAG)
- Menu hamburger senza gerarchia chiara
- Immagini non ottimizzate per connessioni lente

#### Performance
- LCP stimato > 4s (obiettivo Google: < 2.5s)
- CLS non ottimizzato (layout shifts durante caricamento)
- Bundle JS non tree-shaken

## Statistiche benchmark
- Il 49% dei top siti ha una UX pagina prodotto decente (Baymard Institute)
- Il 56% dei siti ha sezioni di acquisto sovraccariche (Baymard Institute)
- Il 40% ha problemi nella galleria immagini (Baymard Institute)
- Il 70% degli utenti abbandona il carrello (Baymard Institute, media settore)

## Punti di forza da preservare
1. Catalogo prodotti esistente con dati strutturati
2. Base clienti fidelizzata con storico ordini
3. Competenza di dominio nel settore HoReCa
4. Posizionamento SEO su keyword di nicchia

## Applicazione al redesign
- Migrazione a React/Vite con SSR per performance
- Implementazione mega menu con 88% di adozione tra i top siti (Baymard)
- Riduzione campi checkout da 20+ a 12-14 (best practice Baymard)
- Ottimizzazione immagini con lazy loading e formati WebP/AVIF

## Decisioni prese
1. Redesign completo del frontend, mantenendo i dati del catalogo
2. Priorita assoluta a mobile-first e performance (Core Web Vitals)
3. Checkout ridisegnato con flusso B2B nativo (SDI/PEC integrati)
4. Sistema di design nuovo basato su Tailwind CSS e componenti riutilizzabili
