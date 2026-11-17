import { DEAL_PLACEMENTS, DEAL_SECTIONS } from '../constants/content.js';
import { defineModel } from './helpers/defineModel.js';
import { activePlugin, auditPlugin } from './plugins/index.js';

export const Deal = defineModel(
  'Deal',
  {
    section: { type: String, enum: DEAL_SECTIONS, required: true },
    title: { type: String, required: true, trim: true },
    route: { type: 'ObjectId', ref: 'Route' },
    fromCity: { type: 'ObjectId', ref: 'City' },
    airline: { type: 'ObjectId', ref: 'Airline' },
    fareMode: { type: String, enum: ['auto', 'manual'], default: 'auto' },
    manualFare: Number,
    link: { type: String, trim: true },
    startDate: Date,
    endDate: Date,
    showOn: [{ type: String, enum: DEAL_PLACEMENTS }],
    order: { type: Number, default: 0 },
  },
  { plugins: [activePlugin, auditPlugin] },
);
