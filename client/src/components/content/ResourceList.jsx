import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useResourceList } from '../../hooks/useResourceList.js';
import { resourceService } from '../../services/resourceService.js';
import { formatDate, formatDateTime } from '../../utils/format.js';
import { getPath } from '../../utils/object.js';
import ImportPanel from './ImportPanel.jsx';

const PAGE_SIZE = 20;

function Cell({ item, column, onInlineChange }) {
  const value = getPath(item, column.key);
  if (column.render) return column.render(item);

  switch (column.type) {
    case 'date': return formatDate(value);
    case 'datetime': return formatDateTime(value);
    case 'boolean': return <span className="badge">{value ? 'Yes' : 'No'}</span>;
    case 'badge': return value ? <span className="badge">{value}</span> : '—';
    case 'image': return value?.url ? <img src={value.url} alt="" className="h-8 w-14 rounded object-cover" /> : '—';
    case 'inlineSelect':
      return (
        <select className="form-input py-1" value={value} onChange={(e) => onInlineChange(item, column.key, e.target.value)}>
          {column.options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      );
    default: return value ?? '—';
  }
}

/** List screen built from a resource definition: search, filters, paging, import/export, row actions. */
export default function ResourceList({ resource }) {
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [range, setRange] = useState({ from: '', to: '' });
  const [importOpen, setImportOpen] = useState(false);
  const [actionError, setActionError] = useState('');

  const query = { ...resource.baseFilter, ...filters, ...range, search, page, limit: PAGE_SIZE };
  const { items, total, pages, loading, error, reload } = useResourceList(resource.api, query);
  const { ListExtras } = resource;

  const canWrite = !resource.readOnly;
  const resetPage = (setter) => (value) => { setter(value); setPage(1); };

  const runAction = async (action) => {
    setActionError('');
    try { await action(); await reload(); } catch (err) { setActionError(err.message); }
  };
  const handleDelete = (item) => {
    if (window.confirm(`Delete this ${resource.itemName} permanently?`)) runAction(() => resourceService.remove(resource.api, item.id));
  };
  const handleInlineChange = (item, key, value) => runAction(() => resourceService.update(resource.api, item.id, { [key]: value }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{resource.title}</h1>
          {resource.description && <p className="text-sm text-slate-500">{resource.description}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {resource.importable && <button className="btn-secondary" onClick={() => setImportOpen((open) => !open)}>Bulk upload</button>}
          {resource.exportable && (
            <button className="btn-secondary" onClick={() => runAction(() => resourceService.exportFile(resource.api, { ...resource.baseFilter, ...filters, ...range, search }))}>
              Export to Excel
            </button>
          )}
          {canWrite && !resource.noCreate && <Link to={`${resource.path}/new`} className="btn-primary">Create {resource.itemName}</Link>}
        </div>
      </div>

      {importOpen && <ImportPanel resource={resource} onDone={reload} />}
      {ListExtras && <ListExtras reload={reload} />}

      <div className="flex flex-wrap items-end gap-3">
        <input className="form-input w-64" placeholder="Search…" value={search} onChange={(e) => resetPage(setSearch)(e.target.value)} />
        {resource.filters?.map((filter) => (
          <select key={filter.name} className="form-input w-44" value={filters[filter.name] ?? ''}
            onChange={(e) => resetPage(setFilters)({ ...filters, [filter.name]: e.target.value })}>
            <option value="">{filter.label}: all</option>
            {filter.options.map((option) => <option key={option.value ?? option} value={option.value ?? option}>{option.label ?? option}</option>)}
          </select>
        ))}
        {resource.dateFilter && ['from', 'to'].map((key) => (
          <label key={key} className="text-xs text-slate-500">
            {key === 'from' ? 'From date' : 'To date'}
            <input type="date" className="form-input" value={range[key]} onChange={(e) => resetPage(setRange)({ ...range, [key]: e.target.value })} />
          </label>
        ))}
      </div>

      {(error || actionError) && <p className="text-sm text-red-600">{error || actionError}</p>}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              {resource.columns.map((column) => <th key={column.key} className="px-4 py-3 font-medium">{column.label}</th>)}
              {canWrite && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 last:border-0">
                {resource.columns.map((column) => (
                  <td key={column.key} className="px-4 py-3"><Cell item={item} column={column} onInlineChange={handleInlineChange} /></td>
                ))}
                {canWrite && (
                  <td className="space-x-3 whitespace-nowrap px-4 py-3 text-right">
                    <Link to={`${resource.path}/${item.id}`} className="text-brand underline">{resource.noEdit ? 'View' : 'Edit'}</Link>
                    {resource.duplicable && (
                      <button className="text-slate-600 underline" onClick={() => runAction(() => resourceService.duplicate(resource.api, item.id))}>Duplicate</button>
                    )}
                    {isAdmin && !resource.noDelete && <button className="text-red-600 underline" onClick={() => handleDelete(item)}>Delete</button>}
                  </td>
                )}
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr><td colSpan={resource.columns.length + 1} className="px-4 py-10 text-center text-slate-500">Nothing here yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>{total} {total === 1 ? 'item' : 'items'}</span>
        <div className="flex items-center gap-2">
          <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page} of {pages || 1}</span>
          <button className="btn-secondary" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}
