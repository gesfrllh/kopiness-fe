import axios from 'axios';
import Cookie from 'js-cookie';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async config => {
  const token = Cookie.get('token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const data = await axios.post(
          process.env.NEXT_PUBLIC_API_BASE_URL + '/api/refresh-token',
          null,
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );

        Cookie.set('token', data.data.token, { expires: 1 });

        originalRequest.headers['Authorization'] = `Bearer ${data.data.token}`;
        return apiClient(originalRequest);
      } catch (err) {
        console.error('Token refresh failed:', err);
        Cookie.remove('token');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;