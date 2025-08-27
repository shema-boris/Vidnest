import { useAuth } from '../../contexts/AuthContext';
import { useVideo } from '../../contexts/VideoContext';
import ErrorState from '../../components/common/ErrorState';
import ProfileSkeleton from '../../components/user/ProfileSkeleton';
import StatItem from '../../components/user/StatItem';

const ProfilePage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { videos, isLoading: isLoadingVideos, isError: isVideosError } = useVideo();

  const isLoading = isAuthLoading || isLoadingVideos;

  if (isVideosError) {
    return <ErrorState title="Could not load profile data" message="There was an issue fetching your profile information. Please try again later." />;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-8">
          {isLoading ? (
            <ProfileSkeleton />
          ) : user ? (
            <div className="text-center">
              <img
                className="h-24 w-24 rounded-full mx-auto ring-4 ring-indigo-500 shadow-lg"
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
                alt={`${user.name}'s avatar`}
              />
              <h1 className="mt-4 text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="mt-1 text-md text-gray-500">{user.email}</p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gray-200 pt-8">
                <StatItem label="Total Videos" value={videos?.length || 0} />
                <StatItem label="Public Videos" value={videos?.filter(v => v.isPublic).length || 0} />
                <StatItem label="Private Videos" value={videos?.filter(v => !v.isPublic).length || 0} />
              </div>
            </div>
          ) : (
            <ErrorState title="Not Authenticated" message="Please log in to view your profile." />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
