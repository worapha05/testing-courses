import { beforeEach, describe, expect, it } from 'vitest';
import { SeatRepository } from '../src/seatRepository.js';

describe('SeatRepository integration boundary', () => {
  /** @type {SeatRepository} */
  let repo;

  beforeEach(async () => {
    repo = new SeatRepository();
    await repo.seed('concert', ['B1', 'B2']);
  });

  it('persists holder after reserve and clears on release', async () => {
    const reserved = await repo.reserve('concert', 'B1', 'alice', 2);
    expect(reserved).toEqual({ ok: true });
    expect((await repo.getSeat('concert', 'B1')).holder).toBe('alice');

    const released = await repo.release('concert', 'B1', 'alice');
    expect(released).toBe(true);
    expect((await repo.getSeat('concert', 'B1')).holder).toBeNull();
  });

  it('prevents double booking the same seat', async () => {
    await repo.reserve('concert', 'B2', 'alice', 2);
    const second = await repo.reserve('concert', 'B2', 'bob', 2);
    expect(second).toEqual({ ok: false, reason: 'SEAT_TAKEN' });
  });
});
