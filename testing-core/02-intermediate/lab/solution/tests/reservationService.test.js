import { describe, expect, it, vi } from 'vitest';
import { ReservationService } from '../src/reservationService.js';
import { SeatRepository } from '../src/seatRepository.js';

describe('ReservationService doubles', () => {
  it('stubs payment success', async () => {
    const seats = new SeatRepository();
    await seats.seed('evt-1', ['A1']);

    const payments = {
      charge: async () => ({ txnId: 'pay-1' }),
    };

    const service = new ReservationService(seats, payments);
    const result = await service.reserveAndPay({
      eventId: 'evt-1',
      seatId: 'A1',
      userId: 'u-1',
      amount: 1500,
    });

    expect(result).toEqual({ status: 'CONFIRMED', txnId: 'pay-1' });
  });

  it('spies release on payment failure (compensating action)', async () => {
    const seats = new SeatRepository();
    await seats.seed('evt-1', ['A1']);
    const releaseSpy = vi.spyOn(seats, 'release');

    const payments = {
      charge: vi.fn(async () => {
        throw new Error('declined');
      }),
    };

    const service = new ReservationService(seats, payments);
    const result = await service.reserveAndPay({
      eventId: 'evt-1',
      seatId: 'A1',
      userId: 'u-1',
      amount: 1500,
    });

    expect(result).toEqual({ status: 'FAILED', reason: 'PAYMENT_FAILED' });
    expect(payments.charge).toHaveBeenCalledOnce();
    expect(releaseSpy).toHaveBeenCalledWith('evt-1', 'A1', 'u-1');

    const seat = await seats.getSeat('evt-1', 'A1');
    expect(seat.holder).toBeNull();
  });

  it('uses fake repository state for maxPerUser', async () => {
    const seats = new SeatRepository();
    await seats.seed('evt-1', ['A1', 'A2', 'A3']);
    const payments = { charge: async () => ({ txnId: 'ok' }) };
    const service = new ReservationService(seats, payments, 2);

    await service.reserveAndPay({ eventId: 'evt-1', seatId: 'A1', userId: 'u-1', amount: 1 });
    await service.reserveAndPay({ eventId: 'evt-1', seatId: 'A2', userId: 'u-1', amount: 1 });
    const third = await service.reserveAndPay({
      eventId: 'evt-1',
      seatId: 'A3',
      userId: 'u-1',
      amount: 1,
    });

    expect(third).toEqual({ status: 'REJECTED', reason: 'MAX_PER_USER' });
  });
});
