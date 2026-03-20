import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  Users, 
  BookOpen, 
  Layers, 
  MapPin, 
  Plus, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    teachers: 0,
    subjects: 0,
    classes: 0,
    rooms: 0
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const resp = await api.get('/teachers');
      const teachers = resp.data.length;
      const subjectsResp = await api.get('/subjects');
      const classesResp = await api.get('/classes');
      const roomsResp = await api.get('/rooms');
      
      setStats({
        teachers,
        subjects: subjectsResp.data.length,
        classes: classesResp.data.length,
        rooms: roomsResp.data.length
      });
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setMessage('');
    try {
      await api.post('/generate-timetable');
      setMessage('Timetable generated successfully!');
      setTimeout(() => navigate('/timetable'), 1500);
    } catch (err) {
      setMessage('Failed to generate. Ensure all data (Teacher-Subject, Class-Subject) is assigned.');
    } finally {
      setGenerating(false);
    }
  };

  const StatCard = ({ icon, label, count, color }) => (
    <div className="stat-card group glass-card hover:bg-white transition-all border border-slate-100">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-opacity-100 mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-slate-500 font-medium mb-1 uppercase tracking-wider text-xs">{label}</h3>
      <p className="text-3xl font-bold text-slate-900">{count}</p>
    </div>
  );

  return (
    <div className="space-y-10 py-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Welcome Back, <span className="text-primary-600">Admin</span>
          </h2>
          <p className="text-slate-500 text-lg flex items-center">
            <Clock size={16} className="mr-2 text-primary-600" />
            Let's build a conflict-free schedule for today.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/teachers')}
            className="btn-secondary flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Staff
          </button>
          <button 
            onClick={handleGenerate}
            disabled={generating}
            className={`btn-primary flex items-center ${generating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {generating ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Play size={20} className="mr-2 fill-current" />
            )}
            {generating ? 'Processing...' : 'Generate New Registry'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center space-x-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
          message.includes('success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          {message.includes('success') ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          <span className="font-medium text-lg">{message}</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users size={28} className="text-blue-600" />} 
          label="Total Teachers" 
          count={stats.teachers} 
          color="bg-blue-600" 
        />
        <StatCard 
          icon={<BookOpen size={28} className="text-purple-600" />} 
          label="Total Subjects" 
          count={stats.subjects} 
          color="bg-purple-600" 
        />
        <StatCard 
          icon={<Layers size={28} className="text-primary-600" />} 
          label="Total Classes" 
          count={stats.classes} 
          color="bg-primary-600" 
        />
        <StatCard 
          icon={<MapPin size={28} className="text-rose-600" />} 
          label="Total Rooms" 
          count={stats.rooms} 
          color="bg-rose-600" 
        />
      </div>

      {/* Highlights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-10 relative overflow-hidden group border border-slate-100">
          <div className="absolute top-0 right-0 p-8 text-primary-600/5 group-hover:text-primary-600/10 transition-colors">
            <TrendingUp size={160} />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
              System Optimization State
              <span className="ml-3 px-3 py-1 text-xs font-bold bg-primary-100 text-primary-600 rounded-full uppercase tracking-wider">High Performance</span>
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed max-w-xl mb-8">
              Your timetable engine is ready for deployment. The current constraints cover teacher availability, class capacities, and subject distribution across the week.
            </p>
            <div className="flex space-x-12">
              <div>
                <span className="block text-4xl font-bold text-slate-900 mb-1">98%</span>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Reliability Score</span>
              </div>
              <div className="border-l border-slate-200 pl-12">
                <span className="block text-4xl font-bold text-slate-900 mb-1">0</span>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Conflicts</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-10 flex flex-col justify-center items-center text-center border border-slate-100">
          <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-transform shadow-sm">
            <Layers size={36} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">Registry Wizard</h3>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Quickly organize sessions by grouping subjects and teachers for specific grade levels.
          </p>
          <button 
            onClick={() => navigate('/classes')}
            className="w-full btn-secondary text-primary-600 border-primary-200 hover:bg-primary-50"
          >
            Review Hierarchy
          </button>
        </div>
      </div>
    </div>
  );

};

export default Dashboard;
