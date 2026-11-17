import { env } from '../config/env.js';
import { cache } from './cacheService.js';

const FARE_CACHE_MS = 15 * 60_000;

/**
 * Live fare lookup. Plug in your flight supplier by pointing FARE_API_URL to an endpoint that
 * answers GET ?from=DEL&to=BOM with { "fare": 3499 }. Returns null when unavailable.
 */
async function fetchLiveFare(fromCode, toCode) {
  if (!env.fareApiUrl || !fromCode || !toCode) return null;

  const cacheKey = `fare:${fromCode}:${toCode}`;
  const cached = cache.get(cacheKey);
  if (cached !== undefined) return cached;

  try {
    const response = await fetch(`${env.fareApiUrl}?from=${fromCode}&to=${toCode}`, {
      signal: AbortSignal.timeout(3000),
    });
    const { fare } = await response.json();
    const value = Number.isFinite(Number(fare)) ? Number(fare) : null;
    cache.set(cacheKey, value, FARE_CACHE_MS);
    return value;
  } catch {
    return null;
  }
}

/** Cheapest fare for a route (cities must be populated): live when mode is "auto", else the manual fare. */
export async function resolveRouteFare(route) {
  if (route?.fareMode === 'auto') {
    const live = await fetchLiveFare(route.fromCity?.code, route.toCity?.code);
    if (live !== null) return live;
  }
  return route?.manualFare ?? null;
}
