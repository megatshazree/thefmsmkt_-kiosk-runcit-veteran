import React from 'react';
import { Outlet } from 'react-router-dom';

const FullPageLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--theme-bg-deep-space)]">
      <Outlet />
    </div>
  );
};

export default FullPageLayout;
