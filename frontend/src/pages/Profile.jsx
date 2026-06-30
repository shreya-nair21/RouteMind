import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name.trim() || !email.trim()) {
      setError('Name and Email are required.');
      return;
    }
    const res = await updateProfile(name, email);
    if (res.success) {
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } else {
      setError(res.message);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setError('');
    setSuccess('');
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-end border-b border-white/10 pb-10">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Member Authentication</p>
          <h1 className="text-3xl md:text-4xl font-black text-secondary uppercase">Identity Profile</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-surface border border-white/10 p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-zinc-950 flex items-center justify-center border-4 border-white/10 mb-6 overflow-hidden shadow-sm">
               <img alt="User" src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Explorer'}`} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-bold text-secondary uppercase mb-2">{user?.name}</h3>
            <p className="text-[9px] font-bold text-supporting uppercase tracking-widest px-3 py-1 bg-supporting/10 rounded-full">Elite Status</p>
            
            <div className="w-full mt-8 pt-8 border-t border-white/10 flex flex-col gap-4">
               <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  <span>Joined Sector</span>
                  <span className="text-secondary">May 2026</span>
               </div>
               <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  <span>Expeditions</span>
                  <span className="text-secondary">Verified</span>
               </div>
            </div>
         </div>

         <div className="md:col-span-2 space-y-8">
            <div className="bg-surface border border-white/10 p-6 rounded-xl shadow-sm space-y-6">
               <h3 className="text-xs font-bold uppercase tracking-wider text-secondary border-b border-white/10 pb-3 flex justify-between items-center">
                  <span>Account Integrity</span>
                  {!isEditing && (
                     <button 
                        onClick={() => setIsEditing(true)} 
                        className="text-[10px] font-bold text-white hover:text-slate-200 uppercase tracking-widest bg-transparent border-none cursor-pointer flex items-center gap-1"
                     >
                        <span className="material-symbols-outlined text-xs">edit</span>
                        Edit Details
                     </button>
                  )}
               </h3>

               {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}
               {success && <p className="text-xs text-green-400 font-semibold">{success}</p>}
               
               <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-1.5">
                     <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Explorer Name</label>
                     {isEditing ? (
                        <input 
                           type="text" 
                           value={name} 
                           onChange={(e) => setName(e.target.value)} 
                           className="pro-input h-12" 
                           placeholder="Enter your name"
                        />
                     ) : (
                        <p className="pro-input h-12 flex items-center bg-zinc-950 border border-white/5 font-medium text-slate-350 text-sm">{user?.name}</p>
                     )}
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Access Email</label>
                     {isEditing ? (
                        <input 
                           type="email" 
                           value={email} 
                           onChange={(e) => setEmail(e.target.value)} 
                           className="pro-input h-12" 
                           placeholder="Enter your email"
                        />
                     ) : (
                        <p className="pro-input h-12 flex items-center bg-zinc-950 border border-white/5 font-medium text-slate-350 text-sm">{user?.email}</p>
                     )}
                  </div>

                  {isEditing && (
                     <div className="flex gap-4 pt-2">
                        <button type="submit" className="btn-primary flex-1 h-12 text-xs font-bold uppercase tracking-wider">Save Changes</button>
                        <button type="button" onClick={handleCancel} className="btn-secondary flex-1 h-12 text-xs font-bold uppercase tracking-wider">Cancel</button>
                     </div>
                  )}
               </form>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl shadow-sm">
               <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-4">Critical Actions</h3>
               <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={logout} className="btn-secondary border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 h-12 px-6 uppercase font-bold text-xs tracking-wider w-full">Terminate Session</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
