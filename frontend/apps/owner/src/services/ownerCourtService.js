import api from '@booking/shared/api/axiosInstance.js';

/**
 * Lấy thông tin cụm sân của owner hiện tại
 */
export async function getMyCourt() {
  const { data } = await api.get('/owner/supper-court/me');
  const payload = data?.data ?? data;
  return payload;
}

/**
 * Tạo cụm sân mới cho owner
 * @param {object} courtData
 */
export async function createCourt(courtData) {
  const { data } = await api.post('/supper-courts', courtData);
  const payload = data?.data ?? data;
  return payload;
}

/**
 * Cập nhật thông tin cụm sân (không được phép đổi địa chỉ)
 * @param {object} courtData - Dữ liệu cụm sân cần cập nhật
 */
export async function updateMyCourt(courtData) {
  const { data } = await api.patch('/owner/supper-court/me', courtData);
  const payload = data?.data ?? data;
  return payload;
}

/**
 * Lấy danh sách bảng giá của cụm sân
 * @param {number} dayOfWeek - Thứ trong tuần (0-6), nếu không có thì lấy tất cả
 */
export async function getCourtPrices(dayOfWeek = null) {
  const params = {};
  if (dayOfWeek !== null && dayOfWeek !== undefined) {
    params.dayOfWeek = dayOfWeek;
  }
  const { data } = await api.get('/owner/supper-court/prices', { params });
  const payload = data?.data ?? data;
  const items = payload?.items ?? payload;
  return Array.isArray(items) ? items : [];
}

/**
 * Cập nhật cấu hình giá
 * @param {string|number} priceId - ID của bảng giá
 * @param {object} priceData - Dữ liệu giá cần cập nhật
 */
export async function updateCourtPrice(priceId, priceData) {
  const { data } = await api.patch(
    `/owner/supper-court/prices/${priceId}`,
    priceData,
  );
  const payload = data?.data ?? data;
  return payload;
}

/**
 * Xóa cấu hình giá
 * @param {string|number} priceId - ID của bảng giá cần xóa
 */
export async function deleteCourtPrice(priceId) {
  const { data } = await api.post(
    `/owner/supper-court/prices/${priceId}/delete`,
  );
  const payload = data?.data ?? data;
  return payload;
}

/**
 * Áp dụng một mức giá cho tất cả slot 30p trong dải giờ của một thứ
 * @param {object} body
 * @param {number} body.dayOfWeek - Thứ (0-6)
 * @param {string} body.startTime - HH:mm
 * @param {string} body.endTime - HH:mm
 * @param {number} body.pricePerHour - Giá / giờ
 */
export async function bulkUpdateCourtPrices(body) {
  const { data } = await api.post(
    '/owner/supper-court/prices/bulk-update',
    body,
  );
  const payload = data?.data ?? data;
  return payload;
}

/**
 * Copy cấu hình giá từ một ngày sang ngày khác
 * @param {number} dayOfWeekFrom - Thứ nguồn (0-6)
 * @param {number} dayOfWeekTo - Thứ đích (0-6)
 */
export async function copyCourtPrices(dayOfWeekFrom, dayOfWeekTo) {
  const { data } = await api.post('/owner/supper-court/prices/copy', {
    dayOfWeekFrom,
    dayOfWeekTo,
  });
  const payload = data?.data ?? data;
  return payload;
}
