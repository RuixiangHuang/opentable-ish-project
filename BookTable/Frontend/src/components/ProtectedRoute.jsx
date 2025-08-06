import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const userRole = localStorage.getItem('role');

  const isAllowed = Array.isArray(allowedRole)
    ? allowedRole.includes(userRole)
    : userRole === allowedRole;

  if (!isAllowed) {
    return <Navigate to="/denied" replace />;
  }

  return children;
};

export default ProtectedRoute;

