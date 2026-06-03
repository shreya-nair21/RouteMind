import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ActivitySearchModal, ActivityEditorModal } from '../components/SearchModals';
import AIChatDrawer from '../components/AIChatDrawer';

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

const transportIcons = {
  flight: 'flight',
  train: 'train',
  bus: 'directions_bus',
  car: 'directions_car'
};

const ItineraryBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const [tripRes, actRes] = await Promise.all([
          fetch(`http://localhost:5001/api/trips/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`http://localhost:5001/api/activities/trip/${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (tripRes.ok && actRes.ok) {
          const tripData = await tripRes.ok ? await tripRes.json() : null;
          const actData = await actRes.ok ? await actRes.json() : [];
          setTrip(tripData);
          setActivities(actData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTripDetails();
  }, [id]);

  const handleAddActivity = async (activityData) => {
    try {
      const token = localStorage.getItem('token');
      const url = editingActivity
        ? `http://localhost:5001/api/activities/${editingActivity._id}`
        : 'http://localhost:5001/api/activities';

      const response = await fetch(url, {
        method: editingActivity ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...activityData, tripId: id, day: activeDay })
      });

      if (response.ok) {
        const saved = await response.json();
        if (editingActivity) {
          setActivities(activities.map(a => a._id === saved._id ? saved : a));
        } else {
          setActivities([...activities, saved]);
        }
        setIsModalOpen(false);
        setEditingActivity(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteActivity = async (actId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/activities/${actId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        setActivities(activities.filter(a => a._id !== actId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateAI = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/trips/${id}/generate-ai`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        // Refetch the newly generated flat activities list to show on screen
        const actRes = await fetch(`http://localhost:5001/api/activities/trip/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
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

  if (loading || !trip) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#080C14] text-slate-100 font-sans select-none animate-fade-in">
      <div className="max-w-md text-center space-y-6 px-6">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          <span className="material-symbols-outlined text-3xl text-blue-400 absolute inset-0 flex items-center justify-center animate-pulse">auto_awesome</span>
        </div>
        
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Neural Itinerary Engine</p>
        
        <h2 className="text-3xl font-extrabold text-white leading-tight">
          {trip ? 'Re-Compiling Voyage to' : 'Decoding Transmission to'}
        </h2>
        
        <div 
          className="text-5xl font-black italic tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent py-2"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          {trip ? trip.destination.split(',')[0].trim() : 'Destination'}
        </div>
        
        <p className="text-xs text-slate-450 leading-relaxed font-medium animate-pulse">
          {trip ? 'Refining routes and calculating optimal budget allocations...' : 'Acquiring logistics data...'}
        </p>
      </div>
    </div>
  );

  const daysCount = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1;
  const currentDayActivities = activities.filter(a => a.day === activeDay).sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-12 pb-32">
      {/* Header Panel */}
      <div className="pro-card p-12 relative overflow-hidden flex flex-col md:flex-row justify-between items-end gap-8 min-h-[220px]">
        {/* Background Image Banner */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(8, 12, 20, 0.9) 35%, rgba(8, 12, 20, 0.3) 100%), url(${isDefaultImage(trip.coverImage) ? getDestinationImage(trip.destination) : trip.coverImage})`,
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-blue-600 filled">auto_awesome</span>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Neural Itinerary Engine</p>
          </div>
          <div 
            className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic leading-none mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-350 bg-clip-text text-transparent py-1"
            style={{ fontFamily: "'Roboto', sans-serif" }}
          >
            {trip.destination}
          </div>
          <div className="flex gap-10">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</span>
              <span className="text-sm font-bold text-white">{daysCount} Elite Days</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Capital Allocation</span>
              <span className="text-sm font-bold text-white">₹{trip.budget.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 relative z-10">
          <button onClick={() => setIsShareModalOpen(true)} className="btn-secondary px-8 h-14">
            <span className="material-symbols-outlined text-sm">share</span>
            Distribute
          </button>
          <button onClick={handleGenerateAI} className="btn-primary px-8 h-14">
            <span className="material-symbols-outlined text-sm">temp_preferences_custom</span>
            AI Re-Generate
          </button>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <div className="flex justify-between items-center bg-surface p-4 rounded-2xl border border-white/10 shadow-sm sticky top-24 z-30">
        <div className="flex gap-4">
          <button onClick={() => navigate(`/trips/${id}/budget`)} className="nav-link text-xs font-black uppercase tracking-widest px-6">Budget</button>
          <button onClick={() => navigate(`/trips/${id}/packing`)} className="nav-link text-xs font-black uppercase tracking-widest px-6">Packing</button>
          <button onClick={() => navigate(`/trips/${id}/notes`)} className="nav-link text-xs font-black uppercase tracking-widest px-6">Notes</button>
        </div>
        <div className="flex items-center gap-4 px-6 border-l border-white/10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Sync</p>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        {/* Day Navigation */}
        <div className="space-y-4 lg:sticky lg:top-48">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Timeline Matrix</p>
          <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0">
            {Array.from({ length: daysCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveDay(i + 1)}
                className={`flex-shrink-0 px-8 py-5 rounded-2xl text-sm font-black transition-all flex items-center justify-between border-2 ${activeDay === i + 1
                  ? 'bg-primary border-primary text-white shadow-2xl scale-105'
                  : 'bg-surface border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                  }`}
              >
                <span>Day {String(i + 1).padStart(2, '0')}</span>
                {activeDay === i + 1 && <span className="material-symbols-outlined text-xs">arrow_forward</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black tracking-tighter text-white italic uppercase">Sequence of Events</h2>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Day {activeDay} Strategy</span>
          </div>

          {currentDayActivities.length === 0 ? (
            <div className="pro-card p-24 text-center bg-surface border-dashed border-white/10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#0B0F19]/50 flex items-center justify-center text-slate-500 mb-8 border border-white/5 shadow-sm">
                <span className="material-symbols-outlined text-4xl">history_toggle_off</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 uppercase italic">Timeline Void</h3>
              <p className="text-slate-400 font-medium mb-10 max-w-xs mx-auto">No maneuvers scheduled for this sector. Use the intelligence module to populate your itinerary.</p>
              <button onClick={handleGenerateAI} className="btn-primary px-10">Deploy AI Engine</button>
            </div>
          ) : (
            <div className="space-y-8 relative before:absolute before:left-10 before:top-10 before:bottom-10 before:w-px before:bg-white/10">
              {currentDayActivities.map((activity, index) => (
                <div key={activity._id} className="relative pl-24 group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Time Indicator */}
                  <div className="absolute left-0 top-6 w-20 text-right">
                    <p className="text-[10px] font-black text-slate-200 uppercase tracking-tighter leading-none">{activity.startTime}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">EST</p>
                  </div>
                  {/* Node */}
                  <div className="absolute left-[39px] top-6 w-3 h-3 rounded-full bg-primary border-4 border-white shadow-[0_0_0_1px_rgba(255,126,95,0.2)] z-10 group-hover:scale-150 transition-all"></div>

                  <div className="pro-card p-8 hover:border-[#0056B3]/30 transition-all flex justify-between items-start">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        {activity.type === 'food' ? (
                          <span className="material-symbols-outlined text-blue-600 text-lg filled">restaurant</span>
                        ) : activity.type === 'transport' ? (
                          <span className="material-symbols-outlined text-blue-600 text-lg filled">
                            {transportIcons[trip.transportMode?.toLowerCase()] || 'flight'}
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-blue-600 text-lg filled">explore</span>
                        )}
                        <h4 className="text-xl font-black text-white tracking-tight italic uppercase">{activity.name}</h4>
                      </div>
                      <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-md">{activity.description}</p>
                      <div className="flex gap-6 items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-350 uppercase tracking-widest">Allocation</span>
                          <span className="text-xs font-bold text-slate-200">₹{activity.cost?.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-350 uppercase tracking-widest">Duration</span>
                          <span className="text-xs font-bold text-slate-200">{activity.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button onClick={() => { setEditingActivity(activity); setIsModalOpen(true); }} className="btn-ghost w-10 h-10 rounded-xl bg-white/5 text-slate-400 hover:text-blue-400 hover:bg-blue-600/20">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button onClick={() => deleteActivity(activity._id)} className="btn-ghost w-10 h-10 rounded-xl bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-600/20">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-8">
          <div className="pro-card p-10 bg-blue-950/20 border border-blue-500/10 text-slate-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary filled">auto_awesome</span>
                <h2 className="text-lg font-bold text-white">Smart Insights</h2>
              </div>
              <p className="text-slate-350 text-sm leading-relaxed mb-10 font-medium">
                We've analyzed your {trip.destination} journey. For Day {activeDay}, we suggest prioritizing {activities.length === 0 ? 'any local activity' : 'cultural discovery'} to maximize your travel score.
              </p>
              <button onClick={() => setIsModalOpen(true)} className="btn-primary w-full py-4 text-xs tracking-widest uppercase">
                Explore Top Picks
              </button>
            </div>
          </div>

          <div className="pro-card p-8 flex flex-col items-center text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6">Platform Efficiency</p>
            <div className="w-24 h-24 rounded-full border-8 border-white/5 flex items-center justify-center relative">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="40" fill="transparent" stroke="#0056B3" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.85)} />
              </svg>
              <span className="text-xl font-black text-white italic">85%</span>
            </div>
            <p className="mt-6 text-sm font-bold text-white">Optimization Level</p>
            <p className="text-xs text-slate-400 font-medium mt-1">High Efficiency Detected</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ActivitySearchModal
        isOpen={isModalOpen && !editingActivity}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleAddActivity}
        cityName={trip.destination}
      />

      <ActivityEditorModal
        isOpen={isModalOpen && editingActivity}
        onClose={() => { setIsModalOpen(false); setEditingActivity(null); }}
        onSave={handleAddActivity}
        activity={editingActivity}
      />

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-surface border border-white/10 rounded-[32px] w-full max-w-md p-10 space-y-8 animate-fade-in shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight italic uppercase">Distribute Voyage</h3>
                <p className="text-slate-400 font-medium text-sm">Allow associates to view your curated plans.</p>
              </div>
              <button onClick={() => setIsShareModalOpen(false)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 bg-[#0B0F19]/50 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined ${trip.isPublic ? 'text-green-500' : 'text-slate-350'}`}>
                  {trip.isPublic ? 'visibility' : 'visibility_off'}
                </span>
                <span className="text-sm font-bold text-white">{trip.isPublic ? 'Publicly Visible' : 'Private Access'}</span>
              </div>
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Toggle Access</button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Universal Link</label>
              <div className="flex gap-2">
                <input readOnly value={`http://localhost:5173/shared/${id}`} className="pro-input h-14 bg-slate-950/60 text-xs font-bold border border-white/5" />
                <button className="btn-primary w-14 h-14 p-0 shrink-0"><span className="material-symbols-outlined">content_copy</span></button>
              </div>
            </div>

            <button onClick={() => setIsShareModalOpen(false)} className="w-full btn-primary h-14 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20">Finalize Distribution</button>
          </div>
        </div>
      )}
      <AIChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        tripId={id}
        destination={trip.destination}
      />

      {/* Floating AI Bubble */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(37,99,235,0.6)] transition-all hover:scale-110 active:scale-95 group border-none"
      >
        <span className="material-symbols-outlined filled text-2xl group-hover:rotate-12 transition-all">auto_awesome</span>
      </button>
    </div>
  );
};

export default ItineraryBuilder;
