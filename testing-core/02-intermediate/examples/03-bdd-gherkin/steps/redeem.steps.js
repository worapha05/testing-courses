import assert from 'node:assert/strict';
import { CouponService, InMemoryCouponRepository } from '../couponDomain.js';

/** @type {{ repo: InMemoryCouponRepository, service: CouponService, subtotal: number, lastResult: any }} */
export const world = {
  repo: new InMemoryCouponRepository(),
  service: null,
  subtotal: 0,
  lastResult: null,
};

function resetWorld() {
  world.repo = new InMemoryCouponRepository();
  world.service = new CouponService(world.repo, () => new Date('2026-06-01T00:00:00Z'));
  world.subtotal = 0;
  world.lastResult = null;
}

/** @type {Array<{ pattern: RegExp, fn: (m: RegExpMatchArray) => Promise<void> | void }>} */
export const steps = [
  {
    pattern: /^Given a coupon "([^"]+)" with (\d+) percent off and (\d+) remaining uses?$/,
    async fn(match) {
      resetWorld();
      const [, code, percent, uses] = match;
      await world.repo.save({
        code,
        percentOff: Number(percent),
        expiresAt: new Date('2026-12-31T00:00:00Z'),
        remainingUses: Number(uses),
      });
    },
  },
  {
    pattern: /^And an order subtotal of (\d+)$/,
    fn(match) {
      world.subtotal = Number(match[1]);
    },
  },
  {
    pattern: /^When the customer redeems coupon "([^"]+)"$/,
    async fn(match) {
      world.lastResult = await world.service.redeem(match[1], world.subtotal);
    },
  },
  {
    pattern: /^Then the discounted total should be ([\d.]+)$/,
    fn(match) {
      assert.equal(world.lastResult.ok, true);
      assert.equal(world.lastResult.discounted, Number(match[1]));
    },
  },
  {
    pattern: /^And the coupon remaining uses should be (\d+)$/,
    async fn(match) {
      const coupon = await world.repo.findByCode('SAVE10');
      assert.equal(coupon.remainingUses, Number(match[1]));
    },
  },
  {
    pattern: /^Then the redeem should fail with reason "([^"]+)"$/,
    fn(match) {
      assert.equal(world.lastResult.ok, false);
      assert.equal(world.lastResult.reason, match[1]);
    },
  },
];
