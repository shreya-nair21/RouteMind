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
const ai = require('./utils/ai');

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
      transportMode: req.body.transportMode || req.body.transport || 'flight',
      travelerCount: req.body.travelerCount || 1,
      travelPace: req.body.travelPace || 'balanced',
      interests: req.body.interests || [],
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
    
    item.packed = req.body.packed !== undefined ? req.body.packed : item.packed;
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
    const note = await Note.create({ tripId: req.params.id, title: title || 'Quick Note', content });
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

// --- New Packing API Routes for Frontend Alignment ---
app.get('/api/packing/trip/:id', protect, async (req, res) => {
  try {
    const items = await PackingItem.find({ tripId: req.params.id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.post('/api/packing', protect, async (req, res) => {
  try {
    const { name, category, tripId } = req.body;
    const item = await PackingItem.create({ tripId, name, category: category || 'General' });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.put('/api/packing/:itemId', protect, async (req, res) => {
  try {
    const item = await PackingItem.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    item.packed = req.body.packed !== undefined ? req.body.packed : item.packed;
    item.name = req.body.name || item.name;
    item.category = req.body.category || item.category;
    
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.delete('/api/packing/:itemId', protect, async (req, res) => {
  try {
    await PackingItem.findByIdAndDelete(req.params.itemId);
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// --- New Notes API Routes for Frontend Alignment ---
app.get('/api/notes/trip/:id', protect, async (req, res) => {
  try {
    const notes = await Note.find({ tripId: req.params.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.post('/api/notes', protect, async (req, res) => {
  try {
    const { content, tripId, title } = req.body;
    const note = await Note.create({ tripId, content, title: title || 'Quick Note' });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.put('/api/notes/:noteId', protect, async (req, res) => {
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

app.delete('/api/notes/:noteId', protect, async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.noteId);
    res.json({ message: 'Note removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// --- New Activities API Facade Routes ---
app.get('/api/activities/trip/:id', protect, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ tripId: req.params.id }).sort({ dayNumber: 1 });
    let allActivities = [];
    for (let iti of itineraries) {
      for (let act of iti.activities) {
        allActivities.push({
          _id: act._id,
          name: act.name,
          startTime: act.startTime,
          type: act.type,
          cost: act.cost,
          description: act.description,
          duration: act.duration || '2h',
          day: iti.dayNumber,
          tripId: iti.tripId
        });
      }
    }
    res.json(allActivities);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.post('/api/activities', protect, async (req, res) => {
  try {
    const { name, description, startTime, duration, cost, type, tripId, day } = req.body;
    let itinerary = await Itinerary.findOne({ tripId, dayNumber: day });
    if (!itinerary) {
      // Find trip to calculate correct date
      const trip = await Trip.findById(tripId);
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      const date = new Date(trip.startDate);
      date.setDate(date.getDate() + (day - 1));
      itinerary = new Itinerary({ tripId, dayNumber: day, date, activities: [] });
    }
    
    const newActivity = {
      name,
      startTime,
      type: type || 'activity',
      cost: cost || 0,
      description: description || '',
      duration: duration || '2h'
    };
    
    itinerary.activities.push(newActivity);
    await itinerary.save();
    
    const saved = itinerary.activities[itinerary.activities.length - 1];
    res.status(201).json({
      _id: saved._id,
      name: saved.name,
      startTime: saved.startTime,
      type: saved.type,
      cost: saved.cost,
      description: saved.description,
      duration: saved.duration,
      day: itinerary.dayNumber,
      tripId: itinerary.tripId
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.put('/api/activities/:id', protect, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ 'activities._id': req.params.id });
    if (!itinerary) return res.status(404).json({ message: 'Activity not found' });
    
    const activity = itinerary.activities.id(req.params.id);
    activity.name = req.body.name || activity.name;
    activity.startTime = req.body.startTime || activity.startTime;
    activity.type = req.body.type || activity.type;
    activity.cost = req.body.cost !== undefined ? req.body.cost : activity.cost;
    activity.description = req.body.description || activity.description;
    activity.duration = req.body.duration || activity.duration;
    
    await itinerary.save();
    
    res.json({
      _id: activity._id,
      name: activity.name,
      startTime: activity.startTime,
      type: activity.type,
      cost: activity.cost,
      description: activity.description,
      duration: activity.duration,
      day: itinerary.dayNumber,
      tripId: itinerary.tripId
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.delete('/api/activities/:id', protect, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ 'activities._id': req.params.id });
    if (!itinerary) return res.status(404).json({ message: 'Activity not found' });
    
    itinerary.activities.pull({ _id: req.params.id });
    await itinerary.save();
    
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// --- New Attractions Search Route ---
app.get('/api/attractions', protect, async (req, res) => {
  try {
    const cityName = req.query.city || req.query.cityName;
    if (!cityName) return res.status(400).json({ message: 'City name is required' });

    const attractions = CITY_KNOWLEDGE[cityName] || [
      { name: `Local Discovery in ${cityName}`, type: 'activity', cost: 0, startTime: '10:00', duration: '2h', description: 'Explore the unique local character of the city.' },
      { name: 'Historical Walking Tour', type: 'activity', cost: 3000, startTime: '14:00', duration: '2h', description: 'Learn about the rich heritage and architecture.' },
      { name: 'Market Exploration', type: 'food', cost: 1000, startTime: '18:00', duration: '2h', description: 'Experience the local flavors and street food scene.' }
    ];

    res.json(attractions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// --- New Public Shared Trip Routes ---
app.get('/api/trips/:id/public', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('user', 'name');
    if (!trip || !trip.isPublic) {
      return res.status(404).json({ message: 'Public trip not found' });
    }
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.get('/api/activities/trip/:id/public', async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ tripId: req.params.id }).sort({ dayNumber: 1 });
    let allActivities = [];
    for (let iti of itineraries) {
      for (let act of iti.activities) {
        allActivities.push({
          _id: act._id,
          name: act.name,
          startTime: act.startTime,
          type: act.type,
          cost: act.cost,
          description: act.description,
          duration: act.duration || '2h',
          day: iti.dayNumber,
          tripId: iti.tripId
        });
      }
    }
    res.json(allActivities);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// --- AI Generation Logic ---
const CITY_KNOWLEDGE = {
  'Mumbai': [
    { name: 'Gateway of India', type: 'activity', cost: 0, startTime: '09:00', duration: '2h', description: 'Iconic arch monument overlooking the Arabian Sea.' },
    { name: 'Marine Drive', type: 'activity', cost: 0, startTime: '17:00', duration: '1.5h', description: 'Scenic 3.6km long promenade along the coast.' },
    { name: 'Chhatrapati Shivaji Terminus', type: 'activity', cost: 0, startTime: '11:00', duration: '1h', description: 'UNESCO World Heritage railway station.' },
    { name: 'Elephanta Caves', type: 'activity', cost: 500, startTime: '10:00', duration: '4h', description: 'Ancient rock-cut temples on Elephanta Island.' },
    { name: 'Taj Mahal Palace Dining', type: 'food', cost: 3500, startTime: '20:00', duration: '2h', description: 'Luxury dining experience at the iconic hotel.' }
  ],
  'Paris': [
    { name: 'Eiffel Tower', type: 'activity', cost: 2500, startTime: '10:00', duration: '3h', description: 'The symbol of Paris, offering panoramic city views.' },
    { name: 'Louvre Museum', type: 'activity', cost: 1700, startTime: '13:00', duration: '4h', description: 'The worlds largest art museum and a historic monument.' },
    { name: 'Notre-Dame Cathedral', type: 'activity', cost: 0, startTime: '09:00', duration: '1h', description: 'Masterpiece of French Gothic architecture.' },
    { name: 'Le Jules Verne', type: 'food', cost: 15000, startTime: '20:00', duration: '2h', description: 'Michelin-starred restaurant on the Eiffel Tower.' }
  ],
  'London': [
    { name: 'British Museum', type: 'activity', cost: 0, startTime: '10:00', duration: '4h', description: 'Dedicated to human history, art and culture.' },
    { name: 'Tower of London', type: 'activity', cost: 3000, startTime: '14:00', duration: '3h', description: 'Historic castle on the north bank of the River Thames.' },
    { name: 'London Eye', type: 'activity', cost: 4000, startTime: '18:00', duration: '1h', description: 'Giant Ferris wheel on the South Bank.' },
    { name: 'Gordon Ramsay Bar & Grill', type: 'food', cost: 8000, startTime: '20:00', duration: '2h', description: 'Signature dining experience.' }
  ],
  'New York': [
    { name: 'Central Park', type: 'activity', cost: 0, startTime: '10:00', duration: '3h', description: 'Iconic urban park in Manhattan.' },
    { name: 'Statue of Liberty', type: 'activity', cost: 2500, startTime: '09:00', duration: '4h', description: 'Colossal neoclassical sculpture on Liberty Island.' },
    { name: 'Times Square', type: 'activity', cost: 0, startTime: '20:00', duration: '2h', description: 'Major commercial intersection and tourist destination.' },
    { name: 'Le Bernardin', type: 'food', cost: 20000, startTime: '19:00', duration: '2.5h', description: 'Elite seafood dining experience.' }
  ],
  'Dubai': [
    { name: 'Burj Khalifa', type: 'activity', cost: 15000, startTime: '10:00', duration: '2h', description: 'The tallest building in the world.' },
    { name: 'Dubai Mall', type: 'activity', cost: 0, startTime: '14:00', duration: '4h', description: 'Second largest mall in the world by total land area.' },
    { name: 'Palm Jumeirah', type: 'activity', cost: 0, startTime: '17:00', duration: '2h', description: 'Tree-shaped island known for glitzy hotels.' },
    { name: 'Pierchic', type: 'food', cost: 12000, startTime: '20:00', duration: '2h', description: 'Over-the-water dining with Burj Al Arab views.' }
  ]
};

app.post('/api/trips/:id/generate-ai', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    // Calculate diffDays
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Call dynamic Gemini AI Planner helper
    const aiPlan = await ai.generateSmartItinerary(trip, diffDays);

    // Save generated activities into each Itinerary day
    for (let dayPlan of aiPlan.itineraryDays) {
      // Find or create itinerary day for this trip
      let itinerary = await Itinerary.findOne({ tripId: trip._id, dayNumber: dayPlan.dayNumber });
      if (!itinerary) {
        const date = new Date(trip.startDate);
        date.setDate(date.getDate() + (dayPlan.dayNumber - 1));
        itinerary = new Itinerary({
          tripId: trip._id,
          dayNumber: dayPlan.dayNumber,
          date,
          activities: []
        });
      }
      itinerary.activities = dayPlan.activities;
      await itinerary.save();
    }

    // Save optimized budget breakdown in database
    trip.budgetBreakdown = aiPlan.budgetBreakdown;
    await trip.save();

    const itineraries = await Itinerary.find({ tripId: trip._id }).sort({ dayNumber: 1 });
    res.json({
      message: 'Itinerary generated successfully',
      itineraries,
      budgetBreakdown: trip.budgetBreakdown
    });
  } catch (error) {
    console.error("AI Generation Endpoint Error:", error);
    res.status(500).json({ message: 'Server Error during AI generation', error: error.message });
  }
});

// --- New AI Packing List Endpoint ---
app.post('/api/trips/:id/generate-packing', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    // Call Gemini AI Packing helper
    const aiPacking = await ai.generateSmartPackingList(trip);

    // Clear existing Packing items (Decision Decision: clear and replace)
    await PackingItem.deleteMany({ tripId: trip._id });

    // Bulk create new items
    const packingPromises = aiPacking.items.map(item => {
      return PackingItem.create({
        tripId: trip._id,
        name: item.name,
        category: item.category || 'General',
        packed: false
      });
    });
    await Promise.all(packingPromises);

    const items = await PackingItem.find({ tripId: trip._id });
    res.json(items);
  } catch (error) {
    console.error("AI Packing List Endpoint Error:", error);
    res.status(500).json({ message: 'Server Error during packing list curation', error: error.message });
  }
});

// --- New AI Chat Assistant Endpoint ---
app.post('/api/trips/:id/chat', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const { history, message } = req.body;
    if (!message) return res.status(400).json({ message: 'User message is required' });

    const reply = await ai.chatSmartAssistant(trip, history || [], message);
    res.json({ reply });
  } catch (error) {
    console.error("AI Chat Endpoint Error:", error);
    res.status(500).json({ message: 'Server Error during conversation', error: error.message });
  }
});

app.get('/api/activities/search', protect, async (req, res) => {
  const { cityName } = req.query;
  if (!cityName) return res.status(400).json({ message: 'City name is required' });

  // Use the same knowledge base as the AI generator for consistency
  const attractions = CITY_KNOWLEDGE[cityName] || [
    { name: `Local Discovery in ${cityName}`, type: 'activity', cost: 0, startTime: '10:00', duration: '2h', description: 'Explore the unique local character of the city.' },
    { name: 'Historical Walking Tour', type: 'activity', cost: 3000, startTime: '14:00', duration: '2h', description: 'Learn about the rich heritage and architecture.' },
    { name: 'Market Exploration', type: 'food', cost: 1000, startTime: '18:00', duration: '2h', description: 'Experience the local flavors and street food scene.' }
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
