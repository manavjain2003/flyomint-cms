import { CONTENT_STATUS } from '../../constants/content.js';
import { slugify } from '../../utils/slugify.js';
import { seoSchema } from '../schemas/fields.js';

/** Unique `slug`, generated from `options.source` (default "title") when empty. */
export function slugPlugin(schema, { source = 'title' } = {}) {
  schema.add({ slug: { type: String, required: true, unique: true, trim: true, lowercase: true } });
  schema.pre('validate', function generateSlug(next) {
    if (!this.slug && this[source]) this.slug = slugify(this[source]);
    next();
  });
}

/** Draft / published / unpublished / scheduled lifecycle. */
export function publishPlugin(schema) {
  schema.add({
    status: { type: String, enum: Object.values(CONTENT_STATUS), default: CONTENT_STATUS.DRAFT },
    publishAt: Date,
  });
}

export function activePlugin(schema) {
  schema.add({ isActive: { type: Boolean, default: true } });
}

export function seoPlugin(schema) {
  schema.add({ seo: { type: seoSchema, default: () => ({}) } });
}

/** Records who created and last edited a document. */
export function auditPlugin(schema) {
  schema.add({ createdBy: String, updatedBy: String });
}
