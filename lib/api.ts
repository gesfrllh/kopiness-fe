import axios, { AxiosError } from 'axios';

const apiClient = axios.create({
  // Keep browser requests same-origin. Next.js proxies /api to API_PROXY_TARGET.
  baseURL: '/api/',
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers = config.headers ?? {};

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    if (typeof window !== 'undefined') {
      console.info(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => {
    if (typeof window !== 'undefined') {
      console.info(`[API] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`)
    }

    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error: AxiosError) => {
    if (typeof window !== 'undefined') {
      console.error(`[API] ${error.response?.status ?? 'NETWORK_ERROR'} ${error.config?.method?.toUpperCase()} ${error.config?.url}`)
    }

    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default apiClient;
