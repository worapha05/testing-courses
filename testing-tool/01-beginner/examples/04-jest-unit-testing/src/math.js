/**
 * คำนวณราคาสุทธิหลังส่วนลด (สูงสุด 50%)
 */
export function calculateDiscount(price, percent) {
  if (price < 0 || percent < 0) {
    throw new Error('price and percent must be non-negative');
  }
  const capped = Math.min(percent, 50);
  return Number((price * (1 - capped / 100)).toFixed(2));
}

export function formatCurrency(amount, currency = 'THB') {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency,
  }).format(amount);
}
