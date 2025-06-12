
import React from 'react';
import { XCircleIcon } from '@heroicons/react/24/solid';

interface KioskInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  onClear?: () => void; // Optional handler for clear button
}

const KioskInput: React.FC<KioskInputProps> = ({ label, error, className, onClear, value, ...props }) => {
  return (
    <div className="w-full relative">
      {label && (
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-1">
          {label}
        </label>
      )}
      <input
        value={value}
        className={`w-full p-3 kiosk-input bg-[var(--theme-input-bg)] border border-[var(--theme-border-color)] rounded-lg shadow-sm 
                    focus:ring-2 focus:ring-[var(--theme-focus-ring)] focus:border-[var(--theme-focus-ring)] 
                    text-[var(--theme-text-primary)] placeholder-[var(--theme-text-muted)] transition-colors
                    ${onClear && value ? 'pr-10' : ''} 
                    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                    ${props.disabled ? 'opacity-60 cursor-not-allowed' : ''}
                    ${className}`}
        {...props}
      />
      {onClear && value && (
        <button
          type="button"
          onClick={onClear}
          className="clear-search-button"
          aria-label="Clear search"
        >
          <XCircleIcon className="h-5 w-5" />
        </button>
      )}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default React.memo(KioskInput);
