
import React from 'react';
import { SelectOption } from '../../types';

const SettingsSelect: React.FC<{label: string; id:string; options: SelectOption[]; value?: string; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;}> = ({ label, id, options, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-1.5">{label}</label>
    <select id={id} {...props} className="w-full p-3 kiosk-input bg-[var(--theme-input-bg)] border border-[var(--theme-border-color)] rounded-lg shadow-sm focus:ring-2 focus:ring-[var(--theme-focus-ring)] focus:border-[var(--theme-focus-ring)] text-[var(--theme-text-primary)] transition-colors">
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

export default React.memo(SettingsSelect);
