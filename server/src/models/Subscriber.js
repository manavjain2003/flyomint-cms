import { SUBSCRIBER_STATUS } from '../constants/content.js';
import { defineModel } from './helpers/defineModel.js';

export const Subscriber = defineModel('Subscriber', {
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  status: { type: String, enum: SUBSCRIBER_STATUS, default: 'pending' },
  token: { type: String, index: true },
  confirmedAt: Date,
});
