import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/apiClient.js';
import { formatDateTime } from '../../utils/format.js';

const COUNT_CARDS = [
  { key: 'routes', label: 'Routes' }, { key: 'airlines', label: 'Airlines' }, { key: 'offers', label: 'Offers' },
  { key: 'blogs', label: 'Blogs' }, { key: 'enquiries', label: 'Enquiries' }, { key: 'subscribers', label: 'Subscribers' },
];

const SPECIAL_FARE_KEYS = ['student-fare', 'senior-citizen-fare', 'armed-forces-fare', 'doctors-nurses-fare'];

/** Admin screen for a recently changed item. */
function editPath({ resource, id, kind }) {
  if (resource === 'routes') return `/routes/${kind}/${id}`;
  if (resource === 'pages') return SPECIAL_FARE_KEYS.includes(kind) ? `/special-fares/${kind}` : `/pages/${kind}`;
  return `/${resource}/${id}`;
}

function RecentList({ title, items, dateKey }) {
  return (
    <section className="card">
      <h2 className="mb-3 text-sm font-semibold">{title}</h2>
      <ul className="divide-y text-sm">
        {items.map((item) => (
          <li key={`${item.resource}-${item.id}`} className="flex items-center justify-between gap-3 py-2">
            <Link to={editPath(item)} className="min-w-0 truncate text-brand hover:underline">{item.title}</Link>
            <span className="shrink-0 text-xs text-slate-500">{item.resource} · {formatDateTime(item[dateKey])}</span>
          </li>
        ))}
        {items.length === 0 && <li className="py-2 text-slate-500">Nothing yet.</li>}
      </ul>
    </section>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get('/admin/dashboard').then(setData).catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return <p className="text-sm text-slate-500">Loading…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {COUNT_CARDS.map(({ key, label }) => (
          <div key={key} className="card">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-2xl font-semibold">{data.counts[key]}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentList title="Recently added" items={data.recentlyAdded} dateKey="createdAt" />
        <RecentList title="Recently edited" items={data.recentlyEdited} dateKey="updatedAt" />

        <section className="card">
          <h2 className="mb-3 text-sm font-semibold">Latest enquiries</h2>
          <ul className="divide-y text-sm">
            {data.latestEnquiries.map((enquiry) => (
              <li key={enquiry.id} className="flex justify-between gap-3 py-2">
                <Link to={`/enquiries/${enquiry.id}`} className="truncate text-brand hover:underline">{enquiry.name}: {enquiry.subject || enquiry.message}</Link>
                <span className="badge shrink-0">{enquiry.status}</span>
              </li>
            ))}
            {data.latestEnquiries.length === 0 && <li className="py-2 text-slate-500">No enquiries yet.</li>}
          </ul>
        </section>

        <section className="card">
          <h2 className="mb-3 text-sm font-semibold">Latest newsletter subscribers</h2>
          <ul className="divide-y text-sm">
            {data.latestSubscribers.map((subscriber) => (
              <li key={subscriber.id} className="flex justify-between gap-3 py-2">
                <span className="truncate">{subscriber.email}</span>
                <span className="shrink-0 text-xs text-slate-500">{formatDateTime(subscriber.createdAt)}</span>
              </li>
            ))}
            {data.latestSubscribers.length === 0 && <li className="py-2 text-slate-500">No subscribers yet.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
