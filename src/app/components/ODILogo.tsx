import React from 'react';
import Asset21 from '../../imports/Asset21';

interface ODILogoProps {
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}

export function ODILogo({ className = '', style, color = 'currentColor' }: ODILogoProps) {
  return (
    <div 
      className={className} 
      style={{ 
        ...style,
        '--fill-0': color,
        position: 'relative',
        width: '100%',
        height: 'auto',
        aspectRatio: '453.32 / 194.48'
      } as React.CSSProperties}
    >
      <Asset21 />
    </div>
  );
}