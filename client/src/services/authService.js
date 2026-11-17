import { apiClient } from './apiClient.js';

export const authService = {
  login: (username, password) => apiClient.post('/auth/login', { username, password }),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => apiClient.post('/auth/reset-password', { token, password }),
  changePassword: (currentPassword, newPassword) =>
    apiClient.post('/auth/change-password', { currentPassword, newPassword }),
};
