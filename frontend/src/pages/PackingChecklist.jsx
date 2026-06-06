import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PackingChecklist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAILoading, setIsAILoading] = useState(false);

  const handleGenerateAIPacking = async () => {
    setIsAILoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/trips/${id}/generate-packing`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAILoading(false);
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/packing/trip/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.status === 401) {
          logout();
          navigate('/login');
          return;
        }
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [id, logout, navigate]);

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    try {
      const response = await fetch('http://localhost:5001/api/packing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: newItem, tripId: id })
      });
      if (response.ok) {
        const item = await response.json();
        setItems([...items, item]);
        setNewItem('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleItem = async (item) => {
    try {
      const response = await fetch(`http://localhost:5001/api/packing/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...item, packed: !item.packed })
      });
      if (response.ok) {
        setItems(items.map(i => i._id === item._id ? { ...i, packed: !i.packed } : i));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center bg-[#080C14]"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-12 pb-20">
      <div className="flex justify-between items-end border-b border-white/10 pb-10">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Logistics Prep</p>
          <h1 className="text-4xl font-black text-secondary uppercase italic">Equipment List</h1>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={addItem} className="flex-1 flex gap-4">
          <input 
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Specify essential gear..." 
            className="pro-input h-12 text-sm" 
          />
          <button type="submit" className="btn-primary px-6 h-12">
            <span className="material-symbols-outlined text-sm">add_task</span>
          </button>
        </form>
        <button 
          type="button" 
          onClick={handleGenerateAIPacking} 
          disabled={isAILoading}
          className="btn-primary h-12 px-6 flex items-center justify-center gap-2 border-none shrink-0"
        >
          {isAILoading ? 'Curating...' : 'AI Auto-Curate List'}
          <span className="material-symbols-outlined text-xs">auto_awesome</span>
        </button>
      </div>

      <div className="bg-surface border border-white/10 p-6 rounded-xl shadow-sm space-y-3">
        {items.length === 0 ? (
          <p className="text-center py-10 text-slate-400 text-sm font-medium italic">No inventory specified yet.</p>
        ) : (
          items.map(item => (
            <div 
              key={item._id} 
              onClick={() => toggleItem(item)}
              className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all border ${
                item.packed ? 'bg-[#0B0F19]/50 border-white/5 opacity-60' : 'bg-surface border-white/5 hover:border-primary/30'
              }`}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                item.packed ? 'bg-primary border-primary' : 'border-white/20'
              }`}>
                {item.packed && <span className="material-symbols-outlined text-white text-[10px]">check</span>}
              </div>
              <span className={`flex-1 text-sm ${item.packed ? 'line-through text-slate-400 italic' : 'text-secondary font-medium'}`}>{item.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PackingChecklist;
