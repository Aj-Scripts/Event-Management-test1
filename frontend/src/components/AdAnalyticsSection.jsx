import React from 'react';
import { Calendar, MapPin, Clock, Search, User, Menu, X, ChevronRight, Star, TrendingUp, Download, CreditCard, Check, Filter } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const AdAnalyticsSection = ({ analytics, totalRevenue, totalTickets, totalBookings, totalEvents, totalUsers, ticketsPerEvent, revenueLineData }) => {
  return (
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Tickets Sold per Event</h3>
          <Bar data={ticketsPerEvent} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Revenue Over Time</h3>
          <Line data={revenueLineData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>
    </>
  );
};

export default AdAnalyticsSection;
