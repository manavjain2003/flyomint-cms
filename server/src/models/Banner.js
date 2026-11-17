import { BANNER_POSITIONS } from '../constants/content.js';
import { defineModel } from './helpers/defineModel.js';
import { activePlugin, auditPlugin } from './plugins/index.js';
import { imageField } from './schemas/fields.js';

export const Banner = defineModel(
  'Banner',
  {
    title: { type: String, required: true, trim: true },
    text: { type: String, trim: true },
    buttonLabel: { type: String, trim: true },
    buttonLink: { type: String, trim: true },
    desktopImage: imageField,
    mobileImage: imageField,
    startDate: Date,
    endDate: Date,
    order: { type: Number, default: 0 },
    position: { type: String, enum: BANNER_POSITIONS, default: 'home' },
  },
  { plugins: [activePlugin, auditPlugin] },
);
