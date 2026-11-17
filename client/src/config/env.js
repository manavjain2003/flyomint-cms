export const env = {
  apiUrl: import.meta.env.VITE_API_URL,
  idleLogoutMinutes: Number(import.meta.env.VITE_IDLE_LOGOUT_MINUTES) || 20,
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  },
};
