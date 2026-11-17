import { TEMPLATE_CHANNELS } from '../constants/content.js';
import { defineModel } from './helpers/defineModel.js';
import { activePlugin, auditPlugin } from './plugins/index.js';

export const Template = defineModel(
  'Template',
  {
    key: { type: String, required: true, trim: true },
    channel: { type: String, enum: TEMPLATE_CHANNELS, required: true },
    name: { type: String, required: true, trim: true },
    subject: { type: String, trim: true },
    body: { type: String, required: true },
    placeholders: [{ type: String, trim: true }],
  },
  { plugins: [activePlugin, auditPlugin], indexes: [[{ key: 1, channel: 1 }, { unique: true }]] },
);
