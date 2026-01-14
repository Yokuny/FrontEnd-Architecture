import { Clock, Navigation, Ship } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyData from '@/components/default-empty-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import type { TimeOperationData } from '@/hooks/use-statistics-api';

interface TimeOperationTableProps {
  data: TimeOperationData[];
}

export function TimeOperationTable({ data }: TimeOperationTableProps) {
  const { t } = useTranslation();

  // Extract all unique statuses from the data to build dynamic columns
  const allStatuses = useMemo(() => {
    const statuses = new Set<string>();
    data.forEach((item) => {
      item.listTimeStatus?.forEach((ts) => {
        if (ts.status) statuses.add(ts.status.toLowerCase());
      });
    });
    // This could be sorted by a predefined order if needed
    return Array.from(statuses);
  }, [data]);

  const columns = useMemo(() => {
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
        sortable: true,
      },
    ];

    const statusColumns: DataTableColumn<TimeOperationData>[] = allStatuses.map((status) => ({
      key: status as any,
      header: t(status), // You might want a fallback or more mapping here
      render: (_, row) => {
        const itemStatus = row.listTimeStatus?.find((s) => s.status.toLowerCase() === status);
        if (!itemStatus) return <span className="text-muted-foreground">-</span>;

        const totalMinutes = row.listTimeStatus.reduce((acc, curr) => acc + (curr.minutes || 0), 0);
        const percentual = totalMinutes > 0 ? (itemStatus.minutes / totalMinutes) * 100 : 0;

        return (
          <div className="flex flex-col gap-1 items-end">
            <span className="text-[10px] text-muted-foreground font-bold">{percentual.toFixed(0)}%</span>
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
    }));

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
    };

    return [...baseColumns, ...statusColumns, totalColumn];
  }, [allStatuses, t]);

  if (!data || data.length === 0) {
    return <EmptyData />;
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <DataTable data={data} columns={columns} bordered={false} searchable={false} className="border-none shadow-none py-0" itemsPerPage={20} />
    </div>
  );
}
