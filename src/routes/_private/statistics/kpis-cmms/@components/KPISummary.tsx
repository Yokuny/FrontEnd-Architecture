import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { useCMMSKPIs } from '@/hooks/use-cmms-rve-api';
import type { CMMSKPIItem, KPISCMMSFilters } from '../@interface/kpis-cmms.schema';

export function KPISummary({ filters }: { filters: KPISCMMSFilters & { min: string; max: string } }) {
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
    <div className="flex w-full flex-wrap justify-between gap-4">
      <Item variant="outline" className="min-w-[200px] flex-1 border-l-4 border-l-muted">
        <ItemContent className="flex flex-col">
          <ItemDescription className="font-bold text-xs uppercase">{t('kpis.cmms.total.os')}</ItemDescription>
          <ItemTitle className="font-bold text-3xl">{kpis.total}</ItemTitle>
        </ItemContent>
      </Item>

      <Item variant="outline" className="min-w-[200px] flex-1 border-l-4 border-l-amber-500">
        <ItemContent className="flex flex-col">
          <div className="flex items-center justify-between">
            <ItemDescription className="font-bold text-xs uppercase">{t('kpis.cmms.open.os')}</ItemDescription>
            <Badge className="rounded-sm border-none bg-amber-100 font-bold text-amber-700 shadow-none">{kpis.openPercent.toFixed(1)}%</Badge>
          </div>
          <ItemTitle className="font-bold text-3xl text-amber-600">{kpis.open}</ItemTitle>
        </ItemContent>
      </Item>

      <Item variant="outline" className="min-w-[200px] flex-1 border-l-4 border-l-emerald-500">
        <ItemContent className="flex flex-col">
          <div className="flex items-center justify-between">
            <ItemDescription className="font-bold text-xs uppercase">{t('kpis.cmms.closed.os')}</ItemDescription>
            <Badge className="rounded-sm border-none bg-emerald-100 font-bold text-emerald-700 shadow-none">{kpis.closedPercent.toFixed(1)}%</Badge>
          </div>
          <ItemTitle className="font-bold text-3xl text-emerald-600">{kpis.closed}</ItemTitle>
        </ItemContent>
      </Item>

      <Item variant="outline" className="min-w-[200px] flex-1 border-l-4 border-l-red-500">
        <ItemContent className="flex flex-col">
          <div className="flex items-center justify-between">
            <ItemDescription className="font-bold text-xs uppercase">{t('predictive.deviation')}</ItemDescription>
            <Badge className="rounded-sm border-none bg-red-100 font-bold text-red-700 shadow-none">{kpis.expiredPercent.toFixed(1)}%</Badge>
          </div>
          <ItemTitle className="font-bold text-3xl text-red-600">{kpis.expired}</ItemTitle>
        </ItemContent>
      </Item>
    </div>
  );
}
