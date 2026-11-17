export const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '—');
export const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : '—');

/** ISO string -> value accepted by <input type="datetime-local">. */
export function toDateTimeInput(value) {
  if (!value) return '';
  const date = new Date(value);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export const toDateInput = (value) => (value ? String(value).slice(0, 10) : '');
