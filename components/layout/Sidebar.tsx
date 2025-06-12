
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { sidebarMenuItems } from '../../constants/menuItems';

const Sidebar: React.FC = () => {
  const { translate } = useLanguage();

  return (
    <aside className="w-64 bg-[var(--theme-panel-bg)] text-[var(--theme-text-primary)] p-5 space-y-2 flex flex-col hidden md:flex shadow-xl">
      <div className="text-2xl font-bold text-[var(--theme-text-primary)] mb-8 text-center">
        {translate('app_title_short')}
      </div>
      <nav className="flex-grow" aria-label="Main navigation">
        {sidebarMenuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item flex items-center space-x-3 p-3 rounded-lg ${isActive ? 'sidebar-item-active shadow-inner' : 'sidebar-item-inactive text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]'}`
            }
            aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
          >
            {React.cloneElement(item.icon, { className: `${item.icon.props.className} text-[var(--theme-accent-cyan)] opacity-80 group-hover:opacity-100`, "aria-hidden": "true" })}
            <span>{translate(item.translationKey)}</span>
          </NavLink>
        ))}
      </nav>
      {/* Language toggle and logout buttons removed from here */}
    </aside>
  );
};

export default React.memo(Sidebar);