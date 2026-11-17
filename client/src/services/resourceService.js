import { apiClient } from './apiClient.js';
import { toQueryString } from '../utils/object.js';

/** Everything the admin panel can ask the API about a resource (collection, settings group or page). */
export const resourceService = {
  list: (api, params) => apiClient.get(`/admin/${api}?${toQueryString(params)}`),
  get: (api, id) => apiClient.get(`/admin/${api}/${id}`),
  create: (api, data) => apiClient.post(`/admin/${api}`, data),
  update: (api, id, data) => apiClient.put(`/admin/${api}/${id}`, data),
  remove: (api, id) => apiClient.delete(`/admin/${api}/${id}`),
  duplicate: (api, id) => apiClient.post(`/admin/${api}/${id}/duplicate`),
  previewLink: (api, id) => apiClient.get(`/admin/${api}/${id}/preview-link`),

  getConfig: (key) => apiClient.get(`/admin/site-config/${key}`),
  saveConfig: (key, data) => apiClient.put(`/admin/site-config/${key}`, data),
  getPage: (key) => apiClient.get(`/admin/pages/${key}`),
  savePage: (key, data) => apiClient.put(`/admin/pages/${key}`, data),
  pagePreviewLink: (key) => apiClient.get(`/admin/pages/${key}/preview-link`),

  importFile(api, file) {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.upload(`/admin/${api}/import`, formData);
  },
  downloadImportTemplate: (api) => apiClient.download(`/admin/${api}/import-template`, `${api}-template.xlsx`),
  exportFile: (api, params) => apiClient.download(`/admin/${api}/export?${toQueryString(params)}`, `${api}.xlsx`),
};
