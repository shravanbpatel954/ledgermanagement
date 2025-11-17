import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

// Request interceptor (attach token)
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (handle token refresh + logout)
api.interceptors.response.use(
  (response) => {
    // ✔ If backend sends a refreshed token, update cookie
    const newToken = response.headers['x-refreshed-token'];

    if (newToken) {
      Cookies.set('authToken', newToken, {
        expires: 1,          // 1 day cookie
        sameSite: 'Lax',
      });
      console.log('🔄 Token refreshed and saved to cookie');
    }

    return response;
  },
  (error) => {
    const status = error.response?.status;

    // ❗️440 = inactivity logout sent by backend
    if (status === 440) {
      console.warn('⚠️ Session expired due to inactivity');
      Cookies.remove('authToken');
      window.location.href = '/login';
      return;
    }

    // ❗️401 = invalid or expired token (not inactivity)
    if (status === 401) {
      console.warn('⚠️ Token invalid or expired');
      Cookies.remove('authToken');
      window.location.href = '/login';
      return;
    }

    return Promise.reject(error);
  }
);

export default api;
