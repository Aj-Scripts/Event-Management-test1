import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Search, User, Menu, X, ChevronRight, Star, TrendingUp, Download, CreditCard, Check, Filter } from 'lucide-react';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import EventsPage from './components/EventsPage';
import EventDetailsPage from './components/EventDetailsPage';
import LoginPage from './components/LoginPage';
import ForgotPassword from './components/ForgotPassword';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import AboutUs from './components/AboutUs';
import BookingModal from './components/BookingModal';
import Footer from './components/Footer';
// ...existing code...
import './index.css';


// ============ MAIN APP COMPONENT ============
const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState(null);
  // Initialize userRole from localStorage so refresh doesn't log the user out
  const [userRole, setUserRoleState] = useState(() => {
    try {
      return localStorage.getItem('userRole') || null;
    } catch {
      return null;
    }
  });
  const setUserRole = (role) => {
    // wrapper to sync localStorage
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
      localStorage.removeItem('token');
    }
    setUserRoleState(role);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedTickets, setSelectedTickets] = useState(1);

  return (
    <div className="min-h-screen">
      <Navigation 
        currentView={currentView}
        setCurrentView={setCurrentView}
        userRole={userRole}
        setUserRole={setUserRole}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />
      
      {currentView === 'home' && (
        <HomePage 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setCurrentView={setCurrentView}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSelectedEvent={setSelectedEvent}
        />
      )}
      
      {currentView === 'events' && (
        <EventsPage 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setCurrentView={setCurrentView}
          setSelectedEvent={setSelectedEvent}
        />
      )}
      
      {currentView === 'details' && (
        <EventDetailsPage 
          selectedEvent={selectedEvent}
          setCurrentView={setCurrentView}
          userRole={userRole}
          setShowBookingModal={setShowBookingModal}
          setBookingStep={setBookingStep}
          setSelectedEvent={setSelectedEvent}
        />
      )}
      
      {currentView === 'login' && (
        <LoginPage
          setUserRole={setUserRole}
          setCurrentView={setCurrentView}
        />
      )}

      {currentView === 'forgot-password' && (
        <ForgotPassword
          setCurrentView={setCurrentView}
        />
      )}
      
      {currentView === 'dashboard' && userRole === 'user' && (
        <UserDashboard
          bookings={bookings}
          setCurrentView={setCurrentView}
          setSelectedEvent={setSelectedEvent}
          setBookings={setBookings}
        />
      )}
      
      {currentView === 'admin' && userRole === 'admin' && (
        <AdminDashboard
          bookings={bookings}
        />
      )}

      {currentView === 'about' && (
        <AboutUs />
      )}

      <BookingModal
        showBookingModal={showBookingModal}
        setShowBookingModal={setShowBookingModal}
        selectedEvent={selectedEvent}
        bookingStep={bookingStep}
        setBookingStep={setBookingStep}
        selectedTickets={selectedTickets}
        setSelectedTickets={setSelectedTickets}
        bookings={bookings}
        setBookings={setBookings}
        setCurrentView={setCurrentView}
      />
      
      <Footer 
        setCurrentView={setCurrentView}
        setSelectedCategory={setSelectedCategory}
      />
    </div>
  );
};

export default App;