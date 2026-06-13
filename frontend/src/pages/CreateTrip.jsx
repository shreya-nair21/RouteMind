import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { countryData, popularCities } from '../utils/countryData';
import { AuthContext } from '../context/AuthContext';

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

const transportIcons = {
  flight: 'flight',
  train: 'train',
  bus: 'directions_bus',
  car: 'directions_car'
};

const CreateTrip = () => {
  const { logout } = useContext(AuthContext);
  // Core Trip states
  const [destination, setDestination] = useState('');
  const [cities, setCities] = useState('');
  const [durationDays, setDurationDays] = useState(3);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState(50000);
  const [travelerCount, setTravelerCount] = useState(1);
  const [transportMode, setTransportMode] = useState('flight');
  const [isGenerating, setIsGenerating] = useState(false);
  const [destImage, setDestImage] = useState('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop');
  const [interests, setInterests] = useState([]);
  const [travelPace, setTravelPace] = useState('balanced');

  // Form Wizard progress state
  const [step, setStep] = useState(1);

  // Autocomplete UI states
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteRef = useRef(null);

  // Budget Breakdown State
  const [breakdown, setBreakdown] = useState({
    accommodation: 15000,
    food: 12500,
    transport: 17500,
    activities: 10000,
    other: 5000
  });

  const navigate = useNavigate();

  // Click outside listener for autocomplete
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Suggestions search logic (local popular cities fallback + OSM Nominatim public query)
  useEffect(() => {
    if (!destination.trim() || destination.length < 2) {
      setSuggestions([]);
      return;
    }

    const term = destination.toLowerCase().trim();

    // Local filter matching
    const localFiltered = popularCities.filter(item =>
      item.city.toLowerCase().includes(term) ||
      item.country.toLowerCase().includes(term)
    ).map(item => {
      const cDetails = countryData[item.country.toLowerCase()] || {};
      return {
        display: `${item.city}, ${item.country}`,
        city: item.city,
        country: item.country,
        emoji: cDetails.emoji || '📍',
        iso: cDetails.iso || null
      };
    });

    const countryFiltered = [];
    for (const key in countryData) {
      const country = countryData[key];
      if (country.name.toLowerCase().includes(term)) {
        const alreadyExists = localFiltered.some(item => item.country.toLowerCase() === key);
        if (!alreadyExists) {
          countryFiltered.push({
            display: country.name,
            city: '',
            country: country.name,
            emoji: country.emoji,
            iso: country.iso
          });
        }
      }
    }

    const initialSuggestions = [...localFiltered, ...countryFiltered].slice(0, 6);
    setSuggestions(initialSuggestions);

    // Dynamic fetch from Nominatim (OpenStreetMap) debounced
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&addressdetails=1&limit=5`, {
          headers: {
            'User-Agent': 'RouteMind-Travel-Planner'
          }
        });
        if (response.ok) {
          const data = await response.json();
          const apiSuggestions = data.map(item => {
            const address = item.address || {};
            const city = address.city || address.town || address.village || address.municipality || address.state || '';
            const country = address.country || '';
            const countryCode = (address.country_code || '').toLowerCase();

            const cDetails = countryData[country.toLowerCase()] || {};

            if (city && country) {
              return {
                display: `${city}, ${country}`,
                city,
                country,
                emoji: cDetails.emoji || '📍',
                iso: countryCode || cDetails.iso || null
              };
            } else {
              return {
                display: item.display_name.split(',').slice(0, 3).join(',').trim(),
                city: city || item.display_name.split(',')[0].trim(),
                country,
                emoji: cDetails.emoji || '📍',
                iso: countryCode || cDetails.iso || null
              };
            }
          });

          // Merge unique entries
          setSuggestions(prev => {
            const seen = new Set(prev.map(p => p.display.toLowerCase()));
            const merged = [...prev];
            apiSuggestions.forEach(apiItem => {
              if (!seen.has(apiItem.display.toLowerCase())) {
                merged.push(apiItem);
                seen.add(apiItem.display.toLowerCase());
              }
            });
            return merged.slice(0, 8);
          });
        }
      } catch (err) {
        console.error('OSM Autocomplete error:', err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [destination]);

  // Fetch a gorgeous cover image for the destination
  useEffect(() => {
    if (destination.length >= 2) {
      const timer = setTimeout(() => {
        setDestImage(getDestinationImage(destination));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [destination]);

  // Dynamic End Date calculations based on Start Date & Number of Days
  useEffect(() => {
    if (startDate && durationDays) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + Number(durationDays) - 1);
      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [startDate, durationDays]);

  // Dynamic Budget breakdown tracking
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
    if (e) e.preventDefault();
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
          coverImage: destImage,
          budgetBreakdown: breakdown,
          travelPace,
          interests,
          stops: cities ? cities.split(',').map(c => c.trim()) : []
        })
      });

      if (response.status === 401) {
        logout();
        navigate('/login');
        return;
      }

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

  // Step Navigations
  const nextStep = () => {
    if (step === 1 && !destination) return;
    if (step === 2 && (!startDate || !durationDays)) return;
    setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="pb-24 max-w-6xl mx-auto font-body-md text-white">
      {isGenerating && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#080C14]/95 backdrop-blur-md animate-fade-in text-slate-100">
          <div className="max-w-md text-center space-y-6 px-6">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              <span className="material-symbols-outlined text-3xl text-blue-400 absolute inset-0 flex items-center justify-center animate-pulse">auto_awesome</span>
            </div>

            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Neural Itinerary Engine</p>

            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Compiling Custom Voyage to
            </h2>

            <div
              className="text-5xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent py-2"
            >
              {destination ? destination.split(',')[0].trim() : 'Destination'}
            </div>

            <p className="text-xs text-slate-450 leading-relaxed font-medium animate-pulse">
              Synthesizing travel routes, checking transport links, and organizing budgets...
            </p>
          </div>
        </div>
      )}

      {/* Wizard Header */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 leading-tight">
          Initialize Voyage Planner
        </h1>
        <p className="text-sm md:text-base text-slate-400 font-medium max-w-2xl">
          Complete the sequential configurations below to instigate RouteMind's AI Itinerary compiler.
        </p>
      </div>

      {/* Progressive Step Progress Bar */}
      <div className="max-w-xl mx-auto md:mx-0 mb-12 bg-[#0B0F19]/50 p-2 rounded-2xl border border-white/10 grid grid-cols-2 sm:flex sm:justify-between sm:items-center gap-1.5">
        {[
          { label: 'Destination', num: 1 },
          { label: 'Dates & Days', num: 2 },
          { label: 'Transit & Budget', num: 3 },
          { label: 'Vibe & Group', num: 4 }
        ].map((item) => (
          <div
            key={item.num}
            onClick={() => {
              // Only allow navigation to steps that are validated
              if (item.num === 1) setStep(1);
              if (item.num === 2 && destination) setStep(2);
              if (item.num === 3 && destination && startDate && durationDays) setStep(3);
              if (item.num === 4 && destination && startDate && durationDays) setStep(4);
            }}
            className={`w-full sm:flex-1 py-2 px-3 text-center rounded-xl cursor-pointer text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${step === item.num
                ? 'bg-primary text-white shadow-md'
                : step > item.num
                  ? 'bg-white/10 text-slate-200'
                  : 'text-slate-500 hover:text-slate-350'
              }`}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Form Panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="clay-surface rounded-3xl p-8 md:p-12">

            {/* STEP 1: DESTINATION & CITIES */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in text-left">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">1</div>
                  <h3 className="text-xl font-bold text-white">Specify Target Location</h3>
                </div>

                <div className="relative group" ref={autocompleteRef}>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 block">Destination Country / City</label>
                  <div className="clay-inset rounded-2xl flex items-center px-4 py-3 group-focus-within:ring-2 ring-primary transition-all relative">
                    <span className="material-symbols-outlined text-primary mr-3 text-lg">location_on</span>
                    <input
                      required
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="bg-transparent border-none focus:ring-0 w-full text-sm font-semibold text-slate-200 placeholder:text-slate-400 outline-none"
                      placeholder="e.g. Kyoto, Japan or Santorini, Greece"
                      type="text"
                      autoComplete="off"
                    />
                    {/* Tiny inline flag indicator if destination matches a known country suffix */}
                    {(() => {
                      const parts = destination.split(',');
                      const countryPart = parts[parts.length - 1].trim().toLowerCase();
                      const cDetails = countryData[countryPart];
                      if (cDetails && cDetails.iso) {
                        return (
                          <img
                            src={`https://flagcdn.com/w40/${cDetails.iso}.png`}
                            alt={cDetails.name}
                            className="w-5.5 h-3.5 object-cover rounded shadow-sm border border-white/10 mr-1.5"
                          />
                        );
                      }
                      return null;
                    })()}
                  </div>

                  {/* Autocomplete Dropdown List */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-surface border border-white/10 shadow-2xl rounded-2xl overflow-hidden animate-fade-in">
                      <div className="py-2.5 max-h-[250px] overflow-y-auto">
                        {suggestions.map((suggestion, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setDestination(suggestion.display);
                              setShowSuggestions(false);
                            }}
                            className="px-5 py-3 hover:bg-white/5 flex items-center gap-3 cursor-pointer transition-all duration-150 border-b border-white/5 last:border-0"
                          >
                            {suggestion.iso ? (
                              <img
                                src={`https://flagcdn.com/w40/${suggestion.iso}.png`}
                                alt={suggestion.country}
                                className="w-5.5 h-4 object-cover rounded shadow-sm border border-white/10 shrink-0"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <span className="text-lg shrink-0 filter drop-shadow">{suggestion.emoji}</span>
                            )}
                            <div className="flex-1 text-left">
                              <p className="text-[13px] font-bold text-white leading-tight">
                                {suggestion.city ? suggestion.city : suggestion.country}
                              </p>
                              {suggestion.city && (
                                <p className="text-[9px] font-semibold text-slate-350 uppercase tracking-wider mt-0.5">
                                  {suggestion.country}
                                </p>
                              )}
                            </div>
                            <span className="material-symbols-outlined text-slate-400 text-xs shrink-0 hover:translate-x-0.5 transition-transform">
                              arrow_forward
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative group">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 block">Stops or Specific Cities to Explore (Optional)</label>
                  <div className="clay-inset rounded-2xl flex items-center px-4 py-3 group-focus-within:ring-2 ring-primary transition-all">
                    <span className="material-symbols-outlined text-primary mr-3 text-lg">explore</span>
                    <input
                      value={cities}
                      onChange={(e) => setCities(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 w-full text-sm font-semibold text-slate-200 placeholder:text-slate-400 outline-none"
                      placeholder="e.g. Tokyo, Gion, Shibuya"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: TRIP DURATION & CALENDAR */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in text-left">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">2</div>
                  <h3 className="text-xl font-bold text-white">Timeline & Calendar Setup</h3>
                </div>

                <div className="relative group">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 block">Number of Days</label>
                  <div className="clay-inset rounded-2xl flex items-center px-4 py-3 group-focus-within:ring-2 ring-primary transition-all">
                    <span className="material-symbols-outlined text-primary mr-3 text-lg">hourglass_bottom</span>
                    <input
                      required
                      type="number"
                      min="1"
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      className="bg-transparent border-none focus:ring-0 w-full text-sm font-semibold text-slate-200 outline-none"
                    />
                  </div>
                </div>

                {durationDays > 0 && (
                  <div className="space-y-4 animate-fade-in">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">Select Start Date</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="clay-inset rounded-2xl p-4 flex flex-col gap-1 text-left">
                        <label className="text-[10px] font-bold text-slate-450 uppercase">Check-In Date</label>
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
                          <input
                            required
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-slate-200 w-full outline-none"
                          />
                        </div>
                      </div>

                      <div className="clay-inset rounded-2xl p-4 flex flex-col gap-1 text-left opacity-80">
                        <label className="text-[10px] font-bold text-slate-450 uppercase">Check-Out Date (Auto-Calculated)</label>
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-slate-400 text-lg">calendar_month</span>
                          <input
                            disabled
                            type="date"
                            value={endDate}
                            className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-slate-400 w-full outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: TRANSIT & BUDGET */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in text-left">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">3</div>
                  <h3 className="text-xl font-bold text-white">Transportation & Financial Allocations</h3>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">Transit Mode</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {['flight', 'train', 'bus', 'car'].map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setTransportMode(mode)}
                        className={`clay-surface rounded-2xl p-4 flex flex-col items-center gap-2 transition-all ${transportMode === mode ? 'border-2 border-primary bg-primary/5' : 'hover:translate-y-[-2px]'
                          }`}
                      >
                        <span className={`material-symbols-outlined text-2xl ${transportMode === mode ? 'text-primary' : 'text-slate-400'}`}>
                          {transportIcons[mode]}
                        </span>
                        <span className="text-xs font-bold capitalize">{mode}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 block">Approximate Budget (₹)</label>
                    <div className="clay-inset rounded-2xl flex items-center px-4 py-3 group-focus-within:ring-2 ring-primary transition-all">
                      <span className="text-primary mr-2 font-black text-sm">₹</span>
                      <input
                        required
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="bg-transparent border-none focus:ring-0 w-full text-sm font-semibold text-slate-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="relative group flex flex-col justify-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Financial Breakdown Strategy</span>
                    <div className="rounded-xl border border-white/10 p-3.5 bg-[#0B0F19]/50 flex items-center justify-between text-xs font-semibold text-slate-350">
                      <div>
                        <span>Hotel: ₹{breakdown.accommodation.toLocaleString()}</span>
                      </div>
                      <div>
                        <span>Transit: ₹{breakdown.transport.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: NATURE OF TRIP & GROUP SIZE */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in text-left">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">4</div>
                  <h3 className="text-xl font-bold text-white">Personalization & Personal Details</h3>
                </div>

                <div className="relative group">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 block">Group Size (Number of People)</label>
                  <div className="clay-inset rounded-2xl flex items-center px-4 py-3 group-focus-within:ring-2 ring-primary transition-all">
                    <span className="material-symbols-outlined text-primary mr-3 text-lg">group</span>
                    <input
                      required
                      type="number"
                      min="1"
                      value={travelerCount}
                      onChange={(e) => setTravelerCount(Number(e.target.value))}
                      className="bg-transparent border-none focus:ring-0 w-full text-sm font-semibold text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">Nature of Trip / Voyage Vibe</label>
                  <div className="flex flex-wrap gap-2.5">
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
                          className={`px-6 py-3 rounded-full text-xs font-bold transition-all border ${isSelected
                              ? 'bg-primary text-white border-primary shadow-sm scale-95'
                              : 'clay-surface text-slate-300 hover:border-white/20 hover:text-white'
                            }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons at the bottom */}
            <div className="mt-12 flex justify-between items-center border-t border-white/10 pt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="clay-button-secondary py-3 px-6 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-xs">arrow_back</span> Back
                </button>
              ) : (
                <div></div>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={(step === 1 && !destination) || (step === 2 && (!startDate || !durationDays))}
                  className="clay-button-primary py-3 px-8 rounded-xl text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isGenerating || !destination || !startDate || !durationDays}
                  className="clay-button-primary py-3 px-8 rounded-xl text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isGenerating ? 'Compiling Itinerary...' : 'Instigate AI Planner'}
                  {!isGenerating && <span className="material-symbols-outlined text-xs">auto_awesome</span>}
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Right Dynamic Summary Panel */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
          <div className="clay-surface rounded-3xl overflow-hidden shadow-xl border border-white/10">
            <div className="h-44 relative bg-slate-900 shrink-0">
              <img
                className="w-full h-full object-cover"
                src={destImage}
                alt="Destination Preview"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-5 flex items-center gap-2">
                {(() => {
                  const parts = destination.split(',');
                  const countryPart = parts[parts.length - 1].trim().toLowerCase();
                  const cDetails = countryData[countryPart];
                  if (cDetails && cDetails.iso) {
                    return (
                      <img
                        src={`https://flagcdn.com/w40/${cDetails.iso}.png`}
                        alt={cDetails.name}
                        className="w-5.5 h-3.5 object-cover rounded border border-white/60 shadow"
                      />
                    );
                  }
                  return null;
                })()}
                <h3 className="text-white text-lg font-black truncate max-w-[200px]">
                  {destination ? destination.split(',')[0].trim() : 'Select Destination'}
                </h3>
              </div>
            </div>
            <div className="p-8 space-y-5 text-left">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-450">Voyage Parameters</h4>

              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider">Destination</span>
                  <span className="font-extrabold text-primary max-w-[150px] truncate">{destination || '—'}</span>
                </div>

                {cities && (
                  <div className="flex justify-between items-center text-xs animate-fade-in">
                    <span className="font-semibold text-slate-400 uppercase tracking-wider">Stops</span>
                    <span className="font-bold text-slate-200 max-w-[150px] truncate">{cities}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider">Duration</span>
                  <span className="font-bold text-slate-200">{durationDays ? `${durationDays} Days` : '—'}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider">Schedule</span>
                  <span className="font-bold text-slate-200 text-[11px]">
                    {startDate && endDate ? `${startDate.substring(5)} to ${endDate.substring(5)}` : '—'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider">Travelers</span>
                  <span className="font-bold text-slate-200">{travelerCount} traveler(s)</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider">Transit</span>
                  <span className="font-bold text-slate-200 capitalize flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-blue-400">{transportIcons[transportMode]}</span>
                    {transportMode}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Total Budget</span>
                  <span className="text-xl font-black text-white">₹{budget.toLocaleString()}</span>
                </div>

                {step < 4 ? (
                  <button
                    onClick={nextStep}
                    disabled={(step === 1 && !destination) || (step === 2 && (!startDate || !durationDays))}
                    className="clay-button-primary py-2.5 px-4 rounded-xl text-[10px] uppercase font-black tracking-widest disabled:opacity-50"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isGenerating || !destination || !startDate || !durationDays}
                    className="clay-button-primary py-2.5 px-4 rounded-xl text-[10px] uppercase font-black tracking-widest disabled:opacity-50"
                  >
                    Instigate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateTrip;
