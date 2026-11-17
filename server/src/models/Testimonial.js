import { defineModel } from './helpers/defineModel.js';
import { activePlugin, auditPlugin } from './plugins/index.js';
import { imageField } from './schemas/fields.js';

export const Testimonial = defineModel(
  'Testimonial',
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    review: { type: String, required: true },
    photo: imageField,
  },
  { plugins: [activePlugin, auditPlugin] },
);
