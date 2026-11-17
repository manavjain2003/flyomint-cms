import { ROLES } from '../constants/content.js';
import { defineModel } from './helpers/defineModel.js';

export const AdminUser = defineModel('AdminUser', {
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: Object.values(ROLES), default: ROLES.EDITOR },
  isBlocked: { type: Boolean, default: false },
  lastLoginAt: Date,
  resetTokenHash: { type: String, select: false },
  resetTokenExpires: { type: Date, select: false },
});
