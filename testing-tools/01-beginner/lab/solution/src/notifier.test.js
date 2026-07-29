import { createCheckoutNotifier } from './notifier.js';

describe('createCheckoutNotifier', () => {
  it('sends email with order subject', async () => {
    const sendEmail = jest.fn().mockResolvedValue({ ok: true });
    const notifier = createCheckoutNotifier({ sendEmail });

    await expect(notifier.notify({ id: 'ORD-1', email: 'buyer@shop.test' })).resolves.toEqual({
      ok: true,
    });

    expect(sendEmail).toHaveBeenCalledWith('buyer@shop.test', 'Order ORD-1');
  });

  it('throws when email is missing', async () => {
    const sendEmail = jest.fn();
    const notifier = createCheckoutNotifier({ sendEmail });
    await expect(notifier.notify({ id: 'ORD-2' })).rejects.toThrow(/email is required/i);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('propagates sendEmail rejection', async () => {
    const sendEmail = jest.fn().mockRejectedValue(new Error('SMTP down'));
    const notifier = createCheckoutNotifier({ sendEmail });
    await expect(notifier.notify({ id: 'ORD-3', email: 'a@b.com' })).rejects.toThrow(/SMTP down/);
  });
});
