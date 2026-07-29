import { FormEvent, useState } from 'react';

type InviteFormProps = {
  onInvite: (email: string) => Promise<void>;
};

export function InviteForm({ onInvite }: InviteFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setDone(false);

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setSending(true);
    try {
      await onInvite(email);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invite failed');
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Invite form">
      <label htmlFor="invite-email">Email</label>
      <input
        id="invite-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error ? <p role="alert">{error}</p> : null}
      {done ? <p role="status">Invite sent</p> : null}
      <button type="submit" disabled={sending}>
        {sending ? 'Sending…' : 'Send invite'}
      </button>
    </form>
  );
}
