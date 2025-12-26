import { ChevronDown, ChevronUp, Filter, Search, X } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type DataTableColumn<T> = {
  key: keyof T;
  header: string;
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
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
};

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  className,
  searchable = true,
  searchPlaceholder = 'Search...',
  itemsPerPage = 10,
  showPagination = true,
  striped = false,
  hoverable = true,
  bordered = true,
  compact = false,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  // Filter data based on search and column filters
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Global search
    if (search) {
      filtered = filtered.filter((row) =>
        columns.some((column) => {
          const value = row[column.key];
          return value?.toString().toLowerCase().includes(search.toLowerCase());
        }),
      );
    }

    // Column filters
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

  // Sort data
  const sortedData = useMemo(() => {
    const { key, direction } = sortConfig;
    if (!key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;

    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage, showPagination]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key: keyof T) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleColumnFilter = (key: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const clearColumnFilter = (key: string) => {
    setColumnFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          {/* Search skeleton */}
          {searchable && <Skeleton className="mb-6 h-10 w-full sm:w-64" />}
          {/* Table skeleton */}
          <div className="border border-border rounded-md overflow-hidden">
            <div className="bg-muted/30 h-14" />
            {Array.from({ length: 5 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton items
              <div key={i} className="h-14 border-t border-border bg-card">
                <div className="flex items-center h-full px-4 gap-4">
                  {columns.map((_, j) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton items
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Pagination skeleton */}
          <div className="mt-6 flex justify-between items-center">
            <Skeleton className="size-48" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(className, !bordered && 'border-0 shadow-none')}>
      {/* Search and Filters */}
      {searchable && (
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground z-10" />
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
        </CardHeader>
      )}

      {/* Table */}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-muted/30">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={cn('text-left font-medium text-muted-foreground align-top', compact ? 'p-4' : 'p-6', column.width && `w-[${column.width}]`)}
                    style={column.width ? { width: column.width } : undefined}
                  >
                    {/* biome-ignore lint/a11y/noStaticElementInteractions: Interactive only when sortable */}
                    {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: Interactive only when sortable */}
                    <div
                      className={cn('flex items-center justify-between gap-2', column.sortable && 'cursor-pointer hover:text-foreground transition-colors group')}
                      onClick={column.sortable ? () => handleSort(column.key) : undefined}
                      onKeyDown={
                        column.sortable
                          ? (e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSort(column.key);
                              }
                            }
                          : undefined
                      }
                      role={column.sortable ? 'button' : undefined}
                      tabIndex={column.sortable ? 0 : undefined}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{column.header}</span>
                        {column.sortable && (
                          <div className="flex flex-col">
                            <ChevronUp
                              className={cn(
                                'size-3',
                                sortConfig.key === column.key && sortConfig.direction === 'asc' ? 'text-primary' : 'text-muted-foreground/40 group-hover:text-muted-foreground/70',
                              )}
                            />
                            <ChevronDown
                              className={cn(
                                'size-3 -mt-1',
                                sortConfig.key === column.key && sortConfig.direction === 'desc' ? 'text-primary' : 'text-muted-foreground/40 group-hover:text-muted-foreground/70',
                              )}
                            />
                          </div>
                        )}
                      </div>
                      {column.filterable && (
                        <div className="relative">
                          <Filter className="size-3 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    {/* Column Filter */}
                    {column.filterable && (
                      <div className="mt-3 relative">
                        <Input
                          type="text"
                          placeholder="Filter..."
                          value={columnFilters[String(column.key)] || ''}
                          onChange={(e) => handleColumnFilter(String(column.key), e.target.value)}
                          className="h-8 text-xs pr-8"
                        />
                        {columnFilters[String(column.key)] && (
                          <Button variant="ghost" size="icon" onClick={() => clearColumnFilter(String(column.key))} className="absolute right-0 top-0 h-8 w-8 hover:bg-transparent">
                            <X className="size-3 text-muted-foreground hover:text-foreground" />
                          </Button>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-card">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className={cn('text-center text-muted-foreground bg-card', compact ? 'px-4 py-12' : 'px-6 py-16')}>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-4xl">📊</div>
                      <div className="font-medium">{emptyMessage}</div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr
                    // biome-ignore lint/suspicious/noArrayIndexKey: Data does not have a guaranteed unique ID
                    key={index}
                    className={cn(
                      'border-t border-border bg-card transition-colors',
                      striped && index % 2 === 0 && 'bg-muted/20',
                      hoverable && 'hover:bg-muted/30',
                      onRowClick && 'cursor-pointer',
                    )}
                    onClick={() => onRowClick?.(row, index)}
                  >
                    {columns.map((column) => (
                      <td key={String(column.key)} className={cn('text-sm text-foreground align-middle', compact ? 'px-4 py-3' : 'px-6 py-4')}>
                        {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-border">
          <Badge variant="outline" className="text-muted-foreground font-normal">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length}
          </Badge>

          <Pagination className="w-auto mx-0">
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
        </CardFooter>
      )}
    </Card>
  );
}
