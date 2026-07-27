/**
 * Domain: Pricing helpers ที่ออกแบบให้ทดสอบได้ (pure + inject clock)
 */

/**
 * @typedef {{ code: string, percentOff: number, expiresAt: Date, minSubtotal: number }} Coupon
 * @typedef {{ sku: string, unitPrice: number, quantity: number }} LineItem
 */

/**
 * @param {LineItem[]} items
 */
export function subtotal(items) {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

/**
 * @param {Coupon} coupon
 * @param {number} subtotalAmount
 * @param {Date} [now]
 */
export function validateCoupon(coupon, subtotalAmount, now = new Date()) {
  if (coupon.percentOff <= 0 || coupon.percentOff > 100) {
    return { ok: false, reason: 'INVALID_PERCENT' };
  }
  if (now.getTime() > coupon.expiresAt.getTime()) {
    return { ok: false, reason: 'EXPIRED' };
  }
  if (subtotalAmount < coupon.minSubtotal) {
    return { ok: false, reason: 'MIN_SUBTOTAL' };
  }
  return { ok: true };
}

/**
 * @param {number} subtotalAmount
 * @param {Coupon} coupon
 * @param {Date} [now]
 */
export function applyCoupon(subtotalAmount, coupon, now) {
  const result = validateCoupon(coupon, subtotalAmount, now);
  if (!result.ok) {
    throw new Error(result.reason);
  }
  const discounted = subtotalAmount * (1 - coupon.percentOff / 100);
  return Math.round(discounted * 100) / 100;
}

/**
 * @param {number} amount
 * @param {'TH' | 'US' | 'EU'} region
 */
export function applyTax(amount, region) {
  const rates = { TH: 0.07, US: 0.08, EU: 0.2 };
  const withTax = amount * (1 + rates[region]);
  return Math.round(withTax * 100) / 100;
}
