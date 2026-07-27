import { beforeEach, describe, expect, it } from 'vitest';
import { CouponService, InMemoryCouponRepository } from './couponModule.js';

describe('CouponService ↔ Repository integration', () => {
  /** @type {InMemoryCouponRepository} */
  let repo;
  /** @type {CouponService} */
  let service;

  beforeEach(async () => {
    repo = new InMemoryCouponRepository();
    const fixedNow = () => new Date('2026-06-01T00:00:00Z');
    service = new CouponService(repo, fixedNow);

    await repo.save({
      code: 'SAVE10',
      percentOff: 10,
      expiresAt: new Date('2026-12-31T00:00:00Z'),
      remainingUses: 1,
    });
  });

  it('redeems a coupon and persists remaining uses', async () => {
    const first = await service.redeem('SAVE10', 200);
    expect(first).toEqual({ ok: true, discounted: 180 });

    const stored = await repo.findByCode('SAVE10');
    expect(stored.remainingUses).toBe(0);

    const second = await service.redeem('SAVE10', 200);
    expect(second).toEqual({ ok: false, reason: 'EXHAUSTED' });
  });

  it('rejects unknown coupon codes', async () => {
    await expect(service.redeem('NOPE', 100)).resolves.toEqual({
      ok: false,
      reason: 'NOT_FOUND',
    });
  });

  it('rejects expired coupons based on injected clock', async () => {
    await repo.save({
      code: 'OLD',
      percentOff: 5,
      expiresAt: new Date('2025-01-01T00:00:00Z'),
      remainingUses: 5,
    });

    await expect(service.redeem('OLD', 100)).resolves.toEqual({
      ok: false,
      reason: 'EXPIRED',
    });
  });
});
