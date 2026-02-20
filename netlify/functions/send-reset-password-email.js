const nodemailer = require('nodemailer');

/**
 * Netlify Function: send-reset-password-email
 *
 * Invia email di recupero password tramite Gmail SMTP.
 *
 * Variabili d'ambiente necessarie su Netlify:
 *   GMAIL_USER           = tua-email@gmail.com
 *   GMAIL_APP_PASSWORD   = xxxx xxxx xxxx xxxx
 */

const createTransporter = () => {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
};

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Metodo non consentito' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Payload non valido' }) };
  }

  const { email, temporaryPassword } = payload;
  if (!email || !temporaryPassword) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email e password temporanea obbligatorie' }) };
  }

  const transporter = createTransporter();
  if (!transporter) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Email non configurata. Imposta GMAIL_USER e GMAIL_APP_PASSWORD.' }),
    };
  }

  const mailOptions = {
    from: `"BianchiPro" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Recupero password — BianchiPro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #22c55e;">
          <h1 style="color: #111827; margin: 0; font-size: 24px;">BianchiPro</h1>
          <p style="color: #6b7280; margin: 4px 0 0; font-size: 14px;">Attrezzature professionali per la ristorazione</p>
        </div>

        <div style="padding: 30px 0;">
          <h2 style="color: #111827; font-size: 20px;">Recupero password</h2>
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
            Hai richiesto il recupero della password per il tuo account BianchiPro.
            Ecco la tua password temporanea:
          </p>

          <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
            <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px;">La tua password temporanea:</p>
            <p style="color: #111827; font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 0; font-family: monospace;">${temporaryPassword}</p>
          </div>

          <p style="color: #dc2626; font-size: 14px; font-weight: bold;">
            Cambia la password immediatamente dopo l'accesso.
          </p>

          <p style="color: #6b7280; font-size: 13px;">
            Se non hai richiesto il recupero password, ignora questa email.
          </p>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; text-align: center;">
          <p style="color: #9ca3af; font-size: 12px;">
            BianchiPro S.r.l. — Soluzioni professionali per la ristorazione
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
      body: JSON.stringify({ success: true, message: `Email di recupero inviata a ${email}` }),
    };
  } catch (error) {
    console.error('Errore invio email:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Errore durante l\'invio dell\'email', details: error.message }),
    };
  }
};
