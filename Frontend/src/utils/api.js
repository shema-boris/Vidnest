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

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
      // Clear token and redirect to login if the request was not to the login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
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

// Helper function to handle file uploads
export const uploadFile = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });

  return response.data;
};

export default api;
