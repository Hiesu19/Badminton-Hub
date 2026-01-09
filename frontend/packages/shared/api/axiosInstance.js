import axios from 'axios';

const trimTrailingSlash = (value) => value?.replace(/\/$/, '') ?? '';
const API_URL =
  trimTrailingSlash(import.meta.env.VITE_API_URL) || 'http://localhost:6501';

const instance = axios.create({
  baseURL: API_URL,
});

const REFRESH_URL = '/auth/refresh-token';
const LOGOUT_URL = '/auth/logout';
const AUTH_URLS = [
  '/auth',
  '/users',
  '/order',
  '/uploads',
  '/favorites',
  '/cart',
  '/reviews',
  '/payment',
  '/notifications',
];

const getRefreshTokenPayload = (data) => data?.data ?? data ?? {};

const emitLogout = () => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

const refreshTokenApi = async () => {
  if (typeof window === 'undefined') {
    throw new Error('Refresh token not available');
  }

  const refreshToken = localStorage.getItem('refreshToken');
  const headers = {
    RefreshToken: refreshToken ?? '',
  };
  return axios.post(`${API_URL}${REFRESH_URL}`, { refreshToken }, { headers });
};

const shouldAttachTokens = (configUrl = '') =>
  AUTH_URLS.some((path) => configUrl.includes(path));

instance.interceptors.request.use(
  (config) => {
    if (typeof window === 'undefined') {
      return config;
    }

    config.headers = config.headers || {};
    const requestUrl = config.url ?? '';

    if (requestUrl === REFRESH_URL || requestUrl === LOGOUT_URL) {
      config.headers.RefreshToken = localStorage?.getItem('refreshToken') ?? '';
    }

    if (shouldAttachTokens(requestUrl) && localStorage.getItem('accessToken')) {
      config.headers.Authorization = `Bearer ${
        localStorage?.getItem('accessToken') ?? ''
      }`;
      config.headers.RefreshToken = localStorage?.getItem('refreshToken') ?? '';
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let refreshFailed = false;

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (config?.url?.includes(REFRESH_URL)) {
      refreshFailed = true;
      emitLogout();
      return Promise.reject(error);
    }

    if (refreshFailed) {
      emitLogout();
      return Promise.reject(error);
    }

    if (response?.status === 401 && !config?._retry) {
      config._retry = true;

      try {
        const res = await refreshTokenApi();
        const payload = getRefreshTokenPayload(res.data);
        const accessToken = payload?.accessToken ?? payload?.access_token;
        const refreshToken = payload?.refreshToken ?? payload?.refresh_token;

        if (!accessToken || !refreshToken) {
          throw new Error('Refresh token response missing tokens');
        }

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
        config.headers.RefreshToken = refreshToken;

        refreshFailed = false;

        return instance(config);
      } catch (refreshError) {
        refreshFailed = true;
        emitLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
