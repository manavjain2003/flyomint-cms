import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useResourceList } from '../../hooks/useResourceList.js';
import { resourceService } from '../../services/resourceService.js';
import { formatDate, formatDateTime } from '../../utils/format.js';
import { getPath } from '../../utils/object.js';
import Badge from '../ui/Badge.jsx';
import Icon from '../ui/Icon.jsx';
import ImportPanel from './ImportPanel.jsx';

const PAGE_SIZE = 20;
const SKELETON_ROWS = [1, 2, 3, 4, 5];

function Cell({ item, column, isFirst, editPath, onInlineChange }) {
  const value = getPath(item, column.key);
  if (column.render) return column.render(item);

  switch (column.type) {
    case 'date': return formatDate(value);
    case 'datetime': return formatDateTime(value);
    case 'boolean': return <Badge tone={value ? 'green' : 'slate'} label={value ? 'Yes' : 'No'} />;
    case 'badge': return value ? <Badge value={value} /> : '—';
    case 'image': return value?.url ? <img src={value.url} alt="" className="h-9 w-14 rounded-md border border-slate-200 object-cover" /> : <span className="text-slate-300">—</span>;
    case 'inlineSelect':
      return (
        <select className="form-input w-36 py-1" value={value} onChange={(e) => onInlineChange(item, column.key, e.target.value)}>
          {column.options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      );
    default:
      if (isFirst && editPath) return <Link to={editPath} className="font-semibold text-ink hover:text-brand">{value ?? '—'}</Link>;
      return value ?? '—';
  }
}

/** List screen built from a resource definition: search, filters, paging, import/export, row actions. */
export default function ResourceList({ resource }) {
  const { isAdmin } = useAuth();
  const notify = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [range, setRange] = useState({ from: '', to: '' });
  const [importOpen, setImportOpen] = useState(false);

  const query = { ...resource.baseFilter, ...filters, ...range, search, page, limit: PAGE_SIZE };
  const { items, total, pages, loading, error, reload } = useResourceList(resource.api, query);
  const { ListExtras } = resource;

  const canWrite = !resource.readOnly;
  const hasFilters = Boolean(search || range.from || range.to || Object.values(filters).some(Boolean));
  const resetPage = (setter) => (value) => { setter(value); setPage(1); };

  const runAction = async (action, successMessage) => {
    try {
      await action();
      if (successMessage) notify('success', successMessage);
      await reload();
    } catch (err) {
      notify('error', err.message);
    }
  };
  const handleDelete = (item) => {
    if (window.confirm(`Delete this ${resource.itemName} permanently? This cannot be undone.`)) {
      runAction(() => resourceService.remove(resource.api, item.id), 'Deleted');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold">{resource.title}</h1>
          {resource.description && <p className="mt-1 max-w-2xl text-sm text-slate-600">{resource.description}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {resource.importable && (
            <button className="btn-secondary" onClick={() => setImportOpen((open) => !open)}><Icon name="upload" className="h-4 w-4" />Bulk upload</button>
          )}
          {resource.exportable && (
            <button className="btn-secondary" onClick={() => runAction(() => resourceService.exportFile(resource.api, { ...resource.baseFilter, ...filters, ...range, search }))}>
              <Icon name="download" className="h-4 w-4" />Export to Excel
            </button>
          )}
          {canWrite && !resource.noCreate && (
            <Link to={`${resource.path}/new`} className="btn-primary"><Icon name="plus" className="h-4 w-4" />Create {resource.itemName}</Link>
          )}
        </div>
      </div>

      {importOpen && <ImportPanel resource={resource} onDone={reload} />}
      {ListExtras && <ListExtras reload={reload} />}

      <div className="panel flex flex-wrap items-end gap-3 p-4">
        <div className="relative min-w-[14rem] flex-1 sm:max-w-xs">
          <Icon name="search" className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input className="form-input pl-9" placeholder={`Search ${resource.title.toLowerCase()}`} aria-label="Search" value={search} onChange={(e) => resetPage(setSearch)(e.target.value)} />
        </div>
        {resource.filters?.map((filter) => (
          <select key={filter.name} aria-label={filter.label} className="form-input w-auto" value={filters[filter.name] ?? ''}
            onChange={(e) => resetPage(setFilters)({ ...filters, [filter.name]: e.target.value })}>
            <option value="">{filter.label}: all</option>
            {filter.options.map((option) => <option key={option.value ?? option} value={option.value ?? option}>{option.label ?? option}</option>)}
          </select>
        ))}
        {resource.dateFilter && ['from', 'to'].map((key) => (
          <label key={key} className="text-xs font-semibold text-slate-500">
            {key === 'from' ? 'From' : 'To'}
            <input type="date" className="form-input mt-1" value={range[key]} onChange={(e) => resetPage(setRange)({ ...range, [key]: e.target.value })} />
          </label>
        ))}
        {hasFilters && (
          <button className="btn-secondary" onClick={() => { setSearch(''); setFilters({}); setRange({ from: '', to: '' }); setPage(1); }}>Clear filters</button>
        )}
      </div>

      {error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                {resource.columns.map((column) => <th key={column.key} className="whitespace-nowrap px-4 py-3 font-semibold">{column.label}</th>)}
                {canWrite && <th className="px-4 py-3"><span className="sr-only">Actions</span></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && items.length === 0 && SKELETON_ROWS.map((row) => (
                <tr key={row} className="animate-pulse">
                  <td colSpan={resource.columns.length + 1} className="px-4 py-4"><div className="h-4 rounded bg-slate-100" /></td>
                </tr>
              ))}
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  {resource.columns.map((column, index) => (
                    <td key={column.key} className="px-4 py-3">
                      <Cell item={item} column={column} isFirst={index === 0} editPath={canWrite ? `${resource.path}/${item.id}` : null} onInlineChange={(row, key, value) => runAction(() => resourceService.update(resource.api, row.id, { [key]: value }), 'Updated')} />
                    </td>
                  ))}
                  {canWrite && (
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <Link to={`${resource.path}/${item.id}`} className="btn-icon" title={resource.noEdit ? 'View' : 'Edit'} aria-label="Edit"><Icon name={resource.noEdit ? 'eye' : 'pencil'} className="h-4 w-4" /></Link>
                      {resource.duplicable && (
                        <button className="btn-icon" title="Duplicate" aria-label="Duplicate" onClick={() => runAction(() => resourceService.duplicate(resource.api, item.id), 'Duplicated as a draft')}><Icon name="copy" className="h-4 w-4" /></button>
                      )}
                      {isAdmin && !resource.noDelete && (
                        <button className="btn-icon hover:bg-rose-50 hover:text-rose-600" title="Delete" aria-label="Delete" onClick={() => handleDelete(item)}><Icon name="trash" className="h-4 w-4" /></button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && items.length === 0 && (
          <div className="px-6 py-14 text-center">
            <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-brand-tint text-brand"><Icon name={hasFilters ? 'search' : 'inbox'} className="h-6 w-6" /></span>
            <p className="font-bold">{hasFilters ? 'Nothing matches these filters' : `No ${resource.title.toLowerCase()} yet`}</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              {hasFilters ? 'Try a different search or clear the filters.' : canWrite && !resource.noCreate ? `Create your first ${resource.itemName} to see it here.` : 'Items appear here when they are added.'}
            </p>
            {!hasFilters && canWrite && !resource.noCreate && (
              <Link to={`${resource.path}/new`} className="btn-primary mt-4">Create {resource.itemName}</Link>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span className="tabular">{total} {total === 1 ? 'item' : 'items'}</span>
        <div className="flex items-center gap-2">
          <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span className="tabular">Page {page} of {pages || 1}</span>
          <button className="btn-secondary" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}
