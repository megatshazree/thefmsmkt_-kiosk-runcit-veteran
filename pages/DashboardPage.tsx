
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { kioskMenuItems } from '../constants/menuItems';
import PageHeader from '../components/common/PageHeader';

const KioskCard: React.FC<{ item: import('../types').KioskMenuItem }> = React.memo(({ item }) => {
  const { translate } = useLanguage();
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
  const { translate } = useLanguage();
  const { username } = useAuth();

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
      </div>
    </div>
  );
};

export default React.memo(DashboardPage);
