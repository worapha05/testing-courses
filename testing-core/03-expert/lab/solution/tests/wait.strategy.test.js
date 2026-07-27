import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createNovaShopApp } from '../fixtures/app.js';
import { withUser } from '../fixtures/users.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { LoginPage } from '../pages/LoginPage.js';

async function startPayment(confirmDelayMs) {
  const { api, page } = createNovaShopApp({ confirmDelayMs });
  const login = new LoginPage(page);
  const checkout = new CheckoutPage(page);
  await withUser(api, async (user) => {
    await login.loginAs(user.email, user.password);
    await checkout.addItem('SKU-1');
    await checkout.pay();
  });
  return page;
}

describe('wait strategy — before vs after', () => {
  it('ANTI-PATTERN: short sleep misses confirmation', async () => {
    const page = await startPayment(80);
    await new Promise((r) => setTimeout(r, 20));
    assert.notEqual(page.getText(), 'Order confirmed');
  });

  it('STABLE: conditional wait catches confirmation', async () => {
    const page = await startPayment(80);
    const text = await page.waitForText('Order confirmed', { timeoutMs: 500 });
    assert.equal(text, 'Order confirmed');
  });
});
