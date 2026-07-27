export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchUser(id, { httpGet } = {}) {
  const get = httpGet ?? globalThis.fetch;
  const res = await get(`/api/users/${id}`);
  if (!res.ok) {
    throw new Error(`User ${id} not found`);
  }
  return res.json();
}

export function schedule(callback, ms) {
  return setTimeout(callback, ms);
}
