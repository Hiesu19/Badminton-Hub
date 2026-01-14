import api from '@booking/shared/api/axiosInstance.js';

export const fetchAdminBookings = (params) =>
  api.get('/bookings/admin', { params });
