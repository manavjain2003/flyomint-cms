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

/** "5 minutes ago", "yesterday", or the date for anything older than a week. */
export function timeAgo(value) {
  if (!value) return '';
  const seconds = Math.round((Date.now() - new Date(value).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const units = [[60, 'minute'], [3600, 'hour'], [86_400, 'day']];
  for (let i = units.length - 1; i >= 0; i -= 1) {
    const [size, name] = units[i];
    if (seconds >= size) {
      const count = Math.floor(seconds / size);
      if (name === 'day' && count === 1) return 'yesterday';
      if (name === 'day' && count > 7) return new Date(value).toLocaleDateString();
      return `${count} ${name}${count > 1 ? 's' : ''} ago`;
    }
  }
  return '';
}
