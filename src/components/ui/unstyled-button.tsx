import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { cn } from '@/lib/utils';

const UnstyledButton = React.forwardRef<HTMLButtonElement, UnstyledButtonProps>(({ className, asChild = false, type = 'button', ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp type={asChild ? undefined : type} ref={ref} className={cn('cursor-pointer text-left', className)} {...props} />;
});

UnstyledButton.displayName = 'UnstyledButton';

export { UnstyledButton };

export interface UnstyledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}
