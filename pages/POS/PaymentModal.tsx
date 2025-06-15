import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import KioskButton from '../../components/common/KioskButton';
import KioskInput from '../../components/common/KioskInput';
import { useToastStore } from '../../store/toastStore';
import { useLanguageStore } from '../../store/languageStore';
import { useCartStore } from '../../store/cartStore';
import { paymentMethods } from '../../constants/menuItems';
import { AnonymizedCustomerAnalytics, BuyerInfo, EInvoiceDetails, GeminiResponse, SupplierInfo, Customer } from '../../types'; // Added Customer
import { getDemographicInsightSummary, generateSimulatedEInvoiceData } from '../../services/geminiService';
import { mockSupplierInfo } from '../../constants/mockData'; 
import { SparklesIcon } from '@heroicons/react/24/solid';
import EInvoiceDisplayModal from '../../components/pos/EInvoiceDisplayModal';
import Loader from '../../components/common/Loader';


interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  currentOrderDiscount: number; 
  selectedCustomer: Customer | null; // New prop
}

import { DEFAULT_TAX_RATE } from '../../constants/appConstants';

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentSuccess, currentOrderDiscount, selectedCustomer }) => {
  const { translate, language } = useLanguageStore();
  const { cartItems, getCartSubtotal, getCartTax } = useCartStore(); 
  const { showToast } = useToastStore();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(paymentMethods[0].key);
  const [cashReceived, setCashReceived] = useState<string>('');
  const [emailReceipt, setEmailReceipt] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [whatsappReceipt, setWhatsappReceipt] = useState(false);
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  
  const [customerAnalytics, setCustomerAnalytics] = useState<AnonymizedCustomerAnalytics | null>(null);
  const [analyticsSummary, setAnalyticsSummary] = useState<string | null>(null);
  const [isGeneratingAnalytics, setIsGeneratingAnalytics] = useState(false);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  // E-Invoice State
  const [generateEInvoice, setGenerateEInvoice] = useState(false);
  const [buyerNameForEInvoice, setBuyerNameForEInvoice] = useState('');
  const [buyerTINForEInvoice, setBuyerTINForEInvoice] = useState(''); // Keep for potential future use if Customer type expands
  const [isEInvoiceDisplayOpen, setIsEInvoiceDisplayOpen] = useState(false);
  const [eInvoiceDetails, setEInvoiceDetails] = useState<EInvoiceDetails | null>(null);
  const [isGeneratingEInvoice, setIsGeneratingEInvoice] = useState(false);


  const subtotal = getCartSubtotal();
  const discountedSubtotal = Math.max(0, subtotal - currentOrderDiscount);
  const tax = getCartTax(discountedSubtotal); 
  const grandTotal = discountedSubtotal + tax;

  const cashReceivedAmount = parseFloat(cashReceived) || 0;
  const changeAmount = cashReceivedAmount > grandTotal ? cashReceivedAmount - grandTotal : 0;

  useEffect(() => {
    if (isOpen) {
      // Reset form on open
      setSelectedPaymentMethod(paymentMethods[0].key);
      setCashReceived('');
      setEmailReceipt(false);
      setCustomerEmail(selectedCustomer?.email || ''); // Pre-fill email if customer selected
      setWhatsappReceipt(false);
      setCustomerWhatsapp(selectedCustomer?.phone || ''); // Pre-fill phone if customer selected
      setCustomerAnalytics(null); 
      setAnalyticsSummary(null);
      setGenerateEInvoice(false);
      setBuyerNameForEInvoice(selectedCustomer?.name || ''); // Pre-fill name if customer selected
      // setBuyerTINForEInvoice(selectedCustomer?.tin || ''); // If TIN becomes part of Customer type
      setIsEInvoiceDisplayOpen(false);
      setEInvoiceDetails(null);
      setIsGeneratingEInvoice(false);
    }
  }, [isOpen, selectedCustomer]);
  
  const simulateGenerateAnalytics = () => {
    setIsGeneratingAnalytics(true);
    showToast(translate('toast_analytics_generating'), 'info', 1500);
    setTimeout(() => {
        const ageGroups: AnonymizedCustomerAnalytics['ageGroup'][] = ['Young Adult', 'Adult', 'Senior', 'Teenager'];
        const genders: AnonymizedCustomerAnalytics['gender'][] = ['Male', 'Female', 'Unknown'];
        const sentiments: AnonymizedCustomerAnalytics['sentiment'][] = ['Positive', 'Neutral', 'Negative'];
        
        setCustomerAnalytics({
            ageGroup: ageGroups[Math.floor(Math.random() * ageGroups.length)],
            gender: genders[Math.floor(Math.random() * genders.length)],
            sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
        });
        setIsGeneratingAnalytics(false);
        showToast(translate('toast_analytics_generated'), 'success', 1500);
    }, 1000); 
  };


  const handleConfirmPayment = async () => {
    if (whatsappReceipt && !customerWhatsapp.trim()) {
      showToast(translate('toast_whatsapp_no_number'), 'warning');
      return;
    }
    if (whatsappReceipt && customerWhatsapp.trim()) {
         showToast(translate('toast_whatsapp_sim', { whatsappNumber: customerWhatsapp.trim() }), 'info', 2500); 
    }
    
    simulateGenerateAnalytics(); 

    if (generateEInvoice) {
        setIsGeneratingEInvoice(true);
        showToast(translate('toast_e_invoice_generating'), 'info');
        
        const buyerInfo: BuyerInfo = {
            name: buyerNameForEInvoice || (selectedCustomer?.name) || undefined,
            tin: buyerTINForEInvoice || undefined, // If customer.tin exists: selectedCustomer?.tin
            email: customerEmail || (selectedCustomer?.email) || undefined,
            phone: customerWhatsapp || (selectedCustomer?.phone) || undefined,
            // address: selectedCustomer?.address || undefined, // If customer.address exists
        };

        const eInvoiceResult = await generateSimulatedEInvoiceData(
            cartItems,
            currentOrderDiscount, 
            DEFAULT_TAX_RATE, 
            grandTotal,
            selectedPaymentMethod,
            mockSupplierInfo,
            buyerInfo,
            language
        );
        setIsGeneratingEInvoice(false);

        if (eInvoiceResult.error || !eInvoiceResult.data) {
            showToast(translate('toast_e_invoice_failed') + (eInvoiceResult.error ? `: ${eInvoiceResult.error.substring(0,100)}` : ''), 'error');
            finalizePaymentSuccess();
        } else {
            setEInvoiceDetails(eInvoiceResult.data);
            setIsEInvoiceDisplayOpen(true);
            showToast(translate('toast_e_invoice_generated'), 'success');
        }
    } else {
      setTimeout(() => {
        finalizePaymentSuccess();
      }, 1600); 
    }
  };

  const finalizePaymentSuccess = () => {
    showToast(translate('toast_payment_confirmed'), 'success');
    onPaymentSuccess(); 
  };

  const handleEInvoiceModalClose = () => {
    setIsEInvoiceDisplayOpen(false);
    finalizePaymentSuccess(); 
  };


  const handleGetInsightSummary = async () => {
    if (!customerAnalytics) return;
    setIsGeneratingInsight(true);
    setAnalyticsSummary(null);
    showToast(translate('toast_insight_summary_generating'), 'info');

    const result: GeminiResponse<string> = await getDemographicInsightSummary(customerAnalytics, language);
    
    setIsGeneratingInsight(false);
    if (result.error) {
        showToast(translate('toast_api_error', {message: result.error}), 'error');
    } else if (result.data) {
        setAnalyticsSummary(result.data);
        showToast(translate('toast_insight_summary_generated'), 'success');
    }
  };


  return (
    <>
    <Modal 
      isOpen={isOpen && !isEInvoiceDisplayOpen} 
      onClose={onClose} 
      title={translate('payment_modal_title')}
      maxWidth="max-w-3xl" 
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payment Details Section (col-span-2) */}
        <div className="md:col-span-2 space-y-4">
          <p className="text-center text-xl mb-2 md:mb-6 col-span-full">
            <span className="text-stone-300">{translate('payment_modal_total_due')}: </span>
            <span className="font-bold text-green-400">RM {grandTotal.toFixed(2)}</span>
          </p>
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-1">{translate('payment_method_label')}</label>
            <div className="mt-1 grid grid-cols-2 gap-3">
              {paymentMethods.map(method => (
                <KioskButton
                  key={method.key}
                  variant={selectedPaymentMethod === method.key ? 'primary' : 'secondary'}
                  onClick={() => setSelectedPaymentMethod(method.key)}
                  className="p-3 text-sm sm:text-base"
                >
                  {translate(method.labelKey)}
                </KioskButton>
              ))}
            </div>
          </div>

          {selectedPaymentMethod === 'cash' && (
            <div className="bg-slate-700 p-3 sm:p-4 rounded-lg">
              <KioskInput
                label={translate('payment_cash_received')}
                type="number"
                id="cash-received"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                placeholder={translate('cash_received_input_placeholder')}
                className="!bg-slate-600 !border-slate-500"
              />
              <p className="mt-2 text-sm text-stone-300">
                {translate('payment_change')}: <span className="font-semibold text-green-400">RM {changeAmount.toFixed(2)}</span>
              </p>
            </div>
          )}

          <div className="space-y-2 pt-1">
              <div className="flex items-center">
                  <input type="checkbox" id="email-receipt" checked={emailReceipt} onChange={(e) => setEmailReceipt(e.target.checked)} className="h-4 w-4 text-green-500 rounded border-slate-600 bg-slate-700 focus:ring-green-500"/>
                  <label htmlFor="email-receipt" className="ml-2 text-sm text-stone-300">{translate('payment_send_email_receipt')}</label>
              </div>
              {emailReceipt && (
                   <KioskInput type="email" id="customer-email-for-receipt" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder={translate('customer_email_placeholder')} className="!p-2 !bg-slate-600 !border-slate-500"/>
              )}
          </div>
          <div className="space-y-2">
              <div className="flex items-center">
                  <input type="checkbox" id="whatsapp-receipt" checked={whatsappReceipt} onChange={(e) => setWhatsappReceipt(e.target.checked)} className="h-4 w-4 text-green-500 rounded border-slate-600 bg-slate-700 focus:ring-green-500"/>
                  <label htmlFor="whatsapp-receipt" className="ml-2 text-sm text-stone-300">{translate('payment_send_whatsapp_receipt')}</label>
              </div>
              {whatsappReceipt && (
                   <KioskInput type="tel" id="customer-whatsapp-for-receipt" value={customerWhatsapp} onChange={(e) => setCustomerWhatsapp(e.target.value)} placeholder={translate('customer_whatsapp_placeholder')} className="!p-2 !bg-slate-600 !border-slate-500"/>
              )}
          </div>
          {/* E-Invoice Options */}
          <div className="space-y-2 pt-2 border-t border-slate-700 mt-3">
              <div className="flex items-center">
                  <input type="checkbox" id="generate-e-invoice" checked={generateEInvoice} onChange={(e) => setGenerateEInvoice(e.target.checked)} className="h-4 w-4 text-green-500 rounded border-slate-600 bg-slate-700 focus:ring-green-500"/>
                  <label htmlFor="generate-e-invoice" className="ml-2 text-sm font-medium text-stone-200">{translate('payment_generate_e_invoice')}</label>
              </div>
              {generateEInvoice && (
                  <div className="pl-6 space-y-2">
                    <KioskInput label={translate('payment_buyer_name_e_invoice')} id="buyer-name-e-invoice" value={buyerNameForEInvoice} onChange={(e) => setBuyerNameForEInvoice(e.target.value)} placeholder={selectedCustomer ? selectedCustomer.name : "Nama Syarikat / Individu"} className="!p-2 !text-xs !bg-slate-600 !border-slate-500"/>
                    <KioskInput label={translate('payment_buyer_tin_e_invoice') + ' (Optional)'} id="buyer-tin-e-invoice" value={buyerTINForEInvoice} onChange={(e) => setBuyerTINForEInvoice(e.target.value)} placeholder="No. TIN Pembeli jika ada" className="!p-2 !text-xs !bg-slate-600 !border-slate-500"/>
                  </div>
              )}
          </div>

        </div>

        {/* Anonymized Customer Analytics Section (col-span-1) */}
        <div className="md:col-span-1 bg-slate-700/70 p-3 sm:p-4 rounded-lg space-y-3 border border-slate-600 self-start">
            <h4 className="text-md font-semibold text-purple-300 mb-1">{translate('payment_anonymized_analytics_title')}</h4>
            {isGeneratingAnalytics && <Loader size="sm" text={translate('toast_analytics_generating')} />}
            {customerAnalytics && !isGeneratingAnalytics && (
                <div className="text-sm space-y-1 text-stone-300">
                    <p><strong>{translate('payment_analytics_age_group')}</strong> {customerAnalytics.ageGroup || 'N/A'}</p>
                    <p><strong>{translate('payment_analytics_gender')}</strong> {customerAnalytics.gender || 'N/A'}</p>
                    <p><strong>{translate('payment_analytics_sentiment')}</strong> {customerAnalytics.sentiment || 'N/A'}</p>
                    <KioskButton 
                        variant="gemini" 
                        onClick={handleGetInsightSummary} 
                        isLoading={isGeneratingInsight}
                        disabled={!customerAnalytics || isGeneratingInsight}
                        className="w-full text-xs mt-2 !py-1.5"
                    >
                        <SparklesIcon className="h-3 w-3 mr-1"/> {translate('payment_btn_get_insight_summary')}
                    </KioskButton>
                    {analyticsSummary && (
                        <div className="mt-2 text-xs bg-slate-600 p-2 rounded">
                            <p className="font-semibold text-purple-400 mb-0.5">{translate('payment_analytics_gemini_summary_title')}</p>
                            <p>{analyticsSummary}</p>
                        </div>
                    )}
                </div>
            )}
             <p className="text-xs text-stone-500 mt-2 italic">{translate('payment_analytics_privacy_note')}</p>
        </div>
      </div>
      
      <div className="mt-6 sm:mt-8 flex justify-end space-x-3">
        <KioskButton variant="secondary" onClick={onClose} disabled={isGeneratingEInvoice || isGeneratingAnalytics}>{translate('btn_cancel')}</KioskButton>
        <KioskButton variant="primary" onClick={handleConfirmPayment} disabled={isGeneratingEInvoice || isGeneratingAnalytics} isLoading={isGeneratingEInvoice}>
            {isGeneratingEInvoice ? translate('toast_e_invoice_generating') : translate('btn_confirm_payment')}
        </KioskButton>
      </div>
    </Modal>

    {eInvoiceDetails && (
        <EInvoiceDisplayModal
            isOpen={isEInvoiceDisplayOpen}
            onClose={handleEInvoiceModalClose}
            eInvoiceData={eInvoiceDetails}
        />
    )}
    </>
  );
};

export default PaymentModal;