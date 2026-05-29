import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-12 pb-20">
      <div className="flex justify-between items-end border-b border-slate-100 pb-10">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Member Authentication</p>
          <h1 className="text-4xl font-black text-secondary uppercase">Identity Profile</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-surface border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center border-4 border-slate-100 mb-6 overflow-hidden shadow-sm">
               <img alt="User" src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Explorer'}`} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-bold text-secondary uppercase mb-2">{user?.name}</h3>
            <p className="text-[9px] font-bold text-supporting uppercase tracking-widest px-3 py-1 bg-supporting/10 rounded-full">Elite Status</p>
            
            <div className="w-full mt-8 pt-8 border-t border-slate-100 flex flex-col gap-4">
               <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  <span>Joined Sector</span>
                  <span className="text-secondary">May 2026</span>
               </div>
               <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  <span>Expeditions</span>
                  <span className="text-secondary italic">Verified</span>
               </div>
            </div>
         </div>

         <div className="md:col-span-2 space-y-8">
            <div className="bg-surface border border-slate-200 p-6 rounded-xl shadow-sm space-y-6">
               <h3 className="text-xs font-bold uppercase tracking-wider text-secondary border-b border-slate-100 pb-3">Account Integrity</h3>
               
               <div className="space-y-4">
                  <div className="space-y-1.5">
                     <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Access Email</label>
                     <p className="pro-input h-12 flex items-center bg-slate-50 border border-slate-200/60 font-medium text-slate-500 text-sm">{user?.email}</p>
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
                     <button className="btn-secondary w-full h-12 text-xs font-bold uppercase tracking-wider">Rotate Authentication Key</button>
                  </div>
               </div>
            </div>

            <div className="bg-red-50/30 border border-red-100 p-6 rounded-xl shadow-sm">
               <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 mb-4">Critical Actions</h3>
               <div className="flex gap-4">
                  <button onClick={logout} className="btn-secondary border-red-200 text-red-600 hover:bg-red-50 h-12 px-6 uppercase font-bold text-xs tracking-wider flex-1">Terminate Session</button>
                  <button className="btn-primary bg-red-600 hover:bg-red-700 h-12 px-6 uppercase font-bold text-xs tracking-wider flex-1 border-none text-white">Liquidate Profile</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
