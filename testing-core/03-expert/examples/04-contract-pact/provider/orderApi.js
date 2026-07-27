/**
 * Provider implementation แบบย่อ
 */
export function createOrderHandler(reqBody) {
  if (!reqBody?.sku || !reqBody?.qty) {
    return { status: 400, body: { error: 'INVALID' } };
  }
  return {
    status: 201,
    body: { id: `ord-${reqBody.sku}`, status: 'CREATED' },
  };
}
