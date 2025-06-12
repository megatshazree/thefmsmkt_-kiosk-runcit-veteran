import React from 'react';
import { Product } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import InfoPanel from '../common/InfoPanel'; // Import the new InfoPanel

interface LowStockAlertsPanelProps {
  lowStockItems: Product[];
}

const LowStockAlertsPanel: React.FC<LowStockAlertsPanelProps> = ({ lowStockItems }) => {
  const { translate } = useLanguage();

  const renderLowStockItem = (item: Product) => (
    <div key={item.id} className="bg-slate-600 p-2.5 rounded-md flex justify-between items-center text-sm">
      <div>
        <p className="font-medium text-stone-100">{item.name} <span className="text-xs text-stone-400">({item.sku || 'N/A'})</span></p>
        <p className="text-xs text-amber-300">
          {translate('inventory_monitoring_table_current_stock')}: {item.stock} (Min: {item.reorderLevel || 'N/A'})
        </p>
      </div>
      <span className="px-2 py-1 text-xs font-semibold text-amber-800 bg-amber-200 rounded-full">
        {translate('inventory_monitoring_alert_tag')}
      </span>
    </div>
  );

  return (
    <InfoPanel
      title={translate('inventory_monitoring_low_stock_title')}
      description={translate('inventory_monitoring_low_stock_desc')}
      items={lowStockItems}
      renderItem={renderLowStockItem}
      emptyStateMessage={translate('inventory_monitoring_no_low_stock')}
      titleColorClass="text-amber-400"
    />
  );
};

export default LowStockAlertsPanel;