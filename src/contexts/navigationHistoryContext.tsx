import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface NavigationEntry {
  pathname: string;
  title: string;
}

const NavigationHistoryContext = createContext<NavigationEntry[]>([]);

interface NavigationHistoryProviderProps {
  children: ReactNode;
}

export const NavigationHistoryProvider: React.FC<NavigationHistoryProviderProps> = ({ children }) => {
  const [history, setHistory] = useState<NavigationEntry[]>([]);
  const location = useLocation();

  useEffect(() => {
    const title = document.title; // Get the current page title
    setHistory((prevHistory) => {
      const newHistory = [...prevHistory, { pathname: location.pathname, title }];
      console.log("Navigation History:", newHistory);
      return newHistory;
    });
  }, [location]);

  return (
    <NavigationHistoryContext.Provider value={history}>
      {children}
    </NavigationHistoryContext.Provider>
  );
};

export const useNavigationHistoryContext = () => useContext(NavigationHistoryContext);