import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../util';
import { PrivateRouteProps } from '../../types/interfaces';

// PrivateRoute component to protect routes that require authentication
const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Component, ...rest }) => {
  // Get the current user from the authentication context
  const { currentUser } = useAuth();

  // If the user is authenticated, render the component with the passed props
  // Otherwise go to the login page
  return currentUser ? <Component {...rest} /> : <Navigate to="/login" />;
};

// Export the PrivateRoute component as the default export
export default PrivateRoute;