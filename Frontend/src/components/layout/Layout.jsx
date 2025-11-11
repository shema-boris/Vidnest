import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  VideoCameraIcon,
  PlusIcon,
  TagIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'My Videos', href: '/videos', icon: VideoCameraIcon },
  { name: 'Add Video', href: '/videos/add', icon: PlusIcon },
  { name: 'Categories', href: '/categories', icon: TagIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout, useUserProfile } = useAuth();
  const { data: user } = useUserProfile();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-800 px-6 pb-6 border-r border-gray-700">
      <div className="flex h-20 shrink-0 items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center">
            <VideoCameraIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            Vidnest
          </span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-4">
          <li>
            <ul role="list" className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={classNames(
                      location.pathname === item.href
                        ? 'bg-gray-800 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800/80 hover:text-white',
                      'group flex items-center gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200 hover:translate-x-1'
                    )}
                  >
                    <item.icon 
                      className={classNames(
                        location.pathname === item.href 
                          ? 'text-primary-500' 
                          : 'text-gray-400 group-hover:text-primary-500',
                        'h-4 w-4 flex-shrink-0 transition-colors duration-200 mr-2'
                      )} 
                      aria-hidden="true" 
                    />
                    {item.name}
                    {location.pathname === item.href && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-primary-500"></span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto pt-4 border-t border-gray-700">
            {isAuthenticated && user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-x-3 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors duration-200">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold shadow-md">
                    {user.name?.charAt(0).toUpperCase() || (
                      <UserCircleIcon className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email || ''}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="group w-full flex items-center gap-x-3 rounded-lg p-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-colors duration-200"
                >
                  <ArrowRightOnRectangleIcon className="h-3.5 w-3.5 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="flex w-full items-center justify-center rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-700 hover:shadow-md"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-primary-600 hover:to-primary-700 hover:shadow-lg"
                >
                  Create account
                </Link>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile menu */}
      <Transition.Root show={mobileMenuOpen} as="div">
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child
            as="div"
            enter="transition-opacity ease-linear duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as="div"
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as="div"
                  enter="ease-in-out duration-200"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button 
                      type="button" 
                      className="-m-2.5 p-2.5 rounded-full hover:bg-gray-800/50 transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-4 w-4 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                {sidebarContent}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {sidebarContent}
      </div>

      {/* Main content */}
      <div className="lg:pl-72 transition-all duration-200">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="flex-1 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary-500 flex items-center justify-center lg:hidden">
                <VideoCameraIcon className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                Vidnest
              </span>
            </Link>
            
            {isAuthenticated && user && (
              <div className="flex items-center gap-x-4">
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
            )}
          </div>
        </div>

        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
