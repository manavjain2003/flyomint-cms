import { env } from '../config/env.js';
import { session } from './tokenStorage.js';

let onUnauthorized = () => {};

/** Lets the auth layer react when the API rejects the current session. */
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

async function send(path, { method = 'GET', body, formData } = {}) {
  const token = session.getToken();
  const headers = { ...(token && { Authorization: `Bearer ${token}` }) };
  if (body) headers['Content-Type'] = 'application/json';

  const response = await fetch(`${env.apiUrl}/api${path}`, {
    method,
    headers,
    body: formData ?? (body ? JSON.stringify(body) : undefined),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    if (response.status === 401 && token) onUnauthorized();
    throw new Error(data.error || 'Request failed. Please try again.');
  }
  return response;
}

const json = async (response) => (response.status === 204 ? null : response.json());

export const apiClient = {
  get: async (path) => json(await send(path)),
  post: async (path, body) => json(await send(path, { method: 'POST', body })),
  put: async (path, body) => json(await send(path, { method: 'PUT', body })),
  delete: async (path) => json(await send(path, { method: 'DELETE' })),
  upload: async (path, formData) => json(await send(path, { method: 'POST', formData })),

  /** Downloads a protected file (Excel export, backup) through the browser. */
  async download(path, filename) {
    const blob = await (await send(path)).blob();
    const link = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: filename });
    link.click();
    URL.revokeObjectURL(link.href);
  },
};
