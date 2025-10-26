import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Search, User, Menu, X, ChevronRight, Star, TrendingUp, Download, CreditCard, Check, Filter } from 'lucide-react';
import QRCode from 'qrcode';
import EventCard from "./EventCard";
// ...existing code...
import { bookingsAPI, eventsAPI } from '../services/api';

const UserDashboard = ({ bookings, setCurrentView, setSelectedEvent, setBookings }) => {
  const [userBookings, setUserBookings] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Fetch user bookings from backend
        const fetchedBookings = await bookingsAPI.getUserBookings();
        setUserBookings(fetchedBookings);
        setBookings(fetchedBookings); // Update parent state with fetched bookings

        // Fetch recommendations
        const recommendations = await bookingsAPI.getRecommendations();
        setRecommendedEvents(recommendations.slice(0, 3));
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load dashboard data');
        setRecommendedEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const displayBookings = userBookings.length > 0 ? userBookings : bookings;
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="heading-1 mb-4 text-white">My Bookings</h1>
        <p className="body-text max-w-2xl mx-auto text-gray-300">Manage your event bookings and download your tickets</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-gray-800 rounded-2xl border border-gray-700">
          <div className="text-gray-500 mb-6">
            <Calendar size={80} className="mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-gray-400 mb-4">No bookings yet</h3>
          <p className="text-gray-300 mb-8 max-w-md mx-auto">Start exploring events and book your first ticket to see your bookings here!</p>
          <button
            onClick={() => setCurrentView('events')}
            className="btn-primary text-lg px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl"
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {bookings.map(booking => {
            const event = booking.eventId;
            return (
              <div key={booking._id} className="card card-hover p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  {event && event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full lg:w-64 h-48 object-cover rounded-2xl shadow-md"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-4 text-white">{event ? event.title : 'Event'}</h3>
                        <div className="space-y-3 text-gray-300">
                          <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-blue-600" />
                            <span className="font-medium">{event && new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock size={18} className="text-blue-600" />
                            <span className="font-medium">{event && event.time}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin size={18} className="text-blue-600" />
                            <span className="font-medium">{event && event.venue}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-2 bg-green-700 text-green-300 rounded-full font-bold text-sm">
                        <Check size={18} />
                        {booking.status}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between pt-6 border-t border-gray-700">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div>
                          <span className="text-gray-300 font-medium">Tickets: </span>
                          <span className="font-bold text-lg text-white">{booking.tickets}</span>
                        </div>
                        <div>
                          <span className="text-gray-300 font-medium">Total: </span>
                          <span className="font-bold text-2xl text-blue-400">${booking.totalAmount}</span>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            const blob = await bookingsAPI.downloadTicket(booking._id);
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `e-ticket-${booking._id}.pdf`;
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                            document.body.removeChild(a);
                          } catch (err) {
                            console.error('Failed to download ticket:', err);
                            alert('Failed to download ticket. Please try again.');
                          }
                        }}
                        className="btn-secondary flex items-center gap-3 px-6 py-3 rounded-xl font-bold"
                      >
                        <Download size={20} />
                        Download E-Ticket
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {bookings.length > 0 && (
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="heading-2 mb-4 text-white">Recommended for You</h2>
            <p className="text-gray-300">Based on your booking history</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedEvents.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-gray-800 rounded-2xl">
                <p className="text-gray-300 font-medium">No recommendations yet. Book more events to get personalized suggestions!</p>
              </div>
            ) : (
              recommendedEvents.map(event => (
                <EventCard
                  key={event._id}
                  event={event}
                  onClick={() => {
                    setSelectedEvent && setSelectedEvent(event);
                    setCurrentView && setCurrentView('details');
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};


export default UserDashboard;


