import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className={cn('relative w-full overflow-auto', className)}>
      <table data-slot="table" className={cn('w-full caption-bottom text-sm')} {...props} />
    </div>
  );
}

function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead data-slot="table-header" className={cn('[&_tr]:border-b', className)} {...props} />;
}

function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody data-slot="table-body" className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr data-slot="table-row" className={cn('border-accent border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)} {...props} />;
}

function TableHead({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      data-slot="table-head"
      className={cn('p-2 text-left align-middle font-medium text-muted-foreground md:px-6', '[&:has([role=checkbox])]:pr-0', '[&>[role=checkbox]]:translate-y-[2px]', className)}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td data-slot="table-cell" className={cn('p-2 align-middle md:px-6 md:py-3', '[&:has([role=checkbox])]:pr-0', '[&>[role=checkbox]]:translate-y-[2px]', className)} {...props} />
  );
}

function TableCaption({ className, ...props }: HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption data-slot="table-caption" className={cn('mt-4 text-muted-foreground text-sm', className)} {...props} />;
}

export { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow };
