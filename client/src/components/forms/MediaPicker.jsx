import React, { useState } from 'react';
import { useResourceList } from '../../hooks/useResourceList.js';

const FOLDERS = ['', 'banners', 'airlines', 'blogs', 'offers', 'general'];

/** Modal that lets the admin reuse an image that is already in the media library. */
export default function MediaPicker({ onPick, onClose }) {
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('');
  const { items, loading } = useResourceList('media', { search, folder, limit: 60 });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h3 className="mr-auto font-semibold">Media library</h3>
          <input className="form-input w-48" placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="form-input w-40" value={folder} onChange={(e) => setFolder(e.target.value)}>
            {FOLDERS.map((name) => <option key={name} value={name}>{name || 'All folders'}</option>)}
          </select>
          <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
        </div>

        {loading && <p className="text-sm text-slate-500">Loading…</p>}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {items.map((media) => (
            <button key={media.id} type="button" onClick={() => onPick(media)}
              className="overflow-hidden rounded-md border text-left hover:border-brand">
              <img src={media.url} alt={media.alt || ''} className="h-24 w-full object-cover" />
              <span className="block truncate px-2 py-1 text-xs">{media.name}</span>
            </button>
          ))}
        </div>
        {!loading && items.length === 0 && <p className="text-sm text-slate-500">No images found.</p>}
      </div>
    </div>
  );
}
