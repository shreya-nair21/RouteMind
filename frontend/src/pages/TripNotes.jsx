import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TripContext } from '../context/TripContext';
import { TripSubNavbar } from '../components';

const TripNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    notes,
    loading,
    addNote
  } = useContext(TripContext);

  const [newNote, setNewNote] = useState('');

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const success = await addNote(newNote);
    if (success) {
      setNewNote('');
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center bg-[#080C14]"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-end border-b border-white/10 pb-10">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Tactical Intelligence</p>
          <h1 className="text-3xl md:text-4xl font-black text-secondary uppercase">Field Notes</h1>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <TripSubNavbar activeTab="notes" />

      <form onSubmit={handleAddNote} className="space-y-4">
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
