import React from 'react';
import { Product, ShelfConfig, ShelfDisplayConfig } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { mockProducts } from '../../constants/mockData'; // To get product details if needed

interface ShelfDisplayProps {
  config: ShelfDisplayConfig;
  monitoredProducts: Product[]; // Live status from monitoring page
}

const ShelfDisplay: React.FC<ShelfDisplayProps> = ({ config, monitoredProducts }) => {
  const { translate } = useLanguage();

  const getProductOnShelfSlot = (shelfId: string, rowIndex: number, colIndex: number): Product | undefined => {
      const shelfConfig = config.shelves.find(s => s.id === shelfId);
      if (!shelfConfig || !shelfConfig.productSlots) return undefined;

      const slotConfig = shelfConfig.productSlots.find(s => s.row === rowIndex && s.col === colIndex);
      if (!slotConfig) return undefined;
      
      return monitoredProducts.find(p => p.id === slotConfig.productId);
  };


  return (
    <div className="bg-slate-700 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-white mb-4">{translate('inventory_monitoring_shelf_display_title')}</h3>
      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
        {config.shelves.map(shelf => (
          <div key={shelf.id} className="bg-slate-600 p-3 rounded-md">
            <h4 className="text-md font-medium text-stone-200 mb-2">{shelf.name} ({shelf.id})</h4>
            <div 
                className={`grid gap-2`} 
                style={{ gridTemplateColumns: `repeat(${shelf.columns}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: shelf.rows * shelf.columns }).map((_, cellIndex) => {
                const rowIndex = Math.floor(cellIndex / shelf.columns);
                const colIndex = cellIndex % shelf.columns;
                const product = getProductOnShelfSlot(shelf.id, rowIndex, colIndex);
                
                let bgColor = 'bg-slate-500'; // Empty slot
                let borderColor = 'border-slate-400';
                let stockStatusColor = 'text-white';

                if (product) {
                    const stockPercentage = product.reorderLevel ? (product.stock / (product.reorderLevel * 2)) * 100 : 100; // Assuming ideal stock is 2x reorderLevel
                    if (product.stock <= 0) bgColor = 'bg-red-700';
                    else if (product.reorderLevel && product.stock < product.reorderLevel) bgColor = 'bg-red-500';
                    else if (product.reorderLevel && product.stock < product.reorderLevel * 1.5) bgColor = 'bg-amber-500';
                    else bgColor = 'bg-green-600';
                    
                    borderColor = 'border-transparent'; // No border if product present, color indicates status
                    if(product.shelfLocationId !== product.currentShelfLocationId) {
                        borderColor = 'border-purple-500 border-2 ring-2 ring-purple-400 ring-offset-1 ring-offset-slate-600'; // Highlight misplaced
                    }
                }

                return (
                  <div 
                    key={`${shelf.id}-${rowIndex}-${colIndex}`} 
                    className={`h-20 rounded flex flex-col items-center justify-center p-1 text-center text-xs transition-all duration-300 ease-in-out ${bgColor} border ${borderColor} relative`}
                    title={product ? `${product.name} (Stok: ${product.stock}, Lokasi Sebenar: ${product.shelfLocationId}, Dikesan: ${product.currentShelfLocationId || 'N/A'})` : `Slot Kosong: ${shelf.id} (${rowIndex},${colIndex})`}
                  >
                    {product ? (
                      <>
                        <div className="text-3xl mb-0.5">{product.image}</div>
                        <p className="font-medium leading-tight truncate w-full">{product.name}</p>
                        <p className={`text-xs ${stockStatusColor}`}>Stok: {product.stock}</p>
                        {product.shelfLocationId !== product.currentShelfLocationId && (
                             <span className="absolute top-1 right-1 text-xs bg-purple-600 text-white px-1 py-0.5 rounded-full animate-pulse">Salah Letak!</span>
                        )}
                      </>
                    ) : (
                      <span className="text-stone-400 text-2xl">?</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShelfDisplay;