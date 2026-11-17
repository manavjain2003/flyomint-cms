import { defineModel } from './helpers/defineModel.js';

/** Lightweight analytics: page views and clicks sent by the website. */
export const PageEvent = defineModel(
  'PageEvent',
  {
    type: { type: String, enum: ['view', 'click'], required: true },
    path: { type: String, trim: true },
    refType: { type: String, trim: true },
    refId: String,
    label: { type: String, trim: true },
  },
  { indexes: [[{ type: 1, createdAt: -1 }], [{ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 400 }]] },
);
