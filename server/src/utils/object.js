const PROTECTED_FIELDS = ['id', '_id', 'createdAt', 'updatedAt', '__v', 'createdBy', 'updatedBy'];

/** Removes server-managed fields so clients cannot overwrite them. */
export function sanitizeBody(body = {}) {
  return Object.fromEntries(Object.entries(body).filter(([field]) => !PROTECTED_FIELDS.includes(field)));
}

export const omit = (object, keys) =>
  Object.fromEntries(Object.entries(object).filter(([key]) => !keys.includes(key)));

export const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const stripHtml = (html = '') => String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export const toBoolean = (value) => value === true || value === 'true';

/** Replaces {{placeholders}} in a string with values. Unknown placeholders are left empty. */
export const fillPlaceholders = (text = '', values = {}) =>
  text.replace(/{{\s*(\w+)\s*}}/g, (_match, name) => values[name] ?? '');
