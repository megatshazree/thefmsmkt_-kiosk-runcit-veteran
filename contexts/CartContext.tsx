
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { CartItem, Product } from '../types';
import { DEFAULT_TAX_RATE } from '../constants/appConstants';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getCartTax: (subtotal?: number) => number;
  getCartTotal: (subtotal?: number, tax?: number) => number;
  getItemCount: () => number;
  setCartItems: (items: CartItem[]) => void; // Added setCartItems
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0) // Remove if quantity is 0
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartSubtotal = useCallback((): number => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const getCartTax = useCallback((subtotal?: number): number => {
    const currentSubtotal = subtotal ?? getCartSubtotal();
    return currentSubtotal * DEFAULT_TAX_RATE; 
  }, [cartItems, getCartSubtotal]);

  const getCartTotal = useCallback((subtotal?: number, tax?: number): number => {
    const currentSubtotal = subtotal ?? getCartSubtotal();
    const currentTax = tax ?? getCartTax(currentSubtotal);
    return currentSubtotal + currentTax;
  }, [cartItems, getCartSubtotal, getCartTax]);

  const getItemCount = useCallback((): number => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Expose setCartItems directly
  const handleSetCartItems = useCallback((items: CartItem[]) => {
    setCartItems(items);
  }, []);

  return (
    <CartContext.Provider value={{ 
        cartItems, addToCart, removeFromCart, updateQuantity, clearCart, 
        getCartSubtotal, getCartTax, getCartTotal, getItemCount,
        setCartItems: handleSetCartItems // Expose setCartItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
