import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Unauthorized access');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/dashboard');
      return;
    }

    if (user?.isAdmin) {
      fetchStats();
      const interval = setInterval(fetchStats, 15000); // Poll every 15s for "real-time" feel
      return () => clearInterval(interval);
    }
  }, [user, navigate]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Scanning Network Stats...</p>
      </div>
    </div>
  );

  if (error || !stats) return (
    <div className="min-h-screen flex items-center justify-center bg-background text-red-500 font-bold text-sm">
      {error || 'Stats not available'}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-12 pb-20">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-white/10 pb-10">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Central Operations</p>
          <h1 className="text-4xl font-black text-secondary">Platform Analytics</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[9px] font-bold uppercase tracking-wider">Live Engine</span>
          </div>
          <button onClick={fetchStats} className="w-8 h-8 rounded bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-all">
            <span className="material-symbols-outlined text-sm">refresh</span>
          </button>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: 'group', color: 'primary' },
          { label: 'Active Trips', value: stats.totalTrips, icon: 'travel_explore', color: 'primary' },
          { label: 'Platform Capital', value: `₹${stats.totalBudget.toLocaleString()}`, icon: 'payments', color: 'primary' },
          { label: 'Avg Journey Budget', value: `₹${stats.avgBudget.toFixed(0)}`, icon: 'analytics', color: 'primary' }
        ].map((item, idx) => (
          <div key={idx} className="bg-surface border border-white/10 p-6 rounded-xl shadow-sm hover:translate-y-[-2px] transition-all duration-200">
            <div className="flex justify-between items-start mb-6">
              <span className={`material-symbols-outlined text-2xl text-primary`}>{item.icon}</span>
              <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Real-time</span>
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
            <h3 className="text-2xl font-black text-secondary tracking-tight">{item.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-surface border border-white/10 p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">Growth Trajectory</h3>
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary"></span><span className="text-[9px] font-bold text-slate-400">Users</span></div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span><span className="text-[9px] font-bold text-slate-400">Trips</span></div>
             </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.growth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 500, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 500, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', color: '#FFFFFF' }} />
                <Line type="monotone" dataKey="users" stroke="#FF6B35" strokeWidth={3} dot={{ r: 3, fill: '#FF6B35' }} />
                <Line type="monotone" dataKey="trips" stroke="#3B82F6" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 3, fill: '#3B82F6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transport Distribution */}
        <div className="bg-surface border border-white/10 p-6 rounded-xl shadow-sm flex flex-col justify-between">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-6">Logistics Breakdown</h3>
          <div className="flex-1 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.transportData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  {stats.transportData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#FF6B35', '#25A18E', '#64748B'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', color: '#FFFFFF' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Most Popular Mode</p>
             <p className="text-base font-bold text-secondary">
                {stats.transportData.length > 0 ? stats.transportData.reduce((prev, current) => (prev.value > current.value) ? prev : current).name : 'N/A'}
             </p>
          </div>
        </div>
      </div>

      {/* User Table (Simplified) */}
      <div className="bg-surface border border-white/10 text-white p-6 rounded-xl shadow-sm">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider">Platform Integrity</h3>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Audit Ready</span>
         </div>
         <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
               <span className="material-symbols-outlined text-primary">security</span>
               <div className="flex-1">
                  <p className="text-xs font-bold">Encrypted Data Stream</p>
                  <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">All transactions and itineraries are protected via AES-256</p>
               </div>
               <span className="text-[8px] font-bold text-green-400 uppercase tracking-widest">Active</span>
            </div>
         </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
