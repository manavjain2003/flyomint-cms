const store = new Map();
const DEFAULT_TTL_MS = 60_000;

/** Small in-memory cache for public API responses. Cleared whenever admin content changes. */
export const cache = {
  get(key) {
    const entry = store.get(key);
    if (!entry) return undefined;
    if (entry.expires < Date.now()) {
      store.delete(key);
      return undefined;
    }
    return entry.value;
  },
  set(key, value, ttlMs = DEFAULT_TTL_MS) {
    store.set(key, { value, expires: Date.now() + ttlMs });
  },
  clear() {
    store.clear();
  },
};
