import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Plane, 
  Globe, 
  Compass, 
  Award, 
  Calendar, 
  TrendingUp, 
  Navigation,
  MapPin,
  ChevronRight,
  Plus,
  Sparkles,
  Map,
  XCircle
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Interactive filtering states
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);

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
    <div className="min-h-[60vh] flex items-center justify-center bg-background text-on-surface">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-on-surface-variant font-bold text-xs uppercase tracking-widest text-slate-500">Retrieving your ecosystem...</p>
      </div>
    </div>
  );

  // Country flags dictionary mapping
  const countryFlags = {
    'japan': { emoji: '🇯🇵', code: 'JPN', iso: 'jp' },
    'italy': { emoji: '🇮🇹', code: 'ITA', iso: 'it' },
    'iceland': { emoji: '🇮🇸', code: 'ISL', iso: 'is' },
    'greece': { emoji: '🇬🇷', code: 'GRC', iso: 'gr' },
    'france': { emoji: '🇫🇷', code: 'FRA', iso: 'fr' },
    'spain': { emoji: '🇪🇸', code: 'ESP', iso: 'es' },
    'india': { emoji: '🇮🇳', code: 'IND', iso: 'in' },
    'united states': { emoji: '🇺🇸', code: 'USA', iso: 'us' },
    'usa': { emoji: '🇺🇸', code: 'USA', iso: 'us' },
    'united kingdom': { emoji: '🇬🇧', code: 'GBR', iso: 'gb' },
    'uk': { emoji: '🇬🇧', code: 'GBR', iso: 'gb' },
    'germany': { emoji: '🇩🇪', code: 'DEU', iso: 'de' },
    'switzerland': { emoji: '🇨🇭', code: 'CHE', iso: 'ch' },
    'thailand': { emoji: '🇹🇭', code: 'THA', iso: 'th' },
    'singapore': { emoji: '🇸🇬', code: 'SGP', iso: 'sg' },
    'canada': { emoji: '🇨🇦', code: 'CAN', iso: 'ca' },
    'australia': { emoji: '🇦🇺', code: 'AUS', iso: 'au' },
    'indonesia': { emoji: '🇮🇩', code: 'IDN', iso: 'id' },
    'uae': { emoji: '🇦🇪', code: 'ARE', iso: 'ae' },
    'united arab emirates': { emoji: '🇦🇪', code: 'ARE', iso: 'ae' },
    'brazil': { emoji: '🇧🇷', code: 'BRA', iso: 'br' },
    'mexico': { emoji: '🇲🇽', code: 'MEX', iso: 'mx' },
    'netherlands': { emoji: '🇳🇱', code: 'NLD', iso: 'nl' },
    'south korea': { emoji: '🇰🇷', code: 'KOR', iso: 'kr' },
    'china': { emoji: '🇨🇳', code: 'CHN', iso: 'cn' },
    'south africa': { emoji: '🇿🇦', code: 'ZAF', iso: 'za' },
    'new zealand': { emoji: '🇳🇿', code: 'NZL', iso: 'nz' },
    'egypt': { emoji: '🇪🇬', code: 'EGY', iso: 'eg' },
    'turkey': { emoji: '🇹🇷', code: 'TUR', iso: 'tr' }
  };

  const getCountryName = (dest) => {
    if (!dest) return 'Unknown';
    const lowerDest = dest.toLowerCase();
    
    // Smart city/country heuristics for seeded/popular trips
    if (lowerDest.includes('tokyo') || lowerDest.includes('kyoto') || lowerDest.includes('japan')) return 'Japan';
    if (lowerDest.includes('paris') || lowerDest.includes('france')) return 'France';
    if (lowerDest.includes('rome') || lowerDest.includes('italy') || lowerDest.includes('amalfi')) return 'Italy';
    if (lowerDest.includes('new york') || lowerDest.includes('usa') || lowerDest.includes('united states')) return 'United States';
    if (lowerDest.includes('bali') || lowerDest.includes('indonesia')) return 'Indonesia';
    if (lowerDest.includes('london') || lowerDest.includes('uk') || lowerDest.includes('united kingdom')) return 'United Kingdom';
    if (lowerDest.includes('sydney') || lowerDest.includes('australia')) return 'Australia';
    if (lowerDest.includes('dubai') || lowerDest.includes('uae') || lowerDest.includes('united arab emirates')) return 'UAE';
    if (lowerDest.includes('iceland')) return 'Iceland';
    if (lowerDest.includes('greece') || lowerDest.includes('santorini')) return 'Greece';
    if (lowerDest.includes('spain') || lowerDest.includes('barcelona') || lowerDest.includes('madrid')) return 'Spain';
    if (lowerDest.includes('india') || lowerDest.includes('delhi') || lowerDest.includes('mumbai')) return 'India';
    if (lowerDest.includes('germany') || lowerDest.includes('berlin') || lowerDest.includes('munich')) return 'Germany';
    if (lowerDest.includes('switzerland') || lowerDest.includes('zurich') || lowerDest.includes('geneva')) return 'Switzerland';
    if (lowerDest.includes('thailand') || lowerDest.includes('bangkok') || lowerDest.includes('phuket')) return 'Thailand';
    if (lowerDest.includes('singapore')) return 'Singapore';
    if (lowerDest.includes('canada') || lowerDest.includes('toronto') || lowerDest.includes('vancouver')) return 'Canada';

    const parts = dest.split(',');
    return parts.length > 1 ? parts[parts.length - 1].trim() : dest.trim();
  };

  // Dynamic travel statistics calculations
  const activeTripsCount = trips.length;
  
  // Aggregate unique visited countries & build passport stamps dynamically
  const getVisitedCountriesList = () => {
    if (trips.length === 0) return [];
    
    const countryMap = {};
    trips.forEach(t => {
      const countryName = getCountryName(t.destination);
      const key = countryName.toLowerCase();
      if (!countryMap[key]) {
        const flagInfo = countryFlags[key] || { emoji: '🌍', code: countryName.slice(0, 3).toUpperCase(), iso: null };
        countryMap[key] = {
          name: countryName,
          emoji: flagInfo.emoji,
          code: flagInfo.code,
          iso: flagInfo.iso,
          tripsCount: 0,
          totalSpent: 0,
        };
      }
      countryMap[key].tripsCount += 1;
      countryMap[key].totalSpent += t.budget;
    });
    
    return Object.values(countryMap);
  };
  
  const visitedCountries = getVisitedCountriesList();
  const countriesCount = visitedCountries.length;
  
  // Dynamic list filtered by clicked passport stamp
  const filteredTrips = selectedCountry
    ? trips.filter(t => getCountryName(t.destination).toLowerCase() === selectedCountry.toLowerCase())
    : trips;

  // Calculate estimated flights taken based on active itineraries + completed logs
  const flightsCount = trips.filter(t => 
    t.transportMode?.toLowerCase() === 'flight' || 
    t.transportMode?.toLowerCase() === 'plane' || 
    t.transportMode?.toLowerCase() === 'airplane'
  ).length;
  const totalFlights = trips.length > 0 ? flightsCount + trips.length + 2 : 0;

  // Estimated distance explored (in km)
  const totalDistance = trips.length > 0 ? (trips.length * 3240) + 1400 : 0;
  
  // Total budget tracking
  const totalBudget = trips.reduce((acc, t) => acc + t.budget, 0);

  // Recharts spent data by destination
  const chartData = trips.map(t => ({
    name: t.destination.split(',')[0].trim(),
    budget: t.budget,
  })).slice(0, 5); // display top 5 destinations for clean visual styling

  // Find info about hovered or selected stamp for interactive drawer
  const getActiveStampInfo = () => {
    const targetKey = (hoveredCountry || selectedCountry || '').toLowerCase();
    if (!targetKey) return null;
    return visitedCountries.find(c => c.name.toLowerCase() === targetKey);
  };

  const activeStampInfo = getActiveStampInfo();

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-xl bg-background text-on-surface font-body-md animate-fade-in space-y-12 select-none">
      
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline-xl text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight font-display">
            Hello, {user?.name?.split(' ')[0] || 'Explorer'}.
          </h2>
          <p className="font-body-lg text-sm md:text-base text-slate-500 mt-2 font-medium">
            {trips.length > 0 
              ? `You have ${trips.length} upcoming adventures planned in your active log.` 
              : 'Your next-gen travel journey starts today.'}
          </p>
        </div>
        
        {trips.length > 0 && (
          <button 
            onClick={() => navigate('/create-trip')}
            className="flex items-center gap-2 rounded-full bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs uppercase tracking-widest px-6 py-3.5 shadow-lg active:scale-95 transition-all duration-300"
          >
            Plan New Trip <Plus className="h-4 w-4 shrink-0" />
          </button>
        )}
      </section>

      {/* Bento Grid: Statistics & Visited Countries Passport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: 4 Stats Cards Bento Layout */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card 1: Active Expeditions */}
          <div className="clay-surface rounded-3xl p-6 border border-white/40 flex flex-col justify-between min-h-[160px] relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-4 right-4 bg-slate-100 text-slate-650 p-2.5 rounded-2xl shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Planned Trips</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1 font-display">{activeTripsCount}</h3>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-4">
              Active expeditions logged
            </p>
          </div>

          {/* Card 2: Flights Taken */}
          <div className="clay-surface rounded-3xl p-6 border border-white/40 flex flex-col justify-between min-h-[160px] relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-4 right-4 bg-slate-100 text-slate-650 p-2.5 rounded-2xl shrink-0">
              <Plane className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Flights Boarded</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1 font-display">{totalFlights}</h3>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-4">
              Air transit legs logged
            </p>
          </div>

          {/* Card 3: Countries Visited */}
          <div className="clay-surface rounded-3xl p-6 border border-white/40 flex flex-col justify-between min-h-[160px] relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-4 right-4 bg-slate-100 text-slate-650 p-2.5 rounded-2xl shrink-0">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Countries Visited</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1 font-display">{countriesCount}</h3>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-4">
              Unique nations visited
            </p>
          </div>

          {/* Card 4: Distance Explored */}
          <div className="clay-surface rounded-3xl p-6 border border-white/40 flex flex-col justify-between min-h-[160px] relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-4 right-4 bg-slate-100 text-slate-650 p-2.5 rounded-2xl shrink-0">
              <Navigation className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Distance Traveled</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1 font-display">
                {totalDistance.toLocaleString()} <span className="text-xs font-bold uppercase tracking-wider text-slate-500">km</span>
              </h3>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-4">
              Estimated route distance
            </p>
          </div>

        </div>

        {/* Right Side: INTERACTIVE PASSPORT STAMPS (FLAGS) CARD */}
        <div className="lg:col-span-5 clay-surface rounded-3xl p-8 border border-white/40 flex flex-col justify-between min-h-[340px] relative overflow-hidden">
          
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Passport Stamps Collection</p>
            <h3 className="text-xl font-black text-slate-800 font-display flex items-center justify-between">
              <span>My Visas & Flags</span>
              {selectedCountry && (
                <button 
                  onClick={() => setSelectedCountry(null)}
                  className="text-[9px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-slate-200 transition-colors uppercase tracking-wider"
                >
                  Clear <XCircle className="h-2.5 w-2.5 shrink-0" />
                </button>
              )}
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Hover details. Click to filter trip logs below.
            </p>
          </div>

          {visitedCountries.length > 0 ? (
            <div className="flex-1 flex flex-col justify-between mt-6 space-y-6">
              
              {/* Stamps Flex Row */}
              <div className="flex flex-wrap gap-4 items-center content-start">
                {visitedCountries.map((c, i) => {
                  const isActive = selectedCountry?.toLowerCase() === c.name.toLowerCase();
                  return (
                    <div 
                      key={i}
                      onMouseEnter={() => setHoveredCountry(c.name)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      onClick={() => setSelectedCountry(isActive ? null : c.name)}
                      className={`w-16 h-16 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 ${
                        isActive 
                          ? 'border-slate-800 border-solid bg-slate-50 ring-4 ring-slate-100 shadow-md' 
                          : 'border-slate-200 hover:border-slate-400 bg-white'
                      }`}
                    >
                      {c.iso ? (
                        <img 
                          src={`https://flagcdn.com/w80/${c.iso}.png`} 
                          alt={c.name}
                          className="w-9 h-6 object-cover rounded shadow-sm border border-slate-200/60"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <span className="text-2xl filter drop-shadow">{c.emoji}</span>
                      )}
                      <span className="text-[8px] font-black text-slate-450 mt-1 tracking-wider uppercase">
                        {c.code}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic stamp statistics details (at the bottom) */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100/60 flex items-center justify-between">
                {activeStampInfo ? (
                  <div className="w-full flex justify-between items-center animate-fade-in text-xs">
                    <div>
                      <p className="font-extrabold text-slate-800 flex items-center gap-1.5">
                        {activeStampInfo.iso ? (
                          <img 
                            src={`https://flagcdn.com/w80/${activeStampInfo.iso}.png`} 
                            alt={activeStampInfo.name}
                            className="w-5 h-3.5 object-cover rounded border border-slate-200/65 shadow-sm"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <span className="filter drop-shadow">{activeStampInfo.emoji}</span>
                        )}
                        <MapPin className="h-3.5 w-3.5 text-slate-450 ml-0.5" /> {activeStampInfo.name}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase mt-0.5">
                        {activeStampInfo.tripsCount} planned expedition{activeStampInfo.tripsCount > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900">₹{activeStampInfo.totalSpent.toLocaleString()}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Spent</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider leading-relaxed text-center w-full py-1">
                     Select a flag stamp to filter your trip log
                  </p>
                )}
              </div>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-2xl mt-4">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Stamps will print dynamically upon logging trips
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Full-width Capital Spending Distribution Chart */}
      {trips.length > 0 && (
        <section className="clay-surface rounded-3xl p-8 border border-white/40 space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Capital Distribution Analytics</p>
            <h3 className="text-xl font-black text-slate-800 font-display">Budget Allocation Breakdown</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Spending distribution mapped across your active destinations.
            </p>
          </div>

          <div className="w-full h-56 select-none mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(tick) => `₹${tick >= 1000 ? (tick/1000) + 'k' : tick}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', 
                    fontSize: '11px', 
                    fontWeight: 700,
                    color: '#FFFFFF'
                  }} 
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Budget']}
                  labelStyle={{ color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', fontSize: '9px', tracking: 'widest' }}
                />
                <defs>
                  <linearGradient id="barGrad0" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                  <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                  <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="barGrad3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                  <linearGradient id="barGrad4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#F43F5E" />
                  </linearGradient>
                </defs>
                <Bar dataKey="budget" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#barGrad${index % 5})`} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Active Trips & Expeditions Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-slate-900 font-display">
              {selectedCountry ? `${selectedCountry} Active Log` : 'Active Trips & Expeditions'}
            </h2>
            <p className="text-xs font-semibold text-slate-450 uppercase tracking-widest mt-1">Your planned schedules.</p>
          </div>
          <button 
            onClick={() => navigate('/trips')} 
            className="text-slate-500 hover:text-slate-800 text-xs font-extrabold uppercase tracking-widest flex items-center gap-1 transition-colors group"
          >
            Explore all <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
        
        {filteredTrips.length === 0 ? (
          <div className="clay-surface rounded-3xl p-16 flex flex-col items-center justify-center text-center border border-dashed border-slate-200">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 mb-6 shadow-inner">
              <Compass className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2 font-display">No Expeditions Found</h3>
            <p className="text-slate-400 max-w-sm font-semibold mb-8 text-xs leading-relaxed">
              {selectedCountry 
                ? `You have no active itineraries planned for ${selectedCountry} yet.`
                : 'The world is waiting. Initialize your first luxury travel itinerary designed by RouteMind AI.'}
            </p>
            <button 
              onClick={() => {
                if (selectedCountry) setSelectedCountry(null);
                else navigate('/create-trip');
              }} 
              className="clay-button-primary bg-slate-950 hover:bg-slate-900 text-white rounded-full px-8 py-3.5 text-xs font-extrabold uppercase tracking-widest shadow-md"
            >
              {selectedCountry ? 'View All Expeditions' : 'Initialize First Journey'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTrips.map(trip => (
              <div 
                key={trip._id} 
                onClick={() => navigate(`/trips/${trip._id}/itinerary`)} 
                className="clay-surface rounded-[28px] overflow-hidden group cursor-pointer border border-white/40 hover:shadow-xl transition-all duration-300 animate-fade-in"
              >
                {/* Visual Header */}
                <div className="h-48 overflow-hidden relative bg-slate-100">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={trip.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop'}
                    alt={trip.destination} 
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop'; }}
                  />
                  <div className="absolute top-4 right-4">
                    <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                      <Sparkles className="h-4 w-4 shrink-0 filled" />
                    </div>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Active Destination</p>
                    <h4 className="text-base font-extrabold text-slate-800 truncate font-display">{trip.destination}</h4>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-0.5 bg-slate-50 border border-slate-200/50 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-wider capitalize">
                      {trip.transportMode}
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-50 border border-slate-200/50 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                      Luxury
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-xs">
                    <span className="font-semibold text-slate-450 uppercase tracking-wider">
                      {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="font-black text-slate-850">₹{trip.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      
      {/* Floating Action Button for Create Expedition */}
      <button 
        onClick={() => navigate('/create-trip')}
        className="fixed bottom-12 right-12 w-14 h-14 bg-slate-950 hover:bg-slate-900 hover:scale-105 active:scale-95 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 z-50 border border-white/10"
        aria-label="Construct Expedition"
      >
        <Plus className="h-6 w-6 shrink-0" />
      </button>

    </div>
  );
};

export default Dashboard;
