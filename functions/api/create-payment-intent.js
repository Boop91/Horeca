/**
 * Cloudflare Pages Function: create-payment-intent
 *
 * Crea un PaymentIntent su Stripe.
 * Variabile d'ambiente: STRIPE_SECRET_KEY
 */

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

  const amount = Number(payload.amount || 0);
  const currency = payload.currency || 'eur';
  const customerEmail = payload.customerEmail;

  if (!amount) {
    return new Response(JSON.stringify({ error: 'Amount è obbligatorio' }), {
      status: 400,
      headers,
    });
  }

  const stripeKey = env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return new Response(
      JSON.stringify({ error: 'Chiave Stripe non configurata. Imposta STRIPE_SECRET_KEY.' }),
      { status: 500, headers }
    );
  }

  const params = new URLSearchParams({
    amount: Math.round(amount * 100).toString(),
    currency,
    'automatic_payment_methods[enabled]': 'true',
    ...(customerEmail ? { receipt_email: customerEmail } : {}),
  });

  const response = await fetch('https://api.stripe.com/v1/payment_intents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  const paymentIntent = await response.json();

  if (!response.ok) {
    return new Response(
      JSON.stringify({
        error: 'Errore durante la creazione del pagamento',
        details: paymentIntent.error?.message,
      }),
      { status: 500, headers }
    );
  }

  return new Response(
    JSON.stringify({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }),
    { status: 200, headers }
  );
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
