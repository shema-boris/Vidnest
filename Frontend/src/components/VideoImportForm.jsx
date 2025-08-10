import React, { useState } from 'react';
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
    const navigate = useNavigate();

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

        try {
            // Validate URL
            const url = formData.url.trim();
            if (!url) {
                throw new Error('Please enter a video URL');
            }

            // Extract platform from URL
            const platform = getPlatformFromUrl(url);
            if (!platform) {
                throw new Error('Unsupported video platform');
            }

            // Validate category
            if (!formData.category) {
                throw new Error('Please select a category');
            }

            // Make API call to import video
            const response = await axios.post('/api/videos/import', {
                ...formData,
                platform
            });

            if (response.data.success) {
                onSuccess();
                toast.success('Video imported successfully!');
            } else {
                throw new Error(response.data.error || 'Failed to import video');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;
            onError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to extract platform from URL
    const getPlatformFromUrl = (url) => {
        const hostname = new URL(url).hostname;
        if (hostname.includes('tiktok')) return 'TikTok';
        if (hostname.includes('instagram')) return 'Instagram';
        if (hostname.includes('youtube')) return 'YouTube';
        return null;
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
                >
                    <option value="">Select a category...</option>
                    {/* These options will be populated from the API */}
                    <option value="entertainment">Entertainment</option>
                    <option value="education">Education</option>
                    <option value="sports">Sports</option>
                    <option value="music">Music</option>
                    <option value="other">Other</option>
                </select>
            </div>

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
