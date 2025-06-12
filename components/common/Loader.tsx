
import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'default' | 'button'; // 'button' for inline with text
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', text, variant = 'default' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  };

  if (variant === 'button') {
    return <span className="gemini-btn-loader" aria-label="Loading..."></span>; // Uses global style from index.html
  }

  return (
    <div className="flex flex-col items-center justify-center" role="status" aria-live="polite">
      <div
        className={`animate-spin rounded-full border-[var(--theme-panel-bg-alt)] border-t-[var(--theme-primary-color)] ${sizeClasses[size]}`}
        aria-hidden="true"
      ></div>
      {text && <p className="mt-2 text-sm text-[var(--theme-text-muted)]">{text}</p>}
      {!text && <span className="sr-only">Loading...</span>}
    </div>
  );
};

export default React.memo(Loader);
