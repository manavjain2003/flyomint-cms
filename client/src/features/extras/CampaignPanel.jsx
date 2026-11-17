import React, { useState } from 'react';
import { apiClient } from '../../services/apiClient.js';

/** Sends an offer email to all active newsletter subscribers. */
export default function CampaignPanel() {
  const [form, setForm] = useState({ subject: '', html: '' });
  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);

  const send = async () => {
    if (!window.confirm('Send this email to all active subscribers?')) return;
    setBusy(true);
    setResult('');
    try {
      const { sent, failed, total } = await apiClient.post('/admin/subscribers/send-campaign', form);
      setResult(`Sent to ${sent} of ${total} subscribers${failed ? ` (${failed} failed)` : ''}.`);
    } catch (error) {
      setResult(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card space-y-3">
      <h2 className="text-sm font-semibold">Send an offer email to all subscribers</h2>
      <input className="form-input" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
      <textarea className="form-input font-mono text-xs" rows={5} placeholder="Message (HTML allowed). An unsubscribe link is added automatically."
        value={form.html} onChange={(e) => setForm({ ...form, html: e.target.value })} />
      <div className="flex items-center gap-3">
        <button className="btn-primary" disabled={busy || !form.subject || !form.html} onClick={send}>{busy ? 'Sending…' : 'Send email'}</button>
        {result && <span className="text-sm">{result}</span>}
      </div>
    </section>
  );
}
