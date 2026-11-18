import React, { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useResourceList } from '../../hooks/useResourceList.js';
import { uploadImage } from '../../services/cloudinaryService.js';
import Icon from '../../components/ui/Icon.jsx';
import { resourceService } from '../../services/resourceService.js';
import { useToast } from '../../context/ToastContext.jsx';

const FOLDERS = ['banners', 'airlines', 'blogs', 'offers', 'general'];

function MediaCard({ media, canDelete, onChanged }) {
  const [alt, setAlt] = useState(media.alt || '');

  const saveAlt = async () => {
    if (alt !== (media.alt || '')) await resourceService.update('media', media.id, { alt });
  };
  const remove = async () => {
    if (window.confirm('Delete this image? Pages that use it will show a broken image.')) {
      await resourceService.remove('media', media.id);
      onChanged();
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <img src={media.url} alt={alt} className="h-36 w-full bg-slate-100 object-cover" />
      <div className="space-y-2 p-3">
        <p className="truncate text-sm font-semibold" title={media.name}>{media.name}</p>
        <p className="flex flex-wrap items-center gap-x-3 text-xs text-slate-500">
          <span className="capitalize">{media.folder}</span><span>{media.width}×{media.height}</span><span>{Math.round((media.bytes || 0) / 1024)} KB</span>
        </p>
        <input className="form-input py-1.5 text-xs" placeholder="Alt text for search engines" aria-label="Alt text" value={alt} onChange={(e) => setAlt(e.target.value)} onBlur={saveAlt} />
        {canDelete && (
          <button className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline" onClick={remove}><Icon name="trash" className="h-3.5 w-3.5" />Delete</button>
        )}
      </div>
    </div>
  );
}

export default function MediaLibraryPage() {
  const { isAdmin } = useAuth();
  const inputRef = useRef(null);
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('');
  const [uploadFolder, setUploadFolder] = useState('general');
  const [status, setStatus] = useState('');
  const { items, loading, error, reload } = useResourceList('media', { search, folder, limit: 100 });

  const upload = async (event) => {
    const files = [...event.target.files];
    setStatus('');
    try {
      for (const [index, file] of files.entries()) {
        setStatus(`Uploading ${index + 1} of ${files.length}…`);
        await resourceService.create('media', await uploadImage(file, uploadFolder));
      }
      setStatus(`${files.length} image(s) uploaded`);
      reload();
    } catch (err) {
      setStatus(err.message);
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Media library</h1>
          <p className="text-sm text-slate-500">Images are compressed automatically. Add alt text for every image.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="form-input w-36" value={uploadFolder} onChange={(e) => setUploadFolder(e.target.value)}>
            {FOLDERS.map((name) => <option key={name} value={name}>Upload to {name}</option>)}
          </select>
          <button className="btn-primary" onClick={() => inputRef.current.click()}><Icon name="upload" className="h-4 w-4" />Upload images</button>
          <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={upload} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <input className="form-input w-64" placeholder="Search images by name" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="form-input w-40" value={folder} onChange={(e) => setFolder(e.target.value)}>
          <option value="">All folders</option>
          {FOLDERS.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
        {status && <span className="self-center text-sm text-brand">{status}</span>}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5">
        {items.map((media) => <MediaCard key={media.id} media={media} canDelete={isAdmin} onChanged={reload} />)}
      </div>
      {!loading && items.length === 0 && (
        <div className="panel px-6 py-14 text-center">
          <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-brand-tint text-brand"><Icon name="photo" className="h-6 w-6" /></span>
          <p className="font-bold">No images yet</p>
          <p className="mt-1 text-sm text-slate-500">Upload images here, then reuse them on any page.</p>
        </div>
      )}
    </div>
  );
}
