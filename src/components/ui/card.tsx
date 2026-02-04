import { useRouter } from '@tanstack/react-router';
import { MoveLeft } from 'lucide-react';
import type * as React from 'react';
import { AutoBreadcrumbs } from '@/components/auto-breadcrumbs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card" className={cn('flex min-w-0 flex-col gap-6 rounded-lg border-sidebar-border bg-background py-6 text-card-foreground md:border', className)} {...props} />
  );
}

function CardHeader({ children, title, ...props }: { children?: React.ReactNode; title?: React.ReactNode }) {
  const router = useRouter();

  return (
    <div data-slot="card-header" className={'@container/card-header flex flex-col gap-4 px-6 [.border-b]:pb-6'} {...props}>
      <AutoBreadcrumbs />

      <div className="flex w-full items-start justify-between">
        <div className="flex items-center gap-4">
          <Button type="button" variant="outline" size="icon" className="h-9 w-11 shrink-0 rounded-lg" onClick={() => router.history.back()}>
            <MoveLeft className="size-4" />
          </Button>
          <div className="flex flex-col gap-1">{title && <CardTitle>{title}</CardTitle>}</div>
        </div>

        {children}
      </div>
    </div>
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-title" className={cn('font-bold font-mono text-2xl leading-none', className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-description" className={cn('text-muted-foreground text-sm', className)} {...props} />;
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-action" className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('min-w-0 space-y-6 p-6', className)} {...props} />;
}

function CardHeaderActions({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-header-actions" className={cn('flex items-center gap-2', className)} {...props} />;
}

interface CardFooterProps extends React.ComponentProps<'div'> {
  layout?: 'simple' | 'multi';
}

function CardFooter({ className, layout = 'simple', ...props }: CardFooterProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex gap-4 p-6', layout === 'simple' && 'items-center justify-end', layout === 'multi' && 'flex-col items-center justify-between sm:flex-row', className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardAction, CardContent, CardHeaderActions };
