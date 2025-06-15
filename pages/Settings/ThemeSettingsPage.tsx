import React from 'react';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useToastStore } from '../../store/toastStore';
import PageHeader from '../../components/common/PageHeader';
import KioskButton from '../../components/common/KioskButton';
import { 
  MoonIcon, 
  SunIcon, 
  SparklesIcon, 
  PaintBrushIcon,
  SwatchIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const ThemeSettingsPage: React.FC = () => {
  const { currentTheme, setTheme, theme, availableThemes, toggleTheme } = useTheme();
  const { showToast } = useToastStore();

  const themeOptions = [
    {
      id: 'cosy-dark' as const,
      name: 'CosyPOS Dark',
      description: 'Professional dark theme inspired by modern POS systems',
      icon: MoonIcon,
      preview: {
        bg: '#0F0F0F',
        panel: '#1A1A1A',
        accent: '#A78BFA',
        text: '#FFFFFF'
      }
    },
    {
      id: 'cosy-light' as const,
      name: 'CosyPOS Light',
      description: 'Clean light theme for bright environments',
      icon: SunIcon,
      preview: {
        bg: '#FFFFFF',
        panel: '#F8FAFC',
        accent: '#6366F1',
        text: '#1F2937'
      }
    },
    {
      id: 'vibrant-dark' as const,
      name: 'Vibrant Dark',
      description: 'High-energy dark theme with vibrant accents',
      icon: SparklesIcon,
      preview: {
        bg: '#0F0F0F',
        panel: '#1A1A1A',
        accent: '#10B981',
        text: '#FFFFFF'
      }
    },
    {
      id: 'vibrant-light' as const,
      name: 'Vibrant Light',
      description: 'Energetic light theme with bold colors',
      icon: PaintBrushIcon,
      preview: {
        bg: '#FAFAFA',
        panel: '#FFFFFF',
        accent: '#10B981',
        text: '#18181B'
      }
    }
  ];

  const handleThemeChange = (themeId: typeof currentTheme) => {
    setTheme(themeId);
    showToast({ title: `Theme changed to ${themeOptions.find(t => t.id === themeId)?.name}`, status: 'success' });
  };

  const ColorPreview: React.FC<{ colors: typeof themeOptions[0]['preview'] }> = ({ colors }) => (
    <div className="w-full h-20 rounded-lg overflow-hidden border border-[var(--theme-border-color)]">
      <div 
        className="w-full h-full flex"
        style={{ backgroundColor: colors.bg }}
      >
        <div 
          className="w-1/3 h-full"
          style={{ backgroundColor: colors.panel }}
        />
        <div className="w-1/3 h-full flex items-center justify-center">
          <div 
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: colors.accent }}
          />
        </div>
        <div className="w-1/3 h-full flex items-center justify-center">
          <div 
            className="w-4 h-1 rounded"
            style={{ backgroundColor: colors.text }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Theme Settings"
        subtitle="Customize the appearance of your POS system"
        actions={
          <div className="flex gap-2">
            <KioskButton
              variant="secondary"
              onClick={toggleTheme}
              className="text-sm"
            >
              <SwatchIcon className="h-4 w-4 mr-2" />
              Quick Toggle
            </KioskButton>
          </div>
        }
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Current Theme Display */}
        <div className="bg-[var(--theme-panel-bg)] rounded-xl p-6 border border-[var(--theme-border-color)]">
          <h2 className="text-xl font-semibold text-[var(--theme-text-primary)] mb-4">
            Current Theme
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[var(--theme-acceleration)] to-[var(--theme-bootcamp)] flex items-center justify-center">
              <EyeIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-lg font-medium text-[var(--theme-text-primary)]">
                {themeOptions.find(t => t.id === currentTheme)?.name}
              </p>
              <p className="text-[var(--theme-text-secondary)]">
                {themeOptions.find(t => t.id === currentTheme)?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Theme Options */}
        <div className="bg-[var(--theme-panel-bg)] rounded-xl p-6 border border-[var(--theme-border-color)]">
          <h2 className="text-xl font-semibold text-[var(--theme-text-primary)] mb-6">
            Available Themes
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {themeOptions.map((option) => {
              const IconComponent = option.icon;
              const isActive = currentTheme === option.id;
              
              return (
                <div
                  key={option.id}
                  className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-lg ${
                    isActive
                      ? 'border-[var(--theme-acceleration)] bg-[var(--theme-acceleration)]/10'
                      : 'border-[var(--theme-border-color)] hover:border-[var(--theme-acceleration)]/50'
                  }`}
                  onClick={() => handleThemeChange(option.id)}
                >
                  {isActive && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[var(--theme-acceleration)] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-[var(--theme-acceleration)]' : 'bg-[var(--theme-panel-bg-alt)]'}`}>
                      <IconComponent className={`h-6 w-6 ${isActive ? 'text-white' : 'text-[var(--theme-text-primary)]'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--theme-text-primary)] mb-1">
                        {option.name}
                      </h3>
                      <p className="text-sm text-[var(--theme-text-secondary)]">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  
                  <ColorPreview colors={option.preview} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Theme Customization Preview */}
        <div className="bg-[var(--theme-panel-bg)] rounded-xl p-6 border border-[var(--theme-border-color)]">
          <h2 className="text-xl font-semibold text-[var(--theme-text-primary)] mb-4">
            Live Preview
          </h2>
          <p className="text-[var(--theme-text-secondary)] mb-6">
            See how your selected theme affects the interface components
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sample Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--theme-text-primary)]">Buttons</label>
              <div className="space-y-2">
                <KioskButton variant="primary" className="w-full">
                  Primary Button
                </KioskButton>
                <KioskButton variant="secondary" className="w-full">
                  Secondary Button
                </KioskButton>
              </div>
            </div>

            {/* Sample Panel */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--theme-text-primary)]">Panels</label>
              <div className="bg-[var(--theme-panel-bg-alt)] p-4 rounded-lg border border-[var(--theme-border-color)]">
                <p className="text-[var(--theme-text-primary)] font-medium mb-1">Sample Panel</p>
                <p className="text-[var(--theme-text-secondary)] text-sm">
                  This shows how panels look in the current theme
                </p>
              </div>
            </div>

            {/* Sample Text */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--theme-text-primary)]">Typography</label>
              <div className="space-y-1">
                <p className="text-[var(--theme-text-primary)] font-semibold">Primary Text</p>
                <p className="text-[var(--theme-text-secondary)]">Secondary Text</p>
                <p className="text-[var(--theme-text-muted)] text-sm">Muted Text</p>
                <p className="text-[var(--theme-acceleration)] font-medium">Accent Text</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-[var(--theme-text-muted)]">
            Changes are applied immediately and saved automatically
          </div>
          
          <div className="flex gap-2">
            <KioskButton
              variant="secondary"
              onClick={() => {
                setTheme('cosy-dark');
                showToast({ title: 'Theme reset to default', status: 'info' });
              }}
              className="text-sm"
            >
              Reset to Default
            </KioskButton>
            
            <KioskButton
              variant="primary"
              onClick={() => showToast({ title: 'Theme settings saved!', status: 'success' })}
              className="text-sm"
            >
              Save Settings
            </KioskButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettingsPage;
