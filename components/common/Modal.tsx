
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  titleKey?: string; // For translation
  maxWidth?: string; // e.g., 'max-w-lg', 'max-w-2xl'
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, titleKey, maxWidth = 'max-w-lg' }) => {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAnimationClass('modal-enter modal-enter-active');
      const timer = setTimeout(() => setAnimationClass(''), 200); // Duration of enter animation
      
      // Focus management
      const focusableElements = modalContentRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusableElement = focusableElements?.[0] as HTMLElement;
      firstFocusableElement?.focus();

      return () => clearTimeout(timer);
    } else {
      // No need to set exit animation here if Modal is unmounted immediately.
      // If Modal remains mounted during exit, then:
      // setAnimationClass('modal-exit modal-exit-active');
      // const timer = setTimeout(() => setAnimationClass(''), 150);
      // return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setAnimationClass('modal-exit modal-exit-active');
    setTimeout(onClose, 150); // Match exit animation duration
  };
  
  const displayTitle = title;
  const titleId = titleKey ? `modal-title-${titleKey}` : title ? `modal-title-${title.replace(/\s+/g, '-').toLowerCase()}` : undefined;


  if (!isOpen && !animationClass.includes('modal-exit-active')) return null; // Don't render if not open and not exiting

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={handleClose} // Close on overlay click
    >
      <div 
        ref={modalContentRef}
        className={`bg-[var(--theme-panel-bg)] p-6 sm:p-8 rounded-xl shadow-2xl w-full ${maxWidth} text-[var(--theme-text-primary)] max-h-[90vh] flex flex-col border border-[var(--theme-border-color)] ${animationClass}`}
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
      >
        <div className="flex justify-between items-center mb-6">
          {displayTitle && <h3 id={titleId} className="text-2xl font-bold text-[var(--theme-text-primary)]">{displayTitle}</h3>}
          <button
            onClick={handleClose}
            className="text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] transition-colors p-1 -m-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--theme-focus-ring)]"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>
        <div className="overflow-y-auto flex-grow custom-scrollbar pr-1">
         {children}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Modal);