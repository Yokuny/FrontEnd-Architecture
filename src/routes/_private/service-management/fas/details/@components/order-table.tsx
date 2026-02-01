'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { BrushCleaning, ChevronLeft, ChevronRight, Edit, Eye, MoreVertical, Search, Shuffle, Star, Users } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Item, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { FasDetailsOrder } from '@/hooks/use-fas-api';
import { cn } from '@/lib/utils';
import { FasStatusBadge } from '../../@components/fas-status-badge';
import { FasStatusSelect } from '../../@components/fas-status-select';
import { canEditOS, canEditRating, canEditRecSupplier, canTransferService, getSupplierDisplay } from '../../@utils/fas.utils';

export function OrdersTable({ orders, fasType, permissions, editMode = false, onViewOrder, onEditOrder, onTransferOrder, onEditRecSupplier, onEditRating }: FasOrdersTableProps) {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  // Filter orders by status
  const filteredByStatus = useMemo(() => {
    if (statusFilter.length === 0) return orders;
    return orders.filter((order) => statusFilter.includes(order.state));
  }, [orders, statusFilter]);

  const hasFilters = !!(globalFilter || statusFilter.length > 0);

  const handleClearFilters = () => {
    setGlobalFilter('');
    setStatusFilter([]);
  };

  // Get actions for each order - memoized with useCallback
  const getOrderActions = useCallback(
    (order: FasDetailsOrder) => {
      const actions: Array<{ icon: typeof Eye; label: string; onClick: () => void; variant?: 'destructive' }> = [
        {
          icon: Eye,
          label: t('view'),
          onClick: () => onViewOrder(order.id),
        },
      ];

      if (canEditOS({ type: fasType }, order, permissions) && onEditOrder) {
        actions.push({
          icon: Edit,
          label: t('edit'),
          onClick: () => onEditOrder(order.id),
        });
      }

      if (canTransferService({ type: fasType }, order, permissions) && onTransferOrder) {
        actions.push({
          icon: Shuffle,
          label: t('transfer.service'),
          onClick: () => onTransferOrder(order.id),
        });
      }

      if (canEditRecSupplier(order, permissions) && onEditRecSupplier) {
        actions.push({
          icon: Users,
          label: t('edit.recommended.supplier'),
          onClick: () => onEditRecSupplier(order.id),
        });
      }

      if (canEditRating(order) && onEditRating) {
        actions.push({
          icon: Star,
          label: t('edit.rating'),
          onClick: () => onEditRating(order.id),
        });
      }

      return actions;
    },
    [t, fasType, permissions, onViewOrder, onEditOrder, onTransferOrder, onEditRecSupplier, onEditRating],
  );

  const columns: ColumnDef<FasDetailsOrder>[] = useMemo(
    () => [
      {
        accessorKey: 'index',
        header: () => <div className="text-center">N°</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue('index')}</div>,
        size: 50,
      },
      {
        accessorKey: 'job',
        header: () => <div className="text-center">JOB</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue('job') || '-'}</div>,
      },
      {
        accessorKey: 'name',
        header: () => <div className="text-center">{t('os')}</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <ItemTitle>{row.getValue('name')}</ItemTitle>
          </div>
        ),
      },
      {
        accessorKey: 'description',
        header: t('description'),
        cell: ({ row }) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <ItemDescription className="line-clamp-2 max-w-xs">{row.getValue('description') || '-'}</ItemDescription>
            </TooltipTrigger>
            <TooltipContent className="max-w-md">{row.getValue('description')}</TooltipContent>
          </Tooltip>
        ),
      },
      {
        accessorKey: 'materialFas',
        header: () => <div className="text-center">{t('materialFas.label')}</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue('materialFas') || '-'}</div>,
      },
      {
        accessorKey: 'onboardMaterial',
        header: () => <div className="text-center">{t('onboardMaterialFas.label')}</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue('onboardMaterial') || '-'}</div>,
      },
      {
        accessorKey: 'rmrb',
        header: () => <div className="text-center">{t('rmrbFas.label')}</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue('rmrb') || '-'}</div>,
      },
      {
        id: 'supplier',
        header: t('supplier'),
        cell: ({ row }) => {
          const order = row.original;
          return <ItemDescription className={cn(!order.supplierData?.razao && 'text-muted-foreground/60 italic')}>{getSupplierDisplay(order)}</ItemDescription>;
        },
      },
      {
        accessorKey: 'state',
        header: () => <div className="text-center">{t('status')}</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <FasStatusBadge status={row.getValue('state')} />
          </div>
        ),
      },
      {
        id: 'actions',
        header: () => <div className="text-center">{t('actions')}</div>,
        cell: ({ row }) => {
          const order = row.original;
          const actions = getOrderActions(order);

          if (editMode) return null;

          return (
            <div className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actions.map((action, index) => (
                    <DropdownMenuItem key={index} onClick={action.onClick} className={action.variant === 'destructive' ? 'text-destructive' : ''}>
                      <action.icon className="mr-2 size-4" />
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        size: 80,
      },
    ],
    [t, editMode, getOrderActions],
  );

  const table = useReactTable({
    data: filteredByStatus,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: { pageSize: 20 },
    },
  });

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  if (orders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex max-w-50 flex-col gap-1.5">
          <Label>{t('search')}</Label>
          <div className="relative">
            <Search className="absolute top-3 left-2 size-4 text-muted-foreground" />
            <Input placeholder={t('search.placeholder')} value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="h-10 pl-8" />
          </div>
        </div>

        <FasStatusSelect value={statusFilter} onChange={setStatusFilter} placeholder={t('status')} />

        {hasFilters && (
          <Button variant="outline" onClick={handleClearFilters}>
            <BrushCleaning className="size-4" />
          </Button>
        )}
      </div>

      <div className="overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="transition-colors hover:bg-secondary">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t('not.found')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Item className="items-center justify-between">
        <div className="flex items-center md:gap-4">
          <div className="flex items-center gap-2">
            <ItemDescription>{t('show')}</ItemDescription>
            <Select value={String(table.getState().pagination.pageSize)} onValueChange={(value) => table.setPageSize(Number(value))}>
              <SelectTrigger className="h-8 w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    <ItemDescription className="font-semibold">{size}</ItemDescription>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ItemDescription>{t('per.page')}</ItemDescription>
          </div>

          <div className="flex items-center gap-1">
            <ItemDescription>{t('results')}:</ItemDescription>
            <ItemTitle>
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} -{' '}
              {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} /{' '}
              {table.getFilteredRowModel().rows.length}
            </ItemTitle>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" className="size-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="size-4" />
            <span className="sr-only">{t('previous')}</span>
          </Button>
          {pageCount <= 5 ? (
            Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
              <Button key={page} variant={currentPage === page ? 'default' : 'ghost'} className="size-8" onClick={() => table.setPageIndex(page - 1)}>
                {page}
              </Button>
            ))
          ) : (
            <>
              {currentPage > 2 && (
                <Button variant="ghost" className="size-8" onClick={() => table.setPageIndex(0)}>
                  1
                </Button>
              )}
              {currentPage > 3 && <span className="px-2">...</span>}
              {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                .filter((page) => page >= 1 && page <= pageCount)
                .map((page) => (
                  <Button key={page} variant={currentPage === page ? 'default' : 'ghost'} className="size-8" onClick={() => table.setPageIndex(page - 1)}>
                    {page}
                  </Button>
                ))}
              {currentPage < pageCount - 2 && <span className="px-2">...</span>}
              {currentPage < pageCount - 1 && (
                <Button className="size-8" onClick={() => table.setPageIndex(pageCount - 1)}>
                  {pageCount}
                </Button>
              )}
            </>
          )}
          <Button variant="ghost" className="size-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight className="size-4" />
            <span className="sr-only">{t('next')}</span>
          </Button>
        </div>
      </Item>
    </div>
  );
}

interface FasOrdersTableProps {
  orders: FasDetailsOrder[];
  fasType?: string;
  permissions: string[];
  editMode?: boolean;
  onViewOrder: (orderId: string) => void;
  onEditOrder?: (orderId: string) => void;
  onTransferOrder?: (orderId: string) => void;
  onEditRecSupplier?: (orderId: string) => void;
  onEditRating?: (orderId: string) => void;
}
