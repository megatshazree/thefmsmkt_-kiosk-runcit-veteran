import React from 'react';
import { PurchaseOrder } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface PurchaseOrderSelectorProps {
  purchaseOrders: PurchaseOrder[];
  selectedPoId: string | null;
  onPoSelect: (poId: string) => void;
}

const PurchaseOrderSelector: React.FC<PurchaseOrderSelectorProps> = ({ purchaseOrders, selectedPoId, onPoSelect }) => {
  const { translate } = useLanguage();

  const selectedPO = purchaseOrders.find(po => po.id === selectedPoId);

  return (
    <div className="bg-slate-700 p-4 rounded-lg shadow">
      <label htmlFor="po-selector" className="block text-sm font-medium text-stone-300 mb-1">
        {translate('po_selection_label')}
      </label>
      <select
        id="po-selector"
        value={selectedPoId || ''}
        onChange={(e) => onPoSelect(e.target.value)}
        className="w-full p-3 kiosk-input bg-slate-600 border-slate-500 rounded-lg focus:ring-green-500 focus:border-green-500 text-stone-100 mb-3"
      >
        <option value="" disabled>{translate('po_select_placeholder')}</option>
        {purchaseOrders.map(po => (
          <option key={po.id} value={po.id}>
            {po.poNumber} - {po.supplierName} ({po.orderDate})
          </option>
        ))}
      </select>

      {selectedPO && (
        <div className="text-sm text-stone-300 space-y-1 border-t border-slate-600 pt-3">
          <h4 className="font-semibold text-stone-100">{translate('po_details_title')}</h4>
          <p><strong>{translate('po_details_number')}</strong> {selectedPO.poNumber}</p>
          <p><strong>{translate('po_details_supplier')}</strong> {selectedPO.supplierName}</p>
          <p><strong>{translate('po_details_date')}</strong> {new Date(selectedPO.orderDate).toLocaleDateString()}</p>
          <p><strong>{translate('po_details_status')}</strong> {selectedPO.status}</p>
          <p><strong>{translate('po_details_expected_items')}</strong> {selectedPO.items.length}</p>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderSelector;