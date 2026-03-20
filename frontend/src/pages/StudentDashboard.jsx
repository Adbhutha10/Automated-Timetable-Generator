import React, { useState, useEffect } from 'react';
import api from '../api';
import { Calendar, Clock, MapPin, Search, ChevronRight, BookOpen } from 'lucide-react';

const StudentDashboard = () => {
  const [timetable, setTimetable] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [loading, setLoading] = useState(true);

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
    const fetchClasses = async () => {
      try {
        const { data } = await api.get('/classes');
        setClasses(data);
        if (data.length > 0) setSelectedClassId(data[0].id);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      const fetchTimetable = async () => {
        try {
          const { data } = await api.get(`/timetable/class/${selectedClassId}`);
          setTimetable(data);
        } catch (error) {
          console.error('Error fetching timetable:', error);
        }
      };
      fetchTimetable();
    }
  }, [selectedClassId]);

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Class Schedule</h2>
          <p className="text-slate-500">Stay organized with your up-to-date weekly class registry.</p>
        </div>
        <div className="w-full md:w-64">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">Select Your Class</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              className="input-field w-full pl-12 h-12 appearance-none cursor-pointer font-bold text-slate-700"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronRight size={18} className="rotate-90" />
            </div>
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
                                Prof. {entry.teacher.name}
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

export default StudentDashboard;
