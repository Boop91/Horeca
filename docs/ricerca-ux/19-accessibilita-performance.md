# 19 - Accessibilita e Performance

## Obiettivo
Definire i requisiti di accessibilita (WCAG 2.1 AA) e performance (Core Web Vitals) per bianchipro.it, garantendo che il sito sia utilizzabile da tutti e performante su qualsiasi dispositivo.

## Principi scientifici
- **Universal Design** (Mace, 1997): progettare per il maggior numero possibile di persone senza adattamenti
- **WCAG 2.1** (W3C, 2018): linee guida per l'accessibilita dei contenuti web
- **Core Web Vitals** (Google, 2020): metriche di performance che influenzano ranking e user experience
- **Performance Perception** (Miller, 1968): 100ms percepito come istantaneo, 1s mantiene il flusso, 10s perde l'attenzione

## Accessibilita - WCAG 2.1 AA

### Percezione
| Requisito | Criterio | Implementazione |
|-----------|----------|-----------------|
| Contrasto testo | 4.5:1 normale, 3:1 grande | Verificato su tutta la palette colori |
| Alternative testuali | Alt text su tutte le immagini | Alt descrittivi per prodotti, decorativo per icone |
| Contenuto adattabile | Struttura semantica HTML | heading h1-h6 gerarchici, landmark regions |
| Orientamento | Supporto portrait e landscape | Layout responsive senza lock orientamento |

### Operabilita
| Requisito | Criterio | Implementazione |
|-----------|----------|-----------------|
| Navigazione da tastiera | Tab order logico | Focus visible su tutti gli elementi interattivi |
| Touch target | Min 44x44px | Verificato su bottoni, link, checkbox |
| Tempo sufficiente | No timeout senza avviso | Sessione carrello > 30 minuti |
| Skip link | "Vai al contenuto" | Primo elemento focusable della pagina |

### Comprensione
| Requisito | Criterio | Implementazione |
|-----------|----------|-----------------|
| Lingua pagina | lang="it" | Attributo su html element |
| Errori form | Identificazione chiara | Messaggio errore + bordo rosso + icona |
| Label | Associati a input | htmlFor su tutti i label |
| Istruzioni | Chiare e visibili | Helper text sotto i campi complessi |

### Robustezza
| Requisito | Criterio | Implementazione |
|-----------|----------|-----------------|
| HTML valido | Parsing corretto | Validazione W3C |
| ARIA | Ruoli e stati corretti | aria-label, aria-expanded, aria-live |
| Compatibilita | Screen reader | Test con NVDA/VoiceOver |

## Performance - Core Web Vitals

### Target metriche
| Metrica | Cosa misura | Target | Soglia scarsa |
|---------|-------------|--------|---------------|
| LCP | Caricamento contenuto principale | < 2.5s | > 4.0s |
| INP | Reattivita alle interazioni | < 200ms | > 500ms |
| CLS | Stabilita visiva layout | < 0.1 | > 0.25 |

### Strategie di ottimizzazione

#### LCP (Largest Contentful Paint)
- Preload font Inter (subset latino)
- Immagini hero in formato WebP/AVIF con srcset
- Server-side rendering (SSR) o prerendering per pagine critiche
- CDN per asset statici (Netlify Edge)
- Critical CSS inline per above-the-fold

#### INP (Interaction to Next Paint)
- Code splitting per route (lazy loading componenti)
- Web Workers per operazioni pesanti
- Debounce su ricerca e filtri (300ms)
- React.memo e useMemo per evitare re-render inutili

#### CLS (Cumulative Layout Shift)
- Dimensioni esplicite su immagini (width/height)
- Font-display: swap con dimensione fallback calcolata
- Skeleton loading per contenuti dinamici
- Spazio riservato per banner e pubblicita

### Performance budget
| Risorsa | Budget |
|---------|--------|
| HTML | < 100KB |
| CSS | < 50KB (gzipped) |
| JS iniziale | < 150KB (gzipped) |
| Immagini per pagina | < 500KB |
| Font | < 50KB (subset) |
| Total page weight | < 1MB |

## Strumenti di verifica
- **Lighthouse**: audit automatico accessibilita + performance
- **axe DevTools**: test accessibilita dettagliati
- **WebPageTest**: performance su connessioni reali
- **WAVE**: validazione accessibilita visuale

## Applicazione a bianchipro.it
- WCAG 2.1 AA come requisito minimo su tutte le pagine
- Core Web Vitals "Good" come obiettivo su tutte le pagine
- Test accessibilita integrato nella CI/CD
- Performance monitoring continuo

## Decisioni prese
1. WCAG 2.1 AA come standard minimo di accessibilita
2. LCP < 2.5s, INP < 200ms, CLS < 0.1 come target
3. Immagini WebP/AVIF con srcset e lazy loading
4. Code splitting per route con React.lazy
5. Performance budget: < 1MB total page weight
6. Test accessibilita automatizzato in CI/CD (axe-core)
