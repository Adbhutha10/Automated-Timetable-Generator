import { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Layers, 
  Home, 
  Plus, 
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../api';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card group hover:border-primary-500/50 transition-all cursor-default">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    teachers: 0,
    subjects: 0,
    classes: 0,
    rooms: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [t, s, c, r] = await Promise.all([
          api.get('/teachers'),
          api.get('/subjects'),
          api.get('/classes'),
          api.get('/rooms')
        ]);
        setStats({
          teachers: t.data.length,
          subjects: s.data.length,
          classes: c.data.length,
          rooms: r.data.length
        });
      } catch (err) {
        console.error("Failed to fetch stats");
      }
    };
    fetchStats();
  }, []);

  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/generate-timetable');
      setResult({ success: true, message: res.data.message });
    } catch (err) {
      setResult({ success: false, message: "Failed to generate timetable. Check constraints." });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Welcome Back, Admin</h1>
        <p className="text-slate-400">Here's what's happening with your schedule today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Teachers" value={stats.teachers} color="blue" />
        <StatCard icon={BookOpen} label="Total Subjects" value={stats.subjects} color="purple" />
        <StatCard icon={Layers} label="Total Classes" value={stats.classes} color="pink" />
        <StatCard icon={Home} label="Total Rooms" value={stats.rooms} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card flex flex-col justify-center items-center text-center p-12 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-20 h-20 bg-primary-600/20 rounded-full flex items-center justify-center mb-6">
            <Zap className="text-primary-500" size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-4">Ready to Optimize?</h2>
          <p className="text-slate-400 mb-8 max-w-sm">
            Generate a conflict-free timetable for all classes using our intelligent scheduling algorithm.
          </p>
          <button 
            onClick={handleGenerate}
            disabled={generating}
            className="btn-primary flex items-center gap-2 px-8 py-3 disabled:opacity-50"
          >
            {generating ? "Generating..." : "Generate Timetable"}
            <Plus size={20} />
          </button>
          
          {result && (
            <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${result.success ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {result.success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="font-medium">{result.message}</span>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {['Teacher', 'Subject', 'Class', 'Room'].map(item => (
              <button key={item} className="flex flex-col items-center gap-3 p-6 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors border border-slate-700">
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center">
                  <Plus size={24} className="text-slate-400" />
                </div>
                <span className="font-medium">Add {item}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
