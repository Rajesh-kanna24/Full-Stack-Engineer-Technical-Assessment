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

// Added state for handling concurrent refreshes
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If we are already refreshing, push the failed request to the queue
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // Once the refresh is done, retry the request with the new token
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getStoredRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Use a clean axios instance here to prevent interceptor loops
        const refreshResponse = await axios.post(`${normalizedBaseUrl}/auth/refresh`, { refreshToken });
        const nextAccessToken = refreshResponse.data?.data?.accessToken;
        const nextRefreshToken = refreshResponse.data?.data?.refreshToken;

        if (nextAccessToken) {
          localStorage.setItem('token', nextAccessToken);
        }
        if (nextRefreshToken) {
          localStorage.setItem('refreshToken', nextRefreshToken);
        }

        // Apply new token to original request
        if (typeof (originalRequest.headers as any)?.set === 'function') {
          (originalRequest.headers as any).set('Authorization', `Bearer ${nextAccessToken}`);
        } else {
          originalRequest.headers['Authorization'] = `Bearer ${nextAccessToken}`;
        }

        // Process all queued requests with the new token
        processQueue(null, nextAccessToken);

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('role');
          localStorage.removeItem('userName');
          window.location.href = '/login';
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;