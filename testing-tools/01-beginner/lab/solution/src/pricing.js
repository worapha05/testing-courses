/**
 * @param {{ price: number, qty: number }[]} items
 * @param {number} couponPercent
 */
export function calculateCartTotal(items, couponPercent = 0) {
  if (!Array.isArray(items) || items.length === 0) {
    return 0;
  }

  let subtotal = 0;
  for (const item of items) {
    if (item.price < 0 || item.qty < 0) {
      throw new Error('price and qty must be non-negative');
    }
    subtotal += item.price * item.qty;
  }

  const capped = Math.min(Math.max(couponPercent, 0), 40);
  return Number((subtotal * (1 - capped / 100)).toFixed(2));
}
