
import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import KioskButton from '../../components/common/KioskButton';
import KioskInput from '../../components/common/KioskInput';
import { useLanguage } from '../../contexts/LanguageContext';
import { Employee, EmployeePermission } from '../../types';
import { departmentOptions, roleOptions, permissionOptions } from '../../constants/menuItems';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  employee: Employee | null;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, onSave, employee }) => {
  const { translate } = useLanguage();
  const [formData, setFormData] = useState<Partial<Employee>>({});

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else {
      // Default for new employee
      setFormData({
        fullname: '',
        email: '',
        phone: '',
        department: departmentOptions[0].value,
        role: roleOptions[0].value,
        pin: '',
        startDate: new Date().toISOString().split('T')[0], // Today's date
        status: 'Aktif',
        permissions: { fullAccess: false, manualDiscount: false, processRefund: false }
      });
    }
  }, [employee, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            permissions: {
                ...(prev.permissions as EmployeePermission),
                [name as keyof EmployeePermission]: checked
            }
        }));
    } else {
         setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add validation here
    onSave(formData as Employee); // Assuming formData is complete or defaults handled
  };

  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={translate(employee ? 'employee_modal_edit_title' : 'employee_modal_add_title')}
        maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KioskInput label={translate('employee_form_fullname')} name="fullname" value={formData.fullname || ''} onChange={handleChange} required />
          <KioskInput label={translate('employee_form_id')} name="id" value={formData.id || ''} onChange={handleChange} placeholder={translate('employee_form_id_placeholder')} disabled={!!employee} />
          <KioskInput label={translate('employee_form_email')} name="email" type="email" value={formData.email || ''} onChange={handleChange} />
          <KioskInput label={translate('employee_form_phone')} name="phone" type="tel" value={formData.phone || ''} onChange={handleChange} />
          <div>
            <label htmlFor="employee-department" className="block text-sm font-medium text-stone-300 mb-1">{translate('employee_form_department')}</label>
            <select id="employee-department" name="department" value={formData.department} onChange={handleChange} className="w-full p-3 kiosk-input bg-slate-700 border-slate-600 rounded-lg focus:ring-green-500 focus:border-green-500 text-stone-100">
              {departmentOptions.map(opt => <option key={opt.value} value={opt.value}>{translate(opt.labelKey)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="employee-role" className="block text-sm font-medium text-stone-300 mb-1">{translate('employee_form_role')}</label>
            <select id="employee-role" name="role" value={formData.role} onChange={handleChange} className="w-full p-3 kiosk-input bg-slate-700 border-slate-600 rounded-lg focus:ring-green-500 focus:border-green-500 text-stone-100">
              {roleOptions.map(opt => <option key={opt.value} value={opt.value}>{translate(opt.labelKey)}</option>)}
            </select>
          </div>
          <KioskInput label={translate('employee_form_pin')} name="pin" type="password" value={formData.pin || ''} onChange={handleChange} maxLength={6} />
          <KioskInput label={translate('employee_form_start_date')} name="startDate" type="date" value={formData.startDate || ''} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-300 mb-1">{translate('employee_form_permissions')}</label>
          <div className="space-y-2 mt-1">
            {permissionOptions.map(perm => (
              <div key={perm.id} className="flex items-center">
                <input 
                    id={perm.id} 
                    name={perm.permissionKey}
                    type="checkbox" 
                    checked={formData.permissions ? formData.permissions[perm.permissionKey] : false}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-500 rounded border-slate-600 bg-slate-700 focus:ring-green-500"
                />
                <label htmlFor={perm.id} className="ml-2 text-sm text-stone-300">{translate(perm.labelKey)}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-3">
          <KioskButton type="button" variant="secondary" onClick={onClose}>{translate('btn_cancel')}</KioskButton>
          <KioskButton type="submit" variant="primary">{translate('btn_save_employee')}</KioskButton>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeModal;
