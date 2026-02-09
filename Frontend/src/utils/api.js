import axios from 'axios';
import { toast } from 'react-hot-toast';

// Determine the base URL based on the environment
const getBaseUrl = () => {
  // In development, use the proxy defined in vite.config.js
  if (import.meta.env.DEV) {
    return '/api'; // This will be prefixed to all requests in development
  }
  
  // In production, use the VITE_API_URL environment variable
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle network errors
    if (!response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (response.status === 401) {
      const currentPath = window.location.pathname;
      const publicAuthPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
      const isOnPublicAuthPage = publicAuthPaths.some((p) => currentPath.startsWith(p));

      const requestUrl = error.config?.url || '';
      const isAuthProfileCheck = requestUrl.includes('/auth/profile');

      // Avoid hard-redirecting during expected unauthenticated flows
      if (!isOnPublicAuthPage && !isAuthProfileCheck) {
        window.location.href = '/login';
        toast.error('Your session has expired. Please log in again.');
      }
    }

    // Handle 403 Forbidden
    if (response.status === 403) {
      toast.error('You do not have permission to perform this action.');
    }

    // Handle 500 Internal Server Error
    if (response.status >= 500) {
      toast.error('Something went wrong. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;
