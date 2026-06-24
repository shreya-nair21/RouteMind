import React, { useContext, useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AIChatDrawer from './AIChatDrawer';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { id } = useParams();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [tripDestination, setTripDestination] = useState('');

  useEffect(() => {
    if (!id) {
      setTripDestination('');
      return;
    }
    const fetchTrip = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/trips/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          const data = await response.json();
          setTripDestination(data.destination);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrip();
  }, [id]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-[1500px] flex min-h-screen relative border-x border-white/10">
        {/* Sidebar Navigation — Monochrome Glass Theme */}
        <aside className="w-64 p-6 flex flex-col gap-8 sticky top-0 h-screen z-30 hidden lg:flex bg-black border-r border-white/10 shadow-lg">
          {/* Brand */}
          <div className="flex items-center gap-2 px-2 mb-6 text-xl font-semibold tracking-tight text-white cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-2 h-2 rounded-full bg-white"/>
            <span>RouteMind</span>
          </div>
          
          <nav className="flex flex-col gap-1 flex-1">
            <SidebarLink to="/dashboard" icon="grid_view" label="Dashboard" />
            <SidebarLink to="/trips" icon="explore" label="My Trips" />
            <SidebarLink to="/create-trip" icon="add_circle" label="Plan Trip" />
            <SidebarLink to="/settings" icon="settings" label="Settings" />
            {user?.isAdmin && <SidebarLink to="/admin" icon="admin_panel_settings" label="Admin Panel" />}
          </nav>
          
          {/* User Profile */}
          <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/10 overflow-hidden ring-2 ring-white/5">
                 <img alt="User" src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Explorer'}`} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold truncate text-white">{user?.name || 'Explorer'}</p>
                <p className="text-[9px] font-semibold text-white/60 uppercase tracking-widest">Premium Member</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full py-2.5 text-xs font-semibold text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-red-500/20">
              <span className="material-symbols-outlined text-sm">logout</span>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Drawer Navigation */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Drawer Content */}
            <aside className="relative w-64 max-w-xs liquid-glass p-6 flex flex-col gap-8 h-full border-r border-white/10 shadow-2xl z-10 animate-fade-in">
              {/* Close Button & Brand */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-2 text-xl font-semibold tracking-tight text-white cursor-pointer" onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}>
                  <div className="w-2 h-2 rounded-full bg-white"/>
                  <span>RouteMind</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/65 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              
              <nav className="flex flex-col gap-1 flex-1">
                <SidebarLink to="/dashboard" icon="grid_view" label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
                <SidebarLink to="/trips" icon="explore" label="My Trips" onClick={() => setIsMobileMenuOpen(false)} />
                <SidebarLink to="/create-trip" icon="add_circle" label="Plan Trip" onClick={() => setIsMobileMenuOpen(false)} />
                <SidebarLink to="/settings" icon="settings" label="Settings" onClick={() => setIsMobileMenuOpen(false)} />
                {user?.isAdmin && <SidebarLink to="/admin" icon="admin_panel_settings" label="Admin Panel" onClick={() => setIsMobileMenuOpen(false)} />}
              </nav>
              
              {/* User Profile */}
              <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/10 overflow-hidden ring-2 ring-white/5">
                     <img alt="User" src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Explorer'}`} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold truncate text-white">{user?.name || 'Explorer'}</p>
                    <p className="text-[9px] font-semibold text-white/60 uppercase tracking-widest">Premium Member</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="w-full py-2.5 text-xs font-semibold text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-red-500/20">
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Sign Out
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header Bar — Semi-transparent Blurred */}
          <header className="sticky top-0 w-full z-40 bg-black/85 backdrop-blur-md border-b border-white/10 px-6 py-4 md:px-10 flex justify-between items-center">
            <div className="flex items-center gap-4 flex-1">
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden btn-ghost text-white">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 w-full max-w-sm group focus-within:border-white/30 focus-within:bg-white/10 transition-all duration-300">
                <span className="material-symbols-outlined text-white/60 text-sm group-focus-within:text-white transition-colors">search</span>
                <input className="bg-transparent border-none focus:ring-0 text-xs w-full outline-none font-medium text-white placeholder:text-white/50" placeholder="Search trips or cities..." type="text"/>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="btn-ghost relative group text-white">
                <span className="material-symbols-outlined text-white/70 group-hover:text-white transition-colors">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full ring-2 ring-black"></span>
              </button>
            </div>
          </header>

          {/* Dynamic Content */}
          <main className="p-6 md:p-10 w-full">
            {children || <Outlet />}
          </main>
        </div>

      {/* Floating AI Chat Assistant FAB */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 z-[99] w-14 h-14 rounded-full bg-white hover:bg-gray-250 text-black flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-none cursor-pointer"
        title="AI Travel Assistant"
      >
        <span className="material-symbols-outlined text-black text-2xl">auto_awesome</span>
      </button>

      {/* Smart Assistant Drawer */}
      <AIChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        tripId={id}
        destination={tripDestination}
      />
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `nav-link group ${isActive ? 'active' : ''}`
    }
  >
    <span className={`material-symbols-outlined ${icon === 'grid_view' ? '' : 'filled'} group-hover:scale-110 transition-transform duration-300`}>{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default Layout;
