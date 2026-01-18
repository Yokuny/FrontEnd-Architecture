import type * as React from 'react';

import { cn } from '@/lib/utils';

function Input({
  className,
  type,
  size = 'default',
  ...props
}: Omit<React.ComponentProps<'input'>, 'size'> & {
  size?: 'sm' | 'default';
}) {
  return (
    <input
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(
        'w-full min-w-0 rounded-md px-4 py-2',
        'text-sm font-medium',
        'bg-background text-foreground border border-input shadow-xs',
        'dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
        'hover:bg-accent hover:text-accent-foreground',

        'transition-all outline-none',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',

        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
        'data-[size=default]:h-11 data-[size=sm]:h-8 data-[size=sm]:px-2',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
