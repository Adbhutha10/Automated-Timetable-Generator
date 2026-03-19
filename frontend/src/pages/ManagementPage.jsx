import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import api from '../api';

const ManagementPage = ({ title, model, fields }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await api.get(`/${model}s`);
      setItems(res.data);
    } catch (err) {
      console.error(`Failed to fetch ${model}s`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [model]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/${model}s/${editingId}`, formData);
      } else {
        await api.post(`/${model}s`, formData);
      }
      setIsModalOpen(false);
      setFormData({});
      setEditingId(null);
      fetchItems();
    } catch (err) {
      alert("Error saving data");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/${model}s/${id}`);
        fetchItems();
      } catch (err) {
        alert("Error deleting item");
      }
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="text-slate-400">Manage your {model}s here.</p>
        </div>
        <button 
          onClick={() => { setFormData({}); setEditingId(null); setIsModalOpen(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add {title.slice(0, -1)}
        </button>
      </div>

      <div className="card overflow-hidden !p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 border-b border-white/5">
              {fields.map(f => (
                <th key={f} className="px-6 py-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">{f.replace('_', ' ')}</th>
              ))}
              <th className="px-6 py-4 text-sm font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                {fields.map(f => (
                  <td key={f} className="px-6 py-4 text-slate-200">{item[f]}</td>
                ))}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-primary-400 transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && !loading && (
          <div className="p-12 text-center text-slate-500">No {model}s found. Add one to get started.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">{editingId ? 'Edit' : 'Add'} {title.slice(0, -1)}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {fields.map(f => (
                <div key={f} className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-400 capitalize">{f.replace('_', ' ')}</label>
                  <input 
                    type={f === 'hours_per_week' || f === 'capacity' ? 'number' : 'text'}
                    className="input-field"
                    required
                    value={formData[f] || ''}
                    onChange={e => setFormData({ ...formData, [f]: f === 'hours_per_week' || f === 'capacity' ? parseInt(e.target.value) : e.target.value })}
                  />
                </div>
              ))}
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementPage;
