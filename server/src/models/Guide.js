import { defineModel } from './helpers/defineModel.js';
import { auditPlugin, publishPlugin, seoPlugin, slugPlugin } from './plugins/index.js';

export const Guide = defineModel(
  'Guide',
  {
    title: { type: String, required: true, trim: true },
    content: String,
    order: { type: Number, default: 0 },
  },
  { plugins: [slugPlugin, publishPlugin, seoPlugin, auditPlugin] },
);
