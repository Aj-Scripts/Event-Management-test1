import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Search, User, Menu, X, ChevronRight, Star, TrendingUp, Download, CreditCard, Check, Filter } from 'lucide-react';
import EventCard from './EventCard';
// ...existing code...
import { eventsAPI } from '../services/api';

const EventsPage = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, setCurrentView, setSelectedEvent }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = await eventsAPI.getAll(selectedCategory === 'All' ? '' : selectedCategory);
        setEvents(fetchedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [selectedCategory]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesDate = !selectedDate || (event.date && event.date.startsWith(selectedDate));
    return matchesSearch && matchesCategory && matchesDate;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="heading-1 mb-4 text-white">All Events</h1>
        <p className="body-text max-w-2xl mx-auto text-gray-300">Explore our complete collection of events and find the perfect experience for you</p>
      </div>

      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-professional p-8 mb-12 border border-gray-600">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Filter size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-white">Filters</h3>
            <p className="text-gray-300 text-sm">Refine your search to find exactly what you're looking for</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="form-label">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-input"
            >
              {['All','Technology','Music','Business','Arts','Sports','Education'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Search</label>
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">
              <Calendar size={16} className="text-gray-600 inline mr-2" />
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">&nbsp;</label>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDate('');
              }}
              className="btn-secondary w-full rounded-xl font-bold"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <p className="text-gray-300 font-medium">
            Found <span className="font-bold text-blue-400">{filteredEvents.length}</span> events
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Filter size={16} />
            {selectedCategory !== 'All' && <span>Category: {selectedCategory}</span>}
            {searchQuery && <span>Search: "{searchQuery}"</span>}
            {selectedDate && <span>Date: {selectedDate}</span>}
          </div>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl">
          <div className="text-gray-400 mb-4">
            <Search size={64} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No events found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedDate('');
            }}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, idx) => (
            <EventCard
              key={event._id || event.id || idx}
              event={event}
              onClick={(e) => {
                setSelectedEvent(e);
                setCurrentView('details');
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
