import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { FormEvent, ReactNode, useState } from 'react';

function readSession() {
  return window.localStorage.getItem('forge_session');
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const next = params.get('next') || '/dashboard';
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') || '');
    const password = String(data.get('password') || '');

    if (email === 'ada@example.com' && password === 'secret') {
      window.localStorage.setItem('forge_session', JSON.stringify({ email, role: 'admin' }));
      navigate(next);
      return;
    }
    setError('Invalid credentials');
  }

  return (
    <main>
      <h1>ForgeDesk Login</h1>
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

function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  if (!readSession()) {
    const next = encodeURIComponent(location.pathname);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return children;
}

function Dashboard() {
  const session = JSON.parse(readSession() || '{}') as { email?: string };
  return (
    <main>
      <h1>Dashboard</h1>
      <p data-cy="welcome">Welcome, {session.email}</p>
    </main>
  );
}

function Admin() {
  return (
    <main>
      <h1>Admin Panel</h1>
      <p>Secret metrics</p>
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
        path="/admin"
        element={
          <RequireAuth>
            <Admin />
          </RequireAuth>
        }
      />
    </Routes>
  );
}
