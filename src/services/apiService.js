
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001', // Base URL for API
  headers: {
    'Accept': 'application/json',
  },
});

// Optional: Add an interceptor to include the auth token in every request
apiClient.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
