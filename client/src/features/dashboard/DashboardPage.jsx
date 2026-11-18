import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiClient } from '../../services/apiClient.js';
import { timeAgo } from '../../utils/format.js';

/** The headline numbers, laid out like an airport departures board. */
const BOARD = [
  { key: 'routes', label: 'Routes', icon: 'plane', to: '/routes/domestic', chip: 'bg-amber-400/15 text-amber-300' },
  { key: 'airlines', label: 'Airlines', icon: 'globe', to: '/airlines', chip: 'bg-sky-400/15 text-sky-300' },
  { key: 'offers', label: 'Offers', icon: 'tag', to: '/offers', chip: 'bg-emerald-400/15 text-emerald-300' },
  { key: 'blogs', label: 'Blogs', icon: 'document', to: '/blogs', chip: 'bg-violet-400/15 text-violet-300' },
  { key: 'enquiries', label: 'Enquiries', icon: 'inbox', to: '/enquiries', chip: 'bg-rose-400/15 text-rose-300' },
  { key: 'subscribers', label: 'Subscribers', icon: 'users', to: '/subscribers', chip: 'bg-cyan-400/15 text-cyan-300' },
];

const QUICK_ACTIONS = [
  { to: '/routes/domestic/new', label: 'Add a route' },
  { to: '/offers/new', label: 'Add an offer' },
  { to: '/blogs/new', label: 'Write a blog' },
  { to: '/enquiries', label: 'Open enquiries' },
];

const SPECIAL_FARE_KEYS = ['student-fare', 'senior-citizen-fare', 'armed-forces-fare', 'doctors-nurses-fare'];

/** Admin screen for a recently changed item. */
function editPath({ resource, id, kind }) {
  if (resource === 'routes') return `/routes/${kind}/${id}`;
  if (resource === 'pages') return SPECIAL_FARE_KEYS.includes(kind) ? `/special-fares/${kind}` : `/pages/${kind}`;
  return `/${resource}/${id}`;
}

const greeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
};

function RecentList({ title, items, dateKey }) {
  return (
    <div className="min-w-0 p-5">
      <h2 className="mb-2 text-base font-bold">{title}</h2>
      <ul className="divide-y divide-slate-100">
        {items.map((item) => (
          <li key={`${item.resource}-${item.id}`} className="flex items-center justify-between gap-3 py-2.5">
            <Link to={editPath(item)} className="min-w-0 truncate text-sm font-semibold hover:text-brand">{item.title}</Link>
            <span className="flex shrink-0 items-center gap-2">
              <Badge tone="slate" label={item.resource} />
              <span className="w-24 text-right text-xs text-slate-500">{timeAgo(item[dateKey])}</span>
            </span>
          </li>
        ))}
        {items.length === 0 && <li className="py-6 text-sm text-slate-500">Nothing here yet. Pages you add or edit will appear in this list.</li>}
      </ul>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-72 rounded bg-slate-200" />
      <div className="h-24 rounded-xl bg-slate-200" />
      <div className="h-64 rounded-xl bg-slate-100" />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get('/admin/dashboard').then(setData).catch((err) => setError(err.message));
  }, []);

  if (error) return <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>;
  if (!data) return <Skeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">{greeting()}, {user.name.split(' ')[0]}</h1>
          <p className="mt-1 text-sm text-slate-600">Here is what is on your website right now.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action, index) => (
            <Link key={action.to} to={action.to} className={index === 0 ? 'btn-primary' : 'btn-secondary'}>{action.label}</Link>
          ))}
        </div>
      </div>

      <section className="overflow-hidden rounded-xl bg-navy">
        <div className="grid grid-cols-2 gap-px bg-white/10 md:grid-cols-3 xl:grid-cols-6">
          {BOARD.map(({ key, label, icon, to, chip }) => (
            <Link key={key} to={to} className="flex items-center gap-3 bg-navy px-5 py-5 hover:bg-navy-light">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${chip}`}><Icon name={icon} /></span>
              <span>
                <span className="tabular block text-3xl font-extrabold leading-none text-white">{data.counts[key]}</span>
                <span className="mt-1 block text-sm text-slate-300">{label}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel grid gap-px divide-slate-100 p-0 lg:grid-cols-2 lg:divide-x">
        <RecentList title="Recently added" items={data.recentlyAdded} dateKey="createdAt" />
        <RecentList title="Recently edited" items={data.recentlyEdited} dateKey="updatedAt" />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-base font-bold">Latest enquiries</h2>
            <Link to="/enquiries" className="text-sm font-semibold text-brand hover:underline">View all</Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {data.latestEnquiries.map((enquiry) => (
              <li key={enquiry.id} className="flex items-center justify-between gap-3 py-2.5">
                <Link to={`/enquiries/${enquiry.id}`} className="min-w-0">
                  <span className="block truncate text-sm font-semibold hover:text-brand">{enquiry.name}</span>
                  <span className="block truncate text-xs text-slate-500">{enquiry.subject || enquiry.message}</span>
                </Link>
                <Badge value={enquiry.status} />
              </li>
            ))}
            {data.latestEnquiries.length === 0 && <li className="py-6 text-sm text-slate-500">No enquiries yet. They appear here when visitors use the contact form.</li>}
          </ul>
        </section>

        <section className="panel">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-base font-bold">Newest subscribers</h2>
            <Link to="/subscribers" className="text-sm font-semibold text-brand hover:underline">View all</Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {data.latestSubscribers.map((subscriber) => (
              <li key={subscriber.id} className="flex items-center justify-between gap-3 py-2.5">
                <span className="min-w-0 truncate text-sm font-semibold">{subscriber.email}</span>
                <span className="flex shrink-0 items-center gap-2">
                  <Badge value={subscriber.status} />
                  <span className="w-24 text-right text-xs text-slate-500">{timeAgo(subscriber.createdAt)}</span>
                </span>
              </li>
            ))}
            {data.latestSubscribers.length === 0 && <li className="py-6 text-sm text-slate-500">No subscribers yet. They appear here after someone confirms the newsletter email.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
