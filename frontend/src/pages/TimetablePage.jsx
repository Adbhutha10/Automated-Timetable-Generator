import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Search, 
  Download, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  Printer,
  Plus
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TimetablePage = () => {
  const [viewType, setViewType] = useState('class'); // class, teacher, room
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [days] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
  const [timeslots, setTimeslots] = useState([]);

  useEffect(() => {
    setItems([]);
    setSelectedId('');
    setTimetable([]);
    fetchItems();
    fetchTimeslots();
  }, [viewType]);

  const fetchItems = async () => {
    setItemsLoading(true);
    try {
      const endpoint = viewType === 'class' ? 'classes' : viewType === 'teacher' ? 'teachers' : 'rooms';
      const resp = await api.get(`/${endpoint}`);
      setItems(resp.data);
      if (resp.data.length > 0) setSelectedId(String(resp.data[0].id));
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setItemsLoading(false);
    }
  };

  const fetchTimeslots = async () => {
    try {
      const resp = await api.get('/timeslots');
      // Deduplicate: keep only unique start_time+end_time combinations
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

  useEffect(() => {
    if (selectedId) fetchTimetable();
  }, [selectedId, viewType]);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const resp = await api.get(`/timetable/${viewType}/${selectedId}`);
      setTimetable(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getEntry = (day, slot) => {
    return timetable.find(t => 
      t.timeslot.day === day && 
      t.timeslot.start_time === slot.start_time && 
      t.timeslot.end_time === slot.end_time
    );
  };

  const exportPDF = () => {
    const doc = new jsPDF('landscape');
    const title = `Timetable Registry - ${viewType.toUpperCase()}: ${items.find(i => i.id == selectedId)?.name || items.find(i => i.id == selectedId)?.room_number || selectedId}`;
    
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

    const tableRows = timeslots.map(slot => {
      const row = [ `${slot.start_time} - ${slot.end_time}` ];
      days.forEach(day => {
        const entry = getEntry(day, slot.id);
        if (entry) {
          row.push(`${entry.subject.name}\n${viewType === 'class' ? entry.teacher.name : entry.class.name}\nRoom: ${entry.room.room_number}`);
        } else {
          row.push('-');
        }
      });
      return row;
    });

    doc.autoTable({
      head: [['Time', ...days]],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 8, cellPadding: 2, halign: 'center' },
      columnStyles: { 0: { fontStyle: 'bold', halign: 'left' } },
      headStyles: { fillStyle: 'F', fillColor: [99, 102, 241], textColor: [255, 255, 255] },
    });

    doc.save(`timetable_${viewType}_${selectedId}.pdf`);
  };

  const ViewToggle = ({ type, icon, label }) => (
    <button
      onClick={() => setViewType(type)}
      className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
        viewType === type 
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
          : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="space-y-8 py-4 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Registry Explorer</h2>
          <p className="text-slate-500">View and export conflict-free schedules across the institution.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => window.print()} className="btn-secondary flex items-center">
            <Printer size={18} className="mr-2" />
            Print
          </button>
          <button onClick={exportPDF} className="btn-primary flex items-center shadow-lg shadow-primary-900/20">
            <Download size={18} className="mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      {/* View Switcher & Selector */}
      <div className="flex flex-col md:flex-row gap-6 p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200">
        <div className="flex p-1 gap-2">
          <ViewToggle type="class" icon={<Calendar size={18} />} label="Class View" />
          <ViewToggle type="teacher" icon={<Users size={18} />} label="Staff View" />
          <ViewToggle type="room" icon={<MapPin size={18} />} label="Room View" />
        </div>
      </div>

      <div className="glass-card p-8 flex flex-col md:flex-row items-center gap-8 border border-slate-100">
        <div className="flex-1 w-full">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block ml-1">
            Select {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              className="input-field w-full pl-12 h-12 appearance-none cursor-pointer font-semibold text-slate-800"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              disabled={itemsLoading}
            >
              {itemsLoading && (
                <option value="">Loading...</option>
              )}
              {!itemsLoading && items.length === 0 && (
                <option value="">No {viewType}s found</option>
              )}
              {items.map(item => (
                <option key={item.id} value={String(item.id)}>
                  {item.name || item.room_number || `${viewType} ${item.id}`}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronRight size={18} className="rotate-90" />
            </div>
          </div>
        </div>
        <div className="flex-1 w-full grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-4">
            <div className="p-2.5 bg-primary-100 text-primary-600 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <span className="block text-xs text-slate-500 uppercase font-bold tracking-wider">Total Hours</span>
              <span className="text-lg font-bold text-slate-900">{timetable.length}h / week</span>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-4">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <Plus size={20} />
            </div>
            <div>
              <span className="block text-xs text-slate-500 uppercase font-bold tracking-wider">Utilization</span>
              <span className="text-lg font-bold text-slate-900">High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="glass-card overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr>
                <th className="p-6 bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-xs w-32 tracking-wider">Time</th>
                {days.map(day => (
                  <th key={day} className="p-6 bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-xs text-center border-l border-slate-200 tracking-wider">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timeslots.map((slot) => (
                <tr key={`${slot.start_time}-${slot.end_time}`} className="group">
                  <td className="p-6 bg-slate-50/50 border-r border-slate-100 align-top">
                    <span className="text-slate-900 font-bold block">{slot.start_time}</span>
                    <span className="text-slate-500 text-xs font-medium">{slot.end_time}</span>
                  </td>
                  {days.map(day => {
                    const entry = getEntry(day, slot);
                    return (
                      <td key={`${day}-${slot.start_time}`} className="p-3 border-l border-slate-100 align-top h-32 group-hover:bg-slate-50/30 transition-colors">
                        {entry ? (
                          <div className="h-full p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between group/entry hover:border-primary-300 hover:shadow-md transition-all cursor-pointer">
                            <div>
                              <div className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-1.5 px-2 py-0.5 bg-primary-50 rounded-full w-fit">
                                {entry.subject.name}
                              </div>
                              <div className="text-sm font-bold text-slate-900 leading-snug px-1">
                                {viewType === 'class' ? entry.teacher.name : viewType === 'teacher' ? entry.class.name : entry.class.name}
                              </div>
                            </div>
                            <div className="flex items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-3 px-1">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

};

export default TimetablePage;
