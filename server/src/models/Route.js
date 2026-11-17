import { LOCATION_TYPES } from '../constants/content.js';
import { defineModel } from './helpers/defineModel.js';
import { activePlugin, auditPlugin, publishPlugin, seoPlugin, slugPlugin } from './plugins/index.js';
import { faqSchema, imageField } from './schemas/fields.js';
import { Schema } from 'mongoose';

const popularFlightSchema = new Schema(
  { airline: String, flightNumber: String, departure: String, arrival: String, duration: String, fare: Number },
  { _id: false },
);

export const Route = defineModel(
  'Route',
  {
    type: { type: String, enum: LOCATION_TYPES, required: true },
    fromCity: { type: 'ObjectId', ref: 'City', required: true },
    toCity: { type: 'ObjectId', ref: 'City', required: true },
    name: { type: String, required: true, trim: true },
    heading: { type: String, trim: true },
    description: String,
    bannerImage: imageField,
    fareMode: { type: String, enum: ['auto', 'manual'], default: 'auto' },
    manualFare: Number,
    airlines: [{ type: 'ObjectId', ref: 'Airline' }],
    duration: String,
    distance: String,
    flightsPerDay: Number,
    firstFlight: String,
    lastFlight: String,
    bestTimeToBook: String,
    popularFlights: [popularFlightSchema],
    faqs: [faqSchema],
    seoText: String,
    isFeatured: { type: Boolean, default: false },
  },
  {
    plugins: [[slugPlugin, { source: 'name' }], publishPlugin, activePlugin, seoPlugin, auditPlugin],
    indexes: [[{ fromCity: 1, toCity: 1 }], [{ type: 1, isFeatured: 1 }]],
  },
);
