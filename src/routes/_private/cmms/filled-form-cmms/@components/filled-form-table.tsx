import { isValid, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/formatDate';
import type { FilledFormColumn, FilledFormResponse } from '../@interface/filled-form.schema';

interface FilledFormTableProps {
  data: FilledFormResponse | undefined;
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onSizeChange?: (size: number) => void;
}

export function FilledFormTable({ data, isLoading, page, pageSize, totalItems, onPageChange, onSizeChange }: FilledFormTableProps) {
  const { t } = useTranslation();
  const totalPages = Math.ceil(totalItems / pageSize);

  if (isLoading) {
    return <DefaultLoading />;
  }

  if (!data?.data?.length) {
    return <DefaultEmptyData />;
  }

  const renderCellContent = (item: any, column: FilledFormColumn) => {
    // Access nested data using column.name
    const value = item.data?.[column.name];

    // Check if it's a date string
    if (typeof value === 'string' && (value.match(/^\d{4}-\d{2}-\d{2}T/) || value.match(/^\d{4}-\d{2}-\d{2}$/))) {
      const date = parseISO(value);
      if (isValid(date)) {
        return formatDate(date, 'dd/MM/yyyy HH:mm');
      }
    }

    // Boolean mapping
    if (typeof value === 'boolean') {
      return value ? t('yes') : t('no');
    }

    if (value === null || value === undefined) {
      return '-';
    }

    return String(value);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {data.columns.map((col) => (
                <TableHead key={col.name} className="whitespace-nowrap bg-muted/50 text-center font-semibold text-foreground">
                  {col.description}
                  {col.properties?.unit && <span className="block font-normal text-muted-foreground text-xs">({col.properties.unit})</span>}
                </TableHead>
              ))}
              <TableHead className="bg-muted/50 text-center font-semibold text-foreground">{t('contract')}</TableHead>
              <TableHead className="bg-muted/50 text-center font-semibold text-foreground">{t('status')}</TableHead>
              {data.typeForm !== 'CMMS' && (
                <>
                  <TableHead className="bg-muted/50 text-center font-semibold text-foreground">{t('user.fill')}</TableHead>
                  <TableHead className="bg-muted/50 text-center font-semibold text-foreground">{t('fill.at')}</TableHead>
                </>
              )}
              <TableHead className="bg-muted/50 text-center font-semibold text-foreground">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((item, index) => (
              <TableRow key={item.id || index}>
                {data.columns.map((col) => (
                  <TableCell key={`${item.id}-${col.name}`} className="text-center">
                    {renderCellContent(item, col)}
                  </TableCell>
                ))}

                {/* Contract Column - Mocking logic based on legacy component */}
                <TableCell className="text-center">
                  {/* Simplified for now, legacy logic was complex involving 'headerContract' */}
                  {item.headerContract || '-'}
                </TableCell>

                {/* Status Column */}
                <TableCell className="text-center">
                  {/* Simplified status display */}
                  <Badge variant="outline">{item.status || t('undefined')}</Badge>
                </TableCell>

                {data.typeForm !== 'CMMS' && (
                  <>
                    <TableCell className="text-center">{item.userFill || '-'}</TableCell>
                    <TableCell className="text-center">{item.fillAt ? formatDate(parseISO(item.fillAt), 'dd/MM/yyyy HH:mm') : '-'}</TableCell>
                  </>
                )}

                <TableCell className="text-center">
                  {/* Action buttons placeholder - would normally contain Edit/Delete/Block based on permissions */}
                  <Button variant="ghost" size="sm">
                    {t('details')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center space-x-2 text-muted-foreground text-sm">
            <span>{t('showing')}</span>
            <Select value={String(pageSize)} onValueChange={(val) => onSizeChange?.(Number(val))}>
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
            <span>{t('per.page')}</span>
            <span className="ml-2">
              {t('total')}: {totalItems}
            </span>
          </div>

          <Pagination className="w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) onPageChange(page - 1);
                  }}
                  aria-disabled={page <= 1}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                // Logic to show ranges around current page could be added here
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(pageNum);
                      }}
                      isActive={page === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {totalPages > 5 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) onPageChange(page + 1);
                  }}
                  aria-disabled={page >= totalPages}
                  className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
