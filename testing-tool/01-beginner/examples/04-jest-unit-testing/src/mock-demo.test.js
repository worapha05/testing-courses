import { createNotifier } from './notifier.js';

describe('createNotifier', () => {
  it('calls sendEmail with email and message', async () => {
    const sendEmail = jest.fn().mockResolvedValue({ ok: true });
    const logger = { info: jest.fn() };
    const notifier = createNotifier({ sendEmail, logger });

    await expect(notifier.notify({ email: 'ada@example.com' }, 'Welcome')).resolves.toEqual({
      ok: true,
    });

    expect(sendEmail).toHaveBeenCalledWith('ada@example.com', 'Welcome');
    expect(logger.info).toHaveBeenCalledWith('notified ada@example.com');
  });

  it('throws when email is missing', async () => {
    const sendEmail = jest.fn();
    const notifier = createNotifier({ sendEmail });
    await expect(notifier.notify({}, 'Hi')).rejects.toThrow(/email is required/i);
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
