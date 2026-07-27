/**
 * OrderService พึ่ง PaymentGateway และ Inventory — inject เพื่อ isolate ได้
 */

export class OrderService {
  /**
   * @param {{ charge: (p: { orderId: string, amount: number }) => Promise<{ txnId: string }> }} paymentGateway
   * @param {{ reserve: (sku: string, qty: number) => Promise<boolean>, release: (sku: string, qty: number) => Promise<void> }} inventory
   * @param {{ info: (msg: string, meta?: object) => void }} logger
   */
  constructor(paymentGateway, inventory, logger) {
    this.paymentGateway = paymentGateway;
    this.inventory = inventory;
    this.logger = logger;
  }

  /**
   * @param {{ orderId: string, sku: string, qty: number, amount: number }} order
   */
  async placeOrder(order) {
    const reserved = await this.inventory.reserve(order.sku, order.qty);
    if (!reserved) {
      return { status: 'REJECTED', reason: 'OUT_OF_STOCK' };
    }

    try {
      const payment = await this.paymentGateway.charge({
        orderId: order.orderId,
        amount: order.amount,
      });
      this.logger.info('order_paid', { orderId: order.orderId, txnId: payment.txnId });
      return { status: 'PAID', txnId: payment.txnId };
    } catch (error) {
      await this.inventory.release(order.sku, order.qty);
      this.logger.info('order_payment_failed', { orderId: order.orderId });
      return { status: 'FAILED', reason: 'PAYMENT_FAILED' };
    }
  }
}
