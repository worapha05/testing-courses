export function createCheckoutNotifier({ sendEmail }) {
  return {
    async notify(order) {
      if (!order?.email) {
        throw new Error('email is required');
      }
      return sendEmail(order.email, `Order ${order.id}`);
    },
  };
}
