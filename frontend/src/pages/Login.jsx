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
    <div className="bg-background text-secondary min-h-screen relative overflow-x-hidden flex flex-col items-center justify-center py-12 px-6">
      {/* Decorative Minimal Accents */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-supporting/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-md">
        {/* Brand Identity */}
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-lg">flight_takeoff</span>
            </div>
            <h1 className="text-secondary text-2xl font-black tracking-tight uppercase italic leading-none">RouteMind</h1>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Cognitive Voyage Planning & Logistics</p>
        </div>
        
        {/* Auth Card Container */}
        <div className="w-full bg-surface border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col gap-6">
          <div className="space-y-2 text-center mb-2">
            <h2 className="text-2xl font-bold text-secondary">{isLogin ? 'Welcome Back' : 'Join the Elite'}</h2>
            <p className="text-slate-500 text-sm">
              {isLogin ? 'Sign in to continue your next journey' : 'Create your professional travel profile'}
            </p>
          </div>
          
          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-surface border border-slate-200 rounded-lg hover:bg-slate-50 transition-all active:scale-[0.98] group">
              <img alt="Google" className="w-4 h-4 opacity-80 group-hover:opacity-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxXkUhRX4szoxRmP9JvyqLlNfgVjrOmFDw2kvxpt44mBgoDCxDoEXGrArq_PgYXNZXOLDXo1xGyKCrN-LrqHc7RZEeUOaj-IPQDQlkzGV1aW5nUz4zf3B0SC8se2jiAFr66wFi-XSSCujoOtqd0N2RAebtWruWpTy2sOKg0dMtEDdTnQHtWs6-jWTpHp3xTm1HxMHzuIGiyyJSVpL7NTT7SnHCV6U3HHfv22SyIPjBgCZQwdkYszAchgd6ITcjLwGmBqjSZlLB8rXn"/>
              <span className="text-sm font-semibold text-secondary">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-surface border border-slate-200 rounded-lg hover:bg-slate-50 transition-all active:scale-[0.98] group">
              <span className="material-symbols-outlined text-lg text-secondary opacity-80 group-hover:opacity-100">ios</span>
              <span className="text-sm font-semibold text-secondary">Apple</span>
            </button>
          </div>
          
          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="h-[1px] flex-1 bg-slate-200"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">or email</span>
            <div className="h-[1px] flex-1 bg-slate-200"></div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-primary transition-colors">person</span>
                    <input 
                      required
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pro-input pl-10" 
                      placeholder="Enter your name" 
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-primary transition-colors">mail</span>
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pro-input pl-10" 
                    placeholder="explorer@routemind.com" 
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                  {isLogin && <a href="#" className="text-primary text-xs font-bold hover:underline">Forgot?</a>}
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-primary transition-colors">lock</span>
                  <input 
                    required
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pro-input pl-10" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold flex items-center gap-2">
                 <span className="material-symbols-outlined text-sm">error</span>
                 {error}
              </div>
            )}
            
            <div className="flex flex-col gap-4 mt-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary w-full py-3 text-xs uppercase tracking-wider"
              >
                {isSubmitting ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Establish Profile')}
              </button>
              <p className="text-center text-xs text-slate-500">
                {isLogin ? "Don't have an account?" : "Already an elite member?"}{' '}
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary font-bold hover:underline ml-1"
                >
                  {isLogin ? 'Create Account' : 'Sign In'}
                </button>
              </p>
            </div>
          </form>
        </div>
        
        {/* Footer / Support links */}
        <div className="mt-12 flex gap-6 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
          <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
          <span className="opacity-30">•</span>
          <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
          <span className="opacity-30">•</span>
          <a href="#" className="hover:text-secondary transition-colors">Support</a>
        </div>
      </main>

      {/* Decorative Illustration Element */}
      <div className="hidden xl:block fixed bottom-12 right-12 w-64 h-64">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-surface border border-slate-200 rounded-xl rotate-6 overflow-hidden shadow-sm">
            <img className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-300" alt="Alps" src="https://images.unsplash.com/photo-1531366936337-77cf5e084ce6?q=80&w=2070&auto=format&fit=crop"/>
            <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-md p-4 rounded-lg border border-slate-200">
              <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Featured Destination</p>
              <p className="text-lg font-bold text-secondary">Swiss Alps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
