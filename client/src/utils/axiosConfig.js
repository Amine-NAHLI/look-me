import axios from 'axios';

const api = axios.create({
  baseURL: '/api' // Using Vite proxy
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lookme_token'); // Make sure we use the same key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lookme_token');
      // Keep it nice, maybe redirect.
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
