import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8001/api/v1',
  withCredentials: true, // Include cookies for admin authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Admin token expired or invalid - redirect to login
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin') {
        window.location.href = '/admin';
      }
    }
    return Promise.reject(error);
  }
);

// Admin Authentication API
export const adminAuth = {
  login: async (credentials) => {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/admin/logout');
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/admin/profile');
    return response.data;
  },
};

// Events API
export const eventsAPI = {
  // Public endpoints
  getUpcoming: async () => {
    const response = await api.get('/events/upcoming');
    return response.data;
  },
  
  getCalendar: async () => {
    const response = await api.get('/events/calendar');
    return response.data;
  },
  
  // Admin endpoints
  getAllAdmin: async () => {
    const response = await api.get('/events/admin/all');
    return response.data;
  },
  
  getByIdAdmin: async (id) => {
    const response = await api.get(`/events/admin/${id}`);
    return response.data;
  },
  
  create: async (eventData) => {
    const response = await api.post('/events', eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  update: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

// Uploads API
export const uploadsAPI = {
  uploadEventPoster: async (file) => {
    const formData = new FormData();
    formData.append('poster', file);
    
    const response = await api.post('/uploads/event-poster', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  uploadGalleryImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/uploads/gallery-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  uploadMultipleGallery: async (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    
    const response = await api.post('/uploads/gallery-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  deleteFile: async (fileUrl) => {
    const response = await api.delete('/uploads/file', {
      data: { fileUrl }
    });
    return response.data;
  },
  
  getStorageInfo: async () => {
    const response = await api.get('/uploads/info');
    return response.data;
  },
};

export default api;