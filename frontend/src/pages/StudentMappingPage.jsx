import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  Users,
  Search, 
  ChevronRight, 
  CheckCircle2,
  Filter,
  ArrowLeft,
  BookOpen,
  Mail,
  ShieldAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentMappingPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userResp, classResp] = await Promise.all([
        api.get('/users'),
        api.get('/classes')
      ]);
      // Filter for students only
      const studentList = userResp.data.filter(u => u.role === 'STUDENT');
      setStudents(studentList);
      setClasses(classResp.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMapping = async (userId, classId) => {
    try {
      const cid = classId === "" ? null : parseInt(classId);
      await api.put(`/users/${userId}`, { class_id: cid });
      setMessage('Student mapping updated successfully!');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update mapping', err);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 py-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button 
            onClick={() => navigate('/admin')}
            className="flex items-center text-slate-400 hover:text-primary-600 transition-colors mb-4 text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={14} className="mr-2" />
            Back to Dashboard
          </button>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 font-mono flex items-center">
            <Users size={28} className="mr-3 text-primary-600" />
            Student-Class Mapping
          </h2>
          <p className="text-slate-500 max-w-2xl font-medium">
            Assign registered students to their target classes. This secures their dashboard so they only see their own schedules.
          </p>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 p-4 rounded-2xl flex items-center space-x-3 shadow-sm animate-in slide-in-from-top-4">
          <CheckCircle2 size={20} />
          <span className="font-bold text-sm tracking-tight">{message}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search students by name or email..."
            className="input-field w-full pl-12 h-14 bg-white border-slate-100 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl px-6 h-14 flex items-center shadow-sm">
           <Filter size={18} className="text-slate-400 mr-2" />
           <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Filter: Students</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-card overflow-hidden border border-slate-100 p-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Student Details</th>
                <th className="px-8 py-5 text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Current Mapping</th>
                <th className="px-8 py-5 text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] text-right">Update Class Assignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-8 py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-6"></div>
                      <span className="font-bold text-sm uppercase tracking-widest">Loading Profiles...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-8 py-20 text-center text-slate-400 font-medium">
                    <ShieldAlert size={48} className="mx-auto mb-4 opacity-10" />
                    No registered students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold mr-4 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                           {student.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 tracking-tight">{student.name || 'Anonymous User'}</p>
                          <p className="text-xs text-slate-400 flex items-center">
                             <Mail size={12} className="mr-1" />
                             {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       {student.class_id ? (
                         <div className="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary-100">
                            <BookOpen size={12} className="mr-1.5" />
                            {classes.find(c => c.id === student.class_id)?.name || 'Unknown Class'}
                         </div>
                       ) : (
                         <div className="inline-flex items-center px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-100 italic">
                            Unassigned
                         </div>
                       )}
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="relative inline-block w-64">
                         <select
                           className="input-field w-full h-11 pl-4 pr-10 appearance-none font-bold text-xs cursor-pointer border-slate-200 group-hover:border-primary-300 shadow-sm"
                           value={student.class_id || ''}
                           onChange={(e) => handleUpdateMapping(student.id, e.target.value)}
                         >
                           <option value="">-- No Class Assignment --</option>
                           {classes.map(c => (
                             <option key={c.id} value={c.id}>{c.name}</option>
                           ))}
                         </select>
                         <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary-400">
                             <ChevronRight size={16} className="rotate-90" />
                         </div>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-primary-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-primary-900/20">
         <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform rotate-12">
            <ShieldAlert size={120} />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 uppercase tracking-[0.1em]">
            <div className="max-w-xl">
               <h3 className="text-lg font-black mb-2">Secure Link Verification</h3>
               <p className="text-primary-100 text-xs font-bold leading-relaxed opacity-80">
                  By mapping a student to a class, you are granting them exclusive access to that specific timetable. 
                  They will no longer be able to browse other class schedules.
               </p>
            </div>
            <div className="px-6 py-3 bg-primary-500 rounded-2xl flex items-center font-black text-xs">
               <CheckCircle2 size={16} className="mr-2" />
               Logic Validated
            </div>
         </div>
      </div>
    </div>
  );
};

export default StudentMappingPage;
