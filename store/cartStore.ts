import { create } from 'zustand';
import { CartItem, Product } from '../types';
import { DEFAULT_TAX_RATE } from '../constants/appConstants';

interface CartState {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getCartTax: (subtotal?: number) => number;
  getCartTotal: (subtotal?: number, tax?: number) => number;
  getItemCount: () => number;
  setCartItems: (items: CartItem[]) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  addToCart: (product: Product) => set((state: CartState) => {
    const existingItem = state.cartItems.find((item: CartItem) => item.id === product.id);
    if (existingItem) {
      return {
        cartItems: state.cartItems.map((item: CartItem) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    }
    return { cartItems: [...state.cartItems, { ...product, quantity: 1 }] };
  }),
  removeFromCart: (productId: number) => set((state: CartState) => ({
    cartItems: state.cartItems.filter((item: CartItem) => item.id !== productId)
  })),
  updateQuantity: (productId: number, quantity: number) => set((state: CartState) => ({
    cartItems: state.cartItems
      .map((item: CartItem) => item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item)
      .filter((item: CartItem) => item.quantity > 0)
  })),
  clearCart: () => set({ cartItems: [] }),
  getCartSubtotal: (): number => {
    return get().cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
  },
  getCartTax: (subtotal?: number): number => {
    const currentSubtotal = subtotal ?? get().getCartSubtotal();
    return currentSubtotal * DEFAULT_TAX_RATE;
  },
  getCartTotal: (subtotal?: number, tax?: number): number => {
    const currentSubtotal = subtotal ?? get().getCartSubtotal();
    const currentTax = tax ?? get().getCartTax(currentSubtotal);
    return currentSubtotal + currentTax;
  },
  getItemCount: (): number => {
    return get().cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  },
  setCartItems: (items: CartItem[]) => set({ cartItems: items }),
}));
