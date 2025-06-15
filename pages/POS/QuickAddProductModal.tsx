import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import KioskButton from '../../components/common/KioskButton';
import KioskInput from '../../components/common/KioskInput';
import { Product } from '../../types';
import { useToastStore } from '../../store/toastStore';
import { useLanguageStore } from '../../store/languageStore';
import { useCartStore } from '../../store/cartStore';

interface QuickAddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newProduct: Product) => void;
  existingCategories: string[];
}

const QuickAddProductModal: React.FC<QuickAddProductModalProps> = ({ isOpen, onClose, onSave, existingCategories }) => {
  const { showToast } = useToastStore();
  const { translate } = useLanguageStore();
  const { addToCart } = useCartStore();

  const [name, setName] = useState('');
  const [category, setCategory] = useState(existingCategories[0] || '');
  const [newCategory, setNewCategory] = useState('');
  const [price, setPrice] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('100'); // Default stock

  useEffect(() => {
    if (isOpen) {
      setName('');
      setCategory(existingCategories[0] || '');
      setNewCategory('');
      setPrice('');
      setSku('');
      setStock('100');
    }
  }, [isOpen, existingCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast(translate('pos_form_product_name') + ' ' + translate('cannot_be_empty_generic').toLowerCase(), 'warning');
      return;
    }
    const finalCategory = category === 'NEW_CATEGORY' ? newCategory.trim() : category;
    if (!finalCategory) {
      showToast(translate('pos_form_product_category') + ' ' + translate('cannot_be_empty_generic').toLowerCase(), 'warning');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      showToast(translate('pos_form_product_price') + ' ' + translate('must_be_valid_number_generic').toLowerCase(), 'warning'); // Assuming 'must_be_valid_number_generic' exists
      return;
    }
    const numStock = parseInt(stock, 10);
    if (isNaN(numStock) && stock.trim() !== '') { // Allow empty stock (interpreted as 0 or high default)
        showToast(translate('pos_form_product_stock') + ' ' + translate('must_be_valid_number_generic').toLowerCase(), 'warning');
        return;
    }


    const newProduct: Product = {
      id: Date.now(), // Simple unique ID for mock
      name: name.trim(),
      category: finalCategory,
      price: numPrice,
      sku: sku.trim() || `TEMP-${Date.now().toString().slice(-4)}`,
      stock: stock.trim() === '' ? 9999 : numStock, // High default if empty
      image: '🆕', // Default image for quickly added products
      // Add other default fields if necessary from Product type
      reorderLevel: 5,
      hasExpiryDate: false, // Default, could be inferred from category later
      simulatedVisionLabels: [finalCategory, name.split(' ')[0]],
    };
    onSave(newProduct);
    addToCart(newProduct); // Add the new product to the cart
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={translate('pos_modal_quick_add_title')} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <KioskInput
          label={translate('pos_form_product_name')}
          id="quick-add-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div>
          <label htmlFor="quick-add-category" className="block text-sm font-medium text-stone-300 mb-1">
            {translate('pos_form_product_category')}
          </label>
          <select
            id="quick-add-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 kiosk-input bg-slate-700 border-slate-600"
          >
            {existingCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            <option value="NEW_CATEGORY">-- Tambah Kategori Baharu --</option>
          </select>
        </div>
        {category === 'NEW_CATEGORY' && (
          <KioskInput
            label="Nama Kategori Baharu"
            id="quick-add-new-category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Cth: Makanan Ringan Import"
          />
        )}
        <KioskInput
          label={translate('pos_form_product_price')}
          id="quick-add-price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          step="0.01"
          min="0.01"
          required
        />
        <KioskInput
          label={translate('pos_form_product_sku')}
          id="quick-add-sku"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />
        <KioskInput
          label={translate('pos_form_product_stock')}
          id="quick-add-stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          min="0"
        />
        <div className="pt-4 flex justify-end space-x-3">
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

export default QuickAddProductModal;