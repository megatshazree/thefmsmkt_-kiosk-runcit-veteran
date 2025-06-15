import React, { useState, useCallback } from 'react';
import PageHeader from '../../components/common/PageHeader';
import KioskButton from '../../components/common/KioskButton';
import { useToastStore } from '../../store/toastStore';
import { useLanguageStore } from '../../store/languageStore';
import { ProductSet } from '../../types';
import { mockProductSets, mockProducts } from '../../constants/mockData'; // Direct import for mutation
import CreateProductSetModal from './CreateProductSetModal';
import { PlusCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const ProductSetTable: React.FC<{
  productSets: ProductSet[];
  onEdit: (set: ProductSet) => void;
  onDelete: (setId: string) => void;
}> = ({ productSets, onEdit, onDelete }) => {
  const { translate } = useLanguageStore();

  if (productSets.length === 0) {
    return <p className="text-center py-8 text-lg text-stone-400">{translate('table_no_product_sets')}</p>;
  }

  const getProductNames = (productIds: number[]): string => {
    return productIds
      .map(id => mockProducts.find(p => p.id === id)?.name)
      .filter(name => !!name)
      .join(', ');
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-700">
          <tr>
            <th className="p-3 text-sm font-semibold tracking-wide text-left">{translate('table_product_set_name')}</th>
            <th className="p-3 text-sm font-semibold tracking-wide text-left">{translate('table_product_set_products_count')}</th>
            <th className="p-3 text-sm font-semibold tracking-wide text-left hidden md:table-cell">Produk Dalam Set</th>
            <th className="p-3 text-sm font-semibold tracking-wide text-left">{translate('table_actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {productSets.map(set => (
            <tr key={set.id} className="hover:bg-slate-700/50 transition-colors">
              <td className="p-3 text-sm text-stone-100 font-medium whitespace-nowrap">
                {set.image && <span className="mr-2 text-xl">{set.image}</span>}
                {set.name}
              </td>
              <td className="p-3 text-sm text-stone-300">{set.productIds.length}</td>
              <td className="p-3 text-xs text-stone-400 hidden md:table-cell max-w-xs truncate" title={getProductNames(set.productIds)}>
                {getProductNames(set.productIds)}
              </td>
              <td className="p-3 text-sm whitespace-nowrap">
                <button 
                  type="button"
                  onClick={() => onEdit(set)} 
                  className="text-green-400 hover:text-green-300 mr-3 font-medium p-1"
                  aria-label={`${translate('btn_edit')} ${set.name}`}
                >
                  <PencilIcon className="h-5 w-5"/>
                </button>
                <button 
                  type="button"
                  onClick={() => onDelete(set.id)} 
                  className="text-red-400 hover:text-red-300 font-medium p-1"
                  aria-label={`${translate('btn_delete')} ${set.name}`}
                >
                  <TrashIcon className="h-5 w-5"/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ProductSetPage: React.FC = () => {
  const { translate } = useLanguageStore();
  const { showToast } = useToastStore();
  
  // Use a state that mirrors mockProductSets to trigger re-renders on this page
  const [productSetsState, setProductSetsState] = useState<ProductSet[]>(() => [...mockProductSets]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<ProductSet | null>(null);

  const handleCreateNewSet = () => {
    setEditingSet(null);
    setIsModalOpen(true);
  };

  const handleEditSet = (set: ProductSet) => {
    setEditingSet(set);
    setIsModalOpen(true);
  };

  const handleDeleteSet = (setId: string) => {
    const setToDelete = productSetsState.find(s => s.id === setId);
    if (window.confirm(translate('btn_delete') + ` ${setToDelete?.name || 'product set'}?`)) {
      setProductSetsState(prevSets => prevSets.filter(s => s.id !== setId));
      showToast(translate('toast_product_set_deleted') + (setToDelete ? `: ${setToDelete.name}` : ''), 'success');
    }
  };

  const handleSaveSet = useCallback((set: ProductSet) => {
    setProductSetsState(prevSets => {
      const index = prevSets.findIndex(s => s.id === set.id);
      if (index > -1) { // Editing existing
        const updatedSets = [...prevSets];
        updatedSets[index] = set;
        showToast(translate('toast_product_set_updated', { setName: set.name }), 'success');
        return updatedSets;
      } else { // Creating new
        showToast(translate('toast_product_set_created', { setName: set.name }), 'success');
        return [...prevSets, set];
      }
    });
    setIsModalOpen(false);
  }, [showToast, translate, setProductSetsState]);

  return (
    <div>
      <PageHeader
        title={translate('product_sets_title')}
        subtitle={translate('product_sets_subtitle')}
        actions={
          <KioskButton variant="primary" onClick={handleCreateNewSet}>
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            {translate('btn_create_product_set')}
          </KioskButton>
        }
      />
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <ProductSetTable 
            productSets={productSetsState} 
            onEdit={handleEditSet}
            onDelete={handleDeleteSet}
        />
      </div>
      <CreateProductSetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSet}
        existingSet={editingSet}
      />
    </div>
  );
};

export default ProductSetPage;