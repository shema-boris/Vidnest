import { useState } from 'react';
import { useCategories } from '../../contexts/CategoryContext';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const CategoriesPage = () => {
  const { categories, loading, error, createCategory, deleteCategory } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsSubmitting(true);
    const { success } = await createCategory(newCategoryName.trim());
    
    if (success) {
      setNewCategoryName('');
      setIsModalOpen(false);
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsSubmitting(true);
    await deleteCategory(deleteId);
    setDeleteId(null);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          Add Category
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {loading && !categories.length ? (
        <div className="text-center py-8">Loading categories...</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {categories.map((category) => (
              <li key={category._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">{category.name}</span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteId(category._id)}
                    disabled={isSubmitting}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
            
            {!categories.length && (
              <li className="px-6 py-4 text-center text-gray-500">
                No categories found. Add your first category!
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Add Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Category"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!newCategoryName.trim() || isSubmitting}
              isLoading={isSubmitting}
            >
              Add Category
            </Button>
          </>
        }
      >
        <div className="mt-4">
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter category name"
            autoFocus
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Category"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteId(null)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isSubmitting}
            >
              Delete
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete this category? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default CategoriesPage;