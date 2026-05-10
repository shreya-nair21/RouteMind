import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PackingChecklist = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/packing/trip/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
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
  }, [id]);

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

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-12 pb-20">
      <div className="flex justify-between items-end border-b border-slate-200 pb-10">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Logistics Prep</p>
          <h1 className="text-5xl font-extrabold tracking-tighter text-slate-900 italic uppercase">Equipment List</h1>
        </div>
      </div>

      <form onSubmit={addItem} className="flex gap-4">
        <input 
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Specify essential gear..." 
          className="pro-input h-16 text-lg font-bold" 
        />
        <button type="submit" className="btn-primary px-10 h-16">
          <span className="material-symbols-outlined">add_task</span>
        </button>
      </form>

      <div className="pro-card p-10 bg-white shadow-xl space-y-4">
        {items.length === 0 ? (
          <p className="text-center py-10 text-slate-400 font-medium italic">No inventory specified yet.</p>
        ) : (
          items.map(item => (
            <div 
              key={item._id} 
              onClick={() => toggleItem(item)}
              className={`flex items-center gap-4 p-6 rounded-2xl cursor-pointer transition-all border-2 ${
                item.packed ? 'bg-slate-50 border-transparent opacity-60' : 'bg-white border-slate-50 hover:border-blue-100'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                item.packed ? 'bg-blue-600 border-blue-600' : 'border-slate-200'
              }`}>
                {item.packed && <span className="material-symbols-outlined text-white text-xs">check</span>}
              </div>
              <span className={`flex-1 font-bold ${item.packed ? 'line-through text-slate-400 italic' : 'text-slate-900'}`}>{item.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PackingChecklist;
