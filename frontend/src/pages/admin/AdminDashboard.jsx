import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Image, 
  Users, 
  Eye,
  Plus,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    galleryImages: 0,
    recentViews: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch events to calculate stats
        const eventsResponse = await api.get('/events');
        const events = eventsResponse.data;
        
        const now = new Date();
        const upcomingEvents = events.filter(event => new Date(event.date) >= now);
        
        setStats({
          totalEvents: events.length,
          upcomingEvents: upcomingEvents.length,
          galleryImages: 0, // Will be updated when gallery API is ready
          recentViews: Math.floor(Math.random() * 1000) + 500 // Mock data
        });
        
        // Get recent events (last 5)
        const recent = events
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
        setRecentEvents(recent);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      name: 'Total Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'bg-blue-500',
      href: '/admin/events'
    },
    {
      name: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: Clock,
      color: 'bg-green-500',
      href: '/admin/events?filter=upcoming'
    },
    {
      name: 'Gallery Images',
      value: stats.galleryImages,
      icon: Image,
      color: 'bg-purple-500',
      href: '/admin/gallery'
    },
    {
      name: 'Page Views',
      value: stats.recentViews,
      icon: Eye,
      color: 'bg-orange-500',
      href: '#'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nightclub-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Dashboard</h1>
          <p className="text-dark-600">Welcome back! Here's what's happening at your club.</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/admin/events/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-nightclub-600 hover:bg-nightclub-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nightclub-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.name}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
            >
              <dt>
                <div className={`absolute ${card.color} rounded-md p-3`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 text-sm font-medium text-dark-500 truncate">
                  {card.name}
                </p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-dark-900">{card.value}</p>
                <div className="absolute bottom-0 inset-x-0 bg-dark-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    {card.href !== '#' ? (
                      <Link
                        to={card.href}
                        className="font-medium text-nightclub-600 hover:text-nightclub-500"
                      >
                        View all
                      </Link>
                    ) : (
                      <span className="font-medium text-dark-400">Analytics coming soon</span>
                    )}
                  </div>
                </div>
              </dd>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-dark-900">
                Recent Events
              </h3>
              <Link
                to="/admin/events"
                className="text-sm font-medium text-nightclub-600 hover:text-nightclub-500"
              >
                View all
              </Link>
            </div>
            <div className="mt-6 flow-root">
              {recentEvents.length > 0 ? (
                <ul className="-my-5 divide-y divide-dark-200">
                  {recentEvents.map((event) => (
                    <li key={event.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {event.poster_url ? (
                            <img
                              className="h-8 w-8 rounded-full object-cover"
                              src={event.poster_url}
                              alt=""
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-dark-200 flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-dark-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-dark-900 truncate">
                            {event.title}
                          </p>
                          <p className="text-sm text-dark-500">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            new Date(event.date) >= new Date()
                              ? 'bg-green-100 text-green-800'
                              : 'bg-dark-100 text-dark-800'
                          }`}>
                            {new Date(event.date) >= new Date() ? 'Upcoming' : 'Past'}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <Calendar className="mx-auto h-12 w-12 text-dark-400" />
                  <h3 className="mt-2 text-sm font-medium text-dark-900">No events</h3>
                  <p className="mt-1 text-sm text-dark-500">
                    Get started by creating your first event.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/admin/events/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-nightclub-600 hover:bg-nightclub-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nightclub-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Event
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg leading-6 font-medium text-dark-900 mb-6">
              Quick Actions
            </h3>
            <div className="space-y-4">
              <Link
                to="/admin/events/new"
                className="block p-4 border border-dark-200 rounded-lg hover:border-nightclub-300 hover:bg-nightclub-50 transition-colors"
              >
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-nightclub-600" />
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-dark-900">Create Event</h4>
                    <p className="text-sm text-dark-500">Add a new upcoming event</p>
                  </div>
                </div>
              </Link>
              
              <Link
                to="/admin/gallery"
                className="block p-4 border border-dark-200 rounded-lg hover:border-nightclub-300 hover:bg-nightclub-50 transition-colors"
              >
                <div className="flex items-center">
                  <Image className="h-8 w-8 text-nightclub-600" />
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-dark-900">Manage Gallery</h4>
                    <p className="text-sm text-dark-500">Upload and organize images</p>
                  </div>
                </div>
              </Link>
              
              <Link
                to="/admin/settings"
                className="block p-4 border border-dark-200 rounded-lg hover:border-nightclub-300 hover:bg-nightclub-50 transition-colors"
              >
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-nightclub-600" />
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-dark-900">Settings</h4>
                    <p className="text-sm text-dark-500">Configure admin settings</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;