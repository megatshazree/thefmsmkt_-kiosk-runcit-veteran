import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import KioskButton from '../../components/common/KioskButton';
import KioskInput from '../../components/common/KioskInput';
import { useToastStore } from '../../store/toastStore';
import { useLanguageStore } from '../../store/languageStore';

interface ApplyDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDiscount: (value: string, type: 'percentage' | 'fixed') => void;
  onRemoveDiscount: () => void;
  currentDiscountInput: string; // e.g., "10" or "10%"
}

const ApplyDiscountModal: React.FC<ApplyDiscountModalProps> = ({ isOpen, onClose, onApplyDiscount, onRemoveDiscount, currentDiscountInput }) => {
  const { showToast } = useToastStore();
  const { translate } = useLanguageStore();

  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (currentDiscountInput.endsWith('%')) {
        setDiscountType('percentage');
        setDiscountValue(currentDiscountInput.replace('%', ''));
      } else if (currentDiscountInput) {
        setDiscountType('fixed');
        setDiscountValue(currentDiscountInput);
      } else {
        setDiscountType('percentage');
        setDiscountValue('');
      }
    }
  }, [isOpen, currentDiscountInput]);

  const handleApply = () => {
    const numericValue = parseFloat(discountValue);
    if (isNaN(numericValue) || numericValue < 0) {
      showToast(translate('toast_invalid_discount_value'), 'warning');
      return;
    }
    if (discountType === 'percentage' && numericValue > 100) {
       showToast(translate('toast_invalid_discount_value') + ' (max 100%)', 'warning');
       return;
    }
    onApplyDiscount(discountValue, discountType);
  };

  const handleRemove = () => {
    onRemoveDiscount();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={translate('pos_modal_apply_discount_title')} maxWidth="max-w-md">
      <div className="space-y-4">
        <div>
          <label htmlFor="discount-type" className="block text-sm font-medium text-stone-300 mb-1">
            {translate('pos_discount_type_label')}
          </label>
          <select
            id="discount-type"
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
            className="w-full p-3 kiosk-input bg-slate-700 border-slate-600"
          >
            <option value="percentage">{translate('pos_discount_type_percentage')}</option>
            <option value="fixed">{translate('pos_discount_type_fixed')}</option>
          </select>
        </div>
        <KioskInput
          label={translate('pos_discount_value_label')}
          id="discount-value"
          type="number"
          value={discountValue}
          onChange={(e) => setDiscountValue(e.target.value)}
          placeholder={
            discountType === 'percentage'
              ? translate('pos_discount_value_placeholder_percentage')
              : translate('pos_discount_value_placeholder_fixed')
          }
          min="0"
          step={discountType === 'percentage' ? "1" : "0.01"}
        />
        <div className="flex space-x-2 pt-2">
            {[5, 10, 15, 20].map(val => (
                 <KioskButton 
                    key={val} 
                    variant="secondary" 
                    className="flex-1 !text-xs !py-1.5"
                    onClick={() => {
                        setDiscountType('percentage');
                        setDiscountValue(String(val));
                    }}
                >
                    {val}%
                </KioskButton>
            ))}
        </div>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <KioskButton variant="danger" onClick={handleRemove} disabled={!currentDiscountInput}>
            {translate('pos_btn_remove_discount')}
        </KioskButton>
        <div className="flex space-x-3">
            <KioskButton type="button" variant="secondary" onClick={onClose}>
              {translate('btn_cancel')}
            </KioskButton>
            <KioskButton type="button" variant="primary" onClick={handleApply}>
              {translate('pos_btn_apply_discount')}
            </KioskButton>
        </div>
      </div>
    </Modal>
  );
};

export default ApplyDiscountModal;