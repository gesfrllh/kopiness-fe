import axios, { AxiosError } from 'axios';
import Cookie from 'js-cookie';
import type { AxiosRequestConfig } from 'axios';

interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/api/',
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookie.get('token');

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers?.['Content-Type'];
    } else {
      config.headers = config.headers ?? {};
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post<{ token: string }>(
          process.env.NEXT_PUBLIC_API_BASE_URL + '/api/refresh-token',
          null,
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          },
        );

        const newToken = refreshResponse.data.token;
        Cookie.set('token', newToken, { expires: 1 });

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        Cookie.remove('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
