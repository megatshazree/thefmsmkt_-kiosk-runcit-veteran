import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useLanguageStore } from '../../store/languageStore';
import { useCartStore } from '../../store/cartStore';
import { useToastStore } from '../../store/toastStore';
import PageHeader from '../../components/common/PageHeader';
import CosyProductGrid from './CosyProductGrid';
import CosyCartDisplay from './CosyCartDisplay';
import PaymentModal from './PaymentModal';
import ReturnModal from './ReturnModal';
import KioskButton from '../../components/common/KioskButton';
import KioskInput from '../../components/common/KioskInput';
import { mockProductCategories, mockProducts as initialMockProducts } from '../../constants/mockData';
import { Product, HeldOrder, Customer } from '../../types'; 
import QuickAddProductModal from './QuickAddProductModal';
import CheckPriceModal from './CheckPriceModal';
import ApplyDiscountModal from './ApplyDiscountModal';
import RecallOrderModal from './RecallOrderModal';
import CustomerSearchModal from './CustomerSearchModal'; 
import { ArchiveBoxArrowDownIcon, MagnifyingGlassCircleIcon, TagIcon, PlusCircleIcon, ArrowPathRoundedSquareIcon, ArrowsRightLeftIcon, UserPlusIcon, UserMinusIcon, FunnelIcon, SparklesIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { getStyledCategories } from '../../constants/categoryStyles';
import useDebounce from '../../hooks/useDebounce'; // Import useDebounce
import CameraFeedDisplay from '../VisionCheckout/CameraFeedDisplay';
import AmbiguousItemModal from '../VisionCheckout/AmbiguousItemModal';
import WeightInputModal from '../VisionCheckout/WeightInputModal';
import AgeVerificationModal from '../VisionCheckout/AgeVerificationModal';
import Modal from '../../components/common/Modal';
import { mockProducts } from '../../constants/mockData';

const POSPage: React.FC = () => {
  const { translate } = useLanguageStore();
  const { cartItems, clearCart, addToCart, setCartItems } = useCartStore(); 
  const { showToast } = useToastStore();

  const [products, setProducts] = useState<Product[]>(() => [...initialMockProducts]);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('pos_cat_all');
  
  const [searchTermInput, setSearchTermInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchTermInput, 300); // Debounce search term
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [isCheckPriceModalOpen, setIsCheckPriceModalOpen] = useState(false);
  const [isApplyDiscountModalOpen, setIsApplyDiscountModalOpen] = useState(false);
  const [isRecallOrderModalOpen, setIsRecallOrderModalOpen] = useState(false);
  const [isCustomerSearchModalOpen, setIsCustomerSearchModalOpen] = useState(false); 
  const [isVisionAIModalOpen, setIsVisionAIModalOpen] = useState(false);

  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null); 

  const [orderDiscountInput, setOrderDiscountInput] = useState(''); 
  const [appliedOrderDiscountValue, setAppliedOrderDiscountValue] = useState(0); 
  const [appliedOrderDiscountType, setAppliedOrderDiscountType] = useState<'percentage' | 'fixed' | null>(null);

  const [isVisionAIScanning, setIsVisionAIScanning] = useState(false);
  const [visionAIPageState, setVisionAIPageState] = useState<'idle' | 'scanning' | 'ambiguity_check' | 'weight_check' | 'age_verification_needed'>('idle');
  const [currentAmbiguousProduct, setCurrentAmbiguousProduct] = useState<Product | null>(null);
  const [similarOptionsForAmbiguity, setSimilarOptionsForAmbiguity] = useState<Product[]>([]);
  const [currentWeightProduct, setCurrentWeightProduct] = useState<Product | null>(null);
  const [currentAgeProduct, setCurrentAgeProduct] = useState<Product | null>(null);
  const [currentAmbiguityReason, setCurrentAmbiguityReason] = useState<'low_confidence' | 'misidentified' | 'general' | undefined>(undefined);
  const visionAIScanIntervalRef = React.useRef<number | null>(null);

  const productCountsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const styledCategories = useMemo(() => 
    getStyledCategories(mockProductCategories, productCountsByCategory),
  [productCountsByCategory]);


  const handlePaymentSuccess = useCallback(() => {
    clearCart();
    setOrderDiscountInput(''); 
    setAppliedOrderDiscountValue(0);
    setAppliedOrderDiscountType(null);
    setSelectedCustomer(null); 
    setIsPaymentModalOpen(false);
  }, [clearCart]);

  const handleReturnSuccess = useCallback(() => {
    setIsReturnModalOpen(false);
  }, []);

  const handleQuickAddProduct = useCallback((newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]); 
    addToCart(newProduct); 
    showToast(translate('toast_product_added_to_pos', { productName: newProduct.name }), 'success');
    setIsQuickAddModalOpen(false);
  }, [addToCart, showToast, translate]);

  const handleApplyOrderDiscount = useCallback((value: string, type: 'percentage' | 'fixed') => {
    setOrderDiscountInput(`${value}${type === 'percentage' ? '%' : ''}`);
    showToast(translate('toast_discount_applied'), 'success');
    setIsApplyDiscountModalOpen(false);
  }, [showToast, translate]);

   const handleRemoveOrderDiscount = useCallback(() => {
    setOrderDiscountInput('');
    setAppliedOrderDiscountValue(0);
    setAppliedOrderDiscountType(null);
    showToast(translate('toast_discount_removed'), 'info');
  }, [showToast, translate]);


  const handleHoldOrder = useCallback(() => {
    if (cartItems.length === 0) {
      showToast(translate('toast_cart_empty'), 'warning');
      return;
    }
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newHeldOrder: HeldOrder = {
      id: `HO-${Date.now()}`,
      timestamp: new Date(),
      items: [...cartItems], 
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: subtotal * 1.06, // Assuming 6% tax for total
      customer: selectedCustomer, 
    };

    setHeldOrders(prev => [...prev, newHeldOrder]);
    clearCart();
    setOrderDiscountInput(''); 
    setAppliedOrderDiscountValue(0);
    setAppliedOrderDiscountType(null);
    setSelectedCustomer(null); 
    showToast(translate('toast_order_held'), 'success');
  }, [cartItems, selectedCustomer, clearCart, showToast, translate]);

  const handleRecallOrder = useCallback((orderToRecall: HeldOrder) => {
    setCartItems(orderToRecall.items); 
    setHeldOrders(prev => prev.filter(order => order.id !== orderToRecall.id)); 
    setSelectedCustomer(orderToRecall.customer || null); 
    showToast(translate('toast_order_recalled'), 'success');
    setIsRecallOrderModalOpen(false);
  }, [setCartItems, showToast, translate]);
  
  const handleSelectCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    showToast(translate('toast_customer_selected', { customerName: customer.name }), 'success');
    setIsCustomerSearchModalOpen(false);
  }, [showToast, translate]);

  const handleClearCustomer = useCallback(() => {
    setSelectedCustomer(null);
    showToast(translate('toast_customer_cleared'), 'info');
  }, [showToast, translate]);

  const handleCategorySelect = useCallback((categoryKey: string) => {
    setSelectedCategoryKey(categoryKey);
  }, []);

  // Vision AI scanning logic
  const processVisionAIProduct = useCallback((product: Product) => {
    let ambiguityReasonToPass: 'low_confidence' | 'misidentified' | 'general' | undefined = undefined;
    if (product.isVisuallyAmbiguous) ambiguityReasonToPass = 'general';
    if (product.requiresAgeVerification) {
      setCurrentAgeProduct(product);
      setVisionAIPageState('age_verification_needed');
      setIsVisionAIScanning(false);
      return;
    } else if (product.requiresScale) {
      setCurrentWeightProduct(product);
      setVisionAIPageState('weight_check');
      setIsVisionAIScanning(false);
      return;
    } else if (ambiguityReasonToPass) {
      let similarProds = product.similarProductIds ? mockProducts.filter(p => product.similarProductIds?.includes(p.id)) : [];
      setCurrentAmbiguousProduct(product);
      setSimilarOptionsForAmbiguity(similarProds);
      setCurrentAmbiguityReason(ambiguityReasonToPass);
      setVisionAIPageState('ambiguity_check');
      setIsVisionAIScanning(false);
      return;
    }
    // Add to cart directly if no ambiguity/weight/age
    const cartItem = { ...product, quantity: 1 };
    addToCart(cartItem);
    showToast('Produk ditambah: ' + product.name, 'success');
  }, [addToCart, showToast]);

  // Start/stop Vision AI scanning
  useEffect(() => {
    if (isVisionAIModalOpen && isVisionAIScanning && visionAIPageState === 'scanning') {
      visionAIScanIntervalRef.current = window.setInterval(() => {
        const randomIndex = Math.floor(Math.random() * mockProducts.length);
        const detectedProduct = mockProducts[randomIndex];
        processVisionAIProduct(detectedProduct);
      }, 3500);
    } else {
      if (visionAIScanIntervalRef.current) {
        clearInterval(visionAIScanIntervalRef.current);
        visionAIScanIntervalRef.current = null;
      }
    }
    return () => {
      if (visionAIScanIntervalRef.current) {
        clearInterval(visionAIScanIntervalRef.current);
        visionAIScanIntervalRef.current = null;
      }
    };
  }, [isVisionAIModalOpen, isVisionAIScanning, visionAIPageState, processVisionAIProduct]);

  // Modal handlers
  const handleVisionAIClose = useCallback(() => {
    setIsVisionAIModalOpen(false);
    setIsVisionAIScanning(false);
    setVisionAIPageState('idle');
    setCurrentAmbiguousProduct(null);
    setSimilarOptionsForAmbiguity([]);
    setCurrentWeightProduct(null);
    setCurrentAgeProduct(null);
    setCurrentAmbiguityReason(undefined);
  }, []);

  const handleVisionAIStartStop = useCallback(() => {
    if (isVisionAIScanning) {
      setIsVisionAIScanning(false);
      setVisionAIPageState('idle');
    } else {
      setIsVisionAIScanning(true);
      setVisionAIPageState('scanning');
    }
  }, [isVisionAIScanning]);

  // Ambiguity, weight, and age modal handlers
  const handleVisionAIAmbiguousConfirm = (selectedProduct: Product) => {
    setCurrentAmbiguousProduct(null);
    setSimilarOptionsForAmbiguity([]);
    setCurrentAmbiguityReason(undefined);
    setVisionAIPageState('idle');
    if (selectedProduct.requiresScale) {
      setCurrentWeightProduct(selectedProduct);
      setVisionAIPageState('weight_check');
      return;
    }
    const cartItem = { ...selectedProduct, quantity: 1 };
    addToCart(cartItem);
    showToast('Produk ditambah: ' + selectedProduct.name, 'success');
  };
  
  const handleVisionAIWeightConfirm = (product: Product, weight: number) => {
    setCurrentWeightProduct(null);
    setVisionAIPageState('idle');
    const cartItem = { ...product, quantity: 1, weight };
    addToCart(cartItem);
    showToast('Produk ditambah: ' + product.name, 'success');
  };
  
  const handleVisionAIAgeVerified = () => {
    if (currentAgeProduct) {
      const productToAdd = currentAgeProduct;
      setCurrentAgeProduct(null);
      setVisionAIPageState('idle');
      if (productToAdd.requiresScale) {
        setCurrentWeightProduct(productToAdd);
        setVisionAIPageState('weight_check');
        return;
      }
      const cartItem = { ...productToAdd, quantity: 1 };
      addToCart(cartItem);
      showToast('Produk ditambah: ' + productToAdd.name, 'success');
    }
  };

  const posActionButtons = useMemo(() => [
    { labelKey: 'pos_btn_hold', label: 'Simpan Pesanan', icon: ArchiveBoxArrowDownIcon, onClick: handleHoldOrder, aria: 'Hold current order' },
    { labelKey: 'pos_btn_recall', label: 'Panggil Semula Pesanan', icon: ArrowPathRoundedSquareIcon, onClick: () => setIsRecallOrderModalOpen(true), aria: 'Recall a held order' },
    { labelKey: 'pos_btn_discount_items', label: 'Diskaun Pesanan', icon: TagIcon, onClick: () => setIsApplyDiscountModalOpen(true), aria: 'Apply discount to order' },
    { labelKey: 'pos_btn_quick_add_product', label: 'Tambah Produk Pantas', icon: PlusCircleIcon, onClick: () => setIsQuickAddModalOpen(true), aria: 'Quickly add a new product' },
    { labelKey: 'pos_btn_return_exchange', label: 'Pulangan/Tukar', icon: ArrowsRightLeftIcon, onClick: () => setIsReturnModalOpen(true), aria: 'Process a return or exchange' },
    { labelKey: 'pos_btn_check_price', label: 'Semak Harga', icon: MagnifyingGlassCircleIcon, onClick: () => setIsCheckPriceModalOpen(true), aria: 'Check price of a product' },
    { labelKey: 'pos_btn_vision_ai', label: 'Imbas Produk AI', icon: SparklesIcon, onClick: () => setIsVisionAIModalOpen(true), aria: 'Start Vision AI product recognition' },
  ], [handleHoldOrder]);

  return (
    <div className="flex h-screen bg-[var(--theme-bg-deep-space)]">
      {/* Left Sidebar Navigation - CosyPOS Style */}
      <div className="w-64 bg-[var(--theme-panel-bg)] border-r border-[var(--theme-border-color)] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[var(--theme-border-color)]">
          <div className="flex items-center gap-2">
            <Squares2X2Icon className="h-6 w-6 text-[var(--theme-text-primary)]" />
            <span className="text-lg font-semibold text-[var(--theme-text-primary)]">THEFMSMKT</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 space-y-2">
          <div className="text-xs font-medium text-[var(--theme-text-muted)] mb-2">Actions</div>
          {posActionButtons.slice(0, 6).map(action => (
            <button
              key={action.labelKey}
              onClick={action.onClick}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-[var(--theme-text-secondary)] hover:bg-[var(--theme-panel-bg-alt)] hover:text-[var(--theme-text-primary)]"
              title={action.label}
            >
              <action.icon className="h-4 w-4" />
              <span className="text-sm">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Customer Section */}
        <div className="p-4 border-t border-[var(--theme-border-color)] mt-auto">
          <div className="text-xs font-medium text-[var(--theme-text-muted)] mb-2">Customer</div>
          {selectedCustomer ? (
            <div className="flex items-center justify-between p-2 bg-[var(--theme-panel-bg-alt)] rounded-lg">
              <span className="text-sm text-[var(--theme-text-primary)]">{selectedCustomer.name}</span>
              <button
                onClick={handleClearCustomer}
                className="p-1 text-[var(--theme-text-muted)] hover:text-[var(--color-danger)]"
                title="Clear customer"
              >
                <UserMinusIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCustomerSearchModalOpen(true)}
              className="w-full flex items-center gap-2 p-2 bg-[var(--theme-acceleration)] text-white rounded-lg hover:bg-[var(--theme-acceleration)]/80 transition-colors"
            >
              <UserPlusIcon className="h-4 w-4" />
              <span className="text-sm">Add Customer</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header Bar */}
        <div className="bg-[var(--theme-panel-bg)] border-b border-[var(--theme-border-color)] p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[var(--theme-text-primary)]">Point of Sale</h1>
              <div className="flex items-center gap-4 text-sm text-[var(--theme-text-muted)]">
                <span>Cashier: <span className="text-[var(--theme-text-primary)] font-medium">Siti</span></span>
                <span>Shift: <span className="text-[var(--theme-acceleration)] font-medium">RM 0.00</span></span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => showToast(translate('pos_help_info'), 'info')}
                className="p-2 text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] rounded-lg hover:bg-[var(--theme-panel-bg-alt)]"
                title="Help"
              >
                ?
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1">
          {/* Product Area */}
          <div className="flex-1 p-4">
            <CosyProductGrid 
              products={products} 
              styledCategories={styledCategories}
              selectedCategoryKey={selectedCategoryKey}
              onCategoryChange={handleCategorySelect}
              searchTerm={debouncedSearchTerm} 
              className="h-full"
            />
          </div>

          {/* Right: Cart Panel - CosyPOS Style */}
          <div className="w-80 bg-[var(--theme-panel-bg)] border-l border-[var(--theme-border-color)] flex flex-col">
            {/* Cart Header */}
            <div className="p-4 border-b border-[var(--theme-border-color)]">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-[var(--theme-text-primary)]">Current Order</h2>
                <span className="text-sm text-[var(--theme-text-muted)]">{cartItems.length} items</span>
              </div>
              {selectedCustomer && (
                <div className="text-sm text-[var(--theme-acceleration)]">Customer: {selectedCustomer.name}</div>
              )}
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <CosyCartDisplay 
                selectedCustomer={selectedCustomer}
                onPayNow={() => setIsPaymentModalOpen(true)}
                orderDiscountInput={orderDiscountInput}
                setOrderDiscountInput={setOrderDiscountInput} 
                appliedOrderDiscountValue={appliedOrderDiscountValue} 
                setAppliedOrderDiscountValue={setAppliedOrderDiscountValue} 
                appliedOrderDiscountType={appliedOrderDiscountType} 
                setAppliedOrderDiscountType={setAppliedOrderDiscountType} 
                openDiscountModal={() => setIsApplyDiscountModalOpen(true)} 
                openCustomerModal={() => setIsCustomerSearchModalOpen(true)}
              />
            </div>

            {/* Cart Summary & Payment */}
            <div className="p-4 border-t border-[var(--theme-border-color)] space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-[var(--theme-text-secondary)]">
                  <span>Subtotal</span>
                  <span>RM {cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--theme-text-secondary)]">
                  <span>Tax (6%)</span>
                  <span>RM {(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.06).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-[var(--theme-text-primary)]">
                  <span>Total</span>
                  <span className="text-[var(--theme-acceleration)]">
                    RM {(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.06).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                disabled={cartItems.length === 0}
                className="w-full py-3 bg-[var(--theme-acceleration)] text-white rounded-lg hover:bg-[var(--theme-acceleration)]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Process Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={useCallback(() => setIsPaymentModalOpen(false), [])}
        onPaymentSuccess={handlePaymentSuccess}
        currentOrderDiscount={appliedOrderDiscountValue} 
        selectedCustomer={selectedCustomer}
      />
      <ReturnModal 
        isOpen={isReturnModalOpen}
        onClose={useCallback(() => setIsReturnModalOpen(false), [])}
        onReturnSuccess={handleReturnSuccess}
      />
      <QuickAddProductModal
        isOpen={isQuickAddModalOpen}
        onClose={useCallback(() => setIsQuickAddModalOpen(false), [])}
        onSave={handleQuickAddProduct}
        existingCategories={mockProductCategories.filter(cat => cat !== "Semua")}
      />
      <CheckPriceModal
        isOpen={isCheckPriceModalOpen}
        onClose={useCallback(() => setIsCheckPriceModalOpen(false), [])}
        products={products}
      />
      <ApplyDiscountModal
        isOpen={isApplyDiscountModalOpen}
        onClose={useCallback(() => setIsApplyDiscountModalOpen(false), [])}
        onApplyDiscount={handleApplyOrderDiscount}
        onRemoveDiscount={handleRemoveOrderDiscount}
        currentDiscountInput={orderDiscountInput}
      />
      <RecallOrderModal
        isOpen={isRecallOrderModalOpen}
        onClose={useCallback(() => setIsRecallOrderModalOpen(false), [])}
        heldOrders={heldOrders}
        onRecall={handleRecallOrder}
      />
      <CustomerSearchModal
        isOpen={isCustomerSearchModalOpen}
        onClose={useCallback(() => setIsCustomerSearchModalOpen(false), [])}
        onSelectCustomer={handleSelectCustomer}
      />
      {/* Vision AI Modal */}
      {isVisionAIModalOpen && (
        <Modal isOpen={isVisionAIModalOpen} onClose={handleVisionAIClose} title="Imbas Produk AI" maxWidth="max-w-2xl">
          <div className="flex flex-col gap-4">
            <CameraFeedDisplay isScanning={isVisionAIScanning && visionAIPageState === 'scanning'} />
            <div className="flex gap-3 mt-2">
              <KioskButton
                variant={isVisionAIScanning ? 'danger' : 'primary'}
                onClick={handleVisionAIStartStop}
                fullWidth
                disabled={visionAIPageState !== 'idle' && visionAIPageState !== 'scanning'}
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                {isVisionAIScanning ? 'Henti Imbas' : 'Mula Imbas'}
              </KioskButton>
              <KioskButton variant="secondary" onClick={handleVisionAIClose} fullWidth>
                Tutup
              </KioskButton>
            </div>
          </div>
          {/* Ambiguity, Weight, Age Modals (inside Vision AI modal for context) */}
          <AmbiguousItemModal
            isOpen={visionAIPageState === 'ambiguity_check' && !!currentAmbiguousProduct}
            onClose={() => { setCurrentAmbiguousProduct(null); setVisionAIPageState('idle'); setCurrentAmbiguityReason(undefined); }}
            onConfirm={handleVisionAIAmbiguousConfirm}
            detectedProduct={currentAmbiguousProduct}
            similarProducts={similarOptionsForAmbiguity}
            ambiguityReason={currentAmbiguityReason}
            multiDetection={true}
          />
          <WeightInputModal
            isOpen={visionAIPageState === 'weight_check' && !!currentWeightProduct}
            onClose={() => { setCurrentWeightProduct(null); setVisionAIPageState('idle'); }}
            onConfirm={handleVisionAIWeightConfirm}
            product={currentWeightProduct}
          />
          <AgeVerificationModal
            isOpen={visionAIPageState === 'age_verification_needed' && !!currentAgeProduct}
            onClose={() => { setCurrentAgeProduct(null); setVisionAIPageState('idle'); }}
            onAttendantVerified={handleVisionAIAgeVerified}
            product={currentAgeProduct}
          />
        </Modal>
      )}
    </div>
  );
};

export default React.memo(POSPage);
