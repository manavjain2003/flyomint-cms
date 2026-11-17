import { defineModel } from './helpers/defineModel.js';
import { auditPlugin, publishPlugin, seoPlugin, slugPlugin } from './plugins/index.js';
import { imageField } from './schemas/fields.js';

export const Blog = defineModel(
  'Blog',
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    image: imageField,
    excerpt: { type: String, trim: true },
    content: String,
    category: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    author: { type: String, trim: true },
    views: { type: Number, default: 0 },
  },
  { plugins: [slugPlugin, publishPlugin, seoPlugin, auditPlugin], indexes: [[{ category: 1 }]] },
);
