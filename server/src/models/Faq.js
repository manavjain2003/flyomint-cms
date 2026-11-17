import { FAQ_CATEGORIES, FAQ_PLACEMENTS } from '../constants/content.js';
import { defineModel } from './helpers/defineModel.js';
import { activePlugin, auditPlugin } from './plugins/index.js';

export const Faq = defineModel(
  'Faq',
  {
    category: { type: String, enum: FAQ_CATEGORIES, default: 'booking' },
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    showOn: [{ type: String, enum: FAQ_PLACEMENTS }],
    order: { type: Number, default: 0 },
  },
  { plugins: [activePlugin, auditPlugin] },
);
