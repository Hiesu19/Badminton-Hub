import api from '../api/axiosInstance.js';

const ENDPOINT_BY_SITE = {
  client: '/auth/login',
  owner: '/auth/login-owner',
  admin: '/auth/login-super-admin',
};

/**
 * Gọi API đăng nhập theo loại site (client/owner/admin).
 * - Tự động lưu accessToken & refreshToken vào localStorage nếu có.
 *
 * @param {object} params
 * @param {string} params.email
 * @param {string} params.password
 * @param {'client'|'owner'|'admin'} [params.site='client']
 * @returns {Promise<{accessToken?: string, refreshToken?: string, raw: any}>}
 */
export async function loginWithEmailPassword({
  email,
  password,
  site = 'client',
}) {
  const endpoint = ENDPOINT_BY_SITE[site] ?? ENDPOINT_BY_SITE.client;
  const { data } = await api.post(endpoint, { email, password });
  const payload = data?.data ?? data;

  if (payload?.accessToken && payload?.refreshToken) {
    localStorage.setItem('accessToken', payload.accessToken);
    localStorage.setItem('refreshToken', payload.refreshToken);
  }

  return {
    accessToken: payload?.accessToken,
    refreshToken: payload?.refreshToken,
    raw: payload,
  };
}

/**
 * Gọi API đăng ký tài khoản client.
 *
 * @param {object} params
 * @param {string} params.fullName
 * @param {string} params.email
 * @param {string} params.phone
 * @param {string} params.password
 * @returns {Promise<{message: string, raw: any}>}
 */
export async function registerClientAccount({
  fullName,
  email,
  phone,
  password,
}) {
  const body = { fullName, email, phone, password };
  const { data } = await api.post('/auth/register', body);

  const rawMessage =
    (data && (data.message || data.data || data)) ||
    'Đăng ký thành công, vui lòng kiểm tra email để lấy OTP.';

  const message =
    typeof rawMessage === 'string'
      ? rawMessage
      : 'Đăng ký thành công, vui lòng kiểm tra email để lấy OTP.';

  return { message, raw: data };
}
