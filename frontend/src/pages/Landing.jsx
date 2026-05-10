import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-blue-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] px-8 py-6 md:px-16 flex justify-between items-center bg-gradient-to-b from-slate-900/80 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined filled">flight_takeoff</span>
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">Traveloop</span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-white/5"
        >
          Access Portal
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-40 pb-20 px-8 md:px-16 flex flex-col items-center text-center overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>

        <p className="text-blue-400 font-bold tracking-[0.4em] uppercase text-[10px] mb-8 animate-fade-in">Experience the Future of Travel</p>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          JOURNEY <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">WITHOUT</span> <br /> LIMITS.
        </h1>
        
        <p className="text-slate-400 max-w-xl text-lg font-medium leading-relaxed mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Your elite AI companion for crafting bespoke global itineraries. Precision planning, luxury insights, and seamless coordination in one unified dashboard.
        </p>

        <div className="flex flex-col md:flex-row gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <button 
            onClick={() => navigate('/login')}
            className="px-12 py-5 bg-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-500 hover:-translate-y-1 transition-all shadow-2xl shadow-blue-600/20"
          >
            Start Your Voyage
          </button>
          <button className="px-12 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-md">
            The Traveloop Story
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40 max-w-6xl w-full">
          <FeatureCard 
            icon="auto_awesome" 
            title="AI Precision" 
            desc="Every journey is unique. Our neural engine adapts to your style, budget, and destination in real-time."
          />
          <FeatureCard 
            icon="diamond" 
            title="Elite Insights" 
            desc="Access hidden gems and exclusive landmarks curated from our global knowledge base of premier cities."
          />
          <FeatureCard 
            icon="dashboard_customize" 
            title="Unified Control" 
            desc="Budgeting, packing, and scheduling. Everything you need is managed from one high-performance interface."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-8 md:px-16 mt-20 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-950/50">
        <div className="flex items-center gap-3 opacity-50">
           <span className="text-lg font-black tracking-tighter uppercase italic">Traveloop</span>
           <span className="text-[10px] font-bold text-slate-500">© 2026 PREMIER SYSTEMS</span>
        </div>
        <div className="flex gap-10 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
           <a href="#" className="hover:text-white transition-colors">Intelligence</a>
           <a href="#" className="hover:text-white transition-colors">Privacy</a>
           <a href="#" className="hover:text-white transition-colors">Security</a>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-10 bg-white/5 border border-white/10 rounded-[32px] text-left hover:border-blue-600/30 transition-all group">
    <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
      <span className="material-symbols-outlined text-3xl filled">{icon}</span>
    </div>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
  </div>
);

export default Landing;
