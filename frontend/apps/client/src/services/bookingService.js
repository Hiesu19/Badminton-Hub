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
 * Lấy danh sách booking của user hiện tại theo ngày (POST /bookings/me)
 * body: { date: 'YYYY-MM-DD', page?: number, limit?: number }
 */
export async function getMyBookings(body) {
    const { data } = await api.post('/bookings/me', body);
    const payload = data?.data ?? data;
    return payload;
}

/**
 * Lấy chi tiết booking của user hiện tại
 */
export async function getBookingDetail(bookingId) {
    const { data } = await api.get(`/bookings/me/${bookingId}`);
    const payload = data?.data ?? data;
    return payload;
}

/**
 * Huỷ booking của user hiện tại
 */
export async function cancelMyBooking(bookingId) {
    const { data } = await api.patch(`/bookings/me/${bookingId}/cancel`);
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
