import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import type { VariantProps } from 'class-variance-authority';
import { type ComponentProps, createContext, useContext } from 'react';
import { cn } from '@/lib/utils/cn.util';
import { toggleVariants } from './toggle';

const ToggleGroupContext = createContext<VariantProps<typeof toggleVariants>>({
  size: 'default',
  variant: 'default',
});

function ToggleGroup({ className, variant, size, children, ...props }: ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>) {
  const groupVariant = variant || 'default';
  const groupSize = size || 'default';

  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={groupVariant}
      data-size={groupSize}
      className={cn(
        'group/toggle-group flex w-fit items-center rounded-md has-[>[data-slot=toggle-group-item][data-variant=default]]:ring-1 has-[>[data-slot=toggle-group-item][data-variant=default]]:ring-zinc-300 dark:has-[>[data-slot=toggle-group-item][data-variant=default]]:ring-input [&>[data-slot=toggle-group-item][data-variant=default]]:ring-0',
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({ className, children, variant, size, ...props }: ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>) {
  const context = useContext(ToggleGroupContext);
  const itemVariant = context.variant || variant || 'default';
  const itemSize = context.size || size || 'default';

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={itemVariant}
      data-size={itemSize}
      className={cn(
        toggleVariants({
          variant: itemVariant,
          size: itemSize,
        }),
        'min-w-0 flex-1 shrink-0 truncate rounded-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l',
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
