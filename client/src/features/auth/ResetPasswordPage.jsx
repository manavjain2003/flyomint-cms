import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService.js';
import AuthLayout from './AuthLayout.jsx';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      setMessage((await authService.resetPassword(params.get('token'), password)).message);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout title="Choose a new password">
      <form onSubmit={submit} className="space-y-4">
        <input className="form-input" type="password" minLength={8} placeholder="New password (min. 8 characters)" required
          value={password} onChange={(e) => setPassword(e.target.value)} />
        {message && <p className="text-sm text-brand">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!message && <button className="btn-primary w-full">Update password</button>}
        <Link to="/login" className="block text-center text-sm text-brand underline">Back to sign in</Link>
      </form>
    </AuthLayout>
  );
}
