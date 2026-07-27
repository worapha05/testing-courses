import { useEffect, useState } from 'react';
import type { Member } from '../mocks/handlers';
import { MemberCard } from './MemberCard';

export function MemberDirectory() {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/members');
        if (!res.ok) {
          throw new Error(`Failed with ${res.status}`);
        }
        const data = (await res.json()) as Member[];
        if (!cancelled) setMembers(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
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

  if (loading) return <p role="status">Loading members…</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!members?.length) return <p>No members yet</p>;

  return (
    <section>
      <h1>Directory</h1>
      {members.map((m) => (
        <MemberCard key={m.id} name={m.name} role={m.role} status={m.status} />
      ))}
    </section>
  );
}
