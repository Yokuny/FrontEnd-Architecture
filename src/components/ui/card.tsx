import { useRouter } from '@tanstack/react-router';
import { MoveLeft } from 'lucide-react';
import type * as React from 'react';
import { AutoBreadcrumbs } from '@/components/auto-breadcrumbs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card" className={cn('bg-sidebar text-card-foreground flex flex-col gap-6 rounded-lg md:border border-sidebar-border shadow-sm py-6', className)} {...props} />
  );
}

interface CardHeaderProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title?: React.ReactNode;
}

function CardHeader({ className, children, title, ...props }: CardHeaderProps) {
  const router = useRouter();

  return (
    <div data-slot="card-header" className={cn('@container/card-header flex flex-col gap-4 px-6 [.border-b]:pb-6', className)} {...props}>
      <AutoBreadcrumbs />

      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="shrink-0 rounded-lg h-9 w-11" onClick={() => router.history.back()}>
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
  return <div data-slot="card-title" className={cn('text-2xl font-bold leading-none', className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-description" className={cn('text-muted-foreground text-sm', className)} {...props} />;
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-action" className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('p-6 space-y-6', className)} {...props} />;
}

function CardHeaderActions({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-header-actions" className={cn('flex items-center gap-2', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-footer" className={cn('flex items-center justify-end p-6 gap-2', className)} {...props} />;
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardAction, CardContent, CardHeaderActions };
