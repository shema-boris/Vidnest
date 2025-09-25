import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const VideoImportForm = ({ onSuccess, onError }) => {
    const [formData, setFormData] = useState({
        url: '',
        title: '',
        description: '',
        category: ''
    });
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState({
        status: '',
        progress: 0,
        message: ''
    });
    const [categories, setCategories] = useState([]);
    const [isFetchingCategories, setIsFetchingCategories] = useState(true);
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');
    const navigate = useNavigate();

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    throw new Error('Not authenticated. Please log in first.');
                }

                const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`;
                console.log('Fetching categories from:', apiUrl);

                const response = await axios.get(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                console.log('Categories response:', response.data);
                setCategories(response.data || []);
                setIsFetchingCategories(false);
            } catch (error) {
                console.error('Error fetching categories:', error);
                const errorMessage = error.response?.data?.error || error.message;
                toast.error(`Failed to fetch categories: ${errorMessage}`);
                setCategories([]); // Clear categories on error
                setIsFetchingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setProgress({ status: 'pending', progress: 0, message: 'Starting video import...' });

        try {
            // Validate URL
            const url = formData.url.trim();
            if (!url) {
                throw new Error('Please enter a video URL');
            }

            // Validate URL format - now supports YouTube URLs with parameters
            const urlRegex = /^(https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+(?:\S+)?$/;
            if (!urlRegex.test(url)) {
                throw new Error('Please enter a valid YouTube, TikTok, or Instagram URL');
            }

            // Extract platform from URL
            const platform = getPlatformFromUrl(url);
            if (!platform) {
                throw new Error('Unsupported video platform. Please provide a valid URL from YouTube, TikTok, or Instagram.');
            }

            // Validate category
            if (!formData.category) {
                throw new Error('Please select a category');
            }

            // Make API call to import video
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    throw new Error('Not authenticated. Please log in first.');
                }

                const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos/import`;
                
                // Update progress
                const updateProgress = (progressEvent) => {
                    if (progressEvent.lengthComputable) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress({
                            status: 'downloading',
                            progress: percentCompleted,
                            message: `Downloading video: ${percentCompleted}%`
                        });
                    }
                };

                const response = await axios({
                    method: 'post',
                    url: apiUrl,
                    data: {
                        ...formData,
                        platform
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    onUploadProgress: updateProgress,
                    onDownloadProgress: updateProgress
                });

                if (response.data.success) {
                    setProgress({ 
                        status: 'completed', 
                        progress: 100, 
                        message: 'Video imported successfully!' 
                    });
                    onSuccess();
                    toast.success('Video imported successfully!');
                } else {
                    throw new Error(response.data.error || 'Failed to import video');
                }
            } catch (error) {
                const errorMessage = error.response?.data?.error || error.message;
                onError(errorMessage);
                toast.error(errorMessage);
                setProgress({ 
                    status: 'error', 
                    progress: 0, 
                    message: `Error: ${errorMessage}`
                });
            }
        } catch (error) {
            const errorMessage = error.message;
            onError(errorMessage);
            toast.error(errorMessage);
            setProgress({ 
                status: 'error', 
                progress: 0, 
                message: `Error: ${errorMessage}`
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async () => {
        try {
            setIsCreatingCategory(true);
            const token = localStorage.getItem('jwt');
            if (!token) {
                throw new Error('Not authenticated. Please log in first.');
            }

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`,
                {
                    name: newCategoryName,
                    description: newCategoryDescription
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Category created successfully!');
                // Refresh categories list
                fetchCategories();
                // Reset form
                setNewCategoryName('');
                setNewCategoryDescription('');
            } else {
                throw new Error(response.data.error || 'Failed to create category');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;
            toast.error(`Failed to create category: ${errorMessage}`);
        } finally {
            setIsCreatingCategory(false);
        }
    };

    const handleNewCategoryNameChange = (e) => {
        setNewCategoryName(e.target.value);
    };

    const handleNewCategoryDescriptionChange = (e) => {
        setNewCategoryDescription(e.target.value);
    };

    // Helper function to extract platform from URL
    const getPlatformFromUrl = (url) => {
        try {
            const hostname = new URL(url).hostname;
            const normalizedHostname = hostname.toLowerCase()
                .replace('www.', '')
                .replace('m.', '');

            if (normalizedHostname.includes('youtube.com') || normalizedHostname.includes('youtu.be')) {
                return 'YouTube';
            }
            if (normalizedHostname.includes('tiktok.com')) {
                return 'TikTok';
            }
            if (normalizedHostname.includes('instagram.com')) {
                return 'Instagram';
            }
            return null;
        } catch (error) {
            return null;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="video-import-form">
            <div className="mb-3">
                <label htmlFor="url" className="form-label">Video URL</label>
                <input
                    type="url"
                    className="form-control"
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    required
                    placeholder="Enter video URL (YouTube, TikTok, or Instagram)"
                />
            </div>

            <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Optional: Enter custom title"
                />
            </div>

            <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Optional: Enter custom description"
                ></textarea>
            </div>

            <div className="mb-3">
                <label htmlFor="category" className="form-label">Category</label>
                <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    disabled={isFetchingCategories}
                >
                    <option value="">{isFetchingCategories ? 'Loading categories...' : 'Select a category...'}</option>
                    {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Add create category section */}
            <div className="mb-3">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Create New Category</h5>
                        <div className="mb-3">
                            <label htmlFor="newCategoryName" className="form-label">Category Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="newCategoryName"
                                value={newCategoryName}
                                onChange={handleNewCategoryNameChange}
                                placeholder="Enter category name"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newCategoryDescription" className="form-label">Description (optional)</label>
                            <textarea
                                className="form-control"
                                id="newCategoryDescription"
                                value={newCategoryDescription}
                                onChange={handleNewCategoryDescriptionChange}
                                rows="2"
                                placeholder="Enter category description"
                            ></textarea>
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleCreateCategory}
                            disabled={isCreatingCategory || !newCategoryName.trim()}
                        >
                            {isCreatingCategory ? 'Creating...' : 'Create Category'}
                        </button>
                    </div>
                </div>
            </div>

            {progress.status && (
                <div className="progress-section mb-3">
                    <div className="progress">
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${progress.progress}%` }}
                            aria-valuenow={progress.progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            {progress.progress}%
                        </div>
                    </div>
                    <p className={`progress-message ${progress.status}`}>
                        {progress.message}
                    </p>
                </div>
            )}

            <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
            >
                {loading ? 'Importing...' : 'Import Video'}
            </button>
        </form>
    );
};

export default VideoImportForm;
