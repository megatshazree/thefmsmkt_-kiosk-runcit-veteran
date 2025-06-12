
import React from 'react';
import Loader from './Loader'; // Assuming Loader is in the same directory or adjust path

interface KioskButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'gemini' | 'ghost';
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const KioskButton: React.FC<KioskButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  isLoading = false, 
  className = '', 
  size = 'md', // Default size
  ...props 
}) => {
  let baseStyle = "font-medium rounded-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-60 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg";
  
  let variantStyle = '';
  let sizeStyle = '';

  if (size === "lg") sizeStyle = "px-8 py-3 text-lg";
  else if (size === "sm") sizeStyle = "px-3 py-1.5 text-xs";
  else sizeStyle = "px-6 py-2.5 text-sm"; // Default md size (updated from original KioskButton)

  switch (variant) {
    case 'primary':
      variantStyle = 'bg-[var(--theme-primary-color)] hover:brightness-110 text-white focus:ring-[var(--theme-primary-color)]';
      break;
    case 'secondary':
      variantStyle = 'bg-[var(--theme-panel-bg-alt)] hover:bg-[var(--theme-border-color)] border border-[var(--theme-border-color)] text-[var(--theme-text-secondary)] focus:ring-[var(--theme-focus-ring)]';
      break;
    case 'danger':
      variantStyle = 'bg-[var(--color-danger)] hover:brightness-110 text-white focus:ring-[var(--color-danger)]';
      break;
    case 'gemini':
      variantStyle = 'bg-[var(--theme-accent-magenta)] hover:brightness-110 text-white focus:ring-[var(--theme-accent-magenta)]';
      break;
    case 'ghost':
      variantStyle = 'bg-transparent hover:bg-[var(--theme-panel-bg-alt)] text-[var(--theme-text-muted)] focus:ring-[var(--theme-focus-ring)] shadow-none hover:shadow-none'; // Removed shadow for ghost
      break;
    default: 
      variantStyle = 'bg-[var(--theme-primary-color)] hover:brightness-110 text-white focus:ring-[var(--theme-primary-color)]';
  }

  const widthStyle = fullWidth ? 'w-full' : '';
  const loadingStateStyle = isLoading ? 'opacity-80 cursor-wait relative' : ''; // Added relative for spinner positioning

  return (
    <button 
      className={`${baseStyle} ${sizeStyle} ${variantStyle} ${widthStyle} ${loadingStateStyle} ${className}`}
      disabled={isLoading || props.disabled}
      aria-busy={isLoading}
      aria-disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <Loader variant="button" />
      )}
      <span className={isLoading ? "ml-2 opacity-0" : "ml-0"}>{children}</span> 
      {isLoading && <span className="absolute inset-0 flex items-center justify-center opacity-0" aria-hidden="true">{children}</span>} 
    </button>
  );
};

export default React.memo(KioskButton);
