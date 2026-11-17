import { TRUST_KINDS } from '../constants/content.js';
import { defineModel } from './helpers/defineModel.js';
import { activePlugin, auditPlugin } from './plugins/index.js';
import { imageField } from './schemas/fields.js';

export const TrustItem = defineModel(
  'TrustItem',
  {
    kind: { type: String, enum: TRUST_KINDS, required: true },
    title: { type: String, required: true, trim: true },
    image: imageField,
    value: { type: String, trim: true },
    link: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { plugins: [activePlugin, auditPlugin] },
);
