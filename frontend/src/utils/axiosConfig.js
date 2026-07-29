import axios from 'axios';
import { useUIStore } from '../store/useUIStore';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', withCredentials: true, timeout: 15_000 });
api.interceptors.request.use((config) => {
  const token = useUIStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use((response) => response, async (error) => {
  const request = error.config;
  if (error.response?.status === 401 && !request?._retry && !request?.url?.includes('/auth/refresh')) {
    request._retry = true;
    try { const { data } = await api.post('/auth/refresh'); useUIStore.getState().setAccessToken(data.accessToken); request.headers.Authorization = `Bearer ${data.accessToken}`; return api(request); } catch { useUIStore.getState().logout(); }
  }
  return Promise.reject(error);
});
export default api;
