import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/trips', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          const data = await response.json();
          setTrips(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center bg-background text-on-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-on-surface-variant font-bold text-xs uppercase tracking-widest">Retrieving your ecosystem...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-xl bg-background text-on-surface font-body-md animate-fade-in">
      {/* Welcome Header */}
      <section className="mb-xl">
        <h2 className="font-headline-xl text-[48px] font-bold text-on-surface leading-tight tracking-tight">
          Hello, {user?.name?.split(' ')[0] || 'Explorer'}.
        </h2>
        <p className="font-body-lg text-[18px] text-on-surface-variant mt-[8px]">
          {trips.length > 0 ? `You have ${trips.length} upcoming adventures planned.` : 'Your elite travel journey begins here.'}
        </p>
      </section>

      {/* Top Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px] mb-[80px]">
        {/* Countdown / Stats Card */}
        <div className="md:col-span-8 clay-surface rounded-3xl relative overflow-hidden min-h-[300px] border border-white/40">
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover opacity-20" 
              src={trips.length > 0 ? trips[0].image : "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop"}
              alt="Next Destination"
            />
          </div>
          <div className="relative z-10 p-[48px] flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-primary/10 text-primary px-[16px] py-[4px] rounded-full text-[14px] font-semibold mb-[8px] inline-block">
                   {trips.length > 0 ? 'Next Expedition' : 'Action Required'}
                </span>
                <h3 className="text-[32px] font-bold">
                   {trips.length > 0 ? trips[0].destination : 'No Active Trips'}
                </h3>
              </div>
              <div className="clay-inset rounded-2xl p-[16px] text-center border border-white/40">
                <span className="material-symbols-outlined text-primary block mb-[4px]">auto_awesome</span>
                <span className="text-[14px] font-bold">Elite</span>
              </div>
            </div>
            
            <div className="mt-auto flex gap-[24px] items-end">
               {trips.length > 0 ? (
                  <>
                    <div className="text-center">
                      <span className="block text-[48px] font-bold text-primary leading-none">{trips.length}</span>
                      <span className="text-[12px] font-semibold uppercase tracking-widest text-on-surface-variant">Active</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-[48px] font-bold text-primary leading-none">
                         {new Set(trips.map(t => t.destination)).size}
                      </span>
                      <span className="text-[12px] font-semibold uppercase tracking-widest text-on-surface-variant">Cities</span>
                    </div>
                    <button 
                      onClick={() => navigate(`/trips/${trips[0]._id}/itinerary`)}
                      className="ml-auto bg-primary text-on-primary px-[48px] py-[16px] rounded-full text-[14px] font-semibold shadow-lg flex items-center gap-[8px] active:scale-95 transition-transform"
                    >
                      View Itinerary
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </>
               ) : (
                  <button 
                     onClick={() => navigate('/create-trip')}
                     className="ml-auto bg-primary text-on-primary px-[48px] py-[16px] rounded-full text-[14px] font-semibold shadow-lg flex items-center gap-[8px] active:scale-95 transition-transform"
                  >
                     Construct Journey
                     <span className="material-symbols-outlined">add</span>
                  </button>
               )}
            </div>
          </div>
        </div>

        {/* Budget Card */}
        <div className="md:col-span-4 clay-surface rounded-3xl p-[48px] flex flex-col border border-white/40">
          <div className="flex justify-between items-center mb-[48px]">
            <h3 className="text-[24px] font-bold">Total Capital</h3>
            <span className="material-symbols-outlined text-on-surface-variant">payments</span>
          </div>
          <div className="space-y-[48px] flex-1">
            <div>
              <div className="flex justify-between mb-[8px]">
                <span className="text-[14px] font-semibold">Allocated</span>
                <span className="text-[14px] font-bold text-primary">₹{trips.reduce((acc, t) => acc + t.budget, 0).toLocaleString()}</span>
              </div>
              <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(0,93,167,0.4)]" style={{ width: trips.length > 0 ? '75%' : '0%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-[8px]">
                <span className="text-[14px] font-semibold">Trips Funded</span>
                <span className="text-[14px] font-bold text-primary">{trips.length}</span>
              </div>
              <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary/60 rounded-full" style={{ width: trips.length > 0 ? '50%' : '0%' }}></div>
              </div>
            </div>
          </div>
          <button 
             onClick={() => navigate('/budget')}
             className="w-full mt-[48px] py-[16px] rounded-xl text-[14px] font-semibold text-primary border-2 border-primary/20 hover:bg-primary-container/5 transition-colors"
          >
            Review Analytics
          </button>
        </div>
      </div>

      {/* Recent Itineraries Section */}
      <section>
        <div className="flex justify-between items-end mb-[24px]">
          <div>
            <h2 className="text-[32px] font-bold">Recent Itineraries</h2>
            <p className="text-[16px] text-on-surface-variant mt-[4px]">Your active expeditions.</p>
          </div>
          <button onClick={() => navigate('/trips')} className="text-primary text-[14px] font-semibold flex items-center gap-[4px] hover:underline">
            Explore all <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
        
        {trips.length === 0 ? (
          <div className="clay-surface rounded-3xl p-20 flex flex-col items-center justify-center text-center border border-white/40 border-dashed">
             <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center text-primary mb-6 shadow-sm">
                <span className="material-symbols-outlined text-4xl">flight_takeoff</span>
             </div>
             <h3 className="text-[24px] font-bold text-on-surface mb-2">No Expeditions Found</h3>
             <p className="text-on-surface-variant max-w-sm font-medium mb-10 text-[14px]">The world is vast and waiting. Begin your first luxury travel plan today with our AI-guided engine.</p>
             <button onClick={() => navigate('/create-trip')} className="clay-button-primary bg-primary text-white rounded-full px-10 py-4 text-[14px] font-semibold">Initialize First Journey</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
            {trips.slice(0, 4).map(trip => (
              <div key={trip._id} onClick={() => navigate(`/trips/${trip._id}/itinerary`)} className="clay-surface rounded-3xl overflow-hidden group cursor-pointer border border-white/40 hover:shadow-xl transition-all">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    src={trip.image || `https://source.unsplash.com/1600x900/?${trip.destination}`}
                    alt={trip.destination} 
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop'; }}
                  />
                  <div className="absolute top-[16px] right-[16px]">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                      <span className="material-symbols-outlined">auto_awesome</span>
                    </div>
                  </div>
                </div>
                <div className="p-[24px]">
                  <div className="flex justify-between items-start mb-[8px]">
                    <h4 className="text-[16px] font-bold truncate">{trip.destination}</h4>
                    <div className="flex items-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-[12px] font-bold ml-1">Elite</span>
                    </div>
                  </div>
                  <div className="flex gap-[8px] mb-[16px]">
                    <span className="px-[8px] py-[4px] bg-surface-container rounded-full text-[12px] font-medium text-on-surface-variant capitalize">{trip.transportMode}</span>
                    <span className="px-[8px] py-[4px] bg-surface-container rounded-full text-[12px] font-medium text-on-surface-variant">Luxury</span>
                  </div>
                  <div className="flex justify-between items-center pt-[16px] border-t border-outline-variant/20">
                    <span className="text-[12px] font-medium text-on-surface-variant">
                      {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="font-bold text-[14px] text-primary">₹{trip.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      
      {/* FAB for Create action */}
      <button 
        onClick={() => navigate('/create-trip')}
        className="fixed bottom-[48px] right-[48px] w-16 h-16 bg-primary text-on-primary rounded-2xl shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-50 hover:brightness-110"
      >
        <span className="material-symbols-outlined text-[32px]">add</span>
      </button>
    </div>
  );
};

export default Dashboard;
