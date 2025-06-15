import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SelectOption, Integration } from '../types';
import { useLanguageStore } from '../store/languageStore';
import { useTheme } from '../src/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import SettingsCard from '../components/settings/SettingsCard';
import KioskInput from '../components/common/KioskInput';
import SettingsSelect from '../components/settings/SettingsSelect';
import KioskButton from '../components/common/KioskButton';
import { 
    SparklesIcon, 
    ReceiptPercentIcon, 
    CreditCardIcon, 
    BuildingStorefrontIcon, 
    CheckIcon, 
    AdjustmentsHorizontalIcon, 
    LinkIcon, 
    PaintBrushIcon, 
    SwatchIcon 
} from '@heroicons/react/24/outline'; 

const themeColorOptions = [
    { id: 'color-ds-purple', value: 'var(--theme-accent-purple)', name: 'Purple (Default)', checkIcon: true, hex: '#5B58EB' },
    { id: 'color-ds-magenta', value: 'var(--theme-accent-magenta)', name: 'Magenta', hex: '#BB63FF' },
    { id: 'color-ds-cyan', value: 'var(--theme-accent-cyan)', name: 'Cyan', hex: '#56E1E9' },
];

const fontOptions: SelectOption[] = [
    { value: 'Inter, sans-serif', label: 'Inter (Default)'},
    { value: 'Georgia, serif', label: 'Serif (Georgia, Times New Roman)' },
    { value: 'Courier New, monospace', label: 'Monospace (Courier New, Lucida)' },
];

const receiptTemplates: SelectOption[] = [
    { value: 'modern', label: 'Modern (Default)'}, { value: 'minimal', label: 'Minimal' },
    { value: 'compact', label: 'Compact' }, { value: 'detailed', label: 'Detailed' },
];

const initialIntegrations: Integration[] = [
    { name: 'Gemini AI', iconKey: 'gemini', status: 'Connected', bgColorClass: 'bg-[var(--theme-accent-cyan)] opacity-20', textColorClass: 'text-[var(--theme-accent-cyan)]' },
    { name: 'LHDN e-Invoice', iconKey: 'lhdn', status: 'Connected', bgColorClass: 'bg-green-500/20', textColorClass: 'text-green-300' },
    { name: 'Stripe', iconKey: 'stripe', status: 'Not connected', bgColorClass: 'bg-yellow-500/20', textColorClass: 'text-yellow-300' },
    { name: 'Shopify', iconKey: 'shopify', status: 'Not connected', bgColorClass: 'bg-fuchsia-500/20', textColorClass: 'text-fuchsia-300' },
];

const integrationIcons: Record<string, React.ReactElement> = {
    gemini: <SparklesIcon className="h-6 w-6" />,
    lhdn: <ReceiptPercentIcon className="h-6 w-6" />,
    stripe: <CreditCardIcon className="h-6 w-6" />,
    shopify: <BuildingStorefrontIcon className="h-6 w-6" />,
};

const SettingsPage: React.FC = () => {
  const { translate } = useLanguageStore();
  const { currentTheme, theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [storeName, setStoreName] = useState('THEFMSMKT POS');
  const [contactNumber, setContactNumber] = useState('+60 12-345 6789');
  const [address, setAddress] = useState('Lot 123, Jalan Kiosk Utama, Cyberjaya, Selangor, 63000 Malaysia');
  const [bizRegNum, setBizRegNum] = useState('SSM1234567-X');
  
  const [selectedColorVar, setSelectedColorVar] = useState(themeColorOptions[0].value); 
  const [isCustomColorActive, setIsCustomColorActive] = useState(false);
  const [customColorHex, setCustomColorHex] = useState('#7c3aed'); 

  const [selectedFont, setSelectedFont] = useState(fontOptions[0].value);
  const [selectedReceipt, setSelectedReceipt] = useState(receiptTemplates[0].value);

  const [enableSalesTax, setEnableSalesTax] = useState(true);
  const [taxRate, setTaxRate] = useState(6);
  const [taxId, setTaxId] = useState('MYGST123456789');

  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const initialPrimaryColor = rootStyle.getPropertyValue('--theme-primary-color').trim();
    const matchingOption = themeColorOptions.find(opt => rootStyle.getPropertyValue(opt.value.replace('var(', '').replace(')', '')).trim().toLowerCase() === initialPrimaryColor.toLowerCase());

    if (matchingOption) {
        setSelectedColorVar(matchingOption.value);
        setIsCustomColorActive(false);
    } else if (initialPrimaryColor) {
        setCustomColorHex(initialPrimaryColor);
        setSelectedColorVar('');
        setIsCustomColorActive(true);
    }
    document.body.style.fontFamily = selectedFont;
  }, [selectedFont]);


  const handleColorChange = useCallback((colorValueOrVar: string, isCustom: boolean, hexForCustom?: string) => {
    setSelectedColorVar(isCustom ? '' : colorValueOrVar);
    setIsCustomColorActive(isCustom);
    
    let finalColorToApply: string;
    if (isCustom) {
      finalColorToApply = hexForCustom || customColorHex;
      if (hexForCustom) setCustomColorHex(hexForCustom);
    } else {
      finalColorToApply = getComputedStyle(document.documentElement).getPropertyValue(colorValueOrVar.replace('var(', '').replace(')', '')).trim();
    }
    document.documentElement.style.setProperty('--theme-primary-color', finalColorToApply);
  }, [customColorHex]);
  
  const handleFontChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFont = e.target.value;
    setSelectedFont(newFont);
    document.body.style.fontFamily = newFont;
  }, []);

  const handleSaveSettings = useCallback(() => {
    let effectivePrimaryColor = '';
    if (isCustomColorActive) {
        effectivePrimaryColor = customColorHex;
    } else if (selectedColorVar) {
        effectivePrimaryColor = getComputedStyle(document.documentElement).getPropertyValue(selectedColorVar.replace('var(', '').replace(')', '')).trim();
    }
    console.log("Settings Saved:", {
        storeName, contactNumber, address, bizRegNum,
        selectedColor: effectivePrimaryColor,
        selectedFont, selectedReceipt,
        enableSalesTax, taxRate, taxId
    });
    // Add toast message for success
  }, [storeName, contactNumber, address, bizRegNum, isCustomColorActive, customColorHex, selectedColorVar, selectedFont, selectedReceipt, enableSalesTax, taxRate, taxId]);
  
  const memoizedThemeColorOptions = useMemo(() => themeColorOptions, []);
  const memoizedFontOptions = useMemo(() => fontOptions, []);
  const memoizedReceiptTemplates = useMemo(() => receiptTemplates, []);
  const memoizedIntegrations = useMemo(() => initialIntegrations, []);


  return (
    <div className="space-y-8 pb-8">
      <PageHeader 
        title={translate('settings_title')}
        subtitle={translate('settings_subtitle')}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <SettingsCard title="Store Details" className="border border-[var(--theme-border-color)]">
            <div className="space-y-5">
              <KioskInput label="Store Name" id="storeName" value={storeName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStoreName(e.target.value)} />
              <KioskInput label="Contact Number" id="contactNumber" value={contactNumber} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactNumber(e.target.value)} />
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-1.5">Address</label>
                <textarea 
                    id="address" value={address} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAddress(e.target.value)} rows={3}
                    className="w-full p-3 kiosk-input bg-[var(--theme-input-bg)] border-[var(--theme-border-color)] rounded-lg shadow-sm focus:ring-2 focus:ring-[var(--theme-focus-ring)] focus:border-[var(--theme-focus-ring)] text-[var(--theme-text-primary)] placeholder-[var(--theme-text-muted)] transition-colors"
                    aria-label="Store Address"
                />
              </div>
              <KioskInput label="Business Registration Number" id="bizRegNum" value={bizRegNum} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBizRegNum(e.target.value)} />
            </div>
          </SettingsCard>
          
          <SettingsCard title="Theme Engine" className="border border-[var(--theme-border-color)]">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2.5">Primary Accent Color</label>
                <div className="flex items-center space-x-3.5 flex-wrap gap-2" role="radiogroup" aria-label="Primary Accent Color">
                  {memoizedThemeColorOptions.map((opt: typeof themeColorOptions[number]) => (
                    <label key={opt.id} htmlFor={opt.id} className="cursor-pointer group" title={opt.name}>
                      <input 
                        type="radio" id={opt.id} name="color" value={opt.value} 
                        checked={selectedColorVar === opt.value && !isCustomColorActive} 
                        onChange={() => handleColorChange(opt.value, false)} 
                        className="sr-only" 
                      />
                      <div style={{ backgroundColor: `var(${opt.value.substring(4, opt.value.length - 1)})` }} className={`w-11 h-11 rounded-full border-2 transition-all duration-150 group-hover:scale-110 ${selectedColorVar === opt.value && !isCustomColorActive ? 'ring-4 ring-offset-2 ring-offset-[var(--theme-panel-bg)] ring-[var(--theme-focus-ring)] border-transparent' : 'border-[var(--theme-border-color)] hover:border-gray-500'} flex items-center justify-center`}>
                        {selectedColorVar === opt.value && !isCustomColorActive && <CheckIcon className="h-6 w-6 text-white" aria-hidden="true"/>}
                      </div>
                    </label>
                  ))}
                  <label htmlFor="custom-color-input" className="cursor-pointer relative group" title="Custom Color">
                     <div style={{ backgroundColor: isCustomColorActive ? customColorHex : 'var(--theme-panel-bg-alt)' }} className={`w-11 h-11 rounded-full border-2 transition-all duration-150 group-hover:scale-110 ${isCustomColorActive ? 'ring-4 ring-offset-2 ring-offset-[var(--theme-panel-bg)] ring-[var(--theme-focus-ring)] border-transparent' : 'border-[var(--theme-border-color)] hover:border-gray-500'} flex items-center justify-center text-xl text-white/80`}>
                       {isCustomColorActive ? <CheckIcon className="h-6 w-6 text-white" aria-hidden="true"/> : <PaintBrushIcon className="h-6 w-6" aria-hidden="true"/>}
                     </div>
                     <input 
                        type="color" id="custom-color-input" value={customColorHex} 
                        onChange={e => handleColorChange(e.target.value, true, e.target.value)}
                        className="absolute opacity-0 w-11 h-11 top-0 left-0 cursor-pointer"
                        aria-label="Custom primary accent color picker"
                      />
                  </label>
                </div>
              </div>
              <SettingsSelect label="Application Font Family" id="fontFamily" options={memoizedFontOptions} value={selectedFont} onChange={handleFontChange} />
              <SettingsSelect label="Receipt Template Style" id="receiptTemplate" options={memoizedReceiptTemplates} value={selectedReceipt} onChange={e => setSelectedReceipt(e.target.value)} />
            </div>
          </SettingsCard>

          <SettingsCard title="Theme System" className="border border-[var(--theme-border-color)]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-[var(--theme-text-primary)]">Current Theme</h4>
                  <p className="text-sm text-[var(--theme-text-secondary)]">{theme.displayName}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--theme-acceleration)] to-[var(--theme-bootcamp)]" />
              </div>
              
              <div className="flex gap-2">
                <KioskButton
                  variant="secondary"
                  onClick={toggleTheme}
                  className="flex-1 text-sm"
                >
                  <SwatchIcon className="h-4 w-4 mr-2" />
                  Quick Toggle
                </KioskButton>
                <KioskButton
                  variant="primary"
                  onClick={() => navigate('/settings/theme')}
                  className="flex-1 text-sm"
                >
                  <PaintBrushIcon className="h-4 w-4 mr-2" />
                  Advanced
                </KioskButton>
              </div>
              
              <div className="text-xs text-[var(--theme-text-muted)]">
                Access the full theme customization panel for advanced options
              </div>
            </div>
          </SettingsCard>
        </div>
        
        <div className="space-y-8">
          <SettingsCard title="Tax Configuration" className="border border-[var(--theme-border-color)]">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <label htmlFor="toggle-tax" className="block text-sm font-medium text-[var(--theme-text-secondary)]">Enable Sales Tax Calculation</label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="toggle" id="toggle-tax" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-[var(--theme-input-bg)] border-2 border-[var(--theme-border-color)] appearance-none cursor-pointer" checked={enableSalesTax} onChange={() => setEnableSalesTax(!enableSalesTax)}/>
                    <label htmlFor="toggle-tax" className="toggle-label block overflow-hidden h-6 rounded-full bg-[var(--theme-panel-bg-alt)] border border-[var(--theme-border-color)] cursor-pointer"></label>
                </div>
              </div>
              <KioskInput label="Default Tax Rate (%)" type="number" id="taxRate" value={String(taxRate)} onChange={e => setTaxRate(Number(e.target.value))} disabled={!enableSalesTax} />
              <KioskInput label="Tax Identification Number (TIN)" placeholder="e.g. MYGST123456789" id="taxId" value={taxId} onChange={e => setTaxId(e.target.value)} disabled={!enableSalesTax} />
            </div>
          </SettingsCard>
          
          <SettingsCard title="ConnectLink Integrations" className="border border-[var(--theme-border-color)]">
            <div className="space-y-4">
              {memoizedIntegrations.map((integration: Integration) => (
                <div key={integration.name} className={`p-3.5 border border-[var(--theme-border-color)] rounded-lg hover:border-[var(--theme-focus-ring)] transition-all duration-150 ${integration.status !== 'Connected' ? 'bg-[var(--theme-panel-bg-alt)] opacity-80' : 'bg-[var(--theme-panel-bg-alt)]'} transform hover:scale-[1.02]`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg ${integration.bgColorClass} ${integration.textColorClass} flex items-center justify-center text-2xl shadow-inner`}>
                      {integrationIcons[integration.iconKey || 'gemini']}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-md text-[var(--theme-text-primary)]">{integration.name}</h4>
                      <p className={`text-xs font-medium ${integration.status === 'Connected' ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'}`}>{integration.status}</p>
                    </div>
                    <KioskButton variant="ghost" size="sm" className="!p-2 !rounded-md !shadow-none" aria-label={`Configure ${integration.name}`}>
                       {integration.status === 'Connected' ? <AdjustmentsHorizontalIcon className="h-5 w-5 text-[var(--theme-text-muted)]" /> : <LinkIcon className="h-5 w-5 text-[var(--theme-text-muted)]" />}
                    </KioskButton>
                  </div>
                </div>
              ))}
            </div>
          </SettingsCard>
        </div>
      </div>
      <div className="mt-10 flex justify-end">
        <KioskButton size="lg" onClick={handleSaveSettings}>Save All Settings</KioskButton>
      </div>
    </div>
  );
};

export default React.memo(SettingsPage);
