import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-12 pb-20">
      <div className="flex justify-between items-end border-b border-slate-200 pb-10">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Member Authentication</p>
          <h1 className="text-5xl font-extrabold tracking-tighter text-slate-900 italic uppercase">Identity Profile</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
         <div className="pro-card p-10 bg-white shadow-xl flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-[40px] bg-slate-900 flex items-center justify-center border-8 border-slate-50 mb-8 overflow-hidden shadow-2xl">
               <img alt="User" src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Explorer'}`} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 italic uppercase mb-2">{user?.name}</h3>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest px-4 py-1.5 bg-blue-50 rounded-full">Elite Status</p>
            
            <div className="w-full mt-10 pt-10 border-t border-slate-50 flex flex-col gap-4">
               <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <span>Joined Sector</span>
                  <span className="text-slate-900">May 2026</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <span>Expeditions</span>
                  <span className="text-slate-900 italic">Verified</span>
               </div>
            </div>
         </div>

         <div className="md:col-span-2 space-y-8">
            <div className="pro-card p-10 bg-white shadow-xl space-y-8">
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 italic border-b border-slate-50 pb-4">Account Integrity</h3>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Email</label>
                     <p className="pro-input h-14 flex items-center bg-slate-50 border-none font-bold text-slate-500 italic">{user?.email}</p>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
                     <button className="btn-secondary w-full h-14 text-[10px] font-black uppercase tracking-widest">Rotate Authentication Key</button>
                  </div>
               </div>
            </div>

            <div className="pro-card p-10 bg-red-50/50 border-red-100 shadow-xl">
               <h3 className="text-sm font-black uppercase tracking-widest text-red-600 italic mb-6">Critical Actions</h3>
               <div className="flex gap-4">
                  <button onClick={logout} className="btn-secondary border-red-200 text-red-600 hover:bg-red-50 h-14 px-8 uppercase italic font-black text-xs tracking-widest flex-1">Terminate Session</button>
                  <button className="btn-primary bg-red-600 hover:bg-red-700 h-14 px-8 uppercase italic font-black text-xs tracking-widest flex-1">Liquidate Profile</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
