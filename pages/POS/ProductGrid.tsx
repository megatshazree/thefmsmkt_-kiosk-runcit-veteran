import React, { useMemo, useEffect, useRef } from 'react';
import { Product, ProductSet } from '../../types'; 
import { mockProductSets } from '../../constants/mockData'; 
import { useCartStore } from '../../store/cartStore';
import { useLanguageStore } from '../../store/languageStore';
import KioskButton from '../../components/common/KioskButton';
import ProductSetCard from './ProductSetCard'; 
import { PlusIcon, MinusIcon, ShoppingCartIcon, CubeTransparentIcon } from '@heroicons/react/24/solid';
import { CategoryStyle } from '../../constants/categoryStyles';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void; 
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, onAddToCart }) => {
  const { translate } = useLanguageStore();
  const { cartItems, updateQuantity, removeFromCart, addToCart } = useCartStore();

  const cartItem = useMemo(() => cartItems.find(item => item.id === product.id), [cartItems, product.id]);
  const currentQuantityInCart = cartItem ? cartItem.quantity : 0;

  const handleIncrement = React.useCallback(() => {
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1);
    } else {
      addToCart(product);
    }
  }, [cartItem, product, addToCart, updateQuantity]);

  const handleDecrement = React.useCallback(() => {
    if (cartItem && cartItem.quantity > 1) {
      updateQuantity(product.id, cartItem.quantity - 1);
    } else if (cartItem && cartItem.quantity === 1) {
      removeFromCart(product.id);
    }
  }, [cartItem, product.id, removeFromCart, updateQuantity]);
  
  const renderImage = React.useCallback(() => {
    if (product.image.startsWith('data:image')) {
      return <img src={product.image} alt={product.name} className="w-8 h-8 object-contain rounded bg-white p-0.5 mx-auto" />;
    }
    return <div aria-hidden="true" className="text-2xl h-8 w-8 flex items-center justify-center mx-auto">{product.image || '❓'}</div>;
  }, [product.image, product.name]);

  // Show stock and info badge
  const isLowStock = product.stock !== undefined && product.stock <= 5;
  const isNew = product.simulatedVisionLabels && product.simulatedVisionLabels.includes('NEW');

  return (
    <div className="bg-[var(--theme-panel-bg-alt)] p-2 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center text-center kiosk-card text-[var(--theme-text-primary)] border border-[var(--theme-border-color)] relative group focus-within:ring-2 focus-within:ring-[var(--theme-focus-ring)]" tabIndex={0} aria-label={`${product.name}, ${product.category}, RM${product.price.toFixed(2)}`}> 
      <div className="mb-1 h-10 flex items-center justify-center">
        {renderImage()}
      </div>
      <h4 className="text-xs font-medium mb-0.5 h-8 overflow-hidden text-ellipsis leading-tight text-[var(--theme-text-primary)]" title={product.name}>{product.name}</h4>
      <p className="text-xxs text-[var(--theme-text-muted)] mb-1">{product.category}</p>
      <p className="text-sm font-bold text-[var(--theme-accent-cyan)] mb-1">RM {product.price.toFixed(2)}</p>
      {typeof product.stock === 'number' && (
        <span className={`text-xxs font-medium rounded px-1 py-0.5 mb-1 ${isLowStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}
          title={isLowStock ? translate('table_low_stock') : translate('table_stock') + ': ' + product.stock}
        >
          {product.stock}
        </span>
      )}
      {isNew && (
        <span className="absolute top-1 right-1 bg-yellow-400 text-xxs font-bold px-1 py-0.5 rounded shadow">{translate('badge_new')}</span>
      )}
      <div className="mt-auto w-full flex flex-col gap-0.5">
        {currentQuantityInCart === 0 ? (
          <KioskButton 
            onClick={() => onAddToCart(product)} 
            className="text-xxs py-1 px-2 w-full !bg-[var(--theme-primary-color)] hover:!brightness-110"
            variant="primary"
            aria-label={`${translate('btn_add_to_cart')} ${product.name}`}
          >
            <ShoppingCartIcon className="h-3 w-3 mr-1" aria-hidden="true" />
            +
          </KioskButton>
        ) : (
          <div className="flex items-center justify-between space-x-1 w-full">
            <KioskButton 
              onClick={handleDecrement} 
              className="!p-1 !rounded-md !bg-[var(--theme-input-bg)] hover:!bg-[var(--theme-border-color)]"
              aria-label={`Decrease quantity of ${product.name}`}
              title={translate('btn_decrement')}
            >
              <MinusIcon className="h-3 w-3 text-[var(--theme-text-muted)]" aria-hidden="true" />
            </KioskButton>
            <span className="text-sm font-medium text-[var(--theme-text-primary)] min-w-[20px] text-center" aria-live="polite" aria-atomic="true">{currentQuantityInCart}</span>
            <KioskButton 
              onClick={handleIncrement} 
              className="!p-1 !rounded-md !bg-[var(--theme-input-bg)] hover:!bg-[var(--theme-border-color)]"
              aria-label={`Increase quantity of ${product.name}`}
              title={translate('btn_increment')}
            >
              <PlusIcon className="h-3 w-3 text-[var(--theme-text-muted)]" aria-hidden="true" />
            </KioskButton>
          </div>
        )}
      </div>
    </div>
  );
});

const SALES_CATEGORIES = [
  { key: 'makanan', label: 'Makanan', icon: '🍛', color: 'bg-bootcamp hover:bg-bootcamp-light' },
  { key: 'minuman', label: 'Minuman', icon: '🥤', color: 'bg-campus hover:bg-campus-light' },
  { key: 'snek', label: 'Snek', icon: '🍪', color: 'bg-competition hover:bg-competition-light' },
  { key: 'keperluan', label: 'Keperluan', icon: '🧻', color: 'bg-acceleration hover:bg-acceleration-light' },
  { key: 'lain', label: 'Lain-lain', icon: '🛒', color: 'bg-gradient-bootcamp' },
];

interface ProductGridProps {
  products: Product[];
  styledCategories: CategoryStyle[];
  selectedCategoryKey: string;
  onCategoryChange: (categoryKey: string) => void;
  searchTerm: string;
  className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = React.memo(({ products }) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const { translate } = useLanguageStore();
  // Filter products for the selected category
  const filteredProducts = React.useMemo(() => {
    if (!selectedCategory) return [];
    if (selectedCategory === 'lain') {
      // Show products not matching any other category
      const otherKeys = SALES_CATEGORIES.filter(c => c.key !== 'lain').map(c => c.label.toLowerCase());
      return products.filter(p => !otherKeys.includes(p.category.toLowerCase()));
    }
    return products.filter(p => p.category.toLowerCase() === SALES_CATEGORIES.find(c => c.key === selectedCategory)?.label.toLowerCase());
  }, [selectedCategory, products]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] py-12">
      {/* Only show category cards, no section/search titles or search bar */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2"
      >
        {SALES_CATEGORIES.map(cat => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setSelectedCategory(cat.key)}
            className={`flex flex-col items-center justify-center ${cat.color} rounded-lg shadow-md px-3 py-4 text-white text-sm font-medium cursor-pointer hover:scale-105 hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-[var(--theme-focus-ring)] min-w-[80px]`}
            aria-label={`Select category ${cat.label}`}
          >
            <span className="text-xl mb-1">{cat.icon}</span>
            <span className="text-xs font-normal">{cat.label}</span>
          </button>
        ))}
      </motion.div>
      {/* Popup/modal for selected category */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setSelectedCategory(null)}
        >
          <div
            className="bg-white dark:bg-[var(--theme-panel-bg)] rounded-xl shadow-2xl p-8 min-w-[320px] max-w-2xl w-full text-center relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] text-lg font-bold"
              onClick={() => setSelectedCategory(null)}
              aria-label="Close category modal"
            >
              ×
            </button>
            <div className="text-2xl mb-2">{SALES_CATEGORIES.find(c => c.key === selectedCategory)?.icon}</div>
            <div className="text-lg font-semibold mb-4 text-[var(--theme-text-primary)]">
              {SALES_CATEGORIES.find(c => c.key === selectedCategory)?.label}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 max-h-[60vh] overflow-y-auto">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={() => {}} />
                ))
              ) : (
                <div className="col-span-full text-[var(--theme-text-muted)] py-8">{translate('table_no_products') || 'Tiada produk.'}</div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
});

// NOTE: ProductGrid and ProductCard call addToCart(product) directly, which is correct for manual UI actions.
// For Vision AI or automation, always call addToCart({ ...product, quantity: 1 }) to ensure CartItem shape.
// The CartContext handles both cases, but this is best practice for clarity and future-proofing.

/* Add to the top of the file or in a global CSS file:
.category-card {
  background: var(--category-bg, var(--theme-panel-bg));
}
*/

export default ProductGrid;
