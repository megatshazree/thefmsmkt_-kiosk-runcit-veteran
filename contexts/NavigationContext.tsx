import React, { createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavigationContextType {
  currentSection: string; // Corresponds to path segment, e.g., 'dashboard', 'pos'
  navigateTo: (sectionPath: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// NavigationContext is now deprecated. Use useNavigationStore from store/navigationStore instead.
export const useNavigation = () => { throw new Error('NavigationContext is removed. Use useNavigationStore from store/navigationStore.'); };
export const NavigationProvider = ({ children }: { children: any }) => children;
