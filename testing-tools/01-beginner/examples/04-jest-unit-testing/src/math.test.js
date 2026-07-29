import { calculateDiscount, formatCurrency } from './math.js';

describe('calculateDiscount', () => {
  it('returns full price when percent is 0', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
  });

  it('applies percentage discount', () => {
    expect(calculateDiscount(200, 10)).toBe(180);
  });

  it('caps discount at 50%', () => {
    expect(calculateDiscount(100, 80)).toBe(50);
  });

  it('throws on negative inputs', () => {
    expect(() => calculateDiscount(-1, 10)).toThrow(/non-negative/i);
  });
});

describe('formatCurrency', () => {
  it('formats THB by default', () => {
    const result = formatCurrency(1290);
    expect(result).toContain('1,290');
  });
});
