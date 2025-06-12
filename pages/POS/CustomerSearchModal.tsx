
import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import KioskInput from '../../components/common/KioskInput';
import KioskButton from '../../components/common/KioskButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { Customer } from '../../types';
import { mockCustomers } from '../../constants/mockData';
import { UserCircleIcon } from '@heroicons/react/24/outline';

interface CustomerSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCustomer: (customer: Customer) => void;
}

const CustomerSearchModal: React.FC<CustomerSearchModalProps> = ({ isOpen, onClose, onSelectCustomer }) => {
  const { translate } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(mockCustomers);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setFilteredCustomers(mockCustomers);
    }
  }, [isOpen]);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (!lowerSearchTerm) {
      setFilteredCustomers(mockCustomers);
    } else {
      setFilteredCustomers(
        mockCustomers.filter(
          customer =>
            customer.name.toLowerCase().includes(lowerSearchTerm) ||
            customer.email.toLowerCase().includes(lowerSearchTerm) ||
            customer.phone.includes(lowerSearchTerm)
        )
      );
    }
  }, [searchTerm]);

  const handleSelect = (customer: Customer) => {
    onSelectCustomer(customer);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={translate('pos_modal_customer_search_title')}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        <KioskInput
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={translate('pos_customer_search_placeholder')}
          autoFocus
        />
        <div className="max-h-80 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map(customer => (
              <div
                key={customer.id}
                className="flex items-center justify-between p-3 bg-slate-700 hover:bg-slate-600 rounded-lg cursor-pointer transition-colors"
                onClick={() => handleSelect(customer)}
              >
                <div className="flex items-center">
                  <UserCircleIcon className="h-8 w-8 text-sky-400 mr-3" />
                  <div>
                    <p className="font-medium text-stone-100">{customer.name}</p>
                    <p className="text-xs text-stone-400">{customer.email} - {customer.phone}</p>
                  </div>
                </div>
                <KioskButton
                    variant="secondary"
                    className="!px-3 !py-1.5 !text-sm"
                    onClick={(e) => { e.stopPropagation(); handleSelect(customer);}}
                >
                    {translate('pos_btn_select_customer')}
                </KioskButton>
              </div>
            ))
          ) : (
            <p className="text-center text-stone-400 py-6">{translate('pos_customer_no_results')}</p>
          )}
        </div>
      </div>
       <div className="mt-6 flex justify-end">
        <KioskButton variant="secondary" onClick={onClose}>
          {translate('btn_cancel')}
        </KioskButton>
      </div>       
    </Modal>
  );
};

export default CustomerSearchModal;
