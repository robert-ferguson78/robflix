import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";

// Define the structure of a navigation entry
interface NavigationEntry {
  pathname: string;
  title: string;
}

// Create the context with an initial empty array
const NavigationHistoryContext = createContext<NavigationEntry[]>([]);

// Define the props for the provider component
interface NavigationHistoryProviderProps {
  children: ReactNode;
}

// Provider component to wrap the application and provide the navigation history context
export const NavigationHistoryProvider: React.FC<NavigationHistoryProviderProps> = ({ children }) => {
  const [history, setHistory] = useState<NavigationEntry[]>([]);
  const location = useLocation();

  // Effect to update the navigation history whenever the location changes
  useEffect(() => {
    const title = document.title; // Get the current page title
    setHistory((prevHistory) => {
      const newHistory = [...prevHistory, { pathname: location.pathname, title }];
      console.log("Navigation History:", newHistory);
      return newHistory;
    });
  }, [location]);

  return (
    // Provide the navigation history to the context
    <NavigationHistoryContext.Provider value={history}>
      {children}
    </NavigationHistoryContext.Provider>
  );
};

// Custom hook to use the navigation history context
export const useNavigationHistoryContext = () => useContext(NavigationHistoryContext);