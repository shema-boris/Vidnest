import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { VideoProvider } from './contexts/VideoContext';
import { CategoryProvider } from './contexts/CategoryContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VideoListPage from './pages/videos/VideoListPage';
import VideoDetailPage from './pages/videos/VideoDetailPage';
import AddVideoPage from './pages/videos/AddVideoPage';
import EditVideoPage from './pages/videos/EditVideoPage';
import ProfilePage from './pages/user/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import ShareTarget from './pages/ShareTarget';
import SharePage from './pages/SharePage';
import HelpPage from './pages/HelpPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <CategoryProvider>
                <VideoProvider>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />

                  <Route element={<PublicRoute redirectTo="/dashboard" />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                  </Route>

                  {/* Protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                      <Route path="/dashboard" element={<Home />} />
                      <Route path="/videos" element={<VideoListPage />} />
                      <Route path="/videos/add" element={<AddVideoPage />} />
                      <Route path="/videos/:id" element={<VideoDetailPage />} />
                      <Route path="/videos/:id/edit" element={<EditVideoPage />} />
                      <Route path="/categories" element={<CategoriesPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/help" element={<HelpPage />} />
                    </Route>
                    {/* Share routes - no layout needed */}
                    <Route path="/share-target/" element={<ShareTarget />} />
                    <Route path="/share" element={<SharePage />} />
                  </Route>

                  {/* 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>

                {process.env.NODE_ENV === 'development' && (
                  <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
                )}

                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: { background: '#363636', color: '#fff' },
                  }}
                />
                </VideoProvider>
              </CategoryProvider>
            </AuthProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
}

export default App;
