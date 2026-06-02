import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
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

/* ════════════════════════════════════════════
   MAIN LANDING PAGE
   ════════════════════════════════════════════ */
export default function Landing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, user, loading } = useContext(AuthContext);

  // Auth modal states
  const [authModal, setAuthModal] = useState({ isOpen: false, view: 'login' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carousel state
  const [activeBgIndex, setActiveBgIndex] = useState(0);

  const backgrounds = [
    { url: '/kyoto.png', location: 'Arashiyama Bamboo Path', country: 'Kyoto, Japan' },
    { url: '/amalfi.png', location: 'Positano Cliffside', country: 'Amalfi Coast, Italy' },
    { url: '/iceland.png', location: 'Seljalandsfoss Waterfall', country: 'Iceland' },
    { url: '/santorini.png', location: 'Oia Blue Dome', country: 'Santorini, Greece' },
  ];

  useEffect(() => {
    if (!loading && user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  // Auto-advance background carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [backgrounds.length]);

  const openModal = (view) => {
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setAuthModal({ isOpen: true, view });
  };

  const closeModal = () => {
    setAuthModal({ isOpen: false, view: 'login' });
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
      navigate('/dashboard');
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

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative h-screen w-full overflow-hidden">

        {/* Background Carousel */}
        <div className="absolute inset-0 -z-20 bg-slate-950">
          {backgrounds.map((bg, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-[1200ms] ease-in-out ${
                idx === activeBgIndex ? 'opacity-35 scale-100' : 'opacity-0 scale-105'
              }`}
              style={{
                backgroundImage: `url(${bg.url})`,
              }}
            />
          ))}
        </div>

        {/* Simple dark overlay */}
        <div className="absolute inset-0 bg-[#080C14]/80 -z-10" />

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
                onClick={() => openModal('login')}
                className="px-4 py-2 font-bold text-[11px] uppercase tracking-widest text-white/80 hover:text-white transition-colors bg-transparent border border-white/10 hover:border-white/30 rounded-full backdrop-blur-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => openModal('signup')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-95 text-white font-bold text-[11px] uppercase tracking-widest rounded-full px-6 py-2.5 transition-all shadow-lg shadow-blue-500/20"
              >
                Get Started
              </button>
            </div>

          </div>
        </header>

        {/* ═══════ HERO CONTENT ═══════ */}
        <main className="relative z-10 mx-auto max-w-3xl px-6 flex flex-col items-center justify-center h-full text-center pt-16">

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

            {/* CTA Buttons */}
            <div className="relative z-20 flex flex-col items-center justify-center gap-4">
              <button
                onClick={() => openModal('signup')}
                className="group relative overflow-hidden flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-95 px-10 py-4 font-bold text-white shadow-xl shadow-blue-900/30 hover:shadow-blue-500/30 active:scale-[0.97] transition-all w-full sm:w-auto justify-center uppercase tracking-widest text-[11px]"
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  Get Started Free
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                </span>
              </button>

              <span
                onClick={() => openModal('login')}
                className="text-[11px] font-semibold text-slate-400 hover:text-blue-300 uppercase tracking-wider cursor-pointer transition-colors"
              >
                Already have an account? <span className="underline underline-offset-2">Sign In</span>
              </span>
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

      {/* ═══════════ CTA BAND ═══════════ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#0F2027] via-[#0F172A] to-[#0F2027] py-20 px-6 border-y border-white/5">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight mb-4">
            Ready to Plan Your
            <span className="bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent"> Next Adventure</span>?
          </h2>
          <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">Join thousands of travelers who trust RouteMind for intelligent, personalized trip planning.</p>
          <button
            onClick={() => openModal('signup')}
            className="group relative overflow-hidden inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-95 px-10 py-4 font-bold text-white shadow-xl shadow-blue-900/40 active:scale-[0.97] transition-all uppercase tracking-widest text-[11px]"
          >
            <span className="relative z-10 flex items-center gap-2.5">
              Start Planning — It's Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
            </span>
          </button>
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

      {/* ═══════════ AUTH MODAL ═══════════ */}
      {authModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm overflow-hidden rounded-[32px] bg-zinc-900 border border-white/10 p-8 shadow-2xl select-none">
            
            {/* Close Button */}
            <button onClick={closeModal} className="absolute top-4 right-4 rounded-xl p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition-all bg-transparent border-none z-20">
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-8 relative z-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-900/30 mb-4">
                <Compass className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-white font-display">
                {authModal.view === 'login' ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="text-xs font-medium text-slate-400 mt-1.5">
                {authModal.view === 'login' ? 'Your next adventure is waiting.' : 'Start planning your dream trip.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4 text-left relative z-10">
              {authModal.view === 'signup' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 pl-3">Full Name</label>
                  <div className="relative">
                    <User className="absolute top-3.5 left-4.5 h-4 w-4 text-slate-500" />
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full py-3 pl-12 pr-4 bg-zinc-950 border border-white/10 rounded-2xl text-xs font-medium text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 pl-3">Email Address</label>
                <div className="relative">
                  <Mail className="absolute top-3.5 left-4.5 h-4.5 w-4.5 text-slate-500" />
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full py-3 pl-12 pr-4 bg-zinc-950 border border-white/10 rounded-2xl text-xs font-medium text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5 pl-3 pr-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Password</label>
                  {authModal.view === 'login' && (
                    <span className="text-[10px] font-semibold text-blue-400 hover:underline bg-transparent cursor-pointer">Forgot?</span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute top-3.5 left-4.5 h-4.5 w-4.5 text-slate-500" />
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full py-3 pl-12 pr-4 bg-zinc-950 border border-white/10 rounded-2xl text-xs font-medium text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 mt-4 relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-95 text-white font-bold text-[11px] uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-900/30 active:scale-[1.02] active:scale-[0.98] transition-all border-none"
              >
                <span>
                  {isSubmitting ? 'Authenticating...' : (authModal.view === 'login' ? 'Sign In' : 'Create Free Account')}
                </span>
              </button>
            </form>

            {/* Footer switcher */}
            <div className="mt-6 text-center text-xs font-medium text-slate-500 relative z-10">
              {authModal.view === 'login' ? (
                <>Don't have an account? <button onClick={() => openModal('signup')} className="font-bold text-blue-400 hover:underline ml-1 bg-transparent border-none">Sign Up</button></>
              ) : (
                <>Already have an account? <button onClick={() => openModal('login')} className="font-bold text-blue-400 hover:underline ml-1 bg-transparent border-none">Sign In</button></>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
