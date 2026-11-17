import rateLimit from 'express-rate-limit';

const limiter = (windowMinutes, max, message) =>
  rateLimit({ windowMs: windowMinutes * 60_000, max, standardHeaders: true, legacyHeaders: false, message: { error: message } });

export const formLimiter = limiter(15, 20, 'Too many submissions. Please try again later.');
export const loginLimiter = limiter(15, 20, 'Too many login attempts. Please try again later.');
export const trackLimiter = limiter(1, 120, 'Too many requests.');
