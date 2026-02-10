import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useVideo } from '../../contexts/VideoContext';
import ErrorState from '../../components/common/ErrorState';
import ProfileSkeleton from '../../components/user/ProfileSkeleton';
import StatItem from '../../components/user/StatItem';
import Button from '../../components/common/Button';
import { PencilIcon, KeyIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { user, isLoading: isAuthLoading, updateProfile } = useAuth();
  const { videos, isLoading: isLoadingVideos, isError: isVideosError } = useVideo();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const isLoading = isAuthLoading || isLoadingVideos;

  const handleEditProfile = () => {
    setProfileForm({ name: user.name, email: user.email });
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setProfileForm({ name: '', email: '' });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return;

    setProfileLoading(true);
    const result = await updateProfile({
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
    });
    setProfileLoading(false);

    if (result.success) {
      setIsEditingProfile(false);
    }
  };

  const handleChangePassword = () => {
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
    setIsChangingPassword(true);
  };

  const handleCancelPassword = () => {
    setIsChangingPassword(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    const result = await updateProfile({
      password: passwordForm.newPassword,
    });
    setPasswordLoading(false);

    if (result.success) {
      setIsChangingPassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  if (isVideosError) {
    return <ErrorState title="Could not load profile data" message="There was an issue fetching your profile information. Please try again later." />;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {isLoading ? (
        <ProfileSkeleton />
      ) : !user ? (
        <ErrorState title="Not Authenticated" message="Please log in to view your profile." />
      ) : (
        <div className="space-y-6">
          {/* Profile Header Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8">
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
                  <StatItem label="Platforms" value={videos ? new Set(videos.map(v => v.platform)).size : 0} />
                  <StatItem label="Tags Used" value={videos ? new Set(videos.flatMap(v => v.tags || [])).size : 0} />
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                {!isEditingProfile && (
                  <Button variant="outline" size="sm" onClick={handleEditProfile}>
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <Button type="submit" loading={profileLoading}>
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Save Changes
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                      <XMarkIcon className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Name</span>
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="text-sm font-medium text-gray-900">{user.email}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-500">Role</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{user.role || 'user'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Password</h2>
                {!isChangingPassword && (
                  <Button variant="outline" size="sm" onClick={handleChangePassword}>
                    <KeyIcon className="h-4 w-4 mr-1" />
                    Change Password
                  </Button>
                )}
              </div>

              {isChangingPassword ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                      placeholder="At least 6 characters"
                      required
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Re-enter new password"
                      required
                      minLength={6}
                    />
                  </div>

                  {passwordError && (
                    <p className="text-sm text-red-600">{passwordError}</p>
                  )}

                  <div className="flex space-x-3 pt-2">
                    <Button type="submit" loading={passwordLoading}>
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Update Password
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancelPassword}>
                      <XMarkIcon className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <p className="text-sm text-gray-500">
                  Change your password to keep your account secure.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
