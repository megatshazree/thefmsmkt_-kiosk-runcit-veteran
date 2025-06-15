import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import { PowerIcon, LanguageIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

const MainAppLayout: React.FC = () => {
  const { logout } = useAuthStore();
  const { language, setLanguage, translate } = useLanguageStore();
  const navigate = useNavigate();

  const toggleLanguage = React.useCallback(() => {
    setLanguage(language === 'ms' ? 'en' : 'ms');
  }, [language, setLanguage]);

  const handleLogout = React.useCallback(() => {
    logout();
  }, [logout]);

  const goBack = React.useCallback(() => {
    navigate(-1);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0 w-full">
        {/* New Top Bar */}
        <header className="bg-[var(--theme-panel-bg)] px-3 sm:px-4 md:px-6 py-2 md:py-3 shadow-md flex justify-between items-center border-b border-[var(--theme-border-color)] shrink-0">
          <button
            type="button"
            onClick={goBack}
            className="text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] p-1.5 md:p-2 rounded-md flex items-center space-x-1 md:space-x-1.5 text-xs md:text-sm hover:bg-[var(--theme-panel-bg-alt)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-focus-ring)]"
            aria-label={translate('nav_back_button_aria_label')}
          >
            <ArrowUturnLeftIcon className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
            <span className="hidden sm:inline">{translate('nav_back_button')}</span>
          </button>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              type="button"
              onClick={toggleLanguage}
              className="text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] p-1.5 md:p-2 rounded-md flex items-center space-x-1 md:space-x-1.5 text-xs md:text-sm hover:bg-[var(--theme-panel-bg-alt)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-focus-ring)]"
              aria-label={translate('lang_toggle_button')}
            >
              <LanguageIcon className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
              <span>{language === 'ms' ? 'EN' : 'MS'}</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] p-1.5 md:p-2 rounded-md flex items-center space-x-1 md:space-x-1.5 text-xs md:text-sm hover:bg-[var(--theme-panel-bg-alt)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-focus-ring)]"
              aria-label={translate('nav_logout')}
            >
              <PowerIcon className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
              <span className="hidden sm:inline">{translate('nav_logout')}</span>
            </button>
          </div>
        </header>
        <main id="content-area" className="flex-1 p-2 sm:p-3 md:p-4 overflow-y-auto text-[var(--theme-text-primary)] bg-[var(--theme-bg-deep-space)] min-h-0" role="main">
          <Outlet /> {/* This is where the routed page components will render */}
        </main>
      </div>
    </div>
  );
};

export default React.memo(MainAppLayout);
