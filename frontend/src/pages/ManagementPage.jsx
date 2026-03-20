import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  ChevronRight, 
  X,
  AlertCircle,
  CheckCircle2,
  Filter
} from 'lucide-react';

const ManagementPage = ({ type, label }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

  const fields = {
    teachers: [
      { name: 'name', label: 'Full Name', type: 'text' },
      { name: 'email', label: 'Email Address', type: 'email' },
      { name: 'department', label: 'Department', type: 'text' },
    ],
    subjects: [
      { name: 'name', label: 'Subject Name', type: 'text' },
      { name: 'department', label: 'Department', type: 'text' },
      { name: 'hours_per_week', label: 'Hours Weekly', type: 'number' },
    ],
    classes: [
      { name: 'name', label: 'Class/Section Name', type: 'text' },
    ],
    rooms: [
      { name: 'room_number', label: 'Room Number', type: 'text' },
      { name: 'capacity', label: 'Capacity', type: 'number' },
    ],
    timeslots: [
      { name: 'day', label: 'Day', type: 'select', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
      { name: 'start_time', label: 'Start Time', type: 'time' },
      { name: 'end_time', label: 'End Time', type: 'time' },
    ],
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resp = await api.get(`/${type}`);
      setData(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await api.put(`/${type}/${editItem.id}`, formData);
        setMessage('Record updated successfully!');
      } else {
        await api.post(`/${type}`, formData);
        setMessage('Record created successfully!');
      }
      setShowModal(false);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await api.delete(`/${type}/${id}`);
        fetchData();
        setMessage('Record deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-8 py-4 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{label} Management</h2>
          <p className="text-slate-500">Configure and organize your {label.toLowerCase()} registry.</p>
        </div>
        <button 
          onClick={() => { setEditItem(null); setFormData({}); setShowModal(true); }}
          className="btn-primary flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add New {label.slice(0, -1)}
        </button>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 p-4 rounded-xl flex items-center space-x-3">
          <CheckCircle2 size={20} />
          <span className="font-medium">{message}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={`Search ${label.toLowerCase()}...`}
            className="input-field w-full pl-12 h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-secondary h-12 px-6 flex items-center text-slate-600">
          <Filter size={18} className="mr-2" />
          More Filters
        </button>
      </div>

      {/* Table Section */}
      <div className="glass-card overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {fields[type].map(f => (
                  <th key={f.name} className="px-6 py-4 text-slate-500 font-bold uppercase text-xs tracking-wider">
                    {f.label}
                  </th>
                ))}
                <th className="px-6 py-4 text-slate-500 font-bold uppercase text-xs tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={fields[type].length + 1} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
                      Processing Registry...
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={fields[type].length + 1} className="px-6 py-12 text-center text-slate-400">
                    No {label.toLowerCase()} found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    {fields[type].map(f => (
                      <td key={f.name} className="px-6 py-4 text-slate-700 font-medium">
                        {item[f.name]}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditItem(item); setFormData(item); setShowModal(true); }}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-lg p-10 shadow-2xl relative overflow-hidden border border-slate-200">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-600 to-indigo-500"></div>
            
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-bold text-slate-900">
                {editItem ? `Modify ${label.slice(0, -1)}` : `New ${label.slice(0, -1)} Registry`}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {fields[type].map((f) => (
                  <div key={f.name} className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">{f.label}</label>
                    {f.type === 'select' ? (
                      <div className="relative">
                        <select
                          className="input-field w-full appearance-none pr-10 cursor-pointer"
                          name={f.name}
                          value={formData[f.name] || ''}
                          onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                          required
                        >
                          <option value="">Select Option</option>
                          {f.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ChevronRight size={18} className="rotate-90" />
                        </div>
                      </div>
                    ) : (
                      <input
                        type={f.type}
                        className="input-field w-full"
                        placeholder={`Enter ${f.label.toLowerCase()}`}
                        name={f.name}
                        value={formData[f.name] || ''}
                        onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                        required
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-8 flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary flex-1 shadow-lg shadow-primary-900/20"
                >
                  {editItem ? 'Save Updates' : 'Confirm Registry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

};

export default ManagementPage;
