const nodemailer = require('nodemailer');

/**
 * Netlify Function: send-verification-email
 *
 * Invia email di verifica registrazione tramite Gmail SMTP.
 *
 * Variabili d'ambiente necessarie su Netlify:
 *   GMAIL_USER           = tua-email@gmail.com
 *   GMAIL_APP_PASSWORD   = xxxx xxxx xxxx xxxx  (App Password di Google)
 */

const createTransporter = () => {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
};

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Metodo non consentito' }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Payload non valido' }),
    };
  }

  const { email } = payload;
  if (!email) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Email obbligatoria' }),
    };
  }

  const transporter = createTransporter();
  if (!transporter) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Email non configurata. Imposta GMAIL_USER e GMAIL_APP_PASSWORD nelle variabili d\'ambiente Netlify.',
      }),
    };
  }

  const code = generateVerificationCode();

  const mailOptions = {
    from: `"BianchiPro" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Conferma la tua registrazione su BianchiPro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #22c55e;">
          <h1 style="color: #111827; margin: 0; font-size: 24px;">BianchiPro</h1>
          <p style="color: #6b7280; margin: 4px 0 0; font-size: 14px;">Attrezzature professionali per la ristorazione</p>
        </div>

        <div style="padding: 30px 0;">
          <h2 style="color: #111827; font-size: 20px;">Conferma la tua email</h2>
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
            Grazie per esserti registrato su BianchiPro. Per completare la registrazione,
            inserisci il seguente codice di verifica:
          </p>

          <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
            <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px;">Il tuo codice di verifica:</p>
            <p style="color: #111827; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0;">${code}</p>
          </div>

          <p style="color: #6b7280; font-size: 13px; line-height: 1.5;">
            Questo codice scade tra 30 minuti. Se non hai richiesto questa registrazione,
            puoi ignorare questa email.
          </p>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; text-align: center;">
          <p style="color: #9ca3af; font-size: 12px;">
            BianchiPro S.r.l. — Soluzioni professionali per la ristorazione<br/>
            Questa email e stata inviata automaticamente, non rispondere.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Email di verifica inviata a ${email}`,
        code, // In produzione rimuovere — serve solo per il test
      }),
    };
  } catch (error) {
    console.error('Errore invio email:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Errore durante l\'invio dell\'email',
        details: error.message,
      }),
    };
  }
};
