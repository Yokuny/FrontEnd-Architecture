import type { Cell, Column, ColumnDef, Header, HeaderGroup, Row, SortingState, Table } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from 'lucide-react';
import type React from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { createContext, memo, useCallback, useContext, useMemo, useState } from 'react';
import EmptyData from '@/components/default-empty-data';
import Cross from '@/components/icons/Cross.Icon';
import Mixer from '@/components/icons/Mixer.Icon';
import Search from '@/components/icons/Search.Icon';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ItemContent, ItemFooter, ItemHeader } from '@/components/ui/item';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  TableBody as TableBodyPrimitive,
  TableCell as TableCellPrimitive,
  TableHeader as TableHeaderPrimitive,
  TableHead as TableHeadPrimitive,
  Table as TablePrimitive,
  TableRow as TableRowPrimitive,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import DefaultLoading from '../default-loading';

// ─── Re-exports ──────────────────────────────────────────────────────────────

export type { ColumnDef } from '@tanstack/react-table';

// ─── Context ──────────────────────────────────────────────────────────────────

export const DataTableContext = createContext<{
  data: unknown[];
  columns: ColumnDef<unknown, unknown>[];
  table: Table<unknown> | null;
}>({
  data: [],
  columns: [],
  table: null,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export type DataTableProviderProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  children: ReactNode;
  className?: string;
  globalFilter?: string;
  pageSize?: number;
};

export function DataTableProvider<TData, TValue>({ columns, data, children, className, globalFilter, pageSize }: DataTableProviderProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: (updater) => {
      // @ts-expect-error updater is a function that returns a sorting object
      const newSorting = updater(sorting);
      setSorting(newSorting);
    },
    state: {
      sorting,
      ...(globalFilter !== undefined && { globalFilter }),
      ...(pageSize !== undefined && { pagination: { pageIndex: 0, pageSize } }),
    },
  });

  return (
    <DataTableContext.Provider
      value={{
        data,
        columns: columns as never,
        table: table as never,
      }}
    >
      <TablePrimitive className={className}>{children}</TablePrimitive>
    </DataTableContext.Provider>
  );
}

// ─── DataTableHead ────────────────────────────────────────────────────────────

export type DataTableHeadProps = {
  header: Header<unknown, unknown>;
  className?: string;
};

export const DataTableHead = memo(({ header, className }: DataTableHeadProps) => (
  <TableHeadPrimitive className={className} key={header.id}>
    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
  </TableHeadPrimitive>
));

DataTableHead.displayName = 'DataTableHead';

// ─── DataTableHeaderGroup ─────────────────────────────────────────────────────

export type DataTableHeaderGroupProps = {
  headerGroup: HeaderGroup<unknown>;
  children: (props: { header: Header<unknown, unknown> }) => ReactNode;
};

export const DataTableHeaderGroup = ({ headerGroup, children }: DataTableHeaderGroupProps) => (
  <TableRowPrimitive key={headerGroup.id}>{headerGroup.headers.map((header) => children({ header }))}</TableRowPrimitive>
);

// ─── DataTableHeader ──────────────────────────────────────────────────────────

export type DataTableHeaderProps = {
  className?: string;
  children: (props: { headerGroup: HeaderGroup<unknown> }) => ReactNode;
};

export const DataTableHeader = ({ className, children }: DataTableHeaderProps) => {
  const { table } = useContext(DataTableContext);

  return <TableHeaderPrimitive className={className}>{table?.getHeaderGroups().map((headerGroup) => children({ headerGroup }))}</TableHeaderPrimitive>;
};

// ─── DataTableColumnHeader (sortable dropdown) ────────────────────────────────

export interface DataTableColumnHeaderProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({ column, title, className }: DataTableColumnHeaderProps<TData, TValue>) {
  const handleSortAsc = useCallback(() => {
    column.toggleSorting(false);
  }, [column]);

  const handleSortDesc = useCallback(() => {
    column.toggleSorting(true);
  }, [column]);

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="-ml-3 h-8 data-[state=open]:bg-accent" size="sm" variant="secondary">
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={handleSortAsc}>
            <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Crescente
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSortDesc}>
            <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Decrescente
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ─── DataTableCell ────────────────────────────────────────────────────────────

export type DataTableCellProps = {
  cell: Cell<unknown, unknown>;
  className?: string;
};

export const DataTableCell = ({ cell, className }: DataTableCellProps) => (
  <TableCellPrimitive className={className}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCellPrimitive>
);

// ─── DataTableRow ─────────────────────────────────────────────────────────────

export type DataTableRowProps = {
  row: Row<unknown>;
  children: (props: { cell: Cell<unknown, unknown> }) => ReactNode;
  className?: string;
};

export const DataTableRow = ({ row, children, className }: DataTableRowProps) => (
  <TableRowPrimitive className={className} data-state={row.getIsSelected() && 'selected'} key={row.id}>
    {row.getVisibleCells().map((cell) => children({ cell }))}
  </TableRowPrimitive>
);

// ─── DataTableBody ────────────────────────────────────────────────────────────

export type DataTableBodyProps = {
  children: (props: { row: Row<unknown> }) => ReactNode;
  className?: string;
};

export const DataTableBody = ({ children, className }: DataTableBodyProps) => {
  const { columns, table } = useContext(DataTableContext);
  const rows = table?.getRowModel().rows;

  return (
    <TableBodyPrimitive className={className}>
      {rows?.length ? (
        rows.map((row) => children({ row }))
      ) : (
        <TableRowPrimitive>
          <TableCellPrimitive className="h-24 text-center" colSpan={columns.length}>
            <EmptyData />
          </TableCellPrimitive>
        </TableRowPrimitive>
      )}
    </TableBodyPrimitive>
  );
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type DataTableColumn<T> = {
  key: keyof T;
  header: React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
};

export type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  itemsPerPage?: number;
  showPagination?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  loading?: boolean;
  onRowClick?: (row: T, index: number) => void;
};

// ─── DataTable (API simplificada / retrocompatível) ───────────────────────────

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  className,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  itemsPerPage = 10,
  showPagination = true,
  striped = false,
  hoverable = true,
  bordered = true,
  compact = false,
  loading = false,
  onRowClick,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  const [pageSize, setPageSize] = useState(itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (search) {
      filtered = filtered.filter((row) =>
        columns.some((column) => {
          const value = row[column.key];
          return value?.toString().toLowerCase().includes(search.toLowerCase());
        }),
      );
    }

    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((row) => {
          const rowValue = row[key as keyof T];
          return rowValue?.toString().toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    return filtered;
  }, [data, search, columnFilters, columns]);

  const sortedData = useMemo(() => {
    const { key, direction } = sortConfig;
    if (!key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, showPagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = useCallback((key: keyof T) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const handleColumnFilter = useCallback((key: string, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const clearColumnFilter = useCallback((key: string) => {
    setColumnFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  if (loading) {
    return <DefaultLoading />;
  }

  return (
    <div className={cn('flex flex-col gap-6 rounded-lg border-sidebar-border bg-background py-6 text-card-foreground', bordered ? 'md:border' : 'border-0 md:border-0', className)}>
      {/* Search */}
      {searchable && (
        <ItemHeader className="justify-end px-6">
          <div className="flex flex-col items-end gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-auto sm:max-w-sm sm:flex-1">
              <Search className="absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
          </div>
        </ItemHeader>
      )}

      {/* Table */}
      <ItemContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-muted/30">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={cn('text-left align-top font-medium text-muted-foreground', compact ? 'p-4' : 'p-6', column.width && `w-[${column.width}]`)}
                    style={column.width ? { width: column.width } : undefined}
                  >
                    {column.sortable ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="-ml-3 h-8 data-[state=open]:bg-accent" size="sm" variant="secondary">
                            <span className="font-semibold text-sm">{column.header}</span>
                            {sortConfig.key === column.key && sortConfig.direction === 'desc' ? (
                              <ArrowDownIcon className="ml-2 h-4 w-4" />
                            ) : sortConfig.key === column.key && sortConfig.direction === 'asc' ? (
                              <ArrowUpIcon className="ml-2 h-4 w-4" />
                            ) : (
                              <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => handleSort(column.key)}>
                            <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                            Crescente
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSortConfig({ key: column.key, direction: 'desc' })}>
                            <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                            Decrescente
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{column.header}</span>
                        {column.filterable && <Mixer className="size-3 text-muted-foreground/50" />}
                      </div>
                    )}

                    {column.filterable && (
                      <div className="relative mt-3">
                        <Input
                          type="text"
                          placeholder="Filtrar..."
                          value={columnFilters[String(column.key)] || ''}
                          onChange={(e) => handleColumnFilter(String(column.key), e.target.value)}
                          className="h-8 pr-8 text-xs"
                        />
                        {columnFilters[String(column.key)] && (
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => clearColumnFilter(String(column.key))}
                            className="absolute top-0 right-0 h-8 w-8 hover:bg-transparent"
                          >
                            <Cross className="size-3 text-muted-foreground hover:text-foreground" />
                          </Button>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="bg-card">
                    <EmptyData />
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr
                    // biome-ignore lint/suspicious/noArrayIndexKey: Data does not have a guaranteed unique ID
                    key={index}
                    className={cn(
                      'border-border border-t transition-colors',
                      striped && index % 2 === 0 && 'bg-muted/20',
                      hoverable && 'hover:bg-muted/30',
                      onRowClick && 'cursor-pointer',
                    )}
                    onClick={() => onRowClick?.(row, index)}
                  >
                    {columns.map((column) => (
                      <td key={String(column.key)} className={cn('align-middle text-foreground text-sm', compact ? 'px-4 py-3' : 'px-6 py-4')}>
                        {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ItemContent>

      {/* Pagination */}
      {showPagination && sortedData.length > 0 && (
        <ItemFooter className="flex flex-col items-center justify-between gap-4 px-6 py-4 sm:flex-row">
          <div className="order-2 flex items-center gap-2 text-muted-foreground text-sm sm:order-1">
            <span>Exibir</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span>por página</span>
            <span className="ml-4 tabular-nums">Total: {sortedData.length}</span>
          </div>

          <div className="order-1 sm:order-2">
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={cn(currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer')}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  let pageNumber: number;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  if (pageNumber < 1 || pageNumber > totalPages) return null;

                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink isActive={currentPage === pageNumber} onClick={() => setCurrentPage(pageNumber)} className="cursor-pointer">
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={cn(currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer')}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </ItemFooter>
      )}
    </div>
  );
}
