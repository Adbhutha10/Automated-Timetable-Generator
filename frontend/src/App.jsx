import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Layers, 
  MapPin, 
  Clock, 
  Calendar, 
  LogOut,
  ChevronRight,
  Home as HomeIcon,
  Menu,
  X
} from 'lucide-react';

import { Navigate } from 'react-router-dom';

import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ManagementPage from './pages/ManagementPage';
import TimetablePage from './pages/TimetablePage';
import StudentMappingPage from './pages/StudentMappingPage';

const DashboardRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return <Home />;
  
  const roleRedirects = {
    ADMIN: '/admin-dashboard',
    TEACHER: '/teacher-view',
    STUDENT: '/student-view'
  };
  
  return <Navigate to={roleRedirects[user.result.role] || '/'} replace />;
};

const App = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/admin-dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', roles: ['ADMIN'] },
    { to: '/teacher-view', icon: <LayoutDashboard size={20} />, label: 'My Schedule', roles: ['TEACHER'] },
    { to: '/student-view', icon: <LayoutDashboard size={20} />, label: 'Class Schedule', roles: ['STUDENT'] },
    { to: '/teachers', icon: <Users size={20} />, label: 'Teachers', roles: ['ADMIN'] },
    { to: '/subjects', icon: <BookOpen size={20} />, label: 'Subjects', roles: ['ADMIN'] },
    { to: '/classes', icon: <Layers size={20} />, label: 'Classes', roles: ['ADMIN'] },
    { to: '/rooms', icon: <MapPin size={20} />, label: 'Rooms', roles: ['ADMIN'] },
    { to: '/timeslots', icon: <Clock size={20} />, label: 'Timeslots', roles: ['ADMIN'] },
    { to: '/timetable', icon: <Calendar size={20} />, label: 'Explorer', roles: ['ADMIN'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.roles || (user && item.roles.includes(user.result.role))
  );

  const isAuthPage = ['/login', '/signup', '/'].includes(location.pathname);

  if (!user && isAuthPage) {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Redirect to dashboard if trying to access auth pages while logged in
  if (user && isAuthPage && location.pathname !== '/') {
    const roleRedirects = {
      ADMIN: '/admin-dashboard',
      TEACHER: '/teacher-view',
      STUDENT: '/student-view'
    };
    return <Navigate to={roleRedirects[user.result.role] || '/'} replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Mobile Top Bar */}
      {user && location.pathname !== '/' && (
        <div className="md:hidden fixed top-0 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200 h-16 z-30 flex items-center justify-between px-4">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Calendar className="text-white" size={18} />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">Schedulify</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      {/* Mobile Overlay */}
      {user && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - only show if user is logged in and not on a public page */}
      {user && (
        <aside className={`w-64 bg-white/70 backdrop-blur-xl border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-40 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <div className="p-8">
            <div className="hidden md:flex items-center space-x-3 mb-10 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/20">
                <Calendar className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Schedulify
              </h1>
            </div>

            <nav className="space-y-1">
              {filteredNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                      <ChevronRight 
                        className={`ml-auto transition-all ${isActive ? 'opacity-50' : 'opacity-0'}`} 
                        size={16} 
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-8 border-t border-slate-100">
            <div className="mb-4 px-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Logged in as</p>
                <p className="text-sm font-bold text-slate-900 truncate">{user.result.name || user.result.email}</p>
                <p className="text-[10px] font-medium text-primary-600 uppercase">{user.result.role}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 text-slate-500 hover:text-rose-600 transition-colors w-full px-4 py-2 group"
            >
              <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>
      )}


      {/* Main Content */}
      <main className={`flex-1 ${user ? 'md:ml-64' : ''} p-4 pt-20 md:p-8 md:pt-8 w-full`}>
        <div className="max-w-7xl mx-auto h-full">
          <Routes>
            <Route path="/" element={<DashboardRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/teachers" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ManagementPage type="teachers" label="Teachers" />
              </ProtectedRoute>
            } />
            <Route path="/subjects" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ManagementPage type="subjects" label="Subjects" />
              </ProtectedRoute>
            } />
            <Route path="/classes" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ManagementPage type="classes" label="Classes" />
              </ProtectedRoute>
            } />
            <Route path="/rooms" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ManagementPage type="rooms" label="Rooms" />
              </ProtectedRoute>
            } />
            <Route path="/timeslots" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ManagementPage type="timeslots" label="Timeslots" />
              </ProtectedRoute>
            } />
            <Route path="/timetable" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <TimetablePage />
              </ProtectedRoute>
            } />

            {/* Teacher Routes */}
            <Route path="/teacher-view" element={
              <ProtectedRoute allowedRoles={['TEACHER']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } />

            {/* Student Routes */}
            <Route path="/student-view" element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student-mapping" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <StudentMappingPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
};


export default App;
