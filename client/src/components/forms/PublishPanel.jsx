import React from 'react';
import Badge from '../ui/Badge.jsx';
import FieldRenderer from './FieldRenderer.jsx';

const STATUS_FIELD = {
  name: 'status', label: 'Status', type: 'select',
  options: [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'unpublished', label: 'Unpublished' },
    { value: 'scheduled', label: 'Scheduled' },
  ],
};
const STATUS_HELP = {
  draft: 'Saved, but not visible on the website.',
  published: 'Live on the website.',
  unpublished: 'Removed from the website.',
  scheduled: 'Goes live on the date and time you choose.',
};
const DATE_FIELDS = {
  scheduled: { name: 'publishAt', label: 'Go-live date and time', type: 'datetime' },
  published: { name: 'publishAt', label: 'Publish date shown on the page', type: 'datetime' },
};

export default function PublishPanel({ values, onChange }) {
  return (
    <section className="panel space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">Publishing</h2>
        <Badge value={values.status} />
      </div>
      <div>
        <FieldRenderer field={STATUS_FIELD} values={values} onChange={onChange} />
        <p className="mt-1.5 text-xs text-slate-500">{STATUS_HELP[values.status]}</p>
      </div>
      {DATE_FIELDS[values.status] && <FieldRenderer field={DATE_FIELDS[values.status]} values={values} onChange={onChange} />}
    </section>
  );
}
