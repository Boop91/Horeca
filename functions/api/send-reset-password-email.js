/**
 * Cloudflare Pages Function: send-reset-password-email
 *
 * Invia email di recupero password tramite Gmail SMTP.
 *
 * Variabili d'ambiente su Cloudflare Pages:
 *   GMAIL_USER           = tua-email@gmail.com
 *   GMAIL_APP_PASSWORD   = xxxx xxxx xxxx xxxx
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

  const { email, temporaryPassword } = payload;
  if (!email || !temporaryPassword) {
    return new Response(
      JSON.stringify({ error: 'Email e password temporanea obbligatorie' }),
      { status: 400, headers }
    );
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

  const mailOptions = {
    from: `"BianchiPro" <${env.GMAIL_USER}>`,
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
    return new Response(
      JSON.stringify({
        success: true,
        message: `Email di recupero inviata a ${email}`,
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
