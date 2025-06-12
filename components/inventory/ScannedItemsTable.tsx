import React from 'react';
import { StockInScanResult } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface ScannedItemsTableProps {
  items: StockInScanResult[];
}

const ScannedItemsTable: React.FC<ScannedItemsTableProps> = ({ items }) => {
  const { translate } = useLanguage();

  const getStatusColor = (status: StockInScanResult['status']) => {
    switch (status) {
      case 'OK':
      case 'OK with Expiry':
        return 'bg-green-500 text-white';
      case 'Under Quantity':
      case 'Over Quantity':
        return 'bg-amber-500 text-black';
      case 'Unexpected Item':
      case 'Expiry Capture Failed':
        return 'bg-red-500 text-white';
      case 'Pending Scan':
        return 'bg-slate-500 text-white';
      default:
        return 'bg-slate-600 text-stone-200';
    }
  };

  return (
    <div className="overflow-x-auto bg-slate-700 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-white mb-3">{translate('vision_stock_in_scanned_items_title')}</h3>
      {items.length === 0 ? (
        <p className="text-stone-400 text-center py-4">{translate('vision_stock_in_status_pending')}...</p>
      ) : (
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-slate-600">
            <tr>
              <th className="p-2 text-xs font-semibold tracking-wide">{translate('vision_stock_in_table_product')}</th>
              <th className="p-2 text-xs font-semibold tracking-wide">{translate('vision_stock_in_table_sku')}</th>
              <th className="p-2 text-xs font-semibold tracking-wide text-center">{translate('vision_stock_in_table_expected_qty')}</th>
              <th className="p-2 text-xs font-semibold tracking-wide text-center">{translate('vision_stock_in_table_scanned_qty')}</th>
              <th className="p-2 text-xs font-semibold tracking-wide text-center">{translate('vision_stock_in_table_discrepancy')}</th>
              <th className="p-2 text-xs font-semibold tracking-wide">{translate('vision_stock_in_table_expiry')}</th>
              <th className="p-2 text-xs font-semibold tracking-wide text-center">{translate('vision_stock_in_table_status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-600">
            {items.map((item, index) => (
              <tr key={`${item.productId}-${index}`} className="hover:bg-slate-600/50">
                <td className="p-2 text-sm text-stone-200 whitespace-nowrap">{item.productName}</td>
                <td className="p-2 text-sm text-stone-300 whitespace-nowrap">{item.sku || 'N/A'}</td>
                <td className="p-2 text-sm text-stone-300 text-center">{item.expectedQuantity}</td>
                <td className="p-2 text-sm text-stone-200 font-semibold text-center">{item.scannedQuantity}</td>
                <td className={`p-2 text-sm font-semibold text-center ${item.discrepancy !== 0 ? (item.discrepancy > 0 ? 'text-green-400' : 'text-red-400') : 'text-stone-300'}`}>
                  {item.discrepancy > 0 ? `+${item.discrepancy}` : item.discrepancy}
                </td>
                <td className="p-2 text-sm text-stone-300 whitespace-nowrap">
                  {item.simulatedExpiryDate || 'N/A'}
                </td>
                <td className="p-2 text-center">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {translate(`vision_stock_in_status_${item.status.toLowerCase().replace(/\s+/g, '_')}`)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ScannedItemsTable;