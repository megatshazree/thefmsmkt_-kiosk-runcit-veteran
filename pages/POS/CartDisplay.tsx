import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { useLanguage } from '../../contexts/LanguageContext';
import KioskButton from '../../components/common/KioskButton';
import { XCircleIcon, SparklesIcon, TagIcon } from '@heroicons/react/24/solid';
import { getRelatedProductSuggestions } from '../../services/geminiService';
import { mockProducts } from '../../constants/mockData';
import { Customer } from '../../types'; 
import Loader from '../../components/common/Loader';

interface CartDisplayProps {
  selectedCustomer: Customer | null; 
  onPayNow: () => void;
  orderDiscountInput: string;
  setOrderDiscountInput: (value: string) => void; 
  appliedOrderDiscountValue: number;
  setAppliedOrderDiscountValue: (value: number) => void;
  appliedOrderDiscountType: 'percentage' | 'fixed' | null;
  setAppliedOrderDiscountType: (type: 'percentage' | 'fixed' | null) => void;
  openDiscountModal: () => void; 
  openCustomerModal: () => void; 
}

const CartDisplay: React.FC<CartDisplayProps> = ({ 
    selectedCustomer,
    onPayNow, 
    orderDiscountInput, 
    appliedOrderDiscountValue, 
    setAppliedOrderDiscountValue,
    setAppliedOrderDiscountType,
    openDiscountModal,
    openCustomerModal
}) => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { showToast } = useToast();
  const { translate } = useLanguage();
  const [geminiSuggestions, setGeminiSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

 useEffect(() => {
    let newDiscountAmount = 0;
    let discountType: 'percentage' | 'fixed' | null = null;

    if (orderDiscountInput) {
        const trimmedInput = orderDiscountInput.trim();
        if (trimmedInput.endsWith('%')) {
            const percentage = parseFloat(trimmedInput.slice(0, -1));
            if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
                newDiscountAmount = subtotal * (percentage / 100);
                discountType = 'percentage';
            }
        } else {
            const amount = parseFloat(trimmedInput);
            if (!isNaN(amount) && amount >= 0) {
                newDiscountAmount = Math.min(amount, subtotal); // Cap discount at subtotal
                discountType = 'fixed';
            }
        }
    }
    setAppliedOrderDiscountValue(newDiscountAmount);
    setAppliedOrderDiscountType(discountType);

}, [orderDiscountInput, subtotal, setAppliedOrderDiscountValue, setAppliedOrderDiscountType]);


  const discountedSubtotal = Math.max(0, subtotal - appliedOrderDiscountValue);
  const tax = getCartTax(discountedSubtotal);
  const grandTotal = discountedSubtotal + tax;
  
  const handlePayNowClick = useCallback(() => {
    if (getItemCount() === 0) {
      showToast(translate('toast_cart_empty'), 'warning');
      return;
    }
    onPayNow();
  }, [getItemCount, onPayNow, showToast, translate]);

  const handleGeminiSuggest = useCallback(async () => {
    if (cartItems.length === 0) {
      showToast(translate('toast_product_suggestion_cart_empty'), 'warning');
      return;
    }
    setIsSuggesting(true);
    setGeminiSuggestions([]);
    // Toast is handled by KioskButton isLoading state, or you can add specific one here
    
    const cartItemNames = cartItems.map(item => item.name).join(', ');
    const productCatalogNames = mockProducts.map(p => p.name).join(', ');
    
    const result = await getRelatedProductSuggestions(cartItemNames, productCatalogNames);
    
    setIsSuggesting(false);
    if (result.error) {
      showToast(translate('toast_api_error', { message: result.error }), 'error');
    } else if (result.data && result.data.length > 0) {
      setGeminiSuggestions(result.data);
      showToast(translate('toast_product_suggestion_received'), 'success');
    } else {
      showToast(translate('toast_product_suggestion_failed'), 'info');
    }
  }, [cartItems, showToast, translate]);

  const handleQuantityChange = useCallback((itemId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity)) {
        updateQuantity(itemId, Math.max(1, newQuantity)); // Ensure quantity is at least 1
    }
  }, [updateQuantity]);

  const handleQuantityBlur = useCallback((itemId: number, currentQuantity: number, e: React.FocusEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (isNaN(newQuantity) || newQuantity < 1) {
        updateQuantity(itemId, currentQuantity); // Revert to original if invalid
    }
  }, [updateQuantity]);


  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-[var(--theme-text-primary)]">{translate('pos_order_details')}</h3>
        <span className="text-sm text-[var(--theme-text-muted)]">{translate('pos_order_no')}: <span className="font-semibold">#1057</span></span>
      </div>
      <div className="mb-3">
        <button 
          type="button"
          onClick={openCustomerModal}
          className="text-sm text-[var(--theme-accent-cyan)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--theme-focus-ring)] rounded-md p-1 -m-1"
          aria-label={translate('pos_customer_search_action_text')}
        >
          <span className="text-[var(--theme-text-secondary)]">{translate('pos_customer_label')}</span>{' '}
          <span className="font-semibold">{selectedCustomer ? selectedCustomer.name : translate('pos_walk_in_customer_default_text')}</span>
          {' '}
          <span className="text-xs text-[var(--theme-text-muted)]">({selectedCustomer ? translate('btn_edit') : translate('pos_customer_search_action_text').split('(')[1].split(')')[0]})</span>
        </button>
      </div>

      <div className="flex-grow space-y-1.5 overflow-y-auto max-h-60 sm:max-h-[calc(100vh-550px)] pr-1.5 custom-scrollbar mb-3" aria-live="polite">
        {cartItems.length === 0 ? (
          <p className="text-[var(--theme-text-muted)] text-center py-6">{translate('pos_cart_empty')}</p>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center p-2 border-b border-[var(--theme-border-color)]">
              <div className="flex-1 mr-2">
                <p className="font-medium text-sm text-[var(--theme-text-primary)]">{item.name}</p>
                <div className="flex items-center text-xs text-[var(--theme-text-muted)]">
                    RM {item.price.toFixed(2)} x 
                    <input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => handleQuantityChange(item.id, e)}
                        onBlur={(e) => handleQuantityBlur(item.id, item.quantity, e)}
                        className="w-10 text-center bg-[var(--theme-input-bg)] text-[var(--theme-text-primary)] rounded mx-1 py-0.5 border border-[var(--theme-border-color)] focus:ring-1 focus:ring-[var(--theme-focus-ring)] focus:border-[var(--theme-focus-ring)] text-xs appearance-none [-moz-appearance:_textfield]"
                        min="1"
                        aria-label={`Quantity for ${item.name}`}
                    />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm text-[var(--theme-text-primary)] w-16 text-right">RM {(item.price * item.quantity).toFixed(2)}</span>
                <button 
                  type="button"
                  onClick={() => removeFromCart(item.id)} 
                  className="text-red-400 hover:text-red-300 p-0.5 rounded-full focus:outline-none focus:ring-1 focus:ring-red-300"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <XCircleIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-auto"> 
        <div className="mb-3">
          <KioskButton 
            variant="gemini" 
            fullWidth 
            onClick={handleGeminiSuggest} 
            isLoading={isSuggesting}
            className="text-xs py-2"
            aria-controls="gemini-suggestions-list"
          >
             <SparklesIcon className="h-4 w-4 mr-1" aria-hidden="true"/> {translate('pos_btn_gemini_suggest')}
          </KioskButton>
          {isSuggesting && <Loader size="sm" text={translate('toast_product_suggestion_generating')} />}
          {geminiSuggestions.length > 0 && !isSuggesting && (
            <div id="gemini-suggestions-list" className="mt-2 text-xs text-[var(--theme-text-secondary)] bg-[var(--theme-panel-bg-alt)] p-2 rounded-md" aria-live="polite">
              <h4 className="font-semibold text-xs mb-0.5 text-[var(--theme-accent-magenta)]">{translate('pos_gemini_suggestions_title')}</h4>
              <ul className="list-disc list-inside ml-1 space-y-0.5">
                {geminiSuggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-[var(--theme-border-color)] pt-3 mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--theme-text-secondary)]">{translate('pos_subtotal_label')}</span>
            <span className="text-[var(--theme-text-primary)]">RM {subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <KioskButton
                variant="secondary"
                onClick={openDiscountModal}
                className="!p-1 text-xs !bg-transparent hover:!bg-[var(--theme-panel-bg-alt)] border border-[var(--theme-border-color)]"
                aria-label={translate('pos_btn_discount_items')}
            >
                <TagIcon className="h-3.5 w-3.5 mr-1 text-[var(--theme-accent-cyan)]" aria-hidden="true"/>
                <span className="text-[var(--theme-text-muted)]">{translate('pos_discount_label')}</span>
            </KioskButton>
            {appliedOrderDiscountValue > 0 && (
                <span className="text-xs text-[var(--theme-accent-purple)] px-1.5 py-0.5 bg-[var(--theme-panel-bg-alt)] rounded-md">
                  {orderDiscountInput}
                </span>
            )}
          </div>

          {appliedOrderDiscountValue > 0 && (
            <div className="flex justify-between text-xs text-[var(--theme-text-secondary)]">
                <span>{translate('pos_applied_discount_value_label')}</span>
                <span className="text-red-400 font-medium">- RM {appliedOrderDiscountValue.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-[var(--theme-text-secondary)]">{translate('pos_tax_label')}</span>
            <span className="text-[var(--theme-text-primary)]">RM {tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-[var(--theme-text-primary)]">
            <span>{translate('pos_grand_total_label')}</span>
            <span>RM {grandTotal.toFixed(2)}</span>
          </div>
        </div>
        
        <KioskButton onClick={handlePayNowClick} fullWidth className="font-bold py-3 mt-4 text-lg">
          {translate('pos_btn_pay_now')}
        </KioskButton>
      </div>
    </>
  );
};

export default React.memo(CartDisplay);
