import api from '@booking/shared/api/axiosInstance.js';

/**
 * Lấy danh sách sân con thuộc cụm sân của owner
 */
export async function fetchSubCourts() {
  const { data } = await api.get('/owner/sub-courts');
  const payload = data?.data ?? data;
  const items = payload?.items ?? payload;
  return Array.isArray(items) ? items : [];
}

/**
 * Thêm sân con mới
 */
export async function createSubCourt(body) {
  const { data } = await api.post('/owner/sub-courts', body);
  const payload = data?.data ?? data;
  return payload;
}

/**
 * Cập nhật thông tin sân con
 */
export async function updateSubCourt(id, body) {
  const { data } = await api.patch(`/owner/sub-courts/${id}`, body);
  const payload = data?.data ?? data;
  return payload;
}

/**
 * Xóa sân con
 */
export async function deleteSubCourt(id) {
  const { data } = await api.post(`/owner/sub-courts/${id}/delete`);
  const payload = data?.data ?? data;
  return payload;
}

