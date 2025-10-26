const express = require('express');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get analytics data (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [bookings, events, users] = await Promise.all([
      Booking.find().populate('eventId', 'category'),
      Event.find({ isActive: true }),
      User.find()
    ]);

    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const totalTickets = bookings.reduce((sum, booking) => sum + booking.tickets, 0);

    // Category-wise sales
    const categorySales = {};
    bookings.forEach(booking => {
      const category = booking.eventId?.category;
      if (category) {
        categorySales[category] = (categorySales[category] || 0) + booking.totalAmount;
      }
    });

    res.json({
      totalEvents: events.length,
      totalUsers: users.length,
      totalBookings: bookings.length,
      totalRevenue,
      totalTickets,
      categorySales
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Custom reports with date range filtering
router.get('/report/custom', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate, reportType, category } = req.query;

    let query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    let bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .populate('eventId', 'title category venue date ticketPrice')
      .sort({ createdAt: -1 });

    // Filter by category if specified
    if (category && category !== 'all') {
      bookings = bookings.filter(booking => booking.eventId?.category === category);
    }

    // Generate different report types
    let reportData = {};

    if (reportType === 'summary') {
      const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
      const totalTickets = bookings.reduce((sum, booking) => sum + booking.tickets, 0);
      const uniqueUsers = new Set(bookings.map(b => b.userId?._id?.toString())).size;
      const uniqueEvents = new Set(bookings.map(b => b.eventId?._id?.toString())).size;

      reportData = {
        totalRevenue,
        totalTickets,
        totalBookings: bookings.length,
        uniqueUsers,
        uniqueEvents,
        averageOrderValue: bookings.length > 0 ? totalRevenue / bookings.length : 0,
        period: { startDate, endDate }
      };
    } else if (reportType === 'detailed') {
      reportData = bookings.map(booking => ({
        userName: booking.userId?.name || 'N/A',
        userEmail: booking.userId?.email || 'N/A',
        eventTitle: booking.eventId?.title || 'N/A',
        category: booking.eventId?.category || 'N/A',
        venue: booking.eventId?.venue || 'N/A',
        eventDate: booking.eventId?.date?.toISOString().split('T')[0] || 'N/A',
        tickets: booking.tickets,
        totalAmount: booking.totalAmount,
        bookingDate: booking.createdAt.toISOString().split('T')[0],
        ticketPrice: booking.eventId?.ticketPrice || 0
      }));
    } else if (reportType === 'category') {
      const categoryStats = {};
      bookings.forEach(booking => {
        const cat = booking.eventId?.category || 'Uncategorized';
        if (!categoryStats[cat]) {
          categoryStats[cat] = { revenue: 0, tickets: 0, bookings: 0 };
        }
        categoryStats[cat].revenue += booking.totalAmount;
        categoryStats[cat].tickets += booking.tickets;
        categoryStats[cat].bookings += 1;
      });
      reportData = categoryStats;
    }

    res.json(reportData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Download CSV report with date range
router.get('/report/csv', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    let query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    let bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .populate('eventId', 'title category venue date ticketPrice')
      .sort({ createdAt: -1 });

    // Filter by category if specified
    if (category && category !== 'all') {
      bookings = bookings.filter(booking => booking.eventId?.category === category);
    }

    let csv = 'User Name,User Email,Event Title,Category,Venue,Event Date,Tickets,Total Amount,Booking Date\n';

    bookings.forEach(booking => {
      csv += `"${booking.userId?.name || 'N/A'}","${booking.userId?.email || 'N/A'}","${booking.eventId?.title || 'N/A'}","${booking.eventId?.category || 'N/A'}","${booking.eventId?.venue || 'N/A'}","${booking.eventId?.date?.toISOString().split('T')[0] || 'N/A'}","${booking.tickets}","${booking.totalAmount}","${booking.createdAt.toISOString().split('T')[0]}"\n`;
    });

    const filename = startDate && endDate
      ? `bookings_report_${startDate}_to_${endDate}.csv`
      : 'bookings_report.csv';

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Download PDF report with date range
router.get('/report/pdf', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    let query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    let bookings = await Booking.find(query).populate('eventId', 'category');
    const events = await Event.find({ isActive: true });
    const users = await User.find();

    // Filter by category if specified
    if (category && category !== 'all') {
      bookings = bookings.filter(booking => booking.eventId?.category === category);
    }

    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const totalTickets = bookings.reduce((sum, booking) => sum + booking.tickets, 0);

    // Generate PDF report
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();

    const filename = startDate && endDate
      ? `analytics_report_${startDate}_to_${endDate}.pdf`
      : 'analytics_report.pdf';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);

    doc.fontSize(20).text('Event Management Analytics Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Generated on: ${new Date().toLocaleDateString()}`);
    if (startDate && endDate) {
      doc.text(`Report Period: ${startDate} to ${endDate}`);
    }
    doc.moveDown(2);

    doc.fontSize(16).text('Summary Statistics:');
    doc.moveDown();
    doc.fontSize(12).text(`Total Events: ${events.length}`);
    doc.text(`Total Users: ${users.length}`);
    doc.text(`Total Bookings: ${bookings.length}`);
    doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`);
    doc.text(`Total Tickets Sold: ${totalTickets}`);
    if (bookings.length > 0) {
      doc.text(`Average Order Value: $${(totalRevenue / bookings.length).toFixed(2)}`);
    }

    doc.moveDown(2);
    doc.fontSize(16).text('Category-wise Sales:');
    doc.moveDown();

    const categorySales = {};
    bookings.forEach(booking => {
      const cat = booking.eventId?.category || 'Uncategorized';
      categorySales[cat] = (categorySales[cat] || 0) + booking.totalAmount;
    });

    Object.entries(categorySales).forEach(([category, amount]) => {
      doc.fontSize(12).text(`${category}: $${amount.toFixed(2)}`);
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all bookings for admin analytics (with populated user and event data)
router.get('/bookings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('eventId', 'title')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get event-wise revenue and tickets sold
router.get('/event-revenue', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const agg = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: '$eventId', totalRevenue: { $sum: '$totalAmount' }, ticketsSold: { $sum: '$tickets' } } },
      { $lookup: { from: 'events', localField: '_id', foreignField: '_id', as: 'event' } },
      { $unwind: '$event' },
      { $project: { _id: 0, eventId: '$event._id', title: '$event.title', date: '$event.date', ticketPrice: '$event.ticketPrice', totalRevenue: 1, ticketsSold: 1 } },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json(agg);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Get all users with total bookings
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'name email isActive createdAt');
    const bookings = await Booking.aggregate([
      { $group: { _id: '$userId', totalBookings: { $sum: 1 } } }
    ]);
    const bookingMap = {};
    bookings.forEach(b => { bookingMap[b._id?.toString()] = b.totalBookings; });
    const usersWithBookings = users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      isActive: u.isActive,
      createdAt: u.createdAt,
      totalBookings: bookingMap[u._id.toString()] || 0
    }));
    res.json(usersWithBookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Deactivate or activate a user
router.put('/users/:id/activate', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = isActive;
    await user.save();
    res.json({ message: `User has been ${isActive ? 'activated' : 'deactivated'}.`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Delete a user
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
