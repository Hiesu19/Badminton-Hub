import api from '@booking/shared/api/axiosInstance.js';

/**
 * Lấy danh sách booking của owner (có thể lọc theo ngày)
 * @param {string} date - Ngày cần lọc (YYYY-MM-DD), optional
 */
export async function fetchOwnerBookings(date = null) {
  const params = {};
  if (date) {
    params.date = date;
  }
  const { data } = await api.get('/bookings/owner', { params });
  const payload = data?.data ?? data;
  const items = payload?.items ?? payload;
  return Array.isArray(items) ? items : [];
}

/**
 * Lấy thông tin chi tiết booking
 * @param {string|number} bookingId - ID của booking
 */
export async function fetchOwnerBookingDetail(bookingId) {
  const { data } = await api.get(`/bookings/owner/${bookingId}`);
  const payload = data?.data ?? data;
  return payload;
}

/**
 * Cập nhật trạng thái booking
 * @param {string|number} bookingId - ID của booking
 * @param {string} status - Trạng thái mới (pending, confirmed, cancelled, etc.)
 */
export async function updateBookingStatus(bookingId, status) {
  const { data } = await api.patch(`/bookings/owner/${bookingId}/status`, {
    status,
  });
  const payload = data?.data ?? data;
  return payload;
}
