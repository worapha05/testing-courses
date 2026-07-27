export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

/** dead export — tree shaking ควรตัดออกถ้าไม่มีใคร import */
export function unusedHelper() {
  return 'unused';
}
