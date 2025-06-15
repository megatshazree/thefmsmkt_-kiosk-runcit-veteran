
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguageStore } from '../../store/languageStore';
import { sidebarMenuItems } from '../../constants/menuItems';

const Sidebar: React.FC = () => {
  const { translate } = useLanguageStore();

  return (
    <aside className="w-full md:w-44 lg:w-48 bg-[var(--theme-panel-bg)] text-[var(--theme-text-primary)] p-2 md:p-3 space-y-1 flex flex-col hidden md:flex shadow-xl shrink-0">
      <div className="text-sm lg:text-base font-bold text-[var(--theme-text-primary)] mb-3 lg:mb-4 text-center">
        {translate('app_title_short')}
      </div>
      <nav className="flex-grow space-y-1" aria-label="Main navigation">
        {sidebarMenuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item flex items-center space-x-2 p-1.5 md:p-2 rounded-md text-xs md:text-sm ${isActive ? 'sidebar-item-active shadow-inner' : 'sidebar-item-inactive text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]'}`
            }
            aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
          >
            {React.cloneElement(item.icon, { className: `${item.icon.props.className} w-3 h-3 md:w-4 md:h-4 text-[var(--theme-accent-cyan)] opacity-80 group-hover:opacity-100`, "aria-hidden": "true" })}
            <span className="truncate">{translate(item.translationKey)}</span>
          </NavLink>
        ))}
      </nav>
      {/* Language toggle and logout buttons removed from here */}
    </aside>
  );
};

export default React.memo(Sidebar);