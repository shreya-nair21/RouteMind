import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ActivitySearchModal, ActivityEditorModal } from '../components/SearchModals';

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
        const updatedActivities = await response.json();
        setActivities(updatedActivities);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !trip) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const daysCount = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1;
  const currentDayActivities = activities.filter(a => a.day === activeDay).sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-12 pb-32">
      {/* Header Panel */}
      <div className="pro-card p-12 bg-white relative overflow-hidden flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="relative z-10">
           <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-blue-600 filled">auto_awesome</span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Neural Itinerary Engine</p>
           </div>
           <h1 className="text-6xl font-black tracking-tighter text-slate-900 uppercase italic leading-none mb-6">
              {trip.destination}
           </h1>
           <div className="flex gap-10">
              <div className="flex flex-col">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</span>
                 <span className="text-sm font-bold">{daysCount} Elite Days</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Capital Allocation</span>
                 <span className="text-sm font-bold">₹{trip.budget.toLocaleString()}</span>
              </div>
           </div>
        </div>
        <div className="flex gap-4 relative z-10">
           <button onClick={() => setIsShareModalOpen(true)} className="btn-secondary px-8 h-14">
              <span className="material-symbols-outlined text-sm">share</span>
              Distribute
           </button>
           <button onClick={handleGenerateAI} className="btn-primary px-8 h-14 bg-slate-900 hover:bg-black">
              <span className="material-symbols-outlined text-sm">temp_preferences_custom</span>
              AI Re-Generate
           </button>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-slate-50 rounded-full -mr-40 -mt-40 -z-0"></div>
      </div>

      {/* Navigation Sub-Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm sticky top-24 z-30">
         <div className="flex gap-4">
            <button onClick={() => navigate(`/trips/${id}/budget`)} className="nav-link text-xs font-black uppercase tracking-widest px-6">Budget</button>
            <button onClick={() => navigate(`/trips/${id}/packing`)} className="nav-link text-xs font-black uppercase tracking-widest px-6">Packing</button>
            <button onClick={() => navigate(`/trips/${id}/notes`)} className="nav-link text-xs font-black uppercase tracking-widest px-6">Notes</button>
         </div>
         <div className="flex items-center gap-4 px-6 border-l border-slate-100">
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
                className={`flex-shrink-0 px-8 py-5 rounded-2xl text-sm font-black transition-all flex items-center justify-between border-2 ${
                  activeDay === i + 1 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-105' 
                  : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
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
             <h2 className="text-3xl font-black tracking-tighter text-slate-900 italic uppercase">Sequence of Events</h2>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Day {activeDay} Strategy</span>
          </div>

          {currentDayActivities.length === 0 ? (
            <div className="pro-card p-24 text-center bg-slate-50 border-dashed border-slate-300 flex flex-col items-center">
               <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-slate-200 mb-8 shadow-sm">
                  <span className="material-symbols-outlined text-4xl">history_toggle_off</span>
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-4 uppercase italic">Timeline Void</h3>
               <p className="text-slate-400 font-medium mb-10 max-w-xs mx-auto">No maneuvers scheduled for this sector. Use the intelligence module to populate your itinerary.</p>
               <button onClick={handleGenerateAI} className="btn-primary px-10">Deploy AI Engine</button>
            </div>
          ) : (
            <div className="space-y-8 relative before:absolute before:left-10 before:top-10 before:bottom-10 before:w-px before:bg-slate-100">
              {currentDayActivities.map((activity, index) => (
                <div key={activity._id} className="relative pl-24 group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                   {/* Time Indicator */}
                   <div className="absolute left-0 top-6 w-20 text-right">
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter leading-none">{activity.startTime}</p>
                      <p className="text-[8px] font-bold text-slate-300 uppercase mt-1">EST</p>
                   </div>
                   {/* Node */}
                   <div className="absolute left-[39px] top-6 w-3 h-3 rounded-full bg-slate-900 border-4 border-white shadow-[0_0_0_1px_rgba(15,23,42,0.1)] z-10 group-hover:scale-150 transition-all"></div>
                   
                   <div className="pro-card p-8 bg-white hover:border-[#0056B3]/30 transition-all flex justify-between items-start">
                      <div className="space-y-4">
                         <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-blue-600 text-lg filled">
                               {activity.type === 'food' ? 'restaurant' : activity.type === 'transport' ? 'flight' : 'explore'}
                            </span>
                            <h4 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">{activity.name}</h4>
                         </div>
                         <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-md">{activity.description}</p>
                         <div className="flex gap-6 items-center">
                            <div className="flex items-center gap-2">
                               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Allocation</span>
                               <span className="text-xs font-bold text-slate-900">₹{activity.cost?.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Duration</span>
                               <span className="text-xs font-bold text-slate-900">{activity.duration}</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                         <button onClick={() => { setEditingActivity(activity); setIsModalOpen(true); }} className="btn-ghost w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                            <span className="material-symbols-outlined text-lg">edit</span>
                         </button>
                         <button onClick={() => deleteActivity(activity._id)} className="btn-ghost w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50">
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
           <div className="pro-card p-10 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-bl-full -mr-10 -mt-10"></div>
             <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                 <span className="material-symbols-outlined text-blue-400 filled">auto_awesome</span>
                 <h2 className="text-lg font-bold">Smart Insights</h2>
               </div>
               <p className="text-slate-400 text-sm leading-relaxed mb-10 font-medium">
                 We've analyzed your {trip.destination} journey. For Day {activeDay}, we suggest prioritizing {activities.length === 0 ? 'any local activity' : 'cultural discovery'} to maximize your travel score.
               </p>
               <button onClick={() => setIsModalOpen(true)} className="btn-primary w-full py-4 text-xs tracking-widest uppercase shadow-xl shadow-blue-500/20">
                 Explore Top Picks
               </button>
             </div>
           </div>

           <div className="pro-card p-8 bg-white flex flex-col items-center text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6">Platform Efficiency</p>
              <div className="w-24 h-24 rounded-full border-8 border-slate-50 flex items-center justify-center relative">
                 <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="48" cy="48" r="40" fill="transparent" stroke="#0056B3" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.85)} />
                 </svg>
                 <span className="text-xl font-black text-slate-900 italic">85%</span>
              </div>
              <p className="mt-6 text-sm font-bold text-slate-900">Optimization Level</p>
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
          <div className="bg-white rounded-[32px] w-full max-w-md p-10 space-y-8 animate-fade-in shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight italic uppercase">Distribute Voyage</h3>
                <p className="text-slate-500 font-medium text-sm">Allow associates to view your curated plans.</p>
              </div>
              <button onClick={() => setIsShareModalOpen(false)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined ${trip.isPublic ? 'text-green-500' : 'text-slate-300'}`}>
                  {trip.isPublic ? 'visibility' : 'visibility_off'}
                </span>
                <span className="text-sm font-bold text-slate-900">{trip.isPublic ? 'Publicly Visible' : 'Private Access'}</span>
              </div>
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Toggle Access</button>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Universal Link</label>
               <div className="flex gap-2">
                  <input readOnly value={`http://localhost:5173/shared/${id}`} className="pro-input h-14 bg-slate-50 text-xs font-bold border-none" />
                  <button className="btn-primary w-14 h-14 p-0 shrink-0"><span className="material-symbols-outlined">content_copy</span></button>
               </div>
            </div>

            <button onClick={() => setIsShareModalOpen(false)} className="w-full btn-primary h-14 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20">Finalize Distribution</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryBuilder;
