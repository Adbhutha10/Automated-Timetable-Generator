import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.result.role)) {
    // Redirect based on their role if they try to access an unauthorized route
    const roleRedirects = {
      ADMIN: '/admin-dashboard',
      TEACHER: '/teacher-view',
      STUDENT: '/student-view'
    };
    return <Navigate to={roleRedirects[user.result.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
