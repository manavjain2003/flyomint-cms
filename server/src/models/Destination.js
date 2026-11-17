import { Schema } from 'mongoose';
import { defineModel } from './helpers/defineModel.js';
import { activePlugin, auditPlugin, publishPlugin, seoPlugin, slugPlugin } from './plugins/index.js';
import { faqSchema, imageField } from './schemas/fields.js';

const cityFareSchema = new Schema({ fromCity: { type: 'ObjectId', ref: 'City' }, fare: Number }, { _id: false });

export const Destination = defineModel(
  'Destination',
  {
    name: { type: String, required: true, trim: true },
    kind: { type: String, enum: ['city', 'country'], default: 'city' },
    heading: { type: String, trim: true },
    description: String,
    bannerImage: imageField,
    cheapestFares: [cityFareSchema],
    popularRoutes: [{ type: 'ObjectId', ref: 'Route' }],
    airlines: [{ type: 'ObjectId', ref: 'Airline' }],
    bestTimeToVisit: String,
    travelTips: String,
    faqs: [faqSchema],
    isPopular: { type: Boolean, default: false },
  },
  { plugins: [[slugPlugin, { source: 'name' }], publishPlugin, activePlugin, seoPlugin, auditPlugin] },
);
