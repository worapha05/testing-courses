import { add, multiply } from './math.js';

describe('math', () => {
  it('adds', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('multiplies', () => {
    expect(multiply(2, 4)).toBe(8);
  });
});
