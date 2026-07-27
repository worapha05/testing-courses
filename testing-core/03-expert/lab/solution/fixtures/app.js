/**
 * Fake storefront สำหรับสาธิต POM + async confirmation
 */
export function createNovaShopApp({ confirmDelayMs = 40 } = {}) {
  const users = new Map();
  let session = null;
  let cart = [];
  let banner = '';

  const api = {
    async createUser({ email, password }) {
      const id = `u-${users.size + 1}`;
      users.set(email, { id, email, password });
      return { id };
    },
    async deleteUser(id) {
      for (const [email, user] of users) {
        if (user.id === id) users.delete(email);
      }
    },
  };

  const page = {
    async goto() {},
    async fill(sel, value) {
      page._fields ??= {};
      page._fields[sel] = value;
    },
    async click(sel) {
      if (sel.includes('submit')) {
        const email = page._fields['#email'];
        const password = page._fields['#password'];
        const user = users.get(email);
        if (user && user.password === password) session = user;
      }
      if (sel.includes('data-action="add"')) {
        cart.push('SKU-1');
      }
      if (sel.includes('pay-now')) {
        banner = 'Processing';
        setTimeout(() => {
          banner = session && cart.length ? 'Order confirmed' : 'Payment failed';
        }, confirmDelayMs);
      }
    },
    getText() {
      return banner;
    },
    async waitForText(expected, { timeoutMs = 1000, pollMs = 10 } = {}) {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        if (banner === expected) return expected;
        await new Promise((r) => setTimeout(r, pollMs));
      }
      throw new Error(`Timeout waiting for "${expected}". Last: "${banner}"`);
    },
  };

  return { api, page };
}
