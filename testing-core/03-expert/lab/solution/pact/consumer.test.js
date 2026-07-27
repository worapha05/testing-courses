import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createOrderContract, isNonEmptyString } from './contract.js';

describe('Consumer contract checkout-web', () => {
  it('defines expected create-order response shape', () => {
    const mockFromPactServer = { status: 201, body: { id: 'ord-1', status: 'CREATED' } };
    const expected = createOrderContract.interaction.response;

    assert.equal(mockFromPactServer.status, expected.status);
    assert.equal(isNonEmptyString(mockFromPactServer.body.id), true);
    assert.equal(mockFromPactServer.body.status, 'CREATED');
  });
});
