import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-sm px-2 font-medium font-mono text-xs transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        outline: 'border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        // Semantic status variants
        success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        error: 'bg-red-500/10 text-red-600 dark:text-red-400',
        canceled: 'bg-red-500/10 text-red-600 dark:text-red-400',
        info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        neutral: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({ className, variant, asChild = false, ...props }: ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

// Status Components - combines Badge with animated indicator
export type StatusVariant = 'success' | 'active' | 'warning' | 'pending' | 'error' | 'canceled' | 'info' | 'neutral';

export type StatusProps = ComponentProps<typeof Badge> & {
  status: StatusVariant;
};

const statusIndicatorColors: Record<StatusVariant, string> = {
  success: 'bg-emerald-500',
  active: 'bg-emerald-500',
  warning: 'bg-amber-500',
  pending: 'bg-amber-500',
  error: 'bg-red-500',
  canceled: 'bg-red-500',
  info: 'bg-blue-500',
  neutral: 'bg-blue-500',
};

const Status = ({ className, status, ...props }: StatusProps) => <Badge className={cn('group flex items-center gap-2', status, className)} variant={status} {...props} />;

export type StatusIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  status?: StatusVariant;
};

const StatusIndicator = ({ className, status, ...props }: StatusIndicatorProps) => {
  const colorClass = status ? statusIndicatorColors[status] : '';

  return (
    <span className="relative flex size-2" {...props}>
      <span
        className={cn(
          'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
          colorClass,
          'group-[.active]:bg-emerald-500 group-[.success]:bg-emerald-500',
          'group-[.pending]:bg-amber-500 group-[.warning]:bg-amber-500',
          'group-[.canceled]:bg-red-500 group-[.error]:bg-red-500',
          'group-[.info]:bg-blue-500 group-[.neutral]:bg-blue-500',
        )}
      />
      <span
        className={cn(
          'relative inline-flex size-2 rounded-full',
          colorClass,
          'group-[.active]:bg-emerald-500 group-[.success]:bg-emerald-500',
          'group-[.pending]:bg-amber-500 group-[.warning]:bg-amber-500',
          'group-[.canceled]:bg-red-500 group-[.error]:bg-red-500',
          'group-[.info]:bg-blue-500 group-[.neutral]:bg-blue-500',
        )}
      />
    </span>
  );
};

export type StatusLabelProps = HTMLAttributes<HTMLSpanElement>;

const StatusLabel = ({ className, children, ...props }: StatusLabelProps) => (
  <span className={cn('text-current', className)} {...props}>
    {children}
  </span>
);

export { Badge, badgeVariants, Status, StatusIndicator, StatusLabel };
