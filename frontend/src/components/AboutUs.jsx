import React from 'react';
import { Calendar, MapPin, Clock, Search, User, Menu, X, ChevronRight, Star, TrendingUp, Download, CreditCard, Check, Filter, Users, Target, Award, Heart } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About <span className="text-gradient">Eventure</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Connecting people with unforgettable experiences through innovative event management technology.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              At Eventure, we believe that every event tells a story and creates lasting memories.
              Our mission is to revolutionize the way people discover, book, and experience events
              by providing a seamless, user-friendly platform that connects event organizers with
              passionate attendees.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              We're committed to making event management effortless for organizers while ensuring
              attendees have access to the best experiences in their communities.
            </p>
          </div>
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                <Target className="text-white" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Our Vision</h3>
                <p className="text-gray-300">To be the world's leading event discovery platform</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Check className="text-green-400" size={20} />
                <span className="text-gray-300">Seamless event booking experience</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-green-400" size={20} />
                <span className="text-gray-300">Advanced analytics for organizers</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-green-400" size={20} />
                <span className="text-gray-300">Community-driven event discovery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Eventure?</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover the features that make Eventure the preferred choice for event management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Discovery</h3>
              <p className="text-gray-300">
                Advanced search and filtering to find events that match your interests and location.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Secure Payments</h3>
              <p className="text-gray-300">
                Safe and secure payment processing with multiple payment options available.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Analytics Dashboard</h3>
              <p className="text-gray-300">
                Comprehensive analytics and reporting tools for event organizers and administrators.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Community Focus</h3>
              <p className="text-gray-300">
                Building communities around shared interests and local event experiences.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Quality Assurance</h3>
              <p className="text-gray-300">
                Rigorous verification process ensuring high-quality events and reliable organizers.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">User Experience</h3>
              <p className="text-gray-300">
                Intuitive design and seamless user experience across all devices and platforms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
