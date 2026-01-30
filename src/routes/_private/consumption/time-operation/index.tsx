import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { endOfDay, parseISO, startOfDay, subDays } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ItemDescription } from '@/components/ui/item';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { formatDate } from '@/lib/formatDate';
import { TimeOperationFilter } from './@components/time-operation-filter';
import { TimeOperationTable } from './@components/time-operation-table';
import { useTimeOperationDashboard } from './@hooks/use-time-operation-api';
import { OPERATION_MODES, timeOperationSearchParamsSchema } from './@interface/time-operation.types';

export const Route = createFileRoute('/_private/consumption/time-operation/')({
  component: TimeOperationDashboardPage,
  validateSearch: timeOperationSearchParamsSchema,
});

function TimeOperationDashboardPage() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { idEnterprise } = useEnterpriseFilter();

  const [orderColumn, setOrderColumn] = useState<{ column: string; order: 'asc' | 'desc' } | null>(null);

  // Initialize state from URL params or defaults
  const dateMinStr = search.dateMin || formatDate(startOfDay(subDays(new Date(), 8)), "yyyy-MM-dd'T'00:00:00XXX");
  const dateMaxStr = search.dateMax || formatDate(endOfDay(subDays(new Date(), 1)), "yyyy-MM-dd'T'23:59:59XXX");

  const { data: rawData, isLoading } = useTimeOperationDashboard(idEnterprise, search.machines, dateMinStr, dateMaxStr, search.isShowDisabled, search.unit);

  // Process data: combine "transit" and "underway using engine" into "UNDERWAY USING ENGINE"
  // (Pattern followed from statistics/time-operation)
  const preProcessData = useMemo(() => {
    if (!rawData) return [];
    return rawData.map((x) => {
      const listTimeStatusTransit = x.listTimeStatus?.filter((y) => y.status?.toLowerCase() === 'transit') || [];
      const listTimeStatusUnderway =
        x.listTimeStatus?.filter((y) =>
          ['underway using engine', 'underway_using_engine', 'underway', 'under way', 'under way using engine', 'under_way_using_engine'].includes(y.status?.toLowerCase()),
        ) || [];

      return {
        ...x,
        listTimeStatus: [
          ...(x.listTimeStatus?.filter(
            (y) =>
              !['underway using engine', 'underway_using_engine', 'underway', 'under way', 'under way using engine', 'under_way_using_engine', 'transit'].includes(
                y.status?.toLowerCase(),
              ),
          ) || []),
          {
            status: 'UNDERWAY USING ENGINE',
            minutes: listTimeStatusTransit.reduce((a, b) => a + (b.minutes || 0), 0) + listTimeStatusUnderway.reduce((a, b) => a + (b.minutes || 0), 0),
            consumption: listTimeStatusTransit.reduce((a, b) => a + (b.consumption || 0), 0) + listTimeStatusUnderway.reduce((a, b) => a + (b.consumption || 0), 0),
          },
        ],
      };
    });
  }, [rawData]);

  // Get statuses present in data and filter by OPERATION_MODES order
  const listStatusAllow = useMemo(() => {
    const statuses = new Set<string>();
    preProcessData.forEach((x) => {
      x.listTimeStatus?.forEach((y) => {
        if (y.status) statuses.add(y.status.toLowerCase());
      });
    });

    // Intersect with OPERATION_MODES values
    const orderedValues = OPERATION_MODES.map((m) => m.value);
    // Note: statistics uses a simplified list, we keep it consistent
    return orderedValues.filter((v) =>
      Array.from(statuses).some((s) => {
        const mode = OPERATION_MODES.find((m) => m.value === v);
        return mode?.accept.includes(s) || s === 'underway using engine'; // 'underway using engine' is our normalized key
      }),
    );
  }, [preProcessData]);

  // Normalize data with percentages for sorting
  const normalizedData = useMemo(() => {
    if (!preProcessData) return [];
    const dataNormalized = preProcessData.map((x) => {
      const totalAllStatusInMinutes = x.listTimeStatus?.reduce((a, b) => a + (b.minutes || 0), 0) || 0;

      const percentuals: Record<string, number> = {};
      listStatusAllow.forEach((v) => {
        const mode = OPERATION_MODES.find((m) => m.value === v);
        const statusItem = x.listTimeStatus?.find((z) => mode?.accept.includes(z.status?.toLowerCase()) || (v === 'underway' && z.status === 'UNDERWAY USING ENGINE'));
        percentuals[v] = totalAllStatusInMinutes > 0 && statusItem ? (statusItem.minutes / totalAllStatusInMinutes) * 100 : 0;
      });

      return {
        ...x,
        ...percentuals,
      };
    });

    if (orderColumn?.column) {
      return dataNormalized.sort((a, b) => {
        const aValue = ((a as any)[orderColumn.column] as number) ?? 0;
        const bValue = ((b as any)[orderColumn.column] as number) ?? 0;
        return orderColumn.order === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    return dataNormalized;
  }, [preProcessData, listStatusAllow, orderColumn]);

  const handleFilterChange = useCallback(
    (newFilters: any) => {
      navigate({
        search: (prev: any) => ({
          ...prev,
          ...newFilters,
        }),
      });
    },
    [navigate],
  );

  return (
    <Card>
      <CardHeader title={t('consumption.time.operation')}>
        {dateMinStr && dateMaxStr && (
          <ItemDescription>
            {formatDate(parseISO(dateMinStr), 'dd MMM yyyy')} - {formatDate(parseISO(dateMaxStr), 'dd MMM yyyy')}
          </ItemDescription>
        )}
      </CardHeader>

      <CardContent>
        <TimeOperationFilter
          idEnterprise={idEnterprise}
          filters={{ ...search, dateMin: dateMinStr, dateMax: dateMaxStr }}
          onFilterChange={handleFilterChange}
          isLoading={isLoading}
        />
        <TimeOperationTable
          data={normalizedData}
          listStatusAllow={listStatusAllow}
          orderColumn={orderColumn}
          onOrderChange={setOrderColumn}
          unit={search.unit || 'm³'}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
