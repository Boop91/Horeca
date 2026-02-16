# 04 - Psicologia Cognitiva Applicata alla UX

## Obiettivo
Documentare i principi di psicologia cognitiva che guidano le decisioni di design di bianchipro.it, garantendo che ogni scelta sia fondata su evidenze scientifiche.

## Principi fondamentali

### F-Pattern di lettura (Nielsen, 2006)
- Gli utenti scansionano le pagine web seguendo un pattern a F
- La prima riga orizzontale riceve la massima attenzione
- Il lato sinistro della pagina e scansionato verticalmente
- **Applicazione**: posizionare CTA, prezzi e informazioni critiche lungo il pattern F

### Legge di Hick (Hick, 1952)
- Il tempo decisionale aumenta logaritmicamente con il numero di opzioni
- Formula: RT = a + b * log2(n), dove n = numero di alternative
- **Applicazione**: limitare le opzioni di navigazione primaria a 5-7 voci; raggruppare i filtri per ridurre il sovraccarico decisionale

### Legge di Fitts (Fitts, 1954)
- Il tempo per raggiungere un target dipende da distanza e dimensione del target
- Formula: MT = a + b * log2(D/W + 1)
- **Applicazione**: CTA di dimensione minima 44x44px (WCAG), posizionamento strategico dei bottoni primari nella zona del pollice su mobile

### Carico cognitivo (Sweller, 1988)
- La memoria di lavoro gestisce 4 +/- 1 elementi contemporaneamente (Cowan, 2001)
- Tre tipi: intrinseco (complessita del compito), estrinseco (design inefficace), pertinente (costruzione di schemi)
- **Applicazione**: ridurre il carico estrinseco eliminando elementi non essenziali; progressive disclosure per informazioni secondarie

### Effetto di ancoraggio (Tversky & Kahneman, 1974)
- La prima informazione numerica vista influenza le valutazioni successive
- **Applicazione**: mostrare il prezzo pieno prima dello sconto; posizionare i prodotti premium come primo risultato

## Statistiche di supporto
- L'80% del tempo utente e speso above the fold (Nielsen Norman Group, 2018)
- Le impressioni si formano in meno di 50ms (Lindgaard et al., 2006)
- Font leggibili aumentano la fiducia del 40% (MIT AgeLab, 2019)
- Colori consistenti aumentano il riconoscimento del brand del 60-80% (University of Loyola)

## Principi aggiuntivi applicati

### Effetto Von Restorff (isolamento)
- Un elemento visivamente distinto viene ricordato meglio
- **Applicazione**: badge "Pronta Consegna" in colore contrastante, CTA primaria con colore unico

### Principio di prossimita (Gestalt)
- Elementi vicini sono percepiti come appartenenti allo stesso gruppo
- **Applicazione**: raggruppare prezzo + disponibilita + CTA nella buy section

### Paradosso della scelta (Schwartz, 2004)
- Troppe opzioni causano paralisi decisionale e insoddisfazione
- **Applicazione**: filtri guidati, confronto massimo 3 prodotti, suggerimenti curati

## Applicazione a bianchipro.it
- Layout F-pattern su homepage e pagine categoria
- Mega menu con massimo 7 categorie primarie (Hick)
- Touch target minimo 44x44px su tutti i dispositivi (Fitts)
- Buy section compatta con max 4 informazioni above the fold (carico cognitivo)
- Progressive disclosure per specifiche tecniche dettagliate

## Decisioni prese
1. La gerarchia visiva segue il pattern F su tutte le pagine
2. Le opzioni di navigazione primaria non superano 7 voci
3. Ogni componente interattivo rispetta i 44px minimi
4. La buy section mostra max 4 elementi informativi: prezzo, disponibilita, quantita, CTA
5. Le informazioni secondarie sono accessibili tramite tab o accordion
