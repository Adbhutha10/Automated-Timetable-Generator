import React, { useState, useEffect } from 'react';
import api from '../api';
import { Calendar, Clock, MapPin, Search, ChevronRight, BookOpen, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(user?.result?.class_id || '');
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [timeslots, setTimeslots] = useState([]);

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

    const fetchTimeslots = async () => {
      try {
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
      } catch (err) {
        console.error('Failed to fetch timeslots:', err);
      }
    };

    fetchClasses();
    fetchTimeslots();
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

  const getEntry = (day, slot) => {
    return timetable.find(t => 
      t.timeslot.day === day && 
      t.timeslot.start_time === slot.start_time && 
      t.timeslot.end_time === slot.end_time
    );
  };

  const exportPDF = () => {
    const selectedClass = classes.find(c => c.id == selectedClassId);
    const doc = new jsPDF('landscape');
    const title = `Class Timetable - ${selectedClass?.name || 'Schedule'}`;
    
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

    const tableRows = [];

    days.forEach((day) => {
      const row = [ day ];
      let colSkip = 0;

      timeslots.forEach((slot, colIndex) => {
        if (colSkip > 0) {
          colSkip--;
          return;
        }

        const entry = getEntry(day, slot);
        if (entry) {
          let span = 1;
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
              colSkip = 2;
            }
          }

          const content = `${entry.subject.name}\nProf: ${entry.teacher.name}\nRoom: ${entry.room.room_number}`;
          if (span > 1) {
            row.push({ 
              content, 
              colSpan: span,
              styles: { fillColor: [249, 250, 251], fontStyle: 'bold', halign: 'center', valign: 'middle' }
            });
          } else {
            row.push(content);
          }
        } else {
          row.push('-');
        }
      });
      tableRows.push(row);
    });

    autoTable(doc, {
      head: [['Day', ...timeslots.map(s => s.start_time)]],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 8, cellPadding: 2, halign: 'center' },
      columnStyles: { 0: { fontStyle: 'bold', width: 25, halign: 'left' } },
      headStyles: { fillStyle: 'F', fillColor: [99, 102, 241], textColor: [255, 255, 255] },
    });

    doc.save(`timetable_${selectedClass?.name || 'class'}.pdf`);
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
        <div className="flex flex-col md:flex-row items-end gap-4">
          {!selectedClassId ? (
            <div className="bg-amber-50 border border-amber-200 px-4 py-3 rounded-2xl flex items-center text-amber-700 text-sm font-bold">
              <Search size={18} className="mr-2" />
              Not assigned to any class. Contact Admin.
            </div>
          ) : (
            <>
              <div className="bg-primary-50 px-4 py-2 rounded-xl border border-primary-100 flex items-center h-12 shadow-sm">
                <BookOpen size={18} className="text-primary-600 mr-2" />
                <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">
                  My Class: {classes.find(c => c.id == selectedClassId)?.name || 'Loading...'}
                </span>
              </div>
              <button onClick={exportPDF} className="btn-primary flex items-center h-12 shadow-lg shadow-primary-900/20 px-6">
                <Download size={18} className="mr-2" />
                Export PDF
              </button>
            </>
          )}
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
                                  Prof. {entry.teacher.name}
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

export default StudentDashboard;
