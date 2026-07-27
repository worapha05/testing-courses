import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createAsyncLabel } from './asyncUi.js';

/**
 * ANTI-PATTERN: hardcoded sleep แล้วยืนยันผลทันที
 * รันด้วย: npm run test:bad (คาดว่าจะ FAIL)
 */
describe('flaky pattern (sleep)', () => {
  it('fails when sleep is shorter than async work', async () => {
    const label = createAsyncLabel({ delayMs: 80, text: 'Ready' });
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(label.getText(), 'Ready');
  });
});
