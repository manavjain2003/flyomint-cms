import React from 'react';
import { env } from '../../config/env.js';

const FILES = [
  { path: '/api/public/sitemap.xml', label: 'Sitemap (XML)', hint: 'Generated automatically from all published pages. Submit it in Search Console.' },
  { path: '/api/public/robots.txt', label: 'robots.txt', hint: 'Built from the text above. Serve it at /robots.txt on your website.' },
];

export default function SeoLinksPanel() {
  return (
    <section className="panel space-y-2">
      <h2 className="text-base font-bold">Generated files</h2>
      {FILES.map(({ path, label, hint }) => (
        <p key={path} className="text-sm">
          <a className="font-semibold text-brand hover:underline" href={`${env.apiUrl}${path}`} target="_blank" rel="noreferrer">{label}</a>
          <span className="block text-xs text-slate-500">{hint}</span>
        </p>
      ))}
    </section>
  );
}
