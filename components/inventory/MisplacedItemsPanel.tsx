import React from 'react';
import { Product } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface MisplacedItemsPanelProps {
  misplacedItems: Product[];
}

const MisplacedItemsPanel: React.FC<MisplacedItemsPanelProps> = ({ misplacedItems }) => {
  const { translate } = useLanguage();

  return (
    <div className="bg-slate-700 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-purple-400 mb-2">{translate('inventory_monitoring_misplaced_title')}</h3>
      <p className="text-xs text-stone-400 mb-3">{translate('inventory_monitoring_misplaced_desc')}</p>
      {misplacedItems.length === 0 ? (
        <p className="text-stone-300 text-center py-3">{translate('inventory_monitoring_no_misplaced')}</p>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
          {misplacedItems.map(item => (
            <div key={item.id} className="bg-slate-600 p-2.5 rounded-md text-sm">
              <p className="font-medium text-stone-100">{item.name} <span className="text-xs text-stone-400">({item.sku || 'N/A'})</span></p>
              <p className="text-xs text-purple-300">
                {translate('inventory_monitoring_table_detected_shelf_id')}: {item.currentShelfLocationId || 'N/A'}
                <span className="text-stone-400"> (Patut: {item.shelfLocationId || 'N/A'})</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisplacedItemsPanel;