import { cache } from '../services/cacheService.js';

/** Caches successful public GET responses for a short time. */
export function publicCache(req, res, next) {
  if (req.method !== 'GET') return next();

  const key = req.originalUrl;
  const hit = cache.get(key);
  if (hit) return res.type(hit.type).send(hit.body);

  const send = res.send.bind(res);
  res.send = (body) => {
    if (res.statusCode === 200) cache.set(key, { type: res.get('Content-Type') ?? 'application/json', body });
    return send(body);
  };
  return next();
}

/** Clears the public cache after any successful admin change. */
export function invalidateCacheOnWrite(req, res, next) {
  if (req.method !== 'GET') {
    res.on('finish', () => res.statusCode < 400 && cache.clear());
  }
  next();
}
