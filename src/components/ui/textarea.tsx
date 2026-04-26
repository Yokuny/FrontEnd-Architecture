import { cva, type VariantProps } from 'class-variance-authority';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn.util';

const textareaVariants = cva(
  'field-sizing-content flex min-h-16 w-full rounded-md px-4 py-2 font-medium font-mono text-sm outline-none transition-all selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
  {
    variants: {
      variant: {
        default: 'border-input/50 border-b-2 bg-background ring-1 ring-zinc-300 hover:bg-secondary dark:border-input dark:ring-input',
        primary:
          'relative inset-shadow-sm inset-shadow-white border bg-secondary ring-0 duration-150 hover:bg-background dark:inset-shadow-black dark:border-border dark:bg-muted/25 dark:hover:bg-muted/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Textarea({ className, variant = 'default', ...props }: TextareaProps) {
  return <textarea data-slot="textarea" data-variant={variant} className={cn(textareaVariants({ variant, className }))} {...props} />;
}

export { Textarea };

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & VariantProps<typeof textareaVariants>;
export type { TextareaProps };
