import React, { useMemo, useState, useRef } from 'react';
import { Product } from '../../types'; 
import { useCartStore } from '../../store/cartStore';
import { useLanguageStore } from '../../store/languageStore';
import { PlusIcon, XMarkIcon, CubeTransparentIcon } from '@heroicons/react/24/outline';
import { CategoryStyle } from '../../constants/categoryStyles';
import { motion } from 'framer-motion';

interface CosyProductGridProps {
  products: Product[];
  styledCategories: CategoryStyle[];
  selectedCategoryKey: string;
  onCategoryChange: (categoryKey: string) => void;
  searchTerm: string;
  className?: string;
}

const CosyProductGrid: React.FC<CosyProductGridProps> = ({
  products,
  styledCategories,
  selectedCategoryKey,
  onCategoryChange,
  searchTerm,
  className = ''
}) => {
  const { translate } = useLanguageStore();
  const { addToCart } = useCartStore();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter products based on category and search
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategoryKey !== 'pos_cat_all') {
      const categoryName = styledCategories.find(cat => cat.key === selectedCategoryKey)?.displayName || '';
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === categoryName.toLowerCase()
      );
    }

    // Filter by search term
    if (localSearchTerm.trim()) {
      const searchLower = localSearchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    return filtered;
  }, [products, selectedCategoryKey, localSearchTerm, styledCategories]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  // Category colors similar to CosyPOS
  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-blue-200', 'bg-purple-200', 'bg-green-200', 'bg-indigo-200',
      'bg-pink-200', 'bg-yellow-200', 'bg-orange-200', 'bg-teal-200'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className={`${className} flex flex-col h-full bg-[var(--theme-panel-bg)] rounded-lg border border-[var(--theme-border-color)]`}>
      {/* Category Grid - CosyPOS Style */}
      <div className="p-4 border-b border-[var(--theme-border-color)]">
        <div className="grid grid-cols-4 gap-3 mb-4">
          {styledCategories.slice(0, 8).map((category, index) => (
            <motion.button
              key={category.key}
              onClick={() => onCategoryChange(category.key)}
              className={`p-3 rounded-lg text-left transition-all duration-200 ${getCategoryColor(index)} ${
                selectedCategoryKey === category.key
                  ? 'ring-2 ring-[var(--theme-acceleration)] ring-offset-2 ring-offset-[var(--theme-bg-deep-space)]'
                  : 'hover:shadow-md'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label={`${translate('btn_filter_category')} ${category.displayName}`}
              title={`${category.displayName} (${category.count} ${translate('pos_items')})`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="h-5 w-5 text-gray-800" aria-hidden="true">
                  {React.cloneElement(category.icon, { className: "h-5 w-5 text-gray-800" })}
                </div>
                <span className="text-xs text-gray-600">{category.count} items</span>
              </div>
              <div className="font-medium text-gray-800 text-sm">{category.displayName}</div>
            </motion.button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder={translate('pos_search_products_placeholder')}
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="w-full px-3 py-2 pr-8 bg-[var(--theme-input-bg)] border border-[var(--theme-border-color)] rounded-lg text-[var(--theme-text-primary)] placeholder-[var(--theme-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-focus-ring)] focus:border-transparent text-sm"
            ref={searchInputRef}
            aria-label={translate('pos_search_products_placeholder')}
          />
          {localSearchTerm && (
            <button
              onClick={() => setLocalSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]"
              aria-label={translate('btn_clear_search')}
              title={translate('btn_clear_search')}
            >
              <XMarkIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Products Grid - CosyPOS Style */}
      <div className="flex-1 p-4 overflow-y-auto">
        {filteredProducts.length > 0 ? (
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                className="bg-[var(--theme-panel-bg-alt)] rounded-lg p-3 hover:shadow-md transition-all border border-[var(--theme-border-color)] group"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Product Image */}
                <div className="aspect-square bg-[var(--theme-input-bg)] rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {product.image.startsWith('data:image') ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover rounded-lg" 
                    />
                  ) : (
                    <span className="text-2xl text-[var(--theme-text-muted)]">
                      {product.image || '📦'}
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <h3 className="font-medium text-[var(--theme-text-primary)] mb-1 text-sm line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-between mb-3">
                  <p className="text-lg font-semibold text-[var(--theme-acceleration)]">
                    RM {product.price.toFixed(2)}
                  </p>
                  {product.stock !== undefined && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.stock <= 5 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {product.stock}
                    </span>
                  )}
                </div>

                {/* Add Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full py-2 bg-[var(--theme-acceleration)] text-white rounded-lg hover:bg-[var(--theme-acceleration)]/80 transition-colors flex items-center justify-center gap-2 group-hover:bg-[var(--theme-acceleration)]/90"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Add</span>
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div 
            className="flex flex-col items-center justify-center h-64 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CubeTransparentIcon className="h-16 w-16 text-[var(--theme-text-muted)] mb-4" aria-hidden="true" />
            <h3 className="text-lg font-medium text-[var(--theme-text-primary)] mb-2">
              {translate('pos_no_products_found')}
            </h3>
            <p className="text-[var(--theme-text-muted)] mb-4">
              {translate('pos_try_different_search')}
            </p>
            <button
              onClick={() => setLocalSearchTerm('')}
              className="px-4 py-2 bg-[var(--theme-panel-bg-alt)] text-[var(--theme-text-primary)] rounded-lg hover:bg-[var(--theme-border-color)] transition-colors"
            >
              {translate('btn_clear_search')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CosyProductGrid;
