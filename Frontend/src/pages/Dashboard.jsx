import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Welcome to Vidnest</h1>
      <div className="dashboard-actions">
        <Link to="/videos" className="dashboard-button">
          View Videos
        </Link>
        <Link to="/categories" className="dashboard-button">
          Manage Categories
        </Link>
        <Link to="/import" className="dashboard-button">
          Import Video
        </Link>
      </div>
      <div className="dashboard-info">
        <p>Quickly import videos from YouTube, TikTok, and Instagram.</p>
        <p>Organize your videos with categories and tags.</p>
        <p>View all your imported videos in one place.</p>
      </div>
    </div>
  );
};

export default Dashboard;
