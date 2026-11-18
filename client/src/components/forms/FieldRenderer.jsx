import React from 'react';
import { toDateInput, toDateTimeInput } from '../../utils/format.js';
import { getPath } from '../../utils/object.js';
import ImageUpload from './ImageUpload.jsx';
import { RelationMultiSelect, RelationSelect } from './RelationFields.jsx';
import Repeater from './Repeater.jsx';
import RichTextEditor from './RichTextEditor.jsx';

const toOption = (option) => (typeof option === 'string' ? { value: option, label: option } : option);
const INPUT_TYPES = ['text', 'email', 'url', 'number', 'date', 'password', 'slug', 'color'];

/**
 * Renders one form control from a field definition:
 * { name, label, type, required?, readOnly?, help?, options?, collection?, optionLabel?, fields?, folder? }
 * `name` may be a dotted path ("baggage.cabin"). `values` is the whole form state.
 */
export default function FieldRenderer({ field, values, onChange }) {
  const { name, label, type, required, readOnly, help } = field;
  const value = getPath(values, name);
  const set = (next) => onChange(name, next);

  if (type === 'heading') return <h3 className="border-b border-slate-200 pb-1 pt-2 text-sm font-bold text-slate-700">{label}</h3>;
  if (type === 'checkbox') {
    return (
      <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
        <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-brand" disabled={readOnly} checked={Boolean(value)} onChange={(e) => set(e.target.checked)} />
        {label}
      </label>
    );
  }
  if (type === 'image') return <ImageUpload label={label} folder={field.folder} value={value} onChange={set} />;
  if (type === 'repeater') return <Repeater field={field} value={value} onChange={set} />;

  let control = null;
  if (type === 'rich') control = <RichTextEditor value={value} onChange={set} />;
  if (type === 'textarea' || type === 'code') {
    control = (
      <textarea id={name} rows={field.rows ?? (type === 'code' ? 8 : 3)} disabled={readOnly}
        className={`form-input ${type === 'code' ? 'font-mono text-xs' : ''}`}
        value={value || ''} onChange={(e) => set(e.target.value)} />
    );
  }
  if (INPUT_TYPES.includes(type)) {
    control = (
      <input id={name} disabled={readOnly} required={required} min={field.min} max={field.max}
        type={type === 'slug' ? 'text' : type}
        className={type === 'color' ? 'h-10 w-20 rounded border' : 'form-input'}
        value={type === 'date' ? toDateInput(value) : value ?? ''}
        onChange={(e) => set(type === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value)} />
    );
  }
  if (type === 'datetime') {
    control = (
      <input id={name} type="datetime-local" className="form-input" value={toDateTimeInput(value)}
        onChange={(e) => set(e.target.value ? new Date(e.target.value).toISOString() : null)} />
    );
  }
  if (type === 'select') {
    control = (
      <select id={name} className="form-input" disabled={readOnly} required={required} value={value ?? ''} onChange={(e) => set(e.target.value)}>
        {field.allowEmpty && <option value="">None</option>}
        {field.options.map(toOption).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    );
  }
  if (type === 'checkboxGroup') {
    const selected = value ?? [];
    control = (
      <div className="flex flex-wrap gap-4">
        {field.options.map(toOption).map((option) => (
          <label key={option.value} className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-brand" checked={selected.includes(option.value)}
              onChange={() => set(selected.includes(option.value) ? selected.filter((v) => v !== option.value) : [...selected, option.value])} />
            {option.label}
          </label>
        ))}
      </div>
    );
  }
  if (type === 'tags') {
    control = (
      <input id={name} className="form-input" placeholder="Separate with commas" value={(value ?? []).join(', ')}
        onChange={(e) => set(e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean))} />
    );
  }
  if (type === 'relation') control = <RelationSelect field={field} value={value} onChange={set} disabled={readOnly} />;
  if (type === 'relationMulti') control = <RelationMultiSelect field={field} value={value ?? []} onChange={set} disabled={readOnly} />;

  return (
    <div>
      <label htmlFor={name} className="field-label">{label}{required && <span className="text-rose-600"> *</span>}</label>
      {control}
      {help && <p className="mt-1.5 text-xs text-slate-500">{help}</p>}
    </div>
  );
}
