import api from '@booking/shared/api/axiosInstance.js';

/**
 * Gọi API tạo booking cho user hiện tại.
 * Body phải tuân theo CreateBookingDto (backend).
 */
export async function createBooking(body) {
  const { data } = await api.post('/bookings', body);
  return data;
}
