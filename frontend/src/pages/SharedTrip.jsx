import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SharedTrip = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedData = async () => {
      try {
        const [tripRes, actRes] = await Promise.all([
          fetch(`http://localhost:5001/api/trips/${id}/public`),
          fetch(`http://localhost:5001/api/activities/trip/${id}/public`)
        ]);

        if (tripRes.ok && actRes.ok) {
          setTrip(await tripRes.json());
          setActivities(await actRes.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSharedData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-secondary italic font-bold uppercase tracking-wider">Decoding Transmission...</div>;
  if (!trip) return <div className="min-h-screen flex items-center justify-center bg-background text-secondary italic font-bold uppercase tracking-wider">Access Denied: Itinerary Private</div>;

  return (
    <div className="min-h-screen bg-background pb-20 selection:bg-primary/20 selection:text-primary">
      {/* Visual Banner */}
      <div className="h-[50vh] relative overflow-hidden">
        <img 
          src={trip.image || `https://source.unsplash.com/1600x900/?${trip.destination}`} 
          className="w-full h-full object-cover grayscale opacity-90" 
          alt={trip.destination} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
        
        <div className="absolute top-10 left-10 md:left-20 flex items-center gap-3">
           <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-md">flight_takeoff</span>
           </div>
           <span className="text-lg font-black tracking-tight text-white uppercase italic">RouteMind</span>
        </div>

        <div className="absolute bottom-16 left-10 md:left-20 right-10 md:right-20">
           <p className="text-primary font-bold tracking-[0.25em] uppercase text-xs mb-3 animate-fade-in">Shared Expedition Record</p>
           <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {trip.destination}
           </h1>
           <div className="mt-8 flex gap-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div>
                 <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mb-1">Departure</p>
                 <p className="text-sm font-bold text-white">{new Date(trip.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                 <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mb-1">Duration</p>
                 <p className="text-sm font-bold text-white italic uppercase">Premium Log</p>
              </div>
           </div>
        </div>
      </div>

      {/* Shared Itinerary View */}
      <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-10 space-y-8">
         <div className="bg-surface border border-white/10 p-8 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold tracking-tight text-secondary uppercase mb-8">Sequenced Maneuvers</h2>
            
            <div className="space-y-8 relative before:absolute before:left-10 before:top-6 before:bottom-6 before:w-px before:bg-white/10">
               {activities.map((act, index) => (
                  <div key={act._id} className="relative pl-20 group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                     <div className="absolute left-0 top-5 w-16 text-right">
                        <p className="text-[10px] font-bold text-secondary uppercase tracking-tighter leading-none">{act.startTime}</p>
                     </div>
                     <div className="absolute left-[39px] top-5 w-2.5 h-2.5 rounded-full bg-secondary border-2 border-zinc-950 shadow-sm z-10"></div>
                     
                     <div className="bg-[#0B0F19]/50 border border-white/5 p-5 rounded-lg hover:bg-zinc-900/50 hover:border-white/10 transition-all">
                        <div className="flex items-center gap-3 mb-2">
                           <span className="material-symbols-outlined text-supporting text-lg">
                              {act.type === 'food' ? 'restaurant' : act.type === 'transport' ? 'flight' : 'explore'}
                           </span>
                           <h4 className="text-sm font-bold text-secondary tracking-tight uppercase">{act.name}</h4>
                        </div>
                        <p className="text-slate-400 font-normal text-xs leading-relaxed">{act.description}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         
         <div className="text-center pt-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Want to craft your own journey?</p>
            <a href="/" className="inline-block px-12 py-5 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all shadow-2xl">
               Join RouteMind Elite
            </a>
         </div>
      </div>
    </div>
  );
};

export default SharedTrip;
