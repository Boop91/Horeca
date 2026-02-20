/**
 * Cloudflare Pages Function: send-verification-email
 *
 * Invia email di verifica registrazione tramite Gmail SMTP.
 *
 * Variabili d'ambiente su Cloudflare Pages:
 *   GMAIL_USER           = tua-email@gmail.com
 *   GMAIL_APP_PASSWORD   = xxxx xxxx xxxx xxxx  (App Password di Google)
 *
 * Richiede compatibility_flags = ["nodejs_compat"] in wrangler.toml
 */

async function createTransporter(env) {
  const nodemailer = await import('nodemailer');
  const user = env.GMAIL_USER;
  const pass = env.GMAIL_APP_PASSWORD;

  if (!user || !pass) return null;

  return nodemailer.default.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  let payload;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Payload non valido' }), {
      status: 400,
      headers,
    });
  }

  const { email } = payload;
  if (!email) {
    return new Response(JSON.stringify({ error: 'Email obbligatoria' }), {
      status: 400,
      headers,
    });
  }

  let transporter;
  try {
    transporter = await createTransporter(env);
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: 'Impossibile inizializzare il trasportatore email.',
        details: err.message,
      }),
      { status: 500, headers }
    );
  }

  if (!transporter) {
    return new Response(
      JSON.stringify({
        error: 'Email non configurata. Imposta GMAIL_USER e GMAIL_APP_PASSWORD nelle variabili d\'ambiente Cloudflare.',
      }),
      { status: 500, headers }
    );
  }

  const code = generateVerificationCode();

  const mailOptions = {
    from: `"BianchiPro" <${env.GMAIL_USER}>`,
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
    return new Response(
      JSON.stringify({
        success: true,
        message: `Email di verifica inviata a ${email}`,
        code, // In produzione rimuovere — serve solo per il test
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Errore invio email:', error);
    return new Response(
      JSON.stringify({
        error: "Errore durante l'invio dell'email",
        details: error.message,
      }),
      { status: 500, headers }
    );
  }
}

export async function onRequestOptions() {
  return new Response('', {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
}
