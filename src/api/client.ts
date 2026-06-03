import axios from 'axios';

const apiBaseURL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').replace(/\/+$/, '');

const apiClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Accept': 'application/json',
  },
  timeout: 8000,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    error.message = error.response?.data?.message || error.message || 'تعذر الاتصال بالخادم';
    return Promise.reject(error);
  }
);

export default apiClient;
