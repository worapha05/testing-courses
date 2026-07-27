import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { withUser, uniqueEmail } from '../fixtures/users.js';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';

/** Fake browser + API เพื่อสาธิตโครงสร้างโดยไม่ต้องติด browser จริง */
function createFakeApp() {
  const users = new Map();
  let session = null;
  let lastError = '';

  const api = {
    async createUser({ email, password }) {
      const id = `id-${users.size + 1}`;
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
      page._fields = page._fields || {};
      page._fields[sel] = value;
    },
    async click(sel) {
      if (sel.includes('submit')) {
        const email = page._fields['#email'];
        const password = page._fields['#password'];
        const user = users.get(email);
        if (!user || user.password !== password) {
          session = null;
          lastError = 'Invalid credentials';
          return;
        }
        session = user;
        lastError = '';
      }
      if (sel.includes('logout')) {
        session = null;
      }
    },
    async textContent(sel) {
      if (sel.includes('login-error')) return lastError;
      if (sel.includes('dashboard-heading')) {
        return session ? `Welcome ${session.email}` : '';
      }
      return '';
    },
  };

  return { api, page };
}

describe('E2E POM structure', () => {
  it('logs in with seeded unique user and cleans up', async () => {
    const { api, page } = createFakeApp();
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    await withUser(api, async (user) => {
      await login.open();
      await login.loginAs(user.email, user.password);
      assert.equal(await dashboard.headingText(), `Welcome ${user.email}`);
    });
  });

  it('shows error on invalid credentials', async () => {
    const { page } = createFakeApp();
    const login = new LoginPage(page);
    await login.open();
    await login.loginAs(uniqueEmail('nope'), 'wrong');
    assert.equal(await login.errorMessage(), 'Invalid credentials');
  });
});
