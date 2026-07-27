export class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  async addItem(sku) {
    await this.page.click(`[data-sku="${sku}"] [data-action="add"]`);
  }

  async pay() {
    await this.page.click('[data-testid="pay-now"]');
  }

  /**
   * แนวทางที่ถูกต้อง — รอเงื่อนไข ไม่ sleep ตายตัว
   */
  async waitForConfirmation({ timeoutMs = 2000 } = {}) {
    return this.page.waitForText('Order confirmed', { timeoutMs });
  }
}
