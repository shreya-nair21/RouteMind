const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const City = require('./models/City');
const Activity = require('./models/Activity');
const Trip = require('./models/Trip');
const Itinerary = require('./models/Itinerary');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/traveloop');
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await City.deleteMany({});
    await Activity.deleteMany({});
    await Trip.deleteMany({});
    await Itinerary.deleteMany({});

    // 1. Create Admin & Demo Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminUser = await User.create({
      name: 'Alex Sterling',
      email: 'alex@traveloop.com',
      password: hashedPassword,
      isAdmin: true
    });

    const demoUser = await User.create({
      name: 'Demo Traveler',
      email: 'traveler@example.com',
      password: hashedPassword,
      isAdmin: false
    });

    // 2. Create Cities
    const citiesData = [
      { name: 'Tokyo', country: 'Japan', costIndex: 4, popularity: 5, coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800' },
      { name: 'Paris', country: 'France', costIndex: 4, popularity: 5, coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800' },
      { name: 'Rome', country: 'Italy', costIndex: 3, popularity: 5, coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800' },
      { name: 'New York', country: 'USA', costIndex: 5, popularity: 5, coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800' },
      { name: 'Bali', country: 'Indonesia', costIndex: 2, popularity: 4, coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800' },
      { name: 'London', country: 'UK', costIndex: 5, popularity: 5, coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800' },
      { name: 'Dubai', country: 'UAE', costIndex: 5, popularity: 4, coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800' },
      { name: 'Sydney', country: 'Australia', costIndex: 4, popularity: 4, coverImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=800' }
    ];

    const cities = await City.insertMany(citiesData);

    // 3. Create Activities for each city
    const activitiesData = [];

    // Tokyo
    const tokyo = cities.find(c => c.name === 'Tokyo');
    activitiesData.push(
      { cityId: tokyo._id, title: 'Shibuya Crossing Visit', type: 'activity', cost: 0, duration: '1 hour', description: 'Experience the world\'s busiest pedestrian crossing.', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=400' },
      { cityId: tokyo._id, title: 'Sushi Making Class', type: 'activity', cost: 80, duration: '3 hours', description: 'Learn to roll sushi with a master chef.', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=400' },
      { cityId: tokyo._id, title: 'TeamLab Borderless', type: 'activity', cost: 35, duration: '4 hours', description: 'Explore a world of digital art without boundaries.', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400' }
    );

    // Paris
    const paris = cities.find(c => c.name === 'Paris');
    activitiesData.push(
      { cityId: paris._id, title: 'Eiffel Tower Summit', type: 'activity', cost: 25, duration: '2 hours', description: 'Breathtaking views of the City of Light.', image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=400' },
      { cityId: paris._id, title: 'Louvre Museum Tour', type: 'activity', cost: 20, duration: '4 hours', description: 'See the Mona Lisa and thousands of other masterpieces.', image: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?q=80&w=400' },
      { cityId: paris._id, title: 'Seine River Cruise', type: 'activity', cost: 15, duration: '1 hour', description: 'A romantic boat tour along the heart of Paris.', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400' }
    );

    // Rome
    const rome = cities.find(c => c.name === 'Rome');
    activitiesData.push(
      { cityId: rome._id, title: 'Colosseum Underground', type: 'activity', cost: 40, duration: '2 hours', description: 'Explore the arena where gladiators fought.', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=400' },
      { cityId: rome._id, title: 'Vatican Museums & Sistine Chapel', type: 'activity', cost: 30, duration: '3 hours', description: 'Witness Michelangelo\'s masterpiece.', image: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?q=80&w=400' }
    );

    await Activity.insertMany(activitiesData);

    // 4. Create an Initial Trip for Admin
    const trip = await Trip.create({
      user: adminUser._id,
      destination: 'Tokyo & Kyoto Adventure',
      startDate: new Date('2026-05-15'),
      endDate: new Date('2026-05-25'),
      budget: 3500,
      spent: 0,
      status: 'Planning',
      coverImage: tokyo.coverImage,
      stops: [
        { city: 'Tokyo', duration: 5 },
        { city: 'Kyoto', duration: 5 }
      ],
      isPublic: true
    });

    // 5. Create Sample Itinerary for Day 1
    await Itinerary.create({
      tripId: trip._id,
      dayNumber: 1,
      date: new Date('2026-05-15'),
      activities: [
        { startTime: '10:00', name: 'Arrival at Narita', type: 'flight', cost: 0, description: 'NRT Airport', duration: 'Flexible' },
        { startTime: '14:00', name: 'Check-in Hotel Sunroute', type: 'lodging', cost: 150, description: 'Shinjuku', duration: 'Flexible' },
        { startTime: '19:00', name: 'Ramen Dinner in Omoide Yokocho', type: 'dining', cost: 20, description: 'Shinjuku', duration: '2h' }
      ]
    });

    console.log('Database Seeded Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedDatabase();
