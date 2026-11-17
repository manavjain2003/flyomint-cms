import { createHash, randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { AdminUser } from '../models/AdminUser.js';
import { sendTemplatedEmail } from '../services/templateService.js';
import { hashPassword, verifyPassword } from '../services/userService.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const TOKEN_LIFETIME = '8h';
const RESET_LIFETIME_MS = 60 * 60_000;
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const presentUser = (user) => ({ id: user.id, name: user.name, username: user.username, email: user.email, role: user.role });

export const login = asyncHandler(async (req, res) => {
  const identifier = String(req.body.username ?? '').trim().toLowerCase();
  const user = await AdminUser.findOne({ $or: [{ username: identifier }, { email: identifier }] }).select('+passwordHash');

  const valid = user && (await verifyPassword(String(req.body.password ?? ''), user.passwordHash));
  if (!valid) throw new ApiError(401, 'Incorrect username or password');
  if (user.isBlocked) throw new ApiError(403, 'Your account has been blocked. Contact the administrator');

  user.lastLoginAt = new Date();
  await user.save();
  ActivityLog.create({ user: user.username, action: 'login', resource: 'auth' }).catch(() => {});

  const token = jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: TOKEN_LIFETIME });
  res.json({ token, user: presentUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json(presentUser(await AdminUser.findById(req.user.id)));
});

/** Always answers the same way so the form cannot be used to discover which emails exist. */
export const forgotPassword = asyncHandler(async (req, res) => {
  const email = String(req.body.email ?? '').trim().toLowerCase();
  const user = await AdminUser.findOne({ email });

  if (user && !user.isBlocked) {
    const token = randomBytes(32).toString('hex');
    user.resetTokenHash = sha256(token);
    user.resetTokenExpires = new Date(Date.now() + RESET_LIFETIME_MS);
    await user.save();
    await sendTemplatedEmail('admin-password-reset', user.email, {
      customer_name: user.name,
      link: `${env.adminUrl}/reset-password?token=${token}`,
    });
  }
  res.json({ message: 'If this email is registered, a reset link has been sent.' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const user = await AdminUser.findOne({
    resetTokenHash: sha256(String(req.body.token ?? '')),
    resetTokenExpires: { $gt: new Date() },
  }).select('+resetTokenHash +resetTokenExpires');
  if (!user) throw new ApiError(400, 'This reset link is invalid or has expired');

  user.passwordHash = await hashPassword(req.body.password);
  user.resetTokenHash = undefined;
  user.resetTokenExpires = undefined;
  await user.save();
  res.json({ message: 'Password updated. You can now sign in.' });
});

export const changePassword = asyncHandler(async (req, res) => {
  const user = await AdminUser.findById(req.user.id).select('+passwordHash');
  if (!(await verifyPassword(String(req.body.currentPassword ?? ''), user.passwordHash))) {
    throw new ApiError(400, 'Current password is incorrect');
  }
  user.passwordHash = await hashPassword(req.body.newPassword);
  await user.save();
  res.json({ message: 'Password changed' });
});
