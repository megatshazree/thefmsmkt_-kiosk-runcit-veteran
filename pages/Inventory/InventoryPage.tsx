
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { useLanguage } from '../../contexts/LanguageContext';
import { mockProducts, mockProductCategories } from '../../constants/mockData'; 
import KioskInput from '../../components/common/KioskInput';
import KioskButton from '../../components/common/KioskButton';
import Modal from '../../components/common/Modal';
import { generateProductDescription, generateProductImageWithImagen } from '../../services/geminiService';
import { extractProductDetailsFromImageText } from '../../services/visionAIService';
import { useToast } from '../../contexts/ToastContext';
import { Product } from '../../types';
import { SparklesIcon, CameraIcon, PhotoIcon, CubeTransparentIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid'; 
import Loader from '../../components/common/Loader';
import useDebounce from '../../hooks/useDebounce';

const InventoryTable: React.FC<{
    products: Product[]; 
    onEditProduct: (product: Product) => void;
    onDeleteProduct: (productId: number) => void;
    searchTerm: string; // Pass searchTerm for better empty state message
}> = React.memo(({ products, onEditProduct, onDeleteProduct, searchTerm }) => {
    const { translate } = useLanguage();

    if (products.length === 0) {
        return (
            <div className="text-center py-10 text-[var(--theme-text-muted)]">
                <CubeTransparentIcon className="h-20 w-20 mx-auto text-[var(--theme-text-muted)] opacity-50 mb-4" aria-hidden="true" />
                <p className="text-lg">{translate('table_no_products')}</p>
                {searchTerm && <p className="text-sm mt-1">{translate('inventory_search_placeholder')} "{searchTerm}"</p>}
            </div>
        );
    }
    
    const renderImage = React.useCallback((imageString: string, productName: string) => {
        if (imageString.startsWith('data:image')) {
            return <img src={imageString} alt={productName} className="w-10 h-10 object-contain rounded bg-white p-0.5" />;
        }
        return <span className="text-2xl" aria-hidden="true">{imageString || '❓'}</span>; 
    }, []);

    return (
         <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-[var(--theme-panel-bg-alt)]">
                    <tr>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left text-[var(--theme-text-secondary)]">{translate('table_image')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left text-[var(--theme-text-secondary)]">{translate('table_sku')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left text-[var(--theme-text-secondary)]">{translate('table_product_name')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left text-[var(--theme-text-secondary)]">{translate('table_category')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left text-[var(--theme-text-secondary)]">{translate('table_stock')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left text-[var(--theme-text-secondary)]">{translate('table_sell_price')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left text-[var(--theme-text-secondary)]">{translate('table_actions')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--theme-border-color)]">
                    {products.map(p => (
                        <tr key={p.id} className="hover:bg-[var(--theme-panel-bg-alt)] transition-colors">
                            <td className="p-2 text-sm text-[var(--theme-text-muted)] whitespace-nowrap flex items-center justify-center h-14">{renderImage(p.image, p.name)}</td>
                            <td className="p-3 text-sm text-[var(--theme-text-muted)] whitespace-nowrap">{p.sku || `P-${String(p.id).padStart(4, '0')}`}</td>
                            <td className="p-3 text-sm text-[var(--theme-text-primary)] font-medium whitespace-nowrap">{p.name}</td>
                            <td className="p-3 text-sm text-[var(--theme-text-muted)] whitespace-nowrap">{p.category}</td>
                            <td className="p-3 text-sm text-[var(--theme-text-muted)]">{p.stock}</td>
                            <td className="p-3 text-sm text-[var(--theme-text-muted)]">RM {p.price.toFixed(2)}</td>
                            <td className="p-3 text-sm whitespace-nowrap">
                                <button onClick={() => onEditProduct(p)} className="text-[var(--theme-accent-cyan)] hover:brightness-125 mr-3 font-medium p-1" aria-label={`${translate('btn_edit')} ${p.name}`}>
                                    <PencilSquareIcon className="h-5 w-5" />
                                </button>
                                <button onClick={() => onDeleteProduct(p.id)} className="text-red-400 hover:text-red-300 font-medium p-1" aria-label={`${translate('btn_delete')} ${p.name}`}>
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});


const InventoryPage: React.FC = () => {
  const { translate, language } = useLanguage();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>(() => JSON.parse(JSON.stringify(mockProducts)));
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState(mockProductCategories.find(cat => cat !== "Semua") || '');
  const [newCategoryInput, setNewCategoryInput] = useState(''); 
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [productImageDataUrl, setProductImageDataUrl] = useState<string | null>(null); 

  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [searchTermInput, setSearchTermInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchTermInput, 300);
  
  const [isVisionAIModalOpen, setIsVisionAIModalOpen] = useState(false);
  const [visionAIInputText, setVisionAIInputText] = useState('');
  const [isProcessingVisionAI, setIsProcessingVisionAI] = useState(false);

  const availableCategories = useMemo(() => {
    const allCats = new Set(products.map(p => p.category).filter(Boolean));
    mockProductCategories.filter(cat => cat !== "Semua").forEach(cat => allCats.add(cat));
    return Array.from(allCats).sort();
  }, [products]);

  const resetForm = useCallback(() => {
    setProductName('');
    setCategory(availableCategories[0] || '');
    setNewCategoryInput('');
    setKeywords('');
    setDescription('');
    setPrice('');
    setStock('');
    setSku('');
    setProductImageDataUrl(null);
    setEditingProduct(null);
  }, [availableCategories]);

  useEffect(() => {
    if (editingProduct) {
      setProductName(editingProduct.name);
      setCategory(editingProduct.category);
      setKeywords(editingProduct.simulatedVisionLabels?.join(', ') || ''); 
      setDescription(''); 
      setPrice(String(editingProduct.price));
      setStock(String(editingProduct.stock));
      setSku(editingProduct.sku || '');
      setProductImageDataUrl(editingProduct.image.startsWith('data:image') ? editingProduct.image : null);
    } else {
      resetForm();
    }
  }, [editingProduct, resetForm]);


  const handleGenerateDescription = useCallback(async () => {
    if (!productName.trim()) {
      showToast(translate('toast_fill_product_name'), 'warning');
      return;
    }
    setIsGeneratingDesc(true);
    const currentCategory = category === 'NEW_CATEGORY_INPUT' ? newCategoryInput : category;
    const result = await generateProductDescription(productName, currentCategory, keywords);
    setIsGeneratingDesc(false);
    if (result.error) {
      showToast(translate('toast_api_error', { message: result.error }), 'error');
    } else if (result.data) {
      setDescription(result.data);
      showToast(translate('toast_desc_generated'), 'success');
    }
  }, [productName, category, newCategoryInput, keywords, showToast, translate]);

  const handleGenerateImage = useCallback(async () => {
    const currentCategory = category === 'NEW_CATEGORY_INPUT' ? newCategoryInput : category;
    if (!productName.trim() || !currentCategory.trim()) {
        showToast(translate('toast_product_details_incomplete_for_image'), 'warning');
        return;
    }
    setIsGeneratingImage(true);
    setProductImageDataUrl(null); 
    const result = await generateProductImageWithImagen(productName, currentCategory, description);
    setIsGeneratingImage(false);
    if (result.error) {
        showToast(translate('toast_imagen_image_failed') + `: ${result.error}`, 'error');
    } else if (result.data) {
        setProductImageDataUrl(`data:image/jpeg;base64,${result.data}`);
        showToast(translate('toast_imagen_image_generated'), 'success');
    }
  }, [productName, category, newCategoryInput, description, showToast, translate]);

  const handleSaveProduct = useCallback(() => {
    if (!productName.trim()) { showToast(translate('inventory_product_name') + ' ' + translate('cannot_be_empty_generic'), 'warning'); return; }
    const finalCategory = category === 'NEW_CATEGORY_INPUT' ? newCategoryInput.trim() : category;
    if (!finalCategory) { showToast(translate('inventory_category') + ' ' + translate('cannot_be_empty_generic'), 'warning'); return; }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) { showToast(translate('inventory_form_price') + ' ' + translate('must_be_valid_number_generic'), 'warning'); return; }
    const numStock = stock.trim() === '' ? 0 : parseInt(stock, 10); 
    if (isNaN(numStock) || numStock < 0) { showToast(translate('inventory_form_stock') + ' ' + translate('must_be_valid_number_generic'), 'warning'); return; }
    const finalSku = sku.trim();
    if (finalSku && products.some(p => p.sku === finalSku && p.id !== editingProduct?.id)) {
        showToast(translate('table_sku') + ' ' + finalSku + ' sudah wujud.', 'warning'); return;
    }

    const productData: Partial<Product> = {
        name: productName.trim(), category: finalCategory, price: numPrice, stock: numStock,
        sku: finalSku || undefined,
        image: productImageDataUrl || editingProduct?.image || categoryDefaultInfo[finalCategory]?.image || '❓',
        reorderLevel: editingProduct?.reorderLevel || Math.max(5, Math.floor(numStock * 0.15)),
        hasExpiryDate: editingProduct?.hasExpiryDate || categoryDefaultInfo[finalCategory]?.hasExpiryDate || false,
        simulatedVisionLabels: keywords.split(',').map(k => k.trim()).filter(Boolean),
        shelfLocationId: editingProduct?.shelfLocationId || `SHELF-${finalCategory.substring(0,3).toUpperCase()}-NEW`,
        currentShelfLocationId: editingProduct?.currentShelfLocationId || `SHELF-${finalCategory.substring(0,3).toUpperCase()}-NEW`,
    };

    if (editingProduct) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productData } as Product : p));
        showToast(translate('toast_product_updated_inventory'), 'success');
    } else {
        const newProduct: Product = { id: Date.now(), ...mockProducts[0], ...productData } as Product;
        setProducts(prev => [newProduct, ...prev]);
        showToast(translate('toast_product_added_inventory'), 'success');
    }
    resetForm();
  }, [productName, category, newCategoryInput, price, stock, sku, productImageDataUrl, editingProduct, keywords, description, products, showToast, translate, resetForm]);

  const handleEditProduct = useCallback((productToEdit: Product) => {
    setEditingProduct(productToEdit);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }, []);
  
  const handleDeleteProduct = useCallback((productId: number) => {
    if (window.confirm(translate('btn_delete') + ` ${products.find(p=>p.id === productId)?.name || 'product'}?`)) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      showToast(translate('toast_product_deleted_inventory'), 'success');
       if (editingProduct && editingProduct.id === productId) {
        resetForm();
      }
    }
  }, [products, editingProduct, showToast, translate, resetForm]);

  const categoryDefaultInfo: Record<string, { image: string; hasExpiryDate: boolean }> = useMemo(() => ({
      "Minuman": { image: '🥤', hasExpiryDate: true }, "Snek": { image: '🍪', hasExpiryDate: true },
      "Roti & Bakeri": { image: '🍞', hasExpiryDate: true }, "Makanan Sedia": { image: '🍛', hasExpiryDate: true },
      "Biskut": { image: '🍘', hasExpiryDate: true }, "Coklat & Gula-gula": { image: '🍬', hasExpiryDate: true },
      "Buah & Kekacang": { image: '🍎', hasExpiryDate: true }, "Peralatan Mandian": { image: '🧼', hasExpiryDate: false },
      "Kesihatan Asas": { image: '🩹', hasExpiryDate: true }, "Kebersihan": { image: '🧻', hasExpiryDate: false },
      "Pakaian Asas": { image: '👕', hasExpiryDate: false }, "Elektronik": { image: '🔌', hasExpiryDate: false },
      "Hadiah": { image: '🎁', hasExpiryDate: false }, "Penerbitan": { image: '📰', hasExpiryDate: false },
      "Alat Tulis": { image: '✏️', hasExpiryDate: false }, "Tembakau": { image: '🚬', hasExpiryDate: true },
      "Servis Digital": { image: '🛠️', hasExpiryDate: false }, "Servis Fizikal": { image: '⚙️', hasExpiryDate: false },
      "Lain-lain": { image: '📦', hasExpiryDate: false }, "Default": { image: '❓', hasExpiryDate: false }
  }), []);


  const handleVisionAIAddProductClick = useCallback(() => {
    setIsVisionAIModalOpen(true);
  }, []);

  const handleProcessVisionAIInput = useCallback(async () => {
    if (!visionAIInputText.trim()) {
        showToast(translate('toast_vision_ai_no_input'), 'warning');
        return;
    }
    setIsProcessingVisionAI(true);
    const result = await extractProductDetailsFromImageText(visionAIInputText, language);
    setIsProcessingVisionAI(false);

    if (result.error) {
        showToast(translate('toast_api_error', { message: result.error }), 'error');
    } else if (result.data) {
        const { name, category: cat, keywords: kwArray, description: desc, sku: extractedSku } = result.data;
        setEditingProduct(null); 
        setProductName(name || '');
        setCategory(availableCategories.includes(cat || '') ? (cat || availableCategories[0]) : 'NEW_CATEGORY_INPUT');
        if (cat && !availableCategories.includes(cat)) setNewCategoryInput(cat); else setNewCategoryInput('');
        setKeywords(Array.isArray(kwArray) ? kwArray.join(', ') : (kwArray || ''));
        setDescription(desc || '');
        setSku(extractedSku || '');
        setPrice(''); setStock(''); setProductImageDataUrl(null); 
        showToast(translate('toast_vision_ai_success'), 'success');
        setIsVisionAIModalOpen(false);
        setVisionAIInputText(''); 
    } else {
        showToast(translate('toast_api_error', { message: "No data returned from Vision AI processing." }), 'error');
    }
  }, [visionAIInputText, language, availableCategories, showToast, translate]);

  const filteredProducts = useMemo(() => products.filter(p => 
    p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
  ), [products, debouncedSearchTerm]);


  return (
    <div>
      <PageHeader title={translate('inventory_title')} subtitle={translate('inventory_subtitle')} />
      
      <div className="bg-[var(--theme-panel-bg)] p-6 rounded-xl shadow-lg mb-6 border border-[var(--theme-border-color)]">
        <h3 className="text-xl font-semibold text-[var(--theme-text-primary)] mb-4">{editingProduct ? translate('btn_edit') : translate('inventory_add_new_sim')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-3">
                <label className="block text-sm font-medium text-[var(--theme-text-secondary)]">{translate('inventory_product_image_label')}</label>
                <div className="w-full aspect-square bg-[var(--theme-input-bg)] rounded-lg flex items-center justify-center overflow-hidden border border-[var(--theme-border-color)]">
                    {isGeneratingImage ? (
                        <Loader text={translate('toast_imagen_image_generating')} />
                    ) : productImageDataUrl ? (
                        <img src={productImageDataUrl} alt={productName || "Product Image"} className="w-full h-full object-cover" />
                    ) : editingProduct?.image && editingProduct.image.startsWith('data:image') ? (
                        <img src={editingProduct.image} alt={editingProduct.name} className="w-full h-full object-cover" />
                    ) : editingProduct?.image ? (
                         <span className="text-6xl" aria-hidden="true">{editingProduct.image}</span>
                    ) : (
                        <PhotoIcon className="h-24 w-24 text-[var(--theme-text-muted)]" aria-hidden="true"/>
                    )}
                </div>
                <KioskButton variant="gemini" onClick={handleGenerateImage} isLoading={isGeneratingImage} fullWidth disabled={!productName.trim() || !(category === 'NEW_CATEGORY_INPUT' ? newCategoryInput.trim() : category.trim())}>
                  <SparklesIcon className="h-5 w-5 mr-2" aria-hidden="true"/>{translate('inventory_btn_imagen_image')}
                </KioskButton>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <KioskInput label={translate('inventory_product_name')} value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={translate('new_product_name_placeholder')} className="sm:col-span-2" />
                
                <div>
                    <label htmlFor="inventory-category" className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-1">{translate('inventory_category')}</label>
                    <select 
                        id="inventory-category" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-3 kiosk-input"
                        aria-label={translate('inventory_category')}
                    >
                        {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        <option value="NEW_CATEGORY_INPUT">-- Tambah Kategori Baharu --</option>
                    </select>
                </div>
                {category === 'NEW_CATEGORY_INPUT' && (
                    <KioskInput label="Nama Kategori Baharu" value={newCategoryInput} onChange={(e) => setNewCategoryInput(e.target.value)} placeholder="Cth: Makanan Laut Sejuk Beku"/>
                )}

                <KioskInput label={translate('inventory_form_price')} type="number" value={price} onChange={(e) => setPrice(e.target.value)} step="0.01" min="0.01" />
                <KioskInput label={translate('inventory_form_stock')} type="number" value={stock} onChange={(e) => setStock(e.target.value)} min="0" />
                <KioskInput label={translate('inventory_form_sku')} value={sku} onChange={(e) => setSku(e.target.value)} className="sm:col-span-2" />
                <KioskInput label={translate('inventory_keywords')} value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder={translate('new_product_keywords_placeholder')} className="sm:col-span-2"/>
                
                <div className="sm:col-span-2">
                    <label htmlFor="new-product-description-inv" className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-1">{translate('inventory_description')}</label>
                    <textarea 
                        id="new-product-description-inv" 
                        rows={3} 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={translate('new_product_desc_placeholder')}
                        className="w-full p-3 kiosk-input rounded-lg shadow-sm"
                    />
                     <KioskButton variant="gemini" onClick={handleGenerateDescription} isLoading={isGeneratingDesc} className="mt-2 text-xs py-1.5 px-3" disabled={!productName.trim()}>
                        <SparklesIcon className="h-4 w-4 mr-1.5" aria-hidden="true"/>{translate('inventory_btn_gemini_desc')}
                    </KioskButton>
                </div>
            </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
            {editingProduct && <KioskButton variant="secondary" onClick={resetForm}>{translate('btn_cancel')}</KioskButton>}
            <KioskButton variant="primary" onClick={handleSaveProduct}>
                {editingProduct ? translate('btn_save') : translate('inventory_btn_add_manual')}
            </KioskButton>
        </div>
      </div>

      <div className="bg-[var(--theme-panel-bg)] p-6 rounded-xl shadow-lg border border-[var(--theme-border-color)]">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <KioskInput 
                type="text" 
                value={searchTermInput}
                onChange={(e) => setSearchTermInput(e.target.value)}
                placeholder={translate('inventory_search_placeholder')} 
                className="w-full sm:w-1/2 lg:w-1/3"
                onClear={() => setSearchTermInput('')}
                aria-label={translate('inventory_search_placeholder')}
            />
            <KioskButton 
                variant="gemini" 
                onClick={handleVisionAIAddProductClick}
                className="w-full sm:w-auto"
            >
                <CameraIcon className="h-5 w-5 mr-2" aria-hidden="true"/>
                {translate('inventory_btn_add_vision_ai')}
            </KioskButton>
        </div>
        <InventoryTable products={filteredProducts} onEditProduct={handleEditProduct} onDeleteProduct={handleDeleteProduct} searchTerm={debouncedSearchTerm} />
      </div>

      <Modal
        isOpen={isVisionAIModalOpen}
        onClose={useCallback(() => setIsVisionAIModalOpen(false), [])}
        title={translate('inventory_vision_ai_modal_title')}
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
            <p className="text-sm text-[var(--theme-text-muted)]">
                {translate('inventory_vision_ai_input_placeholder')}
            </p>
            <div>
                <label htmlFor="vision-ai-input" className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-1">
                    {translate('inventory_vision_ai_input_label')}
                </label>
                <textarea
                    id="vision-ai-input"
                    rows={5}
                    value={visionAIInputText}
                    onChange={(e) => setVisionAIInputText(e.target.value)}
                    placeholder={translate('inventory_vision_ai_input_placeholder')}
                    className="w-full p-3 kiosk-input rounded-lg shadow-sm focus:ring-[var(--theme-accent-magenta)] focus:border-[var(--theme-accent-magenta)]"
                    aria-label={translate('inventory_vision_ai_input_label')}
                />
            </div>
            <div className="flex justify-end space-x-3 pt-2">
                <KioskButton variant="secondary" onClick={() => setIsVisionAIModalOpen(false)}>
                    {translate('btn_cancel')}
                </KioskButton>
                <KioskButton
                    variant="gemini"
                    onClick={handleProcessVisionAIInput}
                    isLoading={isProcessingVisionAI}
                >
                    <SparklesIcon className="h-5 w-5 mr-2" aria-hidden="true"/>
                    {translate('inventory_vision_ai_btn_process')}
                </KioskButton>
            </div>
        </div>
      </Modal>

    </div>
  );
};

export default React.memo(InventoryPage);
