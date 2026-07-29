/**
 * จำลอง Dependency Graph ของ Module Bundler
 * รัน: node dependency-graph.js
 */

const modules = {
  'src/index.js': ['src/app.js', 'src/styles.css'],
  'src/app.js': ['src/utils/math.js', 'src/api/client.js'],
  'src/utils/math.js': [],
  'src/api/client.js': ['node_modules/tiny-http/index.js'],
  'src/styles.css': [],
  'node_modules/tiny-http/index.js': [],
};

function buildGraph(entry) {
  const visited = new Set();
  const order = [];

  function walk(id) {
    if (visited.has(id)) return;
    visited.add(id);
    for (const dep of modules[id] ?? []) {
      walk(dep);
    }
    order.push(id);
  }

  walk(entry);
  return { visited: [...visited], emitOrder: order };
}

const entry = 'src/index.js';
const { visited, emitOrder } = buildGraph(entry);

console.log('=== Dependency Graph (conceptual) ===');
console.log('Entry:', entry);
console.log('\nModules discovered:');
visited.forEach((m) => console.log(' -', m));
console.log('\nEmit order (dependencies first):');
emitOrder.forEach((m, i) => console.log(` ${i + 1}. ${m}`));
console.log('\nWebpack จะ bundle ตาม graph นี้; Vite dev จะเสิร์ฟเป็น ESM on-demand');
