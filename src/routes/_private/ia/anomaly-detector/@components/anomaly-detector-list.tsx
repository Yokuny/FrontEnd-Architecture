import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, Check, CloudOff } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { cn } from '@/lib/utils';
import type { AIAsset } from '../@interface/anomaly-detector.types';
import { StatusIcon } from './status-icon';

interface AnomalyDetectorListProps {
  data: AIAsset[];
  onShowDetails: (sensors: Record<string, number>) => void;
}

interface AISearchableAsset extends AIAsset {
  machineName: string;
}

export function AnomalyDetectorList({ data, onShowDetails }: AnomalyDetectorListProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const displayData = useMemo<AISearchableAsset[]>(() => {
    return data.map((item) => ({
      ...item,
      machineName: item.asset.name,
    }));
  }, [data]);

  const columns: DataTableColumn<AISearchableAsset>[] = [
    {
      key: 'machineName',
      header: t('machine'),
      render: (_, row) => (
        <div
          className="group/item flex cursor-pointer items-center gap-3"
          onClick={() =>
            navigate({
              to: '/remote-ihm' as any,
              search: {
                idAsset: row.asset.id,
                name: row.asset.name,
                type: 'DGs',
              } as any,
            })
          }
        >
          <Avatar className="size-12 rounded-full border-2 border-background transition-all group-hover/item:border-primary/20">
            <AvatarImage src={row.asset.image?.url} alt={row.asset.name} />
            <AvatarFallback className="bg-primary/5 text-primary">{row.asset.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <ItemContent>
            <ItemTitle className="truncate font-bold text-sm transition-colors group-hover/item:text-primary">{row.asset.name}</ItemTitle>
            <ItemDescription className="truncate text-xs">{row.asset.modelMachine?.description}</ItemDescription>
          </ItemContent>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'operation',
      header: t('mode.operation'),
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <div className={cn('rounded-full bg-muted p-1.5', value === 'operating' && 'bg-lime-100 text-lime-700', row.status === 'anomaly' && 'bg-red-100 text-red-800')}>
            {value === 'operating' ? <Check className="size-4" /> : <CloudOff className="size-4" />}
          </div>
          <span
            className={cn(
              'font-bold text-xs uppercase tracking-wider',
              row.status === 'anomaly' && 'text-red-800',
              value === 'operating' && 'text-lime-700',
              !value && 'text-muted-foreground',
            )}
          >
            {value ? t(value) : '-'}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'status',
      header: t('status'),
      render: (value, row) => (
        <div
          className={cn('group/status flex items-center justify-between', row.is_anomaly && 'cursor-pointer')}
          onClick={() => row.is_anomaly && onShowDetails(row.important_features || {})}
        >
          <StatusIcon status={value} />
          {row.is_anomaly && <ArrowRight className="size-4 text-primary opacity-0 transition-opacity group-hover/status:opacity-100" />}
        </div>
      ),
      sortable: true,
    },
  ];

  return (
    <DataTable
      className="border-none p-0"
      compact
      bordered={false}
      data={displayData}
      columns={columns}
      searchable={true}
      searchPlaceholder={t('search.placeholder')}
      itemsPerPage={20}
    />
  );
}
