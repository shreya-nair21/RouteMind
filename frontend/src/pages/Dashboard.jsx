import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/trips', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          const data = await response.json();
          setTrips(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#0056B3] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Retrieving your ecosystem...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
      {/* Welcome Header */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-10">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Authenticated Session</p>
          <h1 className="text-5xl font-extrabold tracking-tighter text-slate-900">
            Welcome, {user?.name?.split(' ')[0] || 'Explorer'}.
          </h1>
        </div>
        <button 
          onClick={() => navigate('/create-trip')}
          className="btn-primary px-8 h-14"
        >
          <span className="material-symbols-outlined">add</span>
          New Expedition
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricCard title="Active Plans" value={trips.length} icon="travel_explore" color="blue" />
        <MetricCard title="Cities Visited" value={new Set(trips.map(t => t.destination)).size} icon="location_city" color="slate" />
        <MetricCard title="Travel Score" value="Elite" icon="auto_awesome" color="slate" />
      </div>

      {/* Recent Trips Section */}
      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Recent Itineraries</h2>
          <button onClick={() => navigate('/trips')} className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline">View All Journeys</button>
        </div>

        {trips.length === 0 ? (
          <div className="pro-card p-20 flex flex-col items-center justify-center text-center bg-slate-50 border-dashed border-slate-300">
             <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-slate-300 mb-6 shadow-sm">
                <span className="material-symbols-outlined text-4xl">flight</span>
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">No Expeditions Found</h3>
             <p className="text-slate-500 max-w-sm font-medium mb-10">The world is vast and waiting. Begin your first luxury travel plan today with our AI-guided engine.</p>
             <button onClick={() => navigate('/create-trip')} className="btn-primary px-10">Initialize First Journey</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.slice(0, 3).map(trip => (
              <TripPreviewCard key={trip._id} trip={trip} onClick={() => navigate(`/trips/${trip._id}/itinerary`)} />
            ))}
          </div>
        )}
      </section>

      {/* Discover / Promotion Area */}
      <div className="pro-card p-12 bg-slate-900 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
         <div className="relative z-10 flex-1 space-y-6">
            <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">New Intelligence</span>
            <h3 className="text-4xl font-black tracking-tight leading-tight">Elite Gastronomy <br /> Insights Now Live.</h3>
            <p className="text-slate-400 font-medium max-w-md">Our AI now prioritizes top-tier culinary landmarks and local gastronomic treasures in every generated itinerary.</p>
            <button onClick={() => navigate('/create-trip')} className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">Explore Culinary Cities</button>
         </div>
         <div className="relative z-10 w-full md:w-1/3 aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Gourmet Food" />
         </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, color }) => (
  <div className="pro-card p-10 bg-white hover:translate-y-[-4px] transition-all group">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-8 transition-colors ${
      color === 'blue' ? 'bg-blue-50 text-[#0056B3]' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-[#0056B3]'
    }`}>
      <span className="material-symbols-outlined text-2xl filled">{icon}</span>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
    <h3 className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">{value}</h3>
  </div>
);

const TripPreviewCard = ({ trip, onClick }) => (
  <div onClick={onClick} className="pro-card group cursor-pointer overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all">
    <div className="h-48 overflow-hidden relative">
      <img 
        src={trip.image || `https://source.unsplash.com/1600x900/?${trip.destination}`} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        alt={trip.destination} 
        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
      <div className="absolute bottom-4 left-4">
        <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Upcoming Journey</p>
        <h4 className="text-2xl font-black text-white tracking-tight italic uppercase">{trip.destination}</h4>
      </div>
    </div>
    <div className="p-8 bg-white flex justify-between items-center">
       <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Departure</p>
          <p className="font-bold text-slate-900">{new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
       </div>
       <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#0056B3] group-hover:text-white transition-all">
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
       </div>
    </div>
  </div>
);

export default Dashboard;
