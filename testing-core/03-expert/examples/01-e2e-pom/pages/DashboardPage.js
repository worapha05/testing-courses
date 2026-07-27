export class DashboardPage {
  /**
   * @param {{ textContent: (sel: string) => Promise<string>, click: (sel: string) => Promise<void> }} page
   */
  constructor(page) {
    this.page = page;
    this.heading = '[data-testid="dashboard-heading"]';
    this.logout = '[data-testid="logout"]';
  }

  async headingText() {
    return this.page.textContent(this.heading);
  }

  async logout() {
    await this.page.click(this.logout);
  }
}
