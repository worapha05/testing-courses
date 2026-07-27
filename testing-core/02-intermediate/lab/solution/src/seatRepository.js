export class SeatRepository {
  constructor() {
    /** @type {Map<string, { seatId: string, eventId: string, holder: string | null }>} */
    this.seats = new Map();
    /** @type {Map<string, number>} userKey -> count */
    this.userCounts = new Map();
  }

  async seed(eventId, seatIds) {
    for (const seatId of seatIds) {
      this.seats.set(`${eventId}:${seatId}`, { seatId, eventId, holder: null });
    }
  }

  async reserve(eventId, seatId, userId, maxPerUser) {
    const key = `${eventId}:${seatId}`;
    const seat = this.seats.get(key);
    if (!seat) return { ok: false, reason: 'SEAT_NOT_FOUND' };
    if (seat.holder) return { ok: false, reason: 'SEAT_TAKEN' };

    const userKey = `${eventId}:${userId}`;
    const count = this.userCounts.get(userKey) ?? 0;
    if (count >= maxPerUser) return { ok: false, reason: 'MAX_PER_USER' };

    seat.holder = userId;
    this.userCounts.set(userKey, count + 1);
    return { ok: true };
  }

  async release(eventId, seatId, userId) {
    const key = `${eventId}:${seatId}`;
    const seat = this.seats.get(key);
    if (!seat || seat.holder !== userId) return false;
    seat.holder = null;
    const userKey = `${eventId}:${userId}`;
    const count = this.userCounts.get(userKey) ?? 0;
    this.userCounts.set(userKey, Math.max(0, count - 1));
    return true;
  }

  async getSeat(eventId, seatId) {
    return this.seats.get(`${eventId}:${seatId}`) ?? null;
  }
}
