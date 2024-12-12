'use client';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

interface VariantSwatchProps {
  value: string;
  isActive: boolean;
  isAvailableForSale: boolean;
  optionName: string;
  onClickAction: () => void;
}

export const COLOR_MAP: Record<string, string> = {
  black: '#000000',
  white: '#FFFFFF',
  red: '#FF0000',
  blue: '#0000FF',
  green: '#008000',
  yellow: '#FFFF00',
  purple: '#800080',
  pink: '#FFC0CB',
  gray: '#808080',
  brown: '#A52A2A'
  // Add more color mappings as needed
};

export function VariantSwatch({
  value,
  isActive,
  isAvailableForSale,
  optionName,
  onClickAction
}: VariantSwatchProps) {
  const colorValue = COLOR_MAP[value.toLowerCase()] || value;

  return (
    <Button
      formAction={onClickAction}
      disabled={!isAvailableForSale}
      title={`${optionName} ${value}${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
      variant="outline"
      className={cn('h-8 w-8 rounded-full p-0', {
        'cursor-default ring-2 ring-blue-600': isActive,
        'hover:ring-2 hover:ring-blue-600': !isActive && isAvailableForSale,
        'cursor-not-allowed opacity-50': !isAvailableForSale
      })}
    >
      <span
        className={cn('block h-6 w-6 rounded-full border', {
          'border-neutral-300 dark:border-neutral-700': !isActive
        })}
        style={{ backgroundColor: colorValue }}
      />
      <span className="sr-only">{value}</span>
    </Button>
  );
}
