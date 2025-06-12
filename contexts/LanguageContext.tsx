
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { Language, TranslationStrings } from '../types';
import { languageStrings } from '../constants/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (key: string, interpolations?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ms');

  const translate = useCallback((key: string, interpolations?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let currentLevel: TranslationStrings | string = languageStrings[language];

    for (const k of keys) {
      if (typeof currentLevel === 'object' && currentLevel !== null && k in currentLevel) {
        currentLevel = currentLevel[k] as TranslationStrings | string;
      } else {
        // Fallback to 'ms' if key not found in current language, then to the key itself
        currentLevel = languageStrings.ms;
        for (const k_fallback of keys) {
             if (typeof currentLevel === 'object' && currentLevel !== null && k_fallback in currentLevel) {
                currentLevel = currentLevel[k_fallback] as TranslationStrings | string;
             } else {
                return key; // Key not found
             }
        }
        break;
      }
    }
    
    let translatedString = typeof currentLevel === 'string' ? currentLevel : key;

    if (interpolations) {
      Object.keys(interpolations).forEach((placeholder) => {
        translatedString = translatedString.replace(`{${placeholder}}`, String(interpolations[placeholder]));
      });
    }

    return translatedString;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
