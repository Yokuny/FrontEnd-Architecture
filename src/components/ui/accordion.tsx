import * as AccordionPrimitive from '@radix-ui/react-accordion';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import IconDown from '../icons/Down.Icon';

const Accordion = AccordionPrimitive.Root;

function AccordionItem({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={cn('', className)} {...props} />;
}

function AccordionTrigger({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex w-96 max-w-full">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn('flex flex-1 cursor-pointer items-center justify-between py-1 transition-all hover:underline [&[data-state=open]>svg]:rotate-180', className)}
        {...props}
      >
        {children}
        <IconDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-300" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn('pt-0 pb-4', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
