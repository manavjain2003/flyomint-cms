import React, { useEffect, useState } from 'react';
import Icon from '../../components/ui/Icon.jsx';
import { apiClient } from '../../services/apiClient.js';
import { toQueryString } from '../../utils/object.js';

const DAY_MS = 86_400_000;
const isoDay = (date) => date.toISOString().slice(0, 10);

function Stat({ label, value, tone }) {
  return (
    <div className="flex-1 px-6 py-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`tabular mt-1 text-3xl font-extrabold ${tone}`}>{value}</p>
    </div>
  );
}

function RankList({ title, rows, empty }) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  return (
    <section className="panel">
      <h2 className="mb-3 text-base font-bold">{title}</h2>
      <ol className="space-y-3">
        {rows.map((row, index) => (
          <li key={row.label} className="flex items-center gap-3 text-sm">
            <span className="tabular w-5 text-right font-bold text-slate-400">{index + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="flex justify-between gap-2"><span className="truncate font-semibold">{row.label}</span><span className="tabular text-slate-600">{row.count}</span></span>
              <span className="mt-1 block h-1.5 rounded-full bg-slate-100"><span className="block h-1.5 rounded-full bg-brand" style={{ width: `${(row.count / max) * 100}%` }} /></span>
            </span>
          </li>
        ))}
        {rows.length === 0 && <li className="text-sm text-slate-500">{empty}</li>}
      </ol>
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
        <div>
          <h1 className="text-2xl font-extrabold">Reports</h1>
          <p className="mt-1 text-sm text-slate-600">Visits, popular pages and clicks for the dates you choose.</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs font-semibold text-slate-500">From<input type="date" className="form-input mt-1" value={filters.from} onChange={set('from')} /></label>
          <label className="text-xs font-semibold text-slate-500">To<input type="date" className="form-input mt-1" value={filters.to} onChange={set('to')} /></label>
          <select aria-label="Group by" className="form-input w-auto" value={filters.granularity} onChange={set('granularity')}>
            <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option>
          </select>
          <button className="btn-secondary" onClick={() => apiClient.download(`/admin/reports/export?${toQueryString(filters)}`, 'report.xlsx')}>
            <Icon name="download" className="h-4 w-4" />Export to Excel
          </button>
        </div>
      </div>

      {error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
      {!report && !error && <div className="h-64 animate-pulse rounded-xl bg-slate-100" />}
      {report && (
        <>
          <section className="panel flex flex-col divide-y divide-slate-100 p-0 sm:flex-row sm:divide-x sm:divide-y-0">
            <Stat label="Page visits" value={report.totalVisits} tone="text-brand" />
            <Stat label="Enquiries" value={report.enquiries} tone="text-rose-600" />
            <Stat label="New newsletter subscribers" value={report.subscribers} tone="text-emerald-600" />
          </section>

          <section className="panel">
            <h2 className="mb-4 text-base font-bold">Page visits</h2>
            <div className="space-y-1.5">
              {report.visits.map((row) => (
                <div key={row.period} className="flex items-center gap-3 text-xs">
                  <span className="tabular w-24 shrink-0 text-slate-500">{row.period}</span>
                  <div className="h-5 rounded bg-brand/80" style={{ width: `${Math.max((row.count / maxVisits) * 100, 1)}%` }} />
                  <span className="tabular font-semibold">{row.count}</span>
                </div>
              ))}
              {report.visits.length === 0 && <p className="text-sm text-slate-500">No visits were recorded in this period. Visits appear once the website sends them to the tracking endpoint.</p>}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            <RankList title="Most visited route pages" rows={report.topRoutes} empty="No route visits in this period." />
            <RankList title="Most clicked banners" rows={report.topBanners} empty="No banner clicks in this period." />
            <RankList title="Most clicked offers" rows={report.topOffers} empty="No offer clicks in this period." />
          </div>
        </>
      )}
    </div>
  );
}
