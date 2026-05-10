import React, { useState, useEffect } from 'react';

export const ActivitySearchModal = ({ isOpen, onClose, onSelect, cityName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/attractions?city=${encodeURIComponent(cityName)}&query=${encodeURIComponent(searchTerm)}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Explore {cityName}</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Discover Curated Landmarks</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          <div className="flex gap-4">
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for specific sites, cafes, or experiences..." 
              className="pro-input h-14 font-bold"
            />
            <button onClick={handleSearch} className="btn-primary px-8 h-14">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((item, idx) => (
                <div key={idx} className="pro-card p-6 bg-slate-50 border-slate-100 hover:bg-white hover:border-blue-200 transition-all cursor-pointer group" onClick={() => onSelect({ name: item.name, description: item.description, type: item.type || 'activity', cost: item.cost || 0, startTime: '10:00', duration: '2h' })}>
                   <div className="flex justify-between items-start mb-4">
                      <span className="material-symbols-outlined text-blue-600 filled">explore</span>
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic">₹{item.cost || 0}</span>
                   </div>
                   <h4 className="font-black text-slate-900 uppercase italic mb-2 tracking-tight">{item.name}</h4>
                   <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ActivityEditorModal = ({ isOpen, onClose, onSave, activity }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startTime: '10:00',
    duration: '2h',
    cost: 0,
    type: 'activity'
  });

  useEffect(() => {
    if (activity) {
      setFormData(activity);
    }
  }, [activity]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl animate-fade-in overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
           <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Configure Maneuver</h3>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Name</label>
            <input 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="pro-input h-14 font-bold" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
                <input type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} className="pro-input h-14 font-bold" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Allocation (₹)</label>
                <input type="number" value={formData.cost} onChange={(e) => setFormData({...formData, cost: Number(e.target.value)})} className="pro-input h-14 font-bold" />
             </div>
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
             <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="pro-input h-24 py-4 font-medium resize-none" />
          </div>
          <button type="submit" className="w-full btn-primary h-14 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20">Finalize Sequence</button>
        </form>
      </div>
    </div>
  );
};
