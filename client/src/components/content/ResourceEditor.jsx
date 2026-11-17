import React from 'react';
import { Link } from 'react-router-dom';
import { useResourceEditor } from '../../hooks/useResourceEditor.js';
import FieldRenderer from '../forms/FieldRenderer.jsx';
import PublishPanel from '../forms/PublishPanel.jsx';
import SeoPanel from '../forms/SeoPanel.jsx';

/** One editor screen, built entirely from a resource definition (see `src/resources`). */
export default function ResourceEditor({ resource }) {
  const editor = useResourceEditor(resource);
  const { values, loading, saving, feedback, isNew, changeField, save, openPreview } = editor;
  const { Extras } = resource;

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;

  const fields = resource.fields.map((field) =>
    field.requiredOnCreate ? { ...field, required: isNew } : field,
  );

  return (
    <form onSubmit={(event) => { event.preventDefault(); save(); }} className="max-w-3xl space-y-6">
      <div>
        {resource.kind === 'collection' && (
          <Link to={resource.path} className="text-sm text-slate-500 hover:underline">← Back to {resource.title.toLowerCase()}</Link>
        )}
        <h1 className="text-2xl font-semibold">{isNew ? `New ${resource.itemName}` : resource.itemName ? `Edit ${resource.itemName}` : resource.title}</h1>
        {resource.description && <p className="text-sm text-slate-500">{resource.description}</p>}
      </div>

      <section className="card space-y-4">
        {fields.map((field, index) => (
          <FieldRenderer key={field.name || index} field={field} values={values} onChange={changeField} />
        ))}
      </section>

      {resource.publish && (
        <PublishPanel values={values} onChange={changeField} onPreview={openPreview} canPreview={!isNew} />
      )}
      {resource.seo && <SeoPanel values={values} onChange={changeField} />}
      {Extras && <Extras values={values} id={editor.id} />}

      <div className="flex items-center gap-4">
        <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
        {feedback.message && (
          <span className={`text-sm ${feedback.type === 'error' ? 'text-red-600' : 'text-brand'}`}>{feedback.message}</span>
        )}
      </div>
    </form>
  );
}
