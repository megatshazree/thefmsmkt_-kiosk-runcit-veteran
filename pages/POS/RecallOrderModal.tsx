import React from 'react';
import Modal from '../../components/common/Modal';
import KioskButton from '../../components/common/KioskButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { HeldOrder } from '../../types'; // Ensure HeldOrder is defined in types.ts
import { ArchiveBoxIcon } from '@heroicons/react/24/outline';

interface RecallOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  heldOrders: HeldOrder[];
  onRecall: (order: HeldOrder) => void;
}

const RecallOrderModal: React.FC<RecallOrderModalProps> = ({ isOpen, onClose, heldOrders, onRecall }) => {
  const { translate } = useLanguage();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={translate('pos_modal_recall_order_title')} maxWidth="max-w-xl">
      {heldOrders.length === 0 ? (
        <div className="text-center py-8 text-stone-400">
            <ArchiveBoxIcon className="h-16 w-16 mx-auto mb-4 text-slate-500" />
            <p>{translate('pos_recall_order_empty')}</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {heldOrders.map(order => (
            <div 
                key={order.id} 
                className="p-4 bg-slate-700 rounded-lg flex justify-between items-center hover:bg-slate-600/70 transition-colors"
            >
              <div>
                <p className="font-semibold text-stone-100">
                  {translate('pos_recall_order_summary', {
                    orderId: order.id.substring(3, 8), // Short ID
                    itemCount: order.itemCount,
                    totalAmount: order.totalAmount.toFixed(2)
                  })}
                </p>
                <p className="text-xs text-stone-400">
                  {order.timestamp.toLocaleTimeString()} - {order.timestamp.toLocaleDateString()}
                </p>
              </div>
              <KioskButton 
                variant="primary" 
                onClick={() => onRecall(order)}
                className="text-sm px-4 py-2"
              >
                {translate('pos_btn_recall_selected')}
              </KioskButton>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 flex justify-end">
        <KioskButton variant="secondary" onClick={onClose}>
          {translate('btn_close')}
        </KioskButton>
      </div>       
    </Modal>
  );
};

export default RecallOrderModal;