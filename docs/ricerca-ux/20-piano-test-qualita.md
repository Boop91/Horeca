# 20 - Piano Test e Qualita

## Obiettivo
Definire un piano di testing completo per bianchipro.it che copra funzionalita, usabilita, performance, accessibilita e sicurezza, garantendo la qualita del redesign prima del lancio.

## Principi scientifici
- **Test-Driven Quality** (Beck, 2002): i test definiti prima dello sviluppo guidano la qualita del codice
- **Usability Testing** (Krug, 2006): 5 utenti trovano l'85% dei problemi di usabilita (Nielsen, 2000)
- **Regression Prevention**: ogni bug corretto deve avere un test che previene la regressione

## Livelli di testing

### 1. Test unitari (automatici)
**Strumenti**: Vitest + React Testing Library
**Copertura target**: > 80% su logica di business

| Area | Cosa testare | Priorita |
|------|-------------|----------|
| Validazione P.IVA | Formato IT+11 cifre, checksum | Critica |
| Calcolo prezzi | IVA, sconti, spedizione | Critica |
| Calcolo spedizione | Per peso, zona, soglia gratuita | Alta |
| Filtri prodotto | Combinazioni filtri, conteggi | Alta |
| Form validation | Tutti i campi checkout | Alta |
| Cart logic | Aggiungi, rimuovi, aggiorna quantita | Critica |

### 2. Test di integrazione (automatici)
**Strumenti**: Vitest + MSW (Mock Service Worker)

| Area | Cosa testare | Priorita |
|------|-------------|----------|
| Auth flow | Login, registrazione, logout, refresh token | Critica |
| Checkout flow | Carrello > fatturazione > pagamento > conferma | Critica |
| Ricerca | Query > risultati > navigazione prodotto | Alta |
| Filtri categoria | Selezione filtri > aggiornamento lista | Alta |
| Account B2B | CRUD dati aziendali, storico ordini | Alta |

### 3. Test end-to-end (automatici)
**Strumenti**: Playwright

| Scenario | Steps | Priorita |
|----------|-------|----------|
| Acquisto completo B2B | Homepage > categoria > prodotto > carrello > checkout > conferma | Critica |
| Richiesta preventivo | Prodotto > richiedi preventivo > compilazione > invio | Alta |
| Registrazione B2B | Form registrazione > validazione P.IVA > conferma email | Alta |
| Ricerca prodotto | Barra ricerca > autocomplete > click risultato | Alta |
| Navigazione mestiere | Homepage > Per il tuo Mestiere > Pizzeria > prodotto | Media |
| Mobile checkout | Tutto il flusso da viewport mobile | Alta |

### 4. Test di usabilita (manuali)
**Metodo**: task-based testing con 5 utenti per round (Nielsen)

| Task | Metriche | Target |
|------|----------|--------|
| Trovare un forno per pizzeria | Tempo, click, successo | < 60s, < 4 click, 100% |
| Completare un acquisto B2B | Tempo, errori, completamento | < 5min, 0 errori bloccanti, > 90% |
| Richiedere un preventivo | Tempo, comprensione CTA | < 3min, 100% trovano CTA |
| Filtrare per "Pronta Consegna" | Tempo, visibilita filtro | < 10s, 100% trovano filtro |
| Modificare dati aziendali | Tempo, errori | < 2min, 0 errori |

### 5. Test di accessibilita
**Strumenti**: axe-core (automatico) + test manuale con screen reader

| Verifica | Strumento | Target |
|----------|-----------|--------|
| Contrasto colori | axe-core | 0 violazioni AA |
| Navigazione tastiera | Manuale | Tutti gli elementi raggiungibili |
| Screen reader | NVDA + VoiceOver | Contenuto comprensibile |
| Touch target | Manuale | Tutti >= 44x44px |
| Alt text | axe-core | Tutte le immagini |

### 6. Test di performance
**Strumenti**: Lighthouse + WebPageTest

| Pagina | LCP | INP | CLS | Lighthouse Score |
|--------|-----|-----|-----|-----------------|
| Homepage | < 2.5s | < 200ms | < 0.1 | > 90 |
| Categoria | < 2.5s | < 200ms | < 0.1 | > 90 |
| Prodotto | < 2.5s | < 200ms | < 0.1 | > 90 |
| Checkout | < 2.0s | < 100ms | < 0.05 | > 95 |

### 7. Test di sicurezza
| Verifica | Metodo | Frequenza |
|----------|--------|-----------|
| OWASP Top 10 | Scan automatico + review manuale | Pre-lancio + trimestrale |
| Input sanitization | Test injection (SQL, XSS) | Pre-lancio |
| Autenticazione | Brute force, session hijacking | Pre-lancio |
| API security | Rate limiting, CORS, auth | Pre-lancio |
| Stripe integration | Test mode con scenari errore | Pre-lancio |

## Checklist pre-lancio
- [ ] Tutti i test unitari passano (> 80% copertura)
- [ ] Tutti i test E2E passano su Chrome, Firefox, Safari
- [ ] Test E2E mobile passano su iOS Safari e Chrome Android
- [ ] 0 violazioni accessibilita axe-core
- [ ] Lighthouse > 90 su tutte le pagine principali
- [ ] Core Web Vitals "Good" su PageSpeed Insights
- [ ] Test usabilita completato con 5 utenti
- [ ] Test sicurezza OWASP completato
- [ ] Checkout Stripe testato con carte test
- [ ] Fatturazione SDI/PEC verificata
- [ ] Backup e rollback plan documentato

## CI/CD Integration
- Test unitari: a ogni push
- Test E2E: a ogni PR verso main
- Lighthouse: a ogni deploy su staging
- axe-core: a ogni PR (GitHub Action)

## Applicazione a bianchipro.it
- Vitest per unit/integration, Playwright per E2E
- axe-core integrato nella CI per accessibilita
- Lighthouse CI per monitoraggio performance
- Test usabilita con professionisti HoReCa reali

## Decisioni prese
1. Copertura test unitari > 80% su logica di business
2. 6 scenari E2E critici da automatizzare
3. Test usabilita con 5 utenti reali (professionisti HoReCa)
4. Lighthouse > 90 come gate per il deploy
5. axe-core a 0 violazioni come requisito per merge
6. Test di sicurezza OWASP pre-lancio obbligatorio
