
import React from 'react';
import { useToastStore } from '../../store/toastStore';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'; 

const ToastContainer: React.FC = () => { // Renamed for clarity, as it's the container
  const { toasts } = useToastStore();

  if (!toasts.length) {
    return null;
  }

  return (
    <div 
        className="fixed bottom-5 right-5 z-[1000] space-y-3"
        aria-live="polite" // Announce changes in the container
    >
      {toasts.map((toast) => {
        let bgColor = 'bg-[var(--theme-panel-bg-alt)]';
        let textColor = 'text-[var(--theme-text-primary)]';
        let IconComponent = InformationCircleIcon;
        let iconColor = 'text-[var(--theme-accent-cyan)]';

        switch (toast.type) {
          case 'success':
            bgColor = 'bg-[var(--color-success)]';
            textColor = 'text-white';
            IconComponent = CheckCircleIcon;
            iconColor = 'text-white';
            break;
          case 'error':
            bgColor = 'bg-[var(--color-danger)]';
            textColor = 'text-white';
            IconComponent = XCircleIcon;
            iconColor = 'text-white';
            break;
          case 'warning':
            bgColor = 'bg-[var(--color-warning)]';
            textColor = 'text-slate-800'; // Darker text for warning
            IconComponent = ExclamationTriangleIcon;
            iconColor = 'text-slate-800';
            break;
          case 'info':
            // Defaults are fine for info, but explicitly set iconColor
            iconColor = 'text-[var(--theme-accent-cyan)]';
             break;
        }

        return (
          <div
            key={toast.id}
            className={`flex items-center p-4 rounded-xl shadow-lg ${bgColor} ${textColor} min-w-[250px] max-w-md animate-fadeIn border border-black/10`} 
            role="alert" // Individual alerts
            aria-live={toast.type === 'error' || toast.type === 'warning' ? 'assertive' : 'polite'}
          >
            <IconComponent className={`h-6 w-6 mr-3 flex-shrink-0 ${iconColor}`} aria-hidden="true" />
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        );
      })}      
    </div>
  );
};

export default React.memo(ToastContainer);
