import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils/cn.util';

const buttonGroupVariants = cva(
  "flex w-fit items-stretch rounded-md has-[>[data-slot=button-group]]:gap-2 has-[>[data-slot=button][data-variant=default]]:ring-1 has-[>[data-slot=button][data-variant=default]]:ring-zinc-300 dark:has-[>[data-slot=button][data-variant=default]]:ring-input [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 [&>[data-slot=button][data-variant=default]]:ring-0 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none [&>[data-slot=button][data-variant=default]:not(:first-child)]:border-l-0 [&>[data-slot=button][data-variant=default]:not(:last-child)]:border-r-0',
        vertical:
          'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none [&>[data-slot=button][data-variant=default]:not(:first-child)]:border-t-0 [&>[data-slot=button][data-variant=default]:not(:last-child)]:border-b-0',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  },
);

function ButtonGroup({ className, orientation, ...props }: ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>) {
  return <div data-slot="button-group" data-orientation={orientation} className={cn(buttonGroupVariants({ orientation }), className)} {...props} />;
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: ComponentProps<'div'> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      className={cn("flex items-center gap-2 rounded-md border bg-muted px-4 font-medium text-sm [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none", className)}
      {...props}
    />
  );
}

function ButtonGroupSeparator({ className, orientation = 'vertical', ...props }: ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn('relative m-0! self-stretch bg-input data-[orientation=vertical]:h-auto', className)}
      {...props}
    />
  );
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants };
