import api from '@booking/shared/api/axiosInstance.js';

export const fetchOwnerDashboard = () => api.get('/owner/dashboard');
export const fetchOwnerCoverage = (date) =>
  api.get('/owner/dashboard/coverage', { params: { date } });
