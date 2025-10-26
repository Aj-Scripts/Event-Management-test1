import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const Hero = ({ searchQuery, setSearchQuery, setCurrentView }) => {
  // ✅ Carousel slides
  const slides = [
    {
      id: 1,
      title: 'Live Music Concerts',
      desc: 'Experience the thrill of live performances around you.',
      image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1400&q=80',
    },
    {
      id: 2,
      title: 'Tech Conferences 2025',
      desc: `Meet innovators and discover what's next in technology.`,
      image: 'https://images.pexels.com/photos/5759215/pexels-photo-5759215.jpeg',
    },
    {
      id: 3,
      title: 'Sports & Adventures',
      desc: 'Catch the adrenaline rush in upcoming matches and events.',
      image: 'https://wallpapercave.com/wp/wp2349395.jpg',
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative h-[90vh] w-full overflow-hidden">
      {/* ✅ Background Carousel */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* ✅ Subtle Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-800/60"></div>
        </div>
      ))}

      {/* ✅ Overlayed Text & Search */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
        <h1 className="heading-1 mb-6 drop-shadow-2xl" style={{ color: 'white' }}>
          Discover Amazing Events
        </h1>
        <p className="text-xl md:text-2xl mb-10 text-gray-300 font-light leading-relaxed max-w-2xl drop-shadow-lg">
          Book tickets to concerts, festivals, sports & more with our professional event management platform
        </p>

        <div className="w-full max-w-2xl bg-gradient-to-r from-gray-800/95 to-gray-900/95 backdrop-blur-lg rounded-2xl shadow-professional-lg p-4 border border-gray-600">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center gap-3 bg-gray-700 rounded-xl px-4 py-3 border border-gray-600">
              <Search className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search events, artists, venues..."
                className="flex-1 bg-transparent outline-none text-white text-base placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setCurrentView('events')}
              className="btn-primary text-base px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl"
            >
              Search Events
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === current ? 'bg-white shadow-lg scale-110' : 'bg-white/60 hover:bg-white/80'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Hero;
