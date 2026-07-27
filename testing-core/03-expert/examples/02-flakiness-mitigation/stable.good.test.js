import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createAsyncLabel } from './asyncUi.js';

describe('stable pattern (conditional wait)', () => {
  it('waits until Ready appears', async () => {
    const label = createAsyncLabel({ delayMs: 80, text: 'Ready' });
    const text = await label.waitForText('Ready', { timeoutMs: 500 });
    assert.equal(text, 'Ready');
  });
});
