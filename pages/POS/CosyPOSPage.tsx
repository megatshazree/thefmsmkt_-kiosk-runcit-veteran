import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useToastStore } from '../../store/toastStore';
import { useLanguageStore } from '../../store/languageStore';
import { useCartStore } from '../../store/cartStore';
import { useTheme } from '../../src/contexts/ThemeContext';
import { mockProductCategories, mockProducts } from '../../constants/mockData';
import { Product, HeldOrder, Customer } from '../../types';
import { 
  Squares2X2Icon, 
  ClipboardDocumentListIcon, 
  CalendarDaysIcon, 
  ChatBubbleLeftRightIcon, 
  ChartBarIcon, 
  CogIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
}

const CosyPOSPage: React.FC = () => {
  const { showToast } = useToastStore();
  const { translate } = useLanguageStore();
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const { theme } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState<string>('breakfast');
  const [selectedTable, setSelectedTable] = useState<string>('Table 5');
  const [isPaymentView, setIsPaymentView] = useState(false);
  const [isPinView, setIsPinView] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'ewallet'>('cash');
  const [paymentAmount, setPaymentAmount] = useState('');

  // Mock categories based on the CosyPOS design
  const categories = [
    { id: 'breakfast', name: 'Breakfast', color: 'bg-blue-200', items: 12 },
    { id: 'soups', name: 'Soups', color: 'bg-purple-200', items: 5 },
    { id: 'pasta', name: 'Pasta', color: 'bg-green-200', items: 8 },
    { id: 'sushi', name: 'Sushi', color: 'bg-indigo-200', items: 15 },
    { id: 'main-course', name: 'Main course', color: 'bg-pink-200', items: 7 },
    { id: 'desserts', name: 'Desserts', color: 'bg-yellow-200', items: 9 },
    { id: 'drinks', name: 'Drinks', color: 'bg-orange-200', items: 11 },
    { id: 'alcohol', name: 'Alcohol', color: 'bg-teal-200', items: 12 },
  ];

  // Mock products for categories
  const categoryProducts = useMemo(() => {
    const products = [
      { id: '1', name: 'Fish and chips', price: 25.50, category: 'breakfast', image: '/api/placeholder/100/80' },
      { id: '2', name: 'Roast chicken', price: 17.75, category: 'main-course', image: '/api/placeholder/100/80' },
      { id: '3', name: 'Filet steak', price: 31.50, category: 'main-course', image: '/api/placeholder/100/80' },
      { id: '4', name: 'Beefsteak', price: 18.20, category: 'main-course', image: '/api/placeholder/100/80' },
      { id: '5', name: 'Roast beef', price: 34.00, category: 'main-course', image: '/api/placeholder/100/80' },
      { id: '6', name: 'Buffalo wings', price: 15.80, category: 'main-course', image: '/api/placeholder/100/80' },
      { id: '7', name: 'Lobster', price: 43.50, category: 'main-course', image: '/api/placeholder/100/80' },
      { id: '8', name: 'Red caviar', price: 12.50, category: 'main-course', image: '/api/placeholder/100/80' },
    ];
    return products.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  // Navigation items
  const navigationItems: NavigationItem[] = [
    { id: 'menu', label: 'Menu', icon: Squares2X2Icon, isActive: true },
    { id: 'orders', label: 'Orders', icon: ClipboardDocumentListIcon },
    { id: 'reservation', label: 'Reservation', icon: CalendarDaysIcon },
    { id: 'chat', label: 'Chat', icon: ChatBubbleLeftRightIcon },
    { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { id: 'accounting', label: 'Accounting', icon: CogIcon },
    { id: 'settings', label: 'Settings', icon: CogIcon },
  ];

  // Staff members for PIN authentication
  const staffMembers = [
    { id: '1', name: 'Leslie K.', initial: 'L', bgColor: 'bg-blue-200' },
    { id: '2', name: 'Cameron W.', initial: 'C', bgColor: 'bg-green-200' },
    { id: '3', name: 'Jacob J.', initial: 'J', bgColor: 'bg-pink-200' },
  ];

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleProductAdd = (product: any) => {
    const cartProduct: Product = {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      description: '',
      image: product.image,
      inStock: true,
      barcode: '',
      sku: '',
      tags: [],
      nutritionalInfo: null,
      allergens: [],
      storageInstructions: '',
      dateAdded: new Date(),
      lastUpdated: new Date(),
      supplier: '',
      costPrice: 0,
      profitMargin: 0,
      discountPrice: null,
      isDiscounted: false,
      isVisuallyAmbiguous: false,
      requiresScale: false,
      requiresAgeVerification: false,
      similarProductIds: []
    };
    
    addToCart(cartProduct);
  };

  const handlePinDigit = (digit: string) => {
    if (digit === 'clear') {
      setCurrentPin('');
    } else if (digit === 'delete') {
      setCurrentPin(prev => prev.slice(0, -1));
    } else if (currentPin.length < 4) {
      setCurrentPin(prev => prev + digit);
    }
  };

  const handlePaymentDigit = (digit: string) => {
    if (digit === 'clear') {
      setPaymentAmount('');
    } else if (digit === 'delete') {
      setPaymentAmount(prev => prev.slice(0, -1));
    } else if (digit === '.') {
      if (!paymentAmount.includes('.')) {
        setPaymentAmount(prev => prev + '.');
      }
    } else {
      setPaymentAmount(prev => prev + digit);
    }
  };

  const renderPinPad = (onDigitPress: (digit: string) => void, showDot = false) => (
    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <button
          key={num}
          type="button"
          onClick={() => onDigitPress(num.toString())}
          className="aspect-square bg-[var(--theme-panel-bg-alt)] hover:bg-[var(--theme-border-color)] text-[var(--theme-text-primary)] text-xl font-semibold rounded-lg transition-all duration-150 active:scale-95"
          aria-label={`Enter digit ${num}`}
        >
          {num}
        </button>
      ))}
      {showDot && (
        <button
          key="dot"
          type="button"
          onClick={() => onDigitPress('.')}
          className="aspect-square bg-[var(--theme-panel-bg-alt)] hover:bg-[var(--theme-border-color)] text-[var(--theme-text-primary)] text-xl font-semibold rounded-lg transition-all duration-150 active:scale-95"
          aria-label="Enter decimal point"
        >
          .
        </button>
      )}
      <button
        key="0"
        type="button"
        onClick={() => onDigitPress('0')}
        className="aspect-square bg-[var(--theme-panel-bg-alt)] hover:bg-[var(--theme-border-color)] text-[var(--theme-text-primary)] text-xl font-semibold rounded-lg transition-all duration-150 active:scale-95"
        aria-label="Enter digit 0"
      >
        0
      </button>
      <button
        key="delete"
        type="button"
        onClick={() => onDigitPress('delete')}
        className="aspect-square bg-[var(--theme-panel-bg-alt)] hover:bg-[var(--theme-border-color)] text-[var(--theme-text-primary)] text-xl font-semibold rounded-lg transition-all duration-150 active:scale-95"
        aria-label="Delete digit"
      >
        <XMarkIcon className="h-6 w-6 mx-auto" />
      </button>
    </div>
  );

  // PIN Authentication View
  if (isPinView) {
    return (
      <div className="flex h-screen bg-[var(--theme-bg-deep-space)]">
        {/* Left Sidebar */}
        <div className="w-64 bg-[var(--theme-panel-bg)] border-r border-[var(--theme-border-color)]">
          <div className="p-4 border-b border-[var(--theme-border-color)]">
            <div className="flex items-center gap-2">
              <Squares2X2Icon className="h-6 w-6 text-[var(--theme-text-primary)]" />
              <span className="text-lg font-semibold text-[var(--theme-text-primary)]">CosyPOS</span>
            </div>
          </div>

          <div className="p-4">
            <div className="text-sm text-[var(--theme-text-muted)] mb-3">Shift</div>
            <div className="space-y-2">
              {staffMembers.map((staff) => (
                <div
                  key={staff.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--theme-panel-bg-alt)] transition-colors"
                >
                  <div className={`w-10 h-10 ${staff.bgColor} rounded-lg flex items-center justify-center text-black font-semibold`}>
                    {staff.initial}
                  </div>
                  <span className="text-[var(--theme-text-primary)] font-medium">{staff.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - PIN Entry */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--theme-text-primary)] mb-2">
                Shift 2
              </h2>
              <p className="text-[var(--theme-text-muted)]">Monday, 8 Feb 2023 • 8:23 AM</p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg text-[var(--theme-text-primary)] mb-4">Enter your PIN</h3>
              <div className="flex justify-center gap-2 mb-6">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full ${
                      index < currentPin.length ? 'bg-[var(--theme-acceleration)]' : 'bg-[var(--theme-panel-bg-alt)]'
                    } transition-colors`}
                  />
                ))}
              </div>
              {renderPinPad(handlePinDigit)}
            </div>

            <button
              type="button"
              onClick={() => setIsPinView(false)}
              className="px-6 py-2 bg-[var(--theme-acceleration)] text-white rounded-lg hover:bg-[var(--theme-acceleration)]/80 transition-colors"
              aria-label="Continue to POS"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Payment View
  if (isPaymentView) {
    return (
      <div className="flex h-screen bg-[var(--theme-bg-deep-space)]">
        {/* Left Sidebar */}
        <div className="w-64 bg-[var(--theme-panel-bg)] border-r border-[var(--theme-border-color)]">
          <div className="p-4 border-b border-[var(--theme-border-color)]">
            <div className="flex items-center gap-2">
              <Squares2X2Icon className="h-6 w-6 text-[var(--theme-text-primary)]" />
              <span className="text-lg font-semibold text-[var(--theme-text-primary)]">CosyPOS</span>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  item.id === 'menu'
                    ? 'bg-[var(--theme-acceleration)] text-white'
                    : 'text-[var(--theme-text-secondary)] hover:bg-[var(--theme-panel-bg-alt)]'
                }`}
                aria-label={`Navigate to ${item.label}`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Payment Area */}
        <div className="flex-1 flex">
          {/* Payment Form */}
          <div className="flex-1 p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-[var(--theme-text-primary)]">{selectedTable}</h2>
                <button
                  type="button"
                  onClick={() => setIsPaymentView(false)}
                  className="p-2 text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]"
                  aria-label="Close payment view"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <p className="text-[var(--theme-text-muted)]">Order #122</p>
            </div>

            {/* Order Summary */}
            <div className="bg-[var(--theme-panel-bg)] rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-[var(--theme-text-secondary)]">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <hr className="border-[var(--theme-border-color)] my-3" />
                <div className="flex justify-between text-[var(--theme-text-secondary)]">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--theme-text-secondary)]">
                  <span>Tax 10%</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-[var(--theme-text-primary)]">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-[var(--theme-text-primary)] mb-3">Payment Method</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-lg border transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-[var(--theme-acceleration)] bg-[var(--theme-acceleration)]/10'
                      : 'border-[var(--theme-border-color)] hover:border-[var(--theme-acceleration)]/50'
                  }`}
                  aria-label="Select payment method cash"
                >
                  <BanknotesIcon className="h-8 w-8 mx-auto mb-2 text-[var(--theme-text-primary)]" />
                  <span className="text-sm text-[var(--theme-text-primary)]">Cash</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-lg border transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[var(--theme-acceleration)] bg-[var(--theme-acceleration)]/10'
                      : 'border-[var(--theme-border-color)] hover:border-[var(--theme-acceleration)]/50'
                  }`}
                  aria-label="Select payment method card"
                >
                  <CreditCardIcon className="h-8 w-8 mx-auto mb-2 text-[var(--theme-text-primary)]" />
                  <span className="text-sm text-[var(--theme-text-primary)]">Bank Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('ewallet')}
                  className={`p-4 rounded-lg border transition-all ${
                    paymentMethod === 'ewallet'
                      ? 'border-[var(--theme-acceleration)] bg-[var(--theme-acceleration)]/10'
                      : 'border-[var(--theme-border-color)] hover:border-[var(--theme-acceleration)]/50'
                  }`}
                  aria-label="Select payment method e-wallet"
                >
                  <DevicePhoneMobileIcon className="h-8 w-8 mx-auto mb-2 text-[var(--theme-text-primary)]" />
                  <span className="text-sm text-[var(--theme-text-primary)]">E-Wallet</span>
                </button>
              </div>
            </div>
          </div>

          {/* Payment Keypad */}
          <div className="w-80 bg-[var(--theme-panel-bg)] border-l border-[var(--theme-border-color)] p-6">
            <div className="text-center mb-6">
              <div className="text-sm text-[var(--theme-text-muted)] mb-2">Total amount</div>
              <div className="text-4xl font-bold text-[var(--theme-text-primary)]">
                {paymentAmount || '0.00'}
              </div>
            </div>

            {renderPinPad(handlePaymentDigit, true)}

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => {
                  showToast('Payment processed successfully!', 'success');
                  clearCart();
                  setIsPaymentView(false);
                }}
                className="w-full py-3 bg-[var(--theme-acceleration)] text-white rounded-lg hover:bg-[var(--theme-acceleration)]/80 transition-colors font-medium"
                aria-label="Apply payment"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => setIsPaymentView(false)}
                className="w-full py-3 bg-[var(--theme-panel-bg-alt)] text-[var(--theme-text-primary)] rounded-lg hover:bg-[var(--theme-border-color)] transition-colors"
                aria-label="Print receipt"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main POS View
  return (
    <div className="flex h-screen bg-[var(--theme-bg-deep-space)]">
      {/* Left Sidebar */}
      <div className="w-64 bg-[var(--theme-panel-bg)] border-r border-[var(--theme-border-color)]">
        <div className="p-4 border-b border-[var(--theme-border-color)]">
          <div className="flex items-center gap-2">
            <Squares2X2Icon className="h-6 w-6 text-[var(--theme-text-primary)]" />
            <span className="text-lg font-semibold text-[var(--theme-text-primary)]">CosyPOS</span>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                item.isActive
                  ? 'bg-[var(--theme-acceleration)] text-white'
                  : 'text-[var(--theme-text-secondary)] hover:bg-[var(--theme-panel-bg-alt)]'
              }`}
              aria-label={`Navigate to ${item.label}`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Product Area */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-[var(--theme-text-primary)]">{selectedTable}</h1>
              <div className="flex items-center gap-4 text-sm text-[var(--theme-text-muted)]">
                <div className="flex items-center gap-1">
                  <UserIcon className="h-4 w-4" />
                  <span>4 guest</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>8:41</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPinView(true)}
              className="p-2 text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]"
              aria-label="Open PIN view"
            >
              <UserIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`p-4 rounded-lg text-left transition-all ${
                  selectedCategory === category.id
                    ? 'ring-2 ring-[var(--theme-acceleration)] ring-offset-2 ring-offset-[var(--theme-bg-deep-space)]'
                    : 'hover:shadow-md'
                } ${category.color}`}
                aria-label={`Select category ${category.name}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">{category.name}</span>
                  <span className="text-sm text-gray-600">{category.items} items</span>
                </div>
              </button>
            ))}
          </div>

          {/* Products */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[var(--theme-panel-bg)] rounded-lg p-4 hover:shadow-md transition-all border border-[var(--theme-border-color)]"
              >
                <div className="aspect-square bg-[var(--theme-panel-bg-alt)] rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-[var(--theme-text-muted)] text-sm">Image</span>
                </div>
                <h3 className="font-medium text-[var(--theme-text-primary)] mb-1">{product.name}</h3>
                <p className="text-lg font-semibold text-[var(--theme-acceleration)] mb-3">
                  ${product.price.toFixed(2)}
                </p>
                <button
                  type="button"
                  onClick={() => handleProductAdd(product)}
                  className="w-full py-2 bg-[var(--theme-acceleration)] text-white rounded-lg hover:bg-[var(--theme-acceleration)]/80 transition-colors flex items-center justify-center gap-2"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <PlusIcon className="h-4 w-4" />
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Cart */}
        <div className="w-80 bg-[var(--theme-panel-bg)] border-l border-[var(--theme-border-color)] flex flex-col">
          <div className="p-4 border-b border-[var(--theme-border-color)]">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[var(--theme-text-primary)]">{selectedTable}</h2>
              <span className="text-sm text-[var(--theme-text-muted)]">4 guest</span>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="text-center text-[var(--theme-text-muted)] mt-8">
                <p>No items added</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-[var(--theme-panel-bg-alt)] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-[var(--theme-text-primary)]">{item.name}</span>
                      <span className="text-[var(--theme-acceleration)] font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--theme-text-muted)]">
                        ${item.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="w-6 h-6 bg-[var(--theme-panel-bg)] rounded flex items-center justify-center hover:bg-[var(--theme-border-color)] transition-colors"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <MinusIcon className="h-3 w-3 text-[var(--theme-text-primary)]" />
                        </button>
                        <span className="w-8 text-center text-[var(--theme-text-primary)] font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 bg-[var(--theme-panel-bg)] rounded flex items-center justify-center hover:bg-[var(--theme-border-color)] transition-colors"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <PlusIcon className="h-3 w-3 text-[var(--theme-text-primary)]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          <div className="p-4 border-t border-[var(--theme-border-color)] space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[var(--theme-text-secondary)]">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[var(--theme-text-secondary)]">
                <span>Tax 10%</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-[var(--theme-text-primary)]">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPaymentView(true)}
              disabled={cartItems.length === 0}
              className="w-full py-3 bg-[var(--theme-acceleration)] text-white rounded-lg hover:bg-[var(--theme-acceleration)]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              aria-label="Place order"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CosyPOSPage;
