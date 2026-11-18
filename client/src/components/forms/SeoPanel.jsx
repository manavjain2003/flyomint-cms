import React from 'react';
import Icon from '../ui/Icon.jsx';
import FieldRenderer from './FieldRenderer.jsx';

const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;

const SEO_FIELDS = [
  { name: 'seo.metaTitle', label: 'Meta title', type: 'text', limit: TITLE_LIMIT },
  { name: 'seo.metaDescription', label: 'Meta description', type: 'textarea', limit: DESCRIPTION_LIMIT },
  { name: 'seo.keywords', label: 'Keywords', type: 'text', help: 'Separate with commas.' },
  { name: 'seo.canonicalUrl', label: 'Canonical URL', type: 'text', help: 'Leave empty to use the page URL.' },
  { name: 'seo.ogImage', label: 'Social share image (1200×630)', type: 'image', folder: 'general' },
  { name: 'seo.noindex', label: 'Hide this page from search engines', type: 'checkbox' },
];

function Counter({ value = '', limit }) {
  return <span className={`text-xs ${value.length > limit ? 'font-semibold text-rose-600' : 'text-slate-500'}`}>{value.length}/{limit}</span>;
}

/** How the page may look in search results, updated while typing. */
function SearchPreview({ values }) {
  const seo = values.seo ?? {};
  const title = seo.metaTitle || values.title || values.name || values.heading || 'Page title';
  const description = seo.metaDescription || 'Add a meta description to control what search engines show here.';

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="truncate text-xs text-slate-500">{values.slug ? `/${values.slug}` : 'Your page address'}</p>
      <p className="truncate text-base font-semibold text-blue-700">{title}</p>
      <p className="line-clamp-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}

/** SEO controls shared by every editor. Empty fields fall back to values generated from the page. */
export default function SeoPanel({ values, onChange }) {
  return (
    <details open className="panel group">
      <summary className="flex cursor-pointer list-none items-center justify-between">
        <span>
          <span className="block text-base font-bold">Search and sharing</span>
          <span className="block text-xs text-slate-500">Empty fields use text generated from the page.</span>
        </span>
        <Icon name="chevronDown" className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>

      <div className="mt-4 space-y-5">
        <SearchPreview values={values} />
        {SEO_FIELDS.map((field) => (
          <div key={field.name}>
            <FieldRenderer field={field} values={values} onChange={onChange} />
            {field.limit && (
              <div className="mt-1 text-right"><Counter value={values.seo?.[field.name.split('.')[1]] ?? ''} limit={field.limit} /></div>
            )}
          </div>
        ))}
      </div>
    </details>
  );
}
