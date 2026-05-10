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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Stats */}
        <div className="lg:col-span-2 space-y-8">
           <div className="grid grid-cols-2 gap-8">
              <div className="pro-card p-10 bg-slate-900 text-white shadow-2xl">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 italic">Capital Deployed</p>
                 <h3 className="text-4xl font-black tracking-tighter italic">₹{totalSpent.toLocaleString()}</h3>
                 <div className="mt-8 flex items-center gap-2">
                    <div className="h-1 bg-white/10 flex-1 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (totalSpent / trip.budget) * 100)}%` }}></div>
                    </div>
                    <span className="text-[10px] font-black text-blue-400">{Math.round((totalSpent / trip.budget) * 100)}%</span>
                 </div>
              </div>
              <div className="pro-card p-10 bg-white shadow-xl">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 italic">Liquid Reserve</p>
                 <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic">₹{Math.max(0, remaining).toLocaleString()}</h3>
                 <div className="mt-8 flex items-center gap-2">
                    <span className={`material-symbols-outlined text-sm ${remaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                       {remaining >= 0 ? 'trending_up' : 'trending_down'}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       {remaining >= 0 ? 'Within Allocation' : 'Excess Detected'}
                    </span>
                 </div>
              </div>
           </div>

           {/* List of expenses */}
           <div className="pro-card p-10 bg-white shadow-xl">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-50">
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 italic">Allocation Ledger</h3>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activities.length} Line Items</span>
              </div>
              <div className="space-y-4">
                 {activities.map(act => (
                    <div key={act._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                             <span className="material-symbols-outlined text-sm">
                                {act.type === 'food' ? 'restaurant' : act.type === 'transport' ? 'flight' : 'explore'}
                             </span>
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-900">{act.name}</p>
                             <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Day {act.day}</p>
                          </div>
                       </div>
                       <p className="font-black text-slate-900 italic tracking-tighter">₹{act.cost?.toLocaleString()}</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Breakdown Visualization */}
        <div className="pro-card p-10 bg-white shadow-xl flex flex-col items-center">
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 italic mb-10 w-full text-left border-b border-slate-50 pb-4">Strategy breakdown</h3>
           <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36}/>
                 </PieChart>
              </ResponsiveContainer>
           </div>

           <div className="w-full mt-12 p-8 bg-slate-50 rounded-[32px] space-y-6">
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Group Specifics</p>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900 uppercase">Per Person Cost</span>
                    <span className="text-xl font-black text-blue-600 italic tracking-tighter">₹{Math.round(totalSpent / (trip.travelerCount || 1)).toLocaleString()}</span>
                 </div>
              </div>
              <div className="pt-6 border-t border-slate-200">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Transport Logistics</p>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900 uppercase">{trip.transportMode || 'Flight'} Protocol</span>
                    <span className="material-symbols-outlined text-slate-400">verified</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;
