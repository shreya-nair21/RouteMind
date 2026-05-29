import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Budget = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [tripRes, actRes] = await Promise.all([
          fetch(`http://localhost:5001/api/trips/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`http://localhost:5001/api/activities/trip/${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (tripRes.ok && actRes.ok) {
          const t = await tripRes.json();
          const a = await actRes.json();
          setTrip(t);
          setActivities(a);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading || !trip) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const totalSpent = activities.reduce((sum, act) => sum + (act.cost || 0), 0);
  const remaining = (trip.budget || 0) - totalSpent;

  // Breakdown by type
  const typeData = [
    { name: 'Activities', value: activities.filter(a => a.type === 'activity').reduce((s, a) => s + (a.cost || 0), 0) },
    { name: 'Dining', value: activities.filter(a => a.type === 'food').reduce((s, a) => s + (a.cost || 0), 0) },
    { name: 'Transport', value: activities.filter(a => a.type === 'transport').reduce((s, a) => s + (a.cost || 0), 0) },
    { name: 'Remaining', value: Math.max(0, remaining) }
  ].filter(d => d.value > 0);

  const COLORS = ['#0F172A', '#2563EB', '#64748B', '#F1F5F9'];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-12 pb-20">
      <div className="flex justify-between items-end border-b border-slate-200 pb-10">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Capital Allocation</p>
          <h1 className="text-5xl font-extrabold tracking-tighter text-slate-900 italic uppercase">Budget Analytics</h1>
        </div>
        <div className="text-right">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 italic">Total Allocation</p>
           <p className="text-3xl font-black text-slate-900 tracking-tighter italic">₹{(trip.budget || 0).toLocaleString()}</p>
        </div>
      </div>      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats */}
        <div className="lg:col-span-2 space-y-8">
           <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-tr from-primary to-[#FEB47B] text-white p-6 rounded-xl shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 italic">Capital Deployed</p>
                  <h3 className="text-3xl font-black tracking-tight">₹{totalSpent.toLocaleString()}</h3>
                  <div className="mt-6 flex items-center gap-2">
                     <div className="h-1 bg-white/10 flex-1 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (totalSpent / trip.budget) * 100)}%` }}></div>
                     </div>
                     <span className="text-[10px] font-bold text-primary">{Math.round((totalSpent / trip.budget) * 100)}%</span>
                  </div>
              </div>
              <div className="bg-surface border border-slate-200 p-6 rounded-xl shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 italic">Liquid Reserve</p>
                  <h3 className="text-3xl font-black text-secondary tracking-tight">₹{Math.max(0, remaining).toLocaleString()}</h3>
                  <div className="mt-6 flex items-center gap-2">
                     <span className={`material-symbols-outlined text-sm ${remaining >= 0 ? 'text-supporting' : 'text-red-500'}`}>
                        {remaining >= 0 ? 'trending_up' : 'trending_down'}
                     </span>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {remaining >= 0 ? 'Within Allocation' : 'Excess Detected'}
                     </span>
                  </div>
              </div>
           </div>

           {/* List of expenses */}
           <div className="bg-surface border border-slate-200 p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                 <h3 className="text-xs font-bold uppercase tracking-wider text-secondary">Allocation Ledger</h3>
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{activities.length} Line Items</span>
              </div>
              <div className="space-y-3">
                 {activities.map(act => (
                    <div key={act._id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg border border-slate-200/60 hover:border-slate-300 transition-all">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                             <span className="material-symbols-outlined text-sm">
                                {act.type === 'food' ? 'restaurant' : act.type === 'transport' ? 'flight' : 'explore'}
                             </span>
                          </div>
                          <div>
                             <p className="text-xs font-bold text-secondary">{act.name}</p>
                             <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Day {act.day}</p>
                          </div>
                       </div>
                       <p className="font-bold text-secondary tracking-tight">₹{act.cost?.toLocaleString()}</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Breakdown Visualization */}
        <div className="bg-surface border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col items-center">
           <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-6 w-full text-left border-b border-slate-100 pb-4">Strategy breakdown</h3>
           <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={typeData}
                       cx="50%"
                       cy="50%"
                       innerRadius={50}
                       outerRadius={70}
                       paddingAngle={5}
                       dataKey="value"
                    >
                       {typeData.map((entry, index) => {
                         let color = '#6366F1';
                         if (entry.name === 'Dining') color = '#10B981';
                         else if (entry.name === 'Transport') color = '#FF6B35';
                         else if (entry.name === 'Activities') color = '#FF4B72';
                         return <Cell key={`cell-${index}`} fill={color} />;
                       })}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                 </PieChart>
              </ResponsiveContainer>
           </div>

           <div className="w-full mt-8 p-5 bg-slate-50/50 border border-slate-200/60 rounded-lg space-y-4">
              <div>
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 italic">Group Specifics</p>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-secondary uppercase">Per Person Cost</span>
                    <span className="text-lg font-black text-primary tracking-tight">₹{Math.round(totalSpent / (trip.travelerCount || 1)).toLocaleString()}</span>
                 </div>
              </div>
              <div className="pt-4 border-t border-slate-200/60">
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 italic">Transport Logistics</p>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-secondary uppercase">{trip.transportMode || 'Flight'} Protocol</span>
                    <span className="material-symbols-outlined text-primary text-sm">verified</span>
                 </div>
              </div>
           </div>
        </div>
      </div>    </div>
  );
};

export default Budget;
