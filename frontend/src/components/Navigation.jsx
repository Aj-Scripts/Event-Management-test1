import React, { useState } from 'react';
import { MapPin, Clock, Search, User, Menu, X, ChevronRight, Star, TrendingUp, Download, CreditCard, Check, Filter } from 'lucide-react';
// import logo from '../assets/logo.png.png';


const Navigation = ({ currentView, setCurrentView, userRole, setUserRole, showMobileMenu, setShowMobileMenu }) => (
  <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-800 to-gray-900 shadow-professional border-b border-gray-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setCurrentView('home')}>
          {/* <img src={} alt="EventHub Logo" className="w-12 h-12 rounded-xl shadow-lg" /> */}
          <span className="text-2xl font-bold text-gradient">
            Eventure
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <button onClick={() => setCurrentView('home')} className={`px-4 py-2 rounded-xl font-semibold text-sm uppercase tracking-wide transition-all ${currentView === 'home' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md hover:from-blue-500 hover:to-blue-700 hover:shadow-xl' : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700'}`}>
            Home
          </button>
          <button onClick={() => setCurrentView('events')} className={`px-4 py-2 rounded-xl font-semibold text-sm uppercase tracking-wide transition-all ${currentView === 'events' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md hover:from-blue-500 hover:to-blue-700 hover:shadow-xl' : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700'}`}>
            Events
          </button>
          <button onClick={() => setCurrentView('about')} className={`px-4 py-2 rounded-xl font-semibold text-sm uppercase tracking-wide transition-all ${currentView === 'about' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md hover:from-blue-500 hover:to-blue-700 hover:shadow-xl' : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700'}`}>
            About
          </button>
          {userRole === 'user' && (
            <button onClick={() => setCurrentView('dashboard')} className={`px-4 py-2 rounded-xl font-semibold text-sm uppercase tracking-wide transition-all ${currentView === 'dashboard' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md hover:from-blue-500 hover:to-blue-700 hover:shadow-xl' : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700'}`}>
              My Bookings
            </button>
          )}
          {userRole === 'admin' && (
            <button onClick={() => setCurrentView('admin')} className={`px-4 py-2 rounded-xl font-semibold text-sm uppercase tracking-wide transition-all ${currentView === 'admin' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md hover:from-blue-500 hover:to-blue-700 hover:shadow-xl' : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700'}`}>
              Admin
            </button>
          )}
          {!userRole ? (
            <button
              onClick={() => setCurrentView('login')}
              className="btn-primary text-sm font-semibold shadow-lg hover:shadow-xl"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                setUserRole(null);
                setCurrentView('home');
              }}
              className="btn-secondary text-sm px-6 py-2 rounded-xl font-semibold"
            >
              Logout
            </button>
          )}
        </div>

        <button
          className="lg:hidden p-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700 transition-colors"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {showMobileMenu && (
        <div className="lg:hidden py-6 border-t border-gray-700 space-y-4 bg-gradient-to-r from-gray-800 to-gray-900">
          <button onClick={() => { setCurrentView('home'); setShowMobileMenu(false); }} className={`block w-full text-left px-6 py-3 rounded-xl font-semibold transition-all ${currentView === 'home' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md hover:from-blue-500 hover:to-blue-700 hover:shadow-xl' : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700'}`}>
            Home
          </button>
          <button onClick={() => { setCurrentView('events'); setShowMobileMenu(false); }} className={`block w-full text-left px-6 py-3 rounded-xl font-semibold transition-all ${currentView === 'events' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md hover:from-blue-500 hover:to-blue-700 hover:shadow-xl' : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700'}`}>
            Events
          </button>
          <button onClick={() => { setCurrentView('about'); setShowMobileMenu(false); }} className={`block w-full text-left px-6 py-3 rounded-xl font-semibold transition-all ${currentView === 'about' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md hover:from-blue-500 hover:to-blue-700 hover:shadow-xl' : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700'}`}>
            About
          </button>
          {userRole === 'user' && (
            <button onClick={() => { setCurrentView('dashboard'); setShowMobileMenu(false); }} className={`block w-full text-left px-6 py-3 rounded-xl font-semibold transition-all ${currentView === 'dashboard' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md hover:from-blue-500 hover:to-blue-700 hover:shadow-xl' : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700'}`}>
              My Bookings
            </button>
          )}
          {userRole === 'admin' && (
            <button onClick={() => { setCurrentView('admin'); setShowMobileMenu(false); }} className={`block w-full text-left px-6 py-3 rounded-xl font-semibold transition-all ${currentView === 'admin' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md hover:from-blue-500 hover:to-blue-700 hover:shadow-xl' : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700'}`}>
              Admin
            </button>
          )}
          {!userRole ? (
            <button onClick={() => { setCurrentView('login'); setShowMobileMenu(false); }} className="block w-full text-left btn-primary rounded-xl font-semibold transition-colors">
              Login
            </button>
          ) : (
            <button onClick={() => { setUserRole(null); setShowMobileMenu(false); }} className="block w-full text-left btn-secondary rounded-xl font-semibold transition-colors">
              Logout
            </button>
          )}
        </div>
      )}
    </div>
  </nav>
);
export default Navigation;
