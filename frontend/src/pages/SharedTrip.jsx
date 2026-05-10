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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white italic font-black uppercase tracking-widest">Decoding Transmission...</div>;
  if (!trip) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white italic font-black uppercase tracking-widest">Access Denied: Itinerary Private</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 selection:bg-blue-600 selection:text-white">
      {/* Visual Banner */}
      <div className="h-[60vh] relative overflow-hidden">
        <img 
          src={trip.image || `https://source.unsplash.com/1600x900/?${trip.destination}`} 
          className="w-full h-full object-cover" 
          alt={trip.destination} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
        
        <div className="absolute top-10 left-10 md:left-20 flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-2xl">
              <span className="material-symbols-outlined filled">flight_takeoff</span>
           </div>
           <span className="text-2xl font-black tracking-tighter text-white italic uppercase">Traveloop</span>
        </div>

        <div className="absolute bottom-20 left-10 md:left-20 right-10 md:right-20">
           <p className="text-blue-400 font-black tracking-[0.4em] uppercase text-xs mb-4 animate-fade-in">Shared Expedition Record</p>
           <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter italic uppercase leading-none animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {trip.destination}
           </h1>
           <div className="mt-12 flex gap-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div>
                 <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Departure</p>
                 <p className="text-xl font-bold text-white">{new Date(trip.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                 <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Duration</p>
                 <p className="text-xl font-bold text-white italic uppercase">Premium Log</p>
              </div>
           </div>
        </div>
      </div>

      {/* Shared Itinerary View */}
      <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-10 space-y-8">
         <div className="pro-card p-10 bg-white shadow-2xl border-none">
            <h2 className="text-3xl font-black tracking-tighter text-slate-900 italic uppercase mb-12">Sequenced Maneuvers</h2>
            
            <div className="space-y-12 relative before:absolute before:left-10 before:top-10 before:bottom-10 before:w-px before:bg-slate-100">
               {activities.map((act, index) => (
                 <div key={act._id} className="relative pl-24 group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="absolute left-0 top-6 w-20 text-right">
                       <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter leading-none">{act.startTime}</p>
                    </div>
                    <div className="absolute left-[39px] top-6 w-3 h-3 rounded-full bg-slate-900 border-4 border-white shadow-sm z-10"></div>
                    
                    <div className="pro-card p-8 bg-slate-50/50 hover:bg-white transition-all border-slate-100">
                       <div className="flex items-center gap-3 mb-4">
                          <span className="material-symbols-outlined text-blue-600 text-lg filled">
                             {act.type === 'food' ? 'restaurant' : act.type === 'transport' ? 'flight' : 'explore'}
                          </span>
                          <h4 className="text-lg font-black text-slate-900 tracking-tight italic uppercase">{act.name}</h4>
                       </div>
                       <p className="text-slate-500 font-medium text-sm leading-relaxed">{act.description}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
         
         <div className="text-center pt-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Want to craft your own journey?</p>
            <a href="/" className="inline-block px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-slate-900/20">
               Join Traveloop Elite
            </a>
         </div>
      </div>
    </div>
  );
};

export default SharedTrip;
