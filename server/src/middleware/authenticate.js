import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AdminUser } from '../models/AdminUser.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/** Validates the bearer token and loads the user, so blocked or deleted users lose access immediately. */
export const authenticate = asyncHandler(async (req, _res, next) => {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');
  if (scheme !== 'Bearer' || !token) throw new ApiError(401, 'Authentication required');

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new ApiError(401, 'Session expired. Please sign in again');
  }

  const user = await AdminUser.findById(payload.id);
  if (!user || user.isBlocked) throw new ApiError(401, 'Your account is not active');

  req.user = { id: user.id, username: user.username, name: user.name, role: user.role };
  next();
});

export const requireRole = (...roles) => (req, _res, next) =>
  roles.includes(req.user.role) ? next() : next(new ApiError(403, 'You do not have permission to do this'));
