
import React from 'react';

const SettingsCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <section className={`bg-[var(--theme-panel-bg)] shadow-xl rounded-xl p-6 ${className || ''}`} aria-labelledby={`settings-card-title-${title.replace(/\s+/g, '-').toLowerCase()}`}>
    <h3 id={`settings-card-title-${title.replace(/\s+/g, '-').toLowerCase()}`} className="text-xl font-semibold text-[var(--theme-text-primary)] mb-5">{title}</h3>
    {children}
  </section>
);

export default React.memo(SettingsCard);
