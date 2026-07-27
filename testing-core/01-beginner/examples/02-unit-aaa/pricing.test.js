import { describe, expect, it } from 'vitest';
import { applyCoupon, applyTax, subtotal, validateCoupon } from './pricing.js';

describe('subtotal', () => {
  it('sums line items using AAA', () => {
    // Arrange
    const items = [
      { sku: 'A', unitPrice: 100, quantity: 2 },
      { sku: 'B', unitPrice: 50, quantity: 1 },
    ];

    // Act
    const total = subtotal(items);

    // Assert
    expect(total).toBe(250);
  });

  it('returns 0 for empty cart', () => {
    expect(subtotal([])).toBe(0);
  });
});

describe('validateCoupon', () => {
  const baseCoupon = {
    code: 'SAVE10',
    percentOff: 10,
    expiresAt: new Date('2026-12-31T00:00:00Z'),
    minSubtotal: 100,
  };

  it('accepts a valid coupon at a fixed "now"', () => {
    // Arrange — inject time เพื่อให้ deterministic
    const now = new Date('2026-06-01T00:00:00Z');

    // Act
    const result = validateCoupon(baseCoupon, 150, now);

    // Assert
    expect(result).toEqual({ ok: true });
  });

  it('rejects expired coupon', () => {
    const now = new Date('2027-01-01T00:00:00Z');
    expect(validateCoupon(baseCoupon, 150, now)).toEqual({
      ok: false,
      reason: 'EXPIRED',
    });
  });

  it('rejects when subtotal below minimum', () => {
    const now = new Date('2026-06-01T00:00:00Z');
    expect(validateCoupon(baseCoupon, 50, now)).toEqual({
      ok: false,
      reason: 'MIN_SUBTOTAL',
    });
  });
});

describe('applyCoupon', () => {
  it('applies percent off and rounds to cents', () => {
    const coupon = {
      code: 'SAVE10',
      percentOff: 10,
      expiresAt: new Date('2026-12-31T00:00:00Z'),
      minSubtotal: 0,
    };
    const now = new Date('2026-06-01T00:00:00Z');

    expect(applyCoupon(199.99, coupon, now)).toBe(179.99);
  });

  it('throws when coupon invalid', () => {
    const coupon = {
      code: 'BAD',
      percentOff: 10,
      expiresAt: new Date('2020-01-01T00:00:00Z'),
      minSubtotal: 0,
    };
    expect(() => applyCoupon(100, coupon, new Date('2026-01-01'))).toThrow('EXPIRED');
  });
});

describe('applyTax', () => {
  it('applies TH VAT 7%', () => {
    expect(applyTax(100, 'TH')).toBe(107);
  });
});
