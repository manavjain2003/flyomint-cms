import { all, activeOnly, livePublishable, liveWindowed } from '../utils/publicFilters.js';
import { escapeRegex, toBoolean } from '../utils/object.js';

/** Base filter for what the public API may expose of a resource. */
export function publicFilterFor(resource) {
  const { mode, window, extraFilter } = resource.public;
  const base = { publishable: livePublishable, active: activeOnly, windowed: () => liveWindowed(...window) }[mode]();
  return extraFilter ? all(base, extraFilter()) : base;
}

export function buildSearchFilter(searchFields = [], term) {
  if (!term || searchFields.length === 0) return {};
  return { $or: searchFields.map((field) => ({ [field]: { $regex: escapeRegex(String(term)), $options: 'i' } })) };
}

/** Copies whitelisted query-string filters, turning "true"/"false" into booleans. */
export function pickFilters(allowed = [], query = {}) {
  const filter = {};
  allowed.forEach((field) => {
    const value = query[field];
    if (value === undefined || value === '') return;
    filter[field] = value === 'true' || value === 'false' ? toBoolean(value) : value;
  });
  return filter;
}

export function buildAdminFilter(resource, query) {
  const filter = { ...pickFilters(resource.filterFields, query), ...buildSearchFilter(resource.searchFields, query.search) };
  if (query.from || query.to) {
    filter.createdAt = {
      ...(query.from && { $gte: new Date(query.from) }),
      ...(query.to && { $lte: new Date(`${query.to}T23:59:59.999Z`) }),
    };
  }
  return filter;
}
