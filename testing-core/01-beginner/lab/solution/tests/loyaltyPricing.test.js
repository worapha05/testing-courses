import { describe, expect, it } from 'vitest';
import {
  applyMemberDiscount,
  applyThresholdBonus,
  applyVatTH,
  calculateFinalPrice,
  calculateSubtotal,
} from '../src/loyaltyPricing.js';

describe('calculateSubtotal', () => {
  it('sums quantity * unitPrice', () => {
    // Arrange
    const items = [
      { sku: 'A', unitPrice: 200, quantity: 2 },
      { sku: 'B', unitPrice: 100, quantity: 1 },
    ];
    // Act
    const result = calculateSubtotal(items);
    // Assert
    expect(result).toBe(500);
  });

  it('returns 0 for empty items', () => {
    expect(calculateSubtotal([])).toBe(0);
  });
});

describe('applyMemberDiscount', () => {
  it('applies 5% for SILVER', () => {
    expect(applyMemberDiscount(1000, 'SILVER')).toBe(950);
  });

  it('applies 10% for GOLD', () => {
    expect(applyMemberDiscount(1000, 'GOLD')).toBe(900);
  });

  it('applies 0% for NONE', () => {
    expect(applyMemberDiscount(1000, 'NONE')).toBe(1000);
  });
});

describe('applyThresholdBonus', () => {
  it('subtracts 50 when member amount >= 1000', () => {
    expect(applyThresholdBonus(1000, 'GOLD')).toBe(950);
  });

  it('does not subtract for NONE even when amount is high', () => {
    expect(applyThresholdBonus(2000, 'NONE')).toBe(2000);
  });

  it('does not subtract when below 1000', () => {
    expect(applyThresholdBonus(999.99, 'SILVER')).toBe(999.99);
  });
});

describe('applyVatTH', () => {
  it('adds 7% VAT', () => {
    expect(applyVatTH(100)).toBe(107);
  });
});

describe('calculateFinalPrice (end-to-end of unit composition)', () => {
  it('calculates GOLD cart with threshold bonus and VAT', () => {
    // Arrange — subtotal 2000 → GOLD 10% = 1800 → bonus = 1750 → VAT = 1872.5
    const items = [{ sku: 'LAPTOP', unitPrice: 2000, quantity: 1 }];

    // Act
    const finalPrice = calculateFinalPrice(items, 'GOLD');

    // Assert
    expect(finalPrice).toBe(1872.5);
  });

  it('never returns negative price', () => {
    const items = [{ sku: 'X', unitPrice: 0, quantity: 1 }];
    expect(calculateFinalPrice(items, 'NONE')).toBe(0);
  });
});
