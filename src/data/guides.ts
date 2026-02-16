/**
 * guides.ts — Dati delle guide professionali BianchiPro
 *
 * Contiene le guide complete per aiutare i professionisti Ho.Re.Ca.
 * nella scelta delle attrezzature. Ogni guida include:
 * - Titolo e slug per l'URL
 * - Categoria (acquisto, operativa, manutenzione)
 * - Contenuto completo in formato testo
 * - Data di pubblicazione
 * - Immagine di copertina (placeholder path)
 * - Tempo di lettura stimato
 *
 * Usato da: GuidesPage (lista), GuidePage (singola guida)
 * Rotte: /guide, /guide/:slug
 */

/* ── Interfaccia singola guida ─────────────────────────────────────── */
export interface Guide {
  id: string;           // Identificativo univoco
  title: string;        // Titolo della guida
  slug: string;         // Slug per l'URL (es. "come-scegliere-abbattitore")
  category: string;     // Categoria: "Guida all'acquisto" | "Guida operativa" | "Manutenzione"
  excerpt: string;      // Breve descrizione (1-2 righe, usata nella lista)
  content: string;      // Contenuto completo della guida (testo lungo)
  author: string;       // Autore
  publishedAt: string;  // Data pubblicazione (formato ISO: "2024-01-15")
  readTime: number;     // Tempo lettura in minuti
  image: string;        // Path immagine copertina
  relatedCategories: string[]; // Slug categorie correlate dal catalogo
}

/* ── Elenco completo delle guide ───────────────────────────────────── */
export const guides: Guide[] = [

  /* ------------------------------------------------------------------ *
   * 1. COME SCEGLIERE L'ABBATTITORE DI TEMPERATURA
   * Guida all'acquisto rivolta a ristoratori, pizzaioli e pasticceri
   * che devono orientarsi nella scelta dell'abbattitore giusto.
   * ------------------------------------------------------------------ */
  {
    id: 'guida-001',
    title: "Come scegliere l'abbattitore di temperatura giusto",
    slug: 'come-scegliere-abbattitore',
    category: "Guida all'acquisto",
    excerpt:
      "Tutto quello che devi sapere per scegliere l'abbattitore ideale: capacita, differenze tra positivo e negativo, normativa HACCP e consigli pratici.",
    author: 'Redazione BianchiPro',
    publishedAt: '2024-03-10',
    readTime: 7,
    image: '/images/guides/abbattitore.webp',
    relatedCategories: ['abbattitori'],
    content: `L'abbattitore di temperatura e uno degli strumenti piu importanti nella ristorazione professionale moderna. Il suo compito e semplice ma fondamentale: portare rapidamente la temperatura degli alimenti appena cotti da +90 °C a +3 °C (abbattimento positivo) oppure fino a -18 °C (abbattimento negativo, detto anche surgelazione rapida). Questo processo blocca la proliferazione batterica e preserva qualita, sapore e consistenza del cibo.

Abbattimento positivo vs negativo

L'abbattimento positivo raffredda gli alimenti fino a +3 °C al cuore in meno di 90 minuti. E il ciclo piu utilizzato in ristoranti e pizzerie per conservare piatti gia cotti che verranno serviti nei giorni successivi. L'abbattimento negativo, invece, porta il prodotto a -18 °C al cuore in massimo 240 minuti ed e ideale per chi vuole surgelare materie prime fresche (pesce crudo per sushi, impasti per pizza, semilavorati di pasticceria).

Quando e obbligatorio per legge

Il Regolamento CE 852/2004 e il sistema HACCP impongono che gli alimenti cotti non consumati subito vengano raffreddati rapidamente. Utilizzare un abbattitore e il metodo piu sicuro e documentabile per rispettare la normativa. In particolare, chi serve pesce crudo (sushi, tartare, carpacci) e obbligato ad abbattere a -20 °C per almeno 24 ore per eliminare il rischio Anisakis.

Criteri di scelta: capacita e dimensioni

La capacita si misura in numero di teglie GN 1/1 o teglie 60x40 cm. Per una pizzeria con 40-60 coperti, un abbattitore da 5 teglie e generalmente sufficiente. Un ristorante con menu ampio e 80-120 coperti dovrebbe orientarsi su 7-10 teglie. Le pasticcerie, che lavorano spesso con teglie 60x40, devono verificare la compatibilita delle guide interne.

Potenza frigorifera e velocita

Maggiore e la potenza del compressore, piu veloce sara l'abbattimento. I modelli professionali partono da 1.200 W per i 5 teglie e arrivano oltre i 3.000 W per i 10-14 teglie. Un abbattitore sottodimensionato non raggiungera le temperature nei tempi previsti dalla normativa.

Consigli per tipo di attivita

Per la pizzeria, un modello da 5 teglie con ciclo negativo e perfetto per surgelare i panetti di impasto gia porzionati, garantendo lievitazione uniforme dopo lo scongelamento. Per il ristorante, privilegiate modelli con sonda al cuore multipoint e display digitale per documentare i cicli HACCP. Per la pasticceria, scegliete abbattitori con ciclo delicato (soft chill) che evita la formazione di cristalli di ghiaccio su creme e mousse.

Marche e budget indicativo

I prezzi partono da circa 1.500 euro per un 5 teglie entry-level fino a oltre 6.000 euro per modelli da 14 teglie con compressore remoto. I brand piu diffusi nel settore Ho.Re.Ca. italiano sono Irinox, Afinox, Polaris e Coldline. Investire in un buon abbattitore significa ridurre gli sprechi alimentari, rispettare la legge e migliorare la qualita complessiva del servizio.`,
  },

  /* ------------------------------------------------------------------ *
   * 2. FORNO PER PIZZA: ELETTRICO O A GAS?
   * Confronto completo tra le due alimentazioni, con indicazioni
   * su temperature, consumi e tipologia di attivita.
   * ------------------------------------------------------------------ */
  {
    id: 'guida-002',
    title: 'Forno per pizza: elettrico o a gas? Guida completa',
    slug: 'forno-pizza-elettrico-gas',
    category: "Guida all'acquisto",
    excerpt:
      'Confronto dettagliato tra forni elettrici e a gas: temperature, consumi, dimensioni e quale scegliere in base alla tua attivita.',
    author: 'Redazione BianchiPro',
    publishedAt: '2024-04-22',
    readTime: 8,
    image: '/images/guides/forno-pizza.webp',
    relatedCategories: ['forni-per-pizza', 'forni-a-convezione'],
    content: `La scelta del forno per pizza e una delle decisioni piu importanti per chi apre o rinnova una pizzeria. Le due opzioni principali — forno elettrico e forno a gas — hanno caratteristiche tecniche molto diverse che influenzano la qualita del prodotto, i costi di gestione e la praticita d'uso.

Forno elettrico: precisione e costanza

I forni elettrici per pizza utilizzano resistenze in acciaio o ceramica posizionate sopra e sotto la camera di cottura. Il grande vantaggio e la precisione termica: la temperatura si regola al grado, con differenziale minimo tra cielo e platea. I modelli professionali raggiungono 450-500 °C, sufficienti per una pizza napoletana (che richiede circa 430-480 °C). I tempi di cottura variano da 60 a 120 secondi a seconda della temperatura impostata.

Forno a gas: potenza e tradizione

I forni a gas utilizzano bruciatori posizionati sotto la platea refrattaria. Raggiungono temperature molto elevate (fino a 500-550 °C nei modelli professionali) e offrono una cottura con caratteristiche simili al forno a legna, grazie alla fiamma viva e all'irraggiamento. Il consumo di gas e generalmente piu economico dell'elettricita, soprattutto per utilizzi intensivi (oltre 8 ore al giorno). Lo svantaggio principale e la minor uniformita termica.

Forni statici vs forni a convezione

I forni per pizza sono quasi sempre statici (senza ventola), perche la cottura della pizza richiede calore diretto dal basso (platea) e dall'alto (cielo). I forni a convezione, invece, sono ideali per la cottura di pane, focacce, pasticceria e gastronomia: la ventola distribuisce il calore uniformemente su tutte le teglie, permettendo cotture su piu livelli contemporaneamente.

Dimensioni della camera e produttivita

Le dimensioni della camera si esprimono in numero di pizze per infornata. Un forno da 4 pizze (diametro 30-33 cm) e sufficiente per una pizzeria d'asporto con volumi moderati. Per una pizzeria con sala da 60-80 coperti, servono almeno 6-8 pizze per infornata. Le pizzerie ad alto volume (oltre 100 coperti) necessitano di forni doppi o modulari da 8+8 o 12 pizze.

Consumi e costi di gestione

Un forno elettrico da 6 pizze assorbe mediamente 9-14 kW. Con un costo dell'energia di 0,25 euro/kWh, il consumo giornaliero per 8 ore di lavoro si aggira intorno ai 18-28 euro. Un forno a gas equivalente consuma circa 2-4 mc/h di metano: con un prezzo del gas di 0,80 euro/mc, il costo giornaliero e di 13-25 euro. Il gas risulta generalmente piu conveniente per utilizzi intensivi.

Quale scegliere per la tua attivita

Per la pizzeria classica con alti volumi, il forno a gas offre il miglior rapporto costi/prestazioni. Per la pizzeria al taglio o d'asporto con volumi medi, il forno elettrico garantisce costanza e facilita d'uso. Per il ristorante che serve anche pizza, un forno elettrico compatto (4 pizze) si integra facilmente nella cucina esistente. Per la focacceria o panetteria, un forno a convezione e la scelta migliore.`,
  },

  /* ------------------------------------------------------------------ *
   * 3. COME ATTREZZARE UNA PIZZERIA DA ZERO
   * Guida operativa completa con lista attrezzature, budget indicativo
   * e gli errori piu comuni da evitare.
   * ------------------------------------------------------------------ */
  {
    id: 'guida-003',
    title: 'Come attrezzare una pizzeria da zero',
    slug: 'come-attrezzare-pizzeria',
    category: 'Guida operativa',
    excerpt:
      'Lista completa delle attrezzature necessarie per aprire una pizzeria, con budget indicativi e gli errori da evitare.',
    author: 'Redazione BianchiPro',
    publishedAt: '2024-05-15',
    readTime: 9,
    image: '/images/guides/attrezzare-pizzeria.webp',
    relatedCategories: ['forni-per-pizza', 'impastatrice-a-spirale', 'banchi-pizza', 'stendipizza'],
    content: `Aprire una pizzeria richiede una pianificazione attenta delle attrezzature. Un investimento iniziale ben calibrato evita sprechi, rallentamenti e costose sostituzioni nei primi anni di attivita. Ecco la lista completa di cio che serve, suddivisa per area di lavoro.

1. Il forno: il cuore della pizzeria

Il forno e l'investimento piu importante. Per una pizzeria con 50-80 coperti, un forno elettrico o a gas da 6-8 pizze (diametro 33 cm) e il punto di partenza. Budget indicativo: 3.000-8.000 euro per un forno di buona qualita. Non dimenticate il supporto (tavolo inox o struttura dedicata) e, se necessario, la cappa di aspirazione specifica.

2. Impastatrice a spirale

L'impastatrice a spirale e la macchina standard per l'impasto della pizza. La capacita si misura in kg di farina: per una pizzeria media servono almeno 25-30 kg (vasca da 40-50 litri). Per volumi maggiori si arriva a 50 kg e oltre. Budget: 1.200-3.500 euro. Evitate le planetarie per la pizza: non sono progettate per impasti ad alta idratazione e si surriscaldano.

3. Banco pizza refrigerato

Il banco pizza e il piano di lavoro dove si stende e si condisce la pizza. I modelli refrigerati mantengono gli ingredienti al fresco e integrano un portaingredienti con vaschette GN. Scegliete un banco con piano in granito o marmo (migliore per la stesura) e almeno 2 porte refrigerate sotto. Lunghezze standard: 150, 200 o 250 cm. Budget: 1.800-4.000 euro.

4. Stendipizza (opzionale ma consigliato)

Lo stendipizza automatico velocizza enormemente la produzione, soprattutto per la pizza al taglio o in teglia. Stende il panetto in disco uniforme in pochi secondi. Indispensabile per chi produce oltre 150 pizze al giorno. Budget: 2.500-5.000 euro.

5. Abbattitore di temperatura

Essenziale per surgelare i panetti gia porzionati (gestione scorte) e per rispettare la normativa HACCP sulla conservazione degli alimenti cotti. Un modello da 5 teglie GN 1/1 e sufficiente per la maggior parte delle pizzerie. Budget: 1.500-3.500 euro.

6. Friggitrice professionale

Se il menu prevede fritture (supplì, crocchette, patatine, fritture di pesce), serve almeno una friggitrice da 8-10 litri. Per volumi elevati, meglio una doppia vasca. Budget: 400-1.500 euro.

7. Attrezzature complementari

Non dimenticare: bilancia digitale di precisione (50-150 euro), contenitori per lievitazione con coperchio (cassette impasto da 30-60 litri, 15-30 euro l'una), pale per pizza (alluminio o legno, 20-60 euro), rotella tagliapizza professionale, dosatori per olio, dispenser per farina.

Errori comuni da evitare

Il primo errore e comprare attrezzature sottodimensionate pensando di risparmiare: un forno troppo piccolo crea colli di bottiglia durante il servizio. Il secondo e trascurare l'impianto elettrico: forni e impastatrici richiedono linee dedicate con potenza adeguata (spesso trifase). Il terzo e non prevedere spazio sufficiente per la movimentazione: tra un banco e l'altro servono almeno 120 cm di passaggio. Infine, non sottovalutate la ventilazione: una cappa aspirante dimensionata correttamente e obbligatoria per legge e rende l'ambiente di lavoro piu confortevole.

Budget totale indicativo

Per una pizzeria completa di medie dimensioni (50-80 coperti), l'investimento in attrezzature da cucina si aggira tra 12.000 e 25.000 euro, esclusi arredi sala, impianti e lavori edili.`,
  },

  /* ------------------------------------------------------------------ *
   * 4. MANUTENZIONE DEL FRIGORIFERO PROFESSIONALE
   * Guida pratica alla manutenzione ordinaria e straordinaria
   * per allungare la vita utile e risparmiare energia.
   * ------------------------------------------------------------------ */
  {
    id: 'guida-004',
    title: 'Manutenzione del frigorifero professionale: guida pratica',
    slug: 'manutenzione-frigorifero-professionale',
    category: 'Manutenzione',
    excerpt:
      'Consigli pratici per la manutenzione ordinaria del frigorifero professionale: pulizia, controllo temperature e risparmio energetico.',
    author: 'Redazione BianchiPro',
    publishedAt: '2024-06-05',
    readTime: 6,
    image: '/images/guides/manutenzione-frigo.webp',
    relatedCategories: ['frigoriferi-professionali', 'congelatori-professionali'],
    content: `Un frigorifero professionale ben mantenuto dura piu a lungo, consuma meno energia e garantisce la sicurezza alimentare richiesta dalla normativa HACCP. Ecco le operazioni di manutenzione che ogni ristoratore dovrebbe conoscere e pianificare.

Pulizia settimanale: interno ed esterno

Ogni settimana, svuotate completamente il frigorifero e pulite le pareti interne, i ripiani e le guarnizioni con acqua tiepida e detergente neutro (mai prodotti aggressivi o abrasivi). Risciacquate bene e asciugate prima di ricaricare. Pulite anche l'esterno, soprattutto le maniglie e le superfici di contatto. Le guarnizioni delle porte meritano attenzione particolare: se sporche o deformate, non sigillano correttamente e il compressore lavora di piu.

Controllo delle temperature

Verificate quotidianamente che la temperatura interna sia conforme: tra 0 °C e +4 °C per i frigoriferi positivi, tra -18 °C e -22 °C per i congelatori. Registrate le temperature nel registro HACCP. Se notate oscillazioni superiori a 2-3 gradi, potrebbe esserci un problema al termostato, al compressore o alle guarnizioni. Un termometro esterno di controllo e un investimento minimo (10-20 euro) che puo evitare costose perdite di merce.

Sbrinamento e condensatore

I frigoriferi moderni hanno lo sbrinamento automatico (no-frost), ma e importante verificare che il sistema funzioni correttamente. Se si forma ghiaccio sulle pareti interne, lo sbrinamento automatico potrebbe essere in avaria. Per i modelli senza no-frost, programmate lo sbrinamento manuale quando lo strato di ghiaccio supera i 3-4 mm. Il condensatore (la griglia posteriore o inferiore) va pulito almeno ogni 3 mesi con un aspirapolvere o una spazzola morbida: la polvere accumulata riduce l'efficienza e aumenta i consumi fino al 30%.

Quando chiamare un tecnico

Contattate un tecnico specializzato se: il compressore funziona in continuazione senza mai fermarsi, la temperatura non scende al livello impostato, si sentono rumori anomali (vibrazioni, clic ripetuti), si forma acqua sul fondo interno, oppure il display mostra codici di errore. Non tentate riparazioni fai-da-te sull'impianto frigorifero: il gas refrigerante e pericoloso e la sua manipolazione richiede certificazione F-Gas.

Durata media e quando sostituire

Un frigorifero professionale di buona qualita dura mediamente 8-12 anni con manutenzione regolare. Dopo i 10 anni, valutate la sostituzione se i costi di riparazione superano il 40% del prezzo di un modello nuovo equivalente, oppure se il consumo energetico e aumentato significativamente (i modelli recenti consumano fino al 40% in meno grazie ai compressori inverter).

Consigli per risparmiare energia

Posizionate il frigorifero lontano da fonti di calore (forni, piani cottura, luce solare diretta). Lasciate almeno 10 cm di spazio tra la parete posteriore e il muro per consentire la ventilazione del condensatore. Non inserite mai alimenti caldi: usate l'abbattitore prima. Evitate di aprire le porte inutilmente e verificate che le chiusure automatiche funzionino. Queste semplici accortezze riducono i consumi del 15-25% e allungano la vita del compressore.`,
  },

  /* ------------------------------------------------------------------ *
   * 5. FATTURAZIONE ELETTRONICA B2B
   * Guida operativa su codice SDI, PEC, invio automatico
   * e obblighi di legge per acquisti tra professionisti.
   * ------------------------------------------------------------------ */
  {
    id: 'guida-005',
    title: 'Fatturazione elettronica B2B: cosa devi sapere',
    slug: 'fatturazione-elettronica-b2b',
    category: 'Guida operativa',
    excerpt:
      "Tutto sulla fatturazione elettronica B2B: codice SDI, differenza con la PEC, invio automatico e obblighi per i professionisti Ho.Re.Ca.",
    author: 'Redazione BianchiPro',
    publishedAt: '2024-07-20',
    readTime: 5,
    image: '/images/guides/fatturazione-elettronica.webp',
    relatedCategories: [],
    content: `Dal 1° gennaio 2019, la fatturazione elettronica e obbligatoria per tutte le operazioni B2B (tra aziende e professionisti con partita IVA) in Italia. Quando acquistate attrezzature professionali per la vostra attivita Ho.Re.Ca., ricevete una fattura elettronica in formato XML che transita attraverso il Sistema di Interscambio (SDI) dell'Agenzia delle Entrate.

Cos'e il codice SDI (codice destinatario)

Il codice SDI e un codice alfanumerico di 7 caratteri che identifica il canale attraverso cui ricevete le fatture elettroniche. Viene assegnato dal vostro software di fatturazione o dal vostro commercialista. Se utilizzate un gestionale (Fatture in Cloud, Aruba, TeamSystem, ecc.), il codice SDI e fornito dal servizio stesso. Se non avete un gestionale, potete usare il codice generico "0000000" (sette zeri) e ricevere le fatture nel vostro cassetto fiscale sul sito dell'Agenzia delle Entrate.

SDI vs PEC: quale usare

Esistono due modi per ricevere le fatture elettroniche: tramite codice SDI oppure tramite PEC (Posta Elettronica Certificata). Il codice SDI e il metodo consigliato perche le fatture arrivano direttamente nel vostro gestionale, pronte per la registrazione contabile automatica. La PEC funziona ma e meno pratica: ricevete un file XML allegato che dovete poi importare manualmente. Se comunicate il codice SDI al fornitore, le fatture non arriveranno sulla PEC (il codice SDI ha priorita).

Come funziona l'invio automatico

Quando effettuate un acquisto su BianchiPro, il nostro sistema genera la fattura elettronica in formato XML conforme allo standard FatturaPA. La fattura viene inviata al Sistema di Interscambio, che la valida e la recapita al vostro gestionale tramite il codice SDI indicato, oppure alla vostra PEC, oppure nel cassetto fiscale. L'intero processo richiede da pochi minuti a 48 ore lavorative.

Dove trovare il proprio codice destinatario

Se non conoscete il vostro codice SDI, potete: chiedere al vostro commercialista (e il primo riferimento), accedere al vostro software di fatturazione e cercare nelle impostazioni del profilo, oppure accedere al portale Fatture e Corrispettivi dell'Agenzia delle Entrate con SPID o CIE e verificare la registrazione dell'indirizzo telematico.

Obblighi di legge e conservazione

Le fatture elettroniche devono essere conservate digitalmente per 10 anni (conservazione sostitutiva a norma). La maggior parte dei gestionali include questo servizio. Attenzione: stampare la fattura elettronica e conservarla solo su carta non e sufficiente per la legge. Il file XML originale deve essere mantenuto in formato digitale con firma e marca temporale.

Dati necessari per la fatturazione

Quando acquistate su BianchiPro, assicuratevi di indicare correttamente: ragione sociale, indirizzo della sede legale, partita IVA, codice fiscale, codice SDI oppure indirizzo PEC. Se la ragione sociale o la partita IVA sono errate, la fattura verra scartata dal SDI e dovra essere riemessa, con ritardi nei tempi di consegna della documentazione.`,
  },

  /* ------------------------------------------------------------------ *
   * 6. SOTTOVUOTO PROFESSIONALE: A BARRA O A CAMPANA?
   * Confronto tecnico tra i due sistemi di confezionamento
   * sottovuoto, con indicazioni per uso HACCP e sous-vide.
   * ------------------------------------------------------------------ */
  {
    id: 'guida-006',
    title: 'Sottovuoto professionale: a barra o a campana?',
    slug: 'sottovuoto-barra-campana',
    category: "Guida all'acquisto",
    excerpt:
      "Differenze tra confezionatrice sottovuoto a barra e a campana: quale scegliere per la tua attivita, conservazione HACCP e cottura sous-vide.",
    author: 'Redazione BianchiPro',
    publishedAt: '2024-08-12',
    readTime: 7,
    image: '/images/guides/sottovuoto.webp',
    relatedCategories: ['sottovuoto-a-barra', 'sottovuoto-a-campana'],
    content: `Il confezionamento sottovuoto e una tecnica fondamentale nella ristorazione professionale: allunga la conservazione degli alimenti, previene l'ossidazione e consente la cottura a bassa temperatura (sous-vide). Le due tipologie principali di macchine — a barra e a campana — rispondono a esigenze molto diverse.

Sottovuoto a barra: come funziona

La confezionatrice a barra (detta anche "ad aspirazione esterna") aspira l'aria dalla busta attraverso un ugello posizionato all'apertura del sacchetto. E compatta, leggera (5-15 kg) e relativamente economica (200-800 euro). Il livello di vuoto raggiunto e buono ma non massimo, perche l'aspirazione avviene solo dall'esterno. E adatta per un uso moderato: piccole quantita, prodotti solidi e asciutti (salumi, formaggi, porzioni di carne).

Sottovuoto a campana: come funziona

La confezionatrice a campana crea il vuoto all'interno di una camera chiusa (la "campana") in cui viene inserita l'intera busta. La pompa aspira tutta l'aria dalla camera, ottenendo un vuoto molto piu spinto (fino al 99,9%). Puo confezionare anche liquidi e prodotti umidi senza che vengano aspirati fuori dalla busta. E piu pesante (30-120 kg), piu ingombrante e piu costosa (1.200-5.000 euro), ma e decisamente piu versatile e performante.

Vantaggi della barra

Costo contenuto, dimensioni ridotte (sta su un piano di lavoro), facilita d'uso, manutenzione minima. Ideale per chi ha bisogno del sottovuoto per uso saltuario o per piccoli volumi: un bar che confeziona panini preparati, un piccolo ristorante che porziona salumi e formaggi, un B&B che prepara colazioni.

Vantaggi della campana

Vuoto piu profondo e costante, possibilita di confezionare liquidi (marinate, sughi, brodi), cicli programmabili (vuoto parziale per prodotti delicati), maggiore velocita nelle lavorazioni intensive. Le buste lisce (meno costose di quelle goffrate richieste dalla barra) riducono il costo per singolo confezionamento. Indispensabile per chi fa sous-vide su larga scala.

Conservazione HACCP e sicurezza alimentare

Il sottovuoto rientra tra le tecniche di conservazione riconosciute dal sistema HACCP. Riduce la presenza di ossigeno, rallentando la crescita di batteri aerobi e l'ossidazione. La carne sottovuoto in frigorifero (+2 °C) si conserva fino a 6-8 giorni contro i 2-3 giorni del confezionamento tradizionale. Attenzione: il sottovuoto non elimina il rischio di batteri anaerobi (come il Clostridium botulinum), quindi e fondamentale rispettare la catena del freddo e le temperature di conservazione.

Cottura sous-vide: quale macchina serve

Per la cottura sous-vide (a bassa temperatura in acqua) e consigliabile la campana, perche garantisce un vuoto costante e sigillatura perfetta anche con marinate e liquidi. Se usate la barra, assicuratevi di utilizzare buste goffrate di spessore adeguato (almeno 90 micron) e di non inserire troppo liquido.

Quale scegliere: riepilogo

Uso saltuario, piccoli volumi, prodotti asciutti: barra. Uso intensivo, grandi volumi, liquidi, sous-vide professionale: campana. Se il budget lo consente, la campana e sempre la scelta migliore per una cucina professionale: la differenza in versatilita e affidabilita si ripaga rapidamente con la riduzione degli sprechi alimentari e l'aumento della shelf life dei prodotti.`,
  },
];

/* ── Funzione di utilita: cerca una guida per slug ─────────────────── */
/**
 * Restituisce la guida corrispondente allo slug passato,
 * oppure undefined se non esiste. Usata da GuidePage per
 * caricare il contenuto della singola guida.
 */
export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
