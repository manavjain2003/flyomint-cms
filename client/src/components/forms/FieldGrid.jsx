import React from 'react';
import FieldRenderer from './FieldRenderer.jsx';

/** Short inputs sit two per row; everything that needs room spans the full width. */
const WIDE_TYPES = ['textarea', 'rich', 'image', 'repeater', 'checkboxGroup', 'relationMulti', 'code', 'heading'];

export default function FieldGrid({ fields, values, onChange }) {
  return (
    <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
      {fields.map((field, index) => (
        <div key={field.name || index} className={WIDE_TYPES.includes(field.type) ? 'sm:col-span-2' : ''}>
          <FieldRenderer field={field} values={values} onChange={onChange} />
        </div>
      ))}
    </div>
  );
}
