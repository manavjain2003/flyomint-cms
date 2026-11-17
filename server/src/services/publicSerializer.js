import { omit } from '../utils/object.js';
import { toPublicJson } from './seoService.js';

const PRIVATE_FIELDS = ['createdBy', 'updatedBy'];

/** Compact representation used in public lists. */
export const toListItem = (doc) => omit(doc.toJSON(), PRIVATE_FIELDS);

/** Full representation of one document: enriched by the resource and with computed SEO. */
export async function toDetail(resource, doc) {
  const extras = (await resource.public.transform?.(doc)) ?? {};
  return toPublicJson(resource.name, { ...doc.toJSON(), ...extras });
}
