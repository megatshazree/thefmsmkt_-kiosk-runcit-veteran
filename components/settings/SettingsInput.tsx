import React from 'react';

interface SettingsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

const SettingsInput: React.FC<SettingsInputProps> = ({ label, id, error, className, ...props }) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-1.5">{label}</label>
    <input
      id={id}
      className={`w-full p-3 kiosk-input bg-[var(--theme-input-bg)] border border-[var(--theme-border-color)] rounded-lg shadow-sm focus:ring-2 focus:ring-[var(--theme-focus-ring)] focus:border-[var(--theme-focus-ring)] text-[var(--theme-text-primary)] transition-colors ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className || ''}`}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
);

export default React.memo(SettingsInput);
