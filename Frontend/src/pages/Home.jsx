import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useVideo } from '../contexts/VideoContext';
import QuickImport from '../components/QuickImport';
import VideoGrid from '../components/videos/VideoGrid';
import Button from '../components/common/Button';
import BookmarkletButton from '../components/BookmarkletButton';
import { PlusIcon } from '@heroicons/react/24/outline';

function Home() {
  const { isAuthenticated, user } = useAuth();
  const { videos, isLoadingVideos } = useVideo();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to VidNest</h1>
          <p className="text-gray-600 mb-6">Your personal video library for organizing videos from any platform</p>
          <div className="space-y-3">
            <Link to="/login">
              <Button className="w-full">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" className="w-full">Create Account</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your personal video collection</p>
      </div>

      {/* Quick Import Section */}
      <div className="mb-8">
        <QuickImport />
      </div>

      {/* Bookmarklet Section */}
      <div className="mb-8">
        <BookmarkletButton />
      </div>

      {/* Recent Videos */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Recent Videos</h2>
          <Link to="/videos">
            <Button variant="secondary">
              View All
            </Button>
          </Link>
        </div>

        {isLoadingVideos ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-48"></div>
            ))}
          </div>
        ) : videos && videos.length > 0 ? (
          <VideoGrid 
            videos={videos.slice(0, 8)} 
            onVideoClick={(video) => window.location.href = `/videos/${video._id}`}
          />
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No videos yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Start building your video library by importing your first video</p>
            <Link to="/videos/add">
              <Button>
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Your First Video
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/videos/add" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="text-blue-600 dark:text-blue-400 mb-3">
              <PlusIcon className="h-8 w-8 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Add Video</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Import videos from any platform</p>
          </div>
        </Link>

        <Link to="/videos" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="text-green-600 dark:text-green-400 mb-3">
              <svg className="h-8 w-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Browse Library</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">View and organize your videos</p>
          </div>
        </Link>

        <Link to="/categories" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-center">
            <div className="text-purple-600 dark:text-purple-400 mb-3">
              <svg className="h-8 w-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Categories</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Organize with categories and tags</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home;
