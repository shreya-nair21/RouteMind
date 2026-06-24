import React, { createContext, useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [packingItems, setPackingItems] = useState([]);
  const [notes, setNotes] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // We track the currently loaded trip ID to avoid refetching if switching tabs for the same trip
  const [loadedTripId, setLoadedTripId] = useState(null);

  useEffect(() => {
    if (!id) return;

    // If we've already loaded this trip's data, don't refetch everything
    if (loadedTripId === id) {
      setLoading(false);
      return;
    }

    const fetchAllTripData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [tripRes, actRes, packingRes, notesRes] = await Promise.all([
          fetch(`http://localhost:5001/api/trips/${id}`, { headers }),
          fetch(`http://localhost:5001/api/activities/trip/${id}`, { headers }),
          fetch(`http://localhost:5001/api/packing/trip/${id}`, { headers }),
          fetch(`http://localhost:5001/api/notes/trip/${id}`, { headers })
        ]);

        if (tripRes.status === 401 || actRes.status === 401 || packingRes.status === 401 || notesRes.status === 401) {
          logout();
          navigate('/login');
          return;
        }

        if (!tripRes.ok) {
          setError(`Trip loading failed: ${tripRes.statusText || tripRes.status}`);
          return;
        }

        const tripData = await tripRes.json();
        const actData = actRes.ok ? await actRes.json() : [];
        const packingData = packingRes.ok ? await packingRes.json() : [];
        const notesData = notesRes.ok ? await notesRes.json() : [];

        setTrip(tripData);
        setActivities(actData);
        setPackingItems(packingData);
        setNotes(notesData);
        setLoadedTripId(id);
      } catch (err) {
        console.error(err);
        setError('A network error occurred while loading your trip details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllTripData();
  }, [id, loadedTripId, logout, navigate]);

  // Activity functions
  const addActivity = async (activityData, activeDay) => {
    try {
      const token = localStorage.getItem('token');
      const isEdit = !!activityData._id;
      const url = isEdit
        ? `http://localhost:5001/api/activities/${activityData._id}`
        : 'http://localhost:5001/api/activities';

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...activityData, tripId: id, day: activeDay })
      });

      if (response.ok) {
        const saved = await response.json();
        if (isEdit) {
          setActivities(prev => prev.map(a => a._id === saved._id ? saved : a));
        } else {
          setActivities(prev => [...prev, saved]);
        }
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const deleteActivity = async (actId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/activities/${actId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        setActivities(prev => prev.filter(a => a._id !== actId));
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const regenerateItinerary = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/trips/${id}/generate-ai`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const actRes = await fetch(`http://localhost:5001/api/activities/trip/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (actRes.ok) {
          const actData = await actRes.json();
          setActivities(actData);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Packing functions
  const addPackingItem = async (name) => {
    try {
      const response = await fetch('http://localhost:5001/api/packing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, tripId: id })
      });
      if (response.ok) {
        const item = await response.json();
        setPackingItems(prev => [...prev, item]);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const togglePackingItem = async (item) => {
    try {
      const response = await fetch(`http://localhost:5001/api/packing/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...item, packed: !item.packed })
      });
      if (response.ok) {
        setPackingItems(prev => prev.map(i => i._id === item._id ? { ...i, packed: !i.packed } : i));
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const generateAIPacking = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/trips/${id}/generate-packing`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPackingItems(data);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Note functions
  const addNote = async (content) => {
    try {
      const response = await fetch('http://localhost:5001/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content, tripId: id })
      });
      if (response.ok) {
        const note = await response.json();
        setNotes(prev => [note, ...prev]);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  return (
    <TripContext.Provider value={{
      trip,
      activities,
      packingItems,
      notes,
      loading,
      error,
      addActivity,
      deleteActivity,
      regenerateItinerary,
      addPackingItem,
      togglePackingItem,
      generateAIPacking,
      addNote
    }}>
      {children}
    </TripContext.Provider>
  );
};
