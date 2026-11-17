import { ENQUIRY_STATUS } from '../constants/content.js';
import { defineModel } from './helpers/defineModel.js';

export const Enquiry = defineModel('Enquiry', {
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  subject: { type: String, trim: true },
  message: { type: String, required: true, trim: true, maxlength: 3000 },
  city: { type: String, trim: true },
  status: { type: String, enum: ENQUIRY_STATUS, default: 'new' },
  notes: { type: String, trim: true },
});
