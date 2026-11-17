import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import AuthLayout from './AuthLayout.jsx';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(form.username, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Sign in to the CMS">
      <form onSubmit={submit} className="space-y-4">
        <input className="form-input" placeholder="Username or email" required value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input className="form-input" type="password" placeholder="Password" required value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <Link to="/forgot-password" className="block text-center text-sm text-brand underline">Forgot password?</Link>
      </form>
    </AuthLayout>
  );
}
