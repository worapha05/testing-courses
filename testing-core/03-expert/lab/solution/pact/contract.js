/**
 * Minimal Pact-style contract shared by consumer & provider verification
 */
export const createOrderContract = {
  consumer: 'checkout-web',
  provider: 'order-api',
  interaction: {
    request: { method: 'POST', path: '/orders', body: { sku: 'SKU-1', qty: 1 } },
    response: { status: 201, body: { id: 'string', status: 'CREATED' } },
  },
};

export function isNonEmptyString(value) {
  return typeof value === 'string' && value.length > 0;
}

export function providerCreateOrder(body) {
  if (!body?.sku || !body?.qty) return { status: 400, body: { error: 'INVALID' } };
  return { status: 201, body: { id: `ord-${body.sku}`, status: 'CREATED' } };
}
