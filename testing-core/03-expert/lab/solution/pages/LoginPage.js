export class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.goto('/login');
  }

  async loginAs(email, password) {
    await this.page.fill('#email', email);
    await this.page.fill('#password', password);
    await this.page.click('button[type="submit"]');
  }
}
