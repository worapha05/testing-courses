import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { FormEvent, ReactNode, useEffect, useState } from 'react';

type Session = { email: string; role: 'admin' | 'member'; token: string };

function readSession(): Session | null {
  const raw = window.localStorage.getItem('forgegate_session');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  if (!readSession()) {
    const next = encodeURIComponent(location.pathname);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return children;
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const next = new URLSearchParams(location.search).get('next') || '/dashboard';
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') || '');
    const password = String(data.get('password') || '');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.message || 'Invalid credentials');
      return;
    }

    const body = (await res.json()) as Session;
    window.localStorage.setItem('forgegate_session', JSON.stringify(body));
    navigate(next);
  }

  return (
    <main>
      <h1>ForgeGate Login</h1>
      <form onSubmit={onSubmit} aria-label="Login form">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" data-cy="email" type="email" />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" data-cy="password" type="password" />
        {error ? <p role="alert">{error}</p> : null}
        <button type="submit" data-cy="submit">
          Sign in
        </button>
      </form>
    </main>
  );
}

function Dashboard() {
  const session = readSession();
  return (
    <main>
      <h1>Dashboard</h1>
      <p data-cy="welcome">Welcome, {session?.email}</p>
    </main>
  );
}

function Billing() {
  const [message, setMessage] = useState('Loading billing…');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/billing')
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(body.message || `Failed with ${res.status}`);
        }
        setMessage(body.message || 'Billing OK');
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <main>
      <h1>Billing</h1>
      {error ? <p role="alert">{error}</p> : <p data-cy="billing-status">{message}</p>}
    </main>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/billing"
        element={
          <RequireAuth>
            <Billing />
          </RequireAuth>
        }
      />
    </Routes>
  );
}
