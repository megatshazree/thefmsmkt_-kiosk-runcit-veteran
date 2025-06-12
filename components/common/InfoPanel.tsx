import React from 'react';

interface InfoPanelProps<T> {
  title: string;
  description?: string;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyStateMessage: string;
  titleColorClass?: string; 
}

const InfoPanel = <T extends { id: any }>({
  title,
  description,
  items,
  renderItem,
  emptyStateMessage,
  titleColorClass = 'text-white',
}: InfoPanelProps<T>) => {
  return (
    <div className="bg-slate-700 p-4 rounded-lg shadow">
      <h3 className={`text-lg font-semibold ${titleColorClass} mb-2`}>{title}</h3>
      {description && <p className="text-xs text-stone-400 mb-3">{description}</p>}
      {items.length === 0 ? (
        <p className="text-stone-300 text-center py-3">{emptyStateMessage}</p>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">{items.map((item, index) => renderItem(item, index))}</div>
      )}
    </div>
  );
};

export default InfoPanel;