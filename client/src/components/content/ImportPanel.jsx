import React, { useState } from 'react';
import { resourceService } from '../../services/resourceService.js';

/** Bulk upload from an Excel / CSV file, with a downloadable template. */
export default function ImportPanel({ resource, onDone }) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const upload = async () => {
    setBusy(true);
    setError('');
    try {
      setResult(await resourceService.importFile(resource.api, file));
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel space-y-3">
      <p className="text-sm">
        Upload an Excel (.xlsx) or CSV file. Start from the template so the columns match.{' '}
        <button className="font-semibold text-brand hover:underline" onClick={() => resourceService.downloadImportTemplate(resource.api)}>Download template</button>
      </p>
      <div className="flex items-center gap-3">
        <input type="file" accept=".xlsx,.csv" onChange={(e) => setFile(e.target.files[0])} className="text-sm" />
        <button className="btn-primary" disabled={!file || busy} onClick={upload}>{busy ? 'Uploading…' : 'Upload'}</button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {result && (
        <div className="text-sm">
          <p className="text-brand">{result.created} created, {result.failed.length} failed.</p>
          {result.failed.map((failure) => <p key={failure.row} className="text-red-600">Row {failure.row}: {failure.error}</p>)}
        </div>
      )}
    </div>
  );
}
