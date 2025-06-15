import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import KioskButton from '../../components/common/KioskButton';
import KioskInput from '../../components/common/KioskInput';
import { useToastStore } from '../../store/toastStore';
import { useLanguageStore } from '../../store/languageStore';
import { returnActionTypes } from '../../constants/menuItems';
import { CartItem } from '../../types'; // For mock transaction items

interface MockTransaction {
  receiptNumber: string;
  date: string;
  items: Partial<CartItem>[]; // Using Partial as we only need name, price, qty for display
  total: number;
}

const mockTransactionsDB: MockTransaction[] = [
    { 
        receiptNumber: "RPT001", 
        date: "2024-07-28", 
        items: [
            { name: "Coca-Cola Classic 320ml", price: 2.50, quantity: 2 },
            { name: "Mister Potato Original 60g", price: 3.00, quantity: 1 },
        ],
        total: 8.00 
    },
    { 
        receiptNumber: "RPT002", 
        date: "2024-07-27", 
        items: [
            { name: "Kopi O Panas (Cup)", price: 2.50, quantity: 1 },
        ],
        total: 2.50
    }
];


interface ReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReturnSuccess: () => void;
}

const ReturnModal: React.FC<ReturnModalProps> = ({ isOpen, onClose, onReturnSuccess }) => {
  const { showToast } = useToastStore();
  const { translate } = useLanguageStore();
  const [receiptSearch, setReceiptSearch] = useState('');
  const [foundTransaction, setFoundTransaction] = useState<MockTransaction | null>(null);
  const [returnAction, setReturnAction] = useState(returnActionTypes[0].value);
  const [returnNotes, setReturnNotes] = useState('');

  const handleSearchReceipt = () => {
    const transaction = mockTransactionsDB.find(t => t.receiptNumber.toLowerCase() === receiptSearch.toLowerCase());
    setFoundTransaction(transaction || null);
    if (!transaction) {
        showToast(translate('original_receipt_search_placeholder') + ' ' + translate('pos_check_price_not_found').toLowerCase(), 'warning');
    }
  };

  const handleProcessReturn = () => {
    if (!foundTransaction) {
        showToast(translate('return_search_receipt') + ' ' + translate('cannot_be_empty_generic').toLowerCase(), 'warning');
        return;
    }
    // Add actual return processing logic here based on returnAction and foundTransaction
    showToast(translate('toast_return_processed'), 'success');
    onReturnSuccess(); // This will close modal via parent
    setReceiptSearch('');
    setFoundTransaction(null);
    setReturnNotes('');
  };

  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={translate('return_modal_title')}
        maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="original-receipt-search" className="block text-sm font-medium text-stone-300 mb-1">{translate('return_search_receipt')}</label>
          <div className="mt-1 flex">
            <KioskInput
              type="text"
              id="original-receipt-search"
              value={receiptSearch}
              onChange={(e) => setReceiptSearch(e.target.value)}
              placeholder={translate('original_receipt_search_placeholder')}
              className="flex-grow !rounded-r-none"
            />
            <KioskButton
              variant="primary"
              className="!rounded-l-none px-4"
              onClick={handleSearchReceipt}
            >
              {translate('btn_search')}
            </KioskButton>
          </div>
        </div>

        <div className="border border-slate-700 p-3 rounded-md bg-slate-700/50 min-h-[120px]">
          {foundTransaction ? (
            <div className="text-sm">
                <p><strong>No. Resit:</strong> {foundTransaction.receiptNumber}</p>
                <p><strong>Tarikh:</strong> {new Date(foundTransaction.date).toLocaleDateString()}</p>
                <p className="mt-1"><strong>Item:</strong></p>
                <ul className="list-disc list-inside ml-4 text-xs">
                    {foundTransaction.items.map((item, idx) => (
                        <li key={idx}>{item.name} (x{item.quantity}) - RM {(item.price! * item.quantity!).toFixed(2)}</li>
                    ))}
                </ul>
                <p className="mt-1 font-semibold"><strong>Jumlah Asal:</strong> RM {foundTransaction.total.toFixed(2)}</p>
            </div>
          ) : (
             <p className="text-stone-400 italic">{translate('return_original_details_placeholder')}</p>
          )}
        </div>

        <div>
          <label htmlFor="return-action-type" className="block text-sm font-medium text-stone-300 mb-1">{translate('return_action_type')}</label>
          <select 
            id="return-action-type" 
            value={returnAction}
            onChange={(e) => setReturnAction(e.target.value)}
            className="w-full p-3 kiosk-input bg-slate-700 border-slate-600 rounded-lg focus:ring-green-500 focus:border-green-500 text-stone-100"
            disabled={!foundTransaction}
          >
            {returnActionTypes.map(action => (
                <option key={action.value} value={action.value}>{translate(action.labelKey)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="return-notes" className="block text-sm font-medium text-stone-300 mb-1">{translate('return_notes_label')}</label>
          <textarea 
            id="return-notes" 
            rows={2} 
            value={returnNotes}
            onChange={(e) => setReturnNotes(e.target.value)}
            className="w-full p-3 kiosk-input bg-slate-700 border-slate-600 rounded-lg focus:ring-green-500 focus:border-green-500 text-stone-100"
            disabled={!foundTransaction}
          ></textarea>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <KioskButton variant="secondary" onClick={onClose}>{translate('btn_cancel')}</KioskButton>
        <KioskButton variant="danger" onClick={handleProcessReturn} disabled={!foundTransaction}>
            {translate('btn_process_return')}
        </KioskButton>
      </div>
    </Modal>
  );
};

export default ReturnModal;