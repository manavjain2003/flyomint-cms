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
        <h1 className="text-2xl font-extrabold">Duplicate content</h1>
        <p className="text-sm text-slate-500">Pages sharing the same meta title or meta description compete with each other in search results.</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {groups?.length === 0 && <p className="panel text-sm font-semibold text-emerald-700">No duplicates found. Every page has unique SEO text.</p>}
      {groups?.map((group) => (
        <section key={`${group.resource}-${group.field}-${group.value}`} className="panel">
          <p className="flex items-center gap-2 text-xs text-slate-500"><span className="font-semibold capitalize">{group.resource}</span><span>{group.field}</span></p>
          <p className="font-medium">{group.value}</p>
          <p className="text-sm text-slate-600">Used by {group.items.length} items: {group.items.map((item) => item.title).join(', ')}</p>
        </section>
      ))}
    </div>
  );
}
