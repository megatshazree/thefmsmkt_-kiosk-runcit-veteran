import React, { useState, useCallback, useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { useLanguageStore } from '../../store/languageStore';
import { mockEmployeesData } from '../../constants/mockData';
import KioskInput from '../../components/common/KioskInput';
import KioskButton from '../../components/common/KioskButton';
import { Employee } from '../../types';
import EmployeeModal from './EmployeeModal';
import { useToastStore } from '../../store/toastStore';
import { CubeTransparentIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import useDebounce from '../../hooks/useDebounce';

const EmployeeTable: React.FC<{
    employees: Employee[]; 
    onEdit: (employee: Employee) => void;
    onDelete: (employeeId: string) => void;
    searchTerm: string;
}> = React.memo(({ employees, onEdit, onDelete, searchTerm }) => {
    const { translate } = useLanguageStore();

    if (employees.length === 0) {
         return (
            <div className="text-center py-10 text-[var(--theme-text-muted)]">
                <CubeTransparentIcon className="h-20 w-20 mx-auto text-[var(--theme-text-muted)] opacity-50 mb-4" aria-hidden="true"/>
                <p className="text-lg">{translate('table_no_employees')}</p>
                {searchTerm && <p className="text-sm mt-1">{translate('employee_search_placeholder')} "{searchTerm}"</p>}
            </div>
        );
    }
    
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-[var(--theme-panel-bg-alt)]">
                    <tr>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left text-[var(--theme-text-secondary)]">{translate('table_employee_id')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left text-[var(--theme-text-secondary)]">{translate('table_employee_name')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left text-[var(--theme-text-secondary)]">{translate('table_employee_role')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left text-[var(--theme-text-secondary)]">{translate('table_employee_status')}</th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left text-[var(--theme-text-secondary)]">{translate('table_actions')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--theme-border-color)]">
                    {employees.map(emp => (
                        <tr key={emp.id} className="hover:bg-[var(--theme-panel-bg-alt)] transition-colors">
                            <td className="p-3 text-sm text-[var(--theme-text-muted)] whitespace-nowrap">{emp.id}</td>
                            <td className="p-3 text-sm text-[var(--theme-text-primary)] font-medium whitespace-nowrap">{emp.fullname}</td>
                            <td className="p-3 text-sm text-[var(--theme-text-muted)] whitespace-nowrap" data-lang-key={`role_${emp.role.toLowerCase()}`}>
                                {translate(`role_${emp.role.toLowerCase()}`) || emp.role}
                            </td>
                            <td className="p-3 text-sm text-[var(--theme-text-muted)] whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${emp.status === 'Aktif' ? 'bg-green-700 text-green-100' : 'bg-red-700 text-red-100'}`}>
                                    {emp.status}
                                </span>
                            </td>
                            <td className="p-3 text-sm whitespace-nowrap">
                                <button onClick={() => onEdit(emp)} className="text-[var(--theme-accent-cyan)] hover:brightness-125 mr-3 font-medium p-1" aria-label={`${translate('btn_edit')} ${emp.fullname}`}>
                                    <PencilSquareIcon className="h-5 w-5"/>
                                </button>
                                <button onClick={() => onDelete(emp.id)} className="text-red-400 hover:text-red-300 font-medium p-1" aria-label={`${translate('btn_delete')} ${emp.fullname}`}>
                                    <TrashIcon className="h-5 w-5"/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});


const EmployeePage: React.FC = () => {
  const { translate } = useLanguageStore();
  const { showToast } = useToastStore();
  const [searchTermInput, setSearchTermInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchTermInput, 300);
  const [employees, setEmployees] = useState<Employee[]>(() => [...mockEmployeesData]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const handleAddEmployee = useCallback(() => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  }, []);

  const handleEditEmployee = useCallback((employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  }, []);
  
  const handleDeleteEmployee = useCallback((employeeId: string) => {
    const empToDelete = employees.find(emp => emp.id === employeeId);
    if (window.confirm(`${translate('btn_delete')} ${empToDelete?.fullname || 'employee'}?`)) {
        setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
        showToast(translate('toast_employee_deleted'), 'success');
    }
  }, [employees, showToast, translate]);


  const handleSaveEmployee = useCallback((employee: Employee) => {
    setEmployees(prev => {
        const existingIndex = prev.findIndex(emp => emp.id === employee.id);
        if (existingIndex > -1) {
            const updated = [...prev];
            updated[existingIndex] = employee;
            showToast(translate('toast_employee_updated'), 'success');
            return updated;
        }
        showToast(translate('toast_employee_added'), 'success');
        return [...prev, { ...employee, id: employee.id || `E${String(prev.length + 101).padStart(3, '0')}`} ];
    });
    setIsModalOpen(false);
  }, [showToast, translate]);


  const filteredEmployees = useMemo(() => employees.filter(emp => 
    emp.fullname.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    emp.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  ), [employees, debouncedSearchTerm]);

  return (
    <div>
      <PageHeader 
        title={translate('employee_title')} 
        subtitle={translate('employee_subtitle')}
        actions={
             <KioskButton variant="primary" onClick={handleAddEmployee} className="w-full sm:w-auto">
                {translate('employee_btn_add')}
            </KioskButton>
        }
      />
      <div className="bg-[var(--theme-panel-bg)] p-6 rounded-xl shadow-lg border border-[var(--theme-border-color)]">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <KioskInput 
                type="text" 
                value={searchTermInput}
                onChange={(e) => setSearchTermInput(e.target.value)}
                placeholder={translate('employee_search_placeholder')} 
                className="w-full sm:w-2/3 lg:w-1/2"
                onClear={() => setSearchTermInput('')}
                aria-label={translate('employee_search_placeholder')}
            />
        </div>
        <EmployeeTable 
            employees={filteredEmployees} 
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
            searchTerm={debouncedSearchTerm}
        />
      </div>
      {isModalOpen && (
        <EmployeeModal
            isOpen={isModalOpen}
            onClose={useCallback(() => setIsModalOpen(false), [])}
            onSave={handleSaveEmployee}
            employee={editingEmployee}
        />
      )}
    </div>
  );
};

export default React.memo(EmployeePage);
