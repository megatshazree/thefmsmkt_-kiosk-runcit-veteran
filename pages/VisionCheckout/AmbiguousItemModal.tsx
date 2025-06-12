import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import KioskButton from '../../components/common/KioskButton';
import { Product } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface AmbiguousItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedProduct: Product) => void;
  detectedProduct: Product | null;
  similarProducts: Product[];
  ambiguityReason?: 'low_confidence' | 'misidentified' | 'general';
  multiDetection?: boolean;
}

const AmbiguousItemModal: React.FC<AmbiguousItemModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  detectedProduct,
  similarProducts,
  ambiguityReason = 'general',
  multiDetection = false,
}) => {
  const { translate } = useLanguage();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && detectedProduct) {
      setSelectedProductId(detectedProduct.id); // Pre-select the initially detected item
    } else {
      setSelectedProductId(null);
    }
  }, [isOpen, detectedProduct]);

  const handleConfirm = () => {
    const productToConfirm = [...similarProducts, detectedProduct].find(p => p?.id === selectedProductId);
    if (productToConfirm) {
      onConfirm(productToConfirm);
    }
    onClose();
  };

  if (!isOpen || !detectedProduct) return null;

  const allOptions = [detectedProduct, ...similarProducts.filter(p => p.id !== detectedProduct.id)];


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={multiDetection ? "Beberapa Produk Dikesan" : "Produk Tidak Pasti"} maxWidth="max-w-xl">
      {multiDetection ? (
        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3 mb-4">
          <p className="text-blue-300 font-medium mb-1">Beberapa produk dikesan dalam imej</p>
          <p className="text-stone-300 text-sm">Sila pilih produk yang betul untuk ditambah ke troli</p>
        </div>
      ) : (
        <p className="text-stone-300 mb-2">
          {
              ambiguityReason === 'low_confidence' ? "Keyakinan rendah dalam pengesanan produk ini" :
              ambiguityReason === 'misidentified' ? "Produk ini mungkin salah dikenal pasti" :
              "Sila sahkan produk yang dikesan"
          }
        </p>
      )}
      <p className={`text-sm mb-4 ${
            ambiguityReason === 'low_confidence' || ambiguityReason === 'misidentified' ? 'text-amber-400' : 'text-stone-400'
        }`}
      >
        {multiDetection ? "Produk yang dikesan:" : "Produk dikesan:"} <span className="font-semibold text-stone-200">{detectedProduct.name}</span>
      </p>
      
      <div className="space-y-3 max-h-60 overflow-y-auto mb-6 pr-2">
        {allOptions.map(product => product && (
          <div 
            key={product.id}
            onClick={() => setSelectedProductId(product.id)}
            className={`p-3 rounded-lg cursor-pointer border-2 transition-all
                        ${selectedProductId === product.id ? 'bg-green-500 border-green-400 text-white' : 'bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-500 text-stone-200'}`}
          >
            <div className="flex items-center">
              <span className="text-3xl mr-3">{product.image}</span>
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm opacity-80">RM {product.price.toFixed(2)} - {product.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3">
        <KioskButton variant="secondary" onClick={onClose}>
          Batal
        </KioskButton>
        <KioskButton variant="primary" onClick={handleConfirm} disabled={selectedProductId === null}>
          {multiDetection ? "Tambah Produk Ini" : "Sahkan Pilihan"}
        </KioskButton>
      </div>
    </Modal>
  );
};

export default AmbiguousItemModal;