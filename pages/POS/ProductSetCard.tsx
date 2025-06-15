import React from 'react';
import { ProductSet } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useLanguageStore } from '../../store/languageStore';
import KioskButton from '../../components/common/KioskButton';
import { mockProducts } from '../../constants/mockData'; 
import { useToastStore } from '../../store/toastStore';
import { RectangleStackIcon } from '@heroicons/react/24/outline';

interface ProductSetCardProps {
  productSet: ProductSet;
}

const ProductSetCard: React.FC<ProductSetCardProps> = ({ productSet }) => {
  const { translate } = useLanguageStore();
  const { addToCart } = useCartStore();
  const { showToast } = useToastStore();

  const handleAddSetToCart = React.useCallback(() => {
    let itemsAddedCount = 0;
    productSet.productIds.forEach(productId => {
      const productToAdd = mockProducts.find(p => p.id === productId);
      if (productToAdd) {
        addToCart(productToAdd);
        itemsAddedCount++;
      }
    });
    if (itemsAddedCount > 0) {
      showToast(translate('toast_product_set_added_to_cart', { setName: productSet.name }), 'success');
    }
  }, [productSet, addToCart, showToast, translate]);

  const productsInSet = React.useMemo(() => 
    productSet.productIds
      .map(id => mockProducts.find(p => p.id === id)?.name)
      .filter(name => !!name),
  [productSet.productIds]);

  return (
    <div className="bg-sky-700 p-3 sm:p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center text-center kiosk-card text-white">
      <div aria-hidden="true" className="text-4xl sm:text-5xl mb-2 sm:mb-3 h-12 sm:h-14 flex items-center justify-center">
        {productSet.image ? (
          <span className="text-4xl">{productSet.image}</span>
        ) : (
          <RectangleStackIcon className="h-10 w-10 text-sky-300" />
        )}
      </div>
      <h4 className="text-sm sm:text-md font-semibold mb-1 h-10 overflow-hidden text-ellipsis leading-tight">{productSet.name}</h4>
      <p className="text-xs text-sky-200 mb-1 sm:mb-2">
        {translate('pos_search_result_set_label')} ({productSet.productIds.length} item/s)
      </p>
      <div className="text-xxs text-sky-100 mb-2 h-8 overflow-hidden" title={productsInSet.join(', ')}>
        {productsInSet.slice(0, 3).join(', ')}{productsInSet.length > 3 ? '...' : ''}
      </div>
      <KioskButton 
        onClick={handleAddSetToCart} 
        className="mt-auto text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 w-full !bg-sky-500 hover:!bg-sky-400 focus:!ring-sky-300"
        aria-label={`${translate('btn_add_set_to_cart')} ${productSet.name}`}
      >
        {translate('btn_add_set_to_cart')}
      </KioskButton>
      <style>{`.text-xxs { font-size: 0.65rem; line-height: 0.8rem; }`}</style>
    </div>
  );
};

export default React.memo(ProductSetCard);
