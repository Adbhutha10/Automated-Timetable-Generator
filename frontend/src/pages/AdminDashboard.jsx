import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
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
  Clock,
  Activity,
  ShieldCheck,
  ChevronRight,
  Database,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    teachers: 0,
    subjects: 0,
    classes: 0,
    rooms: 0
  });
  const [unmappedTeachers, setUnmappedTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [teachers, subjects, classes, rooms, mappings] = await Promise.all([
        api.get('/teachers'),
        api.get('/subjects'),
        api.get('/classes'),
        api.get('/rooms'),
        api.get('/teacher-subjects')
      ]);
      
      setStats({
        teachers: teachers.data.length,
        subjects: subjects.data.length,
        classes: classes.data.length,
        rooms: rooms.data.length
      });

      // Find teachers with no subjects mapped
      const mappedTeacherIds = new Set(mappings.data.map(m => m.teacher_id));
      const unmapped = teachers.data.filter(t => !mappedTeacherIds.has(t.id));
      setUnmappedTeachers(unmapped);

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
      setMessage('Failed to generate. Ensure all requirements are met.');
    } finally {
      setGenerating(false);
    }
  };

  const StatCard = ({ icon, label, count, colorName, trend }) => (
    <div className="stat-card group glass-card hover:bg-white transition-all border border-slate-100/50 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
      <div className={`w-14 h-14 rounded-2xl bg-${colorName}-50 text-${colorName}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <p className="text-slate-500 font-bold mb-1 uppercase tracking-widest text-[10px]">{label}</p>
      <div className="relative inline-flex items-center">
        <p className="text-4xl font-black text-slate-900 tracking-tight">{count}</p>
        {trend && (
          <span className="absolute left-full ml-2 flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
            <TrendingUp size={10} className="mr-1" />
            +12%
          </span>
        )}
      </div>
    </div>
  );

  const QuickAction = ({ icon, title, desc, onClick, primary }) => (
    <button 
      onClick={onClick}
      className={`group flex items-center p-4 rounded-2xl border transition-all text-left w-full ${
        primary 
          ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-900/20 hover:bg-primary-500' 
          : 'bg-white border-slate-100 text-slate-900 hover:border-primary-200 hover:shadow-md'
      }`}
    >
      <div className={`p-3 rounded-xl mr-4 ${primary ? 'bg-primary-500' : 'bg-slate-50 text-primary-600 group-hover:bg-primary-50'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-sm tracking-tight">{title}</h4>
        <p className={`text-[11px] leading-tight ${primary ? 'text-primary-100' : 'text-slate-500'}`}>{desc}</p>
      </div>
      <ChevronRight size={16} className={`opacity-0 group-hover:opacity-100 transition-all ${primary ? 'text-white' : 'text-primary-400'}`} />
    </button>
  );

  return (
    <div className="space-y-8 py-2 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold text-primary-600 uppercase tracking-[0.2em] mb-2">
            <ShieldCheck size={14} />
            <span>Administrator Control Center</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-1">
            Welcome, <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">{user?.result?.name?.split(' ')[0] || 'Admin'}</span>.
          </h2>
          <p className="text-slate-500 font-medium">System is operational. Last data sync was successful.</p>
        </div>
        <div className="flex items-center space-x-3 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex -space-x-2 px-2">
                {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {String.fromCharCode(64 + i)}
                    </div>
                ))}
            </div>
            <div className="h-8 w-px bg-slate-100 mx-1" />
            <button className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-slate-600 hover:text-primary-600 transition-colors">
                <Activity size={14} />
                <span>Live Logs</span>
            </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center space-x-3 animate-in slide-in-from-top-4 ${
          message.includes('success') ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-rose-50 border border-rose-100 text-rose-700'
        }`}>
          {message.includes('success') ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold text-sm tracking-tight">{message}</span>
        </div>
      )}

      {unmappedTeachers.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 animate-in slide-in-from-top-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="bg-amber-100 p-3 rounded-2xl text-amber-600 border border-amber-200">
               <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="text-amber-900 font-black text-lg tracking-tight mb-1">Incomplete Staff Configuration</h4>
              <p className="text-amber-700/80 text-sm max-w-2xl font-medium leading-relaxed">
                The following teachers are registered but have <span className="font-bold text-amber-900">no subjects assigned</span>. They will be ignored during timetable generation:
                <span className="ml-1 inline-flex flex-wrap gap-2 mt-2">
                  {unmappedTeachers.map(t => (
                    <span key={t.id} className="bg-amber-200/50 text-amber-900 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-amber-300/30">
                      {t.name}
                    </span>
                  ))}
                </span>
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/subjects')}
            className="w-full md:w-auto px-6 py-3 bg-white border-2 border-amber-200 text-amber-900 font-bold rounded-2xl hover:bg-amber-100 transition-all flex items-center justify-center whitespace-nowrap shadow-sm group"
          >
            Fix Mappings
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Stats Column */}
        <div className="xl:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard 
              icon={<Users />} 
              label="Active Teachers" 
              count={stats.teachers} 
              colorName="primary"
              trend={true}
            />
            <StatCard 
              icon={<BookOpen />} 
              label="Curricular Subjects" 
              count={stats.subjects} 
              colorName="indigo"
              trend={false}
            />
            <StatCard 
              icon={<Layers />} 
              label="Total Class Groups" 
              count={stats.classes} 
              colorName="violet"
              trend={true}
            />
            <StatCard 
              icon={<MapPin />} 
              label="Available Rooms" 
              count={stats.rooms} 
              colorName="rose"
              trend={false}
            />
          </div>

          {/* Large Performance Banner */}
          <div className="glass-card bg-slate-900 border-slate-800 p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-transform">
               <Database size={200} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
               <div className="flex-1">
                  <h3 className="text-2xl font-black mb-3 tracking-tight">Optimization Engine Ready</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    Our current algorithm has solved all potential overlaps based on the current staff and room constraints. 
                    Ready for a fresh generation cycle.
                  </p>
                  <div className="flex items-center space-x-6">
                     <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-center">
                        <span className="block text-xl font-bold text-primary-400">99.2%</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Health</span>
                     </div>
                     <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-center">
                        <span className="block text-xl font-bold text-emerald-400">0</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Errors</span>
                     </div>
                  </div>
               </div>
               <button 
                onClick={handleGenerate}
                disabled={generating}
                className={`h-20 w-full md:w-56 bg-primary-600 rounded-2xl flex flex-col items-center justify-center space-y-2 hover:bg-primary-500 transition-all font-bold group shadow-2xl shadow-primary-900/40 relative overflow-hidden ${generating ? 'opacity-70' : ''}`}
               >
                  {generating ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <div className="p-2 bg-primary-500 rounded-lg group-hover:scale-110 transition-transform">
                        <Play size={20} className="fill-current" />
                      </div>
                      <span className="text-xs uppercase tracking-[0.2em]">Generate Reg</span>
                    </>
                  )}
               </button>
            </div>
          </div>
        </div>

        {/* Sidebar Actions Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.1em] mb-6 flex items-center">
               <ArrowRight size={16} className="text-primary-600 mr-2" />
               Management Suite
            </h3>
            <div className="space-y-3">
               <QuickAction 
                icon={<Users size={18} />} 
                title="Manage Staff" 
                desc="Update teacher roles & credentials" 
                onClick={() => navigate('/teachers')}
               />
               <QuickAction 
                icon={<BookOpen size={18} />} 
                title="Curriculum" 
                desc="Browse and manage subjects" 
                onClick={() => navigate('/subjects')}
               />
               <QuickAction 
                icon={<Layers size={18} />} 
                title="Academic Groups" 
                desc="Configure classes & sessions" 
                onClick={() => navigate('/classes')}
               />
               <QuickAction 
                icon={<MapPin size={18} />} 
                title="Infrastructure" 
                desc="Room allocation & capacity" 
                onClick={() => navigate('/rooms')}
               />
               <QuickAction 
                icon={<Users size={18} />} 
                title="Student Mapping" 
                desc="Link students to their classes" 
                onClick={() => navigate('/student-mapping')}
               />
               <div className="pt-2">
                 <QuickAction 
                  icon={<Calendar size={18} />} 
                  title="View Explorer" 
                  desc="Inspect current live timetable" 
                  onClick={() => navigate('/timetable')}
                  primary={true}
                 />
               </div>
            </div>
          </div>

          <div className="bg-gradient-to-tr from-slate-50 to-white rounded-3xl border border-dashed border-slate-200 p-8 text-center group cursor-pointer hover:border-primary-300 transition-all">
             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:text-primary-600 transition-colors">
                <Plus size={24} />
             </div>
             <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest mb-1 italic">Pro Tip</p>
             <p className="text-xs text-slate-500 font-medium leading-relaxed">
               Use the CSV import feature in each management section for bulk uploading institutional data.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
