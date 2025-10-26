// API service for backend communication
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('token');

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const isFormData = options.body && typeof options.body === 'object' && options.body instanceof FormData;

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    headers,
    ...options,
  };

  // If the body is a plain object (and not FormData) stringify it for JSON requests
  if (config.body && !isFormData && typeof config.body === 'object') {
    try {
      config.body = JSON.stringify(config.body);
    } catch (err) {
      // leave as-is if it cannot be stringified
    }
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Events API
export const eventsAPI = {
  getAll: (category = '') => apiRequest(`/events${category ? `?category=${category}` : ''}`),
  getAllForAdmin: () => apiRequest('/events/admin/all'),
  getById: (id) => apiRequest(`/events/${id}`),
  create: (eventData) => apiRequest('/events', {
    method: 'POST',
    body: eventData,
  }),
  update: (id, eventData) => apiRequest(`/events/${id}`, {
    method: 'PUT',
    body: eventData,
  }),
  delete: (id) => apiRequest(`/events/${id}`, {
    method: 'DELETE',
  }),
  toggleActive: (id, isActive) => apiRequest(`/events/${id}/toggle-active`, {
    method: 'PUT',
    body: JSON.stringify({ isActive }),
  }),
};

// Bookings API
export const bookingsAPI = {
  getUserBookings: () => apiRequest('/bookings'),
  create: (bookingData) => apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),
  getRecommendations: () => apiRequest('/bookings/recommendations'),
  downloadTicket: async (bookingId) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to download ticket');
    }
    const blob = await response.blob();
    return blob;
  },
};

// Analytics API (Admin only)
export const analyticsAPI = {
  getData: () => apiRequest('/analytics'),
  getAllBookings: () => apiRequest('/analytics/bookings'),
  getEventRevenue: () => apiRequest('/analytics/event-revenue'),
  getUsers: () => apiRequest('/analytics/users'),
  setUserActive: (userId, isActive) => apiRequest(`/analytics/users/${userId}/activate`, {
    method: 'PUT',
    body: JSON.stringify({ isActive }),
  }),
  deleteUser: (userId) => apiRequest(`/analytics/users/${userId}`, { method: 'DELETE' }),
  getCustomReport: (params) => apiRequest(`/analytics/report/custom?${new URLSearchParams(params)}`),
  downloadCSV: (params = {}) => fetch(`${API_BASE_URL}/analytics/report/csv?${new URLSearchParams(params)}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  }),
  downloadPDF: (params = {}) => fetch(`${API_BASE_URL}/analytics/report/pdf?${new URLSearchParams(params)}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  }),
};

// Auth API
export const authAPI = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  signup: (data) => apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  forgotPassword: (email) => apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  resetPassword: (data) => apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};
