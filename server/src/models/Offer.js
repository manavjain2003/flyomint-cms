import { OFFER_TYPES } from '../constants/content.js';
import { defineModel } from './helpers/defineModel.js';
import { activePlugin, auditPlugin, publishPlugin, seoPlugin, slugPlugin } from './plugins/index.js';
import { imageField } from './schemas/fields.js';

export const Offer = defineModel(
  'Offer',
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    image: imageField,
    description: String,
    offerType: { type: String, enum: OFFER_TYPES, default: 'flight' },
    couponCode: { type: String, trim: true },
    discount: { type: String, trim: true },
    minBookingAmount: Number,
    terms: String,
    validFrom: Date,
    validTill: Date,
  },
  { plugins: [slugPlugin, publishPlugin, activePlugin, seoPlugin, auditPlugin] },
);
