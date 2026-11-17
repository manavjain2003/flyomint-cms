import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/apiClient.js';
import { toQueryString } from '../../utils/object.js';

const DAY_MS = 86_400_000;
const isoDay = (date) => date.toISOString().slice(0, 10);

function RankTable({ title, rows }) {
  return (
    <section className="card">
      <h2 className="mb-3 text-sm font-semibold">{title}</h2>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b last:border-0"><td className="py-2">{row.label}</td><td className="py-2 text-right">{row.count}</td></tr>
          ))}
          {rows.length === 0 && <tr><td className="py-2 text-slate-500">No data for this period.</td></tr>}
        </tbody>
      </table>
    </section>
  );
}

export default function ReportsPage() {
  const [filters, setFilters] = useState({ from: isoDay(new Date(Date.now() - 30 * DAY_MS)), to: isoDay(new Date()), granularity: 'daily' });
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get(`/admin/reports?${toQueryString(filters)}`).then(setReport).catch((err) => setError(err.message));
  }, [filters]);

  const maxVisits = Math.max(1, ...(report?.visits.map((row) => row.count) ?? [1]));
  const set = (name) => (event) => setFilters({ ...filters, [name]: event.target.value });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs text-slate-500">From<input type="date" className="form-input" value={filters.from} onChange={set('from')} /></label>
          <label className="text-xs text-slate-500">To<input type="date" className="form-input" value={filters.to} onChange={set('to')} /></label>
          <select className="form-input w-32" value={filters.granularity} onChange={set('granularity')}>
            <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option>
          </select>
          <button className="btn-secondary" onClick={() => apiClient.download(`/admin/reports/export?${toQueryString(filters)}`, 'report.xlsx')}>Export to Excel</button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {report && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card"><p className="text-xs text-slate-500">Page visits</p><p className="text-2xl font-semibold">{report.totalVisits}</p></div>
            <div className="card"><p className="text-xs text-slate-500">Enquiries</p><p className="text-2xl font-semibold">{report.enquiries}</p></div>
            <div className="card"><p className="text-xs text-slate-500">Newsletter subscribers</p><p className="text-2xl font-semibold">{report.subscribers}</p></div>
          </div>

          <section className="card">
            <h2 className="mb-3 text-sm font-semibold">Page visits ({filters.granularity})</h2>
            <div className="space-y-1">
              {report.visits.map((row) => (
                <div key={row.period} className="flex items-center gap-3 text-xs">
                  <span className="w-24 shrink-0 text-slate-500">{row.period}</span>
                  <div className="h-4 rounded bg-brand" style={{ width: `${(row.count / maxVisits) * 100}%` }} />
                  <span>{row.count}</span>
                </div>
              ))}
              {report.visits.length === 0 && <p className="text-sm text-slate-500">No visits recorded for this period.</p>}
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-3">
            <RankTable title="Most visited route pages" rows={report.topRoutes} />
            <RankTable title="Most clicked banners" rows={report.topBanners} />
            <RankTable title="Most clicked offers" rows={report.topOffers} />
          </div>
        </>
      )}
    </div>
  );
}
