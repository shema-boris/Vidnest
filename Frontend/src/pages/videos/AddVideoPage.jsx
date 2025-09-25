import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useVideo } from '../../contexts/VideoContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import FileInput from '../../components/common/FileInput';
import ProgressBar from '../../components/common/ProgressBar';
import CategorySelect from '../../components/common/CategorySelect';

const AddVideoPage = () => {
  const { createVideo, uploadVideoFile, isCreating } = useVideo();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setValue,
  } = useForm();

  const videoFile = watch('videoFile');
  const videoUrl = watch('url');

  const onSubmit = async (data) => {
    setError('');
    let finalVideoUrl = data.url?.trim();

    if (data.videoFile && data.videoFile[0]) {
      setIsUploading(true);
      setUploadProgress(0);
      try {
        const response = await uploadVideoFile(data.videoFile[0], (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        });
        finalVideoUrl = response.fileUrl;
      } catch (error) {
        console.error('Error uploading video:', error);
        setError('Failed to upload video. Please try again.');
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

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
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Add New Video</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
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

          <div className="text-sm text-gray-500 text-center my-4">— OR —</div>

          <FileInput
            id="videoFile"
            label="Upload Video File"
            {...register('videoFile')}
            error={errors.videoFile}
            helpText="Upload a video file directly. This will override the URL field."
            disabled={isUploading}
          />

          {isUploading && (
            <ProgressBar value={uploadProgress} />
          )}

          <Input
            id="url"
            label="Video URL"
            type="url"
            {...register('url', {
              required: !videoFile?.[0] ? 'Either video file or URL is required' : false,
              validate: (value) => {
                if (!value && !videoFile?.[0]) {
                  return 'Either video file or URL is required';
                }
                return true;
              },
            })}
            error={errors.url?.message}
            disabled={!!videoFile?.[0]}
          />

          <Input
            id="tags"
            label="Tags"
            {...register('tags')}
            error={errors.tags}
            helpText="Enter comma-separated tags."
          />

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <CategorySelect
              id="category"
              {...register('category')}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting || isCreating || isUploading}
              loading={isSubmitting || isCreating || isUploading}
            >
              {isUploading ? `Uploading... ${uploadProgress}%` : (isCreating ? 'Creating...' : 'Add Video')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVideoPage;
