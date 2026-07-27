/**
 * Page Object — Login
 * ใน project จริงจะห่อ Playwright Page; ที่นี่ใช้ port บาง ๆ เพื่อสาธิตโครงสร้าง
 */
export class LoginPage {
  /**
   * @param {{ goto: (url: string) => Promise<void>, fill: (sel: string, v: string) => Promise<void>, click: (sel: string) => Promise<void>, textContent: (sel: string) => Promise<string> }} page
   */
  constructor(page) {
    this.page = page;
    this.url = '/login';
    this.email = '#email';
    this.password = '#password';
    this.submit = 'button[type="submit"]';
    this.error = '[data-testid="login-error"]';
  }

  async open() {
    await this.page.goto(this.url);
  }

  async loginAs(email, password) {
    await this.page.fill(this.email, email);
    await this.page.fill(this.password, password);
    await this.page.click(this.submit);
  }

  async errorMessage() {
    return this.page.textContent(this.error);
  }
}
