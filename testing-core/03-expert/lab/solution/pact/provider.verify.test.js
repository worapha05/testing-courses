import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createOrderContract, isNonEmptyString, providerCreateOrder } from './contract.js';

describe('Provider verification order-api', () => {
  it('honors checkout-web create-order contract', () => {
    const { request, response } = createOrderContract.interaction;
    const actual = providerCreateOrder(request.body);

    assert.equal(actual.status, response.status);
    assert.equal(isNonEmptyString(actual.body.id), true);
    assert.equal(actual.body.status, 'CREATED');
  });
});
