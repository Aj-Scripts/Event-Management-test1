import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Search, User, Menu, X, ChevronRight, Star, TrendingUp, Download, CreditCard, Check, Filter } from 'lucide-react';



const BACKEND_URL = 'http://localhost:5000';
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return BACKEND_URL + url;
};

const EventCard = ({ event, onClick }) => (
  <div
    onClick={() => onClick(event)}
    className="card card-hover cursor-pointer overflow-hidden group shadow-professional hover:shadow-professional-lg"
  >
    <div className="relative h-56 overflow-hidden rounded-t-2xl">
      {event.imageUrl ? (
        <img
          src={getImageUrl(event.imageUrl)}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-lg font-medium rounded-t-2xl">No Image</div>
      )}
      {event.trending && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
          <TrendingUp size={16} />
          Trending
        </div>
      )}
      <div className="absolute top-4 left-4 bg-gradient-to-r from-gray-600 to-gray-700 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-white shadow-md border border-gray-500">
        {event.category}
      </div>
    </div>
    <div className="p-6">
      <h3 className="font-bold text-xl mb-4 line-clamp-2 text-white leading-tight">{event.title}</h3>
      <div className="space-y-3 text-sm text-gray-300 mb-6">
        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-blue-600 flex-shrink-0" />
          <span className="font-medium">{event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin size={18} className="text-blue-600 flex-shrink-0" />
          <span className="line-clamp-1 font-medium">{event.venue || event.location || ''}</span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-600">
        <div>
          <span className="text-3xl font-bold text-blue-400">${typeof event.ticketPrice === 'number' ? event.ticketPrice.toFixed(2) : 'N/A'}</span>
          <span className="text-gray-300 text-sm ml-2 font-medium">per ticket</span>
        </div>
        <button className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl">
          Book <ChevronRight size={18} />
        </button>
      </div>
    </div>
  </div>
);

export default EventCard;