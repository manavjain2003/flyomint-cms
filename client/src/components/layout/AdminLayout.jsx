import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { env } from '../../config/env.js';
import { NAV_GROUPS } from '../../constants/navigation.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useIdleLogout } from '../../hooks/useIdleLogout.js';
import Icon from '../ui/Icon.jsx';

const ALL_ITEMS = NAV_GROUPS.flatMap((group) => group.items.map((entry) => ({ ...entry, group: group.title })));

/** The menu entry that best matches the address (longest match wins), so only one item is highlighted. */
function findActive(pathname) {
  return ALL_ITEMS
    .filter((entry) => pathname === entry.to || (entry.to !== '/' && pathname.startsWith(`${entry.to}/`)))
    .sort((a, b) => b.to.length - a.to.length)[0];
}

const initials = (name = '') => name.split(' ').map((word) => word[0]).slice(0, 2).join('').toUpperCase();

function SidebarContent({ active, isAdmin, onNavigate }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(() => ({ [active?.group]: true }));

  useEffect(() => {
    if (active?.group) setOpen((current) => ({ ...current, [active.group]: true }));
  }, [active?.group]);

  const searching = query.trim().length > 0;
  const matches = (entry) => (isAdmin || !entry.adminOnly) && entry.label.toLowerCase().includes(query.trim().toLowerCase());

  const linkClass = (entry) =>
    `relative flex items-center rounded-lg py-2 pl-9 pr-3 text-sm ${
      entry === active ? 'bg-white/10 font-semibold text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <div className="flex h-full flex-col bg-navy">
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-horizon text-navy"><Icon name="plane" className="h-5 w-5" /></span>
        <div>
          <p className="text-base font-extrabold leading-tight text-white">Flight CMS</p>
          <p className="text-xs text-slate-400">Admin panel</p>
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="relative">
          <Icon name="search" className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a page"
            aria-label="Find a page in the menu"
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-400 focus:border-horizon focus:outline-none"
          />
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
        {NAV_GROUPS.map((group, index) => {
          const items = group.items.filter(matches);
          if (items.length === 0) return null;

          if (!group.title) {
            return items.map((entry) => (
              <Link key={entry.to} to={entry.to} onClick={onNavigate}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${entry === active ? 'bg-white/10 font-semibold text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                <Icon name={group.icon} className="h-[18px] w-[18px]" />{entry.label}
              </Link>
            ));
          }

          const expanded = searching || open[group.title];
          return (
            <div key={group.title ?? index}>
              <button type="button" aria-expanded={expanded}
                onClick={() => setOpen((current) => ({ ...current, [group.title]: !current[group.title] }))}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/5">
                <Icon name={group.icon} className="h-[18px] w-[18px] text-horizon" />
                <span className="flex-1 text-left">{group.title}</span>
                <Icon name={expanded ? 'chevronUp' : 'chevronDown'} className="h-4 w-4 text-slate-400" />
              </button>
              {expanded && (
                <div className="ml-[18px] mt-1 space-y-0.5 border-l border-white/10 pb-2">
                  {items.map((entry) => (
                    <Link key={entry.to} to={entry.to} onClick={onNavigate} className={linkClass(entry)}>
                      {entry === active && <span className="absolute left-[-1px] top-1.5 h-6 w-0.5 rounded bg-horizon" />}
                      {entry.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {searching && ALL_ITEMS.filter(matches).length === 0 && <p className="px-3 py-4 text-sm text-slate-400">No page matches "{query}".</p>}
      </nav>
    </div>
  );
}

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}
        className="flex items-center gap-3 rounded-lg py-1 pl-1 pr-2 hover:bg-slate-100">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-bold text-white">{initials(user.name)}</span>
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-semibold leading-tight">{user.name}</span>
          <span className="block text-xs capitalize text-slate-500">{user.role}</span>
        </span>
        <Icon name="chevronDown" className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <>
          <button type="button" aria-label="Close menu" className="fixed inset-0 z-30 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
            <Link to="/change-password" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50">
              <Icon name="key" className="h-4 w-4 text-slate-500" />Change password
            </Link>
            <button type="button" onClick={onLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50">
              <Icon name="logout" className="h-4 w-4 text-slate-500" />Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuth();
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const active = findActive(pathname);
  useIdleLogout(logout, env.idleLogoutMinutes);

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
        <SidebarContent active={active} isAdmin={isAdmin} />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-slate-900/50" onClick={() => setDrawerOpen(false)} />
          <aside className="relative h-full w-72">
            <SidebarContent active={active} isAdmin={isAdmin} onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-8">
          <button type="button" className="btn-icon lg:hidden" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
            <Icon name="menu" />
          </button>
          <p className="truncate text-sm text-slate-500">
            {active?.group && <span>{active.group} <span className="mx-1 text-slate-300">/</span></span>}
            <span className="font-semibold text-ink">{active?.label ?? 'Flight CMS'}</span>
          </p>
          <div className="ml-auto"><UserMenu user={user} onLogout={logout} /></div>
        </header>
        <main className="p-4 sm:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
