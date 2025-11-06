import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useVideo } from '../contexts/VideoContext';
import { useCategories } from '../contexts/CategoryContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import CategorySelect from '../components/common/CategorySelect';
import Spinner from '../components/common/Spinner';
import { toast } from 'react-hot-toast';

const ShareTarget = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { createVideo, isCreating } = useVideo();
  const { categories } = useCategories();
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [sharedData, setSharedData] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    category: ''
  });

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login?redirect=/share-target/');
      return;
    }

    // Get shared data from URL parameters or form data
    const urlParams = new URLSearchParams(window.location.search);
    const sharedUrl = urlParams.get('url') || urlParams.get('text');
    
    if (sharedUrl) {
      processSharedContent(sharedUrl);
    } else {
      // Handle POST data from share target
      handleShareTargetData();
    }
  }, [isAuthenticated, navigate]);

  const handleShareTargetData = async () => {
    try {
      // This would be called when the page is loaded via share target
      // The actual implementation depends on how the share target data is passed
      const urlParams = new URLSearchParams(window.location.search);
      const title = urlParams.get('title') || '';
      const text = urlParams.get('text') || '';
      const url = urlParams.get('url') || text;
      
      if (url) {
        await processSharedContent(url, title, text);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error handling share target data:', error);
      setLoading(false);
    }
  };

  const processSharedContent = async (url, title = '', text = '') => {
    try {
      setProcessing(true);
      
      // Call backend to extract metadata
      const response = await fetch(`/api/share/metadata?url=${encodeURIComponent(url)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to extract metadata');
      }
      
      const result = await response.json();
      
      if (result.success) {
        const metadata = result.data;
        setSharedData(metadata);
        setFormData({
          title: metadata.title || title || 'Untitled Video',
          description: metadata.description || text || '',
          tags: '',
          category: ''
        });
      } else {
        throw new Error(result.message || 'Failed to process shared content');
      }
    } catch (error) {
      console.error('Error processing shared content:', error);
      toast.error('Failed to extract video metadata. Please try again.');
      
      // Fallback to basic data
      setSharedData({
        url,
        title: title || 'Untitled Video',
        description: text || '',
        thumbnail: '',
        platform: 'other'
      });
      setFormData({
        title: title || 'Untitled Video',
        description: text || '',
        tags: '',
        category: ''
      });
    } finally {
      setLoading(false);
      setProcessing(false);
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
    
    if (!sharedData) {
      toast.error('No video data to save');
      return;
    }

    try {
      const videoData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        url: sharedData.url,
        thumbnail: sharedData.thumbnail,
        platform: sharedData.platform,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        category: formData.category || null
      };

      await createVideo(videoData);
      toast.success('Video saved to your library!');
      navigate('/videos');
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Failed to save video. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/videos');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="large" />
          <p className="mt-4 text-gray-600">Processing shared content...</p>
        </div>
      </div>
    );
  }

  if (!sharedData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Content Shared</h1>
          <p className="text-gray-600 mb-6">No video content was shared to VidNest.</p>
          <Button onClick={() => navigate('/videos/add')}>
            Add Video Manually
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Save Video to VidNest</h1>
          
          {/* Video Preview */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {sharedData.thumbnail && (
                <img 
                  src={sharedData.thumbnail} 
                  alt="Video thumbnail"
                  className="w-full md:w-48 h-32 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {sharedData.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {sharedData.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="capitalize">{sharedData.platform}</span>
                  {sharedData.author && (
                    <>
                      <span>•</span>
                      <span>{sharedData.author}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
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
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <CategorySelect
                id="category"
                value={formData.category}
                onChange={handleInputChange}
                name="category"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isCreating || processing}
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
      </div>
    </div>
  );
};

export default ShareTarget;


