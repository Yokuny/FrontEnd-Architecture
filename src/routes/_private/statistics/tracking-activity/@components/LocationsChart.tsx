import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item';
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
        city: item.location?.city || '-',
        state: item.location?.state || '-',
        countryCode: item.location?.country_code || '-',
        total: item.total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, TOP_BAR_LIMIT);
  }, [data]);

  if (isLoading) return <Skeleton className={`${CHART_HEIGHT} w-full`} />;

  const isEmpty = tableData.length === 0;

  return (
    <Item variant="outline" className="flex-col items-stretch w-full">
      <ItemHeader className="flex-col items-start gap-1">
        <ItemTitle>{t('locations')}</ItemTitle>
        <ItemDescription>{t('locations.description', 'Localizações de acesso ao sistema')}</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {isEmpty ? (
          <DefaultEmptyData />
        ) : (
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
                  <TableRow key={`${item.city}-${index}`}>
                    <TableCell>
                      <ItemTitle>{item.city}</ItemTitle>
                      <ItemDescription>
                        {item.state} - {item.countryCode}
                      </ItemDescription>
                    </TableCell>
                    <TableCell className="text-right">
                      <ItemDescription className="text-primary">{item.total}</ItemDescription>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </ItemContent>
    </Item>
  );
}

interface LocationsChartProps {
  filters: TrackingFilters;
}
