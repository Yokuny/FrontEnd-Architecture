import { AlertTriangle, Anchor, Clock, Gauge, Navigation, Radio, Ship, Wind, Zap } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyData from '@/components/default-empty-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import type { TimeOperationData } from '@/hooks/use-statistics-api';

interface TimeOperationTableProps {
  data: TimeOperationData[];
  listStatusAllow: string[];
  orderColumn: { column: string; order: 'asc' | 'desc' } | null;
  onOrderChange: (order: { column: string; order: 'asc' | 'desc' } | null) => void;
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

export function TimeOperationTable({ data, listStatusAllow, orderColumn, onOrderChange }: TimeOperationTableProps) {
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
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border">
              <AvatarImage src={value?.image?.url} alt={value?.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                <Ship className="size-5" />
              </AvatarFallback>
            </Avatar>
            <span className="font-bold text-sm tracking-tight">{value?.name || '-'}</span>
          </div>
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
          <div
            className="flex items-center justify-end gap-2 cursor-pointer hover:text-foreground transition-colors group"
            onClick={() => handleSort(status)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSort(status);
              }
            }}
          >
            <div className={`size-5 rounded-full border-2 flex items-center justify-center ${statusConfig.color}`}>
              <StatusIcon className="size-3" />
            </div>
            <span className="text-sm font-semibold">{t(statusConfig.key)}</span>
            {orderColumn?.column === status && <span className="text-xs text-primary">{orderColumn.order === 'asc' ? '↑' : '↓'}</span>}
          </div>
        ),
        render: (_, row) => {
          const itemStatus = row.listTimeStatus?.find((s) => s.status?.toLowerCase() === status);
          if (!itemStatus) return <span className="text-muted-foreground">-</span>;

          const totalMinutes = row.listTimeStatus.reduce((acc, curr) => acc + (curr.minutes || 0), 0);
          const percentual = totalMinutes > 0 ? (itemStatus.minutes / totalMinutes) * 100 : 0;

          // Use normalized percentage if available
          const normalizedPercent = row[status] ?? percentual;

          return (
            <div className="flex flex-col gap-1 items-end">
              <span className="text-[10px] text-muted-foreground font-bold">{normalizedPercent.toFixed(0)}%</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold">{(itemStatus.minutes / 60).toFixed(2)}</span>
                <span className="text-[10px] text-muted-foreground font-bold">HR</span>
                <Clock className="size-3 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold">{(itemStatus.distance || 0).toFixed(2)}</span>
                <span className="text-[10px] text-muted-foreground font-bold">NM</span>
                <Navigation className="size-3 text-muted-foreground" />
              </div>
            </div>
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
          <div className="flex flex-col gap-1 items-end">
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold">{(totalMinutes / 60).toFixed(1)}</span>
              <span className="text-[10px] text-muted-foreground font-bold">HR</span>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <span className="text-sm font-bold">{totalDistance.toFixed(1)}</span>
              <span className="text-[10px] font-bold">NM</span>
            </div>
          </div>
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
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead className="bg-muted/30 sticky top-0 z-10">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="text-left font-medium text-muted-foreground align-top p-6" style={column.width ? { width: column.width } : undefined}>
                  {typeof column.header === 'string' ? column.header : column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-card">
            {data.map((row, index) => (
              <tr key={`${index + 1}_${row?.machine?.id}`} className="border-t border-border bg-card transition-colors hover:bg-muted/30">
                {columns.map((column) => (
                  <td key={String(column.key)} className="text-sm text-foreground align-middle px-6 py-4">
                    {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
            {/* Benchmark Row */}
            {benchmarkTotals && (
              <tr className="border-t-2 border-border bg-muted/30 sticky bottom-0 font-semibold">
                <td className="text-sm text-muted-foreground align-middle px-6 py-4">{t('total')}</td>
                {listStatusAllow.map((status) => {
                  const statusTotal = benchmarkTotals.statusTotals.find((s) => s.status === status);
                  if (!statusTotal) return <td key={status} className="px-6 py-4" />;

                  return (
                    <td key={status} className="text-sm text-muted-foreground align-middle px-6 py-4">
                      <div className="flex flex-col gap-1 items-end">
                        <span className="text-[10px] font-bold">{statusTotal.percentual.toFixed(1)}%</span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold">{(statusTotal.minutes / 60).toFixed(1)}</span>
                          <span className="text-[10px] font-bold">HR</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold">{statusTotal.distance.toFixed(2)}</span>
                          <span className="text-[10px] font-bold">NM</span>
                        </div>
                      </div>
                    </td>
                  );
                })}
                <td className="text-sm text-muted-foreground align-middle px-6 py-4">
                  <div className="flex flex-col gap-1 items-end">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold">{(benchmarkTotals.totalAllMinutes / 60).toFixed(1)}</span>
                      <span className="text-[10px] font-bold">HR</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      <span className="text-sm font-bold">{benchmarkTotals.totalAllDistance.toFixed(2)}</span>
                      <span className="text-[10px] font-bold">NM</span>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
