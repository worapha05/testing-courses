/**
 * Loyalty Pricing Engine — ผลลัพธ์หลัง TDD + Refactor
 * แยกเป็น pure functions เพื่อให้ unit test ง่ายและอ่าน intent ชัด
 */

/** @typedef {'NONE' | 'SILVER' | 'GOLD'} MemberTier */
/** @typedef {{ sku: string, unitPrice: number, quantity: number }} LineItem */

const MEMBER_RATE = {
  NONE: 0,
  SILVER: 0.05,
  GOLD: 0.1,
};

/**
 * @param {LineItem[]} items
 */
export function calculateSubtotal(items) {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

/**
 * @param {number} subtotal
 * @param {MemberTier} tier
 */
export function applyMemberDiscount(subtotal, tier) {
  const rate = MEMBER_RATE[tier] ?? 0;
  return roundMoney(subtotal * (1 - rate));
}

/**
 * โบนัส 50 เมื่อยอดก่อนโบนัส ≥ 1000 และเป็นสมาชิก
 * @param {number} amountAfterMemberDiscount
 * @param {MemberTier} tier
 */
export function applyThresholdBonus(amountAfterMemberDiscount, tier) {
  if (tier === 'NONE') return amountAfterMemberDiscount;
  if (amountAfterMemberDiscount < 1000) return amountAfterMemberDiscount;
  return roundMoney(amountAfterMemberDiscount - 50);
}

/**
 * @param {number} amount
 */
export function applyVatTH(amount) {
  return roundMoney(amount * 1.07);
}

/**
 * @param {LineItem[]} items
 * @param {MemberTier} tier
 */
export function calculateFinalPrice(items, tier) {
  const subtotal = calculateSubtotal(items);
  const afterMember = applyMemberDiscount(subtotal, tier);
  const afterBonus = applyThresholdBonus(afterMember, tier);
  const withTax = applyVatTH(afterBonus);
  return Math.max(0, withTax);
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}
