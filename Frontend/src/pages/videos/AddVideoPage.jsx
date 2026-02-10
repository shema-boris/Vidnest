import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useVideo } from '../../contexts/VideoContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import CategorySelect from '../../components/common/CategorySelect';

const AddVideoPage = () => {
  const { createVideo, isCreating } = useVideo();
  const [error, setError] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setError('');

    const finalVideoUrl = data.url?.trim();

    try {
      const videoData = {
        title: data.title.trim(),
        description: data.description?.trim() || '',
        url: finalVideoUrl,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        category: data.category || null,
      };

      await createVideo(videoData);
      reset();
      // Optionally show success message or redirect
    } catch (error) {
      console.error('Error creating video:', error);
      setError(error.message || 'Failed to create video. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Add New Video</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="title"
            label="Title *"
            {...register('title', { required: 'Title is required' })}
            error={errors.title}
          />

          <Textarea
            id="description"
            label="Description"
            {...register('description')}
            error={errors.description}
            rows={4}
          />

          <Input
            id="url"
            label="Video URL"
            type="url"
            {...register('url', {
              required: 'Video URL is required',
            })}
            error={errors.url?.message}
          />

          <Input
            id="tags"
            label="Tags"
            {...register('tags')}
            error={errors.tags}
            helpText="Enter comma-separated tags."
          />

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <CategorySelect
              id="category"
              {...register('category')}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting || isCreating}
              loading={isSubmitting || isCreating}
            >
              {isCreating ? 'Creating...' : 'Add Video'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVideoPage;
