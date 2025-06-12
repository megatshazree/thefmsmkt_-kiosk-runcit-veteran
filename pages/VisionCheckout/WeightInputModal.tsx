import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import KioskButton from '../../components/common/KioskButton';
import KioskInput from '../../components/common/KioskInput';
import { Product } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';

interface WeightInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (product: Product, weight: number) => void;
  product: Product | null;
}

const WeightInputModal: React.FC<WeightInputModalProps> = ({ isOpen, onClose, onConfirm, product }) => {
  const { translate } = useLanguage();
  const { showToast } = useToast();
  const [weight, setWeight] = useState('');

  useEffect(() => {
    if (isOpen) {
      setWeight(''); // Reset weight on open
    }
  }, [isOpen]);

  const handleConfirm = () => {
    const numericWeight = parseFloat(weight);
    if (!product || isNaN(numericWeight) || numericWeight <= 0) {
      showToast(translate('toast_invalid_weight'), 'warning');
      return;
    }
    onConfirm(product, numericWeight);
    onClose();
  };

  if (!isOpen || !product) return null;
  const unitName = product.unitName || 'units';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={translate('vision_weight_modal_title')} maxWidth="max-w-md">
      <p className="text-stone-300 mb-2">
        {translate('vision_weight_prompt', { unitName: unitName })}
      </p>
      <div className="my-4 p-3 bg-slate-700 rounded-lg flex items-center">
        <span className="text-4xl mr-4">{product.image}</span>
        <div>
          <p className="text-lg font-semibold text-white">{product.name}</p>
          <p className="text-sm text-stone-400">{product.category}</p>
          {product.pricePerUnit && <p className="text-sm text-green-400">RM {product.pricePerUnit.toFixed(2)} / {unitName}</p>}
        </div>
      </div>
      
      <KioskInput
        label={translate('vision_weight_label', { unitName: unitName })}
        type="number"
        id="item-weight"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder={`0.00`}
        autoFocus
        min="0.01"
        step="0.01"
      />

      <div className="mt-8 flex justify-end space-x-3">
        <KioskButton variant="secondary" onClick={onClose}>
          {translate('btn_cancel')}
        </KioskButton>
        <KioskButton variant="primary" onClick={handleConfirm}>
          {translate('vision_btn_add_weighted_item')}
        </KioskButton>
      </div>
    </Modal>
  );
};

export default WeightInputModal;