import React, { useState } from 'react';
import { apiClient } from '../../services/apiClient.js';

/** "Test email" option: sends the saved template with sample values. */
export default function TemplateTestPanel({ id }) {
  const [to, setTo] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!id || id === 'new') return null;

  const send = async () => {
    setBusy(true);
    try {
      setResult(await apiClient.post(`/admin/templates/${id}/test`, { to }));
    } catch (error) {
      setResult({ sent: false, reason: error.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel space-y-3">
      <h2 className="text-base font-bold">Test email</h2>
      <p className="text-xs text-slate-500">Save the template first, then send it with sample customer details.</p>
      <div className="flex gap-2">
        <input className="form-input" type="email" placeholder="your@email.com" value={to} onChange={(e) => setTo(e.target.value)} />
        <button type="button" className="btn-secondary" disabled={busy} onClick={send}>{busy ? 'Sending…' : 'Send test'}</button>
      </div>
      {result && (
        <div className="text-sm">
          <p className={result.sent ? 'text-brand' : 'text-red-600'}>{result.sent ? 'Test email sent.' : result.reason}</p>
          {result.preview && <div className="mt-2 rounded border bg-slate-50 p-3" dangerouslySetInnerHTML={{ __html: result.preview }} />}
        </div>
      )}
    </section>
  );
}
