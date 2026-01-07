import api from '@booking/shared/api/axiosInstance.js';

/**
 * Gọi API tạo booking cho user hiện tại.
 * Body phải tuân theo CreateBookingDto (backend).
 */
export async function createBooking(body) {
  const { data } = await api.post('/bookings', body);
  const payload = data?.data ?? data;
  return payload;
}

/**
 * Gửi ảnh bill (public URL) gắn với bookingId.
 */
export async function attachBookingBill(bookingId, imgBillUrl) {
  const { data } = await api.post(`/bookings/${bookingId}/bill`, {
    imgBill: imgBillUrl,
  });
  const payload = data?.data ?? data;
  return payload;
}
