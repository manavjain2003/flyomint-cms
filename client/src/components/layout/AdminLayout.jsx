import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { NAV_GROUPS } from '../../constants/navigation.js';
import { env } from '../../config/env.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useIdleLogout } from '../../hooks/useIdleLogout.js';

const linkClass = ({ isActive }) =>
  `block rounded-md px-3 py-1.5 text-sm ${isActive ? 'bg-teal-50 font-medium text-brand' : 'hover:bg-slate-100'}`;

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuth();
  useIdleLogout(logout, env.idleLogoutMinutes);

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-4">
        <p className="mb-4 text-lg font-semibold">Flight CMS</p>

        <nav className="space-y-4">
          {NAV_GROUPS.map((group, index) => (
            <div key={group.title ?? index}>
              {group.title && <p className="mb-1 px-3 text-xs font-semibold uppercase text-slate-400">{group.title}</p>}
              {group.items.filter((entry) => isAdmin || !entry.adminOnly).map(({ to, label }) => (
                <NavLink key={to} to={to} end className={linkClass}>{label}</NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-end gap-4 border-b border-slate-200 bg-white px-8 py-3 text-sm">
          <span className="text-slate-500">{user.name} ({user.role})</span>
          <Link to="/change-password" className="text-brand hover:underline">Change password</Link>
          <button onClick={logout} className="text-slate-500 hover:underline">Sign out</button>
        </header>
        <main className="p-8"><Outlet /></main>
      </div>
    </div>
  );
}
