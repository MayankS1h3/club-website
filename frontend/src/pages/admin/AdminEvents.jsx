import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Calendar,
  Clock,
  Edit,
  Trash2,
  Filter,
  ChevronDown
} from 'lucide-react';
import api from '../../services/api';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if there's a filter in URL params
    const urlFilter = searchParams.get('filter');
    if (urlFilter) {
      setCurrentFilter(urlFilter);
    }
    fetchEvents();
  }, [searchParams]);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, currentFilter]);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter
    const now = new Date();
    switch (currentFilter) {
      case 'upcoming':
        filtered = filtered.filter(event => new Date(event.date) >= now);
        break;
      case 'past':
        filtered = filtered.filter(event => new Date(event.date) < now);
        break;
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= today && eventDate < tomorrow;
        });
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    // Sort by date (upcoming first, then past in reverse chronological order)
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (currentFilter === 'past') {
        return dateB - dateA; // Most recent past events first
      }
      return dateA - dateB; // Upcoming events first
    });

    setFilteredEvents(filtered);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await api.delete(`/admin/events/${eventId}`);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) >= new Date();
  };

  const filterOptions = [
    { value: 'all', label: 'All Events' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'past', label: 'Past Events' },
    { value: 'today', label: 'Today' }
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
          <h1 className="text-2xl font-bold text-dark-900">Events</h1>
          <p className="text-dark-600">Manage your club's events</p>
        </div>
        <Link
          to="/admin/events/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-nightclub-600 hover:bg-nightclub-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nightclub-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-dark-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-dark-300 rounded-md leading-5 bg-white placeholder-dark-500 focus:outline-none focus:placeholder-dark-400 focus:ring-1 focus:ring-nightclub-500 focus:border-nightclub-500"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="inline-flex justify-center items-center w-full rounded-md border border-dark-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-dark-700 hover:bg-dark-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nightclub-500"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {filterOptions.find(option => option.value === currentFilter)?.label}
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>

            {filterOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`${
                        currentFilter === option.value
                          ? 'bg-nightclub-100 text-nightclub-900'
                          : 'text-dark-700'
                      } block px-4 py-2 text-sm hover:bg-dark-100 w-full text-left`}
                      onClick={() => {
                        setCurrentFilter(option.value);
                        setFilterOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-dark-600">
          <span>Total: {events.length}</span>
          <span>Showing: {filteredEvents.length}</span>
          <span>
            Upcoming: {events.filter(event => isUpcoming(event.date)).length}
          </span>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredEvents.length > 0 ? (
          <ul className="divide-y divide-dark-200">
            {filteredEvents.map((event) => (
              <li key={event.id} className="p-6 hover:bg-dark-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Event Image */}
                    <div className="flex-shrink-0">
                      {event.poster_url ? (
                        <img
                          className="h-16 w-16 rounded-lg object-cover"
                          src={event.poster_url}
                          alt={event.title}
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-lg bg-dark-200 flex items-center justify-center">
                          <Calendar className="h-8 w-8 text-dark-400" />
                        </div>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-medium text-dark-900 truncate">
                          {event.title}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          isUpcoming(event.date)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-dark-100 text-dark-800'
                        }`}>
                          {isUpcoming(event.date) ? 'Upcoming' : 'Past'}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-dark-500 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatTime(event.date)}
                        </div>
                        {event.price && (
                          <div className="font-medium text-nightclub-600">
                            ${event.price}
                          </div>
                        )}
                      </div>
                      
                      {event.description && (
                        <p className="mt-2 text-sm text-dark-600 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/admin/events/${event.id}/edit`}
                      className="inline-flex items-center p-2 border border-transparent rounded-md text-nightclub-600 hover:bg-nightclub-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nightclub-500"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="inline-flex items-center p-2 border border-transparent rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-dark-400" />
            <h3 className="mt-2 text-sm font-medium text-dark-900">
              {searchTerm || currentFilter !== 'all' ? 'No matching events' : 'No events'}
            </h3>
            <p className="mt-1 text-sm text-dark-500">
              {searchTerm || currentFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first event.'
              }
            </p>
            {(!searchTerm && currentFilter === 'all') && (
              <div className="mt-6">
                <Link
                  to="/admin/events/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-nightclub-600 hover:bg-nightclub-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nightclub-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Event
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;