import { defineModel } from './helpers/defineModel.js';
import { activePlugin, auditPlugin } from './plugins/index.js';

export const Announcement = defineModel(
  'Announcement',
  {
    message: { type: String, required: true, trim: true },
    link: { type: String, trim: true },
    startDate: Date,
    endDate: Date,
  },
  { plugins: [activePlugin, auditPlugin] },
);
