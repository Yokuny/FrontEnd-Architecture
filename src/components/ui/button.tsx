import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { cn } from '@/lib/utils/cn.util';

const btnVars = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-300',
  {
    variants: {
      variant: {
        default: 'relative inset-shadow-2xs inset-shadow-background flex border border-border bg-muted shadow-blue-950/10 ring-0 duration-150 hover:bg-background',
        primary:
          'border border-slate-200 text-slate-950 placeholder:text-black hover:bg-slate-100 hover:text-black data-[state=on]:border-transparent data-[state=on]:bg-primary-blue data-[state=on]:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white dark:placeholder:text-white',
        secondary: 'font-semibold',
        basic: 'border border-slate-100 bg-muted hover:bg-slate-100 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900',
        outline: 'border bg-background font-normal hover:bg-muted dark:hover:bg-muted',
        gradient: 'bg-linear-to-r from-sky-blue to-primary-blue font-medium text-white hover:saturate-150 dark:from-dark-blue dark:to-blue-800',
        input:
          'flex w-full items-center justify-between gap-2 whitespace-nowrap rounded-sm border border-input bg-transparent px-3 py-2 text-foreground outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[placeholder]:text-muted-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:hover:bg-input/50 dark:placeholder:text-slate-300',

        destructive: 'bg-red-500 text-white hover:bg-red-600',
        success: 'bg-green-500 text-white hover:bg-green-600',
        info: 'bg-blue-500 text-white hover:bg-blue-600',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600',

        blank: 'p-0!',
        link: 'text-slate-800 underline-offset-4 hover:bg-slate-100 hover:underline dark:text-slate-200 dark:hover:bg-slate-900',
        glassy: 'border border-border bg-background/70 text-slate-950 backdrop-blur-xs hover:bg-background dark:text-white',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-10 rounded-md px-3 md:h-9',
        lg: 'h-11 rounded-md px-8',
        icon: 'size-10',
        link: 'h-8 px-4',
        'link-sm': 'h-5 leading-0',
        'icon-sm': 'size-8',
        'icon-md': 'h-9 w-8 md:h-10 md:w-10',
        'icon-lg': 'size-12',
        input: 'h-10 w-full min-w-50 data-[size=sm]:h-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof btnVars> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return <Comp data-slot="button" className={cn(btnVars({ variant, size, className }))} {...props} />;
}

export { btnVars, Button };
