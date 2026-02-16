# 01 - Analisi Utente Target

## Obiettivo
Definire i profili utente primari di bianchipro.it per orientare ogni decisione di design verso i bisogni reali degli acquirenti professionali HoReCa.

## Principi scientifici
- **User-Centered Design** (ISO 9241-210): il design deve basarsi su comprensione esplicita di utenti, compiti e ambienti
- **Jobs-to-be-Done** (Christensen, 2016): l'utente non compra un prodotto, assume una soluzione per un lavoro da svolgere
- **Mental Models** (Nielsen, 2010): l'interfaccia deve allinearsi ai modelli mentali esistenti dell'utente

## Segmenti utente identificati

### Persona 1: Marco - Ristoratore / Titolare
- **Eta**: 35-55 anni
- **Contesto**: gestisce 1-3 locali, decide acquisti sopra i 500 EUR
- **Bisogno primario**: attrezzature affidabili con consegna rapida
- **Comportamento digitale**: cerca su Google, confronta 2-3 siti, vuole parlare con un consulente per acquisti importanti
- **Frustrazioni**: schede prodotto incomplete, prezzi nascosti, tempi di consegna vaghi
- **P.IVA**: obbligatoria per fatturazione elettronica (SDI)

### Persona 2: Lucia - Chef / Responsabile Cucina
- **Eta**: 28-45 anni
- **Contesto**: influenza le decisioni di acquisto, cerca specifiche tecniche
- **Bisogno primario**: confronto tecnico dettagliato tra modelli
- **Comportamento digitale**: mobile-first, consulta schede tecniche, legge recensioni professionali
- **Frustrazioni**: impossibilita di confrontare prodotti, foto insufficienti

### Persona 3: Giuseppe - Hotel Manager / Facility
- **Eta**: 40-60 anni
- **Contesto**: acquisti ricorrenti per struttura ricettiva, budget definiti
- **Bisogno primario**: gestione ordini ricorrenti, preventivi rapidi
- **Comportamento digitale**: preferisce percorsi per tipologia di attivita
- **Frustrazioni**: processi di acquisto lenti, mancanza di storico ordini

## Statistiche di riferimento
- Il 78% del traffico e-commerce e da mobile (Statista, 2024)
- Il 65% dei siti B2B prioritizza il mobile-first (Forrester, 2023)
- L'86% degli acquirenti B2B vuole social proof prima dell'acquisto (G2, 2023)
- Il tasso di conversione medio per acquisti di alto valore e 0.5-1.5% (Baymard Institute)

## Bisogni trasversali
1. **Fatturazione elettronica**: tutti necessitano di SDI/PEC per compliance italiana
2. **Doppio percorso**: carrello diretto per acquisti sotto 1.000 EUR, richiesta preventivo per importi maggiori
3. **Disponibilita immediata**: filtro "pronta consegna" come elemento decisionale chiave
4. **Assistenza multicanale**: telefono, WhatsApp, email con risposta entro 4 ore lavorative

## Applicazione a bianchipro.it
- Toggle Privato/Azienda nel checkout con validazione P.IVA (formato IT + 11 cifre)
- Auto-compilazione dati aziendali da lookup Partita IVA
- Percorsi di navigazione per mestiere (Pizzeria, Macelleria, Hotel, Bar, Pasticceria)
- CTA duale: "Aggiungi al Carrello" + "Richiedi Preventivo" su prodotti sopra soglia

## Decisioni prese
1. Il design privilegia il professionista B2B con P.IVA come utente primario
2. Il flusso mobile e prioritario rispetto al desktop
3. Ogni pagina prodotto deve supportare sia acquisto diretto che richiesta preventivo
4. La navigazione per mestiere e un canale primario, non secondario
