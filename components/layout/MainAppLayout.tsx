
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { PowerIcon, LanguageIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

const MainAppLayout: React.FC = () => {
  const { logout } = useAuth();
  const { language, setLanguage, translate } = useLanguage();
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
    <div className="min-h-screen md:flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* New Top Bar */}
        <header className="bg-[var(--theme-panel-bg)] px-6 py-3 shadow-md flex justify-between items-center border-b border-[var(--theme-border-color)]">
          <button
            onClick={goBack}
            className="text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] p-2 rounded-md flex items-center space-x-1.5 text-sm hover:bg-[var(--theme-panel-bg-alt)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-focus-ring)]"
            aria-label={translate('nav_back_button_aria_label')}
          >
            <ArrowUturnLeftIcon className="h-5 w-5" aria-hidden="true" />
            <span>{translate('nav_back_button')}</span>
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] p-2 rounded-md flex items-center space-x-1.5 text-sm hover:bg-[var(--theme-panel-bg-alt)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-focus-ring)]"
              aria-label={translate('lang_toggle_button')}
            >
              <LanguageIcon className="h-5 w-5" aria-hidden="true" />
              <span>{language === 'ms' ? 'EN' : 'MS'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] p-2 rounded-md flex items-center space-x-1.5 text-sm hover:bg-[var(--theme-panel-bg-alt)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-focus-ring)]"
              aria-label={translate('nav_logout')}
            >
              <PowerIcon className="h-5 w-5" aria-hidden="true" />
              <span>{translate('nav_logout')}</span>
            </button>
          </div>
        </header>
        <main id="content-area" className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto text-[var(--theme-text-primary)] bg-[var(--theme-bg-deep-space)]" role="main">
          <Outlet /> {/* This is where the routed page components will render */}
        </main>
      </div>
    </div>
  );
};

export default React.memo(MainAppLayout);
