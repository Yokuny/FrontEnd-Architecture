import { Anchor, Clock, Gauge, Navigation, Radio, Ship, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyData from '@/components/default-empty-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { DataTableColumn } from '@/components/ui/data-table';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { TimeOperationData } from '@/hooks/use-statistics-api';
import { cn } from '@/lib/utils';
import { TimeOperationDetailsDialog } from './TimeOperationDetailsDialog';

interface TimeOperationTableProps {
  data: TimeOperationData[];
  listStatusAllow: string[];
  orderColumn: { column: string; order: 'asc' | 'desc' } | null;
  onOrderChange: (order: { column: string; order: 'asc' | 'desc' } | null) => void;
  filters: any;
}

// Get status icon and translation key
function getStatusConfig(status: string) {
  const s = status.toLowerCase();

  if (s === 'dp' || s === 'dynamic_position' || s === 'dynamic position') {
    return { icon: Gauge, key: 'dp', color: 'text-info' };
  }
  if (['stand by', 'stand_by', 'standby'].includes(s)) {
    return { icon: Radio, key: 'stand.by', color: 'text-orange-600' };
  }
  if (['stand by ready', 'stand_by_ready', 'standbyready'].includes(s)) {
    return { icon: Radio, key: 'stand.by.ready', color: 'text-cyan-500' };
  }
  if (['underway using engine', 'underway_using_engine', 'underway', 'under way', 'under way using engine', 'under_way_using_engine'].includes(s)) {
    return { icon: Navigation, key: 'in.travel', color: 'text-success' };
  }
  if (['fast transit', 'fasttransit', 'fast_transit'].includes(s)) {
    return { icon: Zap, key: 'fast.transit', color: 'text-green-700' };
  }
  if (s === 'slow') {
    return { icon: Navigation, key: 'slow', color: 'text-warning-400' };
  }
  if (['at anchor', 'at_anchor', 'stopped'].includes(s)) {
    return { icon: Anchor, key: 'at.anchor', color: 'text-warning-500' };
  }
  if (['moored', 'port'].includes(s)) {
    return { icon: Ship, key: 'moored', color: 'text-primary' };
  }
  if (s === 'dock') {
    return { icon: Ship, key: 'dock', color: 'text-gray-700' };
  }
  return { icon: Ship, key: 'other', color: 'text-muted-foreground' };
}

export function TimeOperationTable({ data, listStatusAllow, orderColumn, onOrderChange, filters }: TimeOperationTableProps) {
  const { t } = useTranslation();

  const columns = useMemo(() => {
    const handleSort = (column: string) => {
      if (orderColumn?.column !== column) {
        onOrderChange({ column, order: 'desc' });
      } else if (orderColumn?.column === column && orderColumn?.order === 'desc') {
        onOrderChange({ column, order: 'asc' });
      } else {
        onOrderChange(null);
      }
    };
    const baseColumns: DataTableColumn<TimeOperationData>[] = [
      {
        key: 'machine',
        header: t('machine'),
        width: '250px',
        render: (value) => (
          <Item className="border-none p-0 items-center">
            <Avatar className="size-12">
              <AvatarImage src={value?.image?.url} alt={value?.name} />
              <AvatarFallback className="bg-secondary text-primary">
                <Ship className="size-5" />
              </AvatarFallback>
            </Avatar>
            <ItemContent>
              <ItemTitle className="font-bold tracking-tight">{value?.name || '-'}</ItemTitle>
            </ItemContent>
          </Item>
        ),
        sortable: false,
      },
    ];

    const statusColumns: DataTableColumn<TimeOperationData>[] = listStatusAllow.map((status) => {
      const statusConfig = getStatusConfig(status);
      const StatusIcon = statusConfig.icon;
      const sortKey = status as keyof TimeOperationData;

      return {
        key: sortKey,
        header: (
          <Item asChild className="border-none p-0 flex-row items-center justify-end gap-2 cursor-pointer group hover:bg-transparent" onClick={() => handleSort(status)}>
            <div className="flex items-center justify-end gap-2">
              <ItemMedia className={cn('size-6 p-1 transition-transform group-hover:scale-110', statusConfig.color)}>
                <StatusIcon className="size-full" />
              </ItemMedia>
              <ItemTitle className="text-muted-foreground group-hover:text-foreground transition-colors uppercase">{t(statusConfig.key)}</ItemTitle>
              {orderColumn?.column === status && <span className="text-xs text-primary">{orderColumn.order === 'asc' ? '↑' : '↓'}</span>}
            </div>
          </Item>
        ),
        render: (_, row) => {
          const itemStatus = row.listTimeStatus?.find((s) => s.status?.toLowerCase() === status);
          if (!itemStatus) return <span className="text-muted-foreground">-</span>;

          const totalMinutes = row.listTimeStatus.reduce((acc, curr) => acc + (curr.minutes || 0), 0);
          const percentual = totalMinutes > 0 ? (itemStatus.minutes / totalMinutes) * 100 : 0;

          // Use normalized percentage if available
          const normalizedPercent = Number(row[status] ?? percentual) || 0;
          const hoursValue = Number(itemStatus.minutes || 0) / 60;
          const distanceValue = Number(itemStatus.distance || 0);

          return (
            <ItemContent className="items-end gap-1 p-0">
              <ItemDescription className="text-xs font-bold text-muted-foreground uppercase">{normalizedPercent.toFixed(0)}%</ItemDescription>
              <ItemActions className="gap-1 items-baseline">
                <ItemTitle>{hoursValue.toFixed(2)}</ItemTitle>
                <ItemDescription className="text-xs uppercase">HR</ItemDescription>
                <Clock className="size-3 text-muted-foreground" />
              </ItemActions>
              <ItemActions className="gap-1 items-baseline">
                <ItemTitle>{distanceValue.toFixed(2)}</ItemTitle>
                <ItemDescription className="text-xs uppercase">NM</ItemDescription>
                <Navigation className="size-3 text-muted-foreground" />
              </ItemActions>
            </ItemContent>
          );
        },
        sortable: false, // Custom sorting handled in parent
      } as DataTableColumn<TimeOperationData>;
    });

    const totalColumn: DataTableColumn<TimeOperationData> = {
      key: 'total' as any,
      header: t('total'),
      render: (_, row) => {
        const totalMinutes = row.listTimeStatus.reduce((acc, curr) => acc + (curr.minutes || 0), 0);
        const totalDistance = row.listTimeStatus.reduce((acc, curr) => acc + (curr.distance || 0), 0);

        return (
          <ItemContent className="items-end gap-1 p-0">
            <ItemActions className="gap-1 items-baseline">
              <ItemTitle>{(totalMinutes / 60).toFixed(1)}</ItemTitle>
              <ItemDescription className="text-xs uppercase">HR</ItemDescription>
            </ItemActions>
            <ItemActions className="gap-1 items-baseline text-primary">
              <ItemTitle>{totalDistance.toFixed(1)}</ItemTitle>
              <ItemDescription className="text-xs uppercase">NM</ItemDescription>
            </ItemActions>
          </ItemContent>
        );
      },
      sortable: false,
    };

    return [...baseColumns, ...statusColumns, totalColumn];
  }, [listStatusAllow, t, orderColumn, onOrderChange]);

  // Calculate benchmark totals
  const benchmarkTotals = useMemo(() => {
    if (!data || data.length === 0) return null;

    const totalAllMinutes = data.reduce((acc, curr) => acc + curr.listTimeStatus.reduce((sum, status) => sum + (status.minutes || 0), 0), 0);
    const totalAllDistance = data.reduce((acc, curr) => acc + curr.listTimeStatus.reduce((sum, status) => sum + (status.distance || 0), 0), 0);

    const statusTotals = listStatusAllow.map((status) => {
      const minutesInStatus = data.reduce((acc, item) => {
        const statusItem = item.listTimeStatus?.find((s) => s.status?.toLowerCase() === status);
        return acc + (statusItem?.minutes || 0);
      }, 0);

      const distanceInStatus = data.reduce((acc, item) => {
        const statusItem = item.listTimeStatus?.find((s) => s.status?.toLowerCase() === status);
        return acc + (statusItem?.distance || 0);
      }, 0);

      const percentual = totalAllMinutes > 0 ? (minutesInStatus / totalAllMinutes) * 100 : 0;

      return {
        status,
        minutes: minutesInStatus,
        distance: distanceInStatus,
        percentual,
      };
    });

    return { totalAllMinutes, totalAllDistance, statusTotals };
  }, [data, listStatusAllow]);

  if (!data || data.length === 0) {
    return <EmptyData />;
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/30 sticky top-0 z-10">
          <TableRow className="hover:bg-transparent border-none">
            {columns.map((column) => (
              <TableHead key={String(column.key)} className="align-middle p-4" style={column.width ? { width: column.width } : undefined}>
                {typeof column.header === 'string' ? <ItemTitle className="text-muted-foreground uppercase">{column.header}</ItemTitle> : column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TimeOperationTableRow key={`${index + 1}_${row?.machine?.id}`} row={row} columns={columns} filters={filters} />
          ))}
        </TableBody>
        {benchmarkTotals && (
          <TableFooter className="bg-secondary sticky bottom-0  ">
            <TableRow className="hover:bg-transparent">
              <TableCell className="p-4">
                <ItemTitle className="text-sm text-muted-foreground uppercase">{t('total')}</ItemTitle>
              </TableCell>
              {listStatusAllow.map((status) => {
                const statusTotal = benchmarkTotals.statusTotals.find((s) => s.status === status);
                if (!statusTotal) return <TableCell key={status} className="p-4" />;

                return (
                  <TableCell key={status} className="p-4">
                    <ItemContent className="items-end gap-1 p-0">
                      <ItemDescription className="text-xs font-bold uppercase">{statusTotal.percentual.toFixed(1)}%</ItemDescription>
                      <ItemActions className="gap-1 items-baseline">
                        <ItemTitle>{(statusTotal.minutes / 60).toFixed(1)}</ItemTitle>
                        <ItemDescription className="text-xs uppercase">HR</ItemDescription>
                      </ItemActions>
                      <ItemActions className="gap-1 items-baseline">
                        <ItemTitle>{statusTotal.distance.toFixed(2)}</ItemTitle>
                        <ItemDescription className="text-xs uppercase">NM</ItemDescription>
                      </ItemActions>
                    </ItemContent>
                  </TableCell>
                );
              })}
              <TableCell className="p-4">
                <ItemContent className="items-end gap-1 p-0">
                  <ItemActions className="gap-1 items-baseline">
                    <ItemTitle>{(benchmarkTotals.totalAllMinutes / 60).toFixed(1)}</ItemTitle>
                    <ItemDescription className="text-xs uppercase">HR</ItemDescription>
                  </ItemActions>
                  <ItemActions className="gap-1 text-primary items-baseline">
                    <ItemTitle>{benchmarkTotals.totalAllDistance.toFixed(2)}</ItemTitle>
                    <ItemDescription className="text-xs uppercase">NM</ItemDescription>
                  </ItemActions>
                </ItemContent>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}

function TimeOperationTableRow({ row, columns, filters }: { row: TimeOperationData; columns: DataTableColumn<TimeOperationData>[]; filters: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TableRow className="cursor-pointer" onClick={() => setIsOpen(true)}>
        {columns.map((column) => (
          <TableCell key={String(column.key)} className="p-4">
            {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '')}
          </TableCell>
        ))}
      </TableRow>
      {isOpen && <TimeOperationDetailsDialog open={isOpen} onOpenChange={setIsOpen} item={row} filters={filters} />}
    </>
  );
}
