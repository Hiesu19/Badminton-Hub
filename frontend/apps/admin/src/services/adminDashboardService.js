import api from '../api/axiosInstance.js';

export const fetchAdminCourtStats = () => api.get('/admin/dashboard/courts');
export const fetchAdminUserStats = () => api.get('/admin/dashboard/users');
export const fetchAdminRevenueStats = () => api.get('/admin/dashboard/revenue');

