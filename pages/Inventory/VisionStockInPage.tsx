import React, { useState, useEffect, useCallback, useRef } from 'react';
import PageHeader from '../../components/common/PageHeader';
import KioskButton from '../../components/common/KioskButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToastStore } from '../../store/toastStore';
import { Product, PurchaseOrder, StockInScanResult, PurchaseOrderItem } from '../../types';
import { mockProducts, mockPurchaseOrders } from '../../constants/mockData';
import PurchaseOrderSelector from '../../components/inventory/PurchaseOrderSelector';
import ScannedItemsTable from '../../components/inventory/ScannedItemsTable';
import CameraFeedDisplay from '../VisionCheckout/CameraFeedDisplay';

// Constants to replace magic numbers
const SCAN_CONSTANTS = {
  SCAN_INTERVAL_MS: 4000,
  MAX_PRODUCTS_PER_BATCH: 3,
  MAX_QUANTITY_PER_PRODUCT: 5,
  MIN_EXPIRY_DAYS: 30,
  MAX_EXPIRY_DAYS: 365,
  PO_ITEM_SCAN_PROBABILITY: 0.85,
  UNSCANNED_ITEM_PRIORITY: 0.7,
  ITEM_PROCESSING_DELAY: { min: 100, max: 400 }
} as const;

// Custom hook for PO management
const usePurchaseOrderSelection = () => {
  const [selectedPoId, setSelectedPoId] = useState<string | null>(null);
  const [currentPO, setCurrentPO] = useState<PurchaseOrder | null>(null);
  const { translate } = useLanguage();
  const { showToast } = useToastStore();

  useEffect(() => {
    if (selectedPoId) {
      const po = mockPurchaseOrders.find(p => p.id === selectedPoId);
      setCurrentPO(po || null);
      if (po) {
        showToast(translate('toast_po_selected', { poNumber: po.poNumber }), 'success');
      }
    } else {
      setCurrentPO(null);
    }
  }, [selectedPoId, translate, showToast]);

  return {
    selectedPoId,
    setSelectedPoId,
    currentPO,
    setCurrentPO
  };
};

// Custom hook for stock-in simulation
const useStockInSimulation = (isScanning: boolean, currentPO: PurchaseOrder | null) => {
  const [scanResults, setScanResults] = useState<StockInScanResult[]>([]);
  const { translate } = useLanguage();
  const { showToast } = useToastStore();
  const timeoutRefs = useRef<number[]>([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(id => clearTimeout(id));
    timeoutRefs.current = [];
  }, []);

  // Helper function to determine item status
  const determineItemStatus = useCallback((item: StockInScanResult, product: Product): string => {
    if (item.expectedQuantity <= 0) return 'Unexpected Item';
    
    if (item.scannedQuantity < item.expectedQuantity) return 'Under Quantity';
    if (item.scannedQuantity === item.expectedQuantity) {
      return product.hasExpiryDate ? 'OK with Expiry' : 'OK';
    }
    return 'Over Quantity';
  }, []);

  // Helper function to generate expiry date
  const generateExpiryDate = useCallback((product: Product): string | undefined => {
    if (!product.hasExpiryDate) return undefined;
    
    const futureDays = Math.floor(Math.random() * (SCAN_CONSTANTS.MAX_EXPIRY_DAYS - SCAN_CONSTANTS.MIN_EXPIRY_DAYS)) + SCAN_CONSTANTS.MIN_EXPIRY_DAYS;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + futureDays);
    return expiry.toISOString().split('T')[0];
  }, []);

  // Helper function to update existing item
  const updateExistingItem = useCallback((
    item: StockInScanResult, 
    product: Product, 
    quantity: number
  ) => {
    item.scannedQuantity += quantity;
    item.discrepancy = item.scannedQuantity - item.expectedQuantity;
    
    if (product.hasExpiryDate && (!item.simulatedExpiryDate || item.simulatedExpiryDate === 'YYYY-MM-DD')) {
      const expiryDate = generateExpiryDate(product);
      if (expiryDate) {
        item.simulatedExpiryDate = expiryDate;
        showToast(translate('toast_stock_in_expiry_sim', {
          itemName: product.name, 
          expiryDate: item.simulatedExpiryDate 
        }), 'info', 2000);
      }
    }
    
    item.status = determineItemStatus(item, product);
  }, [showToast, translate, generateExpiryDate, determineItemStatus]);

  // Helper function to create new scan result
  const createNewScanResult = useCallback((
    product: Product, 
    quantity: number, 
    expectedQty: number
  ): StockInScanResult => {
    const newScan: StockInScanResult = {
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      expectedQuantity: expectedQty,
      scannedQuantity: quantity,
      discrepancy: quantity - expectedQty,
      status: 'Pending Scan',
    };
    
    if (product.hasExpiryDate) {
      const expiryDate = generateExpiryDate(product);
      if (expiryDate) {
        newScan.simulatedExpiryDate = expiryDate;
        showToast(translate('toast_stock_in_expiry_sim', {
          itemName: product.name, 
          expiryDate: newScan.simulatedExpiryDate 
        }), 'info', 2000);
      }
    }
    
    newScan.status = determineItemStatus(newScan, product);
    return newScan;
  }, [showToast, translate, generateExpiryDate, determineItemStatus]);

  // Process scanned item with improved logic
  const processScannedItem = useCallback((scannedProduct: Product, quantityInBatch: number) => {
    setScanResults(prevResults => {
      const updatedResults = [...prevResults];
      const existingItemIndex = updatedResults.findIndex(item => item.productId === scannedProduct.id);
      
      let poItemDetails: PurchaseOrderItem | undefined;
      if (currentPO) {
        poItemDetails = currentPO.items.find(item => item.productId === scannedProduct.id);
      }

      if (existingItemIndex !== -1) {
        updateExistingItem(updatedResults[existingItemIndex], scannedProduct, quantityInBatch);
      } else {
        const expectedQty = poItemDetails ? poItemDetails.expectedQuantity : 0;
        const newScan = createNewScanResult(scannedProduct, quantityInBatch, expectedQty);
        updatedResults.push(newScan);
      }
      
      showToast(translate('toast_stock_in_item_scanned', {
        itemName: scannedProduct.name, 
        quantity: quantityInBatch 
      }), 'success', 1500);
      
      return updatedResults;
    });
  }, [currentPO, showToast, translate, updateExistingItem, createNewScanResult]);

  // Initialize scan results when PO changes
  useEffect(() => {
    if (currentPO) {
      const initialResults = currentPO.items.map(item => {
        const productDetails = mockProducts.find(p => p.id === item.productId);
        return {
          productId: item.productId,
          productName: productDetails?.name || 'Unknown Product',
          sku: productDetails?.sku,
          expectedQuantity: item.expectedQuantity,
          scannedQuantity: 0,
          discrepancy: -item.expectedQuantity,
          status: 'Pending Scan',
          simulatedExpiryDate: productDetails?.hasExpiryDate ? undefined : undefined,
        } as StockInScanResult;
      });
      setScanResults(initialResults);
    } else {
      setScanResults([]);
    }
  }, [currentPO]);

  // Improved scanning simulation with better performance
  useEffect(() => {
    let scanIntervalId: number | undefined = undefined;
    
    if (isScanning && currentPO) {
      scanIntervalId = window.setInterval(() => {
        setScanResults(prevResults => {
          const poItemsNotFullyScanned = prevResults.filter(sr => 
            sr.expectedQuantity > 0 && sr.scannedQuantity < sr.expectedQuantity
          );
          
          const numDistinctProductsInBatch = Math.floor(Math.random() * SCAN_CONSTANTS.MAX_PRODUCTS_PER_BATCH) + 1;
          
          for (let i = 0; i < numDistinctProductsInBatch; i++) {
            const shouldScanPoItem = Math.random() < SCAN_CONSTANTS.PO_ITEM_SCAN_PROBABILITY;
            let productToScan: Product | undefined;

            if (shouldScanPoItem && currentPO.items.length > 0) {
              if (poItemsNotFullyScanned.length > 0 && Math.random() < SCAN_CONSTANTS.UNSCANNED_ITEM_PRIORITY) {
                const randomUnscannedPoItemIndex = Math.floor(Math.random() * poItemsNotFullyScanned.length);
                productToScan = mockProducts.find(p => p.id === poItemsNotFullyScanned[randomUnscannedPoItemIndex].productId);
              } else {
                const randomPoItemIndex = Math.floor(Math.random() * currentPO.items.length);
                productToScan = mockProducts.find(p => p.id === currentPO.items[randomPoItemIndex].productId);
              }
            } else {
              const randomIndex = Math.floor(Math.random() * mockProducts.length);
              productToScan = mockProducts[randomIndex];
            }
            
            if (productToScan) {
              const quantityForThisProductInBatch = Math.floor(Math.random() * SCAN_CONSTANTS.MAX_QUANTITY_PER_PRODUCT) + 1;
              const delay = Math.random() * (SCAN_CONSTANTS.ITEM_PROCESSING_DELAY.max - SCAN_CONSTANTS.ITEM_PROCESSING_DELAY.min) + SCAN_CONSTANTS.ITEM_PROCESSING_DELAY.min;
              
              const timeoutId = window.setTimeout(() => {
                if (!isScanning) return;
                processScannedItem(productToScan!, quantityForThisProductInBatch);
              }, delay * i);
              
              timeoutRefs.current.push(timeoutId);
            }
          }
          
          return prevResults; // Return unchanged since processScannedItem handles updates
        });
      }, SCAN_CONSTANTS.SCAN_INTERVAL_MS);
    }
    
    return () => {
      if (scanIntervalId !== undefined) {
        clearInterval(scanIntervalId);
      }
      clearAllTimeouts();
    };
  }, [isScanning, currentPO, processScannedItem, clearAllTimeouts]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  return {
    scanResults,
    setScanResults,
    processScannedItem
  };
};

const VisionStockInPage: React.FC = () => {
  const { translate } = useLanguage();
  const { showToast } = useToastStore();
  const [isScanning, setIsScanning] = useState(false);

  const {
    selectedPoId,
    setSelectedPoId,
    currentPO,
    setCurrentPO
  } = usePurchaseOrderSelection();

  const {
    scanResults,
    setScanResults
  } = useStockInSimulation(isScanning, currentPO);

  const handleStartScan = useCallback(() => {
    if (!selectedPoId || !currentPO) {
      showToast(translate('toast_stock_in_no_po_selected'), 'warning');
      return;
    }
    
    // Add validation for PO items
    if (!currentPO.items || currentPO.items.length === 0) {
      showToast(translate('toast_stock_in_empty_po'), 'warning');
      return;
    }
    
    setIsScanning(true);
    showToast(translate('toast_stock_in_scan_started'), 'info');
  }, [selectedPoId, currentPO, showToast, translate]);

  const handleStopScan = useCallback(() => {
    setIsScanning(false);
    showToast(translate('toast_stock_in_scan_stopped'), 'info');
  }, [showToast, translate]);
  
  const handleFinalizeShipment = useCallback(() => {
    if (!currentPO) return;
    
    // Add validation before finalizing
    const hasDiscrepancies = scanResults.some(item => 
      item.status === 'Under Quantity' || item.status === 'Over Quantity'
    );
    
    if (hasDiscrepancies) {
      showToast(translate('toast_stock_in_discrepancies_warning'), 'warning');
    }
    
    setIsScanning(false);
    showToast(translate('toast_stock_in_finalize_sim', {
      poNumber: currentPO.poNumber
    }), 'success', 4000);
    
    // Reset state
    setSelectedPoId(null);
    setCurrentPO(null);
    setScanResults([]);
  }, [currentPO, scanResults, showToast, translate, setSelectedPoId, setCurrentPO, setScanResults]);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={translate('vision_stock_in_title')}
        subtitle={translate('vision_stock_in_subtitle')}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        {/* Left Column: PO Selection & Camera Feed */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          <PurchaseOrderSelector 
            purchaseOrders={mockPurchaseOrders} 
            selectedPoId={selectedPoId}
            onPoSelect={setSelectedPoId} 
          />
          <div className="bg-slate-800 p-4 rounded-xl shadow-lg flex-grow">
            <p className="text-sm text-center text-stone-400 mb-2">
              {translate('vision_stock_in_camera_feed_title')}
            </p>
            <CameraFeedDisplay isScanning={isScanning} />
          </div>
          <div className="bg-slate-800 p-4 rounded-xl shadow-lg space-y-3">
            <KioskButton
              variant={isScanning ? 'danger' : 'primary'}
              onClick={isScanning ? handleStopScan : handleStartScan}
              fullWidth
              disabled={!currentPO}
            >
              {isScanning ? translate('vision_stock_in_btn_stop_scan') : translate('vision_stock_in_btn_start_scan')}
            </KioskButton>
             <KioskButton 
                variant="primary" 
                onClick={handleFinalizeShipment} 
                fullWidth
                disabled={!currentPO || scanResults.length === 0 || isScanning}
                className="!bg-teal-500 hover:!bg-teal-600"
             >
                {translate('vision_stock_in_btn_finalize_shipment')}
            </KioskButton>
          </div>
        </div>

        {/* Right Column: Scanned Items Table */}
        <div className="lg:col-span-2 flex flex-col">
          <ScannedItemsTable items={scanResults} />
        </div>
      </div>
    </div>
  );
};

export default VisionStockInPage;