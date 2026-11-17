import { MEDIA_FOLDERS } from '../constants/content.js';
import { defineModel } from './helpers/defineModel.js';
import { auditPlugin } from './plugins/index.js';

export const Media = defineModel(
  'Media',
  {
    url: { type: String, required: true },
    publicId: String,
    name: { type: String, trim: true },
    folder: { type: String, enum: MEDIA_FOLDERS, default: 'general' },
    alt: { type: String, trim: true },
    bytes: Number,
    width: Number,
    height: Number,
    format: String,
  },
  { plugins: [auditPlugin] },
);
