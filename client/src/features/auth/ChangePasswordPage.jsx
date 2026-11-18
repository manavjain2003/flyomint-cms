import React, { useState } from 'react';
import { authService } from '../../services/authService.js';

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await authService.changePassword(form.currentPassword, form.newPassword);
      setForm({ currentPassword: '', newPassword: '' });
      setFeedback({ type: 'success', message: 'Password changed' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  return (
    <form onSubmit={submit} className="panel max-w-md space-y-4">
      <h1 className="text-2xl font-extrabold">Change password</h1>
      <input className="form-input" type="password" placeholder="Current password" required value={form.currentPassword}
        onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
      <input className="form-input" type="password" minLength={8} placeholder="New password (min. 8 characters)" required value={form.newPassword}
        onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
      <div className="flex items-center gap-3">
        <button className="btn-primary">Update password</button>
        {feedback.message && <span className={`text-sm ${feedback.type === 'error' ? 'text-red-600' : 'text-brand'}`}>{feedback.message}</span>}
      </div>
    </form>
  );
}
