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
      <div className="w-12 h-12 border-4 border-[#0056B3] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-20 space-y-12">
      <div className="flex justify-between items-end border-b border-slate-200 pb-10">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Vault of Explorations</p>
          <h1 className="text-5xl font-extrabold tracking-tighter text-slate-900">My Journeys</h1>
        </div>
        <button onClick={() => navigate('/create-trip')} className="btn-primary px-8 h-14">
          <span className="material-symbols-outlined">add</span>
          Plan New Voyage
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="pro-card p-32 text-center bg-white border-dashed">
          <span className="material-symbols-outlined text-6xl text-slate-200 mb-6">map</span>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">The Atlas is Empty</h2>
          <p className="text-slate-400 font-medium mb-10 max-w-sm mx-auto">Your journey log is currently clear. Start your first expedition to begin documenting your global footprint.</p>
          <button onClick={() => navigate('/create-trip')} className="btn-primary px-12">Start Planning</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {trips.map(trip => (
            <TripCard key={trip._id} trip={trip} onClick={() => navigate(`/trips/${trip._id}/itinerary`)} />
          ))}
        </div>
      )}
    </div>
  );
};

const TripCard = ({ trip, onClick }) => (
  <div onClick={onClick} className="pro-card group cursor-pointer overflow-hidden border-none shadow-2xl hover:shadow-[#0056B3]/10 transition-all flex flex-col">
    <div className="h-64 overflow-hidden relative">
      <img 
        src={trip.image || `https://source.unsplash.com/1600x900/?${trip.destination}`} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        alt={trip.destination} 
        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
      
      <div className="absolute top-6 left-6 flex gap-2">
         <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/20">
            {trip.transportMode || 'Flight'}
         </span>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex justify-between items-end">
           <div>
              <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1 italic">Expedition</p>
              <h4 className="text-3xl font-black text-white tracking-tighter uppercase italic">{trip.destination}</h4>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Budget</p>
              <p className="text-lg font-black text-white tracking-tighter italic">₹{(trip.budget || 0).toLocaleString()}</p>
           </div>
        </div>
      </div>
    </div>
    
    <div className="p-8 bg-white flex-1 space-y-8">
       <div className="grid grid-cols-2 gap-8">
          <div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Duration</p>
             <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#0056B3]">calendar_today</span>
                <span className="text-xs font-bold text-slate-900">
                   {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Travelers</p>
             <div className="flex items-center justify-end gap-2">
                <span className="text-xs font-bold text-slate-900">{trip.travelerCount || 1} Member(s)</span>
                <span className="material-symbols-outlined text-sm text-[#0056B3]">group</span>
             </div>
          </div>
       </div>

       <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
          <div className="flex -space-x-2">
             {[1,2,3].map(i => (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                  {i === 3 ? '+' : ''}
               </div>
             ))}
          </div>
          <button className="flex items-center gap-2 text-[10px] font-black text-[#0056B3] uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
             View Plan
             <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
       </div>
    </div>
  </div>
);

export default Trips;
