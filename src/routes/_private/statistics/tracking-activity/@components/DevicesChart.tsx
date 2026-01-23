import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item';
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
    return data
      .map((item) => ({
        os: item.info?.osName || item.info?.os || '-',
        osVersion: item.info?.osVersion || '',
        browser: item.info?.browserName || '-',
        total: item.total,
      }))
      .sort((a, b) => b.total - a.total);
  }, [data]);

  if (isLoading) return <Skeleton className={`${CHART_HEIGHT} w-full`} />;

  const isEmpty = tableData.length === 0;

  return (
    <Item variant="outline" className="w-full flex-col items-stretch">
      <ItemHeader className="flex-col items-start gap-1">
        <ItemTitle>{t('devices')}</ItemTitle>
        <ItemDescription>{t('devices.description', 'Dispositivos utilizados para acesso')}</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {isEmpty ? (
          <DefaultEmptyData />
        ) : (
          <div className={`${CHART_HEIGHT} w-full overflow-auto`}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('device')}</TableHead>
                  <TableHead className="text-right">{t('accesses')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((item, index) => (
                  <TableRow key={`${item.os}-${item.osVersion}-${index}`}>
                    <TableCell>
                      <ItemTitle>
                        {item.os} {item.osVersion}
                      </ItemTitle>
                      <ItemDescription>{item.browser}</ItemDescription>
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

interface DevicesChartProps {
  filters: TrackingFilters;
}
