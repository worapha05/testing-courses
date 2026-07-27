import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';

function LoginPage() {
  const navigate = useNavigate();
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.get('email'),
        password: data.get('password'),
      }),
    });
    const body = await res.json();
    window.localStorage.setItem('session', JSON.stringify(body));
    navigate('/profile');
  }

  return (
    <form onSubmit={onSubmit} aria-label="Login form">
      <h1>Login</h1>
      <input data-cy="email" name="email" placeholder="Email" />
      <input data-cy="password" name="password" type="password" placeholder="Password" />
      <button data-cy="submit" type="submit">
        Sign in
      </button>
    </form>
  );
}

function ProfilePage() {
  const [me, setMe] = useState<{ email?: string; permissions?: string[] } | null>(null);
  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then(setMe);
  }, []);
  if (!me) return <p>Loading…</p>;
  return (
    <main>
      <h1>Profile</h1>
      <p>{me.email}</p>
      <ul>
        {(me.permissions || []).map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </main>
  );
}

function BillingPage() {
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch('/api/billing')
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json();
          throw new Error(body.message || 'Error');
        }
      })
      .catch((err) => setError(err.message));
  }, []);
  return (
    <main>
      <h1>Billing</h1>
      {error ? <p role="alert">{error}</p> : <p>OK</p>}
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/billing" element={<BillingPage />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
