/**
 * Fixture helpers — สร้างผู้ใช้เฉพาะรัน และ teardown
 */

let seq = 0;

export function uniqueEmail(prefix = 'user') {
  seq += 1;
  return `${prefix}.${Date.now()}.${seq}@example.test`;
}

/**
 * @param {{ createUser: (u: { email: string, password: string }) => Promise<{ id: string }>, deleteUser: (id: string) => Promise<void> }} api
 */
export async function withUser(api, run) {
  const email = uniqueEmail('e2e');
  const password = 'Secret1x';
  const user = await api.createUser({ email, password });
  try {
    await run({ ...user, email, password });
  } finally {
    await api.deleteUser(user.id);
  }
}
