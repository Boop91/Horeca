/**
 * Cloudflare Pages Function: orders
 *
 * Salva un ordine (mock — in futuro collegare a Supabase).
 */

export async function onRequestPost(context) {
  const { request } = context;

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

  const { customerName, customerEmail, customerPhone, customerAddress, items, total, paymentIntentId } = payload;

  if (!customerEmail || !customerPhone || !items || !total) {
    return new Response(
      JSON.stringify({ error: 'Dati mancanti: email, telefono, items e total sono obbligatori' }),
      { status: 400, headers }
    );
  }

  const orderId = `order-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  return new Response(
    JSON.stringify({
      success: true,
      orderId,
      message: 'Ordine salvato con successo',
      order: {
        id: orderId,
        customerName: customerName || '',
        customerEmail,
        customerPhone,
        customerAddress: customerAddress || '',
        items,
        total,
        paymentIntentId: paymentIntentId || null,
        status: paymentIntentId ? 'paid' : 'pending',
      },
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
