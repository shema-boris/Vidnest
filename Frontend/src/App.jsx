import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { VideoProvider } from './contexts/VideoContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VideoListPage from './pages/videos/VideoListPage';
import VideoDetailPage from './pages/videos/VideoDetailPage';
import AddVideoPage from './pages/videos/AddVideoPage';
import EditVideoPage from './pages/videos/EditVideoPage';
import ProfilePage from './pages/user/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <VideoProvider>
              <Routes>
                {/* Public routes (accessible to everyone) */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Auth routes (accessible only when not logged in) */}
                <Route element={<PublicRoute redirectTo="/dashboard" />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Protected routes (accessible only when logged in) */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Home />} />
                    <Route path="/videos" element={<VideoListPage />} />
                    <Route path="/videos/add" element={<AddVideoPage />} />
                    <Route path="/videos/:id" element={<VideoDetailPage />} />
                    <Route path="/videos/:id/edit" element={<EditVideoPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>
                </Route>

                {/* 404 - Not Found */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </VideoProvider>
          </AuthProvider>
        </Router>
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        )}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
