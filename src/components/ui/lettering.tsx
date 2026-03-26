import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils/cn.util';

const Title = ({ children, className, ...props }: ComponentProps<'div'>) => (
  <div data-slot="title" className={cn('font-medium tracking-wide md:text-lg', className)} {...props}>
    {children}
  </div>
);

const Subtitle = ({ children, className, ...props }: ComponentProps<'div'>) => (
  <div data-slot="subtitle" className={cn('font-mono text-muted-foreground text-sm leading-none md:text-md', className)} {...props}>
    {children}
  </div>
);

const Content = ({ children, className, ...props }: ComponentProps<'div'>) => (
  <div data-slot="content" className={cn('font-mono text-muted-foreground leading-none', className)} {...props}>
    {children}
  </div>
);

const PlainText = ({ children, className, ...props }: ComponentProps<'div'>) => (
  <div data-slot="text" className={cn('font-mono text-md dark:text-stone-200', className)} {...props}>
    {children}
  </div>
);

const BigNumbers = ({ children, className, ...props }: ComponentProps<'div'>) => (
  <div data-slot="big-numbers" className={cn('truncate font-semibold text-lg tabular-nums tracking-tight md:text-xl', className)} {...props}>
    {children}
  </div>
);

const LiItem = ({ children, className, ...props }: ComponentProps<'li'>) => (
  <li data-slot="li-item" className={cn('flex items-center gap-2', className)} {...props}>
    <Content>{children}</Content>
  </li>
);

export { BigNumbers, Content, LiItem, PlainText, Subtitle, Title };
