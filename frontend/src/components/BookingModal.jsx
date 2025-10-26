import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Search, User, Menu, X, ChevronRight, Star, TrendingUp, Download, CreditCard, Check, Filter } from 'lucide-react';
import QRCode from 'qrcode';
import { bookingsAPI } from '../services/api';

const BookingModal = ({ showBookingModal, setShowBookingModal, selectedEvent, bookingStep, setBookingStep, selectedTickets, setSelectedTickets, bookings, setBookings, setCurrentView }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Generate QR code for booking preview
  useEffect(() => {
    if (selectedEvent && bookingStep === 2) {
      const bookingData = `Event: ${selectedEvent.title}\nDate: ${new Date(selectedEvent.date).toLocaleDateString()}\nTime: ${selectedEvent.time}\nTickets: ${selectedTickets}\nTotal: $${(selectedEvent.ticketPrice || selectedEvent.price) * selectedTickets + 5}`;
      QRCode.toDataURL(bookingData, { width: 150, margin: 1 })
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error('QR Code generation failed:', err));
    }
  }, [selectedEvent, selectedTickets, bookingStep]);

  if (!showBookingModal || !selectedEvent) return null;

  const handleBooking = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create booking via API
      const bookingData = {
        eventId: selectedEvent._id || selectedEvent.id,
        tickets: selectedTickets
      };

      const newBooking = await bookingsAPI.create(bookingData);

      // Fetch fresh bookings after creating a new one
      const updatedBookings = await bookingsAPI.getUserBookings();
      setBookings(updatedBookings);

      setShowBookingModal(false);
      setBookingStep(1);
      setSelectedTickets(1);
      setCurrentView('dashboard');
    } catch (err) {
      console.error('Booking error:', err);
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Book Tickets</h2>
          <button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {bookingStep === 1 && (
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Select Tickets</h3>
              <div className="bg-gray-700 p-4 rounded-xl mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-white">{selectedEvent.title}</span>
                  <span className="text-blue-400 font-bold">${selectedEvent.ticketPrice || selectedEvent.price}</span>
                </div>
                <div className="text-sm text-gray-300">
                  {new Date(selectedEvent.date).toLocaleDateString()} • {selectedEvent.time}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-white">Number of Tickets</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedTickets(Math.max(1, selectedTickets - 1))}
                    className="w-10 h-10 border border-gray-600 rounded-lg hover:bg-gray-600 text-white"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold w-12 text-center text-white">{selectedTickets}</span>
                  <button
                    onClick={() => setSelectedTickets(Math.min(10, selectedTickets + 1))}
                    className="w-10 h-10 border border-gray-600 rounded-lg hover:bg-gray-600 text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-xl mb-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-blue-400">${(selectedEvent.ticketPrice || selectedEvent.price) * selectedTickets}</span>
                </div>
              </div>

              <button 
                onClick={() => setBookingStep(2)}
                className="w-full py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {bookingStep === 2 && (
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Payment Details</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-xl mb-6">
                <h4 className="font-semibold mb-3 text-white">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Tickets ({selectedTickets}x)</span>
                    <span className="text-white">${(selectedEvent.ticketPrice || selectedEvent.price) * selectedTickets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Service Fee</span>
                    <span className="text-white">$5</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2 flex justify-between font-bold text-lg">
                    <span className="text-white">Total</span>
                    <span className="text-blue-400">${(selectedEvent.ticketPrice || selectedEvent.price) * selectedTickets + 5}</span>
                  </div>
                </div>
                {qrCodeUrl && (
                  <div className="mt-4 text-center">
                    <p className="text-sm font-medium mb-2 text-white">Your Booking QR Code</p>
                    <img src={qrCodeUrl} alt="Booking QR Code" className="mx-auto border border-gray-600 rounded-lg" />
                  </div>
                )}
              </div>

              <button 
                onClick={handleBooking}
                disabled={loading}
                className={`w-full py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <CreditCard size={20} />
                {loading ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;