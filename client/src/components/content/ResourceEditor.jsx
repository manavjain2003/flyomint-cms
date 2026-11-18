import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext.jsx';
import { useResourceEditor } from '../../hooks/useResourceEditor.js';
import FieldGrid from '../forms/FieldGrid.jsx';
import PublishPanel from '../forms/PublishPanel.jsx';
import SeoPanel from '../forms/SeoPanel.jsx';
import Icon from '../ui/Icon.jsx';

/** Splits a field list into sections at each "heading" entry, so long forms read as clear groups. */
function groupFields(fields) {
  const sections = [{ title: null, fields: [] }];
  fields.forEach((field) => {
    if (field.type === 'heading') sections.push({ title: field.label, fields: [] });
    else sections[sections.length - 1].fields.push(field);
  });
  const filled = sections.filter((section) => section.fields.length > 0);
  if (filled.length > 1 && !filled[0].title) filled[0].title = 'Details';
  return filled;
}

function Skeleton() {
  return (
    <div className="max-w-4xl animate-pulse space-y-4">
      <div className="h-8 w-64 rounded bg-slate-200" />
      <div className="panel space-y-4">{[1, 2, 3, 4].map((n) => <div key={n} className="h-10 rounded bg-slate-100" />)}</div>
    </div>
  );
}

/** One editor screen, built entirely from a resource definition (see `src/resources`). */
export default function ResourceEditor({ resource }) {
  const editor = useResourceEditor(resource);
  const { values, loading, saving, feedback, isNew, changeField, save, openPreview } = editor;
  const notify = useToast();
  const { Extras } = resource;

  useEffect(() => {
    if (feedback.message) notify(feedback.type === 'error' ? 'error' : 'success', feedback.message);
  }, [feedback, notify]);

  if (loading) return <Skeleton />;

  const fields = resource.fields.map((field) => (field.requiredOnCreate ? { ...field, required: isNew } : field));
  const sections = groupFields(fields);
  const hasAside = resource.publish || resource.seo;
  const heading = isNew ? `New ${resource.itemName}` : resource.itemName ? `Edit ${resource.itemName}` : resource.title;

  return (
    <form onSubmit={(event) => { event.preventDefault(); save(); }}>
      <div className="sticky top-16 z-20 -mx-4 -mt-4 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-surface/90 px-4 py-3 backdrop-blur sm:-mx-8 sm:-mt-8 sm:px-8">
        <div className="min-w-0">
          {resource.kind === 'collection' && (
            <Link to={resource.path} className="text-xs font-semibold text-slate-500 hover:text-brand">Back to {resource.title.toLowerCase()}</Link>
          )}
          <h1 className="truncate text-xl font-extrabold">{heading}</h1>
        </div>
        <div className="flex items-center gap-2">
          {resource.publish && !isNew && (
            <button type="button" className="btn-secondary" onClick={openPreview}><Icon name="eye" className="h-4 w-4" />Preview</button>
          )}
          <button className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isNew ? `Create ${resource.itemName}` : 'Save changes'}
          </button>
        </div>
      </div>

      {resource.description && <p className="mb-5 max-w-3xl text-sm text-slate-600">{resource.description}</p>}

      <div className={hasAside ? 'grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]' : 'max-w-4xl'}>
        <div className="min-w-0 space-y-6">
          {sections.map((section, index) => (
            <section key={section.title ?? index} className="panel">
              {section.title && <h2 className="mb-4 text-base font-bold">{section.title}</h2>}
              <FieldGrid fields={section.fields} values={values} onChange={changeField} />
            </section>
          ))}
          {Extras && <Extras values={values} id={editor.id} />}
        </div>

        {hasAside && (
          <aside className="min-w-0 space-y-6">
            {resource.publish && <PublishPanel values={values} onChange={changeField} />}
            {resource.seo && <SeoPanel values={values} onChange={changeField} />}
          </aside>
        )}
      </div>
    </form>
  );
}
