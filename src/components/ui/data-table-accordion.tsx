import type React from 'react';
import { useCallback, useMemo, useState } from 'react';
import EmptyData from '@/components/default-empty-data';
import ColumnIcon from '@/components/icons/Column.Icon';
import ArrowDownIcon from '@/components/icons/Down.Icon';
import ChevronLeft from '@/components/icons/Left.Icon';
import ChevronRight from '@/components/icons/Right.Icon';
import Search from '@/components/icons/Search.Icon';
import ChevronsUpDownIcon from '@/components/icons/Sort.Icon';
import ArrowUpIcon from '@/components/icons/Up.Icon';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { t } from '@/lib/helpers/translate.helper';
import { cn } from '@/lib/utils/cn.util';
import DefaultLoading from '../default-loading';

function AccordionRow<T>({
  row,
  index,
  columns,
  renderExpanded,
  striped,
  hoverable,
  compact,
  onRowClick,
  defaultOpen = false,
}: {
  row: T;
  index: number;
  columns: DataTableAccordionColumn<T>[];
  renderExpanded?: (row: T, isOpen: boolean) => React.ReactNode;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  onRowClick?: (row: T, index: number) => void;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasExpanded = !!renderExpanded;

  return (
    <Collapsible asChild open={isOpen} onOpenChange={setIsOpen}>
      <TableBody className="[&_tr:last-child]:border-b last:[&_tr:last-child]:border-0">
        <TableRow
          className={cn(
            'border-accent transition-colors',
            striped && index % 2 === 0 && 'bg-muted/5',
            hoverable && 'hover:bg-secondary',
            onRowClick && 'cursor-pointer',
            isOpen ? 'border-b-0 hover:bg-secondary' : 'border-b last:border-0',
          )}
          onClick={(e) => {
            if (onRowClick) {
              onRowClick(row, index);
            } else if (hasExpanded) {
              const target = e.target as HTMLElement;
              if (!target.closest('button[data-expand-toggle]')) {
                setIsOpen(!isOpen);
                e.stopPropagation();
              }
            }
          }}
        >
          {hasExpanded && (
            <TableCell className="w-14 px-4 align-middle">
              <Button
                data-expand-toggle
                aria-label={isOpen ? t('collapse.row') : t('expand.row')}
                className="h-7 w-12 text-muted-foreground"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
              >
                {isOpen ? <ArrowDownIcon className="size-3.5 transition-transform duration-200" /> : <ChevronRight className="size-3.5 transition-transform duration-200" />}
              </Button>
            </TableCell>
          )}

          {columns.map((column) => (
            <TableCell key={String(column.key)} className={cn('align-middle text-foreground text-sm', compact ? 'p-4' : 'px-6 py-4')}>
              {column.render ? column.render(row[column.key], row, index) : String(row[column.key] ?? '')}
            </TableCell>
          ))}
        </TableRow>

        {hasExpanded && (
          <CollapsibleContent asChild>
            <TableRow className="border-t-0 border-b-0 p-0 hover:bg-transparent">
              <TableCell className="border-0 p-0 md:p-0" colSpan={columns.length + 1}>
                <div className="w-full bg-secondary">{renderExpanded(row, isOpen)}</div>
              </TableCell>
            </TableRow>
          </CollapsibleContent>
        )}
      </TableBody>
    </Collapsible>
  );
}

export function DataTableAccordion<T extends Record<string, any>>({
  data,
  columns,
  renderExpanded,
  className,
  searchPlaceholder = t('search.placeholder'),
  searchable = true,
  columnSelector = true,
  itemsPerPage = 10,
  showPagination = true,
  striped = false,
  hoverable = true,
  bordered = true,
  compact = false,
  loading = false,
  onRowClick,
  hideHeader = false,
  defaultExpandedIndex = -1,
  page,
  size,
  onPageChange,
  onPageSizeChange,
}: DataTableAccordionProps<T>) {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  const [internalPageSize, setInternalPageSize] = useState(size ?? itemsPerPage);
  const [internalCurrentPage, setInternalCurrentPage] = useState(page ?? 1);

  const pageSize = size ?? internalPageSize;
  const currentPage = page ?? internalCurrentPage;

  const setPageSize = useCallback(
    (val: number) => {
      setInternalPageSize(val);
      onPageSizeChange?.(val);
    },
    [onPageSizeChange],
  );

  const setCurrentPage = useCallback(
    (val: number | ((prev: number) => number)) => {
      const newVal = typeof val === 'function' ? val(currentPage) : val;
      setInternalCurrentPage(newVal);
      onPageChange?.(newVal);
    },
    [onPageChange, currentPage],
  );
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  const visibleColumns = useMemo(() => {
    return columns.filter((col) => columnVisibility[col.key as string] !== false);
  }, [columns, columnVisibility]);

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

    return filtered;
  }, [data, search, columns]);

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

  if (loading) {
    return <DefaultLoading />;
  }

  const hasExpanded = !!renderExpanded;

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Top area: Page size & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {showPagination ? (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">{t('data.table.show')}</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-muted-foreground text-sm">{t('data.table.results')}</span>
          </div>
        ) : (
          <div /> /* spacer */
        )}

        {(searchable || columnSelector) && (
          <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
            {searchable && (
              <div className="relative w-full sm:w-64">
                <Search className="absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9"
                />
              </div>
            )}
            {columnSelector && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <ColumnIcon className="mr-2 hidden size-3.5 sm:inline" />
                    {t('data.table.columns')}
                    <ArrowDownIcon className="ml-2 size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {columns.map((col) => {
                    const isVisible = columnVisibility[col.key as string] !== false;
                    return (
                      <DropdownMenuCheckboxItem
                        key={String(col.key)}
                        className="text-xs capitalize"
                        checked={isVisible}
                        onCheckedChange={(value) => setColumnVisibility((prev) => ({ ...prev, [col.key as string]: !!value }))}
                      >
                        {typeof col.header === 'string' ? col.header : String(col.key)}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>

      {/* Table Area */}
      <div className={cn('rounded-lg border bg-card', bordered ? 'border' : 'border-0')}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full border-collapse">
            {!hideHeader && (
              <thead className={cn('bg-secondary', bordered && 'border-border border-b')}>
                <tr>
                  {hasExpanded && <th className={cn('w-[60px] px-4', compact ? 'h-10' : 'h-12')} />}
                  {visibleColumns.map((column) => (
                    <th
                      key={String(column.key)}
                      className={cn('text-left align-middle font-medium text-muted-foreground', compact ? 'h-10 px-4' : 'h-12 px-6', column.width && `w-[${column.width}]`)}
                      style={column.width ? { width: column.width } : undefined}
                    >
                      {column.sortable ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="-ml-3 h-8 data-[state=open]:bg-accent" size="sm" variant="blank">
                              <span className="font-medium text-foreground/80 text-sm">{column.header}</span>
                              {sortConfig.key === column.key && sortConfig.direction === 'desc' ? (
                                <ArrowDownIcon className="ml-2 size-4" />
                              ) : sortConfig.key === column.key && sortConfig.direction === 'asc' ? (
                                <ArrowUpIcon className="ml-2 size-4" />
                              ) : (
                                <ChevronsUpDownIcon className="ml-2 size-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => handleSort(column.key)}>
                              <ArrowUpIcon className="mr-2 size-3.5 text-muted-foreground/70" />
                              {t('sort.ascending')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortConfig({ key: column.key, direction: 'desc' })}>
                              <ArrowDownIcon className="mr-2 size-3.5 text-muted-foreground/70" />
                              {t('sort.descending')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground/80 text-sm">{column.header}</span>
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
            )}

            {paginatedData.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={visibleColumns.length + (hasExpanded ? 1 : 0)} className="bg-card text-center">
                    <EmptyData />
                  </td>
                </tr>
              </tbody>
            ) : (
              paginatedData.map((row, index) => (
                <AccordionRow
                  key={index}
                  row={row}
                  index={index}
                  columns={visibleColumns}
                  renderExpanded={renderExpanded}
                  striped={striped}
                  hoverable={hoverable}
                  compact={compact}
                  onRowClick={onRowClick}
                  defaultOpen={defaultExpandedIndex === index}
                />
              ))
            )}
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {showPagination && sortedData.length > 0 && (
        <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-pretty text-muted-foreground text-sm">
            {t('data.table.showing')} {(currentPage - 1) * pageSize + 1} {t('data.table.to')} {Math.min(currentPage * pageSize, sortedData.length)} {t('data.table.of')}{' '}
            {sortedData.length} {t('data.table.results')}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              aria-label={t('previous.page')}
            >
              <ChevronLeft className="size-4" />
              <span className="sr-only">{t('pagination.previous')}</span>
            </Button>

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
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? 'default' : 'outline'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(pageNumber)}
                  aria-label={`${t('pagination.go.to.page')} ${pageNumber}`}
                >
                  {pageNumber}
                </Button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <Button variant="blank" size="icon" className="h-8 w-8 cursor-default" disabled>
                ...
              </Button>
            )}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label={t('next.page')}
            >
              <ChevronRight className="size-4" />
              <span className="sr-only">{t('pagination.next')}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export type DataTableAccordionColumn<T> = {
  key: keyof T;
  header: React.ReactNode;
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  width?: string;
};

export type DataTableAccordionProps<T> = {
  data: T[];
  columns: DataTableAccordionColumn<T>[];
  renderExpanded?: (row: T, isOpen: boolean) => React.ReactNode;
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
  hideHeader?: boolean;
  columnSelector?: boolean;
  defaultExpandedIndex?: number;
  page?: number;
  size?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
};
