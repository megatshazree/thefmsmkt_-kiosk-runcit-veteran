
import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/common/PageHeader';
import KioskButton from '../../components/common/KioskButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { Product, RecognizedItem, Customer } from '../../types'; // Added Customer
import { mockProducts } from '../../constants/mockData';
import CameraFeedDisplay from './CameraFeedDisplay';
import RecognizedItemsPanel from './RecognizedItemsPanel';
import AmbiguousItemModal from './AmbiguousItemModal';
import WeightInputModal from './WeightInputModal';
import PaymentModal from '../POS/PaymentModal';
import AgeVerificationModal from './AgeVerificationModal';
import AssistanceModal from './AssistanceModal';
import { useNavigate } from 'react-router-dom';
import { UserCircleIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

type PageState = 'idle' | 'scanning' | 'ambiguity_check' | 'weight_check' | 'age_verification_needed' | 'payment_processing';

const VisionCheckoutPage: React.FC = () => {
  const { translate } = useLanguage();
  const { addToCart: addToMainCart, clearCart: clearMainCart } = useCart(); // From main app cart context
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [pageState, setPageState] = useState<PageState>('idle');
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [recognizedItems, setRecognizedItems] = useState<RecognizedItem[]>([]);
  
  const [showAmbiguousModal, setShowAmbiguousModal] = useState(false);
  const [currentItemForAmbiguity, setCurrentItemForAmbiguity] = useState<Product | null>(null);
  const [similarOptionsForAmbiguity, setSimilarOptionsForAmbiguity] = useState<Product[]>([]);

  const [showWeightModal, setShowWeightModal] = useState(false);
  const [currentItemForWeight, setCurrentItemForWeight] = useState<Product | null>(null);

  const [showAgeVerificationModal, setShowAgeVerificationModal] = useState(false);
  const [currentItemForAgeVerification, setCurrentItemForAgeVerification] = useState<Product | null>(null);
  
  const [currentAmbiguityReason, setCurrentAmbiguityReason] = useState<'low_confidence' | 'misidentified' | 'general' | undefined>(undefined);
  const [showAssistanceModal, setShowAssistanceModal] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const allItemsBagged = recognizedItems.length > 0 && recognizedItems.every(item => item.isBagged);

  const addOrUpdateRecognizedItem = useCallback((product: Product, quantity: number = 1, weight?: number) => {
    setRecognizedItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id && item.weight === weight); // Ensure weight is part of uniqueness for scaled items
      
      let basePriceForOneUnit = product.price;
      if (product.requiresScale && weight && product.pricePerUnit) {
        basePriceForOneUnit = product.pricePerUnit * weight;
      }

      let newItems;
      if (existingItemIndex > -1) {
        newItems = [...prevItems];
        const currentItem = newItems[existingItemIndex];
        currentItem.quantity += quantity;
        currentItem.isBagged = false; 
        currentItem.calculatedPrice = basePriceForOneUnit * currentItem.quantity;
        showToast(translate('toast_item_updated_vision', { itemName: product.name }), 'success');
      } else {
        const newItem: RecognizedItem = {
          ...product,
          quantity: quantity,
          weight: weight,
          price: product.price, // Store original unit price or price/kg
          calculatedPrice: basePriceForOneUnit * quantity, // This is the total price for this line item
          isBagged: false, 
        };
        newItems = [...prevItems, newItem];
        showToast(translate('toast_item_added_vision', { itemName: product.name }), 'success');
      }
      
      // Determine next page state
      if (isScanningActive && !showAgeVerificationModal && !showAmbiguousModal && !showWeightModal) {
         setPageState('scanning');
      } else if (newItems.some(item => !item.isBagged)) {
         setPageState('idle'); 
      } else {
         setPageState('idle'); 
      }
      return newItems;
    });
  }, [isScanningActive, showToast, translate, showAgeVerificationModal, showAmbiguousModal, showWeightModal]);


  const processDetectedProduct = useCallback((product: Product) => {
    const confidenceThreshold = 0.75; // Example: if simulated confidence is below 75%
    const isLowConfidence = product.simulatedBaseConfidence !== undefined && product.simulatedBaseConfidence < confidenceThreshold;
    const shouldForceAmbiguityCheck = isLowConfidence || product.isOftenMisidentified;

    let ambiguityReasonToPass: 'low_confidence' | 'misidentified' | 'general' | undefined = undefined;

    if (isLowConfidence) {
      ambiguityReasonToPass = 'low_confidence';
    } else if (product.isOftenMisidentified) {
      ambiguityReasonToPass = 'misidentified';
    } else if (product.isVisuallyAmbiguous) {
      ambiguityReasonToPass = 'general';
    }

    if (product.requiresAgeVerification && !recognizedItems.find(item => item.id === product.id && item.requiresAgeVerification)) { // Check if already verified and added
      setCurrentItemForAgeVerification(product);
      setPageState('age_verification_needed');
      setShowAgeVerificationModal(true);
      setIsScanningActive(false); 
    } else if (product.requiresScale) {
      setCurrentItemForWeight(product);
      setPageState('weight_check');
      setShowWeightModal(true);
      // Potentially pause scanning here if needed, or let it continue if camera can ignore item on scale
    } else if (ambiguityReasonToPass) {
      let similarProds = product.similarProductIds ? mockProducts.filter(p => product.similarProductIds?.includes(p.id)) : [];

      // If ambiguity is forced (low confidence/often misidentified) and no predefined similar products, try to pick some.
      if (shouldForceAmbiguityCheck && similarProds.length === 0 && mockProducts.length > 1) {
        const otherProducts = mockProducts.filter(p => p.id !== product.id);
        if (otherProducts.length > 0) {
          similarProds.push(otherProducts[Math.floor(Math.random() * otherProducts.length)]);
          if (otherProducts.length > 1 && similarProds.length < 2) { // Try to add a second distinct one
            const potentialSecond = otherProducts.find(op => op.id !== similarProds[0].id);
            if (potentialSecond) similarProds.push(potentialSecond);
          }
        }
      }

      if (similarProds.length > 0 || (product.isVisuallyAmbiguous && product.similarProductIds && product.similarProductIds.length > 0)) {
        setCurrentItemForAmbiguity(product);
        setSimilarOptionsForAmbiguity(similarProds);
        setCurrentAmbiguityReason(ambiguityReasonToPass);
        setPageState('ambiguity_check');
        setShowAmbiguousModal(true);
      } else {
        if (isLowConfidence) {
          showToast(translate('toast_item_added_low_confidence_vision', { itemName: product.name }), 'warning', 2500);
        }
        addOrUpdateRecognizedItem(product);
        if (isScanningActive) setPageState('scanning');
      }
    } else {
      addOrUpdateRecognizedItem(product);
      if (isScanningActive) setPageState('scanning'); // Resume scanning state if it was active
    }
  }, [addOrUpdateRecognizedItem, isScanningActive, recognizedItems, showToast, translate]);


  useEffect(() => {
    let scanInterval: number | undefined = undefined;
    if (isScanningActive && 
        pageState !== 'age_verification_needed' && 
        pageState !== 'ambiguity_check' &&
        pageState !== 'weight_check' &&
        pageState !== 'payment_processing') {
      scanInterval = window.setInterval(() => {
        const randomIndex = Math.floor(Math.random() * mockProducts.length);
        const detectedProduct = mockProducts[randomIndex];
        
        // Simulate slight delay for "processing"
        const delay = Math.random() * 1000 + 300; // 0.3 to 1.3 seconds
        setTimeout(() => {
            if (isScanningActive && pageState === 'scanning') { // Double check state before processing
                processDetectedProduct(detectedProduct);
            }
        }, delay);

      }, 3500); // Scan approx every 3.5 seconds
    }
    return () => {
      if (scanInterval !== undefined) {
        clearInterval(scanInterval);
      }
    };
  }, [isScanningActive, pageState, processDetectedProduct]); // Added processDetectedProduct
  
  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    setRecognizedItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const basePriceForOneUnit = item.requiresScale && item.weight && item.pricePerUnit ? 
                                     item.pricePerUnit * item.weight : 
                                     item.price;
          return { 
            ...item, 
            quantity: newQuantity, 
            isBagged: false,
            calculatedPrice: basePriceForOneUnit * newQuantity
          }; 
        }
        return item;
      }).filter(item => item.quantity > 0) // Remove if quantity becomes 0
    );
     if (isScanningActive && !showAgeVerificationModal && !showAmbiguousModal && !showWeightModal) {
       setPageState('scanning');
     } else {
       setPageState('idle');
     }
  };

  const handleRemoveItem = (itemId: number) => {
    setRecognizedItems(prevItems => prevItems.filter(item => item.id !== itemId));
     if (isScanningActive && !showAgeVerificationModal && !showAmbiguousModal && !showWeightModal) {
       setPageState('scanning');
     } else {
       setPageState('idle');
     }
  };

  const handleConfirmAmbiguous = (selectedProduct: Product) => {
    setShowAmbiguousModal(false);
    setCurrentItemForAmbiguity(null);
    setCurrentAmbiguityReason(undefined);
    // Now check if this selected product needs weighing
    if (selectedProduct.requiresScale) {
        setCurrentItemForWeight(selectedProduct);
        setPageState('weight_check');
        setShowWeightModal(true);
    } else {
        addOrUpdateRecognizedItem(selectedProduct);
        if (isScanningActive) setPageState('scanning'); else setPageState('idle');
    }
  };

  const handleConfirmWeight = (product: Product, weight: number) => {
    addOrUpdateRecognizedItem(product, 1, weight);
    setShowWeightModal(false);
    setCurrentItemForWeight(null);
    if (isScanningActive) setPageState('scanning'); else setPageState('idle');
  };

  const handleAttendantVerifiedAge = () => {
    if (currentItemForAgeVerification) {
        const productToAdd = currentItemForAgeVerification;
        setCurrentItemForAgeVerification(null); // Clear before potential next modal
        setShowAgeVerificationModal(false);

        // After age verification, check if the item also needs weighing or ambiguity check
        if (productToAdd.requiresScale) {
            setCurrentItemForWeight(productToAdd);
            setPageState('weight_check');
            setShowWeightModal(true);
        } else if (productToAdd.isVisuallyAmbiguous && productToAdd.similarProductIds && productToAdd.similarProductIds.length > 0) {
            const similarProds = mockProducts.filter(p => productToAdd.similarProductIds?.includes(p.id));
            setCurrentItemForAmbiguity(productToAdd);
            setSimilarOptionsForAmbiguity(similarProds);
            setPageState('ambiguity_check');
            setShowAmbiguousModal(true);
        } else {
            addOrUpdateRecognizedItem(productToAdd);
            showToast(translate('toast_age_item_added', {itemName: productToAdd.name}), 'success');
            if (isScanningActive) setPageState('scanning'); else setPageState('idle');
        }
    } else {
        setShowAgeVerificationModal(false);
        if (isScanningActive) setPageState('scanning'); else setPageState('idle');
    }
  };


  const handleClearTray = () => {
    setRecognizedItems([]);
    showToast(translate('toast_cleared_tray'), 'info');
    setIsScanningActive(false); // Stop scanning when tray is cleared
    setPageState('idle');
  };

  const handleConfirmAllBagged = () => {
    setRecognizedItems(prevItems => prevItems.map(item => ({ ...item, isBagged: true })));
    showToast(translate('toast_all_items_bagged'), 'success');
    setPageState('idle'); 
  };

  const handleProceedToPayment = () => {
    if (recognizedItems.length === 0) {
      showToast(translate('toast_vision_cart_empty_payment'), 'warning');
      return;
    }
    if (!allItemsBagged) {
        showToast(translate('toast_confirm_bagging_required'), 'warning');
        return;
    }
    setIsScanningActive(false); 
    setPageState('payment_processing');
    clearMainCart(); 
    
    recognizedItems.forEach(item => {
       const productDetails: Product = mockProducts.find(p => p.id === item.id)!;
       const cartItemPayload: any = { // Build a valid CartItem like structure
           ...productDetails,
           quantity: 1, // We add one by one to cart context for simplicity
       };
       if (item.weight !== undefined && item.requiresScale && item.pricePerUnit) {
           cartItemPayload.price = item.pricePerUnit * item.weight; // Price for this single weighed unit
           cartItemPayload.weight = item.weight;
       } else {
           cartItemPayload.price = item.price; // Original product price if not weighed
       }

       for (let i = 0; i < item.quantity; i++) {
           addToMainCart(cartItemPayload as Product); // Add to main cart context for payment modal
       }
    });
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    setRecognizedItems([]);
    clearMainCart(); // Clear main cart as well
    showToast(translate('toast_payment_confirmed'), 'success'); // Show general payment confirmed
    navigate('/dashboard'); // Navigate away after success
    setPageState('idle');
  };
  
  const subtotal = recognizedItems.reduce((sum, item) => {
    return sum + (item.calculatedPrice || 0); // Use calculatedPrice which is per line item total
  }, 0);
  const tax = subtotal * 0.06;
  const grandTotal = subtotal + tax;


  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={translate('vision_checkout_title')}
        subtitle={translate('vision_checkout_subtitle')}
      />
      <div className="flex flex-col lg:flex-row gap-6 flex-grow min-h-0"> {/* min-h-0 helps flex children correctly */}
        {/* Left Column */}
        <div className="lg:w-2/5 flex flex-col space-y-6">
          <div className="bg-slate-800 p-4 rounded-xl shadow-lg">
            <CameraFeedDisplay isScanning={isScanningActive && pageState === 'scanning'} />
          </div>
          <div className="bg-slate-800 p-4 rounded-xl shadow-lg grid grid-cols-2 gap-3">
            <KioskButton
              variant={isScanningActive ? 'danger' : 'primary'}
              onClick={() => {
                const newScanningState = !isScanningActive;
                setIsScanningActive(newScanningState);
                if (newScanningState && pageState !=='scanning') setPageState('scanning'); 
                else if (!newScanningState) setPageState('idle');
              }}
              fullWidth
              className="col-span-2"
              disabled={pageState === 'age_verification_needed' || pageState === 'ambiguity_check' || pageState === 'weight_check' || pageState === 'payment_processing'}
            >
              {isScanningActive ? translate('vision_btn_stop_scan') : translate('vision_btn_start_scan')}
            </KioskButton>
            <KioskButton variant="secondary" onClick={handleClearTray} fullWidth>
              {translate('vision_btn_clear_tray')}
            </KioskButton>
             <KioskButton variant="secondary" onClick={() => setShowAssistanceModal(true)} fullWidth className="!bg-sky-500 hover:!bg-sky-600 text-white">
              <UserCircleIcon className="h-5 w-5 mr-2"/>
              {translate('vision_btn_call_assistance')}
            </KioskButton>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:w-3/5 flex flex-col space-y-6 min-h-0"> {/* min-h-0 for flex */}
          <div className="flex-grow min-h-0"> {/* Allow RecognizedItemsPanel to take available space and scroll */}
             <RecognizedItemsPanel 
                items={recognizedItems} 
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
             />
          </div>
          
          <div className="bg-slate-800 p-4 rounded-xl shadow-lg">
            <div className="text-center text-sm text-stone-400 mb-3 p-4 border-2 border-dashed border-slate-600 rounded-lg">
              {translate('vision_bagging_area_placeholder')}
            </div>
            {recognizedItems.length > 0 && !allItemsBagged && (
                 <KioskButton 
                    variant="primary" 
                    onClick={handleConfirmAllBagged} 
                    fullWidth 
                    className="mb-3 !bg-orange-500 hover:!bg-orange-600"
                >
                    <CheckBadgeIcon className="h-5 w-5 mr-2"/>
                    {translate('vision_btn_confirm_all_bagged')}
                </KioskButton>
            )}
          </div>

          <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <div className="space-y-2 mb-4 text-lg">
              <div className="flex justify-between">
                <span>{translate('pos_subtotal_label')}</span>
                <span>RM {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{translate('pos_tax_label')}</span>
                <span>RM {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-2xl text-white">
                <span>{translate('vision_total_label')}</span>
                <span>RM {grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <KioskButton 
                variant="primary" 
                onClick={handleProceedToPayment} 
                fullWidth 
                className="font-bold py-3.5 text-xl"
                disabled={recognizedItems.length === 0 || !allItemsBagged || pageState === 'age_verification_needed' || pageState === 'payment_processing'}
            >
              {translate('vision_btn_proceed_to_payment')}
            </KioskButton>
          </div>
        </div>
      </div>

      <AmbiguousItemModal
        isOpen={showAmbiguousModal}
        onClose={() => { 
            setShowAmbiguousModal(false); 
            setCurrentItemForAmbiguity(null);
            if (isScanningActive) setPageState('scanning'); else setPageState('idle');
        }}
        onConfirm={handleConfirmAmbiguous}
        detectedProduct={currentItemForAmbiguity}
        similarProducts={similarOptionsForAmbiguity}
        ambiguityReason={currentAmbiguityReason}
      />
      <WeightInputModal
        isOpen={showWeightModal}
        onClose={() => { 
            setShowWeightModal(false); 
            setCurrentItemForWeight(null);
            if (isScanningActive) setPageState('scanning'); else setPageState('idle');
        }}
        onConfirm={handleConfirmWeight}
        product={currentItemForWeight}
      />
      <AgeVerificationModal
        isOpen={showAgeVerificationModal}
        onClose={() => {
            setShowAgeVerificationModal(false);
            setCurrentItemForAgeVerification(null);
            // Do not automatically restart scanning if user cancels age verification. Let them re-initiate.
            if (isScanningActive && pageState === 'age_verification_needed') setIsScanningActive(false); // Stop scanning if it was paused for age check
            setPageState('idle');
        }}
        onAttendantVerified={handleAttendantVerifiedAge}
        product={currentItemForAgeVerification}
      />
      <AssistanceModal
        isOpen={showAssistanceModal}
        onClose={() => setShowAssistanceModal(false)}
      />
      {/* PaymentModal uses the main CartContext, which we populate in handleProceedToPayment */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => { 
            setIsPaymentModalOpen(false); 
            setPageState('idle');
            // If payment is cancelled, cart items remain in VisionCheckout's local state
            // and also in the main CartContext. User might want to resume or clear.
            // For now, just closing modal. Cart should ideally be synced or cleared.
        }}
        onPaymentSuccess={handlePaymentSuccess}
        currentOrderDiscount={0} 
        selectedCustomer={null} 
      />
    </div>
  );
};

export default VisionCheckoutPage;
