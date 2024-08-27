import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the possible language types
type Language = 'en' | 'fr' | 'de';

// Define the shape of the context value
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

// Create the context with an undefined initial value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component to wrap the application and provide the language context
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Effect to save the language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    // Provide the language and setLanguage function to the context
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;