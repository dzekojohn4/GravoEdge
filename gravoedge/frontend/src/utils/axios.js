import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.VITE_APP_BACKEND_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add response interceptor for centralized error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `API error ${error.response.status}:`,
        error.response.data?.detail || error.message
      );
    } else if (error.request) {
      console.error('Network error: no response received from server');
    } else {
      console.error('Request configuration error:', error.message);
    }
    return Promise.reject(error);
  }
);
