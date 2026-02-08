import { useLayoutEffect, useRef } from 'react';
import { Item } from '@/components/ui/item';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function ChatMessage({ children, className, ...props }: React.ComponentProps<typeof Item>) {
  return (
    <Item className={cn('flex items-stretch gap-3 border-none p-0', className)} {...props}>
      {children}
    </Item>
  );
}

export function ChatContent({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('wrap-break-word whitespace-normal rounded-lg bg-secondary p-2 px-4 font-sans text-foreground', className)} {...props}>
      {children}
    </div>
  );
}

export function ChatInput({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('cursor-text rounded-3xl border border-input bg-background p-2', className)} {...props}>
      {children}
    </div>
  );
}

export function ChatInputTextarea({ value, onChange, ...props }: React.ComponentProps<typeof Textarea>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
    }
  }, []);

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      className={cn('min-h-[44px] w-full resize-none border-none bg-transparent text-primary outline-none focus-visible:ring-0 focus-visible:ring-offset-0')}
      rows={1}
      {...props}
    />
  );
}

export function ChatInputAction({ tooltip, children, side = 'top' }: { tooltip: React.ReactNode; children: React.ReactNode; side?: 'top' | 'bottom' | 'left' | 'right' }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
