import React from 'react';

interface SettingsIconProps {
  icon: React.ReactElement;
  size?: number;
  className?: string;
  ariaLabel?: string;
}

const SettingsIcon: React.FC<SettingsIconProps> = ({ icon, size = 24, className = '', ariaLabel }) =>
  React.cloneElement(icon, {
    className: `${icon.props.className || ''} ${className}`,
    width: size,
    height: size,
    'aria-label': ariaLabel,
    focusable: false,
    'aria-hidden': ariaLabel ? undefined : true,
  });

export default React.memo(SettingsIcon);
