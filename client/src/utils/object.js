/** Reads a dotted path, e.g. getPath(values, 'baggage.cabin'). */
export function getPath(object, path) {
  if (!path) return undefined;
  return path.split('.').reduce((current, key) => current?.[key], object);
}

/** Returns a copy of `object` with the dotted path set (the original is not mutated). */
export function setPath(object, path, value) {
  const [key, ...rest] = path.split('.');
  const next = Array.isArray(object) ? [...object] : { ...object };
  next[key] = rest.length === 0 ? value : setPath(object?.[key] ?? {}, rest.join('.'), value);
  return next;
}

export const toQueryString = (params = {}) =>
  new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  ).toString();
