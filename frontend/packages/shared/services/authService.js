import api from '../api/axiosInstance.js';

const ENDPOINT_BY_SITE = {
  client: '/auth/login',
  owner: '/auth/login-owner',
  admin: '/auth/login-super-admin',
};

const ROLE_BY_SITE = {
  client: 'user',
  owner: 'owner',
  admin: 'super_admin',
};
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

  if (payload?.user) {
    try {
      localStorage.setItem('user', JSON.stringify(payload.user));
    } catch (error) {}
  }

  return {
    accessToken: payload?.accessToken,
    refreshToken: payload?.refreshToken,
    user: payload?.user,
    raw: payload,
  };
}

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

export async function resendRegisterOtp({ email }) {
  const { data } = await api.post('/auth/resend-register-otp', { email });
  const payload = data?.message || data?.data || data;
  return {
    message:
      typeof payload === 'string'
        ? payload
        : 'OTP đã được gửi lại, vui lòng kiểm tra email.',
    raw: data,
  };
}

export async function verifyRegisterOtp({ email, otp }) {
  const body = { email, otp };
  const { data } = await api.post('/auth/verify-otp', body);
  const payload = data?.message || data?.data || data;
  return {
    message:
      typeof payload === 'string'
        ? payload
        : 'Tạo tài khoản thành công, bạn có thể đăng nhập ngay bây giờ.',
    raw: data,
  };
}

export async function requestForgotPassword({ email, site = 'client' }) {
  const role = ROLE_BY_SITE[site] ?? ROLE_BY_SITE.client;
  const { data } = await api.post(`/auth/forgot-password?role=${role}`, {
    email,
  });
  const payload = data?.message || data?.data || data;
  return {
    message:
      typeof payload === 'string'
        ? payload
        : 'OTP quên mật khẩu đã được gửi đến email của bạn',
    raw: data,
  };
}

export async function verifyForgotPassword({
  email,
  otp,
  newPassword,
  site = 'client',
}) {
  const role = ROLE_BY_SITE[site] ?? ROLE_BY_SITE.client;
  const body = { email, role, otp, newPassword };
  const { data } = await api.post('/auth/verify-forgot-password', body);
  const payload = data?.message || data?.data || data;
  return {
    message:
      typeof payload === 'string'
        ? payload
        : 'Mật khẩu đã được thay đổi thành công',
    raw: data,
  };
}

export async function changePassword({
  userId,
  oldPassword,
  newPassword,
}) {
  const { data } = await api.post('/auth/change-password', { userId, oldPassword, newPassword });
  const payload = data?.message || data?.data || data;
  return {
    message: typeof payload === 'string' ? payload : 'Mật khẩu đã được thay đổi thành công',
    raw: data,
  };
}

export async function logout({ userId }) {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}
