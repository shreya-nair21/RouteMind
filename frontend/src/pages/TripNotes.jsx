import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TripNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/notes/trip/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.status === 401) {
          logout();
          navigate('/login');
          return;
        }
        if (response.ok) {
          const data = await response.json();
          setNotes(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [id, logout, navigate]);

  const addNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      const response = await fetch('http://localhost:5001/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: newNote, tripId: id })
      });
      if (response.ok) {
        const note = await response.json();
        setNotes([note, ...notes]);
        setNewNote('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center bg-[#080C14]"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-end border-b border-white/10 pb-10">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Tactical Intelligence</p>
          <h1 className="text-3xl md:text-4xl font-black text-secondary uppercase">Field Notes</h1>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <div className="flex flex-row justify-between items-center bg-[#0B0F19]/40 backdrop-blur-xl p-2 rounded-2xl border border-white/5 shadow-2xl !sticky top-[72px] z-30 w-full">
        <div className="flex items-center gap-1 bg-[#05070B]/50 p-1 rounded-xl border border-white/5 w-full sm:w-auto overflow-x-auto scrollbar-none">
          <button 
            onClick={() => navigate(`/trips/${id}/itinerary`)} 
            className="px-5 py-2.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 flex-shrink-0 text-slate-400 hover:text-white hover:bg-white/5"
          >
            Itinerary
          </button>
          <button 
            onClick={() => navigate(`/trips/${id}/budget`)} 
            className="px-5 py-2.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 flex-shrink-0 text-slate-400 hover:text-white hover:bg-white/5"
          >
            Budget
          </button>
          <button 
            onClick={() => navigate(`/trips/${id}/packing`)} 
            className="px-5 py-2.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 flex-shrink-0 text-slate-400 hover:text-white hover:bg-white/5"
          >
            Packing
          </button>
          <button 
            onClick={() => navigate(`/trips/${id}/notes`)} 
            className="px-5 py-2.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 flex-shrink-0 bg-primary text-white shadow-md shadow-primary/20"
          >
            Notes
          </button>
        </div>
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-[#05070B]/30 rounded-xl border border-white/5">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Cloud Synchronized</p>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></span>
        </div>
      </div>

      <form onSubmit={addNote} className="space-y-4">
        <textarea 
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Document critical observations or local insights..." 
          className="pro-input h-24 py-3 text-sm resize-none" 
        />
        <div className="flex justify-end">
           <button type="submit" className="btn-primary px-6 h-12 text-xs font-bold uppercase tracking-wider">
             <span className="material-symbols-outlined text-sm">edit_note</span>
             Archive Note
           </button>
        </div>
      </form>

      <div className="grid grid-cols-1 gap-6">
        {notes.length === 0 ? (
          <p className="text-center py-10 text-slate-400 text-sm font-medium">The archive is currently empty.</p>
        ) : (
          notes.map(note => (
            <div key={note._id} className="bg-surface border border-white/10 p-6 rounded-xl shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Recorded on {new Date(note.createdAt).toLocaleDateString()}
               </p>
               <p className="text-secondary text-sm font-normal leading-relaxed whitespace-pre-wrap">{note.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TripNotes;
