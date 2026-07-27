import { calculateCartTotal } from './pricing.js';

describe('calculateCartTotal', () => {
  it('returns 0 for empty cart', () => {
    expect(calculateCartTotal([])).toBe(0);
  });

  it('sums price * qty', () => {
    expect(
      calculateCartTotal([
        { price: 100, qty: 2 },
        { price: 50, qty: 1 },
      ]),
    ).toBe(250);
  });

  it('applies coupon and caps at 40%', () => {
    expect(calculateCartTotal([{ price: 100, qty: 1 }], 10)).toBe(90);
    expect(calculateCartTotal([{ price: 100, qty: 1 }], 90)).toBe(60);
  });

  it('throws on negative price or qty', () => {
    expect(() => calculateCartTotal([{ price: -1, qty: 1 }])).toThrow(/non-negative/i);
    expect(() => calculateCartTotal([{ price: 10, qty: -2 }])).toThrow(/non-negative/i);
  });
});
