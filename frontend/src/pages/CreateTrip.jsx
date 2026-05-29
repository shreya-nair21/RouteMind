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
  const [tripType, setTripType] = useState('City');
  const [travelPace, setTravelPace] = useState('balanced');
  const [interests, setInterests] = useState([]);
  
  // Budget Breakdown State
  const [breakdown, setBreakdown] = useState({
    accommodation: 15000,
    food: 12500,
    transport: 17500,
    activities: 10000,
    other: 5000
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (destination.length > 3) {
      const timer = setTimeout(() => {
        setDestImage(`https://source.unsplash.com/1600x900/?${encodeURIComponent(destination)},city,landmark`);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [destination]);

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
          budgetBreakdown: breakdown,
          travelPace,
          interests
        })
      });

      if (response.ok) {
        const data = await response.json();
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
    <div className="pt-32 pb-xxl px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto font-body-md text-on-surface">
      <div className="mb-xl text-center md:text-left">
        <h1 className="font-headline-xl text-[48px] font-bold text-primary mb-sm leading-tight">Start Your Next Adventure</h1>
        <p className="text-[18px] text-on-surface-variant max-w-2xl">Design a bespoke itinerary tailored to your travel style. Every detail crafted for perfection.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px] items-start">
        {/* Left Column: Form Steps */}
        <div className="lg:col-span-8 space-y-[24px]">
          <form onSubmit={handleSubmit} className="space-y-[24px]">
            {/* Step 1: Destination */}
            <section className="clay-surface rounded-3xl p-[48px]">
              <div className="flex items-center gap-[16px] mb-[24px]">
                <div className="bg-primary-container text-on-primary-container w-10 h-10 rounded-full flex items-center justify-center font-bold">1</div>
                <h2 className="text-[24px] font-bold">Where and how?</h2>
              </div>
              <div className="space-y-[24px]">
                <div className="relative group">
                  <label className="text-[14px] font-semibold text-on-surface-variant mb-[4px] block">Destination City</label>
                  <div className="clay-inset rounded-2xl flex items-center px-[16px] py-[8px] group-focus-within:ring-2 ring-primary transition-all">
                    <span className="material-symbols-outlined text-primary mr-[8px]">location_on</span>
                    <input 
                      required
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 w-full text-[16px] font-medium text-on-surface placeholder:text-outline" 
                      placeholder="e.g. Santorini, Greece" 
                      type="text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                    <div className="relative group">
                      <label className="text-[14px] font-semibold text-on-surface-variant mb-[4px] block">Total Budget (₹)</label>
                      <div className="clay-inset rounded-2xl flex items-center px-[16px] py-[8px] group-focus-within:ring-2 ring-primary transition-all">
                        <span className="text-primary mr-[8px] font-bold">₹</span>
                        <input 
                          required
                          type="number"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="bg-transparent border-none focus:ring-0 w-full text-[16px] font-medium text-on-surface" 
                        />
                      </div>
                    </div>
                    <div className="relative group">
                      <label className="text-[14px] font-semibold text-on-surface-variant mb-[4px] block">Group Size</label>
                      <div className="clay-inset rounded-2xl flex items-center px-[16px] py-[8px] group-focus-within:ring-2 ring-primary transition-all">
                        <span className="material-symbols-outlined text-primary mr-[8px]">group</span>
                        <input 
                          required
                          type="number"
                          min="1"
                          value={travelerCount}
                          onChange={(e) => setTravelerCount(e.target.value)}
                          className="bg-transparent border-none focus:ring-0 w-full text-[16px] font-medium text-on-surface" 
                        />
                      </div>
                    </div>
                </div>

                <div>
                  <label className="text-[14px] font-semibold text-on-surface-variant mb-[16px] block">Transportation Choice</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-[16px]">
                    {['flight', 'train', 'bus', 'car'].map(mode => (
                      <button 
                        key={mode}
                        type="button"
                        onClick={() => setTransportMode(mode)}
                        className={`clay-surface rounded-2xl p-[16px] flex flex-col items-center gap-[8px] transition-all ${
                          transportMode === mode ? 'border-2 border-primary bg-surface-container-low scale-95' : 'hover:-translate-y-1'
                        }`}
                      >
                        <span className={`material-symbols-outlined text-3xl ${transportMode === mode ? 'text-primary' : 'text-on-surface-variant'}`}>
                           {mode === 'car' ? 'directions_car' : mode}
                        </span>
                        <span className="text-[14px] font-semibold capitalize">{mode}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Step 2: Date Selection */}
            <section className="clay-surface rounded-3xl p-[48px]">
              <div className="flex items-center gap-[16px] mb-[24px]">
                <div className="bg-primary-container text-on-primary-container w-10 h-10 rounded-full flex items-center justify-center font-bold">2</div>
                <h2 className="text-[24px] font-bold">Set the dates</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                <div className="clay-inset rounded-2xl p-[16px] flex flex-col gap-2">
                   <label className="text-[12px] font-medium text-on-surface-variant">Check-in</label>
                   <div className="flex items-center gap-[16px]">
                     <span className="material-symbols-outlined text-primary">calendar_today</span>
                     <input 
                        required
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-transparent border-none p-0 focus:ring-0 text-[14px] font-semibold text-on-surface w-full"
                     />
                   </div>
                </div>
                <div className="clay-inset rounded-2xl p-[16px] flex flex-col gap-2">
                   <label className="text-[12px] font-medium text-on-surface-variant">Check-out</label>
                   <div className="flex items-center gap-[16px]">
                     <span className="material-symbols-outlined text-primary">calendar_month</span>
                     <input 
                        required
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-transparent border-none p-0 focus:ring-0 text-[14px] font-semibold text-on-surface w-full"
                     />
                   </div>
                </div>
              </div>
            </section>
            
            {/* Step 3: Food & Budget */}
            <section className="clay-surface rounded-3xl p-[48px]">
               <div className="flex items-center gap-[16px] mb-[24px]">
                  <div className="bg-primary-container text-on-primary-container w-10 h-10 rounded-full flex items-center justify-center font-bold">3</div>
                  <h2 className="text-[24px] font-bold">Financial Strategy & Dining</h2>
               </div>
               
               <div className="clay-surface rounded-2xl p-[16px] flex items-center gap-[16px] border border-primary/10 mb-[24px]">
                  <div className="bg-surface-container-high p-[8px] rounded-xl">
                    <span className="material-symbols-outlined text-primary">restaurant</span>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold">Gourmet Protocol Included</p>
                    <p className="text-[12px] font-medium text-on-surface-variant">AI will automatically suggest local dining experiences daily.</p>
                  </div>
               </div>

               <div className="clay-inset p-[24px] rounded-2xl space-y-[24px]">
                  <h3 className="text-[14px] font-semibold text-primary">Suggested Budget Breakdown</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[40px] gap-y-[16px]">
                    {Object.entries(breakdown).map(([key, val]) => (
                      <div key={key} className="space-y-[8px]">
                        <div className="flex justify-between items-center text-[12px] font-semibold text-on-surface-variant capitalize">
                           <span>{key}</span>
                           <span className="text-on-surface font-bold">₹{val.toLocaleString()}</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max={budget} 
                          value={val} 
                          onChange={(e) => handleBreakdownChange(key, e.target.value)}
                          className="w-full h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    ))}
                  </div>
               </div>
             </section>

             {/* Step 4: AI Personalization Engine */}
             <section className="clay-surface rounded-3xl p-[48px] space-y-[24px]">
                <div className="flex items-center gap-[16px] mb-[24px]">
                   <div className="bg-primary-container text-on-primary-container w-10 h-10 rounded-full flex items-center justify-center font-bold">4</div>
                   <h2 className="text-[24px] font-bold">AI Personalization Engine</h2>
                </div>
                
                <div className="space-y-[24px]">
                  <div>
                    <label className="text-[14px] font-semibold text-on-surface-variant mb-[12px] block">Travel Pace</label>
                    <div className="grid grid-cols-3 gap-[16px]">
                      {['slow', 'balanced', 'fast'].map(pace => (
                        <button 
                          key={pace}
                          type="button"
                          onClick={() => setTravelPace(pace)}
                          className={`clay-surface rounded-2xl p-[16px] flex flex-col items-center gap-[8px] transition-all capitalize font-bold ${
                            travelPace === pace ? 'border-2 border-primary bg-surface-container-low scale-95 text-primary' : 'hover:-translate-y-0.5'
                          }`}
                        >
                          {pace}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[14px] font-semibold text-on-surface-variant mb-[12px] block">Voyage Vibe & Interests</label>
                    <div className="flex flex-wrap gap-[12px]">
                      {['Culture', 'Nature', 'Adventure', 'Food', 'Shopping', 'Relaxation', 'Nightlife', 'History', 'Family Friendly'].map(interest => {
                        const isSelected = interests.includes(interest);
                        return (
                          <button 
                            key={interest}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setInterests(interests.filter(i => i !== interest));
                              } else {
                                setInterests([...interests, interest]);
                              }
                            }}
                            className={`px-[20px] py-[10px] rounded-full text-[14px] font-semibold transition-all border ${
                              isSelected 
                              ? 'bg-primary text-white border-primary shadow-md scale-95' 
                              : 'clay-surface text-on-surface hover:border-slate-300'
                            }`}
                          >
                            {interest}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
             </section>

          </form>
        </div>

        {/* Right Column: Visual Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-[24px]">
          <div className="clay-surface rounded-3xl overflow-hidden shadow-xl">
            <div className="h-48 relative">
              <img 
                className="w-full h-full object-cover" 
                src={destImage} 
                alt="Destination"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-[16px] left-[16px]">
                <span className="bg-primary/90 text-white text-[12px] font-medium px-[8px] py-[4px] rounded-full backdrop-blur-md">Dynamic Preview</span>
                <h3 className="text-white text-[24px] font-bold mt-[4px]">{destination || 'Select Destination'}</h3>
              </div>
            </div>
            <div className="p-[48px] space-y-[16px]">
              <h4 className="text-[14px] font-semibold text-on-surface-variant uppercase tracking-wider">Trip Summary</h4>
              <div className="space-y-[8px]">
                <div className="flex justify-between items-center">
                  <span className="text-[16px] text-on-surface-variant">Destination</span>
                  <span className="font-bold text-primary">{destination || '—'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[16px] text-on-surface-variant">Dates</span>
                  <span className="font-bold text-[14px]">
                     {startDate && endDate ? `${startDate.substring(5)} to ${endDate.substring(5)}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[16px] text-on-surface-variant">Travelers</span>
                  <span className="font-bold">{travelerCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[16px] text-on-surface-variant">Transport</span>
                  <span className="font-bold capitalize">{transportMode}</span>
                </div>
              </div>
              <div className="pt-[16px] border-t border-outline-variant/30">
                <div className="flex justify-between items-center mb-[24px]">
                  <span className="text-[24px] font-semibold">Total Budget</span>
                  <span className="text-[24px] font-semibold text-primary">₹{budget.toLocaleString()}</span>
                </div>
                <button 
                  onClick={handleSubmit}
                  disabled={isGenerating || !destination || !startDate || !endDate}
                  className="clay-button-primary w-full py-[16px] rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-[8px] disabled:opacity-50"
                >
                  {isGenerating ? 'Generating Itinerary...' : 'Create Itinerary'}
                  {!isGenerating && <span className="material-symbols-outlined">auto_awesome</span>}
                </button>
              </div>
            </div>
          </div>
          <div className="clay-surface rounded-3xl p-[16px] flex items-center gap-[16px] border border-primary/10">
            <div className="bg-surface-container-high p-[8px] rounded-xl">
              <span className="material-symbols-outlined text-primary">verified_user</span>
            </div>
            <div>
              <p className="text-[14px] font-semibold">Elite Protection</p>
              <p className="text-[12px] font-medium text-on-surface-variant">AI Engine respects exact duration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
