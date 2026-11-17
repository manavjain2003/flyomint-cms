import React, { useState } from 'react';
import { uploadImage } from '../../services/cloudinaryService.js';
import { resourceService } from '../../services/resourceService.js';
import MediaPicker from './MediaPicker.jsx';

/**
 * Image field. The value is { url, alt }.
 * New uploads go to Cloudinary (optimised automatically) and are registered in the media library.
 */
export default function ImageUpload({ label, value, folder = 'general', onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const image = value ?? {};

  const handleFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const asset = await uploadImage(file, folder);
      await resourceService.create('media', asset);
      onChange({ url: asset.url, alt: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div>
      {label && <span className="mb-1 block text-sm font-medium">{label}</span>}

      <div className="flex items-start gap-4">
        {image.url ? (
          <img src={image.url} alt="" className="h-20 w-32 shrink-0 rounded-md border object-cover" />
        ) : (
          <div className="grid h-20 w-32 shrink-0 place-items-center rounded-md border border-dashed text-xs text-slate-400">No image</div>
        )}

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <input type="file" accept="image/*" onChange={handleFile} className="text-sm" />
            <button type="button" className="btn-secondary" onClick={() => setPickerOpen(true)}>Choose from library</button>
            {image.url && (
              <button type="button" className="text-xs text-red-600 underline" onClick={() => onChange({ url: '', alt: '' })}>Remove</button>
            )}
          </div>
          {image.url && (
            <input className="form-input" placeholder="Alt text (describe the image for search engines)"
              value={image.alt || ''} onChange={(e) => onChange({ ...image, alt: e.target.value })} />
          )}
          {uploading && <p className="text-xs text-slate-500">Uploading…</p>}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>

      {pickerOpen && (
        <MediaPicker
          onClose={() => setPickerOpen(false)}
          onPick={(media) => { onChange({ url: media.url, alt: media.alt || '' }); setPickerOpen(false); }}
        />
      )}
    </div>
  );
}
