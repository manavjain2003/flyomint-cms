import React from 'react';
import FieldRenderer from './FieldRenderer.jsx';

const STATUS_FIELD = {
  name: 'status', label: 'Status', type: 'select',
  options: [
    { value: 'draft', label: 'Draft: saved but not visible on the website' },
    { value: 'published', label: 'Published: live on the website' },
    { value: 'unpublished', label: 'Unpublished: removed from the website' },
    { value: 'scheduled', label: 'Scheduled: goes live on the selected date and time' },
  ],
};
const DATE_FIELDS = {
  scheduled: { name: 'publishAt', label: 'Go-live date and time', type: 'datetime' },
  published: { name: 'publishAt', label: 'Publish date shown on the page (optional)', type: 'datetime' },
};

export default function PublishPanel({ values, onChange, onPreview, canPreview }) {
  return (
    <section className="card space-y-4">
      <h2 className="text-sm font-semibold">Publishing</h2>
      <FieldRenderer field={STATUS_FIELD} values={values} onChange={onChange} />
      {DATE_FIELDS[values.status] && <FieldRenderer field={DATE_FIELDS[values.status]} values={values} onChange={onChange} />}
      {canPreview && (
        <button type="button" className="btn-secondary" onClick={onPreview}>Preview before publishing</button>
      )}
    </section>
  );
}
