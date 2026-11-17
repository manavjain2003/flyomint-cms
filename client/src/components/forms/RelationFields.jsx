import React, { useState } from 'react';
import { useRelationOptions } from '../../hooks/useRelationOptions.js';

const labelOf = (field, doc) => (field.optionLabel ? field.optionLabel(doc) : doc.name ?? doc.title);

/** Pick one document of another collection (e.g. a city). Stores its id. */
export function RelationSelect({ field, value, onChange, disabled }) {
  const options = useRelationOptions(field.collection);

  return (
    <select id={field.name} className="form-input" disabled={disabled} value={value || ''}
      onChange={(event) => onChange(event.target.value || null)}>
      <option value="">Select…</option>
      {options.map((doc) => <option key={doc.id} value={doc.id}>{labelOf(field, doc)}</option>)}
    </select>
  );
}

/** Pick several documents of another collection. Stores an array of ids. */
export function RelationMultiSelect({ field, value = [], onChange, disabled }) {
  const options = useRelationOptions(field.collection);
  const [filter, setFilter] = useState('');
  const visible = options.filter((doc) => labelOf(field, doc).toLowerCase().includes(filter.toLowerCase()));

  const toggle = (id) => onChange(value.includes(id) ? value.filter((item) => item !== id) : [...value, id]);

  return (
    <div className="rounded-md border border-slate-300 p-2">
      <input className="form-input mb-2" placeholder="Filter…" value={filter} onChange={(e) => setFilter(e.target.value)} />
      <div className="max-h-40 space-y-1 overflow-y-auto">
        {visible.map((doc) => (
          <label key={doc.id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" disabled={disabled} checked={value.includes(doc.id)} onChange={() => toggle(doc.id)} />
            {labelOf(field, doc)}
          </label>
        ))}
        {visible.length === 0 && <p className="text-xs text-slate-500">Nothing found.</p>}
      </div>
      <p className="mt-2 text-xs text-slate-500">{value.length} selected</p>
    </div>
  );
}
