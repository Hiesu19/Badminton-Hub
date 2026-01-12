import api from '@booking/shared/api/axiosInstance.js';

export const fetchAdminUsers = (params) => api.get('/admin/users', { params });
export const fetchAdminUserDetail = (id) => api.get(`/admin/users/${id}`);
export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`);
export const createOwnerFromUser = (userId) =>
  api.post(`/admin/users/owners/${userId}`);
export const fetchAdminOwnerDetail = (ownerId) =>
  api.get(`/admin/users/owners/${ownerId}`);
export const updateAdminOwner = (ownerId, payload) =>
  api.put(`/admin/users/owners/${ownerId}`, payload);
export const deleteAdminOwner = (ownerId) =>
  api.delete(`/admin/users/owners/${ownerId}`);
