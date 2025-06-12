
import React, {useState, useMemo} from 'react';
import PageHeader from '../../components/common/PageHeader';
import { useLanguage } from '../../contexts/LanguageContext';
import { mockCustomers } from '../../constants/mockData';
import KioskInput from '../../components/common/KioskInput';
import KioskButton from '../../components/common/KioskButton';
import { Customer } from '../../types';
import { CubeTransparentIcon, EyeIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import useDebounce from '../../hooks/useDebounce';

const CustomerTable: React.FC<{customers: Customer[], searchTerm: string}> = React.memo(({customers, searchTerm}) => {
    const { translate } = useLanguage();

    if (customers.length === 0) {
        return (
            <div className="text-center py-10 text-[var(--theme-text-muted)]">
                <CubeTransparentIcon className="h-20 w-20 mx-auto text-[var(--theme-text-muted)] opacity-50 mb-4" aria-hidden="true"/>
                <p className="text-lg">{translate('table_no_customers')}</p>
                {searchTerm && <p className="text-sm mt-1">{translate('crm_search_placeholder')} "{searchTerm}"</p>}
            </div>
        );
    }
    
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-[var(--theme-panel-bg-alt)]">
                    <tr>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left text-[var(--theme-text-secondary)]">{translate('table_id')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left text-[var(--theme-text-secondary)]">{translate('table_customer_name')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left text-[var(--theme-text-secondary)]">{translate('table_email')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left text-[var(--theme-text-secondary)]">{translate('table_phone')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left text-[var(--theme-text-secondary)]">{translate('table_total_purchase')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left text-[var(--theme-text-secondary)]">{translate('table_actions')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--theme-border-color)]">
                    {customers.map(c => (
                        <tr key={c.id} className="hover:bg-[var(--theme-panel-bg-alt)] transition-colors">
                            <td className="p-3 text-sm text-[var(--theme-text-muted)] whitespace-nowrap">{c.id}</td>
                            <td className="p-3 text-sm text-[var(--theme-text-primary)] font-medium whitespace-nowrap">{c.name}</td>
                            <td className="p-3 text-sm text-[var(--theme-text-muted)] whitespace-nowrap">{c.email}</td>
                            <td className="p-3 text-sm text-[var(--theme-text-muted)] whitespace-nowrap">{c.phone}</td>
                            <td className="p-3 text-sm text-[var(--theme-text-muted)]">RM {c.totalSpent.toFixed(2)}</td>
                            <td className="p-3 text-sm whitespace-nowrap">
                                <button className="text-[var(--theme-accent-cyan)] hover:brightness-125 mr-3 font-medium p-1" aria-label={`${translate('btn_view')} ${c.name}`}>
                                    <EyeIcon className="h-5 w-5" />
                                </button>
                                <button className="text-[var(--theme-accent-magenta)] hover:brightness-125 font-medium p-1" aria-label={`${translate('btn_edit')} ${c.name}`}>
                                    <PencilSquareIcon className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});


const CRMPage: React.FC = () => {
  const { translate } = useLanguage();
  const [searchTermInput, setSearchTermInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchTermInput, 300);
  const [customers, setCustomers] = useState<Customer[]>(() => [...mockCustomers]); 

  const filteredCustomers = useMemo(() => customers.filter(c => 
    c.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    c.phone.includes(debouncedSearchTerm)
  ), [customers, debouncedSearchTerm]);

 
  const handleAddCustomer = React.useCallback(() => {
    // Logic to open a modal or navigate to an add customer form
    alert('Fungsi tambah pelanggan baharu akan datang!');
  }, []);

  return (
    <div>
      <PageHeader title={translate('crm_title')} subtitle={translate('crm_subtitle')} />
      <div className="bg-[var(--theme-panel-bg)] p-6 rounded-xl shadow-lg border border-[var(--theme-border-color)]">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <KioskInput 
                type="text" 
                value={searchTermInput}
                onChange={(e) => setSearchTermInput(e.target.value)}
                placeholder={translate('crm_search_placeholder')} 
                className="w-full sm:w-2/3 lg:w-1/2"
                onClear={() => setSearchTermInput('')}
                aria-label={translate('crm_search_placeholder')}
            />
            <KioskButton variant="primary" className="w-full sm:w-auto" onClick={handleAddCustomer}>
                {translate('crm_btn_add_customer')}
            </KioskButton>
        </div>
        <CustomerTable customers={filteredCustomers} searchTerm={debouncedSearchTerm} />
      </div>
    </div>
  );
};

export default React.memo(CRMPage);
