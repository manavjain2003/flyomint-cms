import { env } from '../config/env.js';

const { cloudName, uploadPreset } = env.cloudinary;
const PLACEHOLDERS = ['', 'your_cloud_name', 'your_unsigned_preset'];

/** True when both Cloudinary settings were filled in (the example values do not count). */
export const isUploadConfigured = () =>
  ![cloudName, uploadPreset].some((value) => PLACEHOLDERS.includes(value ?? ''));

/** Turns Cloudinary's short error messages into steps the admin can follow. */
function explain(message = '') {
  if (/preset not found/i.test(message)) {
    return `Cloudinary cannot find the upload preset "${uploadPreset}" in the cloud "${cloudName}". In Cloudinary open Settings, Upload, Upload presets and create an Unsigned preset with exactly this name, or change VITE_CLOUDINARY_UPLOAD_PRESET to the name of your existing preset.`;
  }
  if (/whitelisted|unsigned/i.test(message)) {
    return `The upload preset "${uploadPreset}" must have its Signing mode set to Unsigned.`;
  }
  if (/invalid cloud_name/i.test(message)) {
    return `Cloudinary does not know the cloud name "${cloudName}". Check VITE_CLOUDINARY_CLOUD_NAME.`;
  }
  return message || 'Image upload failed';
}

/** Inserts Cloudinary's automatic quality/format optimisation into the delivery URL. */
const optimise = (url) => url.replace('/upload/', '/upload/q_auto,f_auto/');

/** Uploads an image straight from the browser and returns what the media library needs to store. */
export async function uploadImage(file, folder = 'general') {
  if (!isUploadConfigured()) {
    throw new Error('Image upload is not set up. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in the client environment variables, then rebuild or redeploy.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(explain(data.error?.message));

  return {
    url: optimise(data.secure_url),
    publicId: data.public_id,
    name: file.name,
    folder,
    bytes: data.bytes,
    width: data.width,
    height: data.height,
    format: data.format,
  };
}
