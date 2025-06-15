import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/common/PageHeader';
import KioskButton from '../../components/common/KioskButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToastStore } from '../../store/toastStore';
import { Product } from '../../types';
import { mockProducts, shelfLayoutConfig } from '../../constants/mockData';
import ShelfDisplay from '../../components/inventory/ShelfDisplay';
import LowStockAlertsPanel from '../../components/inventory/LowStockAlertsPanel';
import MisplacedItemsPanel from '../../components/inventory/MisplacedItemsPanel';

const InventoryMonitoringPage: React.FC = () => {
  const { translate } = useLanguage();
  const { showToast } = useToastStore();

  const [isMonitoringActive, setIsMonitoringActive] = useState(false);
  // Initialize with mockProducts, this will be the "live" data
  const [monitoredProducts, setMonitoredProducts] = useState<Product[]>(() => 
    // Deep clone to avoid mutating original mockData
    JSON.parse(JSON.stringify(mockProducts))
  );
  const [lowStockAlerts, setLowStockAlerts] = useState<Product[]>([]);
  const [misplacedItems, setMisplacedItems] = useState<Product[]>([]);

  const updateAlerts = useCallback((products: Product[]) => {
    const lowStock = products.filter(p => p.reorderLevel && p.stock < p.reorderLevel);
    const misplaced = products.filter(p => p.shelfLocationId && p.currentShelfLocationId && p.shelfLocationId !== p.currentShelfLocationId);
    setLowStockAlerts(lowStock);
    setMisplacedItems(misplaced);
  }, []);

  // Initial alerts update
  useEffect(() => {
    updateAlerts(monitoredProducts);
  }, []); // Run once on mount with initial monitoredProducts


  // Simulation interval
  useEffect(() => {
    let simulationInterval: number | undefined = undefined;
    if (isMonitoringActive) {
      simulationInterval = window.setInterval(() => {
        setMonitoredProducts(prevProducts => {
          const updatedProducts = prevProducts.map(p => ({ ...p })); // Create new array of new product objects

          // Simulate stock decrease for a random product
          if (updatedProducts.length > 0) {
            const productIndexToChange = Math.floor(Math.random() * updatedProducts.length);
            const productToChange = updatedProducts[productIndexToChange];
            if (productToChange.stock > 0 && Math.random() < 0.3) { // 30% chance to decrease stock
              productToChange.stock = Math.max(0, productToChange.stock - Math.floor(Math.random() * 3 + 1)); // Decrease by 1-3
              showToast(translate('toast_stock_updated_sim', { itemName: productToChange.name, stockCount: productToChange.stock }), { type: 'info', duration: 2000 });
            }
          }

          // Simulate misplacement for a random product
          if (updatedProducts.length > 0 && shelfLayoutConfig.shelves.length > 1) {
             if (Math.random() < 0.15) { // 15% chance to change location
                const productIndexToMisplace = Math.floor(Math.random() * updatedProducts.length);
                const productToMisplace = updatedProducts[productIndexToMisplace];
                
                const currentShelf = shelfLayoutConfig.shelves.find(s => s.id === productToMisplace.currentShelfLocationId);
                let newShelf = currentShelf;
                while (newShelf === currentShelf || !newShelf) { // Ensure it's a different shelf
                    newShelf = shelfLayoutConfig.shelves[Math.floor(Math.random() * shelfLayoutConfig.shelves.length)];
                }
                const oldLocation = productToMisplace.currentShelfLocationId;
                productToMisplace.currentShelfLocationId = newShelf.id + "-SIM"; // Mark as simulated new location
                 if (oldLocation !== productToMisplace.currentShelfLocationId) {
                    showToast(translate('toast_item_misplaced_sim', {itemName: productToMisplace.name, currentShelf: productToMisplace.currentShelfLocationId || 'N/A', correctShelf: productToMisplace.shelfLocationId || 'N/A'}), { type: 'warning', duration: 3000 });
                 }
             }
          }
          updateAlerts(updatedProducts); // Update alerts based on new state
          return updatedProducts;
        });
      }, 5000); // Simulate an update every 5 seconds
    }
    return () => {
      if (simulationInterval !== undefined) {
        clearInterval(simulationInterval);
      }
    };
  }, [isMonitoringActive, translate, showToast, updateAlerts]);

  const handleToggleMonitoring = () => {
    setIsMonitoringActive(prev => {
      if (!prev) showToast(translate('toast_monitoring_started'), { type: 'success' });
      else showToast(translate('toast_monitoring_stopped'), { type: 'info' });
      return !prev;
    });
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={translate('inventory_monitoring_title')}
        subtitle={translate('inventory_monitoring_subtitle')}
        actions={
          <KioskButton
            variant={isMonitoringActive ? 'danger' : 'primary'}
            onClick={handleToggleMonitoring}
          >
            {isMonitoringActive ? translate('inventory_monitoring_btn_stop') : translate('inventory_monitoring_btn_start')}
          </KioskButton>
        }
      />
      <p className={`mb-6 text-sm ${isMonitoringActive ? 'text-green-400' : 'text-stone-400'}`}>
        {isMonitoringActive ? translate('inventory_monitoring_status_active') : translate('inventory_monitoring_status_idle')}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        {/* Left Column: Shelf Display */}
        <div className="lg:col-span-2">
          <ShelfDisplay config={shelfLayoutConfig} monitoredProducts={monitoredProducts} />
        </div>

        {/* Right Column: Alerts */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          <LowStockAlertsPanel lowStockItems={lowStockAlerts} />
          <MisplacedItemsPanel misplacedItems={misplacedItems} />
        </div>
      </div>
    </div>
  );
};

export default InventoryMonitoringPage;