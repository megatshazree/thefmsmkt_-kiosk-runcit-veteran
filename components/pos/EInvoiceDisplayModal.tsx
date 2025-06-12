import React, { useEffect } from 'react'; // Added useEffect import
import Modal from '../common/Modal';
import KioskButton from '../common/KioskButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { EInvoiceDetails } from '../../types';
import { PrinterIcon } from '@heroicons/react/24/outline';

interface EInvoiceDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  eInvoiceData: EInvoiceDetails | null;
}

const DetailRow: React.FC<{ labelKey: string; value?: string | number | null; isEmphasized?: boolean }> = ({ labelKey, value, isEmphasized = false }) => {
    const { translate } = useLanguage();
    if (value === undefined || value === null || String(value).trim() === '') return null;
    return (
        <div className="flex justify-between py-1 border-b border-slate-600/50">
            <span className="text-stone-400 text-xs">{translate(labelKey)}</span>
            <span className={`text-stone-100 text-xs text-right ${isEmphasized ? 'font-semibold' : ''}`}>{String(value)}</span>
        </div>
    );
};

const EInvoiceDisplayModal: React.FC<EInvoiceDisplayModalProps> = ({ isOpen, onClose, eInvoiceData }) => {
  const { translate } = useLanguage();

  useEffect(() => {
    const modalRoot = document.querySelector('.printable-modal-target'); 
    if (isOpen && modalRoot) {
        modalRoot.classList.add('printable-modal');
    }
    return () => {
        if (modalRoot) {
            modalRoot.classList.remove('printable-modal');
        }
    };
  }, [isOpen]);


  if (!isOpen || !eInvoiceData) return null;

  const handlePrint = () => {
    window.print();
  };

  const { supplier, buyer, lineItems } = eInvoiceData;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={translate('e_invoice_modal_title')}
      maxWidth="max-w-2xl printable-modal-target" // Added a target class
    >
      <div className="text-sm text-stone-300">
        <p className="text-center text-xs text-amber-400 mb-4 bg-amber-900/30 p-2 rounded-md border border-amber-700">
            {translate('e_invoice_simulated_text')}
        </p>

        {/* Invoice Header Details */}
        <div className="mb-4 p-3 bg-slate-700 rounded-md">
            <h4 className="font-semibold text-md text-green-400 mb-1.5">{translate('e_invoice_details_title')}</h4>
            <DetailRow labelKey="e_invoice_invoice_id" value={eInvoiceData.invoiceId} isEmphasized />
            <DetailRow labelKey="e_invoice_irbm_id" value={eInvoiceData.irbmUniqueId} />
            <DetailRow labelKey="e_invoice_submission_date" value={new Date(eInvoiceData.dateTimeStamp).toLocaleString()} />
            {eInvoiceData.validationDateTimeStamp && <DetailRow labelKey="e_invoice_validation_date" value={new Date(eInvoiceData.validationDateTimeStamp).toLocaleString()} />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Supplier Details */}
          <div className="p-3 bg-slate-700 rounded-md">
            <h4 className="font-semibold text-md text-sky-400 mb-1.5">{translate('e_invoice_supplier_title')}</h4>
            <DetailRow labelKey="e_invoice_tin" value={supplier.tin} />
            <p className="text-stone-100 font-medium text-xs py-1">{supplier.name}</p>
            <p className="text-stone-300 text-xs leading-snug py-1 border-b border-slate-600/50">{supplier.address}</p>
            <DetailRow labelKey="e_invoice_reg_no" value={supplier.businessRegistrationNumber} />
            <DetailRow labelKey="e_invoice_sst_no" value={supplier.sstNumber} />
            <DetailRow labelKey="e_invoice_msic_code" value={supplier.msicCode} />
            <DetailRow labelKey="e_invoice_email" value={supplier.email} />
            <DetailRow labelKey="e_invoice_phone" value={supplier.phone} />
          </div>

          {/* Buyer Details */}
          <div className="p-3 bg-slate-700 rounded-md">
            <h4 className="font-semibold text-md text-purple-400 mb-1.5">{translate('e_invoice_buyer_title')}</h4>
            <DetailRow labelKey="e_invoice_tin" value={buyer.tin || '-'} />
            <p className="text-stone-100 font-medium text-xs py-1">{buyer.name || translate('pos_customer_walk_in')}</p>
            {buyer.address && <p className="text-stone-300 text-xs leading-snug py-1 border-b border-slate-600/50">{buyer.address}</p>}
            <DetailRow labelKey="e_invoice_email" value={buyer.email} />
            <DetailRow labelKey="e_invoice_phone" value={buyer.phone} />
            {/* identificationType and identificationNumber can be added if present */}
          </div>
        </div>
        
        {/* Line Items */}
        <div className="mb-4 p-3 bg-slate-700 rounded-md">
            <h4 className="font-semibold text-md text-orange-400 mb-2">{translate('e_invoice_items_title')}</h4>
            <div className="overflow-x-auto max-h-48">
                <table className="w-full text-xs">
                    <thead className="text-stone-400 bg-slate-600">
                        <tr>
                            <th className="p-1.5 text-left font-normal">{translate('e_invoice_item_desc')}</th>
                            <th className="p-1.5 text-center font-normal">{translate('e_invoice_item_qty')}</th>
                            <th className="p-1.5 text-right font-normal">{translate('e_invoice_item_unit_price')}</th>
                            <th className="p-1.5 text-right font-normal">{translate('e_invoice_item_tax')} ({(eInvoiceData.lineItems[0]?.taxRate * 100 || 6)}%)</th>
                            <th className="p-1.5 text-right font-normal">{translate('e_invoice_item_total_price')}</th>
                        </tr>
                    </thead>
                    <tbody className="text-stone-200">
                        {lineItems.map((item, index) => (
                            <tr key={index} className="border-b border-slate-600/50 last:border-b-0">
                                <td className="p-1.5 text-left">{item.description}</td>
                                <td className="p-1.5 text-center">{item.quantity}</td>
                                <td className="p-1.5 text-right">RM {item.unitPrice.toFixed(2)}</td>
                                <td className="p-1.5 text-right">RM {item.taxAmount.toFixed(2)}</td>
                                <td className="p-1.5 text-right font-semibold">RM {item.amountIncludingTax.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Totals Summary */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-slate-700 rounded-md space-y-1">
                 <h4 className="font-semibold text-md text-rose-400 mb-1.5">{translate('e_invoice_summary_title')}</h4>
                <DetailRow labelKey="e_invoice_subtotal" value={`RM ${eInvoiceData.subTotal.toFixed(2)}`} />
                <DetailRow labelKey="e_invoice_discount" value={`RM ${eInvoiceData.discountAmount.toFixed(2)}`} />
                <DetailRow labelKey="e_invoice_taxable_amount" value={`RM ${eInvoiceData.taxableAmount.toFixed(2)}`} />
                <DetailRow labelKey="e_invoice_total_tax" value={`RM ${eInvoiceData.totalTaxAmount.toFixed(2)}`} />
                <DetailRow labelKey="e_invoice_grand_total" value={`RM ${eInvoiceData.totalAmountIncludingTax.toFixed(2)}`} isEmphasized />
                <DetailRow labelKey="e_invoice_payment_mode" value={eInvoiceData.paymentMode} />
                {eInvoiceData.notes && <DetailRow labelKey="e_invoice_notes" value={eInvoiceData.notes} />}
            </div>
            {/* QR Code Section */}
            <div className="p-3 bg-slate-700 rounded-md flex flex-col items-center justify-center">
                <h4 className="font-semibold text-md text-indigo-400 mb-2">{translate('e_invoice_qr_code_title')}</h4>
                {eInvoiceData.qrCodeData ? (
                    <div className="p-2 bg-white rounded-md">
                        {/* In a real app, use a QR code library. For now, display data. */}
                        <div className="w-32 h-32 flex items-center justify-center text-center text-xxs text-slate-700 break-all overflow-hidden" title={eInvoiceData.qrCodeData}>
                           <pre className="text-xxs whitespace-pre-wrap break-all p-1">{eInvoiceData.qrCodeData.split('|').join('\n')}</pre>
                        </div>
                    </div>
                ) : (
                    <p className="text-xs text-stone-400">{translate('reports_data_not_available')}</p>
                )}
                {eInvoiceData.validationUrl && (
                     <p className="text-xxs text-stone-400 mt-2 text-center">
                        {translate('e_invoice_validation_url_label')}<br/>
                        <a href={eInvoiceData.validationUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:underline break-all">{eInvoiceData.validationUrl}</a>
                    </p>
                )}
            </div>
        </div>


      </div>
      <div className="mt-6 flex justify-between items-center">
        <KioskButton variant="secondary" onClick={handlePrint} className="flex items-center">
            <PrinterIcon className="h-4 w-4 mr-2"/>
            {translate('e_invoice_btn_print')}
        </KioskButton>
        <KioskButton variant="primary" onClick={onClose}>
          {translate('e_invoice_btn_close')}
        </KioskButton>
      </div>
      <style>
        {`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-modal, .printable-modal * {
            visibility: visible;
          }
          .printable-modal {
            position: absolute !important; /* Use !important to override fixed if needed */
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            background-color: white !important; 
            color: black !important; 
            box-shadow: none !important;
            border: none !important;
            padding: 20px !important; /* Add some padding for print */
            margin: 0 !important; 
            max-width: none !important; /* Override max-width */
          }
          /* Ensure parent of modal is also not cutting it off */
          /* This might need adjustment based on where Modal is rendered */
          .fixed.inset-0.bg-black.bg-opacity-75 { 
            overflow: visible !important; 
            background: none !important; 
          }

          .printable-modal .bg-slate-700, 
          .printable-modal .bg-slate-800,
          .printable-modal .bg-slate-600,
          .printable-modal .bg-amber-900\\/30, /* Escaped slash */
          .printable-modal .border-amber-700 {
            background-color: #f8f8f8 !important; 
            border-color: #ccc !important;
          }
          .printable-modal .text-stone-100,
          .printable-modal .text-stone-200,
          .printable-modal .text-stone-300,
          .printable-modal .text-stone-400,
          .printable-modal .text-green-400,
          .printable-modal .text-sky-400,
          .printable-modal .text-purple-400,
          .printable-modal .text-orange-400,
          .printable-modal .text-rose-400,
          .printable-modal .text-indigo-400,
          .printable-modal .text-indigo-300,
          .printable-modal .text-amber-400 {
            color: black !important;
          }
          .printable-modal .border-slate-600\\/50 { /* Escaped slash */
            border-color: #ddd !important;
          }
          .printable-modal button {
            display: none !important; 
          }
           .printable-modal .w-32.h-32 { 
            border: 1px solid #333;
          }
           .printable-modal .text-xxs { /* This is a print-specific override if needed */
            font-size: 0.6rem; /* Example: smaller for print */
          }
        }
      `}
      </style>
       
    </Modal>
  );
};

export default EInvoiceDisplayModal;
