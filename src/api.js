import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000,
});

// attach a request interceptor for future extension
api.interceptors.request.use(
  (config) => {
    // Ensure Authorization header is present when token or adminToken exists in localStorage.
    try {
      if (!config.headers) config.headers = {};
      if (!config.headers.Authorization) {
        const token = localStorage.getItem('token');
        const adminToken = localStorage.getItem('adminToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        else if (adminToken) config.headers.Authorization = `Bearer ${adminToken}`;
      }
    } catch (e) {
      // ignore localStorage errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response handler: detect 401 and malformed tokens
api.interceptors.response.use(
  (res) => res,
  (err) => {
    try {
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 401) {
        // If backend indicates malformed token, clear adminToken/local token
        if (data && data.error === 'AUTH_TOKEN_MALFORMED') {
          console.warn('API: Malformed auth token detected; clearing stored tokens');
          try { localStorage.removeItem('token'); } catch {}
          try { localStorage.removeItem('adminToken'); } catch {}
        }
      }
    } catch (e) {
      // ignore
    }
    return Promise.reject(err);
  }
);

export default api;
