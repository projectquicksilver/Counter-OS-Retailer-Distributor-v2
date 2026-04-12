import React from 'react';

export const Chip = ({ children, variant = 'dim', className = '', ...props }) => {
  const variantClass = variant ? `chip-${variant}` : '';
  return (
    <div className={`chip ${variantClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const TierBadge = ({ tier = 'bronze' }) => {
  const tierConfig = {
    bronze: { label: 'Bronze', emoji: '🥉' },
    silver: { label: 'Silver', emoji: '🥈' },
    gold: { label: 'Gold', emoji: '🥇' },
    diamond: { label: 'Diamond', emoji: '💎' },
  };
  const config = tierConfig[tier] || tierConfig.bronze;
  return (
    <div className={`tier tier-${tier}`}>
      {config.emoji} {config.label} Tier
    </div>
  );
};
