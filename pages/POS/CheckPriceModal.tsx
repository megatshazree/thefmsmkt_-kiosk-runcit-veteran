import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import KioskButton from '../../components/common/KioskButton';
import KioskInput from '../../components/common/KioskInput';
import { useLanguage } from '../../contexts/LanguageContext';
import { Product } from '../../types';
import { useToast } from '../../contexts/ToastContext';

interface CheckPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

const CheckPriceModal: React.FC<CheckPriceModalProps> = ({ isOpen, onClose, products }) => {
  const { translate } = useLanguage();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setFoundProduct(null);
    }
  }, [isOpen]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      showToast(translate('toast_price_check_enter_query'), 'warning');
      return;
    }
    const query = searchQuery.toLowerCase();
    const result = products.find(
      p => p.name.toLowerCase().includes(query) || (p.sku && p.sku.toLowerCase().includes(query))
    );
    setFoundProduct(result || null);
    if (!result) {
        showToast(translate('pos_check_price_not_found'), 'info');
    }
  };
  
  const renderProductImage = (product: Product) => {
    if (product.image.startsWith('data:image')) {
      return <img src={product.image} alt={product.name} className="w-16 h-16 object-contain rounded bg-white p-1" />;
    }
    return <div className="text-5xl">{product.image || '❓'}</div>;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={translate('pos_modal_check_price_title')} maxWidth="max-w-md">
      <div className="space-y-4">
        <KioskInput
          label={translate('pos_check_price_search_label')}
          id="check-price-query"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          autoFocus
        />
        <KioskButton onClick={handleSearch} fullWidth>
          {translate('btn_search')}
        </KioskButton>

        {foundProduct && (
          <div className="mt-4 p-4 bg-slate-700 rounded-lg">
            <h4 className="text-lg font-semibold text-white mb-2">{translate('pos_check_price_details_title')}</h4>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 flex items-center justify-center">
                {renderProductImage(foundProduct)}
              </div>
              <div>
                <p className="text-xl font-medium text-stone-100">{foundProduct.name}</p>
                <p className="text-lg text-green-400 font-semibold">RM {foundProduct.price.toFixed(2)}</p>
                <p className="text-sm text-stone-300">{translate('table_category')}: {foundProduct.category}</p>
                <p className="text-sm text-stone-300">{translate('table_stock')}: {foundProduct.stock}</p>
                {foundProduct.sku && <p className="text-xs text-stone-400">{translate('table_sku')}: {foundProduct.sku}</p>}
              </div>
            </div>
          </div>
        )}
         {!foundProduct && searchQuery.trim() !== '' && (
            <p className="text-center text-stone-400 mt-4">{translate('pos_check_price_not_found')}</p>
        )}
      </div>
      <div className="mt-6 flex justify-end">
        <KioskButton variant="secondary" onClick={onClose}>
          {translate('btn_close')}
        </KioskButton>
      </div>
    </Modal>
  );
};

export default CheckPriceModal;