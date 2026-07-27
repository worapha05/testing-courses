import { useEffect, useState } from 'react';
import type { User } from '../mocks/handlers';

export function UserList() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/users');
        if (!res.ok) {
          throw new Error(`Failed with ${res.status}`);
        }
        const data = (await res.json()) as User[];
        if (!cancelled) setUsers(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setUsers(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p role="status">Loading users…</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!users?.length) {
    return <p>No users found</p>;
  }

  return (
    <section>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <span>{user.name}</span>
            <span> — {user.role}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
