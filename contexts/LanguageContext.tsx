import React, { createContext, useContext, ReactNode } from 'react';

// LanguageContext is now deprecated. Use useLanguageStore from store/languageStore instead.
export const useLanguage = () => { throw new Error('LanguageContext is removed. Use useLanguageStore from store/languageStore.'); };
export const LanguageProvider = ({ children }: { children: any }) => children;
