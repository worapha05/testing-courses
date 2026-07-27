import { add, multiply } from './math.js';
import { loadAdminPanel } from './lazy-route.js';

console.log('sum', add(1, 2));
console.log('product', multiply(3, 4));

loadAdminPanel().then((html) => {
  console.log('admin chunk loaded', html);
});
