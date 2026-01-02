import api from '../api/axiosInstance.js';

export async function fetchMyProfile() {
  const { data } = await api.get('/users/me');
  const payload = data?.data ?? data;
  return payload;
}

export async function updateMyProfile(body) {
  const { data } = await api.patch('/users/me', body);
  const raw = data?.data ?? data;

  const message =
    (raw && (raw.message || raw.msg || raw.statusMessage)) ||
    'Cập nhật thông tin thành công';

  const user = raw?.data || raw?.user || raw;

  try {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  } catch {}

  return { user, message };
}
