import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'cosy-dark' | 'cosy-light' | 'vibrant-dark' | 'vibrant-light';

interface ThemeConfig {
  name: string;
  displayName: string;
  colors: {
    // Background system
    bgDeepSpace: string;
    panelBg: string;
    panelBgAlt: string;
    inputBg: string;
    
    // Text system
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    borderColor: string;
    focusRing: string;
    
    // Brand colors
    bootcamp: string;
    openCampus: string;
    competition: string;
    acceleration: string;
    
    // Status colors
    success: string;
    warning: string;
    danger: string;
    info: string;
    
    // Accent colors
    accentPrimary: string;
    accentSecondary: string;
  };
  gradients: {
    bootcamp: string;
    campus: string;
    competition: string;
    acceleration: string;
  };
}

const themes: Record<ThemeMode, ThemeConfig> = {
  'cosy-dark': {
    name: 'cosy-dark',
    displayName: 'CosyPOS Dark',
    colors: {
      bgDeepSpace: '#0F0F0F',
      panelBg: '#1A1A1A',
      panelBgAlt: '#2A2A2A',
      inputBg: '#161616',
      textPrimary: '#FFFFFF',
      textSecondary: '#E5E5E5',
      textMuted: '#9CA3AF',
      borderColor: '#404040',
      focusRing: '#6366F1',
      bootcamp: '#A78BFA',
      openCampus: '#F472B6',
      competition: '#FB923C',
      acceleration: '#34D399',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#3B82F6',
      accentPrimary: '#6366F1',
      accentSecondary: '#EC4899',
    },
    gradients: {
      bootcamp: 'linear-gradient(135deg, #A78BFA 0%, #6366F1 100%)',
      campus: 'linear-gradient(135deg, #F472B6 0%, #EC4899 100%)',
      competition: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
      acceleration: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
    },
  },
  'cosy-light': {
    name: 'cosy-light',
    displayName: 'CosyPOS Light',
    colors: {
      bgDeepSpace: '#FFFFFF',
      panelBg: '#F8FAFC',
      panelBgAlt: '#F1F5F9',
      inputBg: '#FFFFFF',
      textPrimary: '#1F2937',
      textSecondary: '#4B5563',
      textMuted: '#6B7280',
      borderColor: '#E5E7EB',
      focusRing: '#6366F1',
      bootcamp: '#6366F1',
      openCampus: '#EC4899',
      competition: '#F97316',
      acceleration: '#10B981',
      success: '#059669',
      warning: '#D97706',
      danger: '#DC2626',
      info: '#2563EB',
      accentPrimary: '#6366F1',
      accentSecondary: '#EC4899',
    },
    gradients: {
      bootcamp: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      campus: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
      competition: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
      acceleration: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    },
  },
  'vibrant-dark': {
    name: 'vibrant-dark',
    displayName: 'Vibrant Dark',
    colors: {
      bgDeepSpace: '#0F0F0F',
      panelBg: '#1A1A1A',
      panelBgAlt: '#2A2A2A',
      inputBg: '#161616',
      textPrimary: '#FFFFFF',
      textSecondary: '#E5E5E5',
      textMuted: '#9CA3AF',
      borderColor: '#404040',
      focusRing: '#10B981',
      bootcamp: '#6366F1',
      openCampus: '#EC4899',
      competition: '#F97316',
      acceleration: '#10B981',
      success: '#10B981',
      warning: '#F97316',
      danger: '#EF4444',
      info: '#6366F1',
      accentPrimary: '#10B981',
      accentSecondary: '#F97316',
    },
    gradients: {
      bootcamp: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      campus: 'linear-gradient(135deg, #EC4899 0%, #F97316 100%)',
      competition: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
      acceleration: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    },
  },
  'vibrant-light': {
    name: 'vibrant-light',
    displayName: 'Vibrant Light',
    colors: {
      bgDeepSpace: '#FAFAFA',
      panelBg: '#FFFFFF',
      panelBgAlt: '#F4F4F5',
      inputBg: '#FFFFFF',
      textPrimary: '#18181B',
      textSecondary: '#3F3F46',
      textMuted: '#71717A',
      borderColor: '#E4E4E7',
      focusRing: '#10B981',
      bootcamp: '#6366F1',
      openCampus: '#EC4899',
      competition: '#F97316',
      acceleration: '#10B981',
      success: '#059669',
      warning: '#D97706',
      danger: '#DC2626',
      info: '#2563EB',
      accentPrimary: '#10B981',
      accentSecondary: '#F97316',
    },
    gradients: {
      bootcamp: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      campus: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
      competition: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
      acceleration: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    },
  },
};

interface ThemeContextType {
  currentTheme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  theme: ThemeConfig;
  availableThemes: ThemeMode[];
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    return savedTheme && themes[savedTheme] ? savedTheme : 'cosy-dark';
  });

  const setTheme = (theme: ThemeMode) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
  };

  const toggleTheme = () => {
    const themeOrder: ThemeMode[] = ['cosy-dark', 'cosy-light', 'vibrant-dark', 'vibrant-light'];
    const currentIndex = themeOrder.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  const theme = themes[currentTheme];

  // Apply theme to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const colors = theme.colors;
    const gradients = theme.gradients;

    // Background system
    root.style.setProperty('--theme-bg-deep-space', colors.bgDeepSpace);
    root.style.setProperty('--theme-panel-bg', colors.panelBg);
    root.style.setProperty('--theme-panel-bg-alt', colors.panelBgAlt);
    root.style.setProperty('--theme-input-bg', colors.inputBg);

    // Text system
    root.style.setProperty('--theme-text-primary', colors.textPrimary);
    root.style.setProperty('--theme-text-secondary', colors.textSecondary);
    root.style.setProperty('--theme-text-muted', colors.textMuted);
    root.style.setProperty('--theme-border-color', colors.borderColor);
    root.style.setProperty('--theme-focus-ring', colors.focusRing);

    // Brand colors
    root.style.setProperty('--theme-bootcamp', colors.bootcamp);
    root.style.setProperty('--theme-open-campus', colors.openCampus);
    root.style.setProperty('--theme-competition', colors.competition);
    root.style.setProperty('--theme-acceleration', colors.acceleration);

    // Legacy aliases
    root.style.setProperty('--theme-accent-purple', colors.bootcamp);
    root.style.setProperty('--theme-accent-magenta', colors.openCampus);
    root.style.setProperty('--theme-accent-cyan', colors.acceleration);
    root.style.setProperty('--theme-primary-color', colors.accentPrimary);

    // Status colors
    root.style.setProperty('--color-success', colors.success);
    root.style.setProperty('--color-warning', colors.warning);
    root.style.setProperty('--color-danger', colors.danger);
    root.style.setProperty('--color-info', colors.info);

    // Gradients
    root.style.setProperty('--gradient-bootcamp', gradients.bootcamp);
    root.style.setProperty('--gradient-campus', gradients.campus);
    root.style.setProperty('--gradient-competition', gradients.competition);
    root.style.setProperty('--gradient-acceleration', gradients.acceleration);

    // Accent colors
    root.style.setProperty('--theme-accent-primary', colors.accentPrimary);
    root.style.setProperty('--theme-accent-secondary', colors.accentSecondary);
  }, [theme]);

  const contextValue: ThemeContextType = {
    currentTheme,
    setTheme,
    theme,
    availableThemes: Object.keys(themes) as ThemeMode[],
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
