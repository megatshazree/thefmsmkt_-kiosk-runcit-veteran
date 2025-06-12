import React from 'react';
import Modal from '../../components/common/Modal';
import KioskButton from '../../components/common/KioskButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { BellAlertIcon } from '@heroicons/react/24/outline';

interface AssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssistanceModal: React.FC<AssistanceModalProps> = ({ isOpen, onClose }) => {
  const { translate } = useLanguage();

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={translate('vision_assistance_requested_title')}
      maxWidth="max-w-md"
    >
      <div className="text-center">
        <BellAlertIcon className="h-16 w-16 text-sky-400 mx-auto mb-4" />
        <p className="text-stone-300 mb-6">
          {translate('vision_assistance_requested_message')}
        </p>
        <KioskButton variant="primary" onClick={onClose} className="w-1/2 mx-auto">
          {translate('btn_close')}
        </KioskButton>
      </div>
    </Modal>
  );
};

export default AssistanceModal;