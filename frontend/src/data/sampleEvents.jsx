import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Search, User, Menu, X, ChevronRight, Star, TrendingUp, Download, CreditCard, Check, Filter } from 'lucide-react';

const sampleEvents = [
  {
    id: 1,
    title: "Summer Music Festival 2025",
    category: "Music",
    date: "2025-07-15",

    venue: "Central Park Arena",
    location: "New York, NY",
    price: 89,
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop",

    description: "Join us for an unforgettable evening of live music featuring top artists from around the world.",
    trending: true
  },
  {
    id: 2,
    title: "Tech Innovation Summit",
    category: "Technology",
    date: "2025-08-20",

    venue: "Convention Center",
    location: "San Francisco, CA",
    price: 299,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",

    description: "Discover the latest in AI, blockchain, and cloud computing from industry leaders.",
    trending: true
  },
  {
    id: 3,
    title: "Food & Wine Experience",
    category: "Food",
    date: "2025-06-10",

    venue: "Riverside Gardens",
    location: "Chicago, IL",
    price: 75,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",

    description: "Savor exquisite dishes and fine wines from renowned chefs and sommeliers.",
    trending: false
  },
  {
    id: 4,
    title: "Marathon Championship",
    category: "Sports",
    date: "2025-09-05",

    venue: "City Streets",
    location: "Boston, MA",
    price: 45,
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&h=600&fit=crop",

    description: "Participate in or watch the most prestigious marathon of the year.",
    trending: false
  },
  {
    id: 5,
    title: "Art Gallery Opening",
    category: "Art",
    date: "2025-07-01",

    venue: "Modern Art Museum",
    location: "Los Angeles, CA",
    price: 25,
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&h=600&fit=crop",

    description: "Exclusive preview of contemporary art from emerging artists worldwide.",
    trending: false
  },
  {
    id: 6,
    title: "Comedy Night Special",
    category: "Entertainment",
    date: "2025-06-25",

    venue: "Laugh Factory",
    location: "Miami, FL",
    price: 55,
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=600&fit=crop",

    description: "An evening of laughter with top comedians from across the country.",
    trending: true
  }
];

const categories = ["All", "Music", "Technology", "Food", "Sports", "Art", "Entertainment"];

export { sampleEvents, categories };




