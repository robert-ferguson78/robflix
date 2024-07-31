import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import Spinner from "../components/spinner";

const withAuth = (WrappedComponent: React.FC) => {
  const ProtectedRoute: React.FC = (props) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setAuthenticated(true);
        } else {
          navigate("/login");
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, [navigate]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!authenticated) {
        return <Spinner />;
    }

    return <WrappedComponent {...props} />;
  };

  return ProtectedRoute;
};

export default withAuth;