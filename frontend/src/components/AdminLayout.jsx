import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Menu,
  X,
  LayoutDashboard,
  Calendar,
  Image,
  Settings,
  LogOut,
  User,
} from 'lucide-react';

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Gallery', href: '/admin/gallery', icon: Image },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (href) => location.pathname.startsWith(href);

  return (
    <div className="h-screen flex overflow-hidden bg-dark-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-dark-900 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent navigation={navigation} isActive={isActive} admin={admin} onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent navigation={navigation} isActive={isActive} admin={admin} onLogout={handleLogout} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-dark-200 text-dark-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-nightclub-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-2xl font-semibold text-dark-900">
                Admin Portal
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-dark-400" />
                <span className="ml-2 text-sm font-medium text-dark-700">
                  {admin?.username}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Sidebar content component
const SidebarContent = ({ navigation, isActive, admin, onLogout }) => (
  <div className="flex flex-col h-full bg-dark-50">
    {/* Logo */}
    <div className="flex items-center h-16 flex-shrink-0 px-4 bg-nightclub-600">
      <h1 className="text-xl font-bold text-white">Club Admin</h1>
    </div>
    
    {/* Navigation */}
    <div className="flex-1 flex flex-col overflow-y-auto">
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                isActive(item.href)
                  ? 'bg-nightclub-100 border-nightclub-500 text-nightclub-700'
                  : 'border-transparent text-dark-600 hover:bg-dark-100 hover:text-dark-900'
              } group flex items-center px-2 py-2 text-sm font-medium border-l-4 transition-colors duration-150`}
            >
              <IconComponent
                className={`${
                  isActive(item.href) ? 'text-nightclub-500' : 'text-dark-400 group-hover:text-dark-500'
                } mr-3 h-6 w-6`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>

    {/* User info and logout */}
    <div className="flex-shrink-0 flex border-t border-dark-200 p-4">
      <div className="flex-shrink-0 w-full group block">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-9 w-9 bg-nightclub-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-dark-700 group-hover:text-dark-900">
                {admin?.username}
              </p>
              <p className="text-xs font-medium text-dark-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-dark-400 hover:text-dark-600 hover:bg-dark-100 rounded-md transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default AdminLayout;