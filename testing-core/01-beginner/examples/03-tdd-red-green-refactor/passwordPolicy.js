/**
 * ผลลัพธ์หลัง Red → Green → Refactor
 * กฎถูกแยกเป็นรายการที่อ่านง่าย (refactor) โดยพฤติกรรมเดิมยังถูกเทสค้ำไว้
 */

const rules = [
  {
    id: 'MIN_LENGTH',
    test: (password) => password.length >= 8,
    message: 'Password must be at least 8 characters',
  },
  {
    id: 'HAS_DIGIT',
    test: (password) => /\d/.test(password),
    message: 'Password must contain at least one digit',
  },
  {
    id: 'HAS_UPPER',
    test: (password) => /[A-Z]/.test(password),
    message: 'Password must contain an uppercase letter',
  },
  {
    id: 'HAS_LOWER',
    test: (password) => /[a-z]/.test(password),
    message: 'Password must contain a lowercase letter',
  },
];

/**
 * @param {string} password
 * @returns {{ ok: true } | { ok: false, errors: string[] }}
 */
export function validatePassword(password) {
  if (typeof password !== 'string') {
    return { ok: false, errors: ['Password must be a string'] };
  }

  const errors = rules.filter((rule) => !rule.test(password)).map((rule) => rule.message);
  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}
