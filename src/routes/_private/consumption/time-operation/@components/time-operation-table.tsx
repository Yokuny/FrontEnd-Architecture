import { Clock, Fuel, Ship } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { formatNumber } from '../../rve-sounding/@utils/format';
import { OPERATION_MODES } from '../@interface/time-operation.types';
import { getStatusConfig } from '../@utils/getStatusConfig';
import { RULES } from '../@utils/rules';

export function TimeOperationTable({ data, listStatusAllow, orderColumn, onOrderChange, unit, isLoading }: TimeOperationTableProps) {
  const { t } = useTranslation();

  const handleSort = (column: string) => {
    if (orderColumn?.column !== column) {
      onOrderChange({ column, order: 'desc' });
    } else if (orderColumn?.column === column && orderColumn?.order === 'desc') {
      onOrderChange({ column, order: 'asc' });
    } else {
      onOrderChange(null);
    }
  };

  const benchmarkTotals = useMemo(() => {
    if (!data || data.length === 0) return null;

    const totalAllMinutes = data.reduce((acc, curr) => acc + curr.listTimeStatus.reduce((sum: number, status: any) => sum + (status.minutes || 0), 0), 0);
    const totalAllConsumption = data.reduce((acc, curr) => acc + curr.listTimeStatus.reduce((sum: number, status: any) => sum + (status.consumption || 0), 0), 0);

    const statusTotals = listStatusAllow.map((v) => {
      const mode = OPERATION_MODES.find((m) => m.value === v);
      const minutesInStatus = data.reduce((acc, item) => {
        const statusItem = item.listTimeStatus?.find((s: any) => mode?.accept.includes(s.status?.toLowerCase()) || (v === 'underway' && s.status === 'UNDERWAY USING ENGINE'));
        return acc + (statusItem?.minutes || 0);
      }, 0);

      const consumptionInStatus = data.reduce((acc, item) => {
        const statusItem = item.listTimeStatus?.find((s: any) => mode?.accept.includes(s.status?.toLowerCase()) || (v === 'underway' && s.status === 'UNDERWAY USING ENGINE'));
        return acc + (statusItem?.consumption || 0);
      }, 0);

      const percentual = totalAllMinutes > 0 ? (minutesInStatus / totalAllMinutes) * 100 : 0;

      return {
        key: v,
        minutes: minutesInStatus,
        consumption: consumptionInStatus,
        percentual,
      };
    });

    return { totalAllMinutes, totalAllConsumption, statusTotals };
  }, [data, listStatusAllow]);

  if (isLoading) return <DefaultLoading />;
  if (!data || data.length === 0) return <DefaultEmptyData />;

  return (
    <div className="flex">
      <Table className="min-w-0">
        <TableHeader className="sticky top-0 z-20 bg-secondary">
          <TableRow className="hover:bg-transparent">
            <TableHead className="sticky left-0 z-30 min-w-[160px] bg-background/95 p-4 backdrop-blur">
              <ItemTitle className="text-muted-foreground uppercase">{t('machine')}</ItemTitle>
            </TableHead>

            {listStatusAllow.map((v) => {
              const statusConfig = getStatusConfig(v);
              const StatusIcon = statusConfig.icon;
              const ruleInfo = RULES[v];

              return (
                <TableHead key={v} className="group min-w-[180px] cursor-pointer border p-4 text-right transition-colors hover:bg-accent" onClick={() => handleSort(v)}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild className="flex items-center justify-end gap-2">
                        <div className="flex items-center gap-2">
                          <ItemMedia className={cn('size-6 p-1 transition-transform group-hover:scale-120', statusConfig.color)}>
                            <StatusIcon className="size-full" />
                          </ItemMedia>
                          <ItemTitle className="whitespace-nowrap text-muted-foreground transition-colors group-hover:text-foreground">{t(statusConfig.key)}</ItemTitle>
                        </div>
                      </TooltipTrigger>
                      {ruleInfo && (
                        <TooltipContent className="max-w-[250px] p-3">
                          {ruleInfo.rules.map((r, i) => (
                            <ItemTitle key={`${i}${r}`}>{r}</ItemTitle>
                          ))}
                          {ruleInfo.observation && <ItemDescription className="border-t pt-1 italic">{ruleInfo.observation}</ItemDescription>}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                  {orderColumn?.column === v && <span className="text-primary text-xs">{orderColumn.order === 'asc' ? '↑' : '↓'}</span>}
                </TableHead>
              );
            })}

            <TableHead className="sticky right-0 z-30 min-w-[150px] bg-background/30 uppercase backdrop-blur">
              <ItemTitle className="text-muted-foreground uppercase">{t('total')}</ItemTitle>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row, index) => (
            <TableRow key={`${index + 1}_${row.machine.id}`}>
              <TableCell className="sticky left-0 z-10 min-w-[200px] bg-background/30 p-2 backdrop-blur">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={row.machine.image?.url} alt={row.machine.name} />
                    <AvatarFallback className="bg-secondary text-primary">
                      <Ship className="size-5" />
                    </AvatarFallback>
                  </Avatar>
                  <ItemTitle className="tracking-tight">{row.machine.name}</ItemTitle>
                </div>
              </TableCell>

              {listStatusAllow.map((v) => {
                const mode = OPERATION_MODES.find((m) => m.value === v);
                const itemStatus = row.listTimeStatus?.find(
                  (s: any) => mode?.accept.includes(s.status?.toLowerCase()) || (v === 'underway' && s.status === 'UNDERWAY USING ENGINE'),
                );

                if (!itemStatus)
                  return (
                    <TableCell key={v} className="border-l px-4 text-right">
                      -
                    </TableCell>
                  );

                const percentual = row[v] ?? 0;
                const hoursValue = (itemStatus.minutes || 0) / 60;
                const consumptionValue = itemStatus.consumption || 0;

                return (
                  <TableCell key={v} className="min-w-[160px] border-l p-2">
                    <ItemContent className="items-end p-0">
                      <ItemDescription className="font-bold text-muted-foreground text-xs">{formatNumber(percentual, 0)}%</ItemDescription>
                      <ItemActions className="items-baseline gap-1">
                        <ItemTitle>{formatNumber(hoursValue, 1)}</ItemTitle>
                        <ItemDescription className="text-xs uppercase">HR</ItemDescription>
                        <Clock className="size-3 text-muted-foreground" />
                      </ItemActions>
                      <ItemActions className="items-baseline gap-1 text-sky-600">
                        <ItemTitle>{formatNumber(consumptionValue, 2)}</ItemTitle>
                        <ItemDescription className="text-xs uppercase">{unit}</ItemDescription>
                        <Fuel className="size-3" />
                      </ItemActions>
                    </ItemContent>
                  </TableCell>
                );
              })}

              <TableCell className="sticky right-0 z-10 min-w-[150px] bg-background/30 p-2 backdrop-blur">
                <ItemContent className="items-end">
                  <ItemActions>
                    <ItemTitle>{formatNumber(row.listTimeStatus.reduce((acc: number, curr: any) => acc + (curr.minutes || 0), 0) / 60, 1)}</ItemTitle>
                    <ItemDescription className="uppercase">HR</ItemDescription>
                  </ItemActions>
                  <ItemActions>
                    <ItemTitle>
                      {formatNumber(
                        row.listTimeStatus.reduce((acc: number, curr: any) => acc + (curr.consumption || 0), 0),
                        1,
                      )}
                    </ItemTitle>
                    <ItemDescription className="uppercase">{unit}</ItemDescription>
                  </ItemActions>
                </ItemContent>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        {benchmarkTotals && (
          <TableFooter className="sticky bottom-0 z-20">
            <TableRow>
              <TableCell className="sticky left-0 z-10 bg-secondary">
                <div className="flex flex-col gap-6">
                  <ItemTitle className="text-muted-foreground uppercase">{t('total')}</ItemTitle>
                  <ItemTitle className="text-muted-foreground uppercase">{t('medium')}</ItemTitle>
                </div>
              </TableCell>

              {listStatusAllow.map((v) => {
                const statusTotal = benchmarkTotals.statusTotals.find((s) => s.key === v);
                if (!statusTotal) return <TableCell key={v} className="border-l p-4" />;

                const avgPerHour = statusTotal.minutes / 60 > 0 ? statusTotal.consumption / (statusTotal.minutes / 60) : 0;
                const avgPerDay = avgPerHour * 24;

                return (
                  <TableCell key={v} className="bg-secondary">
                    <ItemContent className="items-end">
                      <ItemDescription className="font-bold text-xs uppercase">{statusTotal.percentual.toFixed(1)}%</ItemDescription>
                      <ItemActions className="items-baseline gap-1">
                        <ItemTitle>{(statusTotal.minutes / 60).toFixed(1)}</ItemTitle>
                        <ItemDescription className="uppercase">HR</ItemDescription>
                      </ItemActions>
                      <ItemActions className="items-baseline gap-1 text-sky-600">
                        <ItemTitle>{statusTotal.consumption.toFixed(2)}</ItemTitle>
                        <ItemDescription className="uppercase">{unit}</ItemDescription>
                      </ItemActions>

                      <div className="mt-2 w-full border-t pt-2 text-right">
                        <ItemActions className="items-baseline justify-end gap-1">
                          <ItemTitle>{avgPerHour.toFixed(2)}</ItemTitle>
                          <ItemDescription className="uppercase">{unit}/HR</ItemDescription>
                        </ItemActions>
                        <ItemActions className="items-baseline justify-end gap-1 text-sky-600">
                          <ItemTitle>{avgPerDay.toFixed(2)}</ItemTitle>
                          <ItemDescription className="uppercase">
                            {unit}/{t('day')}
                          </ItemDescription>
                        </ItemActions>
                      </div>
                    </ItemContent>
                  </TableCell>
                );
              })}

              <TableCell className="sticky right-0 z-10 bg-secondary p-4">
                <ItemContent className="items-end gap-1 font-bold">
                  <ItemActions className="items-baseline gap-1">
                    <ItemTitle className="text-sm">{(benchmarkTotals.totalAllMinutes / 60).toFixed(1)}</ItemTitle>
                    <ItemDescription className="uppercase">HR</ItemDescription>
                  </ItemActions>
                  <ItemActions className="items-baseline gap-1">
                    <ItemTitle>{benchmarkTotals.totalAllConsumption.toFixed(1)}</ItemTitle>
                    <ItemDescription className="uppercase">{unit}</ItemDescription>
                  </ItemActions>

                  <div className="mt-2 w-full border-muted-foreground/20 border-t pt-2 text-right font-bold">
                    <ItemActions className="items-baseline justify-end gap-1">
                      <ItemTitle>{(benchmarkTotals.totalAllConsumption / (benchmarkTotals.totalAllMinutes / 60 || 1)).toFixed(2)}</ItemTitle>
                      <ItemDescription className="uppercase">{unit}/HR</ItemDescription>
                    </ItemActions>
                    <ItemActions className="items-baseline justify-end gap-1 text-sky-600">
                      <ItemTitle className="font-bold">{((benchmarkTotals.totalAllConsumption / (benchmarkTotals.totalAllMinutes / 60 || 1)) * 24).toFixed(2)}</ItemTitle>
                      <ItemDescription className="uppercase">
                        {unit}/{t('day')}
                      </ItemDescription>
                    </ItemActions>
                  </div>
                </ItemContent>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}

interface TimeOperationTableProps {
  data: any[];
  listStatusAllow: string[];
  orderColumn: { column: string; order: 'asc' | 'desc' } | null;
  onOrderChange: (order: { column: string; order: 'asc' | 'desc' } | null) => void;
  unit: string;
  isLoading?: boolean;
}
