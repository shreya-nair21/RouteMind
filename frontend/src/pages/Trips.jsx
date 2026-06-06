import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const transportIcons = {
  flight: 'flight',
  train: 'train',
  bus: 'directions_bus',
  car: 'directions_car'
};

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
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
    <div className="min-h-[60vh] flex items-center justify-center bg-[#080C14]">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-12 text-slate-100">
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-end border-b border-white/5 pb-10">
        <div>
          <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-[0.3em] mb-2">Vault of Explorations</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white font-display">My Journeys</h1>
        </div>
        <button onClick={() => navigate('/create-trip')} className="btn-primary px-6 h-12 text-xs font-bold uppercase tracking-wider rounded-xl relative overflow-hidden group w-full sm:w-auto">
          <span className="relative z-10 flex items-center gap-2 justify-center">
            <span className="material-symbols-outlined text-sm">add</span>
            Plan New Voyage
          </span>
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="bg-zinc-900 border border-dashed border-white/10 p-24 text-center rounded-2xl">
          <span className="material-symbols-outlined text-5xl text-slate-600 mb-4">map</span>
          <h2 className="text-xl font-bold text-white mb-2 font-display">The Atlas is Empty</h2>
          <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto font-medium">Your journey log is currently clear. Start your first expedition to begin documenting your global footprint.</p>
          <button onClick={() => navigate('/create-trip')} className="btn-primary px-8 py-3 text-xs font-bold uppercase tracking-wider mx-auto rounded-xl">Start Planning</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map(trip => (
            <TripCard key={trip._id} trip={trip} onClick={() => navigate(`/trips/${trip._id}/itinerary`)} />
          ))}
        </div>
      )}
    </div>
  );
};

const TripCard = ({ trip, onClick }) => (
  <div onClick={onClick} className="bg-zinc-900 border border-white/5 rounded-2xl group cursor-pointer overflow-hidden shadow-sm hover:border-blue-500/20 transition-all duration-300 flex flex-col">
    <div className="h-48 overflow-hidden relative bg-zinc-950">
      <img 
        src={trip.image || `https://source.unsplash.com/1600x900/?${trip.destination}`} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        alt={trip.destination} 
        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent"></div>
      
      <div className="absolute top-4 left-4">
         <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest rounded-lg border border-white/10 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[10px] text-blue-400">
               {transportIcons[trip.transportMode?.toLowerCase()] || 'flight'}
            </span>
            <span>{trip.transportMode || 'Flight'}</span>
         </span>
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex justify-between items-end">
           <div>
              <p className="text-[8px] font-semibold text-slate-300 uppercase tracking-widest mb-0.5">Expedition</p>
              <h4 className="text-xl font-bold text-white tracking-tight font-display">{trip.destination}</h4>
           </div>
           <div className="text-right">
              <p className="text-[8px] font-semibold text-slate-300 uppercase tracking-widest mb-0.5">Budget</p>
              <p className="text-sm font-bold text-white tracking-tight">₹{(trip.budget || 0).toLocaleString()}</p>
           </div>
        </div>
      </div>
    </div>
    
    <div className="p-6 flex-1 flex flex-col justify-between gap-6">
       <div className="grid grid-cols-2 gap-4">
          <div>
             <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Duration</p>
             <div className="flex items-center gap-1.5 text-slate-300">
                <span className="material-symbols-outlined text-sm text-blue-400">calendar_today</span>
                <span className="text-[11px] font-medium">
                   {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Travelers</p>
             <div className="flex items-center justify-end gap-1.5 text-slate-300">
                <span className="text-[11px] font-medium">{trip.travelerCount || 1} Member(s)</span>
                <span className="material-symbols-outlined text-sm text-blue-400">group</span>
             </div>
          </div>
       </div>

       <div className="pt-4 border-t border-white/5 flex justify-between items-center">
          <div className="flex -space-x-1.5">
             {[1,2].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center text-[8px] font-bold text-blue-400">
                   {i === 2 ? '+' : ''}
                </div>
             ))}
          </div>
          <button className="flex items-center gap-1 text-[9px] font-bold text-blue-400 uppercase tracking-wider group-hover:gap-2 transition-all bg-transparent border-none cursor-pointer">
             View Plan
             <span className="material-symbols-outlined text-xs group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
          </button>
       </div>
    </div>
  </div>
);

export default Trips;
