import api from '@booking/shared/api/axiosInstance.js';

export async function fetchPublicImages({
  type = 'gallery',
  supperCourtId,
} = {}) {
  const params = { type };
  if (supperCourtId) params.supperCourtId = supperCourtId;
  const { data } = await api.get('/images', { params });
  const payload = data?.data ?? data;
  return Array.isArray(payload) ? payload : [];
}
