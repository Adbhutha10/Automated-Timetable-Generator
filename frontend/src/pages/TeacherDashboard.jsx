import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Calendar, Clock, MapPin, Download, Printer, User } from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [timeslots, setTimeslots] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Teacher info
        const { data: teachers } = await api.get('/teachers');
        const currentTeacher = teachers.find(t => t.email === user.result.email);

        if (currentTeacher) {
          setTeacher(currentTeacher);
          const { data: schedule } = await api.get(`/timetable/teacher/${currentTeacher.id}`);
          setTimetable(schedule);
        }

        // 2. Fetch Timeslots
        const resp = await api.get('/timeslots');
        const seen = new Set();
        const unique = resp.data
          .filter(t => {
            const key = `${t.start_time}-${t.end_time}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          .sort((a, b) => a.start_time.localeCompare(b.start_time));
        setTimeslots(unique);

      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const getEntry = (day, slot) => {
    return timetable.find(t => 
      t.timeslot.day === day && 
      t.timeslot.start_time === slot.start_time && 
      t.timeslot.end_time === slot.end_time
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="glass-card p-12 text-center border-slate-200">
        <User size={64} className="text-slate-200 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Teacher Record Not Found</h2>
        <p className="text-slate-500">Please contact the admin to link your account ({user.result.email}) to the teacher registry.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Personal Schedule</h2>
          <p className="text-slate-500">Welcome, Professor <span className="text-primary-600 font-bold">{teacher.name}</span>. Here is your weekly agenda.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => window.print()} className="btn-secondary flex items-center">
            <Printer size={18} className="mr-2" />
            Print Schedule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Department</span>
            <span className="block text-lg font-bold text-slate-900">{teacher.department}</span>
          </div>
        </div>
        <div className="glass-card p-6 border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Sessions</span>
            <span className="block text-lg font-bold text-slate-900">{timetable.length} per week</span>
          </div>
        </div>
        <div className="glass-card p-6 border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <MapPin size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Main Room</span>
            <span className="block text-lg font-bold text-slate-900">{timetable[0]?.room?.room_number || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-6 text-slate-500 font-bold uppercase text-xs w-32 tracking-wider">Day</th>
                {timeslots.map(slot => (
                  <th key={`${slot.start_time}-${slot.end_time}`} className="p-6 text-slate-500 font-bold uppercase text-xs text-center border-l border-slate-200 tracking-wider">
                    {slot.start_time}
                    <span className="block text-[8px] opacity-60 normal-case">{slot.end_time}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {days.map((day) => {
                let colSkips = 0;
                return (
                  <tr key={day} className="group">
                    <td className="p-6 bg-slate-50/50 border-r border-slate-100 align-top font-bold text-slate-900 border-b border-slate-100">
                      {day}
                    </td>
                    {timeslots.map((slot, colIndex) => {
                      if (colSkips > 0) {
                        colSkips--;
                        return null;
                      }

                      const entry = getEntry(day, slot);
                      let span = 1;

                      if (entry) {
                        const isLab = entry.subject.name.toLowerCase().includes('lab');
                        const isProject = entry.subject.name.toLowerCase().includes('project');

                        if (isLab || isProject) {
                           let matchCount = 0;
                           for (let j = 1; j <= 2; j++) {
                             const nextSlot = timeslots[colIndex + j];
                             if (nextSlot) {
                               const nextEntry = getEntry(day, nextSlot);
                               if (nextEntry && nextEntry.subject_id === entry.subject_id) {
                                 matchCount++;
                               } else {
                                 break;
                               }
                             }
                           }
                           if (matchCount === 2) {
                             span = 3;
                             colSkips = 2;
                           }
                        }
                      }

                      return (
                        <td 
                          key={`${day}-${slot.start_time}`} 
                          colSpan={span}
                          className={`p-3 border-l border-slate-100 align-top h-32 group-hover:bg-slate-50/30 transition-colors ${span > 1 ? 'min-w-[400px]' : 'min-w-[150px]'}`}
                        >
                          {entry ? (
                            <div className={`h-full p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between group/entry hover:border-primary-300 hover:shadow-md transition-all cursor-pointer ${span > 1 ? 'bg-indigo-50/10 border-indigo-200 items-center text-center' : ''}`}>
                              <div className={span > 1 ? 'flex flex-col items-center' : ''}>
                                <div className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 px-2 py-0.5 rounded-full w-fit ${span > 1 ? 'bg-indigo-100 text-indigo-700 mx-auto' : 'bg-primary-50 text-primary-600'}`}>
                                  {entry.subject.name}
                                </div>
                                <div className="text-sm font-bold text-slate-900 leading-snug px-1">
                                  {entry.class.name}
                                </div>
                              </div>
                              <div className={`flex items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-3 px-1 ${span > 1 ? 'justify-center' : ''}`}>
                                <MapPin size={10} className="mr-1.5 text-slate-300" />
                                {entry.room.room_number}
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
