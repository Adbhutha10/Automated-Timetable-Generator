import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Layers, 
  Home, 
  Clock, 
  Calendar,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import ManagementPage from './pages/ManagementPage';
import TimetablePage from './pages/TimetablePage';

const SidebarLink = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
      {isActive && <ChevronRight size={16} className="ml-auto" />}
    </Link>
  );
};

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#0f172a] text-slate-200 w-full">
        {/* Sidebar */}
        <div className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 flex flex-col gap-8 fixed h-full">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Calendar className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Schedulify
            </span>
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" />
            <SidebarLink to="/teachers" icon={Users} label="Teachers" />
            <SidebarLink to="/subjects" icon={BookOpen} label="Subjects" />
            <SidebarLink to="/classes" icon={Layers} label="Classes" />
            <SidebarLink to="/rooms" icon={Home} label="Rooms" />
            <SidebarLink to="/timeslots" icon={Clock} label="Timeslots" />
            <SidebarLink to="/timetable" icon={Calendar} label="Timetable" />
          </nav>

          <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/teachers" element={<ManagementPage title="Teachers" model="teacher" fields={['name', 'email', 'department']} />} />
            <Route path="/subjects" element={<ManagementPage title="Subjects" model="subject" fields={['name', 'department', 'hours_per_week']} />} />
            <Route path="/classes" element={<ManagementPage title="Classes" model="class" fields={['name']} />} />
            <Route path="/rooms" element={<ManagementPage title="Rooms" model="room" fields={['room_number', 'capacity']} />} />
            <Route path="/timeslots" element={<ManagementPage title="Timeslots" model="timeslot" fields={['day', 'start_time', 'end_time']} />} />
            <Route path="/timetable" element={<TimetablePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
