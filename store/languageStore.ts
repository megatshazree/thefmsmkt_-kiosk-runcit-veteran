import { create } from 'zustand';
import { Language, TranslationStrings } from '../types';
import { languageStrings } from '../constants/translations';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (key: string, interpolations?: Record<string, string | number>) => string;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'ms',
  setLanguage: (language) => set({ language }),
  translate: (key, interpolations) => {
    const { language } = get();
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
            return key;
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
  },
}));
