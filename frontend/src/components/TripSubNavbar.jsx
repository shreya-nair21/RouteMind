import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TripSubNavbar = ({ activeTab }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const tabs = [
    { key: 'itinerary', label: 'Itinerary', path: `/trips/${id}/itinerary` },
    { key: 'budget', label: 'Budget', path: `/trips/${id}/budget` },
    { key: 'packing', label: 'Packing', path: `/trips/${id}/packing` },
    { key: 'notes', label: 'Notes', path: `/trips/${id}/notes` }
  ];

  return (
    <div className="flex flex-row justify-between items-center bg-[#0B0F19]/40 backdrop-blur-xl p-2 rounded-2xl border border-white/5 shadow-2xl !sticky top-[72px] z-30 w-full select-none">
      <div className="flex items-center gap-1 bg-[#05070B]/50 p-1 rounded-xl border border-white/5 w-full sm:w-auto overflow-x-auto scrollbar-none">
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => navigate(tab.path)}
              className={`px-5 py-2.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 flex-shrink-0 border-none cursor-pointer ${
                isActive
                  ? 'bg-primary text-black shadow-md shadow-primary/20 font-bold'
                  : 'text-white/80 hover:text-white hover:bg-white/5 font-semibold'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-[#05070B]/30 rounded-xl border border-white/5">
        <p className="text-[9px] font-black text-white/60 uppercase tracking-wider">Cloud Synchronized</p>
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></span>
      </div>
    </div>
  );
};

export default TripSubNavbar;
