import React, { createContext, useContext, ReactNode } from 'react';

// ToastContext is now deprecated. Use useToastStore from store/toastStore instead.
export const useToast = () => { throw new Error('ToastContext is removed. Use useToastStore from store/toastStore.'); };
export const ToastProvider = ({ children }: { children: any }) => children;
