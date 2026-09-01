import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { ShoppingBag, Check, Plus, Trash2, Edit2, DollarSign, Sparkles } from 'lucide-react';

export default function GroceryPage() {
  const [items, setItems] = useState([]);
  const [weeklyBudget, setWeeklyBudget] = useState(500);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');

  const loadGrocery = async () => {
    const res = await api.getGroceryList();
    if (res.success) {
      setItems(res.items || []);
      setWeeklyBudget(Math.max(500, Number(res.weeklyBudget || 500)));
      setEstimatedCost(res.estimatedCost || 0);
    }
  };

  useEffect(() => {
    loadGrocery();
  }, []);

  const togglePurchased = async (id, currentStatus) => {
    const res = await api.updateGroceryItem(id, { purchased: !currentStatus });
    if (res.success) {
      setItems(prev => prev.map(i => i.id === id ? { ...i, purchased: !currentStatus } : i));
    }
  };

  const addItem = () => {
    if (!newItemName) return;
    const newItem = {
      id: `g_${Date.now()}`,
      name: newItemName,
      qty: newItemQty || '1 kg',
      purchased: false,
      cost: 120
    };
    setItems(prev => [...prev, newItem]);
    setNewItemName('');
    setNewItemQty('');
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="min-h-screen aurora-bg cyber-grid px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 rounded-3xl glass-panel border border-lime-accent/25 shadow-glow-teal">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-lime-accent mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>AUTOMATED AGGREGATED PLANNER</span>
          </div>
          <h1 className="text-3xl font-extrabold text-ivory">7-Day Weekly Grocery List</h1>
          <p className="text-xs text-ivory/60">Combined duplicate ingredients from your personalized 7-day meal plan.</p>
        </div>

        <Link
          to="/grocery/budget"
          className="px-6 py-3 rounded-xl bg-lime-accent text-obsidian font-extrabold text-xs hover:bg-lime-hover shadow-glow-lime flex items-center space-x-2"
        >
          <DollarSign className="w-4 h-4" />
          <span>Budget Optimizer</span>
        </Link>
      </div>

      {/* Add Custom Item Input Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-lime-accent/20 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Add Grocery Item (e.g. Brown Rice)"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="flex-1 bg-obsidian border border-lime-accent/20 rounded-xl px-4 py-2 text-sm text-ivory focus:outline-none focus:border-lime-accent"
        />
        <input
          type="text"
          placeholder="Quantity (e.g. 2.5 kg)"
          value={newItemQty}
          onChange={(e) => setNewItemQty(e.target.value)}
          className="w-full sm:w-36 bg-obsidian border border-lime-accent/20 rounded-xl px-4 py-2 text-sm text-lime-accent font-bold focus:outline-none focus:border-lime-accent"
        />
        <button
          onClick={addItem}
          className="px-6 py-2 rounded-xl bg-lime-accent text-obsidian font-bold text-xs hover:bg-lime-hover flex items-center justify-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Interactive Grocery List Grid */}
      <div className="glass-panel p-6 rounded-3xl border border-lime-accent/25 space-y-4">
        <div className="flex justify-between items-center border-b border-lime-accent/15 pb-3 text-xs font-mono text-lime-accent font-bold uppercase">
          <span>🛒 INGREDIENT</span>
          <span>ESTIMATED QUANTITY & COST</span>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                item.purchased
                  ? 'bg-obsidian/40 border-lime-accent/10 opacity-50 line-through'
                  : 'bg-obsidian/80 border-lime-accent/20 hover:border-lime-accent/40'
              }`}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => togglePurchased(item.id, item.purchased)}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                    item.purchased ? 'bg-lime-accent border-lime-accent text-obsidian' : 'border-lime-accent/40 hover:border-lime-accent'
                  }`}
                >
                  {item.purchased && <Check className="w-4 h-4" />}
                </button>

                <div>
                  <div className="font-bold text-sm text-ivory">{item.name}</div>
                  <div className="text-xs font-mono text-lime-accent">{item.qty}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-xs font-mono font-bold text-ivory/80">₹{item.cost || 120}</span>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-ivory/40 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
