import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Validate session with the server (cookie-based auth)
        const { data } = await api.get('/auth/profile');
        if (data) {
          setIsAuthenticated(true);
          setUser(data);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      // Update auth state immediately
      setIsAuthenticated(true);
      setUser(data || null);
      
      // Invalidate any existing queries
      await queryClient.invalidateQueries();
      
      // Wait for state updates to complete
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Show success message
      toast.success('Login successful!');
      
      // Redirect to videos page instead of home
      navigate('/videos', { replace: true });
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      await api.post('/auth/register', userData);
      toast.success('Registration successful! Please login to continue.');
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      setIsAuthenticated(false);
      setUser(null);
      
      // Clear all queries
      queryClient.clear();
      
      // Show success message
      toast.success('You have been logged out.');
      
      // Redirect to login page
      navigate('/login');
    }
  };

  // Update profile function
  const updateProfile = async (userData) => {
    try {
      const { data } = await api.put('/auth/profile', userData);
      toast.success('Profile updated successfully!');
      return { success: true, data };
    } catch (error) {
      console.error('Update profile failed:', error);
      const message = error.response?.data?.message || 'Failed to update profile. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Get user profile
  const getUserProfile = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      return data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  };

  // React Query hook for user profile
  const useUserProfile = () => {
    return useQuery({
      queryKey: ['userProfile'],
      queryFn: getUserProfile,
      enabled: isAuthenticated,
      retry: 1,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        useUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
