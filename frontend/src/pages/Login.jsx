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
    if (!loading && user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
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
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      {/* Left Side: Brand Imagery */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative items-center justify-center p-12">
        <div className="absolute inset-0 opacity-40">
           <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover"
            alt="Travel background"
           />
           <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
        </div>
        
        <div className="relative z-10 text-center space-y-8 animate-fade-in">
           <div className="w-20 h-20 rounded-3xl bg-blue-600 mx-auto flex items-center justify-center shadow-2xl shadow-blue-600/40">
              <span className="material-symbols-outlined text-white text-4xl filled">flight_takeoff</span>
           </div>
           <div>
              <h2 className="text-4xl font-black tracking-tighter text-white mb-4 italic">TRAVELOOP</h2>
              <p className="text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                Unlock the world's most sophisticated travel planning intelligence. Your journey begins here.
              </p>
           </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-20 bg-slate-50/50">
        <div className="w-full max-w-md space-y-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Join the Elite'}
            </h1>
            <p className="text-slate-500 font-medium italic">
              {isLogin ? 'Secure access to your global itineraries.' : 'Create your professional travel profile.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                   <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-blue-600 transition-colors">person</span>
                   <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pro-input pl-12 h-14 font-bold"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Access Email</label>
              <div className="relative group">
                 <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-blue-600 transition-colors">alternate_email</span>
                 <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pro-input pl-12 h-14 font-bold"
                  placeholder="admin@gmail.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security Code</label>
                {isLogin && <button type="button" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Forgot?</button>}
              </div>
              <div className="relative group">
                 <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-blue-600 transition-colors">lock</span>
                 <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pro-input pl-12 h-14 font-bold"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-fade-in">
                <span className="material-symbols-outlined text-xl">error</span>
                <p className="text-xs font-bold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary h-14 text-sm font-black uppercase tracking-widest shadow-2xl shadow-blue-600/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                isLogin ? 'Authenticate' : 'Establish Profile'
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-slate-400 font-medium text-sm">
              {isLogin ? "Don't have an elite account?" : "Already an elite member?"}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 font-bold hover:underline"
              >
                {isLogin ? 'Join Traveloop' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
