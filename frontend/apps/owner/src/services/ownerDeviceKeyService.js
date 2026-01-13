import api from '@booking/shared/api/axiosInstance.js';

export const fetchOwnerDeviceKey = () =>
  api.get('/owner/supper-court/device-key');

export const regenerateOwnerDeviceKey = () =>
  api.patch('/owner/supper-court/device-key');

