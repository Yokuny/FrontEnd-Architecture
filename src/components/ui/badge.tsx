import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils/cn.util';
import IconDown from '../icons/Down.Icon';
import IconMinus from '../icons/Minus.Icon';
import IconUp from '../icons/Up.Icon';

const badgeVars = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md px-3 py-1.5 font-normal text-xs transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        pending: 'bg-linear-to-r from-yellow-400 to-yellow-500 text-white',
        waiting: 'bg-linear-to-r from-sky-400 to-sky-500 text-white',
        confirmed: 'bg-linear-to-r from-emerald-400 to-emerald-500 text-white',
        completed: 'bg-linear-to-r from-green-400 to-green-500 text-white',
        in_progress: 'bg-linear-to-r from-indigo-400 to-indigo-500 text-white',
        no_show: 'bg-linear-to-r from-red-400 to-red-500 text-white',
        canceled: 'bg-linear-to-r from-slate-400 to-slate-500 text-white',
        canceled_by_patient: 'bg-linear-to-r from-orange-400 to-orange-500 text-white',
        canceled_by_professional: 'bg-linear-to-r from-amber-400 to-amber-500 text-white',

        partial: 'bg-linear-to-r from-lime-400 to-lime-500 text-white',
        paid: 'bg-linear-to-r from-teal-400 to-teal-500 text-white',
        refund: 'bg-linear-to-r from-cyan-400 to-cyan-500 text-white',

        positive: 'bg-linear-to-r from-emerald-400 to-emerald-500 text-white',
        neutral: 'bg-linear-to-r from-sky-400 to-sky-500 text-white',
        negative: 'bg-linear-to-r from-red-400 to-red-500 text-white',
        pink: 'bg-linear-to-r from-pink-400 to-pink-500 text-white',
        alert: 'bg-linear-to-r from-yellow-400 to-yellow-500 text-white',
        outline: 'border border-slate-600 border-solid text-foreground dark:border-slate-400',
        muted: 'border border-solid',
        transparent: 'bg-transparent',
        secondary: '',

        red: 'bg-linear-to-r from-red-400 to-red-500 text-white',
        orange: 'bg-linear-to-r from-orange-400 to-orange-500 text-white',
        amber: 'bg-linear-to-r from-amber-400 to-amber-500 text-white',
        yellow: 'bg-linear-to-r from-yellow-400 to-yellow-500 text-white',
        lime: 'bg-linear-to-r from-lime-400 to-lime-500 text-white',
        green: 'bg-linear-to-r from-green-400 to-green-500 text-white',
        emerald: 'bg-linear-to-r from-emerald-400 to-emerald-500 text-white',
        teal: 'bg-linear-to-r from-teal-400 to-teal-500 text-white',
        cyan: 'bg-linear-to-r from-cyan-400 to-cyan-500 text-white',
        sky: 'bg-linear-to-r from-sky-400 to-sky-500 text-white',
        blue: 'bg-linear-to-r from-blue-400 to-blue-500 text-white',
        indigo: 'bg-linear-to-r from-indigo-400 to-indigo-500 text-white',
        violet: 'bg-linear-to-r from-violet-400 to-violet-500 text-white',
        purple: 'bg-linear-to-r from-purple-400 to-purple-500 text-white',
        fuchsia: 'bg-linear-to-r from-fuchsia-400 to-fuchsia-500 text-white',
        rose: 'bg-linear-to-r from-rose-400 to-rose-500 text-white',
        slate: 'bg-linear-to-r from-slate-400 to-slate-500 text-white',
        stone: 'bg-linear-to-r from-stone-400 to-stone-500 text-white',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);

function Badge({ className, variant, asChild = false, ...props }: ComponentProps<'span'> & VariantProps<typeof badgeVars> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return <Comp data-slot="badge" className={cn(badgeVars({ variant }), className)} {...props} />;
}

export const BadgeIndicator = ({ className, variant = 'pending', pulse = false, asChild = false, children, ...props }: BadgeIndicatorProps) => {
  const Comp = asChild ? Slot : 'span';

  const getIndicatorColor = (status: string) => {
    const statusColorMap = {
      pending: 'bg-yellow-400 dark:bg-yellow-500',
      waiting: 'bg-sky-400 dark:bg-sky-500',
      confirmed: 'bg-emerald-400 dark:bg-emerald-500',
      completed: 'bg-green-400 dark:bg-green-500',
      in_progress: 'bg-indigo-400 dark:bg-indigo-500',
      no_show: 'bg-red-400 dark:bg-red-500',
      canceled: 'bg-slate-400 dark:bg-slate-500',
      canceled_by_patient: 'bg-orange-400 dark:bg-orange-500',
      canceled_by_professional: 'bg-amber-400 dark:bg-amber-500',

      partial: 'bg-lime-600 dark:bg-teal-700',
      paid: 'bg-green-400 dark:bg-green-500',
      refund: 'bg-purple-800 dark:bg-purple-500',
    };

    return statusColorMap[status as keyof typeof statusColorMap] || 'bg-gray-400 dark:bg-gray-500';
  };

  const Indicator = ({ status = 'pending', pulse = false, className }: { status?: string; pulse?: boolean; className?: string }) => {
    const colors = getIndicatorColor(status);

    return (
      <span className={cn('relative flex size-2', className)}>
        {pulse && <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', colors)} />}
        <span className={cn('relative inline-flex size-2 rounded-full', colors)} />
      </span>
    );
  };

  if (!children) {
    return <Indicator status={variant} pulse={pulse} className={className} {...props} />;
  }

  return (
    <Comp data-slot="badge" className={cn(badgeVars({ variant: 'muted' }), className)} {...props}>
      <Indicator status={variant} pulse={pulse} />
      {children}
    </Comp>
  );
};

export const BadgeWithDelta = ({ className, delta, asChild = false, children, ...props }: BadgeWithDeltaProps) => {
  const Comp = asChild ? Slot : 'span';

  const BadgeDelta = ({ delta, className }: { delta: number; className?: string }) => {
    if (!delta) return <IconMinus className={cn('size-3 stroke-2 text-sky-blue', className)} />;
    if (delta > 0) return <IconUp className={cn('size-3 stroke-2 text-emerald-500', className)} />;
    return <IconDown className={cn('size-3 stroke-2 text-rose-500', className)} />;
  };

  return (
    <Comp data-slot="badge" className={cn(badgeVars({ variant: 'muted' }), className)} {...props}>
      <BadgeDelta delta={delta} />
      {children}
    </Comp>
  );
};

export { Badge, badgeVars };

type ScheduleStatus = 'pending' | 'waiting' | 'confirmed' | 'completed' | 'in_progress' | 'no_show' | 'canceled' | 'canceled_by_patient' | 'canceled_by_professional';
type FinancialStatus = 'pending' | 'partial' | 'paid' | 'refund' | 'canceled';
type SystemStatus = ScheduleStatus | FinancialStatus;

export type BadgeIndicatorProps = ComponentProps<'span'> & {
  variant?: SystemStatus;
  pulse?: boolean;
  asChild?: boolean;
  children?: React.ReactNode;
};

export type BadgeWithDeltaProps = ComponentProps<'span'> &
  VariantProps<typeof badgeVars> & {
    delta: number;
    asChild?: boolean;
    children: React.ReactNode;
  };
