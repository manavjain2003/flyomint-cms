import { createHash } from 'node:crypto';
import { env } from '../config/env.js';

/** Deletes an asset from Cloudinary. Needs API key and secret; silently skipped when not configured. */
export async function destroyImage(publicId) {
  const { cloudName, apiKey, apiSecret } = env.cloudinary;
  if (!publicId || !cloudName || !apiKey || !apiSecret) return;

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHash('sha1')
    .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest('hex');

  await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: 'POST',
    body: new URLSearchParams({ public_id: publicId, timestamp, api_key: apiKey, signature }),
  });
}
