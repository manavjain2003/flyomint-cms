import { LOCATION_TYPES } from '../constants/content.js';
import { defineModel } from './helpers/defineModel.js';
import { activePlugin, auditPlugin, seoPlugin, slugPlugin } from './plugins/index.js';
import { faqSchema, imageField } from './schemas/fields.js';

export const Airline = defineModel(
  'Airline',
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    logo: imageField,
    type: { type: String, enum: LOCATION_TYPES, default: 'domestic' },
    isPopular: { type: Boolean, default: false },
    about: String,
    baggage: { cabin: String, checkin: String },
    webCheckin: String,
    cancellationRefund: String,
    customerCare: { phone: String, email: String, website: String },
    popularRoutes: [{ type: 'ObjectId', ref: 'Route' }],
    offers: [{ type: 'ObjectId', ref: 'Offer' }],
    faqs: [faqSchema],
  },
  { plugins: [[slugPlugin, { source: 'name' }], activePlugin, seoPlugin, auditPlugin] },
);
