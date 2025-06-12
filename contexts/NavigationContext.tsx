
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavigationContextType {
  currentSection: string; // Corresponds to path segment, e.g., 'dashboard', 'pos'
  navigateTo: (sectionPath: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Current section can be derived from react-router's location if needed,
  // but for direct control from sidebar or kiosk cards, an explicit state can be simpler.
  // However, with HashRouter, using useNavigate is the standard.
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('dashboard'); // Default or derive from path

  const navigateTo = (sectionPath: string) => {
    const path = sectionPath.startsWith('/') ? sectionPath : `/${sectionPath}`;
    setCurrentSection(sectionPath); // Keep local track if needed, or rely on router
    navigate(path);
  };

  return (
    <NavigationContext.Provider value={{ currentSection, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
