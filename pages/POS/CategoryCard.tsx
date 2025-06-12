
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { CategoryStyle } from '../../constants/categoryStyles';

interface CategoryCardProps {
  categoryStyle: CategoryStyle;
  isSelected: boolean;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ categoryStyle, isSelected, onClick }) => {
  const { translate } = useLanguage();
  const { icon, bgColor, translationKey, itemCount } = categoryStyle;

  const translatedName = translate(translationKey);
  
  const textColorClass = bgColor === 'var(--theme-panel-bg-alt)' ? 'text-[var(--theme-text-primary)]' : 'text-[var(--theme-text-on-pastel)]';

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out flex flex-col items-center justify-between text-center aspect-square
                  ${isSelected && bgColor !== 'var(--theme-panel-bg-alt)' ? 'ring-4 ring-offset-2 ring-offset-[var(--theme-panel-bg)] ring-[var(--theme-primary-color)]' : ''}
                  ${isSelected && bgColor === 'var(--theme-panel-bg-alt)' ? 'ring-2 ring-[var(--theme-primary-color)]' : 'border border-transparent'}
                  ${textColorClass}
                  transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--theme-focus-ring)] focus:ring-opacity-70`}
      style={{ backgroundColor: bgColor }}
      aria-pressed={isSelected}
      aria-label={`${translate(translationKey)}${itemCount !== undefined ? ` (${itemCount} ${translate('items_count_suffix', {count: itemCount}) || 'items'})` : ''}`}
    >
      <div className={`mb-2 ${textColorClass} opacity-80`}>
        {React.cloneElement(icon, { className: `${icon.props.className || 'h-8 w-8'} ${textColorClass}` })}
      </div>
      <div className="flex-grow flex flex-col justify-center">
        <h4 className={`text-sm font-semibold leading-tight ${textColorClass}`}>{translatedName}</h4>
        {itemCount !== undefined && (
          <p className={`text-xs mt-0.5 ${textColorClass} opacity-70`}>{itemCount} {translate('items_count_suffix', {count: itemCount}) || 'items'}</p>
        )}
      </div>
    </button>
  );
};

export default React.memo(CategoryCard);
