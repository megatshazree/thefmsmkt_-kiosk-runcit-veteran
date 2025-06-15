import { create } from 'zustand';

interface NavigationState {
  currentSection: string;
  navigateTo: (sectionPath: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentSection: 'dashboard',
  navigateTo: (sectionPath: string) => {
    set({ currentSection: sectionPath });
    // Navigation logic should be handled in the component using react-router's useNavigate
  },
}));
