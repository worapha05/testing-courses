import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createNovaShopApp } from '../fixtures/app.js';
import { withUser } from '../fixtures/users.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { LoginPage } from '../pages/LoginPage.js';

describe('NovaShop checkout journey (POM)', () => {
  it('logs in, pays, and waits for confirmation', async () => {
    const { api, page } = createNovaShopApp({ confirmDelayMs: 50 });
    const login = new LoginPage(page);
    const checkout = new CheckoutPage(page);

    await withUser(api, async (user) => {
      await login.open();
      await login.loginAs(user.email, user.password);
      await checkout.addItem('SKU-1');
      await checkout.pay();
      const text = await checkout.waitForConfirmation();
      assert.equal(text, 'Order confirmed');
    });
  });
});
