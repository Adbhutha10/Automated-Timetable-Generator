import { useState, useEffect } from 'react';
import { Calendar, Filter, Download, User, Home, BookOpen } from 'lucide-react';
import api from '../api';

const TimetablePage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      const res = await api.get('/classes');
      setClasses(res.data);
      if (res.data.length > 0) setSelectedClass(res.data[0].id);
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchTimetable();
    }
  }, [selectedClass]);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/timetable/class/${selectedClass}`);
      setTimetable(res.data);
    } catch (err) {
      console.error("Failed to fetch timetable");
    } finally {
      setLoading(false);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Group by day and slot
  const organizedData = {};
  days.forEach(day => {
    organizedData[day] = timetable.filter(entry => entry.timeslot.day === day);
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Timetable View</h1>
          <p className="text-slate-400">View and export class schedules.</p>
        </div>
        <div className="flex gap-3">
          <select 
            className="input-field bg-slate-800"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
            <Download size={20} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {days.map(day => (
          <div key={day} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-primary-400 font-bold uppercase tracking-wider text-sm border-l-2 border-primary-500 pl-3">
              <Calendar size={16} />
              {day}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {organizedData[day].length > 0 ? (
                organizedData[day].sort((a,b) => a.timeslot.start_time.localeCompare(b.timeslot.start_time)).map(entry => (
                  <div key={entry.id} className="card !p-4 hover:border-white/20 transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold text-primary-500 bg-primary-500/10 px-2 py-1 rounded">
                        {entry.timeslot.start_time} - {entry.timeslot.end_time}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-white font-bold">
                        <BookOpen size={16} className="text-slate-400" />
                        {entry.subject.name}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <User size={14} />
                        {entry.teacher.name}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Home size={14} />
                        Room: {entry.room.room_number}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full h-24 flex items-center justify-center rounded-xl border border-dashed border-slate-700 text-slate-600">
                  No classes scheduled for {day}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimetablePage;
