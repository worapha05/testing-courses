let seq = 0;

export function uniqueEmail(prefix = 'nova') {
  seq += 1;
  return `${prefix}.${Date.now()}.${seq}@novashop.test`;
}

export async function withUser(api, run) {
  const email = uniqueEmail();
  const password = 'Secret1x';
  const user = await api.createUser({ email, password });
  try {
    await run({ ...user, email, password });
  } finally {
    await api.deleteUser(user.id);
  }
}
