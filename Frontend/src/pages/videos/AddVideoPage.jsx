import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useVideo } from '../../contexts/VideoContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import FileInput from '../../components/common/FileInput';
import ProgressBar from '../../components/common/ProgressBar';

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
    setError: setFormError,
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

    if (!finalVideoUrl) {
      setError('Please provide either a video file or a URL');
      return;
    }

    const videoData = {
      title: data.title?.trim() || 'Untitled Video',
      description: data.description?.trim() || '',
      url: finalVideoUrl,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      isPublic: true,
    };

    try {
      await createVideo(videoData);
      reset();
    } catch (error) {
      // Error is already handled by the VideoContext
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
            {...register('url')}
            error={errors.url}
            placeholder="https://example.com/video.mp4"
            disabled={videoFile && videoFile.length > 0}
          />

          <Input
            id="tags"
            label="Tags"
            {...register('tags')}
            error={errors.tags}
            helpText="Enter comma-separated tags."
          />

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
