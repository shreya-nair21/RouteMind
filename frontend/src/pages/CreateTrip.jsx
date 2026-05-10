import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateTrip = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState(50000);
  const [travelerCount, setTravelerCount] = useState(1);
  const [transportMode, setTransportMode] = useState('flight');
  const [isGenerating, setIsGenerating] = useState(false);
  const [destImage, setDestImage] = useState('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop');
  
  // Budget Breakdown State
  const [breakdown, setBreakdown] = useState({
    accommodation: 15000,
    food: 12500,
    transport: 17500,
    activities: 10000,
    other: 5000
  });

  const navigate = useNavigate();

  // Dynamic image fetching
  useEffect(() => {
    if (destination.length > 3) {
      const timer = setTimeout(() => {
        setDestImage(`https://source.unsplash.com/1600x900/?${encodeURIComponent(destination)},city,landmark`);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [destination]);

  // Sync breakdown when budget changes (initial suggestion)
  useEffect(() => {
    const transFactor = transportMode === 'flight' ? 0.35 : transportMode === 'train' ? 0.15 : 0.10;
    setBreakdown({
      accommodation: Math.floor(budget * 0.3),
      food: Math.floor(budget * 0.25),
      transport: Math.floor(budget * transFactor),
      activities: Math.floor(budget * 0.20),
      other: Math.floor(budget * (1 - 0.3 - 0.25 - transFactor - 0.20))
    });
  }, [budget, transportMode]);

  const handleBreakdownChange = (key, value) => {
    setBreakdown(prev => ({ ...prev, [key]: Number(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch('http://localhost:5001/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          destination,
          startDate,
          endDate,
          budget,
          travelerCount,
          transportMode,
          image: destImage,
          budgetBreakdown: breakdown
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Automatically trigger AI generation for the first time
        await fetch(`http://localhost:5001/api/trips/${data._id}/generate-ai`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        navigate(`/trips/${data._id}/itinerary`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-12 pb-20">
      <div className="flex justify-between items-end border-b border-slate-200 pb-10">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Expedition Architect</p>
          <h1 className="text-5xl font-extrabold tracking-tighter text-slate-900">Initialize Journey</h1>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-slate-900 px-6 py-3 rounded-full text-white">
           <span className="material-symbols-outlined text-sm animate-pulse text-blue-400">memory</span>
           <span className="text-[10px] font-black uppercase tracking-widest">AI Engine Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Configuration Form */}
        <div className="space-y-12">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-8">
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Core Destination</label>
                 <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">location_on</span>
                    <input
                      type="text"
                      required
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="pro-input pl-14 h-16 text-lg font-black tracking-tight"
                      placeholder="e.g. Kyoto, Japan"
                    />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Departure</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="pro-input h-16 font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Return</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="pro-input h-16 font-bold"
                    />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Budget (₹)</label>
                    <div className="relative group">
                       <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300 group-focus-within:text-blue-600">₹</span>
                       <input
                        type="number"
                        required
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="pro-input pl-12 h-16 font-black tracking-tight"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Group Size</label>
                    <div className="relative group">
                       <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600">group</span>
                       <input
                        type="number"
                        min="1"
                        required
                        value={travelerCount}
                        onChange={(e) => setTravelerCount(e.target.value)}
                        className="pro-input pl-14 h-16 font-black tracking-tight"
                      />
                    </div>
                  </div>
               </div>

               <div className="space-y-4 pt-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transportation Logistics</label>
                  <div className="grid grid-cols-4 gap-4">
                     {['flight', 'train', 'bus', 'car'].map(mode => (
                       <button
                        key={mode}
                        type="button"
                        onClick={() => setTransportMode(mode)}
                        className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                          transportMode === mode 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-105' 
                          : 'bg-white border-slate-100 text-slate-300 hover:border-slate-200'
                        }`}
                       >
                          <span className="material-symbols-outlined text-xl uppercase italic font-bold">
                            {mode === 'car' ? 'directions_car' : mode}
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-widest">{mode}</span>
                       </button>
                     ))}
                  </div>
               </div>
            </div>

            {/* Budget Breakdown Suggestion */}
            <div className="pro-card p-10 bg-slate-50 border-none shadow-sm space-y-8">
               <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 italic">Financial Strategy (Suggested)</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Optimized</span>
               </div>
               
               <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                  {Object.entries(breakdown).map(([key, val]) => (
                    <div key={key} className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                          <span>{key}</span>
                          <span className="text-slate-900">₹{val.toLocaleString()}</span>
                       </label>
                       <input 
                        type="range" 
                        min="0" 
                        max={budget} 
                        value={val} 
                        onChange={(e) => handleBreakdownChange(key, e.target.value)}
                        className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                       />
                    </div>
                  ))}
               </div>
               
               <div className="pt-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Total Allocation</span>
                  <span className={`${Object.values(breakdown).reduce((a, b) => a + b, 0) > budget ? 'text-red-600' : 'text-green-600'}`}>
                     ₹{Object.values(breakdown).reduce((a, b) => a + b, 0).toLocaleString()} / ₹{budget.toLocaleString()}
                  </span>
               </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full btn-primary h-20 text-sm font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/30 disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="flex items-center gap-4">
                   <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                   <span>Generating Itinerary...</span>
                </div>
              ) : (
                'Construct Journey'
              )}
            </button>
          </form>
        </div>

        {/* Visual Spotlight */}
        <div className="relative group">
          <div className="sticky top-40 space-y-8 animate-fade-in">
             <div className="pro-card h-[600px] overflow-hidden border-none shadow-2xl relative rounded-[40px]">
                <img 
                  src={destImage} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" 
                  alt="Destination"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                <div className="absolute bottom-12 left-12 right-12">
                   <p className="text-blue-400 font-black tracking-[0.3em] uppercase text-[10px] mb-4">Spotlight Destination</p>
                   <h2 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                      {destination || 'The Unknown'}
                   </h2>
                   <div className="mt-8 flex gap-6">
                      <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-2">
                         <span className="material-symbols-outlined text-xs text-white">calendar_month</span>
                         <span className="text-[9px] font-black text-white uppercase tracking-widest">{startDate || 'TBD'}</span>
                      </div>
                      <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-2">
                         <span className="material-symbols-outlined text-xs text-white">payments</span>
                         <span className="text-[9px] font-black text-white uppercase tracking-widest">₹{budget.toLocaleString()}</span>
                      </div>
                   </div>
                </div>
             </div>
             <div className="p-8 bg-slate-900 rounded-[32px] text-white shadow-2xl flex items-center gap-6 border border-white/5">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
                   <span className="material-symbols-outlined text-3xl filled">restaurant</span>
                </div>
                <div>
                   <h4 className="text-lg font-black tracking-tight italic uppercase">Gourmet Protocol Active</h4>
                   <p className="text-slate-500 text-xs font-medium leading-relaxed">Our engine is configured to identify and prioritize local culinary landmarks and luxury dining experiences in {destination || 'your destination'}.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
