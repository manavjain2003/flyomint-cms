import React from 'react';
import FieldRenderer from './FieldRenderer.jsx';

const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;

const SEO_FIELDS = [
  { name: 'seo.metaTitle', label: 'Meta title', type: 'text', limit: TITLE_LIMIT },
  { name: 'seo.metaDescription', label: 'Meta description', type: 'textarea', limit: DESCRIPTION_LIMIT },
  { name: 'seo.keywords', label: 'Keywords (comma separated)', type: 'text' },
  { name: 'seo.canonicalUrl', label: 'Canonical URL (leave empty to use the page URL)', type: 'text' },
  { name: 'seo.ogImage', label: 'Social share image (1200×630)', type: 'image', folder: 'general' },
  { name: 'seo.noindex', label: 'Hide this page from search engines (no-index)', type: 'checkbox' },
];

/** SEO controls shared by every editor. Empty fields fall back to values generated from the page. */
export default function SeoPanel({ values, onChange }) {
  return (
    <section className="card space-y-4">
      <div>
        <h2 className="text-sm font-semibold">Search and social sharing (SEO)</h2>
        <p className="text-xs text-slate-500">Leave a field empty to use the title and description generated from the page.</p>
      </div>

      {SEO_FIELDS.map((field) => (
        <div key={field.name}>
          <FieldRenderer field={field} values={values} onChange={onChange} />
          {field.limit && (
            <p className="mt-1 text-right text-xs text-slate-500">
              {(values.seo?.[field.name.split('.')[1]] ?? '').length}/{field.limit}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}
