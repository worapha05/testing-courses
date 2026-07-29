export function formatBillingStatus(status, detail) {
  if (status === 'ok') return 'Billing OK';
  return detail ? `Billing error: ${detail}` : 'Billing error';
}
