import axios from 'axios';

const normalizedBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api/v1').replace(/\/+$/, '');

const api = axios.create({
  baseURL: `${normalizedBaseUrl}/`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const getStoredToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
const getStoredRefreshToken = () => (typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null);

api.interceptors.request.use((config) => {
  if (config.url) {
    config.url = config.url.replace(/^\/+/, '');
  }

  const token = getStoredToken();
  if (token && !config.headers?.Authorization) {
    if (typeof (config.headers as any)?.set === 'function') {
      (config.headers as any).set('Authorization', `Bearer ${token}`);
    } else {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      } as any;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getStoredRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshResponse = await api.post('/auth/refresh', { refreshToken });
        const nextAccessToken = refreshResponse.data?.data?.accessToken;
        const nextRefreshToken = refreshResponse.data?.data?.refreshToken;

        if (nextAccessToken) {
          localStorage.setItem('token', nextAccessToken);
        }
        if (nextRefreshToken) {
          localStorage.setItem('refreshToken', nextRefreshToken);
        }

        return api(originalRequest);
      } catch (err) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('role');
          localStorage.removeItem('userName');
          window.location.href = '/login';
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
