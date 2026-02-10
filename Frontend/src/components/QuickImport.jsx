import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideo } from '../contexts/VideoContext';
import { useCategories } from '../contexts/CategoryContext';
import Button from './common/Button';
import Input from './common/Input';
import Textarea from './common/Textarea';
import CategorySelect from './common/CategorySelect';
import Spinner from './common/Spinner';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

const QuickImport = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { createVideo, isCreating } = useVideo();
  const { categories } = useCategories();
  
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    category: ''
  });

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      // Extract metadata from URL
      const response = await api.get(`/share/metadata?url=${encodeURIComponent(url)}`);
      const result = response.data;
      
      if (result.success) {
        const metadata = result.data;
        setPreview(metadata);
        setFormData({
          title: metadata.title || 'Untitled Video',
          description: metadata.description || '',
          tags: '',
          category: ''
        });
      } else {
        throw new Error(result.message || 'Failed to extract metadata');
      }
    } catch (error) {
      console.error('Error extracting metadata:', error);
      toast.error('Failed to extract video metadata. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!preview) {
      toast.error('No video data to save');
      return;
    }

    try {
      const videoData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        url: url,
        thumbnail: preview.thumbnail,
        platform: preview.platform,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        category: formData.category || null
      };

      await createVideo(videoData);
      toast.success('Video saved to your library!');
      
      // Reset form
      setUrl('');
      setPreview(null);
      setFormData({ title: '', description: '', tags: '', category: '' });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/videos');
      }
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Failed to save video. Please try again.');
    }
  };

  const handleCancel = () => {
    setUrl('');
    setPreview(null);
    setFormData({ title: '', description: '', tags: '', category: '' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Import Video</h2>
      
      <form onSubmit={handleUrlSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Video URL
          </label>
          <div className="flex gap-2">
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste video URL here (YouTube, TikTok, Instagram, etc.)"
              className="flex-1"
              required
            />
            <Button
              type="submit"
              disabled={loading || !url.trim()}
              loading={loading}
            >
              {loading ? 'Extracting...' : 'Extract'}
            </Button>
          </div>
        </div>
      </form>

      {preview && (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Video Preview</h3>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {preview.thumbnail && (
              <img 
                src={preview.thumbnail} 
                alt="Video thumbnail"
                className="w-full md:w-48 h-32 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">{preview.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{preview.description}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="capitalize">{preview.platform}</span>
                {preview.author && (
                  <>
                    <span>•</span>
                    <span>{preview.author}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <Input
              id="title"
              label="Title"
              value={formData.title}
              onChange={handleInputChange}
              name="title"
              required
            />

            <Textarea
              id="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              name="description"
              rows={3}
            />

            <Input
              id="tags"
              label="Tags"
              value={formData.tags}
              onChange={handleInputChange}
              name="tags"
              placeholder="Enter comma-separated tags"
              helpText="Separate multiple tags with commas"
            />

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <CategorySelect
                id="category"
                value={formData.category}
                onChange={handleInputChange}
                name="category"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isCreating}
                loading={isCreating}
                className="flex-1"
              >
                {isCreating ? 'Saving...' : 'Save to Library'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default QuickImport;


