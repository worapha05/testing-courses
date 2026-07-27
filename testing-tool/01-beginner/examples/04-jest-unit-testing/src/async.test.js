import { delay, fetchUser, schedule } from './async.js';

describe('delay', () => {
  it('resolves after the given time', async () => {
    jest.useFakeTimers();
    const promise = delay(500);
    jest.advanceTimersByTime(500);
    await expect(promise).resolves.toBeUndefined();
    jest.useRealTimers();
  });
});

describe('fetchUser', () => {
  it('returns user json when response is ok', async () => {
    const httpGet = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: '1', name: 'Ada' }),
    });

    await expect(fetchUser('1', { httpGet })).resolves.toEqual({
      id: '1',
      name: 'Ada',
    });
    expect(httpGet).toHaveBeenCalledWith('/api/users/1');
  });

  it('rejects when response is not ok', async () => {
    const httpGet = jest.fn().mockResolvedValue({ ok: false });
    await expect(fetchUser('missing', { httpGet })).rejects.toThrow(/not found/i);
  });
});

describe('schedule', () => {
  it('invokes callback after delay using fake timers', () => {
    jest.useFakeTimers();
    const spy = jest.fn();
    schedule(spy, 1000);
    expect(spy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(spy).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});
