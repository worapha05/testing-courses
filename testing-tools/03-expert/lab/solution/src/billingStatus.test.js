import { formatBillingStatus } from './billingStatus.js';

describe('formatBillingStatus', () => {
  it('returns OK label', () => {
    expect(formatBillingStatus('ok')).toBe('Billing OK');
  });

  it('returns error with detail', () => {
    expect(formatBillingStatus('error', 'timeout')).toBe('Billing error: timeout');
  });
});
