import axios from 'axios';

let isRefreshing = false;
let refreshSubscribers = [];

// Hàm để đẩy các request bị chờ vào hàng đợi
const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

// Hàm để gọi lại tất cả các request sau khi đã có token mới
const onRerfreshed = (token) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Dùng biến env chung ở trên
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response: { status } } = error;
    const originalRequest = config;

    if (status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Gọi API refresh
          const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
            refreshToken: localStorage.getItem('refreshToken')
          });
          
          const newToken = data.accessToken;
          localStorage.setItem('accessToken', newToken);
          isRefreshing = false;
          
          onRerfreshed(newToken); // Thông báo cho các request đang đợi
        } catch (err) {
          isRefreshing = false;
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(err);
        }
      }

      // Trả về một Promise sẽ thực thi khi có token mới
      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }
    return Promise.reject(error);
  }
);

export default api;