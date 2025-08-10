import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoImportForm from '../components/VideoImportForm';
import Navbar from '../components/Navbar';

const VideoImport = () => {
    const navigate = useNavigate();
    const [importSuccess, setImportSuccess] = useState(false);
    const [importError, setImportError] = useState('');

    const handleImportSuccess = () => {
        setImportSuccess(true);
        // Navigate to videos page after successful import
        setTimeout(() => {
            navigate('/videos');
        }, 2000);
    };

    const handleImportError = (error) => {
        setImportError(error);
        setTimeout(() => {
            setImportError('');
        }, 5000);
    };

    return (
        <div className="video-import-page">
            <Navbar />
            <div className="container mt-4">
                <h2 className="mb-4">Import Video</h2>
                
                {importSuccess && (
                    <div className="alert alert-success">
                        Video imported successfully! Redirecting to videos page...
                    </div>
                )}

                {importError && (
                    <div className="alert alert-danger">
                        {importError}
                    </div>
                )}

                <VideoImportForm 
                    onSuccess={handleImportSuccess}
                    onError={handleImportError}
                />
            </div>
        </div>
    );
};

export default VideoImport;
