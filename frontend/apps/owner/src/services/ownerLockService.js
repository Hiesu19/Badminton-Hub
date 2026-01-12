import api from '@booking/shared/api/axiosInstance.js';

export const fetchCourtCalendar = (courtId, date) =>
  api.get(`/public/supper-courts/${courtId}/calendar/${date}`);

export const fetchCourtPriceMatrix = (courtId) =>
  api.get(`/public/supper-courts/${courtId}/price-matrix`);

export const lockCourt = (payload) => api.post('/owner/lock-court', payload);

