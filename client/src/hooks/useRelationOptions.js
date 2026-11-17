import { useEffect, useState } from 'react';
import { resourceService } from '../services/resourceService.js';

const CACHE_MS = 60_000;
const cache = new Map();

/** Loads the documents of a collection to fill a dropdown. Results are cached briefly. */
export function useRelationOptions(collection) {
  const [options, setOptions] = useState(() => cache.get(collection)?.items ?? []);

  useEffect(() => {
    const cached = cache.get(collection);
    if (cached && Date.now() - cached.at < CACHE_MS) return;

    resourceService.list(collection, { limit: 500 }).then(({ items }) => {
      cache.set(collection, { items, at: Date.now() });
      setOptions(items);
    });
  }, [collection]);

  return options;
}
