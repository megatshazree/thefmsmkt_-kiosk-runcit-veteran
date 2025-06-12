import React from 'react';
import Modal from '../../components/common/Modal';
import KioskButton from '../../components/common/KioskButton';
import { Product } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttendantVerified: () => void;
  product: Product | null;
}

const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({
  isOpen,
  onClose,
  onAttendantVerified,
  product,
}) => {
  const { translate } = useLanguage();

  if (!isOpen || !product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose} // Allow closing if attendant is taking too long, or user changes mind (though item not added yet)
      title={translate('vision_age_verification_title')}
      maxWidth="max-w-lg"
    >
      <div className="text-center">
        <ShieldExclamationIcon className="h-16 w-16 text-amber-400 mx-auto mb-4" />
        <p className="text-xl font-semibold text-stone-100 mb-2">
          {product.name}
        </p>
        <p className="text-stone-300 mb-6">
          {translate('vision_age_verification_message')}
        </p>
        <div className="flex justify-center space-x-3">
          <KioskButton variant="secondary" onClick={onClose}>
            {translate('btn_cancel')}
          </KioskButton>
          <KioskButton variant="primary" onClick={onAttendantVerified}>
            {translate('vision_btn_attendant_verified')}
          </KioskButton>
        </div>
      </div>
    </Modal>
  );
};

export default AgeVerificationModal;