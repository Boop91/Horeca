/**
 * Cloudflare Pages Function: preventivo
 *
 * Calcola subtotale, IVA e totale per gli items del carrello.
 */

const VAT_RATE = 0.22;

function calculateSubtotal(items = []) {
  return items.reduce((sum, item) => {
    const accessoriesTotal = (item.accessories || []).reduce(
      (acc, accessory) => acc + Number(accessory.price || 0),
      0
    );
    const quantity = Number(item.quantity || 0);
    const basePrice = Number(item.price || 0);
    return sum + (basePrice + accessoriesTotal) * quantity;
  }, 0);
}

export async function onRequestGet() {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

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

  const { items } = payload;

  if (!Array.isArray(items)) {
    return new Response(JSON.stringify({ error: 'Items non validi' }), {
      status: 400,
      headers,
    });
  }

  const subtotal = calculateSubtotal(items);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;

  return new Response(
    JSON.stringify({ subtotal, vat, total, currency: 'EUR' }),
    { status: 200, headers }
  );
}

export async function onRequestOptions() {
  return new Response('', {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    },
  });
}
