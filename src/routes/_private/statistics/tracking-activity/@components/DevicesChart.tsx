import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTrackingDevices } from '@/hooks/use-tracking-activity-api';
import { CHART_HEIGHT } from '../@consts';
import type { DeviceData, TrackingFilters } from '../@interface';

export function DevicesChart({ filters }: DevicesChartProps) {
  const { t } = useTranslation();
  const { data: rawData, isLoading } = useTrackingDevices(filters);
  const data = rawData as DeviceData[] | undefined;

  const tableData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      name: item.device || (item.info ? `${item.info.osName || item.info.os || ''} ${item.info.browserName || ''}`.trim() : null) || t('unknown'),
      value: item.total,
    }));
  }, [data, t]);

  if (isLoading) return <Skeleton className={`${CHART_HEIGHT} w-full`} />;

  return (
    <div className={`${CHART_HEIGHT} w-full overflow-auto`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('device')}</TableHead>
            <TableHead className="text-right">{t('total')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-right">{item.value}</TableCell>
            </TableRow>
          ))}
          {tableData.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                {t('no.data')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

interface DevicesChartProps {
  filters: TrackingFilters;
}
