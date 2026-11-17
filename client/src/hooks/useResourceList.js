import { useCallback, useEffect, useState } from 'react';
import { resourceService } from '../services/resourceService.js';

export function useResourceList(api, params) {
  const [state, setState] = useState({ items: [], total: 0, pages: 1, loading: true, error: '' });
  const paramsKey = JSON.stringify(params);

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const { items, total, pages } = await resourceService.list(api, JSON.parse(paramsKey));
      setState({ items, total, pages, loading: false, error: '' });
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: error.message }));
    }
  }, [api, paramsKey]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
