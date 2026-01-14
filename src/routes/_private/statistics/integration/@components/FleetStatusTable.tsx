import { format } from 'date-fns';
import { Anchor, MapPin, Ship } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EmptyData from '@/components/default-empty-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import type { FleetStatusData } from '@/hooks/use-statistics-api';

interface FleetStatusTableProps {
  data: FleetStatusData[];
}

export function FleetStatusTable({ data }: FleetStatusTableProps) {
  const { t } = useTranslation();

  const columns: DataTableColumn<FleetStatusData>[] = [
    {
      key: 'dataSheet',
      header: t('image'),
      width: '80px',
      render: (value, row) => (
        <Avatar className="size-10 border">
          <AvatarImage src={value?.image?.url} alt={row.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            <Ship className="size-5" />
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      key: 'name',
      header: t('name'),
      render: (value, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight">{value || '-'}</span>
          {(row.dataSheet?.imo || row.dataSheet?.mmsi) && (
            <span className="text-[10px] text-muted-foreground font-mono uppercase">{row.dataSheet?.imo ? `IMO: ${row.dataSheet.imo}` : `MMSI: ${row.dataSheet?.mmsi}`}</span>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'date',
      header: t('last.date.acronym'),
      render: (value) => (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-mono">{value ? format(new Date(value), 'dd/MM/yyyy') : '-'}</span>
          <span className="text-[10px] text-muted-foreground font-mono">{value ? format(new Date(value), 'HH:mm') : ''}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'eta',
      header: 'ETA',
      render: (value) => <span className="text-sm font-mono">{value || '-'}</span>,
    },
    {
      key: 'destiny',
      header: t('destiny.port'),
      render: (value) => (
        <div className="flex items-center gap-2">
          <Anchor className="size-3 text-muted-foreground" />
          <span className="text-sm">{value || '-'}</span>
        </div>
      ),
    },
    {
      key: 'integration',
      header: t('integration'),
      render: (value) => (
        <div className="flex items-center gap-2">
          <MapPin className="size-3 text-muted-foreground" />
          <span className="text-sm">{value || '-'}</span>
        </div>
      ),
    },
  ];

  if (!data || data.length === 0) {
    return <EmptyData />;
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <DataTable
        data={data}
        columns={columns}
        bordered={false}
        searchable={true}
        searchPlaceholder={t('search.placeholder')}
        className="border-none shadow-none py-0"
        itemsPerPage={20}
      />
    </div>
  );
}
