import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService.js';
import AuthLayout from './AuthLayout.jsx';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      setMessage((await authService.forgotPassword(email)).message);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout title="Forgot password">
      <form onSubmit={submit} className="space-y-4">
        <input className="form-input" type="email" placeholder="Your registered email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        {message && <p className="text-sm text-brand">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary w-full">Send reset link</button>
        <Link to="/login" className="block text-center text-sm text-brand underline">Back to sign in</Link>
      </form>
    </AuthLayout>
  );
}
