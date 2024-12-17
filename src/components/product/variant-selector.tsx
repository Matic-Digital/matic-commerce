'use client';

import { cn } from '@/lib/utils';

import { useProduct, useUpdateURL } from '@/providers/product-provider';

import { Button } from '@/components/ui/button';

import { COLOR_MAP , VariantSwatch } from '@/components/product/variant-swatch';

import type { ProductOption, ProductVariant } from '@/types/shopify-types';



type Combination = {
  id: string;
  availableForSale: boolean;
  color: string;
  [key: string]: string | boolean;
};

export function VariantSelector({
  options,
  variants
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const { state, updateOption } = useProduct();
  const updateURL = useUpdateURL();
  const hasNoOptionsOrJustOneOption =
    !options.length || (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({ ...accumulator, [option.name.toLowerCase()]: option.value }),
      {}
    ),
    id: variant.id,
    availableForSale: variant.availableForSale,
    color: variant.title
  }));

  const isColorOption = (color: string | undefined) => {
    return color ? COLOR_MAP[color as keyof typeof COLOR_MAP] : undefined;
  };

  return options.map((option) => {
    const swatches: React.ReactNode[] = [];
    const buttons: React.ReactNode[] = [];

    option.values.forEach((value) => {
      const optionNameLowerCase = option.name.toLowerCase();

      // Base option params on current selectedOptions so we can preserve any other param state.
      const optionParams = { ...state, [optionNameLowerCase]: value };

      // Filter out invalid options and check if the option combination is available for sale.
      const filtered = Object.entries(optionParams).filter(([key, value]) =>
        options.find((option) => option.name.toLowerCase() === key && option.values.includes(value))
      );
      const isAvailableForSale = combinations.find((combination) =>
        filtered.every(([key, value]) => combination[key] === value && combination.availableForSale)
      );

      const variant = combinations.find((combination) =>
        filtered.every(([key, value]) => combination[key] === value)
      );
      const variantColor = variant?.color?.toLowerCase();

      // The option is active if it's in the selected options.
      const isActive = state[optionNameLowerCase] === value;

      const handleOptionChange = () => {
        const newState = updateOption(optionNameLowerCase, value);
        updateURL(newState);
      };

      if (isColorOption(variantColor)) {
        swatches.push(
          <VariantSwatch
            key={value}
            value={value}
            isActive={isActive}
            isAvailableForSale={!!isAvailableForSale}
            optionName={option.name}
            onClickAction={handleOptionChange}
          />
        );
      } else {
        buttons.push(
          <Button
            key={value}
            formAction={handleOptionChange}
            aria-disabled={!isAvailableForSale}
            disabled={!isAvailableForSale}
            title={`${option.name} ${value}${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
            variant="outline"
            className={cn({
              'cursor-default bg-blue-600 text-background hover:bg-blue-600 hover:text-background dark:bg-primary dark:text-foreground':
                isActive,
              'transition duration-100 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-800':
                !isActive && isAvailableForSale,
              'relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform hover:bg-neutral-100 hover:text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700 dark:hover:bg-neutral-900 dark:hover:text-neutral-400':
                !isAvailableForSale
            })}
          >
            {value}
          </Button>
        );
      }
    });

    return (
      <form key={option.id}>
        <dl className="mb-8">
          <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
          <dd className="flex flex-col gap-4">
            {swatches.length > 0 && <div className="flex flex-wrap gap-3">{swatches}</div>}
            {buttons.length > 0 && <div className="flex flex-wrap gap-3">{buttons}</div>}
          </dd>
        </dl>
      </form>
    );
  });
}
