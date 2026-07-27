type MemberCardProps = {
  name: string;
  role: 'admin' | 'member';
  status: 'active' | 'invited';
  onResend?: () => void;
};

export function MemberCard({ name, role, status, onResend }: MemberCardProps) {
  return (
    <article>
      <h2>{name}</h2>
      <p>
        Role: {role} · Status: {status}
      </p>
      {status === 'invited' ? (
        <button type="button" onClick={onResend}>
          Resend invite
        </button>
      ) : null}
    </article>
  );
}
