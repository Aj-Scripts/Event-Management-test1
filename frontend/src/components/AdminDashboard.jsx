import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Search, User, Menu, X, ChevronRight, Star, TrendingUp, Download, CreditCard, Check, Filter } from 'lucide-react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { analyticsAPI, eventsAPI, bookingsAPI } from '../services/api';

// Helper to resolve image URLs coming from backend. If the URL is already absolute, return it.
const BACKEND_URL = 'http://localhost:5000';
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return BACKEND_URL + url;
};

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = ({ bookings: propBookings = [] }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState(propBookings || []);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [eventForm, setEventForm] = useState({
    _id: '',
    title: '',
    description: '',
    category: 'Technology',
    venue: '',
    date: '',
    ticketPrice: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Report generation state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    startDate: '',
    endDate: '',
    category: 'all',
    reportType: 'summary'
  });
  const [generatingReport, setGeneratingReport] = useState(false);

  const fetchAnalyticsAndEvents = async () => {
    try {
      setLoading(true);
      const analyticsData = await analyticsAPI.getData();
      const eventsData = await eventsAPI.getAllForAdmin();
      // Fetch event-wise revenue from backend
      let eventRevenue = [];
      try {
        eventRevenue = await analyticsAPI.getEventRevenue();
      } catch (err) {
        console.warn('Could not fetch event revenue:', err);
      }

      // Build a map from eventId to revenue/tickets
      const revMap = {};
      (eventRevenue || []).forEach(r => {
        // eventId may be available as r.eventId or r.eventId._id
        const id = r.eventId?._id || r.eventId;
        revMap[id] = { totalRevenue: r.totalRevenue || 0, ticketsSold: r.ticketsSold || 0 };
      });

      // Merge revenue into events
      const eventsWithRevenue = (eventsData || []).map(ev => ({
        ...ev,
        revenue: revMap[ev._id]?.totalRevenue || 0,
        ticketsSold: revMap[ev._id]?.ticketsSold || 0,
      }));

      // Fetch all bookings for admin analytics and populate event details
      const bookingsData = await analyticsAPI.getAllBookings();
      const bookingsWithEvents = (bookingsData || []).map(b => ({
        ...b,
        event: eventsWithRevenue.find(e => e._id.toString() === (b.eventId?._id || b.eventId).toString()),
        user: b.userId
      }));

      setAnalytics(analyticsData);
      setEvents(eventsWithRevenue);
      setBookings(bookingsWithEvents);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsAndEvents();
    // Fetch users for user management
    const fetchUsers = async () => {
      try {
        const data = await analyticsAPI.getUsers();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const totalRevenue = analytics?.totalRevenue || 0;
  const totalTickets = analytics?.totalTickets || 0;
  const totalBookings = analytics?.totalBookings || 0;
  const totalEvents = analytics?.totalEvents || 0;
  const totalUsers = analytics?.totalUsers || 0;

  // Chart data for tickets per event
  const ticketsPerEvent = {
    labels: events.map(e => e.title),
    datasets: [
      {
        label: 'Tickets Sold',
        data: events.map(e => e.ticketsSold || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
    ],
  };

  // Chart data for revenue over time (by day)
  const revenueByDate = {};
  (bookings || []).forEach(b => {
    const date = new Date(b.createdAt).toLocaleDateString();
    revenueByDate[date] = (revenueByDate[date] || 0) + (b.totalAmount || 0);
  });
  const revenueLineData = {
    labels: Object.keys(revenueByDate),
    datasets: [
      {
        label: 'Revenue',
        data: Object.values(revenueByDate),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Pie chart data for event distribution by category
  const categoryCount = {};
  events.forEach(event => {
    categoryCount[event.category] = (categoryCount[event.category] || 0) + 1;
  });
  const eventDistributionData = {
    labels: Object.keys(categoryCount),
    datasets: [
      {
        data: Object.values(categoryCount),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Top-performing events by revenue
  const topEvents = events
    .filter(e => e.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Recent bookings summary
  const recentBookings = (bookings || [])
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // User growth chart over time (by month) - count unique users per month
  const userGrowth = {};
  const uniqueUsersPerMonth = {};
  (bookings || []).forEach(b => {
    const month = new Date(b.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    const userId = b.userId?._id || b.userId;
    if (!uniqueUsersPerMonth[month]) {
      uniqueUsersPerMonth[month] = new Set();
    }
    uniqueUsersPerMonth[month].add(userId);
  });
  Object.keys(uniqueUsersPerMonth).forEach(month => {
    userGrowth[month] = uniqueUsersPerMonth[month].size;
  });
  const userGrowthData = {
    labels: Object.keys(userGrowth),
    datasets: [
      {
        label: 'Unique Users',
        data: Object.values(userGrowth),
        borderColor: 'rgba(139, 92, 246, 1)',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-gradient-to-r from-gray-700 to-gray-800 p-1 rounded-lg border border-gray-600">
        <button
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'overview' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'events' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
          }`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'users' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
          }`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'reports' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
          }`}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100">Total Revenue</span>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <CreditCard size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold">${totalRevenue}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-100">Total Bookings</span>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Calendar size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold">{totalBookings}</div>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-pink-100">Active Events</span>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold">{totalEvents}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-orange-100">Total Users</span>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <User size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold">{totalUsers}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100">Total Tickets</span>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Check size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold">{totalTickets}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        <div className="card p-4">
          <h3 className="text-lg font-bold mb-3 text-white">Tickets Sold per Event</h3>
          <Bar data={ticketsPerEvent} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="card p-4">
          <h3 className="text-lg font-bold mb-3 text-white">Revenue Over Time</h3>
          <Line data={revenueLineData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-bold mb-4 text-white">Event Distribution by Category</h3>
          <Pie data={eventDistributionData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="card p-6">
          <h3 className="text-xl font-bold mb-4 text-white">Top Performing Events</h3>
          <div className="space-y-3">
            {topEvents.map((event, index) => (
              <div key={event._id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-300">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-white">{event.title}</p>
                    <p className="text-sm text-gray-400">{event.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">${event.revenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-400">{event.ticketsSold} tickets</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-bold mb-4 text-white">Recent Bookings</h3>
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-white">{booking.event?.title || 'Unknown Event'}</p>
                  <p className="text-sm text-gray-400">{booking.user?.name || booking.user?.email || 'Unknown User'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-400">${booking.totalAmount}</p>
                  <p className="text-sm text-gray-400">{new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="card p-6 mb-10">
        <h3 className="text-xl font-bold mb-4 text-white">User Growth Over Time</h3>
        <Line data={userGrowthData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>
        </>
      )}

      {activeTab === 'events' && (
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Manage Events</h2>
            <button
              className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
              onClick={() => {
                setModalMode('add');
                setEventForm({
                  _id: '',
                  title: '',
                  description: '',
                  category: 'Technology',
                  venue: '',
                  date: '',
                  ticketPrice: ''
                });
                setImageFile(null);
                setImagePreview(null);
                setShowEventModal(true);
              }}
            >
              + Add New Event
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3 px-4 font-semibold text-white">Event</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Revenue</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event._id} className="border-b border-gray-600 hover:bg-gray-700">
                    <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {event.imageUrl ? (
                            <img src={getImageUrl(event.imageUrl)} alt={event.title} className="w-12 h-12 rounded-md object-cover" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-600 rounded-md flex items-center justify-center text-sm text-gray-300">No Image</div>
                          )}
                          <span className="font-medium text-white">{event.title}</span>
                        </div>
                    </td>
                    <td className="py-3 px-4 text-white">{event.category}</td>
                    <td className="py-3 px-4 text-white">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-white">${event.ticketPrice}</td>
                    <td className="py-3 px-4 font-bold text-blue-400">${event.revenue ? event.revenue.toFixed(2) : 0}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-green-700 text-green-300 rounded-full text-sm font-semibold">
                        {event.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                            onClick={() => {
                            setModalMode('edit');
                            setEventForm({ ...event });
                            setImageFile(null);
                            setImagePreview(getImageUrl(event.imageUrl) || null);
                            setShowEventModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className={`text-sm font-medium px-2 py-1 rounded ${
                            event.isActive
                              ? 'text-orange-400 hover:text-orange-300 bg-orange-700 hover:bg-orange-600'
                              : 'text-green-400 hover:text-green-300 bg-green-700 hover:bg-green-600'
                          }`}
                          onClick={async () => {
                            const newActiveStatus = !event.isActive;
                            const action = newActiveStatus ? 'activate' : 'deactivate';
                            if (window.confirm(`Are you sure you want to ${action} this event?`)) {
                              await eventsAPI.toggleActive(event._id, newActiveStatus);
                              fetchAnalyticsAndEvents();
                            }
                          }}
                        >
                          {event.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          className="text-red-400 hover:text-red-300 text-sm font-medium"
                          onClick={async () => {
                            if (window.confirm('Delete this event?')) {
                              await eventsAPI.delete(event._id);
                              fetchAnalyticsAndEvents();
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3 px-4 font-semibold text-white">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Total Bookings</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(users) && users.length > 0 ? users.map((user, idx) => (
                  <tr key={user._id || idx} className="border-b border-gray-600 hover:bg-gray-700">
                    <td className="py-3 px-4 text-white">{user.name}</td>
                    <td className="py-3 px-4 text-white">{user.email}</td>
                    <td className="py-3 px-4 text-white">{user.totalBookings}</td>
                    <td className="py-3 px-4">
                      <span className={
                        'px-3 py-1 rounded-full text-sm font-semibold ' +
                        (user.isActive ? 'bg-green-700 text-green-300' : 'bg-red-700 text-red-300')
                      }>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        className={
                          'px-4 py-1 rounded-lg font-semibold ' +
                          (user.isActive
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-green-600 text-white hover:bg-green-700')
                        }
                        onClick={async () => {
                          await analyticsAPI.setUserActive(user._id, !user.isActive);
                          // Refetch users after update
                          const updatedUsers = await analyticsAPI.getUsers();
                          setUsers(updatedUsers);
                        }}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="px-4 py-1 rounded-lg font-semibold bg-gray-700 text-gray-300 hover:bg-red-700 hover:text-red-300"
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                            await analyticsAPI.deleteUser(user._id);
                            const updatedUsers = await analyticsAPI.getUsers();
                            setUsers(updatedUsers);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Report Generation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              className="flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
              onClick={() => setShowReportModal(true)}
            >
              <Download size={18} /> Generate Custom Report
            </button>
            <button
              className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              onClick={async () => {
                const res = await analyticsAPI.downloadCSV();
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'bookings_report.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
              }}
            >
              <Download size={18} /> Download CSV
            </button>
            <button
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              onClick={async () => {
                const res = await analyticsAPI.downloadPDF();
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'analytics_report.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
              }}
            >
              <Download size={18} /> Download PDF
            </button>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl shadow-xl p-4 w-full max-w-sm relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-300" onClick={() => setShowEventModal(false)}>
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-white">{modalMode === 'add' ? 'Add New Event' : 'Edit Event'}</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                // If an image file is selected, send as FormData (multipart/form-data)
                if (imageFile) {
                  const fd = new FormData();
                  fd.append('title', eventForm.title);
                  fd.append('description', eventForm.description);
                  fd.append('category', eventForm.category);
                  fd.append('venue', eventForm.venue);
                  fd.append('date', eventForm.date);
                  fd.append('ticketPrice', String(eventForm.ticketPrice));
                  fd.append('image', imageFile);

                  if (modalMode === 'add') {
                    await eventsAPI.create(fd);
                  } else {
                    await eventsAPI.update(eventForm._id, fd);
                  }
                } else {
                  // No image selected: send JSON as before
                  const payload = {
                    title: eventForm.title,
                    description: eventForm.description,
                    category: eventForm.category,
                    venue: eventForm.venue,
                    date: eventForm.date,
                    ticketPrice: eventForm.ticketPrice
                  };
                  if (modalMode === 'add') {
                    await eventsAPI.create(payload);
                  } else {
                    await eventsAPI.update(eventForm._id, payload);
                  }
                }

                // Reset modal state
                setShowEventModal(false);
                setImageFile(null);
                setImagePreview(null);
                fetchAnalyticsAndEvents();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  value={eventForm.title}
                  onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Description</label>
                <textarea
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  value={eventForm.description}
                  onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Category</label>
                <select
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  value={eventForm.category}
                  onChange={e => setEventForm(f => ({ ...f, category: e.target.value }))}
                  required
                >
                  {['Technology','Music','Business','Arts','Sports','Education'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Venue</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  value={eventForm.venue}
                  onChange={e => setEventForm(f => ({ ...f, venue: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  value={eventForm.date ? eventForm.date.slice(0,10) : ''}
                  onChange={e => setEventForm(f => ({ ...f, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Ticket Price</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  value={eventForm.ticketPrice}
                  onChange={e => setEventForm(f => ({ ...f, ticketPrice: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files && e.target.files[0];
                    setImageFile(file || null);
                    if (file) {
                      setImagePreview(URL.createObjectURL(file));
                    } else {
                      setImagePreview(null);
                    }
                  }}
                />
                {imagePreview && (
                  <img src={imagePreview} alt="preview" className="mt-2 w-32 h-20 object-cover rounded-md" />
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition"
              >
                {modalMode === 'add' ? 'Add Event' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl shadow-xl p-4 w-full max-w-sm relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-300" onClick={() => setShowReportModal(false)}>
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-white">Generate Custom Report</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setGeneratingReport(true);
                try {
                  if (reportForm.reportType === 'summary' || reportForm.reportType === 'detailed' || reportForm.reportType === 'category') {
                    // Generate JSON report
                    const reportData = await analyticsAPI.getCustomReport(reportForm);
                    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `custom_report_${reportForm.reportType}_${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                  } else if (reportForm.reportType === 'csv') {
                    // Download CSV
                    const res = await analyticsAPI.downloadCSV(reportForm);
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `bookings_report_${reportForm.startDate || 'all'}_to_${reportForm.endDate || 'all'}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                  } else if (reportForm.reportType === 'pdf') {
                    // Download PDF
                    const res = await analyticsAPI.downloadPDF(reportForm);
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `analytics_report_${reportForm.startDate || 'all'}_to_${reportForm.endDate || 'all'}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                  }
                  setShowReportModal(false);
                  setReportForm({
                    startDate: '',
                    endDate: '',
                    category: 'all',
                    reportType: 'summary'
                  });
                } catch (error) {
                  console.error('Error generating report:', error);
                  alert('Failed to generate report. Please try again.');
                } finally {
                  setGeneratingReport(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Start Date (optional)</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  value={reportForm.startDate}
                  onChange={e => setReportForm(f => ({ ...f, startDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">End Date (optional)</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  value={reportForm.endDate}
                  onChange={e => setReportForm(f => ({ ...f, endDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Category Filter</label>
                <select
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  value={reportForm.category}
                  onChange={e => setReportForm(f => ({ ...f, category: e.target.value }))}
                >
                  <option value="all">All Categories</option>
                  <option value="Technology">Technology</option>
                  <option value="Music">Music</option>
                  <option value="Business">Business</option>
                  <option value="Arts">Arts</option>
                  <option value="Sports">Sports</option>
                  <option value="Education">Education</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white">Report Type</label>
                <select
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  value={reportForm.reportType}
                  onChange={e => setReportForm(f => ({ ...f, reportType: e.target.value }))}
                  required
                >
                  <option value="summary">Summary Report (JSON)</option>
                  <option value="detailed">Detailed Report (JSON)</option>
                  <option value="category">Category Report (JSON)</option>
                  <option value="csv">CSV Report</option>
                  <option value="pdf">PDF Report</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={generatingReport}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50"
              >
                {generatingReport ? 'Generating...' : 'Generate Report'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
