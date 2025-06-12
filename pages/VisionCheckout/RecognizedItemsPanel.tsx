
import React from 'react';
import { RecognizedItem, Product } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import KioskButton from '../../components/common/KioskButton';
import { XCircleIcon, PlusIcon, MinusIcon, ShoppingBagIcon, TagIcon } from '@heroicons/react/24/solid';

interface RecognizedItemsPanelProps {
  items: RecognizedItem[];
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
}

const RecognizedItemsPanel: React.FC<RecognizedItemsPanelProps> = ({ items, onUpdateQuantity, onRemoveItem }) => {
  const { translate } = useLanguage();

  const handleQuantityChange = (item: RecognizedItem, delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity >= 1) {
      onUpdateQuantity(item.id, newQuantity);
    } else {
      onRemoveItem(item.id); // Remove if quantity drops to 0 or less
    }
  };
  
  const getDisplayPrice = (item: RecognizedItem): string => {
    const price = item.calculatedPrice !== undefined ? item.calculatedPrice : item.price * item.quantity;
    let details = "";
    if (item.requiresScale && item.weight && item.unitName) {
      details = ` @ ${item.weight.toFixed(2)}${item.unitName}`;
    }
    return `RM ${price.toFixed(2)}${details}`;
  }

  return (
    <div className="bg-slate-800 p-4 rounded-xl shadow-lg h-full flex flex-col">
      <h3 className="text-xl font-semibold text-white mb-4">{translate('vision_recognized_items_title')}</h3>
      {items.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-stone-400 text-center">{translate('vision_no_items_recognized')}</p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto space-y-3 pr-2">
          {items.map(item => (
            <div key={item.id} className="flex items-start justify-between bg-slate-700 p-3 rounded-lg">
              <div className="flex-1 mr-2">
                <p className="text-md font-medium text-stone-100">{item.name}</p>
                <p className="text-xs text-stone-400">
                  {item.requiresScale && item.weight && item.unitName ?
                    translate('vision_item_price_at_weight', { price: (item.pricePerUnit || 0).toFixed(2), weight: item.weight.toFixed(2), unitName: item.unitName })
                    :
                    `RM ${item.price.toFixed(2)} x ${item.quantity}`
                  }
                </p>
                {!item.isBagged && (
                  <div className="mt-1 flex items-center text-xs text-amber-400">
                    <ShoppingBagIcon className="h-3 w-3 mr-1 opacity-80" />
                    <span>{translate('vision_item_place_in_bag')}</span>
                  </div>
                )}
                 {item.simulatedVisionLabels && item.simulatedVisionLabels.length > 0 && (
                    <div className="mt-1.5">
                        <div className="flex items-center text-xxs text-sky-300 mb-0.5">
                            <TagIcon className="h-3 w-3 mr-1 opacity-70"/>
                            <span className="font-medium">{translate('vision_ai_detected_labels')}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {item.simulatedVisionLabels.map((label, idx) => (
                                <span key={idx} className="text-xxs bg-sky-700/50 text-sky-200 px-1.5 py-0.5 rounded-full">
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
                <KioskButton
                  variant="secondary"
                  onClick={() => handleQuantityChange(item, -1)}
                  className="!p-1 sm:!p-1.5"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  <MinusIcon className="h-4 w-4" />
                </KioskButton>
                <span className="text-md font-medium text-stone-100 w-6 sm:w-8 text-center">{item.quantity}</span>
                <KioskButton
                  variant="secondary"
                  onClick={() => handleQuantityChange(item, 1)}
                  className="!p-1 sm:!p-1.5"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  <PlusIcon className="h-4 w-4" />
                </KioskButton>
              </div>
              <div className="ml-2 sm:ml-3 text-md font-semibold text-green-400 w-24 sm:w-28 text-right shrink-0">
                {getDisplayPrice(item)}
              </div>
              <KioskButton
                variant="danger"
                onClick={() => onRemoveItem(item.id)}
                className="!p-1.5 ml-2 sm:ml-3 shrink-0"
                aria-label={`Remove ${item.name}`}
              >
                <XCircleIcon className="h-5 w-5" />
              </KioskButton>
            </div>
          ))}
        </div>
      )}
       <style>{`.text-xxs { font-size: 0.65rem; line-height: 0.8rem; }`}</style>
    </div>
  );
};

export default RecognizedItemsPanel;
