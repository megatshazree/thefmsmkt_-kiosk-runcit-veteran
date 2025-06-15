import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguageStore } from '../store/languageStore';
import { useAuthStore } from '../store/authStore';
import { kioskMenuItems } from '../constants/menuItems';
import PageHeader from '../components/common/PageHeader';

const KioskCard: React.FC<{ item: import('../types').KioskMenuItem }> = React.memo(({ item }) => {
  const { translate } = useLanguageStore();
  const cardColorClass = item.color;
  const textColorClass = item.color.includes('cyan') ? 'text-slate-800' : 'text-white';


  return (
    <Link
      to={item.path}
      className={`kiosk-card ${cardColorClass} p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center cursor-pointer min-h-[180px] ${textColorClass} transition-all duration-200 hover:shadow-2xl hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-[var(--theme-focus-ring)] focus:ring-opacity-70`}
      aria-label={translate(item.translationKey)}
    >
      {React.cloneElement(item.icon, { "aria-hidden": "true"})}
      <span className="text-lg font-semibold mt-2">{translate(item.translationKey)}</span>
    </Link>
  );
});

const DashboardPage: React.FC = () => {
  const { translate } = useLanguageStore();
  const { username } = useAuthStore();

  const memoizedKioskMenuItems = React.useMemo(() => 
    kioskMenuItems.filter(item => item.id !== 'dashboard-content'), 
  []);

  return (
    <div>
      <PageHeader
        title={translate('dashboard_title')}
        subtitle={translate('dashboard_welcome_user', { user: username || 'Pengguna' })}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {memoizedKioskMenuItems.map((item) => ( 
          <KioskCard key={item.id} item={item} />
        ))}
        
        {/* CosyPOS Demo Card */}
        <Link
          to="/cosy-pos"
          className="kiosk-card bg-gradient-to-br from-[var(--theme-acceleration)] to-[var(--theme-bootcamp)] p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center cursor-pointer min-h-[180px] text-white transition-all duration-200 hover:shadow-2xl hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-[var(--theme-focus-ring)] focus:ring-opacity-70"
          aria-label="CosyPOS Demo Interface"
        >
          <svg className="h-16 w-16 mb-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            <path d="M8 11l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
          <span className="text-lg font-semibold">CosyPOS Demo</span>
          <span className="text-sm opacity-80 mt-1">Professional POS Interface</span>
        </Link>
      </div>
    </div>
  );
};

export default React.memo(DashboardPage);
