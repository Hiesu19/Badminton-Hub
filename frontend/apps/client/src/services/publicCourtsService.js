import api from '@booking/shared/api/axiosInstance.js';

/**
 * Map dữ liệu SupperCourt từ API public về dạng FE sử dụng.
 */
const mapSupperCourt = (item) => ({
  id: item.id,
  name: item.name,
  latitude: item.latitude,
  longitude: item.longitude,
  address: item.address,
  // Link chi tiết địa chỉ (ví dụ: Google Maps hoặc trang thông tin sân)
  addressLink: item.addressLink,
  phone: item.phone,
  email: item.email,
  website: item.website,
  imageUrl: item.imageUrl,
});

/**
 * Gọi API public (phân trang + search) để lấy danh sách sân cho mục đích tìm kiếm.
 * Không dùng isAll, chỉ trả về 1 trang dữ liệu.
 *
 * @param {{ page?: number, limit?: number, search?: string }} [params]
 */
export async function fetchPublicCourts({ page = 1, limit = 50, search } = {}) {
  const params = { page, limit };
  if (search) {
    params.search = search;
  }

  const { data } = await api.get('/public/supper-courts', {
    params,
  });

  const payload = data?.data ?? data;
  const items = payload?.items ?? payload;

  return items?.map(mapSupperCourt) ?? [];
}

/**
 * Gọi API public với isAll=true để lấy toàn bộ sân cho mục đích hiển thị bản đồ.
 */
export async function fetchAllPublicCourts() {
  const { data } = await api.get('/public/supper-courts', {
    params: { isAll: true },
  });

  const payload = data?.data ?? data;
  const items = payload?.items ?? payload;

  return items?.map(mapSupperCourt) ?? [];
}

/**
 * Lấy chi tiết 1 sân public theo id.
 *
 * @param {string|number} id
 */
export async function fetchPublicCourtDetail(id) {
  const { data } = await api.get(`/public/supper-courts/${id}`);
  const payload = data?.data ?? data;
  return mapSupperCourt(payload);
}

/**
 * Lấy lịch đặt sân (ma trận 48 slot theo ngày) cho một cụm sân.
 *
 * @param {string|number} id
 * @param {string} date - dạng YYYY-MM-DD
 */
export async function fetchPublicCourtCalendar(id, date) {
  const { data } = await api.get(
    `/public/supper-courts/${id}/calendar/${date}`,
  );
  const payload = data?.data ?? data;
  return payload;
}

/**
 * Lấy ma trận giá 7x48 slot (30 phút) cho một cụm sân.
 * Trả về object: { [dayOfWeek: number]: { priceId, price, startTime, endTime }[] }
 *
 * Lưu ý: price là giá theo giờ, front-end cần chia 2 cho mỗi slot 30 phút.
 */
export async function fetchPublicCourtPriceMatrix(id) {
  const { data } = await api.get(`/public/supper-courts/${id}/price-matrix`);
  const payload = data?.data ?? data;
  return payload ?? {};
}

/**
 * Lấy danh sách sân con (sub-courts) theo cụm sân.
 *
 * @param {string|number} id
 */
export async function fetchPublicCourtSubCourts(id) {
  const { data } = await api.get(`/public/supper-courts/${id}/sub-courts`);
  const payload = data?.data ?? data;
  return payload ?? [];
}
