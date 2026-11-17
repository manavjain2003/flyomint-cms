import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resourceService } from '../services/resourceService.js';
import { setPath } from '../utils/object.js';
import { slugify } from '../utils/slugify.js';

/**
 * State and persistence for one editor screen. Works for the three resource kinds:
 * "collection" (item id from the route), "singleton" (settings group) and "page" (fixed page).
 */
export function useResourceEditor(resource) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { kind, api } = resource;

  const isNew = kind === 'collection' && id === 'new';
  const initialValues = useMemo(
    () => ({ ...(resource.publish && { status: 'draft' }), seo: {}, ...resource.defaultValues }),
    [resource],
  );

  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Stop generating the slug from the title once it has been edited by hand or loaded from the server.
  const slugEdited = useRef(!isNew);

  useEffect(() => {
    slugEdited.current = !isNew;
    if (isNew) {
      setValues(initialValues);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    const load = { singleton: () => resourceService.getConfig(api), page: () => resourceService.getPage(api), collection: () => resourceService.get(api, id) }[kind];

    setLoading(true);
    load()
      .then((data) => !cancelled && setValues({ ...initialValues, ...data }))
      .catch((error) => !cancelled && setFeedback({ type: 'error', message: error.message }))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [api, id, isNew, kind, initialValues]);

  const changeField = (name, value) => {
    setValues((current) => {
      let next = setPath(current, name, name === 'slug' ? slugify(value) : value);
      if (name === 'slug') slugEdited.current = true;
      if (name === resource.slugSource && isNew && !slugEdited.current) next = setPath(next, 'slug', slugify(value));
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    setFeedback({ type: '', message: '' });
    try {
      if (kind === 'singleton') await resourceService.saveConfig(api, values);
      else if (kind === 'page') await resourceService.savePage(api, values);
      else if (isNew) await resourceService.create(api, values);
      else await resourceService.update(api, id, values);

      if (isNew) {
        navigate(resource.path);
        return;
      }
      setFeedback({ type: 'success', message: 'Changes saved' });
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const openPreview = async () => {
    try {
      const { url } = kind === 'page' ? await resourceService.pagePreviewLink(api) : await resourceService.previewLink(api, id);
      window.open(url, '_blank', 'noopener');
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    }
  };

  return { id, isNew, values, loading, saving, feedback, changeField, save, openPreview };
}
