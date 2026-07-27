import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { matchesContractBody, orderCreatedContract } from '../consumer/contract.js';
import { createOrderHandler } from './orderApi.js';

/**
 * Provider verification: ยิง request ตาม contract แล้วเทียบ response จริง
 */
describe('Provider verification — order-api', () => {
  it('satisfies checkout-web contract for create order', () => {
    const interaction = orderCreatedContract.interactions[0];
    const actual = createOrderHandler(interaction.request.body);

    assert.equal(actual.status, interaction.response.status);
    assert.equal(matchesContractBody(actual.body, interaction.response.body), true);
  });
});
