import axios from 'axios';

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRerfreshed = (token) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6501';
const api = axios.create({
  baseURL: API_URL,
});

// Gắn accessToken vào header Authorization cho mọi request nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const {
      config,
      response: { status },
    } = error;
    const originalRequest = config;

    if (status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken: localStorage.getItem('refreshToken'),
          });

          const newToken = data.accessToken;
          localStorage.setItem('accessToken', newToken);
          isRefreshing = false;

          onRerfreshed(newToken);
        } catch (err) {
          isRefreshing = false;
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }
    return Promise.reject(error);
  },
);

export default api;
