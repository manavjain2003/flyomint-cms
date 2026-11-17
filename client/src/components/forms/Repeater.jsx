import React from 'react';
import { getPath, setPath } from '../../utils/object.js';
import FieldRenderer from './FieldRenderer.jsx';

const moveItem = (list, from, to) => {
  const next = [...list];
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
};

/** A list of sub-forms: add, remove and reorder. `field.fixed` keeps the list as is (no add/remove). */
export default function Repeater({ field, value, onChange }) {
  const items = value ?? [];
  const update = (index, item) => onChange(items.map((current, i) => (i === index ? item : current)));
  const emptyItem = () => field.fields.reduce((item, sub) => (sub.type === 'heading' ? item : setPath(item, sub.name, sub.type === 'checkbox' ? true : sub.type === 'repeater' ? [] : '')), {});

  return (
    <div>
      <span className="mb-1 block text-sm font-medium">{field.label}</span>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">{(field.itemLabel && getPath(item, field.itemLabel)) || `Item ${index + 1}`}</span>
              <span className="space-x-3">
                <button type="button" disabled={index === 0} onClick={() => onChange(moveItem(items, index, index - 1))}>↑ Up</button>
                <button type="button" disabled={index === items.length - 1} onClick={() => onChange(moveItem(items, index, index + 1))}>↓ Down</button>
                {!field.fixed && (
                  <button type="button" className="text-red-600" onClick={() => onChange(items.filter((_, i) => i !== index))}>Remove</button>
                )}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {field.fields.map((sub) => (
                <div key={sub.name || sub.label} className={['rich', 'textarea', 'repeater', 'image', 'heading'].includes(sub.type) ? 'sm:col-span-2' : ''}>
                  <FieldRenderer field={sub} values={item} onChange={(name, next) => update(index, setPath(item, name, next))} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!field.fixed && (
        <button type="button" className="btn-secondary mt-3" onClick={() => onChange([...items, emptyItem()])}>
          + Add {field.itemName ?? 'item'}
        </button>
      )}
    </div>
  );
}
