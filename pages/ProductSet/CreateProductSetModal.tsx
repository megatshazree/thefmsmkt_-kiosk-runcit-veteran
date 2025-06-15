import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import KioskButton from '../../components/common/KioskButton';
import KioskInput from '../../components/common/KioskInput';
import { useLanguage } from '../../contexts/LanguageContext';
import { Product, ProductSet } from '../../types';
import { mockProducts } from '../../constants/mockData'; // To list products for selection
import { useToastStore } from '../../store/toastStore';

interface CreateProductSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productSet: ProductSet) => void;
  existingSet: ProductSet | null; // For editing
}

const CreateProductSetModal: React.FC<CreateProductSetModalProps> = ({ isOpen, onClose, onSave, existingSet }) => {
  const { translate } = useLanguage();
  const { showToast } = useToastStore();

  const [setName, setSetName] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [setImage, setSetImage] = useState(''); // Optional: emoji or URL

  useEffect(() => {
    if (isOpen) {
      if (existingSet) {
        setSetName(existingSet.name);
        setSelectedProductIds(existingSet.productIds);
        setSetImage(existingSet.image || '');
      } else {
        setSetName('');
        setSelectedProductIds([]);
        setSetImage('');
      }
    }
  }, [isOpen, existingSet]);

  const handleProductSelection = (productId: number) => {
    setSelectedProductIds(prevIds =>
      prevIds.includes(productId)
        ? prevIds.filter(id => id !== productId)
        : [...prevIds, productId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (setName.trim() === '') {
      showToast(translate('product_set_form_name') + ' ' + translate('cannot_be_empty_generic').toLowerCase(), 'warning'); // Assuming 'cannot_be_empty_generic' exists
      return;
    }
    if (selectedProductIds.length < 2) {
      showToast(translate('toast_select_min_two_products'), 'warning');
      return;
    }

    const newSet: ProductSet = {
      id: existingSet ? existingSet.id : `set-${Date.now()}`, // Generate new ID or use existing
      name: setName.trim(),
      productIds: selectedProductIds,
      image: setImage.trim() || undefined,
    };
    onSave(newSet);
    onClose(); // Parent will show toast
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={translate(existingSet ? 'product_set_modal_title_edit' : 'product_set_modal_title_create')}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <KioskInput
          label={translate('product_set_form_name')}
          id="product-set-name"
          value={setName}
          onChange={(e) => setSetName(e.target.value)}
          placeholder={translate('product_set_form_name_placeholder')}
          required
        />
        <KioskInput
          label={translate('product_set_form_image')}
          id="product-set-image"
          value={setImage}
          onChange={(e) => setSetImage(e.target.value)}
          placeholder={translate('product_set_form_image_placeholder')}
        />

        <div>
          <label className="block text-sm font-medium text-stone-300 mb-2">
            {translate('product_set_form_products')}
          </label>
          <div className="max-h-60 overflow-y-auto space-y-2 p-3 bg-slate-700 rounded-md border border-slate-600">
            {mockProducts.map(product => (
              <label
                key={product.id}
                className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                  selectedProductIds.includes(product.id) ? 'bg-green-600' : 'bg-slate-600 hover:bg-slate-500'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedProductIds.includes(product.id)}
                  onChange={() => handleProductSelection(product.id)}
                  className="h-5 w-5 text-green-500 focus:ring-green-400 border-slate-500 rounded bg-slate-800 mr-3"
                />
                <span className="text-2xl mr-2">{product.image}</span>
                <span className="text-sm text-stone-100">{product.name} (RM {product.price.toFixed(2)})</span>
              </label>
            ))}
          </div>
           {selectedProductIds.length < 2 && (
            <p className="text-xs text-amber-400 mt-1">{translate('toast_select_min_two_products')}</p>
          )}
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <KioskButton type="button" variant="secondary" onClick={onClose}>
            {translate('btn_cancel')}
          </KioskButton>
          <KioskButton type="submit" variant="primary">
            {translate('btn_save')}
          </KioskButton>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProductSetModal;