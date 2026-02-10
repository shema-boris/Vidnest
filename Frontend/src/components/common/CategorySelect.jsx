import { useEffect, useState } from 'react';
import { useCategories } from '../../contexts/CategoryContext';

const CategorySelect = ({
  value = '',
  onChange,
  name = 'category',
  id = 'category',
  className = '',
  required = false,
  disabled = false,
  placeholder = 'Select a category'
}) => {
  const { categories, loading, error } = useCategories();
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (onChange) {
      // Create a synthetic event to match the expected format
      const syntheticEvent = {
        target: {
          name,
          value: newValue === '' ? null : newValue
        }
      };
      onChange(syntheticEvent);
    }
  };

  if (error) {
    return <div className="text-red-500 text-sm">Error loading categories</div>;
  }

  return (
    <select
      id={id}
      name={name}
      value={localValue}
      onChange={handleChange}
      disabled={disabled || loading}
      required={required}
      className={`block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${className}`}
    >
      <option value="">{placeholder}</option>
      {loading ? (
        <option disabled>Loading categories...</option>
      ) : (
        categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))
      )}
    </select>
  );
};

export default CategorySelect;