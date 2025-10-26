import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Search, User, Menu, X, ChevronRight, Star, TrendingUp, Download, CreditCard, Check, Filter } from 'lucide-react';


const Footer = ({ setCurrentView, setSelectedCategory }) => (
  <footer className="bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] text-white py-12">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold">Eventure</span>
          </div>
          <p className="text-gray-400">
            Your premier destination for discovering and booking amazing events.
          </p>
        </div>
        
        <div>
          <h3 className="font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><button onClick={() => setCurrentView('home')} className="hover:text-white">Home</button></li>
            <li><button onClick={() => setCurrentView('events')} className="hover:text-white">Browse Events</button></li>
            <li><button onClick={() => setCurrentView('about')} className="hover:text-white">About Us</button></li>
            <li><button className="hover:text-white">Contact</button></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold mb-4">Categories</h3>
          <ul className="space-y-2 text-gray-400">
            {categories.slice(1, 5).map(cat => (
              <li key={cat}>
                <button onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentView('events');
                }} className="hover:text-white">
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold mb-4">Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li><button className="hover:text-white">Help Center</button></li>
            <li><button className="hover:text-white">Terms of Service</button></li>
            <li><button className="hover:text-white">Privacy Policy</button></li>
            <li><button className="hover:text-white">Refund Policy</button></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
        <p>© 2025 Eventure. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
const categories = ['All', 'Music', 'Sports', 'Arts', 'Tech', 'Health', 'Business', 'Education', 'Food & Drink', 'Community'];
export default Footer;

