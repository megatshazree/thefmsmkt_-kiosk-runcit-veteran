/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Background System
        'theme-bg-deep-space': '#0F0F0F',
        'theme-panel-bg': '#1A1A1A',
        'theme-panel-bg-alt': '#2A2A2A',
        'theme-input-bg': '#161616',
        
        // Brand Colors - Vibrant Palette
        'theme-bootcamp': '#6366F1',
        'theme-open-campus': '#EC4899',
        'theme-competition': '#F97316',
        'theme-acceleration': '#10B981',
        
        // Legacy aliases
        'theme-accent-purple': '#6366F1',
        'theme-accent-magenta': '#EC4899',
        'theme-accent-cyan': '#10B981',
        
        // Text System
        'theme-text-primary': '#FFFFFF',
        'theme-text-secondary': '#E5E5E5',
        'theme-text-muted': '#9CA3AF',
        'theme-border-color': '#404040',
        'theme-focus-ring': '#10B981',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
