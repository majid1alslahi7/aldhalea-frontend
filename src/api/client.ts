import axios from 'axios';

const apiBaseURL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').replace(/\/+$/, '');
let backendWarmupPromise: Promise<void> | null = null;

function warmBackendAccess(): Promise<void> {
  if (typeof window === 'undefined' || !apiBaseURL.startsWith('http')) {
    return Promise.resolve();
  }

  const apiUrl = new URL(apiBaseURL);
  if (apiUrl.origin === window.location.origin) {
    return Promise.resolve();
  }

  if (backendWarmupPromise) return backendWarmupPromise;

  backendWarmupPromise = new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      iframe.remove();
      resolve();
    };

    iframe.src = `${apiUrl.origin}${apiUrl.pathname}/categories/menu?hcdn_warmup=${Date.now()}`;
    iframe.style.display = 'none';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.onload = () => window.setTimeout(finish, 800);
    document.body.appendChild(iframe);
    window.setTimeout(finish, 7000);
  });

  return backendWarmupPromise;
}

const apiClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Accept': 'application/json',
  },
  timeout: 8000,
});

apiClient.interceptors.request.use(async (config) => {
  await warmBackendAccess();
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
