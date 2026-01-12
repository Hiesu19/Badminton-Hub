import api from '@booking/shared/api/axiosInstance.js';

export const fetchAdminSuperCourts = (params) =>
  api.get('/supper-courts', { params });
export const fetchAdminSuperCourtDetail = (id) =>
  api.get(`/supper-courts/${id}`);
export const updateAdminSuperCourt = (id, payload) =>
  api.patch(`/supper-courts/${id}`, payload);
export const deleteAdminSuperCourt = (id) => api.delete(`/supper-courts/${id}`);
