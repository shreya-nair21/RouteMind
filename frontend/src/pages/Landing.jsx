import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { countryData } from '../utils/countryData';
import {
  Compass,
  Sparkles,
  Mail,
  Lock,
  User,
  X,
  AlertCircle,
  ArrowRight,
  MapPin,
} from 'lucide-react';

const popularPackages = [
  {
    id: 'pkg-1',
    title: 'Tokyo & Kyoto Odyssey',
    country: 'Japan',
    rating: 4.9,
    reviewsCount: 1240,
    likes: 842,
    budget: 150000,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800',
    description: 'Embark on a high-tech yet traditional Japanese journey through the neon-lit streets of Tokyo and the historic temples and bamboo groves of Kyoto.',
    itinerary: [
      { day: 1, title: 'Arrival in Tokyo', details: 'Check-in at luxury Shibuya pod suite. Walk through Shibuya crossing at sunset and dine at a local hidden Izakaya.' },
      { day: 2, title: 'Historic Asakusa & Bullet Train', details: 'Visit Tokyo\'s oldest temple, Senso-ji, in the morning. Savor fresh sushi at Tsukiji outer market, then board the Shinkansen (bullet train) to Kyoto.' },
      { day: 3, title: 'Arashiyama Bamboo Forest & Tea Ceremony', details: 'Watch the sunrise filter through Arashiyama bamboo forest. Tour Kinkaku-ji (Golden Pavilion), and experience a private tea ceremony in the historic Gion district.' }
    ]
  },
  {
    id: 'pkg-2',
    title: 'Amalfi Coast Dreamer',
    country: 'Italy',
    rating: 4.8,
    reviewsCount: 950,
    likes: 630,
    budget: 180000,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800',
    description: 'Savor the legendary Positano cliffsides, sail through the crystalline waters of Capri, and wander through historic lemon orchards along the Mediterranean.',
    itinerary: [
      { day: 1, title: 'Naples to Positano villa', details: 'Private luxury transfer from Naples airport to Positano. Enjoy welcome cocktails and a romantic candlelit dinner overlooking the Mediterranean.' },
      { day: 2, title: 'Capri Island & Blue Grotto Cruise', details: 'Board a private yacht to Capri. Swim through the glowing blue grotto, shop in Capri village, and taste artisanal lemon gelato.' },
      { day: 3, title: 'Path of the Gods Hike & Amalfi Town', details: 'Walk the breathtaking Sentiero degli Dei trail for bird-eye coastal views. Discover Ravello and Amalfi cathedral in the afternoon.' }
    ]
  },
  {
    id: 'pkg-3',
    title: 'Santorini Sunset Caldera',
    country: 'Greece',
    rating: 4.9,
    reviewsCount: 1120,
    likes: 790,
    budget: 165000,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800',
    description: 'Relax among the iconic blue-domed churches and whitewashed caldera cliffs. Experience Greece\'s finest sunsets, sailing, and fresh seafood.',
    itinerary: [
      { day: 1, title: 'Arrive in Santorini, cave suite', details: 'Transfer to a premium cave suite in Oia with a private heated caldera-view pool. Settle in and enjoy sunset champagne.' },
      { day: 2, title: 'Volcanic Catamaran Cruise', details: 'Board a luxury catamaran cruise. Swim in the volcanic hot springs, snorkel off Red Beach, and enjoy an onboard Greek BBQ feast at sunset.' },
      { day: 3, title: 'Volcanic Wine Tasting & Oia Castle', details: 'Take a sommelier tour of volcanic vineyards. Climb Oia Castle in the evening to witness the world-famous sunset.' }
    ]
  },
  {
    id: 'pkg-4',
    title: 'Icelandic Ring Road Aurora',
    country: 'Iceland',
    rating: 4.7,
    reviewsCount: 840,
    likes: 510,
    budget: 210000,
    image: 'https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?q=80&w=800',
    description: 'Journey through massive roaring waterfalls, alien-like black sand beaches, sub-glacial ice caves, and chase the brilliant celestial Northern Lights.',
    itinerary: [
      { day: 1, title: 'Blue Lagoon Spa & Reykjavik', details: 'Settle in Keflavik, soak in the geothermal Blue Lagoon, and tour downtown Reykjavik\'s innovative food scene.' },
      { day: 2, title: 'Golden Circle Wonders', details: 'See Thingvellir national park, geysir geothermal area, and watch the roaring double-tier Gullfoss waterfall plunge into the canyon.' },
      { day: 3, title: 'Vik Black Sand Beach & Aurora Chase', details: 'Wander along Reynisfjara black sand beach, marvel at basal rock columns, and join an expert guide to hunt the magical Northern Lights.' }
    ]
  }
];

/* ════════════════════════════════════════════
   MAIN LANDING PAGE
   ════════════════════════════════════════════ */
export default function Landing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useContext(AuthContext);

  // Carousel state
  const [activeBgIndex, setActiveBgIndex] = useState(0);

  // Popular Travel Packages States & Cloning logic
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isCloning, setIsCloning] = useState(false);
  const [pendingPackage, setPendingPackage] = useState(null);

  const backgrounds = [
    { url: '/kyoto.png', location: 'Arashiyama Bamboo Path', country: 'Kyoto, Japan' },
    { url: '/amalfi.png', location: 'Positano Cliffside', country: 'Amalfi Coast, Italy' },
    { url: '/iceland.png', location: 'Seljalandsfoss Waterfall', country: 'Iceland' },
    { url: '/santorini.png', location: 'Oia Blue Dome', country: 'Santorini, Greece' },
  ];

  useEffect(() => {
    if (!loading && user) {
      if (pendingPackage) {
        return;
      }
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location, pendingPackage]);

  // Auto-advance background carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [backgrounds.length]);


  const handleClonePackage = async (pkg, customToken = null) => {
    setIsCloning(true);
    const token = customToken || localStorage.getItem('token');
    if (!token) {
      alert('Authentication required to plan this journey.');
      setIsCloning(false);
      return;
    }
    try {
      const start = new Date();
      start.setDate(start.getDate() + 1);
      const end = new Date();
      end.setDate(end.getDate() + 3);

      const tripResponse = await fetch('http://localhost:5001/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          destination: `${pkg.title}, ${pkg.country}`,
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0],
          budget: pkg.budget,
          transportMode: 'flight',
          travelerCount: 1,
          coverImage: pkg.image,
          stops: [pkg.title]
        })
      });

      if (tripResponse.ok) {
        const savedTrip = await tripResponse.json();

        // Create the itinerary items in sequential order
        for (const dayPlan of pkg.itinerary) {
          await fetch(`http://localhost:5001/api/activities`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              tripId: savedTrip._id,
              day: dayPlan.day,
              name: dayPlan.title,
              description: dayPlan.details,
              startTime: '09:00',
              duration: 'Flexible',
              cost: Math.floor(pkg.budget * 0.1),
              type: 'explore'
            })
          });
        }

        setSelectedPackage(null);
        setPendingPackage(null);
        alert(`🎉 Expedition "${pkg.title}" cloned successfully! Directing you to your new trip itinerary...`);
        navigate(`/trips/${savedTrip._id}/itinerary`);
      } else {
        alert('Failed to clone expedition. Please make sure you are logged in.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to clone expedition. Please try again.');
    } finally {
      setIsCloning(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    let result;
    if (authModal.view === 'login') {
      result = await login(email, password);
    } else {
      if (!name) {
        setError('Name is required for registration');
        setIsSubmitting(false);
        return;
      }
      result = await register(name, email, password);
    }

    if (result.success) {
      closeModal();
      if (pendingPackage) {
        const token = localStorage.getItem('token');
        await handleClonePackage(pendingPackage, token);
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message || 'Authentication failed');
      setIsSubmitting(false);
    }
  };

  // Features data for the feature cards section
  const features = [
    { icon: '🗺️', title: 'AI-Powered Routes', desc: 'Smart itineraries crafted by our AI engine, tailored to your travel style.' },
    { icon: '💰', title: 'Budget Tracking', desc: 'Real-time budget allocation and spending breakdowns across categories.' },
    { icon: '🎒', title: 'Smart Packing', desc: 'Weather-aware packing checklists that adapt to your destination.' },
    { icon: '🤝', title: 'Trip Sharing', desc: 'Collaborate with travel companions in real-time with shared access.' },
  ];

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden font-sans text-slate-100 bg-[#080C14] antialiased select-none">

      {/* ═══════ NAVBAR (Transparent & Blurred) ═══════ */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#080C14]/40 backdrop-blur-md border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8">

          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
              <Compass className="h-5.5 w-5.5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white font-display">
              Route<span className="text-blue-400">Mind</span>
            </span>
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 font-bold text-[11px] uppercase tracking-widest text-white hover:text-white transition-colors bg-transparent border border-white/10 hover:border-white/30 rounded-full backdrop-blur-sm"
            >
              Sign In
            </button>
          </div>

        </div>
      </header>

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative z-0 min-h-screen lg:h-screen w-full flex items-center justify-center overflow-hidden py-24 lg:py-0">

        {/* Background Carousel */}
        <div className="absolute inset-0 -z-20 bg-slate-950">
          {backgrounds.map((bg, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-[1200ms] ease-in-out ${
                idx === activeBgIndex ? 'opacity-75 scale-100' : 'opacity-0 scale-105'
              }`}
              style={{
                backgroundImage: `url(${bg.url})`,
              }}
            />
          ))}
        </div>

        {/* Simple dark overlay */}
        <div className="absolute inset-0 bg-[#080C14]/40 -z-10" />

        {/* ═══════ HERO CONTENT ═══════ */}
        <main className="relative z-10 mx-auto max-w-3xl px-6 flex flex-col items-center justify-center w-full text-center">

          <div className="relative w-full bg-zinc-900/60 backdrop-blur-xl border border-white/5 px-8 py-14 md:p-16 rounded-[40px] shadow-2xl space-y-8 overflow-hidden">
            {/* Badge */}
            <div className="relative z-20">
              <div className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-600/10 border border-blue-500/20 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300 shadow-sm backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-blue-300" />
                AI-Powered Travel Planning
              </div>
            </div>

            {/* Headline with gradient accent */}
            <div className="relative z-20">
              <h1 className="text-4xl md:text-[3.4rem] font-extrabold tracking-tight text-white leading-[1.1] font-display">
                Your Perfect Trip,<br />
                <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 bg-clip-text text-transparent">
                  Effortlessly Planned.
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <div className="relative z-20">
              <p className="mx-auto max-w-lg text-sm md:text-base text-slate-300/80 leading-relaxed font-medium">
                Consolidated itineraries, collaborative budgets, and packing lists in a unified screen. RouteMind does the heavy lifting so you can explore.
              </p>
            </div>

          </div>

        </main>

        {/* ═══════ BOTTOM: FEATURED DESTINATION ═══════ */}
        <div className="absolute bottom-8 left-6 md:left-12 z-40 text-left select-none text-white hidden sm:block">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-3.5 w-3.5 text-blue-400" />
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-blue-400/80">Featured Destination</p>
          </div>
          <h4 className="text-lg md:text-xl font-extrabold tracking-tight font-display">{backgrounds[activeBgIndex].location}</h4>
          <p className="text-[10px] font-semibold text-white/50 tracking-wider uppercase mt-0.5">{backgrounds[activeBgIndex].country}</p>
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex gap-2.5 select-none">
          {backgrounds.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveBgIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === activeBgIndex ? 'w-10 bg-gradient-to-r from-blue-400 to-blue-500 shadow-sm shadow-blue-400/40' : 'w-2.5 bg-white/25 hover:bg-white/45'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ═══════════ STATS RIBBON ═══════════ */}
      <section className="relative z-20 -mt-16 mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { value: '12,000+', label: 'Happy Travelers', color: 'from-blue-500 to-blue-600' },
            { value: '150+', label: 'Destinations', color: 'from-blue-400 to-blue-500' },
            { value: '98%', label: 'Satisfaction Rate', color: 'from-blue-500 to-blue-600' },
            { value: '50K+', label: 'Trips Planned', color: 'from-blue-400 to-blue-500' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-zinc-900/90 rounded-2xl p-5 text-center shadow-lg border border-white/5 hover:border-blue-500/20 transition-all cursor-default"
            >
              <h3 className={`text-2xl md:text-3xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent font-display`}>
                {stat.value}
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ FEATURES SECTION ═══════════ */}
      <section className="relative bg-[#080C14] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-400 border border-blue-500/20 mb-4">
              <Sparkles className="h-3 w-3" /> Why RouteMind
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight">
              Everything You Need for the
              <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent"> Perfect Journey</span>
            </h2>
            <p className="text-slate-400 text-sm mt-3 max-w-lg mx-auto">Powerful tools designed to make travel planning effortless, enjoyable, and intelligent.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <div
                key={i}
                className="relative bg-zinc-900/60 rounded-2xl p-7 border border-white/5 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all group cursor-default overflow-hidden"
              >
                <div className="text-4xl mb-4 inline-block">
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-white font-display mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* ═══════════ MOST LIKED LUXURY PACKAGES ═══════════ */}
      <section className="relative bg-[#080C14] pb-24 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-400 border border-blue-500/20 mb-4">
              <Sparkles className="h-3 w-3" /> Exclusive Trips
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white font-display">
              Most Liked Luxury Packages
            </h2>
            <p className="text-slate-400 text-xs font-medium mt-2">Trending bespoke collections from our global community.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularPackages.map(pkg => {
              const countryKey = pkg.country.toLowerCase();
              const cDetails = countryData[countryKey] || {};
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className="clay-surface rounded-[24px] overflow-hidden group cursor-pointer hover:border-blue-500/20 transition-all duration-300 bg-zinc-900/60"
                >
                  {/* Image */}
                  <div className="h-44 overflow-hidden relative bg-zinc-950">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={pkg.image}
                      alt={pkg.title}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Heart Badge */}
                    <div className="absolute top-4 left-4 bg-zinc-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-300 shadow-sm flex items-center gap-1">
                      <span>❤️</span> <span>{pkg.likes}</span>
                    </div>

                    {/* Flag */}
                    <div className="absolute bottom-3 right-4">
                      {cDetails.iso ? (
                        <img
                          src={`https://flagcdn.com/w40/${cDetails.iso}.png`}
                          alt={pkg.country}
                          className="w-6 h-4 object-cover rounded shadow-md border border-white/10"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <span className="text-lg filter drop-shadow">{cDetails.emoji || '🌍'}</span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <div className="space-y-1">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-blue-400">{pkg.country}</p>
                      <h4 className="text-sm font-bold text-slate-100 truncate font-display">{pkg.title}</h4>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500 font-bold">⭐</span>
                        <span className="font-bold text-slate-300">{pkg.rating}</span>
                        <span className="text-[9px] font-medium text-slate-500">({pkg.reviewsCount})</span>
                      </div>
                      <span className="font-extrabold text-blue-400 text-xs">₹{pkg.budget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA BAND ═══════════ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#0F2027] via-[#0F172A] to-[#0F2027] py-20 px-6 border-y border-white/5">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight mb-4">
            Ready to Plan Your
            <span className="bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent"> Next Adventure</span>?
          </h2>
          <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">Join thousands of travelers who trust RouteMind for intelligent, personalized trip planning.</p>

        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="bg-zinc-950 py-12 px-6 text-center border-t border-white/5">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
            <Compass className="h-4 w-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-white font-display">
            Route<span className="text-blue-400">Mind</span>
          </span>
        </div>
        <p className="text-slate-500 text-xs font-medium">© 2025 RouteMind. AI-Powered Travel Planning.</p>
        <div className="flex justify-center gap-6 mt-4 text-slate-400 text-[10px] font-semibold uppercase tracking-widest">
          <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
        </div>
      </footer>


      {/* ═══════════ PACKAGE DETAIL MODAL ═══════════ */}
      {selectedPackage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md select-none">
          <div className="bg-zinc-900 border border-white/10 rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col text-slate-200">

            {/* Modal Image */}
            <div className="h-56 relative shrink-0">
              <img
                src={selectedPackage.image}
                alt={selectedPackage.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent"></div>

              {/* Close */}
              <button
                onClick={() => setSelectedPackage(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm font-bold">close</span>
              </button>

              <div className="absolute bottom-5 left-6 right-6 flex justify-between items-end">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-white">
                      Most Liked Package
                    </span>
                    <span className="text-sm">
                      {(() => {
                        const cDetails = countryData[selectedPackage.country.toLowerCase()] || {};
                        return cDetails.iso ? (
                          <img
                            src={`https://flagcdn.com/w40/${cDetails.iso}.png`}
                            alt={selectedPackage.country}
                            className="w-5 h-3.5 object-cover rounded border border-white/30"
                          />
                        ) : (
                          <span>{cDetails.emoji || '🌍'}</span>
                        );
                      })()}
                    </span>
                  </div>
                  <h3 className="text-white text-2xl font-extrabold font-display leading-tight">{selectedPackage.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Package Budget</span>
                  <p className="text-white text-xl font-extrabold">₹{selectedPackage.budget.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">About Destination</p>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  {selectedPackage.description}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 py-3 bg-zinc-950 border border-white/5 rounded-2xl shrink-0">
                <div className="text-center border-r border-white/5">
                  <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider block">Rating</span>
                  <span className="font-bold text-slate-300 text-xs block mt-0.5">⭐ {selectedPackage.rating} ({selectedPackage.reviewsCount})</span>
                </div>
                <div className="text-center border-r border-white/5">
                  <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider block">Likes</span>
                  <span className="font-bold text-slate-300 text-xs block mt-0.5">❤️ {selectedPackage.likes} travelers</span>
                </div>
                <div className="text-center">
                  <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider block">Duration</span>
                  <span className="font-bold text-slate-300 text-xs block mt-0.5">3 Days Expedition</span>
                </div>
              </div>

              {/* Itinerary Timeline */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Bespoke Daily Itinerary</p>
                <div className="space-y-4 relative pl-3.5 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
                  {selectedPackage.itinerary.map(dayPlan => (
                    <div key={dayPlan.day} className="relative space-y-1">
                      <span className="absolute -left-[19.5px] top-1 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 border-2 border-zinc-900 ring-4 ring-blue-500/5"></span>
                      <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Day {dayPlan.day} — {dayPlan.title}
                      </h5>
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed font-sans">
                        {dayPlan.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-white/5 bg-zinc-950 flex gap-4 shrink-0">
              <button
                onClick={() => setSelectedPackage(null)}
                className="clay-button-secondary py-3 flex-1 rounded-2xl text-[10px]"
              >
                Close Window
              </button>
              <button
                disabled={isCloning}
                onClick={async () => {
                  if (user) {
                    await handleClonePackage(selectedPackage);
                  } else {
                    localStorage.setItem('pendingPackage', JSON.stringify(selectedPackage));
                    navigate('/login');
                  }
                }}
                className="clay-button-primary py-3 flex-[1.5] rounded-2xl text-[10px]"
              >
                {isCloning ? 'Generating Expedition...' : (user ? 'Plan This Journey' : 'Login to Plan Trip')}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
