import api from '@booking/shared/api/axiosInstance.js';

export const requestGalleryImageUpload = ({
  supperCourtId,
  contentType,
  position,
}) =>
  api.post('/uploads/presigned-supper-court-gallery-image', {
    supperCourtId,
    contentType,
    position,
  });

export const createOwnerImage = (payload) => api.post('/owner/images', payload);

export const fetchOwnerImages = async ({ type, supperCourtId } = {}) => {
  const params = {};
  if (type) params.type = type;
  if (supperCourtId) params.supperCourtId = supperCourtId;
  const { data } = await api.get('/images', { params });
  const payload = data?.data ?? data;
  return Array.isArray(payload) ? payload : [];
};
