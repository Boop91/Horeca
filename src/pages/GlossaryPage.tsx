/**
 * GlossaryPage.tsx — Glossario tecnico Ho.Re.Ca.
 *
 * Contiene 33 termini tecnici del settore attrezzature professionali
 * per la ristorazione, con definizioni chiare e complete.
 *
 * Categorie di termini inclusi:
 * - Attrezzature: Abbattitore, Affettatrice, Cuocipasta, Fry Top, Granitore, ecc.
 * - Materiali: AISI 304, R290 (gas refrigerante)
 * - Standard: Gastronorm (GN), HACCP
 * - Fiscale/B2B: IVA, Partita IVA, PEC, SDI, Fattura Elettronica, MEPA
 * - Tecnico: Monofase/Trifase, Convezione, Sous-vide, Sottovuoto
 * - Commerciale: Ho.Re.Ca., Noleggio Operativo, Bordo Strada
 *
 * Funzionalità:
 * - Ricerca in tempo reale (filtra per termine e definizione)
 * - Termini ordinati alfabeticamente
 * - Layout a card per facile lettura
 *
 * Rotta: /glossario
 */
import { Link } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';

const glossaryTerms = [
  { term: 'Abbattitore', definition: 'Attrezzatura che abbassa rapidamente la temperatura degli alimenti da +90°C a +3°C (abbattimento positivo) o -18°C (abbattimento negativo/surgelazione) per garantire sicurezza alimentare e qualità organolettica.' },
  { term: 'AISI 304', definition: 'Acciaio inossidabile austenitico (18% cromo, 8% nichel), il più utilizzato nel settore alimentare. Resistente alla corrosione, igienico e facile da pulire. Standard per attrezzature professionali.' },
  { term: 'Affettatrice', definition: 'Macchina professionale per il taglio di salumi, formaggi e carni. Le affettatrici professionali hanno lame in acciaio temperato da 250 a 370 mm di diametro.' },
  { term: 'Bagnomaria', definition: 'Metodo di riscaldamento indiretto che utilizza acqua calda per mantenere gli alimenti a temperatura costante (65-80°C) senza cuocerli ulteriormente. Ideale per servizio buffet.' },
  { term: 'Banco Pizza', definition: 'Tavolo refrigerato specifico per la preparazione delle pizze, dotato di piano in granito e vano portaingredienti refrigerato con coperchio.' },
  { term: 'Bordo Strada', definition: 'Tipo di consegna standard in cui il corriere consegna la merce al piano terra dell\'indirizzo indicato, senza percorrere rampe, scalini o salire ai piani superiori.' },
  { term: 'Chafing Dish', definition: 'Contenitore riscaldato, tipicamente con combustibile gel o resistenza elettrica, utilizzato per mantenere i cibi caldi durante il servizio a buffet. Dal francese "chauffer" (riscaldare).' },
  { term: 'Codice Destinatario SDI', definition: 'Codice alfanumerico di 7 caratteri assegnato dal Sistema di Interscambio per la ricezione delle fatture elettroniche. Alternativa alla PEC per la fatturazione elettronica B2B.' },
  { term: 'Convezione', definition: 'Metodo di cottura in cui l\'aria calda circola uniformemente all\'interno del forno tramite una o più ventole, garantendo cottura omogenea e tempi ridotti.' },
  { term: 'Cuocipasta', definition: 'Attrezzatura professionale per la cottura della pasta in grandi quantità. Dotata di cestelli estraibili per gestire più porzioni simultaneamente.' },
  { term: 'Cutter', definition: 'Macchina professionale per tritare, emulsionare e amalgamare alimenti. Utilizzata per preparare farce, paté, salse e impasti. Capacità da 3 a 60 litri.' },
  { term: 'Fattura Elettronica', definition: 'Documento fiscale in formato XML trasmesso tramite il Sistema di Interscambio (SDI) dell\'Agenzia delle Entrate. Obbligatoria in Italia per le transazioni B2B dal 2019.' },
  { term: 'Fry Top', definition: 'Piastra di cottura liscia o rigata in acciaio o ghisa, utilizzata per la cottura a contatto diretto. Le versioni cromate garantiscono antiaderenza e facilità di pulizia.' },
  { term: 'Gastronorm (GN)', definition: 'Standard europeo (EN 631) per le dimensioni dei contenitori nella ristorazione professionale. La misura base GN 1/1 è 530×325 mm. Frazioni comuni: GN 1/2, GN 1/3, GN 2/3.' },
  { term: 'Granitore', definition: 'Macchina per la produzione di granite, sorbetti e bevande ghiacciate. Funziona raffreddando e mescolando contemporaneamente il composto.' },
  { term: 'HACCP', definition: 'Hazard Analysis and Critical Control Points. Sistema preventivo di controllo alimentare obbligatorio (Reg. CE 852/2004) per tutte le aziende del settore alimentare nell\'UE.' },
  { term: 'Ho.Re.Ca.', definition: 'Acronimo di Hotellerie-Restaurant-Café. Indica il settore della ristorazione collettiva e dell\'ospitalità professionale.' },
  { term: 'Impastatrice a Spirale', definition: 'Macchina per impastare con movimento a spirale, ideale per impasti consistenti come quelli per pizza e pane. Capacità da 7 a 200 kg di farina.' },
  { term: 'IVA', definition: 'Imposta sul Valore Aggiunto. In Italia l\'aliquota standard è del 22%. Nel commercio B2B i prezzi vengono esposti al netto dell\'IVA.' },
  { term: 'Lievitatore', definition: 'Camera con temperatura e umidità controllate (28-35°C, 75-85% UR) per la lievitazione di impasti. Compatibile con teglie Gastronorm o 60×40 cm.' },
  { term: 'MEPA', definition: 'Mercato Elettronico della Pubblica Amministrazione. Piattaforma per gli acquisti online delle PA italiane. Non tutti i fornitori Ho.Re.Ca. vi aderiscono.' },
  { term: 'Monofase/Trifase', definition: 'Tipi di alimentazione elettrica. Monofase (230V) per attrezzature di piccola potenza. Trifase (400V) per macchinari industriali di potenza elevata.' },
  { term: 'Noleggio Operativo', definition: 'Formula di finanziamento che permette di utilizzare un\'attrezzatura pagando un canone mensile, senza acquistarla. Spesso include manutenzione e possibilità di riscatto.' },
  { term: 'Partita IVA', definition: 'Codice identificativo fiscale per le attività economiche in Italia. Formato: IT + 11 cifre. Necessaria per gli acquisti B2B con fatturazione elettronica.' },
  { term: 'PEC', definition: 'Posta Elettronica Certificata. Ha valore legale equivalente alla raccomandata A/R. Utilizzata come alternativa al Codice SDI per la ricezione delle fatture elettroniche.' },
  { term: 'Pietra Lavica', definition: 'Materiale vulcanico utilizzato come superficie di cottura per griglie professionali. Distribuisce il calore uniformemente e conferisce un sapore caratteristico alla cottura alla brace.' },
  { term: 'R290', definition: 'Gas refrigerante naturale (propano) con impatto ambientale minimo (GWP=3), in sostituzione dei gas fluorurati. Sempre più utilizzato nelle attrezzature refrigerate di nuova generazione.' },
  { term: 'Salamandra', definition: 'Gratinatore professionale a irraggiamento dall\'alto. Utilizzato per gratinare, dorare e mantenere calde le preparazioni. La resistenza è regolabile in altezza.' },
  { term: 'Saladette', definition: 'Tavolo refrigerato con piano di lavoro e vano portaingredienti nella parte superiore, utilizzato per la preparazione di insalate, panini e piatti freddi.' },
  { term: 'SDI', definition: 'Sistema di Interscambio. Piattaforma gestita dall\'Agenzia delle Entrate per la trasmissione e validazione delle fatture elettroniche tra operatori economici in Italia.' },
  { term: 'Sfogliatrice', definition: 'Macchina per stendere impasti in sfoglie uniformi. Utilizzata in pasticceria, pizzeria e panificazione. Con rulli regolabili per lo spessore desiderato.' },
  { term: 'Sottovuoto', definition: 'Tecnica di confezionamento che rimuove l\'aria dalla confezione, prolungando la conservazione (3-5 volte). Esistono macchine a barra (uso leggero) e a campana (uso intensivo).' },
  { term: 'Sous-vide', definition: 'Metodo di cottura a bassa temperatura in cui gli alimenti, sigillati sottovuoto, vengono cotti in acqua a temperatura controllata (55-85°C) per tempi prolungati.' },
  { term: 'Termosigillatrice', definition: 'Macchina che sigilla ermeticamente vaschette alimentari con film plastico tramite calore. Utilizzata per il confezionamento di porzioni da asporto e delivery.' },
];

export default function GlossaryPage() {
  const [search, setSearch] = useState('');
  const filtered = glossaryTerms.filter(t =>
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    t.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 mb-20">
      <nav className="flex items-center space-x-2 text-sm mb-8">
        <Link to="/" className="text-gray-600 hover:text-green-600">Home</Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium">Glossario</span>
      </nav>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Glossario Ho.Re.Ca.</h1>
      <p className="text-lg text-gray-600 mb-8">Terminologia tecnica del settore attrezzature professionali per la ristorazione.</p>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -trangray-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cerca un termine..."
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <div className="space-y-4">
        {filtered.map(({ term, definition }) => (
          <div key={term} className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 text-lg">{term}</h3>
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">{definition}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-8">Nessun termine trovato per "{search}"</p>
        )}
      </div>
    </main>
  );
}
