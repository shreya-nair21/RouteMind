import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('123');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkPendingAndClone = async () => {
      if (!loading && user) {
        const pending = localStorage.getItem('pendingPackage');
        if (pending) {
          try {
            const pkg = JSON.parse(pending);
            localStorage.removeItem('pendingPackage'); // Clear immediately
            setIsSubmitting(true);
            
            const token = localStorage.getItem('token');
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
              navigate(`/trips/${savedTrip._id}/itinerary`, { replace: true });
              return;
            }
          } catch (err) {
            console.error(err);
          } finally {
            setIsSubmitting(false);
          }
        }
        
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    };
    checkPendingAndClone();
  }, [user, loading, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      if (!name) {
        setError('Name is required for registration');
        setIsSubmitting(false);
        return;
      }
      result = await register(name, email, password);
    }

    if (!result.success) {
      setError(result.message || 'Authentication failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#080C14] text-slate-100 overflow-x-hidden font-sans">
      {/* Left side: Immersive Scenic Brand Panel (Nature / Travel background) */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2074&auto=format&fit=crop')" 
        }}
      >
        {/* Dark overlay with gradients */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/60 to-transparent opacity-90 z-0" />
        <div className="absolute inset-0 bg-[#080C14]/30 backdrop-blur-[2px] z-0" />
        
        {/* Animated ambient glow circles in background */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Content wrapper */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
              <span className="material-symbols-outlined text-xl">flight_takeoff</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight font-display text-white">
                Route<span className="text-blue-500">Mind</span>
              </h1>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Voyage orchestrator</p>
            </div>
          </div>

          {/* Slogan and details */}
          <div className="space-y-6 max-w-lg my-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">explore</span> Explore the World
            </span>
            <h2 className="text-4xl font-extrabold leading-tight text-white font-display">
              Navigate your next journey with cognitive intelligence.
            </h2>
            <p className="text-slate-300 text-sm font-medium leading-relaxed font-sans">
              RouteMind seamlessly orchestrates your flight logs, packing lists, itineraries, and budgets with professional-grade logistics and elegant visuals.
            </p>
          </div>

          {/* Footer of Left Panel */}
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>© 2026 RouteMind Inc.</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">location_on</span> Majestic Alps & valleys
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Authentication Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 relative z-10">
        
        {/* Subtle grid pattern overlay for professional tech feel */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] pointer-events-none" />
        
        <main className="w-full max-w-md relative z-10 flex flex-col items-center">
          {/* Brand Identity - Visible only on mobile/tablet */}
          <div className="lg:hidden mb-8 text-center flex flex-col items-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <span className="material-symbols-outlined text-lg">flight_takeoff</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight font-display text-white">
                Route<span className="text-blue-500">Mind</span>
              </h1>
            </div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">Cognitive Voyage Planning & Logistics</p>
          </div>
          
          {/* Auth Card */}
          <div className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
            {/* Top gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500" />
            
            <div className="space-y-2 text-center mb-2">
              <h2 className="text-2xl font-bold text-white font-display">{isLogin ? 'Welcome Back' : 'Join the Elite'}</h2>
              <p className="text-slate-400 text-sm font-medium">
                {isLogin ? 'Sign in to continue your next journey' : 'Create your professional travel profile'}
              </p>
            </div>

            
            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-4">
                
                {!isLogin && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Full Name</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-lg group-focus-within:text-blue-500 transition-colors">person</span>
                      <input 
                        required
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pro-input !pl-11 bg-zinc-950 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500" 
                        placeholder="Enter your name" 
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Email Address</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-lg group-focus-within:text-blue-500 transition-colors">mail</span>
                    <input 
                      required
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pro-input !pl-11 bg-zinc-950 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500" 
                      placeholder="explorer@routemind.com" 
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                    {isLogin && <a href="#" className="text-blue-400 text-xs font-bold hover:underline">Forgot?</a>}
                  </div>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-lg group-focus-within:text-blue-500 transition-colors">lock</span>
                    <input 
                      required
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pro-input !pl-11 bg-zinc-950 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold flex items-center gap-2">
                   <span className="material-symbols-outlined text-sm">error</span>
                   {error}
                </div>
              )}
              
              <div className="flex flex-col gap-4 mt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-primary w-full py-3.5 text-xs uppercase tracking-wider rounded-xl relative overflow-hidden"
                >
                  <span className="relative z-10">{isSubmitting ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Establish Profile')}</span>
                </button>
                <p className="text-center text-xs text-slate-500 font-medium">
                  {isLogin ? "Don't have an account?" : "Already an elite member?"}{' '}
                  <button 
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-400 font-bold hover:underline ml-1 bg-transparent border-none cursor-pointer"
                  >
                    {isLogin ? 'Create Account' : 'Sign In'}
                  </button>
                </p>
              </div>
            </form>
          </div>
          
          {/* Footer links */}
          <div className="mt-12 flex gap-6 text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <span className="opacity-30">•</span>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <span className="opacity-30">•</span>
            <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;
