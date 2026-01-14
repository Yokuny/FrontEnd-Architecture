import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTrackingLocations } from '@/hooks/use-tracking-activity-api';
import { CHART_HEIGHT, TOP_BAR_LIMIT } from '../@consts';
import type { LocationData, TrackingFilters } from '../@interface';

export function LocationsChart({ filters }: LocationsChartProps) {
  const { t } = useTranslation();
  const { data: rawData, isLoading } = useTrackingLocations(filters);
  const data = rawData as LocationData[] | undefined;

  const tableData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data
      .filter((item) => item.location?.city || item.location?.state)
      .map((item) => ({
        location: `${item.location?.city || '-'} (${item.location?.state || '-'})`,
        total: item.total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, TOP_BAR_LIMIT);
  }, [data]);

  if (isLoading) return <Skeleton className={`${CHART_HEIGHT} w-full`} />;

  return (
    <div className={`${CHART_HEIGHT} w-full overflow-auto`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('location')}</TableHead>
            <TableHead className="text-right">{t('accesses')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.location}</TableCell>
              <TableCell className="text-right">{item.total}</TableCell>
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

interface LocationsChartProps {
  filters: TrackingFilters;
}
