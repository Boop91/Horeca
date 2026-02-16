/**
 * @file validation.ts
 * @description Funzioni di validazione per dati di input nel contesto B2B italiano.
 *
 * Questo modulo centralizza tutte le validazioni dei dati inseriti dagli utenti,
 * in particolare i dati fiscali obbligatori per la fatturazione elettronica in Italia.
 *
 * Validazioni incluse:
 *   - Partita IVA italiana (formato + algoritmo di controllo)
 *   - Codice Fiscale (formato base)
 *   - Codice Destinatario SDI (7 caratteri alfanumerici)
 *   - PEC (Posta Elettronica Certificata)
 *   - Email generica
 *   - Telefono italiano
 *   - CAP italiano (5 cifre)
 *   - Provincia italiana (2 lettere maiuscole)
 *   - Sanitizzazione testo (anti-XSS)
 *
 * Utilizzato da:
 *   - CheckoutPage.tsx (dati fatturazione)
 *   - AccountPage.tsx (profilo aziendale)
 *   - ContactPage.tsx (form di contatto)
 *   - AuthModal.tsx (registrazione)
 *
 * @see https://it.wikipedia.org/wiki/Partita_IVA (algoritmo di Luhn per P.IVA)
 */

/* ═══════════════════════════════════════════════════════════════
   INTERFACCIA RISULTATO VALIDAZIONE
   ═══════════════════════════════════════════════════════════════ */

/**
 * Risultato di una validazione.
 * - valid: true se il dato è corretto, false altrimenti
 * - error: messaggio di errore in italiano (presente solo se valid = false)
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/* ═══════════════════════════════════════════════════════════════
   PARTITA IVA ITALIANA
   ═══════════════════════════════════════════════════════════════ */

/**
 * Valida una Partita IVA italiana.
 *
 * Formato atteso: "IT" (opzionale) seguito da esattamente 11 cifre.
 * Esempio valido: "IT03434940403" oppure "03434940403"
 *
 * L'algoritmo di controllo verifica la cifra di check (l'ultima)
 * secondo il metodo di Luhn modificato usato dall'Agenzia delle Entrate:
 *   1. Si sommano le cifre in posizione dispari (1ª, 3ª, 5ª, 7ª, 9ª)
 *   2. Per le cifre in posizione pari (2ª, 4ª, 6ª, 8ª, 10ª):
 *      - Si raddoppia ogni cifra
 *      - Se il risultato supera 9, si sottrae 9
 *      - Si sommano i risultati
 *   3. Si calcola: (10 - (somma_totale % 10)) % 10
 *   4. Il risultato deve coincidere con l'11ª cifra (check digit)
 *
 * @param piva — Stringa contenente la Partita IVA da validare
 * @returns ValidationResult con eventuale messaggio di errore
 */
export function validatePartitaIVA(piva: string): ValidationResult {
  if (!piva || piva.trim() === '') {
    return { valid: false, error: 'La Partita IVA è obbligatoria' };
  }

  // Rimuove il prefisso "IT" se presente (maiuscolo o minuscolo)
  const cleaned = piva.trim().replace(/^IT/i, '');

  // Deve essere composta da esattamente 11 cifre
  if (!/^\d{11}$/.test(cleaned)) {
    return { valid: false, error: 'La Partita IVA deve contenere 11 cifre (es. IT03434940403)' };
  }

  // Non può essere composta da tutte cifre uguali (es. 00000000000)
  if (/^(\d)\1{10}$/.test(cleaned)) {
    return { valid: false, error: 'La Partita IVA non è valida' };
  }

  // Algoritmo di Luhn modificato per P.IVA italiana
  const digits = cleaned.split('').map(Number);

  // Somma cifre in posizione DISPARI (indice 0, 2, 4, 6, 8 → posizioni 1ª, 3ª, 5ª, 7ª, 9ª)
  let sumOdd = 0;
  for (let i = 0; i < 10; i += 2) {
    sumOdd += digits[i];
  }

  // Somma cifre in posizione PARI (indice 1, 3, 5, 7, 9 → posizioni 2ª, 4ª, 6ª, 8ª, 10ª)
  let sumEven = 0;
  for (let i = 1; i < 10; i += 2) {
    const doubled = digits[i] * 2;
    // Se il raddoppio supera 9, si sottrae 9
    sumEven += doubled > 9 ? doubled - 9 : doubled;
  }

  // Cifra di controllo attesa
  const checkDigit = (10 - ((sumOdd + sumEven) % 10)) % 10;

  if (checkDigit !== digits[10]) {
    return { valid: false, error: 'La Partita IVA non supera il controllo di validità' };
  }

  return { valid: true };
}

/* ═══════════════════════════════════════════════════════════════
   CODICE FISCALE
   ═══════════════════════════════════════════════════════════════ */

/**
 * Valida il formato base di un Codice Fiscale italiano.
 *
 * Formato: 16 caratteri alfanumerici con pattern specifico.
 * Esempio: RSSMRA85M01H501Z
 *
 * Pattern: 6 lettere + 2 cifre + 1 lettera + 2 cifre + 1 lettera + 3 cifre + 1 lettera
 *
 * NOTA: Questa validazione verifica solo il formato, non il check digit.
 * Per una validazione completa servirebbe l'algoritmo dei codici carattere.
 *
 * @param cf — Stringa contenente il Codice Fiscale da validare
 * @returns ValidationResult
 */
export function validateCodiceFiscale(cf: string): ValidationResult {
  if (!cf || cf.trim() === '') {
    return { valid: false, error: 'Il Codice Fiscale è obbligatorio' };
  }

  const cleaned = cf.trim().toUpperCase();

  // Formato standard: 6 lettere + 2 cifre + 1 lettera + 2 cifre + 1 lettera + 3 cifre + 1 lettera
  if (!/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/.test(cleaned)) {
    return { valid: false, error: 'Formato Codice Fiscale non valido (es. RSSMRA85M01H501Z)' };
  }

  return { valid: true };
}

/* ═══════════════════════════════════════════════════════════════
   CODICE DESTINATARIO SDI
   ═══════════════════════════════════════════════════════════════ */

/**
 * Valida un Codice Destinatario SDI (Sistema di Interscambio).
 *
 * Il codice SDI è necessario per ricevere le fatture elettroniche.
 * Formato: esattamente 7 caratteri alfanumerici MAIUSCOLI.
 * Valore speciale: "0000000" (7 zeri) = nessun codice specifico.
 *
 * Esempio valido: "A1B2C3D", "0000000", "KRRH6B9"
 *
 * @param sdi — Stringa contenente il codice SDI da validare
 * @returns ValidationResult
 */
export function validateCodiceSDI(sdi: string): ValidationResult {
  if (!sdi || sdi.trim() === '') {
    return { valid: false, error: 'Il Codice Destinatario SDI è obbligatorio' };
  }

  const cleaned = sdi.trim().toUpperCase();

  if (!/^[A-Z0-9]{7}$/.test(cleaned)) {
    return { valid: false, error: 'Il Codice SDI deve essere di 7 caratteri alfanumerici (es. KRRH6B9)' };
  }

  return { valid: true };
}

/* ═══════════════════════════════════════════════════════════════
   PEC (POSTA ELETTRONICA CERTIFICATA)
   ═══════════════════════════════════════════════════════════════ */

/**
 * Valida un indirizzo PEC (Posta Elettronica Certificata).
 *
 * La PEC è l'alternativa al Codice SDI per la fatturazione elettronica.
 * Formato: email standard con dominio tipicamente .pec.it o simili.
 * Non controlliamo il dominio specifico perché esistono molti provider PEC.
 *
 * @param pec — Stringa contenente l'indirizzo PEC da validare
 * @returns ValidationResult
 */
export function validatePEC(pec: string): ValidationResult {
  if (!pec || pec.trim() === '') {
    return { valid: false, error: 'L\'indirizzo PEC è obbligatorio' };
  }

  // Usa la stessa regex dell'email ma accetta solo formato valido
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(pec.trim())) {
    return { valid: false, error: 'Formato PEC non valido (es. azienda@pec.it)' };
  }

  return { valid: true };
}

/* ═══════════════════════════════════════════════════════════════
   EMAIL GENERICA
   ═══════════════════════════════════════════════════════════════ */

/**
 * Valida un indirizzo email generico.
 *
 * Controllo di formato base: deve contenere @ e un dominio valido.
 * Non invia email di verifica (quello lo fa Supabase Auth).
 *
 * @param email — Stringa contenente l'email da validare
 * @returns ValidationResult
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') {
    return { valid: false, error: 'L\'email è obbligatoria' };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Formato email non valido' };
  }

  return { valid: true };
}

/* ═══════════════════════════════════════════════════════════════
   TELEFONO ITALIANO
   ═══════════════════════════════════════════════════════════════ */

/**
 * Valida un numero di telefono italiano.
 *
 * Formati accettati:
 *   - Con prefisso internazionale: +39 333 1234567, +39333123456
 *   - Senza prefisso: 333 1234567, 3331234567, 0541 620526
 *
 * Dopo aver rimosso spazi e trattini, deve contenere 9-12 cifre
 * (opzionalmente precedute da +39).
 *
 * @param phone — Stringa contenente il numero di telefono
 * @returns ValidationResult
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone || phone.trim() === '') {
    return { valid: false, error: 'Il numero di telefono è obbligatorio' };
  }

  // Rimuove spazi, trattini e parentesi per analisi
  const cleaned = phone.trim().replace(/[\s\-()]/g, '');

  // Formato atteso: opzionale +39 seguito da 9-11 cifre
  if (!/^(\+39)?\d{9,11}$/.test(cleaned)) {
    return { valid: false, error: 'Formato telefono non valido (es. +39 333 1234567)' };
  }

  return { valid: true };
}

/* ═══════════════════════════════════════════════════════════════
   CAP ITALIANO
   ═══════════════════════════════════════════════════════════════ */

/**
 * Valida un CAP (Codice di Avviamento Postale) italiano.
 *
 * Formato: esattamente 5 cifre.
 * Esempio: 47822 (Santarcangelo di Romagna)
 *
 * @param cap — Stringa contenente il CAP da validare
 * @returns ValidationResult
 */
export function validateCAP(cap: string): ValidationResult {
  if (!cap || cap.trim() === '') {
    return { valid: false, error: 'Il CAP è obbligatorio' };
  }

  if (!/^\d{5}$/.test(cap.trim())) {
    return { valid: false, error: 'Il CAP deve essere di 5 cifre (es. 47822)' };
  }

  return { valid: true };
}

/* ═══════════════════════════════════════════════════════════════
   PROVINCIA ITALIANA
   ═══════════════════════════════════════════════════════════════ */

/**
 * Valida una sigla di provincia italiana.
 *
 * Formato: esattamente 2 lettere maiuscole.
 * Esempio: RN (Rimini), MI (Milano), RM (Roma)
 *
 * NOTA: Non controlliamo se la sigla esiste realmente nella lista
 * delle province italiane, solo il formato.
 *
 * @param prov — Stringa contenente la sigla della provincia
 * @returns ValidationResult
 */
export function validateProvincia(prov: string): ValidationResult {
  if (!prov || prov.trim() === '') {
    return { valid: false, error: 'La provincia è obbligatoria' };
  }

  if (!/^[A-Za-z]{2}$/.test(prov.trim())) {
    return { valid: false, error: 'La provincia deve essere di 2 lettere (es. RN, MI, RM)' };
  }

  return { valid: true };
}

/* ═══════════════════════════════════════════════════════════════
   SANITIZZAZIONE TESTO (ANTI-XSS)
   ═══════════════════════════════════════════════════════════════ */

/**
 * Sanitizza una stringa di testo per prevenire attacchi XSS.
 *
 * Converte i caratteri pericolosi in entità HTML:
 *   & → &amp;    (previene iniezione di entità)
 *   < → &lt;     (previene apertura tag HTML)
 *   > → &gt;     (previene chiusura tag HTML)
 *   " → &quot;   (previene uscita da attributi)
 *   ' → &#x27;   (previene uscita da attributi con apice singolo)
 *
 * QUANDO USARE: sui dati che vengono inseriti nel DOM via innerHTML
 * o passati a contesti dove potrebbero essere interpretati come HTML.
 *
 * NOTA: React di default fa già l'escape nel JSX, quindi questa funzione
 * è necessaria solo per contesti speciali (es. dangerouslySetInnerHTML,
 * attributi title, meta tag, email HTML).
 *
 * @param text — Testo da sanitizzare
 * @returns Testo con caratteri speciali convertiti in entità HTML
 */
export function sanitizeText(text: string): string {
  if (!text) return '';

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Rimuove tutti i tag HTML da una stringa.
 *
 * Utile per pulire testo copiato/incollato da fonti esterne
 * prima di salvarlo nel database.
 *
 * @param html — Stringa potenzialmente contenente HTML
 * @returns Testo senza alcun tag HTML
 */
export function stripHtmlTags(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

/* ═══════════════════════════════════════════════════════════════
   VALIDAZIONE COMPLETA DATI FATTURAZIONE
   ═══════════════════════════════════════════════════════════════ */

/**
 * Interfaccia per i dati di fatturazione elettronica B2B.
 * Tutti i campi obbligatori per emettere una fattura elettronica in Italia.
 */
export interface DatiFatturazione {
  ragione_sociale: string;
  partita_iva: string;
  codice_fiscale?: string;       // Opzionale per le aziende
  codice_destinatario_sdi: string;
  pec?: string;                  // Alternativa a SDI
  via: string;
  citta: string;
  cap: string;
  provincia: string;
}

/**
 * Valida tutti i dati di fatturazione in un'unica chiamata.
 *
 * Regole:
 * - Ragione sociale: obbligatoria, minimo 2 caratteri
 * - Partita IVA: obbligatoria, validata con algoritmo
 * - SDI o PEC: almeno uno dei due deve essere valido
 * - Indirizzo completo: via, città, CAP, provincia tutti obbligatori
 *
 * @param dati — Oggetto con i dati di fatturazione
 * @returns Oggetto con chiave = nome campo, valore = messaggio errore.
 *          Se l'oggetto è vuoto, la validazione è passata.
 */
export function validateDatiFatturazione(dati: DatiFatturazione): Record<string, string> {
  const errors: Record<string, string> = {};

  // Ragione Sociale (obbligatoria)
  if (!dati.ragione_sociale || dati.ragione_sociale.trim().length < 2) {
    errors.ragione_sociale = 'La Ragione Sociale è obbligatoria (minimo 2 caratteri)';
  }

  // Partita IVA (obbligatoria, validata con algoritmo)
  const pivaResult = validatePartitaIVA(dati.partita_iva);
  if (!pivaResult.valid) {
    errors.partita_iva = pivaResult.error!;
  }

  // Codice Fiscale (opzionale, ma se presente deve essere valido)
  if (dati.codice_fiscale && dati.codice_fiscale.trim() !== '') {
    const cfResult = validateCodiceFiscale(dati.codice_fiscale);
    if (!cfResult.valid) {
      errors.codice_fiscale = cfResult.error!;
    }
  }

  // SDI o PEC: almeno uno deve essere fornito e valido
  const hasSdi = dati.codice_destinatario_sdi && dati.codice_destinatario_sdi.trim() !== '' && dati.codice_destinatario_sdi.trim() !== '0000000';
  const hasPec = dati.pec && dati.pec.trim() !== '';

  if (!hasSdi && !hasPec) {
    errors.codice_destinatario_sdi = 'Inserisci il Codice SDI oppure la PEC per la fatturazione elettronica';
  } else {
    if (hasSdi) {
      const sdiResult = validateCodiceSDI(dati.codice_destinatario_sdi);
      if (!sdiResult.valid) errors.codice_destinatario_sdi = sdiResult.error!;
    }
    if (hasPec) {
      const pecResult = validatePEC(dati.pec!);
      if (!pecResult.valid) errors.pec = pecResult.error!;
    }
  }

  // Indirizzo: tutti i campi obbligatori
  if (!dati.via || dati.via.trim().length < 3) {
    errors.via = 'L\'indirizzo è obbligatorio';
  }
  if (!dati.citta || dati.citta.trim().length < 2) {
    errors.citta = 'La città è obbligatoria';
  }

  const capResult = validateCAP(dati.cap);
  if (!capResult.valid) errors.cap = capResult.error!;

  const provResult = validateProvincia(dati.provincia);
  if (!provResult.valid) errors.provincia = provResult.error!;

  return errors;
}
