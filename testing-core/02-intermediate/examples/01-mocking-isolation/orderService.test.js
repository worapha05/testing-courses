import { describe, expect, it, vi } from 'vitest';
import { OrderService } from './orderService.js';

describe('OrderService with test doubles', () => {
  it('uses stubs to return canned inventory/payment results', async () => {
    // Stub — คืนค่าที่กำหนด ไม่สนใจ interaction ลึก
    const paymentGateway = {
      charge: async () => ({ txnId: 'txn-stub-1' }),
    };
    const inventory = {
      reserve: async () => true,
      release: async () => {},
    };
    const logger = { info: () => {} };

    const service = new OrderService(paymentGateway, inventory, logger);
    const result = await service.placeOrder({
      orderId: 'o-1',
      sku: 'SKU-1',
      qty: 1,
      amount: 100,
    });

    expect(result).toEqual({ status: 'PAID', txnId: 'txn-stub-1' });
  });

  it('uses mocks/spies to verify collaboration on payment failure', async () => {
    const paymentGateway = {
      charge: vi.fn(async () => {
        throw new Error('card_declined');
      }),
    };
    const inventory = {
      reserve: vi.fn(async () => true),
      release: vi.fn(async () => {}),
    };
    const logger = { info: vi.fn() };

    const service = new OrderService(paymentGateway, inventory, logger);
    const result = await service.placeOrder({
      orderId: 'o-2',
      sku: 'SKU-9',
      qty: 2,
      amount: 250,
    });

    expect(result).toEqual({ status: 'FAILED', reason: 'PAYMENT_FAILED' });
    expect(inventory.reserve).toHaveBeenCalledWith('SKU-9', 2);
    expect(paymentGateway.charge).toHaveBeenCalledOnce();
    expect(inventory.release).toHaveBeenCalledWith('SKU-9', 2);
    expect(logger.info).toHaveBeenCalledWith('order_payment_failed', { orderId: 'o-2' });
  });

  it('uses a Fake inventory that keeps real in-memory state', async () => {
    // Fake — implementation เบา ๆ ที่พฤติกรรมใกล้ของจริง
    const stock = new Map([['SKU-FAKE', 1]]);
    const fakeInventory = {
      async reserve(sku, qty) {
        const available = stock.get(sku) ?? 0;
        if (available < qty) return false;
        stock.set(sku, available - qty);
        return true;
      },
      async release(sku, qty) {
        stock.set(sku, (stock.get(sku) ?? 0) + qty);
      },
    };

    const paymentGateway = {
      charge: async () => ({ txnId: 'txn-ok' }),
    };

    const service = new OrderService(paymentGateway, fakeInventory, { info: () => {} });

    const first = await service.placeOrder({
      orderId: 'o-3',
      sku: 'SKU-FAKE',
      qty: 1,
      amount: 10,
    });
    const second = await service.placeOrder({
      orderId: 'o-4',
      sku: 'SKU-FAKE',
      qty: 1,
      amount: 10,
    });

    expect(first.status).toBe('PAID');
    expect(second).toEqual({ status: 'REJECTED', reason: 'OUT_OF_STOCK' });
  });
});
