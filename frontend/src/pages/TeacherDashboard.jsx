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
  const timeslots = [
    { id: 1, start_time: '09:20', end_time: '10:10', label: 'Period 1' },
    { id: 2, start_time: '10:10', end_time: '11:00', label: 'Period 2' },
    { id: 3, start_time: '11:10', end_time: '12:00', label: 'Period 3' },
    { id: 4, start_time: '12:00', end_time: '12:50', label: 'Period 4' },
    { id: 5, start_time: '13:30', end_time: '14:20', label: 'Period 5' },
    { id: 6, start_time: '14:20', end_time: '15:10', label: 'Period 6' },
    { id: 7, start_time: '15:10', end_time: '15:50', label: 'Period 7' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Find teacher by email
        const { data: teachers } = await api.get('/teachers');
        const currentTeacher = teachers.find(t => t.email === user.result.email);

        if (currentTeacher) {
          setTeacher(currentTeacher);
          const { data: schedule } = await api.get(`/timetable/teacher/${currentTeacher.id}`);
          setTimetable(schedule);
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const getEntry = (day, timeslotId) => {
    return timetable.find(t => t.timeslot.day === day && t.timeslot_id === timeslotId);
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
                <th className="p-6 text-slate-500 font-bold uppercase text-xs w-32 tracking-wider">Time</th>
                {days.map(day => (
                  <th key={day} className="p-6 text-slate-500 font-bold uppercase text-xs text-center border-l border-slate-200 tracking-wider">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timeslots.map((slot) => (
                <tr key={slot.id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="p-6 align-top">
                    <span className="text-slate-900 font-bold block">{slot.start_time}</span>
                    <span className="text-slate-500 text-xs font-medium">{slot.end_time}</span>
                  </td>
                  {days.map(day => {
                    const entry = getEntry(day, slot.id);
                    return (
                      <td key={`${day}-${slot.id}`} className="p-3 border-l border-slate-100 align-top h-32">
                        {entry ? (
                          <div className="h-full p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between group/entry hover:border-primary-300 hover:shadow-md transition-all cursor-pointer">
                            <div>
                              <div className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-1.5 px-2 py-0.5 bg-primary-50 rounded-full w-fit">
                                {entry.subject.name}
                              </div>
                              <div className="text-sm font-bold text-slate-900 leading-snug px-1">
                                {entry.class.name}
                              </div>
                            </div>
                            <div className="flex items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-3 px-1">
                              <MapPin size={10} className="mr-1.5 text-slate-300" />
                              Room {entry.room.room_number}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
