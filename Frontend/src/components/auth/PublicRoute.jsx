import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useVideo } from '../../contexts/VideoContext';

const PublicRoute = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { isLoading: isLoadingVideos } = useVideo();

  const isLoading = isAuthLoading || (user && isLoadingVideos);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return user ? <Navigate to="/videos" replace /> : <Outlet />;
};

export default PublicRoute;
