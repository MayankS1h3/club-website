import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Calendar,
  Clock,
  DollarSign,
  Users,
  Upload,
  AlertCircle,
  ArrowLeft,
  Save,
  Loader
} from 'lucide-react';
import api from '../../services/api';

// Validation schema
const eventSchema = z.object({
  title: z.string().min(1, 'Event title is required').max(100, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description too long'),
  date: z.string().min(1, 'Event date is required'),
  time: z.string().min(1, 'Event time is required'),
  price: z.number().min(0, 'Price must be 0 or greater').optional(),
  capacity: z.number().min(1, 'Capacity must be at least 1').optional(),
  venue: z.string().max(200, 'Venue name too long').optional(),
});

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [event, setEvent] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    resolver: zodResolver(eventSchema)
  });

  // Load event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        const eventData = response.data;
        setEvent(eventData);
        
        // Parse the date/time for form inputs
        const eventDate = new Date(eventData.date);
        const dateStr = eventDate.toISOString().split('T')[0];
        const timeStr = eventDate.toTimeString().slice(0, 5);
        
        // Reset form with event data
        reset({
          title: eventData.title,
          description: eventData.description,
          date: dateStr,
          time: timeStr,
          price: eventData.price || '',
          capacity: eventData.capacity || '',
          venue: eventData.venue || ''
        });

        // Set current image if exists
        if (eventData.poster_url) {
          setCurrentImage(eventData.poster_url);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        alert('Failed to load event data');
        navigate('/admin/events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, reset, navigate]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setUploadError('');
    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const event = { target: { files: [file] } };
      handleImageSelect(event);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadError('');
    // Reset file input
    const fileInput = document.getElementById('poster-upload');
    if (fileInput) fileInput.value = '';
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Combine date and time
      const eventDateTime = new Date(`${data.date}T${data.time}`);
      
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('date', eventDateTime.toISOString());
      
      if (data.price) formData.append('price', data.price.toString());
      if (data.capacity) formData.append('capacity', data.capacity.toString());
      if (data.venue) formData.append('venue', data.venue);
      if (imageFile) formData.append('poster', imageFile);

      await api.put(`/admin/events/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/admin/events', { 
        state: { message: 'Event updated successfully!' }
      });
    } catch (error) {
      console.error('Error updating event:', error);
      alert(error.response?.data?.message || 'Failed to update event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading event data...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
        <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/admin/events')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/events')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Events
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Event Details</h2>
            <p className="text-sm text-gray-500">
              Update the information about your event
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                {...register('title')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter event title..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Event Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Describe your event..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Event Date *
                </label>
                <input
                  type="date"
                  {...register('date')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Event Time *
                </label>
                <input
                  type="time"
                  {...register('time')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.time.message}
                  </p>
                )}
              </div>
            </div>

            {/* Price and Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Ticket Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price', { valueAsNumber: true })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="h-4 w-4 inline mr-1" />
                  Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  {...register('capacity', { valueAsNumber: true })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter max capacity..."
                />
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.capacity.message}
                  </p>
                )}
              </div>
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue Location
              </label>
              <input
                type="text"
                {...register('venue')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter venue name or address..."
              />
              {errors.venue && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.venue.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Event Poster</h2>
            <p className="text-sm text-gray-500">
              Update the event poster image
            </p>
          </div>
          
          <div className="p-6">
            {/* Current Image */}
            {currentImage && !imagePreview && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Current Poster:</p>
                <img
                  src={currentImage}
                  alt="Current event poster"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {!imagePreview ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
                onDrop={handleImageDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById('poster-upload').click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {currentImage ? 'Replace Event Poster' : 'Upload Event Poster'}
                </h3>
                <p className="text-gray-500 mb-4">
                  Drag and drop an image here, or click to select
                </p>
                <p className="text-sm text-gray-400">
                  PNG, JPG, GIF up to 5MB
                </p>
                <input
                  id="poster-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <p className="text-sm font-medium text-gray-700 mb-2">New Poster Preview:</p>
                <img
                  src={imagePreview}
                  alt="New event poster preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {uploadError && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {uploadError}
              </p>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/events')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating Event...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Event
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;