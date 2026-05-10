require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');

// Models
const Trip = require('./models/Trip');
const Itinerary = require('./models/Itinerary');
const User = require('./models/User');
const City = require('./models/City');
const Activity = require('./models/Activity');
const PackingItem = require('./models/PackingItem');
const Note = require('./models/Note');

const { protect, admin } = require('./middleware/auth');

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'up', timestamp: new Date() });
});

// --- Admin Seeding ---
const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123', salt);
      await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true
      });
      console.log('Admin account seeded: admin@traveloop.com / 123');
    }
  } catch (err) {
    console.error('Admin seeding failed:', err);
  }
};
seedAdmin();

// --- Auth Routes ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '30d' });
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.put('/api/auth/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.delete('/api/auth/profile', protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// --- City & Activity Routes ---
app.get('/api/cities', protect, async (req, res) => {
  try {
    const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};
    const cities = await City.find({ ...keyword });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.get('/api/activities', protect, async (req, res) => {
  try {
    const { cityId, type } = req.query;
    const filter = {};
    if (cityId) filter.cityId = cityId;
    if (type) filter.type = type;
    const activities = await Activity.find(filter).populate('cityId', 'name');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// --- Trip Routes ---
app.get('/api/trips', protect, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.get('/api/trips/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip || trip.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.post('/api/trips', protect, async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, coverImage, stops, isPublic } = req.body;
    const newTrip = new Trip({
      user: req.user._id,
      destination,
      startDate,
      endDate,
      budget,
      transportMode: req.body.transport || 'flight',
      travelerCount: req.body.travelerCount || 1,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop',
      stops: stops || [],
      isPublic: isPublic || false
    });
    const savedTrip = await newTrip.save();
    
    // Auto-generate itinerary days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const itineraryPromises = [];
    for (let i = 0; i < diffDays; i++) {
      const dayDate = new Date(start);
      dayDate.setDate(start.getDate() + i);
      itineraryPromises.push(new Itinerary({
        tripId: savedTrip._id,
        dayNumber: i + 1,
        date: dayDate,
        activities: []
      }).save());
    }
    await Promise.all(itineraryPromises);

    res.status(201).json(savedTrip);
  } catch (error) {
    console.error("Trip Creation Error Detail:", {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(500).json({ message: 'Server Error during trip creation', error: error.message });
  }
});

app.put('/api/trips/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip || trip.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    const { destination, startDate, endDate, budget, coverImage, stops, isPublic, status, budgetBreakdown } = req.body;
    trip.destination = destination || trip.destination;
    trip.startDate = startDate || trip.startDate;
    trip.endDate = endDate || trip.endDate;
    trip.budget = budget || trip.budget;
    trip.coverImage = coverImage || trip.coverImage;
    trip.stops = stops || trip.stops;
    trip.isPublic = isPublic !== undefined ? isPublic : trip.isPublic;
    trip.status = status || trip.status;
    trip.budgetBreakdown = budgetBreakdown || trip.budgetBreakdown;

    const updatedTrip = await trip.save();
    res.json(updatedTrip);
  } catch (error) {
    console.error("Trip Update Error Detail:", error);
    res.status(500).json({ message: 'Server Error during trip update', error: error.message });
  }
});

app.delete('/api/trips/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip || trip.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    await Trip.findByIdAndDelete(req.params.id);
    // Also delete associated itinerary, packing items, and notes
    await Itinerary.deleteMany({ tripId: req.params.id });
    await PackingItem.deleteMany({ tripId: req.params.id });
    await Note.deleteMany({ tripId: req.params.id });

    res.json({ message: 'Trip and all associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.get('/api/trips/public/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('user', 'name');
    if (!trip || !trip.isPublic) {
      return res.status(404).json({ message: 'Public trip not found' });
    }
    const itinerary = await Itinerary.find({ tripId: req.params.id }).sort({ dayNumber: 1 });
    res.json({ trip, itinerary });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// --- Itinerary Routes ---
app.get('/api/trips/:id/itinerary', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip || trip.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    const itinerary = await Itinerary.find({ tripId: req.params.id }).sort({ dayNumber: 1 });
    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.post('/api/trips/:id/itinerary', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip || trip.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    const { dayNumber, date, activities } = req.body;
    let itineraryDay = await Itinerary.findOne({ tripId: req.params.id, dayNumber });
    
    if (itineraryDay) {
      // Append activities if day exists
      itineraryDay.activities.push(...(activities || []));
      await itineraryDay.save();
      res.json(itineraryDay);
    } else {
      const newItineraryDay = new Itinerary({
        tripId: req.params.id,
        dayNumber,
        date,
        activities: activities || []
      });
      const savedDay = await newItineraryDay.save();
      res.status(201).json(savedDay);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.put('/api/trips/:id/itinerary/:dayId/activities/:activityId', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip || trip.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    const itinerary = await Itinerary.findById(req.params.dayId);
    if (!itinerary) return res.status(404).json({ message: 'Itinerary day not found' });

    const activity = itinerary.activities.id(req.params.activityId);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    activity.set(req.body);
    await itinerary.save();
    res.json(itinerary);
  } catch (error) {
    console.error("Activity Update Error Detail:", error);
    res.status(500).json({ message: 'Server Error during activity update', error: error.message });
  }
});

app.delete('/api/trips/:id/itinerary/:dayId/activities/:activityId', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip || trip.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    const itinerary = await Itinerary.findById(req.params.dayId);
    if (!itinerary) return res.status(404).json({ message: 'Itinerary day not found' });

    itinerary.activities.pull({ _id: req.params.activityId });
    await itinerary.save();
    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// --- Packing Routes ---
app.get('/api/trips/:id/packing', protect, async (req, res) => {
  try {
    const items = await PackingItem.find({ tripId: req.params.id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.post('/api/trips/:id/packing', protect, async (req, res) => {
  try {
    const { name, category } = req.body;
    const item = await PackingItem.create({ tripId: req.params.id, name, category });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.put('/api/trips/:id/packing/:itemId', protect, async (req, res) => {
  try {
    const item = await PackingItem.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    item.isPacked = req.body.isPacked !== undefined ? req.body.isPacked : item.isPacked;
    item.name = req.body.name || item.name;
    item.category = req.body.category || item.category;
    
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.delete('/api/trips/:id/packing/:itemId', protect, async (req, res) => {
  try {
    await PackingItem.findByIdAndDelete(req.params.itemId);
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// --- Notes Routes ---
app.get('/api/trips/:id/notes', protect, async (req, res) => {
  try {
    const notes = await Note.find({ tripId: req.params.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.post('/api/trips/:id/notes', protect, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.create({ tripId: req.params.id, title, content });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.put('/api/trips/:id/notes/:noteId', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    
    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.delete('/api/trips/:id/notes/:noteId', protect, async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.noteId);
    res.json({ message: 'Note removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// --- Admin Routes ---
app.get('/api/admin/stats', protect, admin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const tripsCount = await Trip.countDocuments();
    const citiesCount = await City.countDocuments();
    const activitiesCount = await Activity.countDocuments();
    
    // Get recent activity
    const recentTrips = await Trip.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name');
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt');

    res.json({
      counts: {
        users: usersCount,
        trips: tripsCount,
        cities: citiesCount,
        activities: activitiesCount
      },
      recentTrips,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// --- AI Generation Logic ---
const CITY_KNOWLEDGE = {
  'Mumbai': [
    { title: 'Gateway of India', type: 'attractions', cost: 0, time: '09:00', description: 'Iconic arch monument overlooking the Arabian Sea.' },
    { title: 'Marine Drive', type: 'attractions', cost: 0, time: '17:00', description: 'Scenic 3.6km long promenade along the coast.' },
    { title: 'Chhatrapati Shivaji Terminus', type: 'attractions', cost: 0, time: '11:00', description: 'UNESCO World Heritage railway station.' },
    { title: 'Elephanta Caves', type: 'attractions', cost: 500, time: '10:00', description: 'Ancient rock-cut temples on Elephanta Island.' },
    { title: 'Bandra-Worli Sea Link', type: 'attractions', cost: 100, time: '19:00', description: 'Modern engineering marvel with stunning views.' }
  ],
  'Paris': [
    { title: 'Eiffel Tower', type: 'attractions', cost: 25, time: '10:00', description: 'The symbol of Paris, offering panoramic city views.' },
    { title: 'Louvre Museum', type: 'attractions', cost: 17, time: '13:00', description: 'The worlds largest art museum and a historic monument.' },
    { title: 'Notre-Dame Cathedral', type: 'attractions', cost: 0, time: '09:00', description: 'Masterpiece of French Gothic architecture.' },
    { title: 'Montmartre & Sacré-Cœur', type: 'attractions', cost: 0, time: '16:00', description: 'Artistic district with a stunning white basilica.' }
  ],
  'London': [
    { title: 'British Museum', type: 'attractions', cost: 0, time: '10:00', description: 'Dedicated to human history, art and culture.' },
    { title: 'Tower of London', type: 'attractions', cost: 30, time: '14:00', description: 'Historic castle on the north bank of the River Thames.' },
    { title: 'London Eye', type: 'attractions', cost: 40, time: '18:00', description: 'Giant Ferris wheel on the South Bank.' }
  ],
  'New York': [
    { title: 'Central Park', type: 'attractions', cost: 0, time: '10:00', description: 'Iconic urban park in Manhattan.' },
    { title: 'Statue of Liberty', type: 'attractions', cost: 25, time: '09:00', description: 'Colossal neoclassical sculpture on Liberty Island.' },
    { title: 'Times Square', type: 'attractions', cost: 0, time: '20:00', description: 'Major commercial intersection and tourist destination.' }
  ],
  'Dubai': [
    { title: 'Burj Khalifa', type: 'attractions', cost: 150, time: '10:00', description: 'The tallest building in the world.' },
    { title: 'Dubai Mall', type: 'attractions', cost: 0, time: '14:00', description: 'Second largest mall in the world by total land area.' },
    { title: 'Palm Jumeirah', type: 'attractions', cost: 0, time: '17:00', description: 'Tree-shaped island known for glitzy hotels.' }
  ]
};

app.post('/api/trips/:id/generate-ai', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const cityName = trip.destination;
    const activities = CITY_KNOWLEDGE[cityName] || [
      { title: `Explore ${cityName} City Center`, type: 'attractions', cost: 0, time: '10:00', description: 'Discover the heart of the city.' },
      { title: 'Local Cultural Tour', type: 'attractions', cost: 50, time: '14:00', description: 'Learn about local traditions and history.' },
      { title: 'Panoramic Viewpoint', type: 'attractions', cost: 20, time: '17:00', description: 'Best spot for city sunset photos.' },
      { title: 'Fine Dining Experience', type: 'dining', cost: 100, time: '20:00', description: 'Taste the best local cuisine.' }
    ];

    const itineraries = await Itinerary.find({ tripId: req.params.id });
    
    // Distribute activities across days
    for (let i = 0; i < itineraries.length; i++) {
      const dayItinerary = itineraries[i];
      // Clear existing AI-generated or previous activities if desired, or just append
      // For now, let's append if empty, or just replace
      const dayActivities = [];
      const countPerDay = Math.max(1, Math.floor(activities.length / itineraries.length));
      
      for (let j = 0; j < countPerDay; j++) {
        const activityIndex = (i * countPerDay + j) % activities.length;
        dayActivities.push(activities[activityIndex]);
      }
      
      dayItinerary.activities = dayActivities;
      await dayItinerary.save();
    }

    // Generate Budget Breakdown (Suggested) based on mode
    const transFactor = trip.transportMode === 'flight' ? 0.35 : trip.transportMode === 'train' ? 0.15 : 0.10;
    trip.budgetBreakdown = {
      accommodation: Math.floor(trip.budget * 0.3),
      food: Math.floor(trip.budget * 0.25),
      transport: Math.floor(trip.budget * transFactor),
      activities: Math.floor(trip.budget * 0.20),
      other: Math.floor(trip.budget * (1 - 0.3 - 0.25 - transFactor - 0.20))
    };
    await trip.save();

    res.json({ message: 'Itinerary generated successfully', itineraries, budgetBreakdown: trip.budgetBreakdown });
  } catch (error) {
    console.error("Generation Error:", error);
    res.status(500).json({ message: 'Server Error during generation', error: error.message });
  }
});

app.get('/api/activities/search', protect, async (req, res) => {
  const { cityName } = req.query;
  if (!cityName) return res.status(400).json({ message: 'City name is required' });

  // Use the same knowledge base as the AI generator for consistency
  const attractions = CITY_KNOWLEDGE[cityName] || [
    { title: `Local Discovery in ${cityName}`, type: 'attractions', cost: 0, location: cityName, description: 'Explore the unique local character of the city.' },
    { title: 'Historical Walking Tour', type: 'attractions', cost: 30, location: cityName, description: 'Learn about the rich heritage and architecture.' },
    { title: 'Market Exploration', type: 'dining', cost: 10, location: cityName, description: 'Experience the local flavors and street food scene.' }
  ];

  res.json(attractions);
});

// --- Admin Stats Endpoint ---
app.get('/api/admin/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTrips = await Trip.countDocuments();
    const trips = await Trip.find();
    const totalBudget = trips.reduce((sum, t) => sum + (t.budget || 0), 0);
    const avgBudget = totalTrips > 0 ? (totalBudget / totalTrips) : 0;

    // Monthly growth (mock for now)
    const growth = [
      { month: 'Jan', users: 10, trips: 5 },
      { month: 'Feb', users: 25, trips: 12 },
      { month: 'Mar', users: 45, trips: 28 },
      { month: 'Apr', users: totalUsers - 5, trips: totalTrips - 3 },
      { month: 'May', users: totalUsers, trips: totalTrips }
    ];

    // Transport breakdown
    const flights = await Trip.countDocuments({ transportMode: 'flight' });
    const trains = await Trip.countDocuments({ transportMode: 'train' });
    const bus = await Trip.countDocuments({ transportMode: 'bus' });
    const car = await Trip.countDocuments({ transportMode: 'car' });

    const transportData = [
      { name: 'Flight', value: flights },
      { name: 'Train', value: trains },
      { name: 'Bus', value: bus },
      { name: 'Car', value: car }
    ];

    res.json({
      totalUsers,
      totalTrips,
      totalBudget,
      avgBudget,
      growth,
      transportData
    });
  } catch (error) {
    res.status(500).json({ message: 'Admin Stats Error', error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
