export class ReservationService {
  /**
   * @param {import('./seatRepository.js').SeatRepository} seats
   * @param {{ charge: (p: { userId: string, amount: number }) => Promise<{ txnId: string }> }} payments
   * @param {number} maxPerUser
   */
  constructor(seats, payments, maxPerUser = 2) {
    this.seats = seats;
    this.payments = payments;
    this.maxPerUser = maxPerUser;
  }

  async reserveAndPay({ eventId, seatId, userId, amount }) {
    const reserved = await this.seats.reserve(eventId, seatId, userId, this.maxPerUser);
    if (!reserved.ok) {
      return { status: 'REJECTED', reason: reserved.reason };
    }

    try {
      const payment = await this.payments.charge({ userId, amount });
      return { status: 'CONFIRMED', txnId: payment.txnId };
    } catch {
      await this.seats.release(eventId, seatId, userId);
      return { status: 'FAILED', reason: 'PAYMENT_FAILED' };
    }
  }
}
