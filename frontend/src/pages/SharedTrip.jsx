import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const transportIcons = {
  flight: 'flight',
  train: 'train',
  bus: 'directions_bus',
  car: 'directions_car'
};

const getDestinationImage = (dest) => {
  if (!dest) return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200';
  const query = dest.toLowerCase();
  
  if (query.includes('china') || query.includes('beijing') || query.includes('shanghai') || query.includes('hong kong')) {
    return 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200';
  }
  if (query.includes('japan') || query.includes('tokyo') || query.includes('kyoto') || query.includes('osaka')) {
    return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200';
  }
  if (query.includes('france') || query.includes('paris')) {
    return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200';
  }
  if (query.includes('italy') || query.includes('rome') || query.includes('venice') || query.includes('florence') || query.includes('amalfi')) {
    return 'https://images.unsplash.com/photo-1529260839382-3f772127ef71?q=80&w=1200';
  }
  if (query.includes('united states') || query.includes('usa') || query.includes('new york') || query.includes('california')) {
    return 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1200';
  }
  if (query.includes('united kingdom') || query.includes('uk') || query.includes('london')) {
    return 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200';
  }
  if (query.includes('australia') || query.includes('sydney') || query.includes('melbourne')) {
    return 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1200';
  }
  if (query.includes('india') || query.includes('mumbai') || query.includes('delhi') || query.includes('taj mahal')) {
    return 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200';
  }
  if (query.includes('egypt') || query.includes('cairo')) {
    return 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1200';
  }
  if (query.includes('turkey') || query.includes('istanbul') || query.includes('cappadocia')) {
    return 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200';
  }
  if (query.includes('greece') || query.includes('santorini') || query.includes('athens')) {
    return 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200';
  }
  if (query.includes('spain') || query.includes('madrid') || query.includes('barcelona')) {
    return 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1200';
  }
  if (query.includes('switzerland') || query.includes('zurich') || query.includes('swiss')) {
    return 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200';
  }
  if (query.includes('singapore')) {
    return 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1200';
  }
  if (query.includes('thailand') || query.includes('bangkok') || query.includes('phuket')) {
    return 'https://images.unsplash.com/photo-1528181304800-2f12585c7240?q=80&w=1200';
  }
  if (query.includes('indonesia') || query.includes('bali')) {
    return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200';
  }
  if (query.includes('iceland') || query.includes('reykjavik')) {
    return 'https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?q=80&w=1200';
  }
  return `https://loremflickr.com/1600/900/${encodeURIComponent(dest.split(',')[0].trim())}`;
};

const isDefaultImage = (url) => {
  if (!url) return true;
  return url.includes('photo-1469854523086') || url.includes('photo-1488646953014');
};

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
          src={isDefaultImage(trip.coverImage) ? getDestinationImage(trip.destination) : (trip.coverImage || trip.image)} 
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
           <div 
             className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none animate-fade-in" 
             style={{ animationDelay: '0.1s', fontFamily: "'Roboto', sans-serif" }}
           >
              {trip.destination}
           </div>
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
                           {act.type === 'food' ? (
                              <span className="material-symbols-outlined text-supporting text-lg">restaurant</span>
                           ) : act.type === 'transport' ? (
                              <span className="material-symbols-outlined text-supporting text-lg">
                                 {transportIcons[trip.transportMode?.toLowerCase()] || 'flight'}
                              </span>
                           ) : (
                              <span className="material-symbols-outlined text-supporting text-lg">explore</span>
                           )}
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
