import assert from 'node:assert/strict';
import { ReservationService } from '../src/reservationService.js';
import { SeatRepository } from '../src/seatRepository.js';

export const world = {
  repo: null,
  lastResult: null,
  userId: null,
  eventId: null,
};

function reset() {
  world.repo = new SeatRepository();
  world.lastResult = null;
  world.userId = null;
  world.eventId = null;
}

export const steps = [
  {
    pattern: /^Given an event "([^"]+)" with available seat "([^"]+)"$/,
    async fn(match) {
      reset();
      world.eventId = match[1];
      await world.repo.seed(match[1], [match[2]]);
    },
  },
  {
    pattern: /^And a customer "([^"]+)"$/,
    fn(match) {
      world.userId = match[1];
    },
  },
  {
    pattern: /^When the customer reserves seat "([^"]+)" with successful payment of (\d+)$/,
    async fn(match) {
      const payments = { charge: async () => ({ txnId: 'txn-ok' }) };
      const service = new ReservationService(world.repo, payments);
      world.lastResult = await service.reserveAndPay({
        eventId: world.eventId,
        seatId: match[1],
        userId: world.userId,
        amount: Number(match[2]),
      });
    },
  },
  {
    pattern: /^When the customer reserves seat "([^"]+)" with failed payment of (\d+)$/,
    async fn(match) {
      const payments = {
        charge: async () => {
          throw new Error('declined');
        },
      };
      const service = new ReservationService(world.repo, payments);
      world.lastResult = await service.reserveAndPay({
        eventId: world.eventId,
        seatId: match[1],
        userId: world.userId,
        amount: Number(match[2]),
      });
    },
  },
  {
    pattern: /^Then the reservation status should be "([^"]+)"$/,
    fn(match) {
      assert.equal(world.lastResult.status, match[1]);
    },
  },
  {
    pattern: /^And seat "([^"]+)" should be held by "([^"]+)"$/,
    async fn(match) {
      const seat = await world.repo.getSeat(world.eventId, match[1]);
      assert.equal(seat.holder, match[2]);
    },
  },
  {
    pattern: /^And seat "([^"]+)" should be available$/,
    async fn(match) {
      const seat = await world.repo.getSeat(world.eventId, match[1]);
      assert.equal(seat.holder, null);
    },
  },
];
