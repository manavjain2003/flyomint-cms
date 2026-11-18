import React from 'react';
import { getPath, setPath } from '../../utils/object.js';
import Icon from '../ui/Icon.jsx';
import FieldGrid from './FieldGrid.jsx';

const moveItem = (list, from, to) => {
  const next = [...list];
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
};

const emptyValue = (sub) => (sub.type === 'checkbox' ? true : sub.type === 'repeater' ? [] : '');

/** A list of sub-forms: add, remove and reorder. `field.fixed` keeps the list as is (no add/remove). */
export default function Repeater({ field, value, onChange }) {
  const items = value ?? [];
  const update = (index, item) => onChange(items.map((current, i) => (i === index ? item : current)));
  const emptyItem = () => field.fields.filter((sub) => sub.name).reduce((item, sub) => setPath(item, sub.name, emptyValue(sub)), {});

  return (
    <div>
      <span className="field-label">{field.label}</span>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-lg border border-slate-200 bg-slate-50/70">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-3 py-1.5">
              <span className="truncate text-sm font-semibold text-slate-700">
                {(field.itemLabel && getPath(item, field.itemLabel)) || `${field.itemName ? field.itemName[0].toUpperCase() + field.itemName.slice(1) : 'Item'} ${index + 1}`}
              </span>
              <span className="flex shrink-0 items-center">
                <button type="button" className="btn-icon h-7 w-7" title="Move up" aria-label="Move up" disabled={index === 0} onClick={() => onChange(moveItem(items, index, index - 1))}>
                  <Icon name="chevronUp" className="h-4 w-4" />
                </button>
                <button type="button" className="btn-icon h-7 w-7" title="Move down" aria-label="Move down" disabled={index === items.length - 1} onClick={() => onChange(moveItem(items, index, index + 1))}>
                  <Icon name="chevronDown" className="h-4 w-4" />
                </button>
                {!field.fixed && (
                  <button type="button" className="btn-icon h-7 w-7 hover:bg-rose-50 hover:text-rose-600" title="Remove" aria-label="Remove" onClick={() => onChange(items.filter((_, i) => i !== index))}>
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                )}
              </span>
            </div>
            <div className="p-3">
              <FieldGrid fields={field.fields} values={item} onChange={(name, next) => update(index, setPath(item, name, next))} />
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="rounded-lg border border-dashed border-slate-300 px-3 py-4 text-center text-sm text-slate-500">Nothing added yet.</p>}
      </div>

      {!field.fixed && (
        <button type="button" className="btn-secondary mt-3" onClick={() => onChange([...items, emptyItem()])}>
          <Icon name="plus" className="h-4 w-4" />Add {field.itemName ?? 'item'}
        </button>
      )}
    </div>
  );
}
