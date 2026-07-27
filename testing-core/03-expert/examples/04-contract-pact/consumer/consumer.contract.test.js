import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { matchesContractBody, orderCreatedContract } from './contract.js';

/**
 * Consumer test: กำหนดว่า client คาดหวัง response แบบใด
 * (จำลองว่าเรียก mock provider ตาม contract)
 */
describe('Consumer contract — checkout-web → order-api', () => {
  it('expects 201 with id and CREATED status', () => {
    const interaction = orderCreatedContract.interactions[0];

    // จำลอง response จาก mock server ตามสัญญา
    const mockResponse = {
      status: 201,
      body: { id: 'ord-123', status: 'CREATED' },
    };

    assert.equal(mockResponse.status, interaction.response.status);
    assert.equal(matchesContractBody(mockResponse.body, interaction.response.body), true);
  });
});
