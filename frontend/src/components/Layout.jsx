import React, { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex">
      {/* Sidebar Navigation — Sleek dark theme */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 p-6 flex flex-col gap-8 z-50 hidden lg:flex bg-[#0B0F19] border-r border-white/5 shadow-2xl">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <span className="material-symbols-outlined text-md">flight_takeoff</span>
          </div>
          <h1 className="text-lg font-extrabold tracking-tight text-white font-display">
            Route<span className="text-blue-500">Mind</span>
          </h1>
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
            <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center border-2 border-blue-500/20 overflow-hidden ring-2 ring-blue-500/5">
               <img alt="User" src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Explorer'}`} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate text-slate-100">{user?.name || 'Explorer'}</p>
              <p className="text-[9px] font-semibold text-blue-500/60 uppercase tracking-widest">Premium Member</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-2.5 text-xs font-semibold text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex items-center justify-center gap-2 border border-transparent hover:border-red-500/20">
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
          <aside className="relative w-64 max-w-xs bg-[#0B0F19] p-6 flex flex-col gap-8 h-full border-r border-white/5 shadow-2xl z-10 animate-fade-in">
            {/* Close Button & Brand */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 px-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <span className="material-symbols-outlined text-md">flight_takeoff</span>
                </div>
                <h1 className="text-lg font-extrabold tracking-tight text-white font-display">
                  Route<span className="text-blue-500">Mind</span>
                </h1>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
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
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center border-2 border-blue-500/20 overflow-hidden ring-2 ring-blue-500/5">
                   <img alt="User" src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Explorer'}`} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold truncate text-slate-100">{user?.name || 'Explorer'}</p>
                  <p className="text-[9px] font-semibold text-blue-500/60 uppercase tracking-widest">Premium Member</p>
                </div>
              </div>
              <button onClick={handleLogout} className="w-full py-2.5 text-xs font-semibold text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex items-center justify-center gap-2 border border-transparent hover:border-red-500/20">
                <span className="material-symbols-outlined text-sm">logout</span>
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Top Header Bar — Semi-transparent Blurred */}
        <header className="sticky top-0 w-full z-40 bg-zinc-950/60 backdrop-blur-xl border-b border-white/5 px-6 py-4 md:px-10 flex justify-between items-center">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden btn-ghost">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex items-center gap-2 bg-zinc-900/60 px-4 py-2.5 rounded-xl border border-white/5 w-full max-w-sm group focus-within:border-blue-500/50 focus-within:bg-zinc-950 transition-all duration-300">
              <span className="material-symbols-outlined text-blue-500/60 text-sm group-focus-within:text-blue-500 transition-colors">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-xs w-full outline-none font-medium text-slate-200 placeholder:text-slate-500" placeholder="Search trips or cities..." type="text"/>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="btn-ghost relative group">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-500 transition-colors">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full ring-2 ring-zinc-950"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="p-6 md:p-10">
          {children || <Outlet />}
        </main>
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
