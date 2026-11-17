import { env } from '../config/env.js';

/**
 * Verifies a Google reCAPTCHA token.
 * Without RECAPTCHA_SECRET the check is skipped in development and fails in production.
 */
export async function verifyCaptcha(token) {
  if (!env.recaptchaSecret) return !env.isProduction;
  if (!token) return false;

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: env.recaptchaSecret, response: token }),
  });
  const data = await response.json();
  return data.success === true;
}
