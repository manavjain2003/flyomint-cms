import { PAGE_KEYS } from '../constants/paths.js';
import { defineModel } from './helpers/defineModel.js';
import { auditPlugin, publishPlugin, seoPlugin } from './plugins/index.js';
import { faqSchema, imageField } from './schemas/fields.js';

/** One document per fixed page: static pages (about, privacy...) and special fare pages. */
export const Page = defineModel(
  'Page',
  {
    key: { type: String, required: true, unique: true, enum: PAGE_KEYS },
    urlPath: { type: String, trim: true },
    title: { type: String, trim: true },
    heading: { type: String, trim: true },
    banner: imageField,
    content: String,
    eligibility: String,
    requiredDocuments: String,
    faqs: [faqSchema],
  },
  { plugins: [publishPlugin, seoPlugin, auditPlugin] },
);
