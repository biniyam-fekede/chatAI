import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ element: Element }) => {
  const isLoggedIn = !!localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole'); // Assuming the role is stored in local storage

  if (!isLoggedIn || userRole !== 'admin') {
    return <Navigate to="*" />; // Redirect to homepage if not admin or not logged in
  }

  return <Element />; // Render the passed component correctly
};

export default AdminRoute;
