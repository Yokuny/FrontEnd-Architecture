import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckIcon } from 'lucide-react';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const checkboxVariants = cva(
  [
    'peer size-4 shrink-0 rounded-[4px]',
    'border border-input shadow-xs cursor-pointer',
    'bg-background text-foreground',
    'dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
    'hover:bg-accent',

    'transition-all outline-none',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  ],
  {
    variants: {
      variant: {
        default: 'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary',
        blue: 'data-[state=checked]:bg-blue-600 data-[state=checked]:text-white data-[state=checked]:border-blue-600',
        green: 'data-[state=checked]:bg-green-600 data-[state=checked]:text-white data-[state=checked]:border-green-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Checkbox({ className, variant, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root> & VariantProps<typeof checkboxVariants>) {
  return (
    <CheckboxPrimitive.Root data-slot="checkbox" className={cn(checkboxVariants({ variant, className }))} {...props}>
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="grid place-content-center text-current transition-none">
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox, checkboxVariants };
