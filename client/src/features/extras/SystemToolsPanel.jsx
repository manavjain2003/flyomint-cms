import React, { useState } from 'react';
import { apiClient } from '../../services/apiClient.js';

/** Data backup and cache clearing. */
export default function SystemToolsPanel() {
  const [message, setMessage] = useState('');

  const run = async (action) => {
    setMessage('');
    try { setMessage((await action()) ?? ''); } catch (error) { setMessage(error.message); }
  };

  return (
    <section className="panel space-y-3">
      <h2 className="text-base font-bold">System tools</h2>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn-secondary" onClick={() => run(() => apiClient.download('/admin/system/backup', 'cms-backup.json'))}>
          Download data backup
        </button>
        <button type="button" className="btn-secondary" onClick={() => run(async () => (await apiClient.post('/admin/system/clear-cache')).message)}>
          Clear cache
        </button>
        {message && <span className="text-sm text-brand">{message}</span>}
      </div>
    </section>
  );
}
