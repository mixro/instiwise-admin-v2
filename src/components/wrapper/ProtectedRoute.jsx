// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import Layout from '../ui/layout/Layout';

// This component takes the element (the page component) as a prop.
const ProtectedRoute = ({ children }) => {
  const isAdmin = false;

  if (!isAdmin) {
    // If not an admin, redirect them to the login page
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children wrapped in the Layout
  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;