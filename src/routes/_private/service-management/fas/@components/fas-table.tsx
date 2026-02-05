import { useNavigate } from '@tanstack/react-router';
import { BookOpen, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusIndicator } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ItemContent, ItemDescription, ItemFooter, ItemTitle } from '@/components/ui/item';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { FAS_PAGINATION_MAX_VISIBLE } from '../@consts/fas.consts';
import type { Fas } from '../@interface/fas.schema';
import { getLighthouseStatus, getOrderSupplier, mountFasCode } from '../@utils/fas.utils';
import { FasStatusBadge } from './fas-status-badge';

export function FasTable({ data, isLoading, page = 1, pageSize = 10, totalItems = 0, onPageChange }: FasTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (isLoading) {
    return <DefaultLoading />;
  }

  if (!data || data.length === 0) {
    return <DefaultEmptyData />;
  }

  const totalPages = Math.ceil(totalItems / pageSize);
  const showPagination = !!onPageChange && totalItems > 0 && totalPages > 1;

  const renderPaginationItems = () => {
    if (!showPagination || !onPageChange) return null;

    const items = [];
    let startPage = Math.max(1, page - Math.floor(FAS_PAGINATION_MAX_VISIBLE / 2));
    const endPage = Math.min(totalPages, startPage + FAS_PAGINATION_MAX_VISIBLE - 1);

    if (endPage - startPage + 1 < FAS_PAGINATION_MAX_VISIBLE) {
      startPage = Math.max(1, endPage - FAS_PAGINATION_MAX_VISIBLE + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={page === i} onClick={() => onPageChange(i)} className="cursor-pointer">
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    return items;
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg">
        <Table className="rounded-lg">
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-64 py-4 text-center font-semibold text-muted-foreground text-sm">{t('fas')}</TableHead>
              <TableHead className="w-24 py-4 text-center font-semibold text-muted-foreground text-sm">{t('actions')} FAS</TableHead>
              <TableHead className="w-28 py-4 text-center font-semibold text-muted-foreground text-sm">OS</TableHead>
              <TableHead className="w-36 py-4 text-center font-semibold text-muted-foreground text-sm">{t('status')}</TableHead>
              <TableHead className="py-4 font-semibold text-muted-foreground text-sm">{t('supplier')}</TableHead>
              <TableHead className="py-4 font-semibold text-muted-foreground text-sm">{t('planner')}</TableHead>
              <TableHead className="w-24 py-4 text-center font-semibold text-muted-foreground text-sm">{t('lighthouse')}</TableHead>
              <TableHead className="w-24 py-4 text-center font-semibold text-muted-foreground text-sm">{t('actions')} OS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((fas) => {
              const orders = fas.orders && fas.orders.length > 0 ? fas.orders : [{ id: 'empty', empty0: true } as any];

              // Sort orders by name
              const sortedOrders = [...orders].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

              return sortedOrders.map((order, index) => (
                <TableRow key={`${fas.id}${order.id || index}`} className="transition-colors hover:bg-secondary">
                  {index === 0 && (
                    <>
                      <TableCell rowSpan={sortedOrders.length} className="align-top">
                        <div
                          className="flex cursor-pointer items-center gap-3"
                          onClick={() => navigate({ to: './details', search: { id: fas.id } } satisfies { to: string; search: { id: string } })}
                        >
                          <Avatar className="size-12 border border-accent">
                            <AvatarImage src={fas.vessel?.image?.url} alt={fas.vessel?.name} />
                            <AvatarFallback className="bg-secondary text-primary">{fas.vessel?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <ItemContent className="gap-0">
                            <div className="flex items-baseline gap-2">
                              <ItemTitle>{fas.vessel?.name}</ItemTitle>
                              <ItemDescription className="text-xs">{fas.serviceDate ? formatDate(fas.serviceDate, 'dd MM yyyy') : ''}</ItemDescription>
                            </div>
                            <ItemDescription className="text-xs uppercase tracking-widest">{mountFasCode(fas)}</ItemDescription>
                            <ItemDescription className="text-primary">{fas.type}</ItemDescription>
                          </ItemContent>
                        </div>
                      </TableCell>
                      <TableCell rowSpan={sortedOrders.length} className="text-center align-top">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" onClick={() => navigate({ to: './details', search: { id: fas.id } } satisfies { to: string; search: { id: string } })}>
                              <BookOpen className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t('view.fas')}</TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </>
                  )}

                  <TableCell className="py-4">
                    {order.empty0 ? (
                      <ItemDescription>{t('os.empty')}</ItemDescription>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <ItemTitle>{order.name}</ItemTitle>
                        {order.code && <ItemDescription>{order.code}</ItemDescription>}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="py-4 text-center">{!order.empty0 && <FasStatusBadge status={order.state} />}</TableCell>

                  <TableCell className="py-4">
                    {!order.empty0 && (
                      <div className="flex flex-col">
                        <ItemDescription className={cn(!Object.keys(order.supplierData || {}).length ? 'text-muted-foreground/60 italic' : 'font-medium text-foreground')}>
                          {getOrderSupplier(order)}
                        </ItemDescription>
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="py-4">
                    {!order.empty0 && <ItemDescription className="font-medium text-muted-foreground">{order.supplierData?.addedBy || '-'}</ItemDescription>}
                  </TableCell>

                  <TableCell className="py-4 text-center">
                    {!order.empty0 && (
                      <div className="flex justify-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help p-2">
                              <StatusIndicator status={getLighthouseStatus(order.slaLighthouse)} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>SLA Status: {t(getLighthouseStatus(order.slaLighthouse))}</TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="py-4 text-center">
                    {!order.empty0 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" onClick={() => navigate({ to: './filled-os', search: { id: order.id } } satisfies { to: string; search: { id: string } })}>
                            <ExternalLink className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t('open.os')}</TooltipContent>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ));
            })}
          </TableBody>
        </Table>
      </div>

      {showPagination && onPageChange && (
        <ItemFooter>
          <div className="flex gap-2">
            <ItemDescription>{t('total')}:</ItemDescription>
            <ItemTitle>{totalItems}</ItemTitle>
          </div>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => onPageChange(Math.max(1, page - 1))} className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
              </PaginationItem>

              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                  className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </ItemFooter>
      )}
    </div>
  );
}

interface FasTableProps {
  data?: Fas[];
  isLoading: boolean;
  page?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}
