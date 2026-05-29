import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TripNotes = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/notes/trip/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
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
  }, [id]);

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

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-12 pb-20">
      <div className="flex justify-between items-end border-b border-slate-100 pb-10">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Tactical Intelligence</p>
          <h1 className="text-4xl font-black text-secondary uppercase italic">Field Notes</h1>
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
          <p className="text-center py-10 text-slate-400 text-sm font-medium italic">The archive is currently empty.</p>
        ) : (
          notes.map(note => (
            <div key={note._id} className="bg-surface border border-slate-200 p-6 rounded-xl shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 italic">
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
