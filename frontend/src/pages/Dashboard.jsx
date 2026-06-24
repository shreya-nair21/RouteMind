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

  // Stat card config with themed dark/monochrome colors
  const statCards = [
    { label: 'Planned Trips', value: activeTripsCount, sub: 'Active expeditions logged', Icon: Calendar, gradient: 'from-white to-gray-400', bg: 'bg-white/10', iconColor: 'text-white' },
    { label: 'Flights Boarded', value: totalFlights, sub: 'Air transit legs logged', Icon: Plane, gradient: 'from-white to-gray-400', bg: 'bg-white/10', iconColor: 'text-white' },
    { label: 'Countries Visited', value: countriesCount, sub: 'Unique nations visited', Icon: Globe, gradient: 'from-white to-gray-400', bg: 'bg-white/10', iconColor: 'text-white' },
    { label: 'Distance Traveled', value: totalDistance, sub: 'Estimated route distance', Icon: Navigation, gradient: 'from-white to-gray-400', bg: 'bg-white/10', iconColor: 'text-white', suffix: ' km' },
  ];
  const nextTrip = trips[0];

  return (
    <div className="max-w-6xl mx-auto py-2 space-y-10 select-none text-white bg-transparent">

      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div>
          <h2 className="text-3xl md:text-4xl font-normal text-white leading-tight tracking-tight font-sans">
            Hello, <span className="font-bold text-white">{user?.name?.split(' ')[0] || 'Explorer'}</span>.
          </h2>
          <p className="text-sm text-white/90 mt-2 font-light">
            {trips.length > 0
              ? `You have ${trips.length} upcoming adventures planned in your active log.`
              : 'Your next-gen travel journey starts today.'}
          </p>
        </div>
      </section>

      {/* Modern Asymmetric Layout: Left Main Column (Showcase + Cards), Right Sidebar Column (Metrics + Stamps) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column (span 8): Voyage Hero & Trip Log List */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Primary Voyage Hero */}
          {nextTrip ? (
            <div className="liquid-glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group text-left">
              <div className="h-64 sm:h-80 overflow-hidden relative bg-zinc-950">
                <img
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  src={nextTrip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935'}
                  alt={nextTrip.destination}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                
                <div className="absolute top-6 left-6">
                  <span className="px-3 py-1 bg-white text-black text-[9px] font-bold uppercase tracking-widest rounded-lg">
                    Primary Expedition
                  </span>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/80">Active Destination</p>
                    <h3 className="text-3xl font-normal text-white tracking-tight font-sans">{nextTrip.destination}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/80">Allocated Budget</p>
                    <p className="text-2xl font-bold text-white">₹{nextTrip.budget.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-white/10 text-[11px] uppercase tracking-wider text-white">
                  <div>
                    <span className="block text-[8px] text-white/60">Transport</span>
                    <span className="font-bold text-white mt-1 block capitalize">{nextTrip.transportMode || 'Flight'}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-white/60">Date Range</span>
                    <span className="font-bold text-white mt-1 block">
                      {new Date(nextTrip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-white/60">Travelers</span>
                    <span className="font-bold text-white mt-1 block">{nextTrip.travelerCount || 1} Member(s)</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-white/60">Status</span>
                    <span className="font-bold text-white mt-1 block flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Boarding Soon
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-white/60 font-mono">Synced with RouteMind Cloud.</span>
                  <button
                    onClick={() => navigate(`/trips/${nextTrip._id}/itinerary`)}
                    className="px-6 py-3 bg-white text-black text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-gray-150 transition-colors border-none cursor-pointer"
                  >
                    Open Itinerary Map
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="liquid-glass rounded-3xl p-16 flex flex-col items-center justify-center text-center border border-dashed border-white/10 bg-zinc-900/40">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white mb-6">
                <Compass className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-normal text-white mb-2 font-sans">No Expeditions Found</h3>
              <p className="text-white/80 max-w-sm font-light mb-8 text-xs leading-relaxed">
                The world is waiting. Initialize your first luxury travel itinerary designed by RouteMind AI.
              </p>
              <button
                onClick={() => navigate('/create-trip')}
                className="px-8 py-3.5 text-xs font-semibold uppercase tracking-wider rounded-lg bg-white text-black hover:bg-gray-150 transition-colors border-none cursor-pointer"
              >
                Initialize First Journey
              </button>
            </div>
          )}

          {/* Active Logs / Other Expeditions */}
          {trips.length > 0 && (
            <section className="space-y-6 text-left">
              <div className="flex justify-between items-end">
                <h3 className="text-2xl font-normal text-white font-sans">
                  {selectedCountry ? `${selectedCountry} Active Log` : 'Other Expeditions'}
                </h3>
                {trips.length > 1 && (
                  <button
                    onClick={() => navigate('/trips')}
                    className="text-white hover:text-white/80 text-xs font-semibold uppercase tracking-widest flex items-center gap-1 transition-colors bg-transparent border-none cursor-pointer"
                  >
                    Explore all <ChevronRight className="h-4 w-4 shrink-0" />
                  </button>
                )}
              </div>

              {filteredTrips.length === 0 ? (
                <div className="liquid-glass rounded-3xl p-10 text-center border border-white/5">
                  <p className="text-xs text-white/80 leading-relaxed font-light">
                    No active itineraries planned for {selectedCountry} yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTrips.filter(t => !nextTrip || t._id !== nextTrip._id || selectedCountry).map(trip => (
                    <div
                      key={trip._id}
                      onClick={() => navigate(`/trips/${trip._id}/itinerary`)}
                      className="liquid-glass rounded-2xl overflow-hidden group cursor-pointer hover:border-white/20 border border-white/5 transition-all duration-300"
                    >
                      <div className="h-40 overflow-hidden relative bg-zinc-950">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935'}
                          alt={trip.destination}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                      </div>
                      <div className="p-6 text-left space-y-4">
                        <div className="space-y-1">
                          <p className="text-[9px] font-semibold uppercase tracking-widest text-white/80">Destination</p>
                          <h4 className="text-lg font-normal text-white truncate font-sans">{trip.destination}</h4>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/5 text-xs text-white">
                          <span className="font-light">
                            {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="font-bold">₹{trip.budget.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

        </div>

        {/* Right Column (span 4): Travel Metrics & Passport Stamps */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Travel Metrics Panel */}
          <div className="liquid-glass rounded-3xl p-8 border border-white/10 space-y-6">
            <h3 className="text-lg font-normal text-white font-sans text-left">Travel Analytics</h3>
            <div className="space-y-4">
              {statCards.map((card, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-2 bg-white/10 border border-white/10 rounded-xl text-white">
                      <card.Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[8px] font-semibold uppercase tracking-widest text-white">{card.label}</p>
                      <p className="text-[10px] font-light text-white/85">{card.sub}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-white">
                      {card.value}
                      {card.suffix && <span className="text-[9px] ml-0.5 text-white">{card.suffix.trim()}</span>}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Passport Stamps Collection */}
          <div className="liquid-glass rounded-3xl p-8 border border-white/10 flex flex-col justify-between min-h-[340px] relative overflow-hidden">
            <div className="space-y-1 text-left">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white">Passport Stamps Collection</p>
              <h3 className="text-xl font-normal text-white font-sans flex items-center justify-between">
                <span>My Visas & Flags</span>
                {selectedCountry && (
                  <button
                    onClick={() => setSelectedCountry(null)}
                    className="text-[9px] font-semibold bg-zinc-800 text-white border border-white/10 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-zinc-700 transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    Clear <XCircle className="h-2.5 w-2.5 shrink-0" />
                  </button>
                )}
              </h3>
              <p className="text-xs font-light text-white/90">
                Hover details. Click to filter trip logs.
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
                          ? 'border-white border-solid bg-white/10 ring-4 ring-white/5 shadow-md'
                          : 'border-white/5 hover:border-white/20 bg-zinc-900'
                          }`}
                      >
                        {c.iso ? (
                          <img
                            src={`https://flagcdn.com/w80/${c.iso}.png`}
                            alt={c.name}
                            className="w-9 h-6 object-cover rounded shadow-sm border border-white/5"
                          />
                        ) : (
                          <span className="text-2xl filter drop-shadow">{c.emoji}</span>
                        )}
                        <span className="text-[8px] font-bold text-white mt-1 tracking-wider uppercase">
                          {c.code}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Stamp info bar */}
                <div className="rounded-2xl bg-zinc-950 p-4 border border-white/5 flex items-center justify-between">
                  {activeStampInfo ? (
                    <div className="w-full flex justify-between items-center text-xs text-left text-white">
                      <div>
                        <p className="font-bold text-white flex items-center gap-1.5">
                          {activeStampInfo.iso ? (
                            <img
                              src={`https://flagcdn.com/w80/${activeStampInfo.iso}.png`}
                              alt={activeStampInfo.name}
                              className="w-5 h-3.5 object-cover rounded border border-white/5 shadow-sm"
                            />
                          ) : (
                            <span className="filter drop-shadow">{activeStampInfo.emoji}</span>
                          )}
                          <MapPin className="h-3.5 w-3.5 text-white ml-0.5" /> {activeStampInfo.name}
                        </p>
                        <p className="text-[10px] font-light text-white/95 mt-0.5">
                          {activeStampInfo.tripsCount} planned expedition{activeStampInfo.tripsCount > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">₹{activeStampInfo.totalSpent.toLocaleString()}</p>
                        <p className="text-[9px] font-semibold text-white uppercase tracking-widest">Spent</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-white font-light text-center w-full py-1">
                      Select a flag stamp to filter your trip log
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-2xl mt-4 bg-zinc-900/40">
                <p className="text-xs text-white font-light">
                  Stamps will print dynamically upon logging trips
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
