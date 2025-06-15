import React from 'react';
import { useCartStore } from '../../store/cartStore';
import { useLanguageStore } from '../../store/languageStore';
import { PlusIcon, MinusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Customer } from '../../types';

interface CosyCartDisplayProps {
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

const CosyCartDisplay: React.FC<CosyCartDisplayProps> = ({ 
  selectedCustomer,
  onPayNow, 
  orderDiscountInput, 
  appliedOrderDiscountValue, 
  setAppliedOrderDiscountValue,
  setAppliedOrderDiscountType,
  openDiscountModal,
  openCustomerModal
}) => {
  const { cartItems, removeFromCart, updateQuantity } = useCartStore();
  const { translate } = useLanguageStore();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="text-center text-[var(--theme-text-muted)] py-8">
        <div className="text-4xl mb-2">🛒</div>
        <p className="text-sm">No items in cart</p>
        <p className="text-xs">Add products to start an order</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Cart Items */}
      {cartItems.map((item) => (
        <div key={item.id} className="bg-[var(--theme-panel-bg-alt)] rounded-lg p-3 border border-[var(--theme-border-color)]">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-medium text-[var(--theme-text-primary)] text-sm">{item.name}</h4>
              <p className="text-xs text-[var(--theme-text-muted)]">RM {item.price.toFixed(2)} each</p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="p-1 text-[var(--theme-text-muted)] hover:text-[var(--color-danger)] transition-colors"
              title="Remove item"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                className="w-6 h-6 bg-[var(--theme-input-bg)] rounded flex items-center justify-center hover:bg-[var(--theme-border-color)] transition-colors"
                title="Decrease quantity"
                aria-label="Decrease quantity"
              >
                <MinusIcon className="h-3 w-3 text-[var(--theme-text-primary)]" />
              </button>
              <span className="w-8 text-center text-[var(--theme-text-primary)] font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-6 h-6 bg-[var(--theme-input-bg)] rounded flex items-center justify-center hover:bg-[var(--theme-border-color)] transition-colors"
              >
                <PlusIcon className="h-3 w-3 text-[var(--theme-text-primary)]" />
              </button>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-[var(--theme-acceleration)]">
                RM {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Discount Section */}
      {appliedOrderDiscountValue > 0 && (
        <div className="bg-[var(--theme-panel-bg-alt)] rounded-lg p-3 border border-[var(--theme-border-color)]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--theme-text-secondary)]">Order Discount</span>
            <span className="text-sm text-[var(--color-success)]">
              -RM {appliedOrderDiscountValue.toFixed(2)}
            </span>
          </div>
        </div>
      )}
      
      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          onClick={openDiscountModal}
          className="flex-1 py-2 px-3 bg-[var(--theme-panel-bg-alt)] text-[var(--theme-text-primary)] rounded-lg hover:bg-[var(--theme-border-color)] transition-colors text-sm"
        >
          Add Discount
        </button>
        {!selectedCustomer && (
          <button
            onClick={openCustomerModal}
            className="flex-1 py-2 px-3 bg-[var(--theme-panel-bg-alt)] text-[var(--theme-text-primary)] rounded-lg hover:bg-[var(--theme-border-color)] transition-colors text-sm"
          >
            Add Customer
          </button>
        )}
      </div>
    </div>
  );
};

export default CosyCartDisplay;
