import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useVideo } from '../../contexts/VideoContext';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';

const EditVideoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVideo, updateVideo } = useVideo();

  const { data: video, isLoading, error } = getVideo(id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (video) {
      reset({
        title: video.title,
        description: video.description || '',
        url: video.url,
        tags: video.tags ? video.tags.join(', ') : '',
      });
    }
  }, [video, reset]);

  const { mutate: updateVideoMutation, isLoading: isUpdating } = updateVideo();

  const onSubmit = async (data) => {
    const videoData = {
      ...data,
      tags: data.tags ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
    };

    updateVideoMutation({ id, ...videoData });
  };

  if (isLoading) return <div>Loading video...</div>;
  if (error) return <div>Error loading video: {error.message}</div>;
  if (!video) return <div>Video not found</div>;

  const isSubmitting = isUpdating;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Video</h1>
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
            rows={4}
            {...register('description')}
            error={errors.description}
          />

          <Input
            id="url"
            label="Video URL *"
            type="url"
            {...register('url', { required: 'Video URL is required' })}
            error={errors.url}
            helpText="Provide a video URL."
          />

          <Input
            id="tags"
            label="Tags (comma separated)"
            {...register('tags')}
            error={errors.tags}
            helpText="Separate tags with commas (e.g., react, javascript, tutorial)."
          />

          <div className="flex items-center justify-end pt-4 space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/videos/${id}`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVideoPage;
