import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import Spinner from "../components/spinner";

// Higher-order component to protect routes
const withAuth = (WrappedComponent: React.FC) => {
  // Component to handle authentication logic
  const ProtectedRoute: React.FC = (props) => {
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [authenticated, setAuthenticated] = useState(false); // State to manage authentication status
    const navigate = useNavigate(); // Hook to navigate programmatically

    // Effect to check authentication status on component mount
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setAuthenticated(true); // User is authenticated
        } else {
          navigate("/login"); // Redirect to login if not authenticated
        }
        setLoading(false); // Set loading to false after checking auth status
      });

      return () => unsubscribe(); // Cleanup subscription on unmount
    }, [navigate]);

    // Show loading indicator while checking authentication status
    if (loading) {
      return <div>Loading...</div>;
    }

    // Show spinner if not authenticated
    if (!authenticated) {
        return <Spinner />;
    }

    // Render the wrapped component if authenticated
    return <WrappedComponent {...props} />;
  };

  return ProtectedRoute; // Return the protected route component
};

export default withAuth;