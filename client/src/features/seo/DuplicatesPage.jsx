import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/apiClient.js';

/** Pages that share the same meta title or description. Fix them so each page is unique. */
export default function DuplicatesPage() {
  const [groups, setGroups] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get('/admin/seo/duplicates').then(setGroups).catch((err) => setError(err.message));
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Duplicate content</h1>
        <p className="text-sm text-slate-500">Pages sharing the same meta title or meta description compete with each other in search results.</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {groups?.length === 0 && <p className="card text-sm text-brand">No duplicates found. Every page has unique SEO text.</p>}
      {groups?.map((group) => (
        <section key={`${group.resource}-${group.field}-${group.value}`} className="card">
          <p className="text-xs uppercase text-slate-500">{group.resource} · {group.field}</p>
          <p className="font-medium">{group.value}</p>
          <p className="text-sm text-slate-600">Used by {group.items.length} items: {group.items.map((item) => item.title).join(', ')}</p>
        </section>
      ))}
    </div>
  );
}
