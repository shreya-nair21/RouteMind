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
  ArrowRight
} from 'lucide-react';

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

  // Carousel background state
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

  // Automatic background transition
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

  return (
    <div className="relative h-screen w-screen overflow-hidden font-sans text-white antialiased select-none">

      {/* --- BACKGROUND CAROUSEL WALLPAPER --- */}
      <div className="absolute inset-0 -z-20 bg-slate-950">
        {backgrounds.map((bg, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-[1500ms] ease-in-out ${idx === activeBgIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.04]'
              }`}
            style={{
              backgroundImage: `url(${bg.url})`,
              transitionProperty: 'opacity, transform'
            }}
          />
        ))}
      </div>

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/60 -z-10" />

      {/* --- STANDARD-WIDTH SOLID BLACK NAVBAR --- */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-black border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white shadow-md transition-all duration-300 group-hover:rotate-12">
              <Compass className="h-5.5 w-5.5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-white font-display">
              Route<span className="text-white font-extrabold">Mind</span>
            </span>
          </div>

          {/* Simple Nav buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => openModal('login')} 
              className="px-3.5 py-1.5 font-extrabold text-[10px] uppercase tracking-widest text-white hover:text-slate-300 transition-colors bg-transparent border-none"
            >
              Sign In
            </button>
            <button 
              onClick={() => openModal('signup')} 
              className="bg-white hover:bg-slate-200 text-black font-extrabold text-[10px] uppercase tracking-widest rounded-full px-5 py-2.5 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
            >
              Get Started
            </button>
          </div>

        </div>
      </header>

      {/* --- CENTERED MINIMAL CONTENT CANVAS --- */}
      <main className="relative z-10 mx-auto max-w-2xl px-6 flex flex-col items-center justify-center h-full text-center">

        {/* Central Glassmorphic Card Container */}
        <div className="w-full bg-black/25 backdrop-blur-md border border-white/10 px-8 py-12 md:p-14 rounded-[36px] shadow-2xl space-y-8 animate-fade-in relative overflow-hidden">
          {/* Glossy light effect */}
          <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine pointer-events-none" />

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-300 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-slate-350 filled animate-pulse" /> Next-Gen AI Travel Canvas
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight font-display">
              Your Perfect Trip, <br />
              <span className="text-slate-300 font-extrabold italic">Effortlessly Planned.</span>
            </h1>
            <p className="mx-auto max-w-lg text-xs md:text-sm text-slate-300/90 leading-relaxed font-semibold">
              Consolidated itineraries, collaborative budgets, and packing lists in a unified screen. RouteMind does the heavy lifting so you can explore.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <button
              onClick={() => openModal('signup')}
              className="group flex items-center gap-2.5 rounded-full bg-white hover:bg-slate-100 px-8 py-4 font-bold text-slate-950 shadow-xl hover:scale-[1.03] active:scale-[0.97] transition-all w-full sm:w-auto justify-center uppercase tracking-widest text-[10px]"
            >
              Get Started Free <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <span
              onClick={() => openModal('login')}
              className="text-[10px] font-extrabold text-slate-400 hover:text-white uppercase tracking-wider cursor-pointer transition-colors"
            >
              Already have an account? Sign In
            </span>
          </div>

        </div>

      </main>

      {/* --- FEATURED LOCATION MAGAZINE TAG (BOTTOM LEFT) --- */}
      <div className="absolute bottom-8 left-6 md:left-12 z-40 text-left select-none text-white animate-fade-in hidden sm:block">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Featured Destination</p>
        <h4 className="text-lg md:text-xl font-black italic tracking-tight font-display">{backgrounds[activeBgIndex].location}</h4>
        <p className="text-[10px] font-bold text-slate-350 tracking-wider uppercase mt-0.5">{backgrounds[activeBgIndex].country}</p>
      </div>

      {/* --- CAROUSEL DOTS NAVIGATION (BOTTOM CENTER) --- */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex gap-2.5 select-none">
        {backgrounds.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveBgIndex(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${idx === activeBgIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/35 hover:bg-white/55'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* --- AUTH MODAL (LOGIN & SIGNUP) --- */}
      {authModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-fade-in">
          {/* Main Card */}
          <div className="relative w-full max-w-sm overflow-hidden rounded-[28px] bg-slate-900 border border-slate-800 p-8 shadow-2xl select-none">

            {/* Close Button */}
            <button onClick={closeModal} className="absolute top-4 right-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-all bg-transparent border-none">
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-white shadow-md mb-3">
                <Compass className="h-6 w-6 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-white font-display">
                {authModal.view === 'login' ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="text-xs font-semibold text-slate-450 uppercase tracking-wider mt-1">
                {authModal.view === 'login' ? 'Your next adventure is waiting.' : 'Start planning your dream trip.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
              {authModal.view === 'signup' && (
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450 mb-1.5 pl-3">Full Name</label>
                  <div className="relative">
                    <User className="absolute top-3.5 left-4.5 h-4 w-4 text-slate-450" />
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full py-3 pl-12 pr-4 bg-slate-950/70 border border-slate-800 rounded-full text-xs font-semibold text-white outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450 mb-1.5 pl-3">Email Address</label>
                <div className="relative">
                  <Mail className="absolute top-3.5 left-4.5 h-4.5 w-4.5 text-slate-450" />
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full py-3 pl-12 pr-4 bg-slate-950/70 border border-slate-800 rounded-full text-xs font-semibold text-white outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5 pl-3 pr-2">
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-450">Password</label>
                  {authModal.view === 'login' && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white hover:underline bg-transparent cursor-pointer">Forgot?</span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute top-3.5 left-4.5 h-4.5 w-4.5 text-slate-450" />
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full py-3 pl-12 pr-4 bg-slate-950/70 border border-slate-800 rounded-full text-xs font-semibold text-white outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Error messages */}
              {error && (
                <div className="p-3 bg-red-950/30 text-red-400 border border-red-900/50 rounded-2xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 mt-4 bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-[10px] uppercase tracking-widest rounded-full shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all border-none"
              >
                {isSubmitting ? 'Authenticating...' : (authModal.view === 'login' ? 'Sign In' : 'Create Free Account')}
              </button>
            </form>

            {/* Footer switcher */}
            <div className="mt-6 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
              {authModal.view === 'login' ? (
                <>Don't have an account? <button onClick={() => openModal('signup')} className="font-extrabold text-white hover:underline ml-1 bg-transparent border-none">Sign Up</button></>
              ) : (
                <>Already have an account? <button onClick={() => openModal('login')} className="font-extrabold text-white hover:underline ml-1 bg-transparent border-none">Sign In</button></>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
