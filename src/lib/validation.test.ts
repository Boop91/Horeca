/* eslint-disable -- file di test, non servono le regole di lint */

// @vitest-environment node

/**
 * @file validation.test.ts
 * @description Test unitari per tutte le funzioni di validazione.
 *
 * Copre:
 *   - validatePartitaIVA: formato, algoritmo Luhn, casi limite
 *   - validateCodiceFiscale: formato 16 caratteri
 *   - validateCodiceSDI: 7 caratteri alfanumerici
 *   - validatePEC: formato email certificata
 *   - validateEmail: formato email standard
 *   - validatePhone: numeri italiani con/senza prefisso
 *   - validateCAP: 5 cifre
 *   - validateProvincia: 2 lettere
 *   - sanitizeText: escape caratteri HTML pericolosi
 *   - stripHtmlTags: rimozione tag HTML
 *   - validateDatiFatturazione: validazione completa dati B2B
 */

import {
  validatePartitaIVA,
  validateCodiceFiscale,
  validateCodiceSDI,
  validatePEC,
  validateEmail,
  validatePhone,
  validateCAP,
  validateProvincia,
  sanitizeText,
  stripHtmlTags,
  validateDatiFatturazione,
} from './validation';

/* ═══════════════════════════════════════════════════════════════
   TEST: PARTITA IVA ITALIANA
   Verifica formato a 11 cifre, prefisso IT opzionale,
   rifiuto cifre tutte uguali e controllo algoritmo di Luhn.
   ═══════════════════════════════════════════════════════════════ */

describe('validatePartitaIVA', () => {
  /* --- Casi di errore --- */

  it('dovrebbe rifiutare una stringa vuota', () => {
    const risultato = validatePartitaIVA('');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toBeDefined();
  });

  it('dovrebbe rifiutare una P.IVA con meno di 11 cifre', () => {
    // Solo 10 cifre: manca l'ultima
    const risultato = validatePartitaIVA('0343494040');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toContain('11 cifre');
  });

  it('dovrebbe rifiutare una P.IVA con più di 11 cifre', () => {
    // 12 cifre: una in più
    const risultato = validatePartitaIVA('034349404033');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toContain('11 cifre');
  });

  it('dovrebbe rifiutare una P.IVA contenente lettere (non il prefisso IT)', () => {
    // Lettere mescolate alle cifre
    const risultato = validatePartitaIVA('03A34940403');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toBeDefined();
  });

  it('dovrebbe rifiutare una P.IVA con tutte cifre uguali (es. 00000000000)', () => {
    // Caso limite: 11 zeri
    const risultato = validatePartitaIVA('00000000000');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toContain('non è valida');
  });

  it('dovrebbe rifiutare una P.IVA con check digit sbagliato', () => {
    // P.IVA "03434940403" è valida; "03434940401" ha l'ultima cifra errata
    const risultato = validatePartitaIVA('03434940401');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toContain('controllo di validità');
  });

  /* --- Casi validi --- */

  it('dovrebbe accettare una P.IVA reale valida (03434940403)', () => {
    const risultato = validatePartitaIVA('03434940403');
    expect(risultato.valid).toBe(true);
    expect(risultato.error).toBeUndefined();
  });

  it('dovrebbe accettare una P.IVA con prefisso IT (IT03434940403)', () => {
    // Il prefisso IT viene rimosso automaticamente
    const risultato = validatePartitaIVA('IT03434940403');
    expect(risultato.valid).toBe(true);
    expect(risultato.error).toBeUndefined();
  });
});

/* ═══════════════════════════════════════════════════════════════
   TEST: CODICE FISCALE
   Verifica il formato a 16 caratteri con pattern alfanumerico
   specifico (6 lettere + 2 cifre + 1 lettera + 2 cifre + 1
   lettera + 3 cifre + 1 lettera).
   ═══════════════════════════════════════════════════════════════ */

describe('validateCodiceFiscale', () => {
  /* --- Casi di errore --- */

  it('dovrebbe rifiutare una stringa vuota', () => {
    const risultato = validateCodiceFiscale('');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toBeDefined();
  });

  it('dovrebbe rifiutare un codice fiscale con formato errato', () => {
    // Formato non corrispondente al pattern atteso
    const risultato = validateCodiceFiscale('ABC123');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toContain('Formato');
  });

  /* --- Casi validi --- */

  it('dovrebbe accettare un codice fiscale con formato corretto (RSSMRA85M01H501Z)', () => {
    const risultato = validateCodiceFiscale('RSSMRA85M01H501Z');
    expect(risultato.valid).toBe(true);
    expect(risultato.error).toBeUndefined();
  });

  it('dovrebbe accettare un codice fiscale in lowercase (conversione interna a uppercase)', () => {
    // La funzione applica toUpperCase internamente
    const risultato = validateCodiceFiscale('rssmra85m01h501z');
    expect(risultato.valid).toBe(true);
    expect(risultato.error).toBeUndefined();
  });
});

/* ═══════════════════════════════════════════════════════════════
   TEST: CODICE DESTINATARIO SDI
   Verifica che il codice sia esattamente 7 caratteri
   alfanumerici maiuscoli.
   ═══════════════════════════════════════════════════════════════ */

describe('validateCodiceSDI', () => {
  /* --- Casi di errore --- */

  it('dovrebbe rifiutare una stringa vuota', () => {
    const risultato = validateCodiceSDI('');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toBeDefined();
  });

  it('dovrebbe rifiutare un codice con meno di 7 caratteri', () => {
    const risultato = validateCodiceSDI('KRRH6B');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toContain('7 caratteri');
  });

  it('dovrebbe rifiutare un codice con più di 7 caratteri', () => {
    const risultato = validateCodiceSDI('KRRH6B9X');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toContain('7 caratteri');
  });

  it('dovrebbe rifiutare un codice con caratteri speciali', () => {
    // Il punto esclamativo non è alfanumerico
    const risultato = validateCodiceSDI('KRR!6B9');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toBeDefined();
  });

  /* --- Casi validi --- */

  it('dovrebbe accettare un codice SDI valido (KRRH6B9)', () => {
    const risultato = validateCodiceSDI('KRRH6B9');
    expect(risultato.valid).toBe(true);
    expect(risultato.error).toBeUndefined();
  });

  it('dovrebbe accettare il valore speciale "0000000" (7 zeri)', () => {
    // Il formato 7 zeri è ammesso dallo standard SDI
    const risultato = validateCodiceSDI('0000000');
    expect(risultato.valid).toBe(true);
    expect(risultato.error).toBeUndefined();
  });
});

/* ═══════════════════════════════════════════════════════════════
   TEST: PEC (POSTA ELETTRONICA CERTIFICATA)
   Verifica formato email valido per indirizzi PEC.
   ═══════════════════════════════════════════════════════════════ */

describe('validatePEC', () => {
  /* --- Casi di errore --- */

  it('dovrebbe rifiutare una stringa vuota', () => {
    const risultato = validatePEC('');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toBeDefined();
  });

  it('dovrebbe rifiutare un formato che non è un indirizzo email', () => {
    // Manca il dominio e la chiocciola è assente
    const risultato = validatePEC('non-una-email');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toContain('Formato PEC');
  });

  /* --- Casi validi --- */

  it('dovrebbe accettare un indirizzo PEC valido (azienda@pec.it)', () => {
    const risultato = validatePEC('azienda@pec.it');
    expect(risultato.valid).toBe(true);
    expect(risultato.error).toBeUndefined();
  });
});

/* ═══════════════════════════════════════════════════════════════
   TEST: EMAIL GENERICA
   Verifica formato email standard con @ e dominio.
   ═══════════════════════════════════════════════════════════════ */

describe('validateEmail', () => {
  /* --- Casi di errore --- */

  it('dovrebbe rifiutare una stringa vuota', () => {
    const risultato = validateEmail('');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toBeDefined();
  });

  it('dovrebbe rifiutare una stringa senza chiocciola (@)', () => {
    const risultato = validateEmail('utente.example.com');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toContain('Formato email');
  });

  /* --- Casi validi --- */

  it('dovrebbe accettare un indirizzo email con formato valido', () => {
    const risultato = validateEmail('info@azienda.it');
    expect(risultato.valid).toBe(true);
    expect(risultato.error).toBeUndefined();
  });
});

/* ═══════════════════════════════════════════════════════════════
   TEST: TELEFONO ITALIANO
   Verifica numeri con/senza prefisso +39, fissi e mobili,
   con spazi e trattini opzionali.
   ═══════════════════════════════════════════════════════════════ */

describe('validatePhone', () => {
  /* --- Casi di errore --- */

  it('dovrebbe rifiutare una stringa vuota', () => {
    const risultato = validatePhone('');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toBeDefined();
  });

  it('dovrebbe rifiutare un numero troppo corto', () => {
    // Solo 5 cifre: insufficienti per un numero italiano
    const risultato = validatePhone('33312');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toContain('Formato telefono');
  });

  /* --- Casi validi --- */

  it('dovrebbe accettare un numero mobile con prefisso internazionale (+39 333 1234567)', () => {
    const risultato = validatePhone('+39 333 1234567');
    expect(risultato.valid).toBe(true);
    expect(risultato.error).toBeUndefined();
  });

  it('dovrebbe accettare un numero mobile senza prefisso (3331234567)', () => {
    const risultato = validatePhone('3331234567');
    expect(risultato.valid).toBe(true);
    expect(risultato.error).toBeUndefined();
  });

  it('dovrebbe accettare un numero di telefono fisso (0541 620526)', () => {
    // Numero fisso con prefisso di zona
    const risultato = validatePhone('0541 620526');
    expect(risultato.valid).toBe(true);
    expect(risultato.error).toBeUndefined();
  });
});

/* ═══════════════════════════════════════════════════════════════
   TEST: CAP ITALIANO
   Verifica che il CAP sia composto da esattamente 5 cifre.
   ═══════════════════════════════════════════════════════════════ */

describe('validateCAP', () => {
  /* --- Casi di errore --- */

  it('dovrebbe rifiutare una stringa vuota', () => {
    const risultato = validateCAP('');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toBeDefined();
  });

  it('dovrebbe rifiutare un CAP con solo 4 cifre', () => {
    const risultato = validateCAP('4782');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toContain('5 cifre');
  });

  it('dovrebbe rifiutare un CAP con 6 cifre', () => {
    const risultato = validateCAP('478222');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toContain('5 cifre');
  });

  it('dovrebbe rifiutare un CAP composto da lettere', () => {
    // Le lettere non sono ammesse nel CAP
    const risultato = validateCAP('ABCDE');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toContain('5 cifre');
  });

  /* --- Casi validi --- */

  it('dovrebbe accettare un CAP valido a 5 cifre (47822)', () => {
    const risultato = validateCAP('47822');
    expect(risultato.valid).toBe(true);
    expect(risultato.error).toBeUndefined();
  });
});

/* ═══════════════════════════════════════════════════════════════
   TEST: PROVINCIA ITALIANA
   Verifica che la sigla sia di esattamente 2 lettere.
   ═══════════════════════════════════════════════════════════════ */

describe('validateProvincia', () => {
  /* --- Casi di errore --- */

  it('dovrebbe rifiutare una stringa vuota', () => {
    const risultato = validateProvincia('');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toBeDefined();
  });

  it('dovrebbe rifiutare una sigla con 1 sola lettera', () => {
    const risultato = validateProvincia('R');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toContain('2 lettere');
  });

  it('dovrebbe rifiutare una sigla con 3 lettere', () => {
    const risultato = validateProvincia('RIM');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toContain('2 lettere');
  });

  it('dovrebbe rifiutare una sigla composta da numeri', () => {
    // I numeri non sono ammessi come sigla provincia
    const risultato = validateProvincia('12');
    expect(risultato.valid).toBe(false);
    expect(risultato.error).toContain('2 lettere');
  });

  /* --- Casi validi --- */

  it('dovrebbe accettare una sigla provincia valida (RN)', () => {
    const risultato = validateProvincia('RN');
    expect(risultato.valid).toBe(true);
    expect(risultato.error).toBeUndefined();
  });
});

/* ═══════════════════════════════════════════════════════════════
   TEST: SANITIZZAZIONE TESTO (ANTI-XSS)
   Verifica che i caratteri HTML pericolosi vengano convertiti
   nelle corrispondenti entità HTML.
   ═══════════════════════════════════════════════════════════════ */

describe('sanitizeText', () => {
  it('dovrebbe restituire stringa vuota se l\'input è vuoto', () => {
    expect(sanitizeText('')).toBe('');
  });

  it('dovrebbe fare escape dei tag script per prevenire XSS', () => {
    const input = "<script>alert('xss')</script>";
    const risultato = sanitizeText(input);
    // I caratteri < e > devono diventare &lt; e &gt;
    expect(risultato).not.toContain('<');
    expect(risultato).not.toContain('>');
    expect(risultato).toContain('&lt;script&gt;');
    expect(risultato).toContain('&#x27;'); // L'apice singolo deve essere escapato
  });

  it('dovrebbe fare escape di tutti i caratteri speciali HTML (&, ", <, >)', () => {
    const input = '&"<>';
    const risultato = sanitizeText(input);
    // Ogni carattere deve essere convertito nella sua entità
    expect(risultato).toBe('&amp;&quot;&lt;&gt;');
  });

  it('dovrebbe lasciare invariato il testo senza caratteri speciali', () => {
    const input = 'Testo normale senza caratteri pericolosi';
    expect(sanitizeText(input)).toBe(input);
  });
});

/* ═══════════════════════════════════════════════════════════════
   TEST: RIMOZIONE TAG HTML
   Verifica che tutti i tag HTML vengano rimossi lasciando
   solo il contenuto testuale.
   ═══════════════════════════════════════════════════════════════ */

describe('stripHtmlTags', () => {
  it('dovrebbe restituire stringa vuota se l\'input è vuoto', () => {
    expect(stripHtmlTags('')).toBe('');
  });

  it('dovrebbe rimuovere i tag HTML e restituire solo il testo (<b>testo</b>)', () => {
    expect(stripHtmlTags('<b>testo</b>')).toBe('testo');
  });

  it('dovrebbe rimuovere più tag HTML annidati o consecutivi', () => {
    // Due paragrafi consecutivi: i tag vengono rimossi, il testo resta unito
    expect(stripHtmlTags('<p>para1</p><p>para2</p>')).toBe('para1para2');
  });

  it('dovrebbe lasciare invariato il testo che non contiene tag', () => {
    const input = 'Solo testo semplice';
    expect(stripHtmlTags(input)).toBe(input);
  });
});

/* ═══════════════════════════════════════════════════════════════
   TEST: VALIDAZIONE COMPLETA DATI FATTURAZIONE
   Verifica la funzione aggregata che controlla tutti i campi
   necessari per emettere una fattura elettronica B2B.
   ═══════════════════════════════════════════════════════════════ */

describe('validateDatiFatturazione', () => {
  /**
   * Dati di esempio completi e validi con codice SDI.
   * Usati come base da modificare nei singoli test.
   */
  const datiValidiConSDI = {
    ragione_sociale: 'Azienda Test S.r.l.',
    partita_iva: '03434940403',
    codice_destinatario_sdi: 'KRRH6B9',
    via: 'Via Roma 1',
    citta: 'Rimini',
    cap: '47822',
    provincia: 'RN',
  };

  /**
   * Dati di esempio completi e validi con PEC al posto del codice SDI.
   * Il codice SDI è impostato a "0000000" (valore speciale = non specificato).
   */
  const datiValidiConPEC = {
    ragione_sociale: 'Azienda Test S.r.l.',
    partita_iva: '03434940403',
    codice_destinatario_sdi: '0000000',
    pec: 'azienda@pec.it',
    via: 'Via Roma 1',
    citta: 'Rimini',
    cap: '47822',
    provincia: 'RN',
  };

  /* --- Validazione superata (nessun errore) --- */

  it('dovrebbe restituire un oggetto vuoto per dati completi e validi con SDI', () => {
    const errori = validateDatiFatturazione(datiValidiConSDI);
    // Oggetto vuoto = nessun errore di validazione
    expect(Object.keys(errori)).toHaveLength(0);
  });

  it('dovrebbe restituire un oggetto vuoto per dati completi e validi con PEC (senza SDI)', () => {
    const errori = validateDatiFatturazione(datiValidiConPEC);
    expect(Object.keys(errori)).toHaveLength(0);
  });

  /* --- Errori su singoli campi --- */

  it('dovrebbe segnalare errore se la ragione sociale è mancante', () => {
    const dati = { ...datiValidiConSDI, ragione_sociale: '' };
    const errori = validateDatiFatturazione(dati);
    // Il campo ragione_sociale deve comparire tra gli errori
    expect(errori).toHaveProperty('ragione_sociale');
  });

  it('dovrebbe segnalare errore se la partita IVA non è valida', () => {
    // P.IVA troppo corta: non passa la validazione
    const dati = { ...datiValidiConSDI, partita_iva: '12345' };
    const errori = validateDatiFatturazione(dati);
    expect(errori).toHaveProperty('partita_iva');
  });

  it('dovrebbe segnalare errore se né SDI né PEC sono forniti', () => {
    // Codice SDI "0000000" è considerato come non specificato,
    // e la PEC è assente: deve fallire
    const dati = {
      ...datiValidiConSDI,
      codice_destinatario_sdi: '0000000',
      pec: undefined,
    };
    const errori = validateDatiFatturazione(dati);
    expect(errori).toHaveProperty('codice_destinatario_sdi');
  });

  it('dovrebbe segnalare errore se il CAP non è valido', () => {
    // CAP con sole 3 cifre: non valido
    const dati = { ...datiValidiConSDI, cap: '123' };
    const errori = validateDatiFatturazione(dati);
    expect(errori).toHaveProperty('cap');
  });
});
