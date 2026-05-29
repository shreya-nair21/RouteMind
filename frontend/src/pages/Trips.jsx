import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-20 space-y-12">
      <div className="flex justify-between items-end border-b border-slate-100 pb-10">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Vault of Explorations</p>
          <h1 className="text-4xl font-black tracking-tight text-secondary">My Journeys</h1>
        </div>
        <button onClick={() => navigate('/create-trip')} className="btn-primary px-6 h-12 text-xs font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm">add</span>
          Plan New Voyage
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="bg-surface border border-dashed border-slate-200 p-24 text-center rounded-xl">
          <span className="material-symbols-outlined text-5xl text-slate-200 mb-4">map</span>
          <h2 className="text-xl font-bold text-secondary mb-2">The Atlas is Empty</h2>
          <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto">Your journey log is currently clear. Start your first expedition to begin documenting your global footprint.</p>
          <button onClick={() => navigate('/create-trip')} className="btn-primary px-8 py-3 text-xs font-bold uppercase tracking-wider mx-auto">Start Planning</button>
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
  <div onClick={onClick} className="bg-surface border border-slate-200/80 rounded-xl group cursor-pointer overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col">
    <div className="h-48 overflow-hidden relative">
      <img 
        src={trip.image || `https://source.unsplash.com/1600x900/?${trip.destination}`} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        alt={trip.destination} 
        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent"></div>
      
      <div className="absolute top-4 left-4">
         <span className="px-2.5 py-1 bg-white/25 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest rounded border border-white/20">
            {trip.transportMode || 'Flight'}
         </span>
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex justify-between items-end">
           <div>
              <p className="text-[8px] font-bold text-white/70 uppercase tracking-widest mb-0.5">Expedition</p>
              <h4 className="text-xl font-bold text-white tracking-tight uppercase italic">{trip.destination}</h4>
           </div>
           <div className="text-right">
              <p className="text-[8px] font-bold text-white/70 uppercase tracking-widest mb-0.5">Budget</p>
              <p className="text-sm font-bold text-white tracking-tight">₹{(trip.budget || 0).toLocaleString()}</p>
           </div>
        </div>
      </div>
    </div>
    
    <div className="p-6 flex-1 flex flex-col justify-between gap-6">
       <div className="grid grid-cols-2 gap-4">
          <div>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</p>
             <div className="flex items-center gap-1.5 text-slate-600">
                <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
                <span className="text-[11px] font-medium">
                   {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Travelers</p>
             <div className="flex items-center justify-end gap-1.5 text-slate-600">
                <span className="text-[11px] font-medium">{trip.travelerCount || 1} Member(s)</span>
                <span className="material-symbols-outlined text-sm text-primary">group</span>
             </div>
          </div>
       </div>

       <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <div className="flex -space-x-1.5">
             {[1,2].map(i => (
               <div key={i} className="w-6 h-6 rounded-full border border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400">
                  {i === 2 ? '+' : ''}
               </div>
             ))}
          </div>
          <button className="flex items-center gap-1 text-[9px] font-bold text-primary uppercase tracking-wider group-hover:gap-2 transition-all">
             View Plan
             <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
       </div>
    </div>
  </div>
);

export default Trips;
