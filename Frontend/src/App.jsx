import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Videos from './pages/Videos';
import Categories from './pages/Categories';
import VideoImport from './pages/VideoImport';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

function AppRoutes() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/dashboard';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/videos" element={
          <PrivateRoute>
            <Videos />
          </PrivateRoute>
        } />
        <Route path="/categories" element={
          <PrivateRoute>
            <Categories />
          </PrivateRoute>
        } />
        <Route path="/import" element={
          <PrivateRoute>
            <VideoImport />
          </PrivateRoute>
        } />
        {/* Optionally, add a default route or redirect here */}
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;
