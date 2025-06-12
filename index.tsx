
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { CartProvider } from './contexts/CartContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <ToastProvider>
        <LanguageProvider>
          <AuthProvider>
            <NavigationProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </NavigationProvider>
          </AuthProvider>
        </LanguageProvider>
      </ToastProvider>
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
    100% { transform: translateY(calc(100% - 2px)); } /* 2px is h-0.5 for the scan line element */
  }
  .animate-fadeIn { animation: fadeIn 0.3s ease-out; }

  /* Custom text size from ProductSetCard and EInvoiceDisplayModal */
  .text-xxs { font-size: 0.65rem; line-height: 0.8rem; }

  /* Custom scrollbar from CustomerSearchModal and RecallOrderModal */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent; /* Or var(--theme-panel-bg) if you prefer */
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--theme-text-muted); /* Or a specific scrollbar color variable */
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--theme-text-secondary); /* Darker on hover */
  }
`;
document.head.appendChild(style);
