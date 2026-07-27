export class InMemoryCouponRepository {
  constructor() {
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

    const discounted = Math.round(orderSubtotal * (1 - coupon.percentOff / 100) * 100) / 100;
    return { ok: true, discounted };
  }
}
