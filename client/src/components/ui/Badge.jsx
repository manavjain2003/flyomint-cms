import React from 'react';

const TONES = {
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-800',
  blue: 'bg-blue-50 text-blue-700',
  sky: 'bg-sky-50 text-sky-700',
  violet: 'bg-violet-50 text-violet-700',
  red: 'bg-rose-50 text-rose-700',
  slate: 'bg-slate-100 text-slate-600',
};
const DOTS = {
  green: 'bg-emerald-500', amber: 'bg-amber-500', blue: 'bg-blue-500', sky: 'bg-sky-500',
  violet: 'bg-violet-500', red: 'bg-rose-500', slate: 'bg-slate-400',
};

/** Colour of a status or type word, so people learn "green is live, amber needs attention". */
const VALUE_TONES = {
  published: 'green', active: 'green', closed: 'green',
  draft: 'slate', unsubscribed: 'slate',
  scheduled: 'blue', new: 'blue',
  unpublished: 'amber', pending: 'amber', 'in-progress': 'amber',
  domestic: 'sky', international: 'violet', admin: 'violet', editor: 'sky',
};

export default function Badge({ value, tone, label }) {
  const key = tone ?? VALUE_TONES[String(value).toLowerCase()] ?? 'slate';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${TONES[key]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOTS[key]}`} />
      {String(label ?? value).replace(/-/g, ' ')}
    </span>
  );
}
