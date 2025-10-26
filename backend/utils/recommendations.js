const Booking = require('../models/Booking');
const Event = require('../models/Event');

const getRecommendations = async (userId) => {
  try {
    // Get user's booking history
    const userBookings = await Booking.find({ userId }).populate('eventId', 'category');
    const bookedEventIds = userBookings.map(booking => booking.eventId._id.toString());

    // Get categories from booked events
    const categories = [...new Set(userBookings.map(booking => booking.eventId?.category).filter(Boolean))];

    // Find similar events in same categories, excluding already booked
    const recommendations = await Event.find({
      category: { $in: categories },
      _id: { $nin: bookedEventIds },
      isActive: true,
      date: { $gte: new Date() } // Only future events
    }).sort({ date: 1 }); // Sort by date (upcoming first)

    return recommendations.slice(0, 5); // Top 5 recommendations
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
};

module.exports = { getRecommendations };
