import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { TripContext } from '../context/TripContext';
import { TripSubNavbar } from '../components';
import { ActivitySearchModal, ActivityEditorModal } from '../components/SearchModals';

import { getDestinationImage, isDefaultImage } from '../utils/imageHelpers';

const transportIcons = {
  flight: 'flight',
  train: 'train',
  bus: 'directions_bus',
  car: 'directions_car'
};

const getAbstractBannerStyle = (seed) => {
  if (!seed) seed = 'default';
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 120) % 360;
  const hue3 = (hue1 + 240) % 360;
  
  return {
    backgroundColor: '#080C14',
    backgroundImage: `
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      radial-gradient(at 0% 0%, hsla(${hue1}, 80%, 55%, 0.2) 0px, transparent 60%),
      radial-gradient(at 90% 10%, hsla(${hue2}, 75%, 50%, 0.15) 0px, transparent 50%),
      radial-gradient(at 40% 80%, hsla(${hue3}, 70%, 45%, 0.15) 0px, transparent 60%),
      linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(8, 12, 20, 0.8) 100%)
    `,
    backgroundSize: '40px 40px, 40px 40px, auto, auto, auto, auto',
  };
};

const ItineraryBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    trip,
    activities,
    loading,
    error,
    addActivity,
    deleteActivity,
    regenerateItinerary
  } = useContext(TripContext);

  const [activeDay, setActiveDay] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleAddActivity = async (activityData) => {
    const success = await addActivity(activityData, activeDay);
    if (success) {
      setIsModalOpen(false);
      setEditingActivity(null);
    }
  };

  const handleGenerateAI = async () => {
    await regenerateItinerary();
  };

  if (error) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#080C14] text-slate-100 font-sans select-none animate-fade-in">
      <div className="max-w-md text-center space-y-6 px-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-3xl">error</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white leading-tight">Itinerary Compilation Interrupted</h2>
        <p className="text-sm text-slate-400 leading-relaxed font-medium">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary px-8 h-12 uppercase text-[10px] tracking-widest font-black inline-block mt-4 rounded-xl border-none">
          Return to Dashboard
        </button>
      </div>
    </div>
  );

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
          className="text-5xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent py-2"
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
    <div className="max-w-6xl mx-auto space-y-12 pb-32">
      {/* Header Panel */}
      <div className="pro-card p-6 md:p-12 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-end gap-8 min-h-[220px] animate-fade-in">
        {/* Abstract Glowing Banner Background */}
        <div 
          className="absolute inset-0 z-0"
          style={getAbstractBannerStyle(trip._id || trip.destination)}
        />

        <div className="relative z-10 w-full">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-blue-600 filled">auto_awesome</span>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Neural Itinerary Engine</p>
          </div>
          <div 
            className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-none mb-6 text-white py-1 break-words"
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
        <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto shrink-0">
          <button onClick={() => setIsShareModalOpen(true)} className="btn-secondary px-8 h-14 w-full sm:w-auto">
            <span className="material-symbols-outlined text-sm">share</span>
            Distribute
          </button>
          <button onClick={handleGenerateAI} className="btn-primary px-8 h-14 w-full sm:w-auto">
            <span className="material-symbols-outlined text-sm">temp_preferences_custom</span>
            AI Re-Generate
          </button>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <TripSubNavbar activeTab="itinerary" />

      {/* Interactive SVG Day Timeline */}
      <div className="pro-card p-6 md:p-8 animate-fade-in relative overflow-hidden">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">
          Interactive Voyage Timeline
        </p>
        
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="relative py-4 min-w-[500px] max-w-3xl mx-auto">
            {/* Horizontal connection lines */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] z-0 pointer-events-none px-6">
              <svg className="w-full h-[2px] overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Base grey line */}
                <line 
                  x1="0" y1="1" x2="100%" y2="1" 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeWidth="2" 
                />
                {/* Active animated line up to the selected day node */}
                <line 
                  x1="0" y1="1" 
                  x2={`${((activeDay - 1) / Math.max(1, daysCount - 1)) * 100}%`} 
                  y2="1" 
                  stroke="#ffffff" 
                  strokeWidth="2" 
                  strokeDasharray="6,4"
                  style={{
                    animation: 'dash 5s linear infinite',
                    transition: 'x2 0.5s ease-in-out'
                  }}
                />
              </svg>
            </div>

            {/* Day Nodes */}
            <div className="relative z-10 flex justify-between items-center gap-2">
              {Array.from({ length: daysCount }).map((_, i) => {
                const dayNum = i + 1;
                const isActive = dayNum <= activeDay;
                const isSelected = dayNum === activeDay;
                
                // Count activities for this day
                const dayActCount = activities.filter(a => a.day === dayNum).length;

                return (
                  <div 
                    key={dayNum} 
                    onClick={() => setActiveDay(dayNum)}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    {/* Node circle */}
                    <div 
                      className={`w-12 h-12 rounded-full bg-black border transition-all duration-500 flex flex-col items-center justify-center shadow-xl shadow-black select-none ${
                        isSelected 
                          ? 'border-white scale-110 ring-4 ring-white/10' 
                          : isActive 
                          ? 'border-white/60 hover:border-white' 
                          : 'border-white/10 group-hover:border-white/30'
                      }`}
                    >
                      <span 
                        className={`text-xs font-bold transition-colors duration-500 ${
                          isActive ? 'text-white' : 'text-white/40'
                        }`}
                      >
                        D{dayNum}
                      </span>
                    </div>

                    {/* Activity Badge Count */}
                    <span className={`text-[9px] font-mono mt-2 transition-colors duration-500 ${
                      isSelected ? 'text-white font-bold' : isActive ? 'text-slate-400' : 'text-white/20'
                    }`}>
                      {dayActCount} {dayActCount === 1 ? 'event' : 'events'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 animate-fade-in">
        {/* Day Navigation Column */}
        <div className="lg:col-span-1">
          <div className="space-y-4 lg:sticky lg:top-[160px]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Timeline Matrix</p>
            <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-none">
              {Array.from({ length: daysCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i + 1)}
                  className={`flex-shrink-0 px-5 py-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-between border group gap-6 ${
                    activeDay === i + 1
                      ? 'bg-[#0B0F19]/80 border-primary/40 text-white shadow-[0_4px_20px_rgba(59,130,246,0.15)] ring-1 ring-primary/20'
                      : 'bg-[#0B0F19]/40 border-white/5 text-slate-400 hover:border-white/10 hover:text-white hover:bg-[#0B0F19]/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all duration-300 ${
                      activeDay === i + 1
                        ? 'bg-primary text-black shadow-md shadow-primary/20'
                        : 'bg-zinc-800 text-slate-400 group-hover:bg-zinc-700 group-hover:text-white'
                    }`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-extrabold tracking-wider uppercase text-[11px]">Day {String(i + 1).padStart(2, '0')}</span>
                  </div>
                  {activeDay === i + 1 && (
                    <span className="material-symbols-outlined text-primary text-xs animate-pulse">
                      arrow_forward_ios
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="lg:col-span-3 space-y-10">
          <div className="flex justify-between items-center flex-wrap gap-4 border-b border-white/10 pb-6">
            <h2 className="text-3xl font-black tracking-tighter text-white uppercase">Sequence of Events</h2>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="btn-primary px-6 h-12 text-xs font-bold uppercase tracking-wider rounded-xl relative overflow-hidden group w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Event
            </button>
          </div>

          {currentDayActivities.length === 0 ? (
            <div className="pro-card p-12 sm:p-24 text-center bg-surface border-dashed border-white/10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#0B0F19]/50 flex items-center justify-center text-slate-500 mb-8 border border-white/5 shadow-sm">
                <span className="material-symbols-outlined text-4xl">history_toggle_off</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 uppercase">Timeline Void</h3>
              <p className="text-slate-400 font-medium mb-10 max-w-xs mx-auto">No maneuvers scheduled for this sector. Use the intelligence module to populate your itinerary.</p>
              <button onClick={handleGenerateAI} className="btn-primary px-10">Deploy AI Engine</button>
            </div>
          ) : (
            <div className="space-y-8 relative before:absolute before:left-6 sm:before:left-10 before:top-10 before:bottom-10 before:w-[2px] before:bg-gradient-to-b before:from-primary/30 before:via-primary/10 before:to-transparent">
              {currentDayActivities.map((activity, index) => (
                <div key={activity._id} className="relative pl-14 sm:pl-24 group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Time Indicator */}
                  <div className="absolute left-0 top-6 w-10 sm:w-20 text-left sm:text-right">
                    <p className="text-[10px] sm:text-xs font-mono font-black text-primary tracking-wide leading-none">{activity.startTime}</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase mt-1 tracking-wider">EST</p>
                  </div>
                  {/* Node */}
                  <div className="absolute left-[20px] sm:left-[38px] top-[22px] w-4 h-4 rounded-full bg-[#080C14] border-2 border-primary flex items-center justify-center z-10 group-hover:border-blue-400 group-hover:scale-125 transition-all duration-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:bg-blue-400 transition-colors"></span>
                  </div>

                  <div className="pro-card p-5 sm:p-6 hover:border-primary/20 hover:bg-[#0B0F19]/40 transition-all duration-300 flex justify-between items-start gap-4">
                    <div className="space-y-4 flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all duration-300 shrink-0">
                          {activity.type === 'food' ? (
                            <span className="material-symbols-outlined text-sm filled">restaurant</span>
                          ) : activity.type === 'transport' ? (
                            <span className="material-symbols-outlined text-sm filled">
                              {transportIcons[trip.transportMode?.toLowerCase()] || 'flight'}
                            </span>
                          ) : (
                            <span className="material-symbols-outlined text-sm filled">explore</span>
                          )}
                        </div>
                        <h4 className="text-base sm:text-lg font-black text-white tracking-tight uppercase truncate">{activity.name}</h4>
                      </div>
                      <p className="text-slate-400 font-medium text-xs sm:text-sm leading-relaxed">{activity.description}</p>
                      <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#05070B]/50 rounded-lg border border-white/5">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Allocation</span>
                          <span className="text-xs font-bold text-white">₹{activity.cost?.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#05070B]/50 rounded-lg border border-white/5">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Duration</span>
                          <span className="text-xs font-bold text-white">{activity.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all lg:translate-x-4 lg:group-hover:translate-x-0 shrink-0">
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
                <h3 className="text-2xl font-extrabold text-white tracking-tight uppercase">Distribute Voyage</h3>
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
    </div>
  );
};

export default ItineraryBuilder;
