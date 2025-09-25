import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/categories');
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new category
  const createCategory = async (name) => {
    try {
      const { data } = await api.post('/categories', { name });
      setCategories(prev => [...prev, data]);
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create category';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Delete a category
  const deleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(prev => prev.filter(cat => cat._id !== id));
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete category';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        error,
        createCategory,
        deleteCategory,
        refetch: fetchCategories
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

export default CategoryContext;