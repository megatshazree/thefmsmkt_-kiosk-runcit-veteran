import { create } from 'zustand';
import { Store, StoreSettings } from '../types';
import { apiService } from '../services/apiService';

interface StoreState {
  currentStore: Store | null;
  allStores: Store[];
  isLoading: boolean;
  error: string | null;
}

interface StoreActions {
  switchStore: (storeId: string) => Promise<boolean>;
  updateStoreSettings: (storeId: string, settings: Partial<StoreSettings>) => Promise<boolean>;
  refreshStores: () => Promise<void>;
  createStore: (store: Omit<Store, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateStore: (storeId: string, updates: Partial<Store>) => Promise<boolean>;
  deleteStore: (storeId: string) => Promise<boolean>;
  clearError: () => void;
  loadStores: () => Promise<void>;
}

type StoreStore = StoreState & StoreActions;

export const useStoreStore = create<StoreStore>((set, get) => ({
  // Initial state
  currentStore: null,
  allStores: [],
  isLoading: false,
  error: null,

  // Actions
  loadStores: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.getStores();
      
      if (response.success && response.data) {
        set({ allStores: response.data, isLoading: false });
        
        const savedStoreId = localStorage.getItem('current_store_id');
        if (savedStoreId) {
          const savedStore = response.data.find(store => store.id === savedStoreId);
          if (savedStore && savedStore.isActive) {
            set({ currentStore: savedStore });
          }
        }
        
        if (!get().currentStore) {
          const firstActiveStore = response.data.find(store => store.isActive);
          if (firstActiveStore) {
            set({ currentStore: firstActiveStore });
            localStorage.setItem('current_store_id', firstActiveStore.id);
          }
        }
      } else {
        set({ error: response.error || 'Failed to load stores', isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load stores',
        isLoading: false 
      });
    }
  },

  switchStore: async (storeId: string) => {
    const { allStores } = get();
    const targetStore = allStores.find(store => store.id === storeId);
    
    if (!targetStore) {
      set({ error: 'Store not found' });
      return false;
    }

    if (!targetStore.isActive) {
      set({ error: 'Cannot switch to inactive store' });
      return false;
    }

    try {
      const response = await apiService.request('/user/switch-store', {
        method: 'POST',
        body: JSON.stringify({ storeId }),
      });

      if (response.success) {
        set({ currentStore: targetStore, error: null });
        localStorage.setItem('current_store_id', storeId);
        return true;
      } else {
        set({ error: response.error || 'Failed to switch store' });
        return false;
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to switch store'
      });
      return false;
    }
  },

  updateStoreSettings: async (storeId: string, settings: Partial<StoreSettings>) => {
    try {
      const response = await apiService.updateStore(storeId, { settings });
      
      if (response.success && response.data) {
        const { allStores, currentStore } = get();
        const updatedStores = allStores.map(store => 
          store.id === storeId ? response.data! : store
        );
        
        set({ 
          allStores: updatedStores,
          currentStore: currentStore?.id === storeId ? response.data : currentStore,
          error: null 
        });
        return true;
      } else {
        set({ error: response.error || 'Failed to update store settings' });
        return false;
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update store settings'
      });
      return false;
    }
  },

  refreshStores: async () => {
    await get().loadStores();
  },

  createStore: async (storeData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.createStore(storeData);
      
      if (response.success && response.data) {
        const { allStores } = get();
        set({ 
          allStores: [...allStores, response.data],
          isLoading: false,
          error: null 
        });
        return true;
      } else {
        set({ error: response.error || 'Failed to create store', isLoading: false });
        return false;
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create store',
        isLoading: false 
      });
      return false;
    }
  },

  updateStore: async (storeId: string, updates: Partial<Store>) => {
    try {
      const response = await apiService.updateStore(storeId, updates);
      
      if (response.success && response.data) {
        const { allStores, currentStore } = get();
        const updatedStores = allStores.map(store => 
          store.id === storeId ? response.data! : store
        );
        
        set({ 
          allStores: updatedStores,
          currentStore: currentStore?.id === storeId ? response.data : currentStore,
          error: null 
        });
        return true;
      } else {
        set({ error: response.error || 'Failed to update store' });
        return false;
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update store'
      });
      return false;
    }
  },

  deleteStore: async (storeId: string) => {
    try {
      const response = await apiService.deleteStore(storeId);
      
      if (response.success) {
        const { allStores, currentStore } = get();
        const updatedSt