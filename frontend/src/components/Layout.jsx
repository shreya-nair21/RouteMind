import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-slate-100 p-6 flex flex-col gap-8 z-50 hidden lg:flex">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-md">flight_takeoff</span>
          </div>
          <h1 className="text-lg font-black tracking-tight text-secondary">RouteMind</h1>
        </div>
        
        <nav className="flex flex-col gap-1 flex-1">
          <SidebarLink to="/dashboard" icon="grid_view" label="Dashboard" />
          <SidebarLink to="/trips" icon="explore" label="My Trips" />
          <SidebarLink to="/create-trip" icon="add_circle" label="Plan Trip" />
          <SidebarLink to="/settings" icon="settings" label="Settings" />
          {user?.isAdmin && <SidebarLink to="/admin" icon="admin_panel_settings" label="Admin Panel" />}
        </nav>
        
        <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200/60 overflow-hidden">
               <img alt="User" src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Explorer'}`} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate text-secondary">{user?.name || 'Explorer'}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Premium Member</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Top Header Bar */}
        <header className="sticky top-0 w-full z-40 bg-surface/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 md:px-10 flex justify-between items-center">
          <div className="flex items-center gap-4 flex-1">
            <button className="lg:hidden btn-ghost">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200/50 w-full max-w-sm">
              <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-xs w-full outline-none font-medium" placeholder="Search trips or cities..." type="text"/>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="btn-ghost relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
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

const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `nav-link ${isActive ? 'active' : ''}`
    }
  >
    <span className={`material-symbols-outlined ${icon === 'grid_view' ? '' : 'filled'}`}>{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default Layout;

