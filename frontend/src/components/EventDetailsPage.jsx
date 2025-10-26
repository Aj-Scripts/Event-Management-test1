import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Search, User, Menu, X, ChevronRight, Star, TrendingUp, Download, CreditCard, Check, Filter } from 'lucide-react';
import EventCard from './EventCard';
import { eventsAPI } from '../services/api';

const BACKEND_URL = 'http://localhost:5000';
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return BACKEND_URL + url;
};

const EventDetailsPage = ({ selectedEvent, setCurrentView, userRole, setShowBookingModal, setBookingStep, setSelectedEvent }) => {
  const [event, setEvent] = useState(selectedEvent);
  const [similarEvents, setSimilarEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!selectedEvent || !selectedEvent._id) return;

      try {
        setLoading(true);
        const eventData = await eventsAPI.getById(selectedEvent._id);
        setEvent(eventData);

        // Fetch similar events (same category)
        const allEvents = await eventsAPI.getAll();
        const similar = allEvents.filter(e =>
          e.category === eventData.category && e._id !== eventData._id
        ).slice(0, 2);
        setSimilarEvents(similar);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [selectedEvent]);

  if (!event) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button
        onClick={() => setCurrentView('events')}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-500 mb-8 font-semibold text-sm uppercase tracking-wide transition-colors"
      >
        <ChevronRight size={20} className="rotate-180" />
        Back to Events
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <img
            src={getImageUrl(selectedEvent.imageUrl)}
            alt={selectedEvent.title}
            className="w-full h-96 object-cover rounded-2xl shadow-professional-lg mb-8"
          />

          <h1 className="heading-1 mb-6">{selectedEvent.title}</h1>

          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-3 text-gray-300 bg-gradient-to-r from-gray-700 to-gray-800 px-4 py-3 rounded-xl border border-gray-600">
              <Calendar size={20} className="text-blue-400" />
              <span className="font-medium">{new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 bg-gradient-to-r from-gray-700 to-gray-800 px-4 py-3 rounded-xl border border-gray-600">
              <MapPin size={20} className="text-blue-400" />
              <span className="font-medium">{selectedEvent.venue}, {selectedEvent.location}</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-8 rounded-2xl mb-8 border border-gray-600">
            <h3 className="font-bold text-xl mb-4 text-white">About this event</h3>
            <p className="body-text leading-relaxed text-gray-300">{selectedEvent.description}</p>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-xl mb-6 text-white">Similar Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {similarEvents.length > 0 ? (
                similarEvents.map(event => (
                  <EventCard
                    key={event._id}
                    event={event}
                    onClick={(e) => {
                      setSelectedEvent(e);
                      // Stay on details page, just update the event
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-400">
                  <p>No similar events found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-professional-lg p-8 sticky top-24 border border-gray-600">
            <div className="mb-8">
              <div className="text-4xl font-bold text-blue-400 mb-2">${typeof selectedEvent.ticketPrice === 'number' ? selectedEvent.ticketPrice.toFixed(2) : 'N/A'}</div>
              <div className="text-gray-300 font-medium">per ticket</div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-center justify-between py-3 border-b border-gray-600">
                <span className="text-gray-300 font-medium">Category</span>
                <span className="font-bold text-white">{selectedEvent.category}</span>
              </div>
            </div>

            {userRole ? (
              <button
                onClick={() => {
                  setShowBookingModal(true);
                  setBookingStep(1);
                }}
                className="btn-primary w-full text-lg py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Book Tickets
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="btn-primary w-full text-lg py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Login to Book
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default EventDetailsPage;
