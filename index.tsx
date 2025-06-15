import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './src/index.css';
import App from './App';

import { NavigationProvider } from './contexts/NavigationContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <NavigationProvider>
        <App />
      </NavigationProvider>
    </HashRouter>
  </React.StrictMode>
);

// Global styles for animations - moved from Toast.tsx
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scan-line-anim {
    0% { transform: translateY(0%); }
    100% { transform: translateY(calc(100% - 2px)); }
  }
  .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
  .text-xxs { font-size: 0.65rem; line-height: 0.8rem; }
  .custom-scrollbar::-webkit-scrollbar {
    inline-size: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--theme-text-muted);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--theme-text-secondary);
  }
`;
document.head.appendChild(style);
