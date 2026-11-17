import { defineModel } from './helpers/defineModel.js';
import { activePlugin, auditPlugin } from './plugins/index.js';
import { imageField } from './schemas/fields.js';

export const Popup = defineModel(
  'Popup',
  {
    name: { type: String, required: true, trim: true },
    kind: { type: String, enum: ['offer', 'newsletter'], default: 'offer' },
    title: { type: String, trim: true },
    text: { type: String, trim: true },
    image: imageField,
    buttonLabel: { type: String, trim: true },
    buttonLink: { type: String, trim: true },
    trigger: { type: String, enum: ['on-load', 'after-delay', 'on-exit'], default: 'after-delay' },
    delaySeconds: { type: Number, default: 5 },
    oncePerVisitor: { type: Boolean, default: true },
    showOnMobile: { type: Boolean, default: true },
  },
  { plugins: [activePlugin, auditPlugin] },
);
