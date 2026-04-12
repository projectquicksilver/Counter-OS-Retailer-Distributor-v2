import React from 'react';

export const Card = ({ children, variant = 'default', className = '', ...props }) => {
  const variantClass = variant === 'default' ? 'card' : `card-${variant}`;
  return (
    <div className={`${variantClass} ${className}`} {...props}>
      {children}
    </div>
  );
};
