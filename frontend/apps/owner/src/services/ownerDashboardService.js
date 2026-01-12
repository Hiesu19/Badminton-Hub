import api from '@booking/shared/api/axiosInstance.js';

export const fetchOwnerDashboard = () => api.get('/owner/dashboard');
