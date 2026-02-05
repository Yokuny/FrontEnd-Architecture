import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { useCMMSKPIs } from '@/hooks/use-cmms-rve-api';
import type { CMMSKPIItem, KPISCMMSFilters } from '../@interface/kpis-cmms.schema';

export function KPI({ filters }: { filters: KPISCMMSFilters & { min: string; max: string } }) {
  const { t } = useTranslation();
  const { data, isLoading } = useCMMSKPIs(filters);

  const kpis = useMemo(() => {
    if (!data) return null;
    const osOpen = data.filter((x: CMMSKPIItem) => !x.dataConclusao);
    const osClosed = data.filter((x: CMMSKPIItem) => x.dataConclusao);
    const osExpired = data.filter((x: CMMSKPIItem) => x.manutencaoVencida === 'Sim' || x.tipoManutencao === 'Corretiva Oriunda de Preditiva');

    const total = data.length;
    return {
      total,
      open: osOpen.length,
      closed: osClosed.length,
      expired: osExpired.length,
      openPercent: total > 0 ? (osOpen.length * 100) / total : 0,
      closedPercent: total > 0 ? (osClosed.length * 100) / total : 0,
      expiredPercent: total > 0 ? (osExpired.length * 100) / total : 0,
    };
  }, [data]);

  if (isLoading) return <Skeleton className="h-[90px] w-full rounded-xl" />;
  if (!kpis || kpis.total === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
      <Item className="flex-col rounded-none border-0 bg-background">
        <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
          <ItemDescription className="font-medium">{t('kpis.cmms.total.os')}</ItemDescription>
        </ItemContent>
        <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{kpis.total}</ItemTitle>
      </Item>

      <Item className="flex-col rounded-none border-0 bg-background">
        <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
          <ItemDescription className="font-medium">{t('kpis.cmms.open.os')}</ItemDescription>
          <Badge className="rounded-sm bg-amber-100 font-bold text-amber-700 ring-0">{kpis.openPercent.toFixed(1)}%</Badge>
        </ItemContent>
        <ItemTitle className="ml-6 font-bold text-2xl text-amber-600 tracking-tight">{kpis.open}</ItemTitle>
      </Item>

      <Item className="flex-col rounded-none border-0 bg-background">
        <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
          <ItemDescription className="font-medium">{t('kpis.cmms.closed.os')}</ItemDescription>
          <Badge className="rounded-sm bg-emerald-100 font-bold text-emerald-700 ring-0">{kpis.closedPercent.toFixed(1)}%</Badge>
        </ItemContent>
        <ItemTitle className="ml-6 font-bold text-2xl text-emerald-600 tracking-tight">{kpis.closed}</ItemTitle>
      </Item>

      <Item className="flex-col rounded-none border-0 bg-background">
        <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
          <ItemDescription className="font-medium">{t('predictive.deviation')}</ItemDescription>
          <Badge className="rounded-sm bg-red-100 font-bold text-red-700 ring-0">{kpis.expiredPercent.toFixed(1)}%</Badge>
        </ItemContent>
        <ItemTitle className="ml-6 font-bold text-2xl text-red-600 tracking-tight">{kpis.expired}</ItemTitle>
      </Item>
    </div>
  );
}
