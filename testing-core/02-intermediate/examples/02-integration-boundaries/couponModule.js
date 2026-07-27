export class InMemoryCouponRepository {
  constructor() {
    /** @type {Map<string, { code: string, percentOff: number, expiresAt: Date, remainingUses: number }>} */
    this.store = new Map();
  }

  async save(coupon) {
    this.store.set(coupon.code, { ...coupon });
  }

  async findByCode(code) {
    const found = this.store.get(code);
    return found ? { ...found } : null;
  }

  async decrementUses(code) {
    const found = this.store.get(code);
    if (!found || found.remainingUses <= 0) return false;
    found.remainingUses -= 1;
    this.store.set(code, found);
    return true;
  }
}

export class CouponService {
  /**
   * @param {InMemoryCouponRepository} repo
   * @param {() => Date} clock
   */
  constructor(repo, clock = () => new Date()) {
    this.repo = repo;
    this.clock = clock;
  }

  async redeem(code, orderSubtotal) {
    const coupon = await this.repo.findByCode(code);
    if (!coupon) return { ok: false, reason: 'NOT_FOUND' };
    if (this.clock().getTime() > coupon.expiresAt.getTime()) {
      return { ok: false, reason: 'EXPIRED' };
    }
    if (coupon.remainingUses <= 0) return { ok: false, reason: 'EXHAUSTED' };

    const decremented = await this.repo.decrementUses(code);
    if (!decremented) return { ok: false, reason: 'EXHAUSTED' };

    const discounted = roundMoney(orderSubtotal * (1 - coupon.percentOff / 100));
    return { ok: true, discounted };
  }
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}
