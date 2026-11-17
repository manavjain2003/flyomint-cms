import { env } from '../config/env.js';

const { cloudName, uploadPreset } = env.cloudinary;

/** Inserts Cloudinary's automatic quality/format optimisation into the delivery URL. */
const optimise = (url) => url.replace('/upload/', '/upload/q_auto,f_auto/');

/** Uploads an image straight from the browser and returns what the media library needs to store. */
export async function uploadImage(file, folder = 'general') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Image upload failed');

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
