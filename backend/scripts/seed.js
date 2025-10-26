const mongoose = require('mongoose');
const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Booking.deleteMany({});

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();

    // Create regular users
    const users = [];
    const userData = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'password123',
        role: 'user'
      }
    ];

    for (const data of userData) {
      const user = new User(data);
      await user.save();
      users.push(user);
    }

    // Create sample events (using local seed images)
    // Create sample events (using Unsplash placeholder images)
const events = await Event.insertMany([
  {
    title: 'React Conference 2024',
    description: 'Annual React conference featuring the latest in React development',
    category: 'Technology',
    venue: 'Convention Center, New York',
    date: new Date('2024-12-15T10:00:00Z'),
    ticketPrice: 150,
    imageUrl: 'https://images.stockcake.com/public/2/9/2/292f8e62-8891-41bb-9d82-cf81027244bf_large/tech-conference-speech-stockcake.jpg',
    createdBy: adminUser._id
  },
  {
    title: 'Jazz Night Live',
    description: 'An evening of smooth jazz with renowned musicians',
    category: 'Music',
    venue: 'Blue Note Jazz Club, NYC',
    date: new Date('2024-11-20T19:00:00Z'),
    ticketPrice: 75,
    imageUrl: 'https://images.stockcake.com/public/a/f/0/af0e1026-86be-493f-b979-3e4334857390_large/jazz-club-evening-stockcake.jpg',
    createdBy: adminUser._id
  },
  {
    title: 'Startup Pitch Competition',
    description: 'Watch innovative startups pitch their ideas to investors',
    category: 'Business',
    venue: 'Tech Hub, Silicon Valley',
    date: new Date('2024-11-25T14:00:00Z'),
    ticketPrice: 50,
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    createdBy: adminUser._id
  },
  {
    title: 'Modern Art Exhibition',
    description: 'Contemporary art showcase featuring local artists',
    category: 'Arts',
    venue: 'Metropolitan Museum, NYC',
    date: new Date('2024-12-01T11:00:00Z'),
    ticketPrice: 25,
    imageUrl: 'https://w0.peakpx.com/wallpaper/204/951/HD-wallpaper-museum-of-art-visitors-museum-exhibition-art-paintings.jpg',
    createdBy: adminUser._id
  },
  {
    title: 'Basketball Championship',
    description: 'Final match of the regional basketball championship',
    category: 'Sports',
    venue: 'Madison Square Garden, NYC',
    date: new Date('2024-12-10T18:00:00Z'),
    ticketPrice: 120,
    imageUrl: 'https://cdn.britannica.com/14/223214-050-F1D4C906/Napheesa-Collier-Brianna-Turner-NCAA-Final-Four-Tampa-Florida-2019.jpg',
    createdBy: adminUser._id
  },
  {
    title: 'AI & Machine Learning Workshop',
    description: 'Hands-on workshop on AI and ML fundamentals',
    category: 'Education',
    venue: 'Stanford University, CA',
    date: new Date('2024-11-30T09:00:00Z'),
    ticketPrice: 200,
    imageUrl: 'https://www.aitsrajampet.ac.in/images/pdf/ai/Artificial-Intelligence-and-Machine-Learning.png',
    createdBy: adminUser._id
  }
]);

  

    // Create sample bookings
    await Booking.insertMany([
      {
        userId: users[0]._id,
        eventId: events[0]._id,
        tickets: 2,
        totalAmount: 300
      },
      {
        userId: users[1]._id,
        eventId: events[1]._id,
        tickets: 1,
        totalAmount: 75
      },
      {
        userId: users[2]._id,
        eventId: events[2]._id,
        tickets: 3,
        totalAmount: 150
      },
      {
        userId: users[0]._id,
        eventId: events[3]._id,
        tickets: 1,
        totalAmount: 25
      }
    ]);

    console.log('Database seeded successfully!');
    console.log(`Created ${users.length + 1} users, ${events.length} events, and 4 bookings`);
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

if (require.main === module) {
  runSeed();
}

module.exports = { runSeed };
