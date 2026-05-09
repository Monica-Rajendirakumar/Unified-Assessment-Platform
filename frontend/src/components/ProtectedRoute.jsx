import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logged in but wrong role -> redirect to their correct dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'Student') return <Navigate to="/dashboard" replace />;
    if (user.role === 'Instructor') return <Navigate to="/instructor-dashboard" replace />;
    if (user.role === 'Admin') return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
