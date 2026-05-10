import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Trips from './pages/Trips';
import CreateTrip from './pages/CreateTrip';
import ItineraryBuilder from './pages/ItineraryBuilder';
import Budget from './pages/Budget';
import PackingChecklist from './pages/PackingChecklist';
import TripNotes from './pages/TripNotes';
import SharedTrip from './pages/SharedTrip';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Landing from './pages/Landing';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/shared/:id" element={<SharedTrip />} />
      
      {/* Protected Routes inside Layout */}
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute><Layout><Trips /></Layout></ProtectedRoute>} />
      <Route path="/create-trip" element={<ProtectedRoute><Layout><CreateTrip /></Layout></ProtectedRoute>} />
      <Route path="/trips/:id/itinerary" element={<ProtectedRoute><Layout><ItineraryBuilder /></Layout></ProtectedRoute>} />
      <Route path="/trips/:id/budget" element={<ProtectedRoute><Layout><Budget /></Layout></ProtectedRoute>} />
      <Route path="/trips/:id/packing" element={<ProtectedRoute><Layout><PackingChecklist /></Layout></ProtectedRoute>} />
      <Route path="/trips/:id/notes" element={<ProtectedRoute><Layout><TripNotes /></Layout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
