import bcrypt from 'bcryptjs';
import { ApiError } from '../utils/ApiError.js';

const MIN_PASSWORD_LENGTH = 8;

export async function hashPassword(password) {
  if (String(password).length < MIN_PASSWORD_LENGTH) {
    throw new ApiError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  return bcrypt.hash(password, 10);
}

export const verifyPassword = (password, hash) => bcrypt.compare(password, hash);
