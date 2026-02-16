# 07 - Pagina Prodotto

## Obiettivo
Progettare una pagina prodotto che massimizzi la conversione per acquisti B2B di alto valore, bilanciando informazioni tecniche dettagliate con un percorso di acquisto semplice.

## Principi scientifici
- **Baymard Product Page UX**: solo il 49% dei top siti ha una UX prodotto decente
- **Buy Section Bloat**: il 56% dei siti ha sezioni di acquisto sovraccariche (Baymard)
- **Image Gallery Issues**: il 40% dei siti ha problemi nella galleria immagini (Baymard)
- **Above the Fold**: l'80% del tempo utente e above the fold (NNGroup, 2018)

## Struttura pagina prodotto

### Above the Fold - Area critica

#### Galleria immagini (sinistra su desktop)
- Immagine principale con zoom al hover/pinch
- Thumbnails laterali (desktop) / swipe (mobile)
- Minimo 4 immagini: frontale, laterale, dettaglio, ambientazione
- Video prodotto quando disponibile
- Formato: WebP con fallback JPEG, min 1200x1200px

#### Buy Section (destra su desktop)
Massimo 4 elementi informativi per ridurre il carico cognitivo (Cowan, 2001):
1. **Nome prodotto** + codice articolo + brand
2. **Prezzo** con IVA esclusa (B2B standard) + IVA inclusa in piccolo
3. **Disponibilita**: badge "Pronta Consegna" verde o "Su Ordinazione" con tempi
4. **CTA duale**:
   - Primaria: "Aggiungi al Carrello" (full-width, colore brand)
   - Secondaria: "Richiedi Preventivo" (outline, per acquisti > soglia)

#### Elementi secondari buy section
- Selettore quantita con input numerico
- Calcolo spedizione stimato (CAP-based)
- Wishlist / Confronta
- Condividi (link, email, WhatsApp)

### Below the Fold - Tabs informativi

#### Tab 1: Descrizione
- Testo strutturato con heading e bullet points
- Punti di forza evidenziati con icone

#### Tab 2: Specifiche Tecniche
- Tabella strutturata: dimensioni, peso, potenza, alimentazione, gas/elettrico
- PDF scheda tecnica scaricabile

#### Tab 3: Spedizione e Garanzia
- Tempi di consegna per zona
- Costi spedizione per peso/dimensione
- Condizioni di garanzia (24 mesi standard B2B)

#### Tab 4: Recensioni
- Rating medio con distribuzione stelle
- Recensioni verificate con badge "Acquisto Verificato"
- Filtro per rating

### Sezioni aggiuntive
- **Prodotti correlati**: "Completa il tuo acquisto" (cross-sell)
- **Visti di recente**: persistenza locale per sessione
- **Prodotti della stessa categoria**: navigazione laterale

## Statistiche di supporto
- Conversione alto valore: 0.5-1.5% (Baymard)
- L'86% vuole social proof (G2, 2023)
- Il dual-path (carrello + preventivo) aumenta CR del 15-25% (Forrester)

## Applicazione a bianchipro.it
- Buy section compatta con max 4 info primarie
- Galleria con min 4 foto + zoom
- CTA duale su tutti i prodotti
- Prezzo IVA esclusa come default (B2B)
- Tab con specifiche tecniche strutturate

## Decisioni prese
1. Buy section: max 4 elementi informativi above the fold
2. Galleria: minimo 4 immagini con zoom nativo
3. CTA duale obbligatoria: carrello + preventivo
4. Prezzo primario: IVA esclusa (standard B2B italiano)
5. Specifiche tecniche in tabella strutturata, non testo libero
6. Recensioni con badge "Acquisto Verificato"
