import React, { useState, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useToastStore } from '../../store/toastStore';
import { useLanguageStore } from '../../store/languageStore';
import { Product } from '../../types';
import { mockProducts } from '../../constants/mockData';
import KioskButton from '../../components/common/KioskButton';
import { 
  MagnifyingGlassIcon, 
  CreditCardIcon, 
  BanknotesIcon,
  DevicePhoneMobileIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

// Category definitions with colors matching reference
const CATEGORIES = [
  { id: 'breakfast', name: 'Breakfast', icon: '🍳', color: 'bg-blue-100', items: 13 },
  { id: 'soups', name: 'Soups', icon: '🍲', color: 'bg-purple-200', items: 8 },
  { id: 'pasta', name: 'Pasta', icon: '🍝', color: 'bg-blue-200', items: 10 },
  { id: 'sushi', name: 'Sushi', icon: '🍣', color: 'bg-purple-300', items: 15 },
  { id: 'main', name: 'Main course', icon: '🍖', color: 'bg-pink-200', items: 7 },
  { id: 'desserts', name: 'Desserts', icon: '🧁', color: 'bg-gray-300', items: 5 },
  { id: 'drinks', name: 'Drinks', icon: '🥤', color: 'bg-pink-300', items: 11 },
  { id: 'alcohol', name: 'Alcohol', icon: '🍷', color: 'bg-green-200', items: 12 },
];

// Sample products for the selected category
const SAMPLE_PRODUCTS = [
  { id: 1, name: 'Fish and chips', price: 12.75, category: 'main', image: '🐟' },
  { id: 2, name: 'Roast chicken', price: 15.50, category: 'main', image: '🍗' },
  { id: 3, name: 'Filet steak', price: 23.00, category: 'main', image: '🥩' },
  { id: 4, name: 'Beefsteak', price: 18.20, category: 'main', image: '🥩' },
  { id: 5, name: 'Roast beef', price: 19.00, category: 'main', image: '🍖' },
  { id: 6, name: 'Buffalo wings', price: 11.80, category: 'main', image: '🍗' },
  { id: 7, name: 'Lobster', price: 28.50, category: 'main', image: '🦞' },
  { id: 8, name: 'Red caviar', price: 42.30, category: 'main', image: '🥄' },
];

const POSPageNew: React.FC = () => {
  const { showToast } = useToastStore();
  const { translate } = useLanguageStore();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCartStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleAddToCart = useCallback((product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      quantity: 1,
      image: product.image,
    });
    showToast(`${product.name} added to cart`, 'success');
  }, [addToCart, showToast]);

  const handleQuantityChange = useCallback((productId: number, change: number) => {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        removeFromCart(productId);
      } else {
        updateQuantity(productId, newQuantity);
      }
    }
  }, [cartItems, updateQuantity, removeFromCart]);

  const getProductQuantity = (productId: number) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="flex h-screen bg-[var(--theme-bg-deep-space)] text-white">
      {/* Sidebar Navigation */}
      <div className="w-48 bg-[var(--theme-panel-bg)] border-r border-[var(--theme-border-color)] flex flex-col">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-[var(--theme-border-color)]">
          <h1 className="text-lg font-semibold">CosyPOS</h1>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 py-4">
          <div className="px-3 space-y-1">
            <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-[var(--theme-text-muted)] hover:text-white hover:bg-[var(--theme-panel-bg-alt)]">
              Menu
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md bg-[var(--theme-panel-bg-alt)] text-white">
              Tables
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-[var(--theme-text-muted)] hover:text-white hover:bg-[var(--theme-panel-bg-alt)]">
              Reservation
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-[var(--theme-text-muted)] hover:text-white hover:bg-[var(--theme-panel-bg-alt)]">
              Chat
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-[var(--theme-text-muted)] hover:text-white hover:bg-[var(--theme-panel-bg-alt)]">
              Dashboard
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-[var(--theme-text-muted)] hover:text-white hover:bg-[var(--theme-panel-bg-alt)]">
              Accounting
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-[var(--theme-text-muted)] hover:text-white hover:bg-[var(--theme-panel-bg-alt)]">
              Settings
            </a>
          </div>
        </nav>

        {/* User Profiles at bottom */}
        <div className="p-3 border-t border-[var(--theme-border-color)] space-y-2">
          <div className="flex items-center space-x-2 p-2 rounded-md bg-[var(--theme-panel-bg-alt)]">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs">L</div>
            <span className="text-xs">Leslie K.</span>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-md">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs">C</div>
            <span className="text-xs">Cameron W.</span>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-md">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs">J</div>
            <span className="text-xs">Jacob J.</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Panel - Categories and Products */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--theme-border-color)]">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-[var(--theme-text-muted)]" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-[var(--theme-input-bg)] border border-[var(--theme-border-color)] rounded-lg text-white placeholder-[var(--theme-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-acceleration)]"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[var(--theme-text-muted)]">Table 5</span>
              <div className="w-8 h-8 bg-[var(--theme-panel-bg-alt)] rounded-full flex items-center justify-center">
                <span className="text-xs">✎</span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 overflow-auto">
            {!selectedCategory ? (
              /* Category Grid */
              <div className="grid grid-cols-4 gap-4">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategorySelect(category.id)}
                    className={`${category.color} rounded-lg p-4 h-28 flex flex-col items-center justify-center text-gray-800 hover:scale-105 transition-transform`}
                    aria-label={`Select category ${category.name}`}
                  >
                    <span className="text-2xl mb-1">{category.icon}</span>
                    <span className="font-medium text-sm">{category.name}</span>
                    <span className="text-xs opacity-70">{category.items} items</span>
                  </button>
                ))}
              </div>
            ) : (
              /* Product Grid */
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className="text-[var(--theme-text-muted)] hover:text-white text-sm"
                    aria-label="Back to categories"
                  >
                    ← Back to categories
                  </button>
                  <h2 className="text-lg font-semibold">
                    {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {SAMPLE_PRODUCTS.map((product) => {
                    const quantity = getProductQuantity(product.id);
                    return (
                      <div
                        key={product.id}
                        className="bg-[var(--theme-panel-bg)] rounded-lg p-4 border border-[var(--theme-border-color)]"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{product.image}</span>
                            <div>
                              <h3 className="font-medium text-sm">{product.name}</h3>
                              <p className="text-[var(--theme-acceleration)] font-semibold">${product.price}</p>
                            </div>
                          </div>
                          
                          {quantity === 0 ? (
                            <button
                              type="button"
                              onClick={() => handleAddToCart(product)}
                              className="w-8 h-8 bg-[var(--theme-panel-bg-alt)] rounded border border-[var(--theme-border-color)] flex items-center justify-center hover:bg-[var(--theme-border-color)]"
                              aria-label={`Add ${product.name} to cart`}
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(product.id, -1)}
                                className="w-8 h-8 bg-[var(--theme-panel-bg-alt)] rounded border border-[var(--theme-border-color)] flex items-center justify-center hover:bg-[var(--theme-border-color)]"
                                aria-label={`Decrease quantity of ${product.name}`}
                              >
                                <MinusIcon className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">{quantity}</span>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(product.id, 1)}
                                className="w-8 h-8 bg-[var(--theme-acceleration)] rounded flex items-center justify-center hover:bg-[var(--theme-acceleration-light)]"
                                aria-label={`Increase quantity of ${product.name}`}
                              >
                                <PlusIcon className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Order Summary */}
        <div className="w-80 bg-[var(--theme-panel-bg)] border-l border-[var(--theme-border-color)] flex flex-col">
          {/* Cart Header */}
          <div className="p-4 border-b border-[var(--theme-border-color)]">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Order Summary</h3>
              <span className="text-sm text-[var(--theme-text-muted)]">{cartItems.length} items</span>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center text-[var(--theme-text-muted)] py-8">
                <p>No items in cart</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[var(--theme-panel-bg-alt)] rounded-full flex items-center justify-center">
                        <span className="text-xs">{item.quantity}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-[var(--theme-text-muted)]">×{item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          <div className="p-4 border-t border-[var(--theme-border-color)] space-y-4">
            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--theme-text-muted)]">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--theme-text-muted)]">Tax 10%</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t border-[var(--theme-border-color)] pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-2">
              <p className="text-sm text-[var(--theme-text-muted)]">Payment Method</p>
              <div className="grid grid-cols-3 gap-2">
                <button className="p-3 bg-[var(--theme-panel-bg-alt)] rounded-lg border border-[var(--theme-border-color)] flex flex-col items-center space-y-1 hover:bg-[var(--theme-border-color)]" type="button" aria-label="Pay with cash">
                  <BanknotesIcon className="w-5 h-5" />
                  <span className="text-xs">Cash</span>
                </button>
                <button className="p-3 bg-[var(--theme-panel-bg-alt)] rounded-lg border border-[var(--theme-border-color)] flex flex-col items-center space-y-1 hover:bg-[var(--theme-border-color)]" type="button" aria-label="Pay with debit card">
                  <CreditCardIcon className="w-5 h-5" />
                  <span className="text-xs">Debit Card</span>
                </button>
                <button className="p-3 bg-[var(--theme-panel-bg-alt)] rounded-lg border border-[var(--theme-border-color)] flex flex-col items-center space-y-1 hover:bg-[var(--theme-border-color)]" type="button" aria-label="Pay with e-wallet">
                  <DevicePhoneMobileIcon className="w-5 h-5" />
                  <span className="text-xs">E-Wallet</span>
                </button>
              </div>
            </div>

            {/* Place Order Button */}
            <KioskButton
              variant="primary"
              className="w-full py-3 bg-white text-black hover:bg-gray-200 font-medium"
              disabled={cartItems.length === 0}
            >
              Place Order
            </KioskButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSPageNew;
