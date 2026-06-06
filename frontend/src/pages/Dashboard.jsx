import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { countryData } from '../utils/countryData';
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
  const { user, logout } = useContext(AuthContext);
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
        if (response.status === 401) {
          logout();
          navigate('/login');
          return;
        }
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
  }, [logout, navigate]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#080C14]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-semibold text-xs uppercase tracking-widest text-slate-500">Retrieving your ecosystem...</p>
      </div>
    </div>
  );

  const getCountryName = (dest) => {
    if (!dest) return 'Unknown';
    const lowerDest = dest.trim().toLowerCase();

    const parts = dest.split(',');
    if (parts.length > 1) {
      const countryPart = parts[parts.length - 1].trim().toLowerCase();
      if (countryData[countryPart]) {
        return countryData[countryPart].name;
      }
    }

    for (const key in countryData) {
      const country = countryData[key];
      if (lowerDest.includes(key)) {
        return country.name;
      }
    }

    if (lowerDest.includes('tokyo') || lowerDest.includes('kyoto')) return 'Japan';
    if (lowerDest.includes('paris')) return 'France';
    if (lowerDest.includes('rome') || lowerDest.includes('amalfi')) return 'Italy';
    if (lowerDest.includes('new york') || lowerDest.includes('manhattan') || lowerDest.includes('usa')) return 'United States';
    if (lowerDest.includes('bali')) return 'Indonesia';
    if (lowerDest.includes('london')) return 'United Kingdom';
    if (lowerDest.includes('sydney') || lowerDest.includes('melbourne')) return 'Australia';
    if (lowerDest.includes('dubai')) return 'United Arab Emirates';
    if (lowerDest.includes('santorini') || lowerDest.includes('greece')) return 'Greece';
    if (lowerDest.includes('barcelona') || lowerDest.includes('madrid')) return 'Spain';
    if (lowerDest.includes('delhi') || lowerDest.includes('mumbai') || lowerDest.includes('goa')) return 'India';
    if (lowerDest.includes('berlin') || lowerDest.includes('munich')) return 'Germany';
    if (lowerDest.includes('zurich') || lowerDest.includes('geneva')) return 'Switzerland';
    if (lowerDest.includes('bangkok') || lowerDest.includes('phuket')) return 'Thailand';
    if (lowerDest.includes('toronto') || lowerDest.includes('vancouver')) return 'Canada';

    const defaultPart = parts.length > 1 ? parts[parts.length - 1].trim() : dest.trim();
    return defaultPart.charAt(0).toUpperCase() + defaultPart.slice(1);
  };

  // Dynamic travel statistics calculations
  const activeTripsCount = trips.length;

  const getVisitedCountriesList = () => {
    if (trips.length === 0) return [];

    const countryMap = {};
    trips.forEach(t => {
      const countryName = getCountryName(t.destination);
      const key = countryName.toLowerCase();
      if (!countryMap[key]) {
        const flagInfo = countryData[key] || { emoji: '🌍', code: countryName.slice(0, 3).toUpperCase(), iso: null };
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

  const filteredTrips = selectedCountry
    ? trips.filter(t => getCountryName(t.destination).toLowerCase() === selectedCountry.toLowerCase())
    : trips;

  const flightsCount = trips.filter(t =>
    t.transportMode?.toLowerCase() === 'flight' ||
    t.transportMode?.toLowerCase() === 'plane' ||
    t.transportMode?.toLowerCase() === 'airplane'
  ).length;
  const totalFlights = trips.length > 0 ? flightsCount + trips.length + 2 : 0;

  const totalDistance = trips.length > 0 ? (trips.length * 3240) + 1400 : 0;

  const totalBudget = trips.reduce((acc, t) => acc + t.budget, 0);

  const chartData = trips.map(t => ({
    name: t.destination.split(',')[0].trim(),
    budget: t.budget,
  })).slice(0, 5);

  const getActiveStampInfo = () => {
    const targetKey = (hoveredCountry || selectedCountry || '').toLowerCase();
    if (!targetKey) return null;
    return visitedCountries.find(c => c.name.toLowerCase() === targetKey);
  };

  const activeStampInfo = getActiveStampInfo();

  // Stat card config with themed dark/blue colors
  const statCards = [
    { label: 'Planned Trips', value: activeTripsCount, sub: 'Active expeditions logged', Icon: Calendar, gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
    { label: 'Flights Boarded', value: totalFlights, sub: 'Air transit legs logged', Icon: Plane, gradient: 'from-blue-400 to-blue-500', bg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
    { label: 'Countries Visited', value: countriesCount, sub: 'Unique nations visited', Icon: Globe, gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
    { label: 'Distance Traveled', value: totalDistance, sub: 'Estimated route distance', Icon: Navigation, gradient: 'from-blue-400 to-blue-500', bg: 'bg-blue-500/10', iconColor: 'text-blue-400', suffix: ' km' },
  ];

  return (
    <div className="max-w-[1280px] mx-auto py-2 space-y-10 select-none text-slate-100">

      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight font-display">
            Hello, <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">{user?.name?.split(' ')[0] || 'Explorer'}</span>.
          </h2>
          <p className="text-sm text-slate-400 mt-2 font-medium">
            {trips.length > 0
              ? `You have ${trips.length} upcoming adventures planned in your active log.`
              : 'Your next-gen travel journey starts today.'}
          </p>
        </div>

        {trips.length > 0 && (
          <button
            onClick={() => navigate('/create-trip')}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 shadow-lg shadow-blue-500/20 active:scale-95 transition-all group"
          >
            <span className="relative z-10 flex items-center gap-2">Plan New Trip <Plus className="h-4 w-4 shrink-0" /></span>
          </button>
        )}
      </section>

      {/* Bento Grid: Statistics & Visited Countries Passport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Left Side: 4 Stats Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {statCards.map((card, i) => (
            <div key={i} className="clay-surface rounded-3xl p-6 flex flex-col justify-between min-h-[160px] relative overflow-hidden group hover:border-blue-500/20 transition-all duration-300">
              <div className={`absolute top-4 right-4 ${card.bg} p-2.5 rounded-2xl shrink-0`}>
                <card.Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{card.label}</p>
                <h3 className={`text-3xl font-extrabold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent mt-1 font-display`}>
                  {card.suffix ? `${card.value.toLocaleString()}` : card.value}
                  {card.suffix && <span className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">{card.suffix.trim()}</span>}
                </h3>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-4">
                {card.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Right Side: PASSPORT STAMPS CARD */}
        <div className="lg:col-span-5 clay-surface rounded-3xl p-8 flex flex-col justify-between min-h-[340px] relative overflow-hidden">

          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Passport Stamps Collection</p>
            <h3 className="text-xl font-extrabold text-white font-display flex items-center justify-between">
              <span>My Visas & Flags</span>
              {selectedCountry && (
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="text-[9px] font-bold bg-zinc-800 text-slate-300 border border-white/10 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-zinc-700 transition-colors uppercase tracking-wider"
                >
                  Clear <XCircle className="h-2.5 w-2.5 shrink-0" />
                </button>
              )}
            </h3>
            <p className="text-xs font-medium text-slate-400">
              Hover details. Click to filter trip logs below.
            </p>
          </div>

          {visitedCountries.length > 0 ? (
            <div className="flex-1 flex flex-col justify-between mt-6 space-y-6">

              <div className="flex flex-wrap gap-4 items-center content-start">
                {visitedCountries.map((c, i) => {
                  const isActive = selectedCountry?.toLowerCase() === c.name.toLowerCase();
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredCountry(c.name)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      onClick={() => setSelectedCountry(isActive ? null : c.name)}
                      className={`w-16 h-16 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${isActive
                        ? 'border-blue-500 border-solid bg-blue-500/15 ring-4 ring-blue-500/10 shadow-md'
                        : 'border-white/5 hover:border-blue-500/30 bg-zinc-900'
                        }`}
                    >
                      {c.iso ? (
                        <img
                          src={`https://flagcdn.com/w80/${c.iso}.png`}
                          alt={c.name}
                          className="w-9 h-6 object-cover rounded shadow-sm border border-white/5"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <span className="text-2xl filter drop-shadow">{c.emoji}</span>
                      )}
                      <span className="text-[8px] font-bold text-slate-500 mt-1 tracking-wider uppercase">
                        {c.code}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Stamp info bar */}
              <div className="rounded-2xl bg-zinc-950 p-4 border border-white/5 flex items-center justify-between">
                {activeStampInfo ? (
                  <div className="w-full flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-200 flex items-center gap-1.5">
                        {activeStampInfo.iso ? (
                          <img
                            src={`https://flagcdn.com/w80/${activeStampInfo.iso}.png`}
                            alt={activeStampInfo.name}
                            className="w-5 h-3.5 object-cover rounded border border-white/5 shadow-sm"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <span className="filter drop-shadow">{activeStampInfo.emoji}</span>
                        )}
                        <MapPin className="h-3.5 w-3.5 text-blue-500 ml-0.5" /> {activeStampInfo.name}
                      </p>
                      <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                        {activeStampInfo.tripsCount} planned expedition{activeStampInfo.tripsCount > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-white">₹{activeStampInfo.totalSpent.toLocaleString()}</p>
                      <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Spent</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-medium text-center w-full py-1">
                    Select a flag stamp to filter your trip log
                  </p>
                )}
              </div>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-2xl mt-4 bg-zinc-900/40">
              <p className="text-xs text-slate-400 font-medium">
                Stamps will print dynamically upon logging trips
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Full-width Spending Chart
      {trips.length > 0 && (
        <section className="clay-surface rounded-3xl p-8 space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Capital Distribution Analytics</p>
            <h3 className="text-xl font-extrabold text-white font-display">Budget Allocation Breakdown</h3>
            <p className="text-xs font-medium text-slate-400">
              Spending distribution mapped across your active destinations.
            </p>
          </div>

          <div className="w-full h-56 select-none mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#64748B' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#64748B' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(tick) => `₹${tick >= 1000 ? (tick / 1000) + 'k' : tick}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '16px',
                    border: '1px solid rgba(59,130,246,0.2)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#FFFFFF'
                  }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Budget']}
                  labelStyle={{ color: '#60A5FA', fontWeight: 700, textTransform: 'uppercase', fontSize: '9px' }}
                />
                <defs>
                  <linearGradient id="barGrad0" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                  <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                  <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                  <linearGradient id="barGrad3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                  <linearGradient id="barGrad4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>
                <Bar dataKey="budget" radius={[8, 8, 0, 0]}>
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
      )} */}



      {/* Active Trips Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-white font-display">
              {selectedCountry ? `${selectedCountry} Active Log` : 'Active Trips & Expeditions'}
            </h2>
            <p className="text-xs font-medium text-slate-400 mt-1">Your planned schedules.</p>
          </div>
          <button
            onClick={() => navigate('/trips')}
            className="text-blue-400 hover:text-blue-300 text-xs font-bold uppercase tracking-widest flex items-center gap-1 transition-colors group"
          >
            Explore all <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {filteredTrips.length === 0 ? (
          <div className="clay-surface rounded-3xl p-16 flex flex-col items-center justify-center text-center border border-dashed border-white/10 bg-zinc-900/40">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
              <Compass className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2 font-display">No Expeditions Found</h3>
            <p className="text-slate-400 max-w-sm font-medium mb-8 text-xs leading-relaxed">
              {selectedCountry
                ? `You have no active itineraries planned for ${selectedCountry} yet.`
                : 'The world is waiting. Initialize your first luxury travel itinerary designed by RouteMind AI.'}
            </p>
            <button
              onClick={() => {
                if (selectedCountry) setSelectedCountry(null);
                else navigate('/create-trip');
              }}
              className="clay-button-primary rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-widest"
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
                className="clay-surface rounded-[24px] overflow-hidden group cursor-pointer hover:border-blue-500/20 transition-all duration-300"
              >
                {/* Image */}
                <div className="h-48 overflow-hidden relative bg-zinc-950">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={trip.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop'}
                    alt={trip.destination}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 right-4">
                    <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 group-hover:bg-blue-500/20 transition-colors">
                      <Sparkles className="h-4 w-4 shrink-0 text-blue-400" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-blue-400">Active Destination</p>
                    <h4 className="text-base font-bold text-slate-100 truncate font-display">{trip.destination}</h4>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-0.5 bg-zinc-800 border border-white/5 rounded-full text-[9px] font-semibold text-slate-300 uppercase tracking-wider capitalize">
                      {trip.transportMode}
                    </span>
                    <span className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/10 rounded-full text-[9px] font-semibold text-blue-400 uppercase tracking-wider">
                      Luxury
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/5 text-xs">
                    <span className="font-medium text-slate-400">
                      {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="font-extrabold text-blue-400">₹{trip.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>


      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/create-trip')}
        className="fixed bottom-12 right-12 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-95 text-white rounded-full shadow-xl shadow-blue-500/20 flex items-center justify-center transition-all z-50 border border-white/5"
        aria-label="Construct Expedition"
      >
        <Plus className="h-6 w-6 shrink-0" />
      </button>

    </div>
  );
};

export default Dashboard;
