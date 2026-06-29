import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { countryData } from '../utils/countryData';
import { Hero } from '../components/Hero';
import { Section, SectionHeading } from '../components';
import {
  Compass,
  Sparkles,
  MapPin,
  Star,
  Check,
  ChevronDown,
  ArrowRight,
  Globe,
  Plane,
  Heart,
} from 'lucide-react';

const popularPackages = [
  {
    id: 'pkg-1',
    title: 'Tokyo Futuristic Neon',
    country: 'Japan',
    rating: 4.9,
    reviewsCount: 1240,
    likes: 842,
    budget: 150000,
    match: '98%',
    season: 'Spring (April)',
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
    title: 'Icelandic Fire & Ice',
    country: 'Iceland',
    rating: 4.8,
    reviewsCount: 950,
    likes: 630,
    budget: 210000,
    match: '96%',
    season: 'Winter (Dec - Feb)',
    image: 'https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?q=80&w=800',
    description: 'Journey through massive roaring waterfalls, alien-like black sand beaches, sub-glacial ice caves, and chase the brilliant celestial Northern Lights.',
    itinerary: [
      { day: 1, title: 'Blue Lagoon Spa & Reykjavik', details: 'Settle in Keflavik, soak in the geothermal Blue Lagoon, and tour downtown Reykjavik\'s innovative food scene.' },
      { day: 2, title: 'Golden Circle Wonders', details: 'See Thingvellir national park, geysir geothermal area, and watch the roaring double-tier Gullfoss waterfall plunge into the canyon.' },
      { day: 3, title: 'Vik Black Sand Beach & Aurora Chase', details: 'Wander along Reynisfjara black sand beach, marvel at basal rock columns, and join an expert guide to hunt the magical Northern Lights.' }
    ]
  },
  {
    id: 'pkg-3',
    title: 'Swiss Alpine Luxury',
    country: 'Switzerland',
    rating: 4.9,
    reviewsCount: 880,
    likes: 710,
    budget: 250000,
    match: '95%',
    season: 'Summer (June - Aug)',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800',
    description: 'Experience breathtaking mountain peaks, pristine alpine lakes, luxury chalets, and scenic train journeys through the heart of the Swiss Alps.',
    itinerary: [
      { day: 1, title: 'Arrival in Zurich', details: 'Transfer to a lakeside boutique hotel in Zurich. Private dinner and evening walk along Bahnhofstrasse.' },
      { day: 2, title: 'Mount Titlis Cable Car', details: 'Ride the rotating Rotair cable car up Mount Titlis. Walk across the highest suspension bridge in Europe.' },
      { day: 3, title: 'Scenic Glacier Express', details: 'Board the world\'s slowest express train to Zermatt. Admire panoramic views of snow-capped mountains and pristine valleys.' }
    ]
  },
  {
    id: 'pkg-4',
    title: 'Bali Tropical Serenity',
    country: 'Bali',
    rating: 4.7,
    reviewsCount: 1120,
    likes: 790,
    budget: 95000,
    match: '92%',
    season: 'Dry Season (May - Sep)',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800',
    description: 'Unwind amidst lush terraced rice fields, spiritual temples, sandy shorelines, and premium wellness resorts in Indonesia\'s island paradise.',
    itinerary: [
      { day: 1, title: 'Ubud Culture Tour', details: 'Visit Ubud Sacred Monkey Forest and Tegallalang Rice Terraces. Enjoy a traditional Balinese spa ritual.' },
      { day: 2, title: 'Uluwatu Temple Sunset', details: 'Tour the clifftop Uluwatu Temple, watch the dramatic Kecak fire dance, and dine on fresh grilled seafood on Jimbaran Beach.' },
      { day: 3, title: 'Seminyak Beach Chill', details: 'Spend a relaxing day at a beach club in Seminyak, swimming and catching a famous Bali sunset.' }
    ]
  },
  {
    id: 'pkg-5',
    title: 'Norway Midnight Sun',
    country: 'Norway',
    rating: 4.9,
    reviewsCount: 650,
    likes: 540,
    budget: 230000,
    match: '94%',
    season: 'Summer (June - July)',
    image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=800',
    description: 'Cruise through deep dramatic fjords, climb majestic viewing platforms, and experience the magical constant glow of the Midnight Sun.',
    itinerary: [
      { day: 1, title: 'Oslo City Tour', details: 'Arrive in Oslo. Discover the modern opera house, Vigeland sculpture park, and dine on Nordic culinary creations.' },
      { day: 2, title: 'Flåm Railway Journey', details: 'Embark on one of the steepest train journeys in the world, passing roaring waterfalls and deep ravines down to Flåm.' },
      { day: 3, title: 'Bergen Wharf Exploration', details: 'Cruise through Nærøyfjord to Bergen. Walk through the historical Bryggen wooden wharf and visit the active fish market.' }
    ]
  },
  {
    id: 'pkg-6',
    title: 'Dubai Desert Oasis',
    country: 'Dubai',
    rating: 4.8,
    reviewsCount: 1040,
    likes: 810,
    budget: 180000,
    match: '90%',
    season: 'Winter (Nov - March)',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800',
    description: 'Witness sky-scraping architectures, gold and spice souks, luxury dune bashing, and premium artificial islands.',
    itinerary: [
      { day: 1, title: 'Burj Khalifa Observation', details: 'Arrive in Dubai. Ascend to the 148th floor of the Burj Khalifa for skyline views, followed by the Fountain Show.' },
      { day: 2, title: 'Desert Safari & Dinner', details: 'Cross red dunes in a luxury SUV. Experience camel riding, henna painting, and a traditional BBQ dinner under the stars.' },
      { day: 3, title: 'Dubai Mall & Marina', details: 'Explore Dubai Marina by private yacht, followed by boutique shopping at the expansive Dubai Mall.' }
    ]
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useContext(AuthContext);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isCloning, setIsCloning] = useState(false);
  const [pendingPackage, setPendingPackage] = useState(null);

  // Active Node for SVG Route Visualization
  const [activeNode, setActiveNode] = useState(0);

  // FAQ Accordion State
  const [faqOpen, setFaqOpen] = useState(Array(5).fill(false));

  const toggleFaq = (index) => {
    setFaqOpen(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  useEffect(() => {
    if (!loading && user) {
      if (pendingPackage) {
        return;
      }
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location, pendingPackage]);

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

  const travelStyles = [
    { name: 'Luxury', icon: '✨', desc: 'Bespoke suites, Michelin dining, and private transfers.' },
    { name: 'Adventure', icon: '🧗', desc: 'Glacier hikes, desert safaris, and raw exploration.' },
    { name: 'Backpacking', icon: '🎒', desc: 'Immersive paths, local secrets, and lightweight routes.' },
    { name: 'Family', icon: '👨‍👩‍👧‍👦', desc: 'Curated paces, kid-friendly wonders, and shared villas.' },
    { name: 'Business', icon: '💼', desc: 'Ergonomic lounges, city hubs, and time-optimized travel.' },
    { name: 'Solo', icon: '🚶', desc: 'Mindful journeys, self-paced discovery, and boutique stays.' }
  ];

  const faqs = [
    { q: 'How does the RouteMind AI generate itineraries?', a: 'RouteMind uses deep logistic graphs matched with real-time weather and crowd data via Gemini AI to craft optimal travel paths suited perfectly to your style, budget, and season.' },
    { q: 'Can I collaborate with my friends on a trip?', a: 'Absolutely. Every plan generates a public distribution link. Share the link with friends to let them view your packing list, budget sheet, and day-by-day logs.' },
    { q: 'Is the itinerary customizable after generation?', a: 'Yes. You can add, edit, or delete activities, drag events across days, adjust budgets, and ask the AI chat assistant to recommend shifts on the fly.' },
    { q: 'Does RouteMind handle currency and budgets?', a: 'Our budgeting tracker automatically records category allocations (Food, Stays, Transit, Exploring) and visualizes spending balances.' },
    { q: 'What is the "Liquid Glass" theme?', a: 'It is a premium visual framework consisting of black backdrops, heavy glass blurring, and white monochrome editorial layouts that elevate your digital experience.' }
  ];

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden font-sans text-white bg-black antialiased select-none">
      
      {/* ═══════════ HERO SECTION ═══════════ */}
      <Hero />

      {/* ═══════════ FEATURED DESTINATIONS ═══════════ */}
      <Section id="destinations">
        <SectionHeading 
          title="Bespoke destinations." 
          subtitle="Curated Collections" 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularPackages.map(pkg => {
            const countryKey = pkg.country.toLowerCase();
            const cDetails = countryData[countryKey] || {};
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg)}
                className="liquid-glass rounded-2xl overflow-hidden group cursor-pointer hover:border-white/20 transition-all duration-300 border border-white/5"
              >
                {/* Image Wrap */}
                <div className="h-[400px] relative overflow-hidden bg-zinc-950">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={pkg.image}
                    alt={pkg.title}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800'; }}
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  {/* Likes Badge */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/10 flex items-center gap-1.5">
                    <Heart className="h-3 w-3 text-white fill-white" /> <span>{pkg.likes}</span>
                  </div>

                  {/* Country Flag or Emoji */}
                  <div className="absolute top-4 right-4">
                    {cDetails.iso ? (
                      <img
                        src={`https://flagcdn.com/w40/${cDetails.iso}.png`}
                        alt={pkg.country}
                        className="w-6 h-4 object-cover rounded shadow-md border border-white/20"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <span className="text-xl filter drop-shadow">{cDetails.emoji || '🌍'}</span>
                    )}
                  </div>

                  {/* Card Content Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-1">{pkg.country}</span>
                    <h3 className="text-2xl font-normal text-white tracking-tight mb-4 font-sans">{pkg.title}</h3>
                    
                    <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-[10px] uppercase tracking-wider text-gray-400">
                      <div>
                        <span className="block text-[8px] text-gray-500">AI Match</span>
                        <span className="font-bold text-white text-xs">{pkg.match}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-gray-500">Best Season</span>
                        <span className="font-bold text-white text-xs truncate block">{pkg.season.split(' ')[0]}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[8px] text-gray-500">Budget Range</span>
                        <span className="font-bold text-white text-xs">₹{(pkg.budget / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ═══════════ HOW ROUTEMIND WORKS ═══════════ */}
      <Section id="how-it-works" className="bg-zinc-950/20">
        <SectionHeading 
          title="Effortless choreography." 
          subtitle="How It Works" 
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            { num: '01', title: 'Tell us where', desc: 'Input your desired destinations, ideal budgets, dates, and select the specific travel styles that define you.' },
            { num: '02', title: 'AI builds route', desc: 'Our cognitive engine crafts bespoke stop sequences, tracks optimal transport routes, and auto-allocates budgets.' },
            { num: '03', title: 'Book and travel', desc: 'Instantly view a timeline loaded with weather checkpoints, packing lists, shared logistics links, and maps.' }
          ].map((step) => (
            <div 
              key={step.num}
              className="liquid-glass rounded-2xl p-10 border border-white/5 flex flex-col justify-between min-h-[300px]"
            >
              <div className="text-5xl font-light text-white/20 tracking-tighter">{step.num}</div>
              <div>
                <h3 className="text-xl font-normal text-white mb-3">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════ AI PLANNER SHOWCASE (CENTERPIECE) ═══════════ */}
      <Section id="ai-planner">
        <SectionHeading 
          title="Cognitive planning in action." 
          subtitle="AI Planner Showcase" 
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Prompt Window */}
          <div className="lg:col-span-5 liquid-glass rounded-2xl p-8 border border-white/5 flex flex-col justify-between min-h-[400px]">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                <span className="text-[10px] text-gray-500 uppercase tracking-widest ml-2 font-mono">prompt_window.log</span>
              </div>
              <div className="space-y-4 font-mono text-sm">
                <p className="text-gray-500">&gt; initiate_planner_v2</p>
                <p className="text-white font-light">
                  <span className="text-gray-500">Query: </span> 
                  "Plan a 7-day Japan trip under ₹1.5L for April."
                </p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5 space-y-4 text-xs font-mono text-gray-400">
              <div className="flex justify-between">
                <span>Optimizer:</span>
                <span className="text-white">Active</span>
              </div>
              <div className="flex justify-between">
                <span>Logistic model:</span>
                <span className="text-white">Multi-stop network</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-400 animate-pulse">Finished in 0.8s</span>
              </div>
            </div>
          </div>

          {/* Right: Generated Itinerary */}
          <div className="lg:col-span-7 liquid-glass rounded-2xl p-8 border border-white/5 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs uppercase tracking-widest text-gray-400">Generated Itinerary Output</span>
              <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-full text-white uppercase tracking-widest border border-white/10">7 Days</span>
            </div>
            
            <div className="space-y-6 relative pl-4 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
              {[
                { day: 'Day 1: Tokyo Arrival', desc: 'Transfer from Haneda. Settle into a Shibuya luxury capsule suite. Twilight walk under crossing, followed by hidden bar exploration.' },
                { day: 'Day 2: Historic Asakusa', desc: 'Savor fresh sushi at Tsukiji. Visit Senso-ji temple, then board the high-speed Shinkansen to historic Kyoto.' },
                { day: 'Day 3: Arashiyama Groves', desc: 'Golden Hour walk in the Bamboo Forest. Traditional Gion tea ceremony, followed by Kinkaku-ji pavilion tour.' }
              ].map((item, idx) => (
                <div key={idx} className="relative group">
                  <span className="absolute -left-[20.5px] top-1.5 w-3 h-3 rounded-full bg-white border border-black" />
                  <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-1">{item.day}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-xs">
              <span className="text-gray-500 font-mono">Logs compiled successfully.</span>
              <span className="text-white font-bold">Estimated Cost: ₹1.45L</span>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════ AI ROUTE VISUALIZATION (TRAVEL GRAPH) ═══════════ */}
      <Section id="route-graph" className="bg-zinc-950/20">
        <SectionHeading 
          title="Visual log network." 
          subtitle="AI Route Visualization" 
        />
        <div className="liquid-glass rounded-2xl p-10 border border-white/5">
          <p className="text-xs text-gray-400 leading-relaxed max-w-xl mb-12 font-light">
            Every complex itinerary is computed as a logistics graph. Click the nodes below to explore stop details and optimized transit plans.
          </p>

          {/* SVG / Graph layout */}
          <div className="relative py-8 flex flex-col md:flex-row items-center justify-between gap-12 max-w-4xl mx-auto">
            {/* Horizontal connection line for larger screens */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] hidden md:block z-0 pointer-events-none px-8">
              <svg className="w-full h-[2px] overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Base path */}
                <line 
                  x1="0" y1="1" x2="100%" y2="1" 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeWidth="2" 
                />
                {/* Animated pulsing path up to active node */}
                <line 
                  x1="0" y1="1" x2={`${(activeNode / 3) * 100}%`} y2="1" 
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

            {/* Vertical connection line for mobile view */}
            <div className="absolute top-16 bottom-16 left-1/2 -translate-x-1/2 w-[2px] bg-white/5 md:hidden z-0 pointer-events-none" />
            <div 
              className="absolute top-16 left-1/2 -translate-x-1/2 w-[2px] bg-white/40 md:hidden z-0 pointer-events-none transition-all duration-500" 
              style={{ 
                height: activeNode === 0 ? '0%' : activeNode === 1 ? '30%' : activeNode === 2 ? '63%' : '90%' 
              }}
            />

            {[
              { code: 'BOM', city: 'Mumbai', time: 'Departure' },
              { code: 'DXB', city: 'Dubai', time: 'Layover 4h' },
              { code: 'IST', city: 'Istanbul', time: 'Stopover 1d' },
              { code: 'CDG', city: 'Paris', time: 'Destination' }
            ].map((node, index) => {
              const isActive = index <= activeNode;
              const isSelected = index === activeNode;
              return (
                <div 
                  key={node.code} 
                  onClick={() => setActiveNode(index)}
                  className="relative z-10 flex flex-col items-center group cursor-pointer"
                >
                  {/* Node Circle */}
                  <div 
                    className={`w-16 h-16 rounded-full bg-black border transition-all duration-500 flex items-center justify-center shadow-xl shadow-black select-none ${
                      isSelected 
                        ? 'border-white scale-110 ring-4 ring-white/10' 
                        : isActive 
                        ? 'border-white/60 hover:border-white' 
                        : 'border-white/10 group-hover:border-white/30'
                    }`}
                  >
                    <span 
                      className={`text-xs font-mono font-bold tracking-widest transition-colors duration-500 ${
                        isActive ? 'text-white' : 'text-white/40'
                      }`}
                    >
                      {node.code}
                    </span>
                  </div>
                  
                  <div className="text-center mt-4 space-y-1 select-none">
                    <p className={`text-sm transition-colors duration-500 ${isActive ? 'text-white font-medium' : 'text-white/40'}`}>
                      {node.city}
                    </p>
                    <p className={`text-[10px] font-mono uppercase tracking-wider transition-colors duration-500 ${isActive ? 'text-gray-400' : 'text-white/20'}`}>
                      {node.time}
                    </p>
                  </div>

                  {/* Arrow down for mobile view - spacer matching the visual height of elements */}
                  {index < 3 && (
                    <div className="md:hidden h-12 flex items-center text-white/5 font-bold text-lg select-none">
                      ↓
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active Node Detail Card */}
          <div 
            className="mt-12 max-w-2xl mx-auto liquid-glass rounded-2xl p-6 border border-white/10 animate-fade-in text-left transition-all duration-300"
            key={activeNode} // Force re-render for animation on change
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] bg-white text-black px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider">
                {activeNode === 0 ? 'Start' : activeNode === 3 ? 'End' : `Stop 0${activeNode}`}
              </span>
              <h4 className="text-sm font-semibold tracking-wider uppercase text-white">
                {[
                  'Chhatrapati Shivaji Maharaj Terminus & Sea Link (Mumbai)',
                  'Dubai International & Downtown Dunes (Dubai)',
                  'Bosphorus Cruise & Historic Sultanahmet (Istanbul)',
                  'Eiffel Tower Private Lounge & Seine Dinner (Paris)'
                ][activeNode]}
              </h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              {[
                'Starting point of your global expedition. Experience luxury airport lounge service, premium document clearance, and private chauffeur transfers to the terminal.',
                'First stopover. 4-hour transit in the Emirates First Class lounge. Optional skyline viewing or private dune safari depending on connection flight parameters.',
                '1-day stopover. Explore the historic Hagia Sophia, cruise down the majestic Bosphorus Strait at sunset, and dine in traditional rooftop terrace suites.',
                'Final destination. Settle into a boutique suite in the 8th Arrondissement. Guided gallery walkthroughs and private Seine river cruise dining.'
              ][activeNode]}
            </p>
          </div>
        </div>
      </Section>


      {/* ═══════════ TRAVEL STYLES ═══════════ */}
      <Section id="travel-styles">
        <SectionHeading 
          title="Calibrate your style." 
          subtitle="Travel Styles" 
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {travelStyles.map((style) => (
            <div
              key={style.name}
              className="liquid-glass rounded-2xl p-8 border border-white/5 hover:scale-[1.03] transition-all duration-300 flex items-start gap-5 cursor-default group"
            >
              <div className="text-3xl p-3 bg-white/5 rounded-xl border border-white/5 group-hover:bg-white/10 transition-colors">
                {style.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-normal text-white tracking-tight">{style.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light">{style.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <Section id="testimonials" className="bg-zinc-950/20">
        <SectionHeading 
          title="Endorsed by travelers." 
          subtitle="Testimonials" 
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { stars: 5, quote: "Planned my Europe trip in 30 seconds. The logical routing and budget tracker are absolutely flawless.", author: "Sarah Jenkins" },
            { stars: 5, quote: "The route graph visualization alone saved me hours. It feels like Apple built a luxury travel advisor.", author: "David Vance" },
            { stars: 5, quote: "Bespoke suggestions that Booking.com could never find. Highly recommend for custom expeditions.", author: "Elena Rostova" }
          ].map((test, idx) => (
            <div 
              key={idx}
              className="liquid-glass rounded-2xl p-8 border border-white/5 flex flex-col justify-between min-h-[200px] hover:translate-y-[-2px] transition-transform duration-300"
            >
              <div className="flex gap-1 text-white/80 mb-4">
                {Array.from({ length: test.stars }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-white text-white" />
                ))}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed font-light mb-6">"{test.quote}"</p>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">— {test.author}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════ PRICING ═══════════ */}
      <Section id="pricing">
        <SectionHeading 
          title="Transparent pricing." 
          subtitle="Pricing Matrix" 
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {[
            { plan: 'Explorer', price: 'Free', desc: 'Essential route layouts', features: ['3 Active Journeys', 'AI Route Generation', 'Smart Weather Logs', 'Public Share Links'] },
            { plan: 'Pro', price: '₹999', desc: 'Bespoke concierge logic', features: ['Unlimited Active Journeys', 'Priority AI Recommendations', 'Detailed Budget Allocation', 'Smart Packing adaptors', 'Offline Exports'], popular: true },
            { plan: 'Concierge', price: '₹4,999', desc: 'Elite travel management', features: ['All Pro features', 'Private Server allocations', 'Dedicated human verification', 'Instant luxury bookings support', 'Flight alert integrations'] }
          ].map((tier) => (
            <div
              key={tier.plan}
              style={tier.popular ? { transform: 'scale(1.04)', border: '1px solid rgba(255, 255, 255, 0.25)' } : {}}
              className="liquid-glass rounded-2xl p-8 flex flex-col justify-between border border-white/5 relative overflow-hidden"
            >
              {tier.popular && (
                <span className="absolute top-4 right-4 text-[8px] bg-white text-black px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                  Popular
                </span>
              )}
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-normal text-white mb-1">{tier.plan}</h3>
                  <p className="text-xs text-gray-500 font-light">{tier.desc}</p>
                </div>

                <div className="py-4 border-y border-white/5 flex items-baseline gap-1">
                  <span className="text-3xl font-normal text-white">{tier.price}</span>
                  {tier.price !== 'Free' && <span className="text-xs text-gray-500">/ trip</span>}
                </div>

                <ul className="space-y-3">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs text-gray-400 font-light">
                      <Check className="h-3 w-3 text-white shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => navigate(user ? '/dashboard' : '/login')}
                className={`w-full py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all mt-8 border ${
                  tier.popular
                    ? 'bg-white text-black border-transparent hover:bg-gray-150'
                    : 'bg-transparent text-white border-white/20 hover:bg-white hover:text-black'
                }`}
              >
                Choose {tier.plan}
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════ FAQ SECTION ═══════════ */}
      <Section id="faq" className="bg-zinc-950/20">
        <SectionHeading 
          title="Frequent queries." 
          subtitle="FAQ Matrix" 
        />
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="liquid-glass border border-white/5 rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left text-sm font-normal text-white hover:bg-white/5 transition-colors border-none bg-transparent cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${faqOpen[idx] ? 'rotate-180 text-white' : ''}`} />
              </button>
              {faqOpen[idx] && (
                <div className="px-6 pb-6 text-xs text-gray-400 leading-relaxed font-light border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="px-6 md:px-12 lg:px-16 py-16 text-center border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-xl font-semibold tracking-tight text-white">
            <div className="w-2 h-2 rounded-full bg-white"/>
            <span>RouteMind</span>
          </div>
          
          <div className="flex justify-center gap-8 text-[11px] font-normal uppercase tracking-wider text-gray-400">
            <a href="#destinations" className="hover:text-white transition-colors">Destinations</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Pricing</a>
            <a href="mailto:support@routemind.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        <p className="text-gray-650 text-[10px] tracking-wider mt-12 font-mono uppercase">
          © 2026 RouteMind Inc. AI-Powered Travel Planning.
        </p>
      </footer>

      {/* ═══════════ PACKAGE DETAIL MODAL ═══════════ */}
      {selectedPackage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md select-none">
          <div className="liquid-glass border border-white/15 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col text-white">

            {/* Modal Image */}
            <div className="h-56 relative shrink-0">
              <img
                src={selectedPackage.image}
                alt={selectedPackage.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

              {/* Close */}
              <button
                onClick={() => setSelectedPackage(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm font-bold">close</span>
              </button>

              <div className="absolute bottom-5 left-6 right-6 flex justify-between items-end">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="bg-white text-black px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest">
                      Curated Experience
                    </span>
                  </div>
                  <h3 className="text-white text-2xl font-normal font-sans leading-tight">{selectedPackage.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-450">Package Budget</span>
                  <p className="text-white text-xl font-bold">₹{selectedPackage.budget.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">About Destination</p>
                <p className="text-gray-300 text-xs leading-relaxed font-light">
                  {selectedPackage.description}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 py-3 bg-black/40 border border-white/10 rounded-2xl shrink-0">
                <div className="text-center border-r border-white/10">
                  <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider block">Rating</span>
                  <span className="font-bold text-white text-xs block mt-0.5">⭐ {selectedPackage.rating} ({selectedPackage.reviewsCount})</span>
                </div>
                <div className="text-center border-r border-white/10">
                  <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider block">Likes</span>
                  <span className="font-bold text-white text-xs block mt-0.5">❤️ {selectedPackage.likes} travelers</span>
                </div>
                <div className="text-center">
                  <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider block">Duration</span>
                  <span className="font-bold text-white text-xs block mt-0.5">3 Days Expedition</span>
                </div>
              </div>

              {/* Itinerary Timeline */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Bespoke Daily Itinerary</p>
                <div className="space-y-4 relative pl-3.5 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                  {selectedPackage.itinerary.map(dayPlan => (
                    <div key={dayPlan.day} className="relative space-y-1">
                      <span className="absolute -left-[19.5px] top-1 w-2.5 h-2.5 rounded-full bg-white border border-black"></span>
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                        Day {dayPlan.day} — {dayPlan.title}
                      </h5>
                      <p className="text-[11px] text-gray-400 font-light leading-relaxed font-sans">
                        {dayPlan.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-white/10 bg-black flex gap-4 shrink-0">
              <button
                onClick={() => setSelectedPackage(null)}
                className="py-3 flex-1 rounded-xl text-[10px] uppercase tracking-wider bg-transparent text-white border border-white/20 hover:bg-white hover:text-black transition-colors"
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
                className="py-3 flex-[1.5] rounded-xl text-[10px] uppercase tracking-wider bg-white text-black font-semibold hover:bg-gray-150 transition-colors"
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
