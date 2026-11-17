import { LOCATION_TYPES } from '../constants/content.js';
import { defineModel } from './helpers/defineModel.js';
import { activePlugin, auditPlugin } from './plugins/index.js';
import { imageField } from './schemas/fields.js';

export const City = defineModel(
  'City',
  {
    name: { type: String, required: true, trim: true },
    airportName: { type: String, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, minlength: 3, maxlength: 3 },
    country: { type: String, required: true, trim: true },
    type: { type: String, enum: LOCATION_TYPES, default: 'domestic' },
    isPopular: { type: Boolean, default: false },
    terminal: { type: String, trim: true },
    address: { type: String, trim: true },
    image: imageField,
    description: { type: String, trim: true },
  },
  { plugins: [activePlugin, auditPlugin] },
);
