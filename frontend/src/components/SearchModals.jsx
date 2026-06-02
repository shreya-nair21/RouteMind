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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface rounded-xl w-full max-w-2xl overflow-hidden shadow-lg border border-white/10 animate-fade-in">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0B0F19]/50">
          <div>
            <h3 className="text-lg font-bold text-white uppercase">Explore {cityName}</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">Discover Curated Landmarks</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded bg-[#0B0F19]/30 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="flex gap-3">
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for specific sites, cafes, or experiences..." 
              className="pro-input h-12 text-sm"
            />
            <button onClick={handleSearch} className="btn-primary px-6 h-12 text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">search</span>
            </button>
          </div>

          {loading ? (
            <div className="py-16 flex justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((item, idx) => (
                <div key={idx} className="bg-[#0B0F19]/50 border border-white/10 p-5 rounded-lg hover:bg-surface-hover hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer group" onClick={() => onSelect({ name: item.name, description: item.description, type: item.type || 'activity', cost: item.cost || 0, startTime: '10:00', duration: '2h' })}>
                   <div className="flex justify-between items-start mb-3">
                      <span className="material-symbols-outlined text-supporting">explore</span>
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider">₹{item.cost || 0}</span>
                   </div>
                   <h4 className="font-bold text-white uppercase mb-1 tracking-tight text-sm">{item.name}</h4>
                   <p className="text-[11px] text-slate-400 font-normal leading-relaxed line-clamp-2">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivitySearchModal;

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface rounded-xl w-full max-w-lg shadow-lg border border-white/10 animate-fade-in overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0B0F19]/50">
           <h3 className="text-base font-bold text-white uppercase">Configure Maneuver</h3>
           <button onClick={onClose} className="text-slate-400 hover:text-white"><span className="material-symbols-outlined text-sm">close</span></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Event Name</label>
            <input 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="pro-input h-12 text-sm" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
                <input type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} className="pro-input h-12 text-sm" />
             </div>
             <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Allocation (₹)</label>
                <input type="number" value={formData.cost} onChange={(e) => setFormData({...formData, cost: Number(e.target.value)})} className="pro-input h-12 text-sm" />
             </div>
          </div>
          <div className="space-y-1.5">
             <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
             <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="pro-input h-20 py-2.5 resize-none text-xs" />
          </div>
          <button type="submit" className="w-full btn-primary py-3 text-xs uppercase tracking-wider">Finalize Sequence</button>
        </form>
      </div>
    </div>
  );
};
