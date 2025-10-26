import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Search, User, Menu, X, ChevronRight, Star, TrendingUp, Download, CreditCard, Check, Filter } from 'lucide-react';
import Hero from './Hero';
import EventCard from './EventCard';
// ...existing code...
import { eventsAPI } from '../services/api';

const categories = ['Music', 'Sports', 'Arts', 'Tech', 'Health', 'Business', 'Education'];

const HomePage = ({ searchQuery, setSearchQuery, setCurrentView, selectedCategory, setSelectedCategory, setSelectedEvent }) => {
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const allEvents = await eventsAPI.getAll();
        // For demo purposes, consider first 3 as trending and next 6 as upcoming
        // In real app, backend would have trending logic
        setTrendingEvents(allEvents.slice(0, 3));
        setUpcomingEvents(allEvents.slice(0, 6));
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
        // Fallback to dummy data if API fails
  setTrendingEvents([]);
  setUpcomingEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} setCurrentView={setCurrentView} />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4 text-white">Browse by Category</h2>
          <p className="body-text max-w-2xl mx-auto text-gray-300">Discover events across different categories and find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentView('events');
              }}
              className="p-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl hover:shadow-professional hover:-translate-y-1 transition-all duration-300 text-center border border-gray-600 group"
            >
              <div className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">{cat}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-orange-100 rounded-xl">
              <TrendingUp className="text-orange-600" size={32} />
            </div>
            <div>
              <h2 className="heading-2 text-white">Trending Events</h2>
              <p className="text-gray-300 mt-1">Most popular events this week</p>
            </div>
          </div>
          {error && (
            <div className="text-center py-12 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl shadow-md">
              <p className="text-red-400 mb-4 font-semibold">{error}</p>
              <p className="text-gray-300">Showing sample events instead</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingEvents.map(event => (
              <EventCard
                key={event._id || event.id}
                event={event}
                onClick={(e) => {
                  setSelectedEvent(e);
                  setCurrentView('details');
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="heading-2 text-white">Upcoming Events</h2>
            <p className="text-gray-300 mt-2">Don't miss out on these exciting upcoming events</p>
          </div>
          <button
            onClick={() => setCurrentView('events')}
            className="btn-secondary flex items-center gap-2 px-6 py-3 rounded-xl font-bold"
          >
            View All <ChevronRight size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map(event => (
            <EventCard
              key={event._id || event.id}
              event={event}
              onClick={(e) => {
                setSelectedEvent(e);
                setCurrentView('details');
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
