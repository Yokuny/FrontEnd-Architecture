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
    <div className="flex justify-between gap-4 w-full flex-wrap">
      <Item variant="outline" className="border-l-4 border-l-muted min-w-[200px] flex-1">
        <ItemContent className="flex flex-col">
          <ItemDescription className="uppercase text-xs font-bold">{t('kpis.cmms.total.os')}</ItemDescription>
          <ItemTitle className="text-3xl font-bold">{kpis.total}</ItemTitle>
        </ItemContent>
      </Item>

      <Item variant="outline" className="border-l-4 border-l-amber-500 min-w-[200px] flex-1">
        <ItemContent className="flex flex-col">
          <div className="flex justify-between items-center">
            <ItemDescription className="uppercase text-xs font-bold">{t('kpis.cmms.open.os')}</ItemDescription>
            <Badge className="bg-amber-100 text-amber-700 font-bold rounded-sm border-none shadow-none">{kpis.openPercent.toFixed(1)}%</Badge>
          </div>
          <ItemTitle className="text-3xl font-bold text-amber-600">{kpis.open}</ItemTitle>
        </ItemContent>
      </Item>

      <Item variant="outline" className="border-l-4 border-l-emerald-500 min-w-[200px] flex-1">
        <ItemContent className="flex flex-col">
          <div className="flex justify-between items-center">
            <ItemDescription className="uppercase text-xs font-bold">{t('kpis.cmms.closed.os')}</ItemDescription>
            <Badge className="bg-emerald-100 text-emerald-700 font-bold rounded-sm border-none shadow-none">{kpis.closedPercent.toFixed(1)}%</Badge>
          </div>
          <ItemTitle className="text-3xl font-bold text-emerald-600">{kpis.closed}</ItemTitle>
        </ItemContent>
      </Item>

      <Item variant="outline" className="border-l-4 border-l-red-500 min-w-[200px] flex-1">
        <ItemContent className="flex flex-col">
          <div className="flex justify-between items-center">
            <ItemDescription className="uppercase text-xs font-bold">{t('kpis.cmms.expired.os')}</ItemDescription>
            <Badge className="bg-red-100 text-red-700 font-bold rounded-sm border-none shadow-none">{kpis.expiredPercent.toFixed(1)}%</Badge>
          </div>
          <ItemTitle className="text-3xl font-bold text-red-600">{kpis.expired}</ItemTitle>
        </ItemContent>
      </Item>
    </div>
  );
}
