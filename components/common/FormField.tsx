import React from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, htmlFor, error, children, className }) => (
  <div className={`w-full ${className || ''}`}>
    <label htmlFor={htmlFor} className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-1.5">{label}</label>
    {children}
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
);

export default React.memo(FormField);
