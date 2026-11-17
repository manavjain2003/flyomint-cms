import { defineModel } from './helpers/defineModel.js';
import { activePlugin, auditPlugin } from './plugins/index.js';

export const Redirect = defineModel(
  'Redirect',
  {
    fromPath: { type: String, required: true, unique: true, trim: true },
    toPath: { type: String, required: true, trim: true },
    statusCode: { type: Number, enum: [301, 302], default: 301 },
  },
  { plugins: [activePlugin, auditPlugin] },
);
