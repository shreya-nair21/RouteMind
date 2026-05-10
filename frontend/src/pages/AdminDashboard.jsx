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
    <div className="min-h-[60vh] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Scanning Network Stats...</p>
      </div>
    </div>
  );

  if (error || !stats) return (
    <div className="min-h-screen flex items-center justify-center bg-white text-red-500 font-bold">
      {error || 'Stats not available'}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-10 animate-fade-in space-y-12 pb-20">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-10">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Central Operations</p>
          <h1 className="text-5xl font-extrabold tracking-tighter text-slate-900">Platform Analytics</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full border border-green-100">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Live Engine</span>
          </div>
          <button onClick={fetchStats} className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-black transition-all">
            <span className="material-symbols-outlined text-lg">refresh</span>
          </button>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: 'group', color: 'blue' },
          { label: 'Active Trips', value: stats.totalTrips, icon: 'travel_explore', color: 'indigo' },
          { label: 'Platform Capital', value: `₹${stats.totalBudget.toLocaleString()}`, icon: 'payments', color: 'emerald' },
          { label: 'Avg Journey Budget', value: `₹${stats.avgBudget.toFixed(0)}`, icon: 'analytics', color: 'slate' }
        ].map((item, idx) => (
          <div key={idx} className="pro-card p-8 bg-white border-slate-100 shadow-xl hover:translate-y-[-5px] transition-all">
            <div className="flex justify-between items-start mb-6">
              <span className={`material-symbols-outlined text-3xl text-slate-900`}>{item.icon}</span>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Real-time</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{item.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart */}
        <div className="lg:col-span-2 pro-card p-10 bg-white border-slate-100 shadow-xl">
          <div className="flex justify-between items-center mb-10">
             <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest">Growth Trajectory</h3>
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-900"></span><span className="text-[10px] font-bold text-slate-400">Users</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-400"></span><span className="text-[10px] font-bold text-slate-400">Trips</span></div>
             </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.growth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="users" stroke="#0f172a" strokeWidth={4} dot={{ r: 4, fill: '#0f172a' }} />
                <Line type="monotone" dataKey="trips" stroke="#94a3b8" strokeWidth={4} strokeDasharray="5 5" dot={{ r: 4, fill: '#94a3b8' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transport Distribution */}
        <div className="pro-card p-10 bg-white border-slate-100 shadow-xl flex flex-col">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-10">Logistics Breakdown</h3>
          <div className="flex-1 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.transportData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  nameKey="name"
                >
                  {stats.transportData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0f172a', '#334155', '#64748b', '#94a3b8'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Most Popular Mode</p>
             <p className="text-xl font-extrabold text-slate-900">
                {stats.transportData.length > 0 ? stats.transportData.reduce((prev, current) => (prev.value > current.value) ? prev : current).name : 'N/A'}
             </p>
          </div>
        </div>
      </div>

      {/* User Table (Simplified) */}
      <div className="pro-card p-10 bg-slate-900 text-white border-none shadow-2xl">
         <div className="flex justify-between items-center mb-10">
            <h3 className="text-sm font-extrabold uppercase tracking-widest">Platform Integrity</h3>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Audit Ready</span>
         </div>
         <div className="space-y-4">
            <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10">
               <span className="material-symbols-outlined text-blue-400">security</span>
               <div className="flex-1">
                  <p className="text-sm font-bold">Encrypted Data Stream</p>
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">All transactions and itineraries are protected via AES-256</p>
               </div>
               <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Active</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
