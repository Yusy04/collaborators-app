import type { Tier } from '../types';
import { tierConfig } from '../constants';

interface TierBadgeProps {
  tier: Tier;
  size?: 'sm' | 'md';
}

export const TierBadge = ({ tier, size = 'sm' }: TierBadgeProps) => {
  const config = tierConfig[tier];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.bgColor} ${config.color} ${sizeClasses}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};
