import { PieChart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { useVoyageIntegrationStore } from '../@hooks/use-voyage-integration-store';
import type { IntegrationVoyageDetail } from '../@interface/voyage-integration';

export function AnalyticsVoyage({ voyages }: AnalyticsVoyageProps) {
  const { t } = useTranslation();
  const kickVoyageFilter = useVoyageIntegrationStore((state) => state.kickVoyageFilter);

  if (!voyages?.length) return null;

  const getVoyagesFiltered = () => {
    if (kickVoyageFilter) {
      return voyages
        ?.filter(
          (x) =>
            new Date(x.dateTimeDeparture).getTime() >= new Date(kickVoyageFilter.dateTimeDeparture).getTime() &&
            new Date(x.dateTimeArrival).getTime() >= new Date(kickVoyageFilter.dateTimeDeparture).getTime() &&
            new Date(x.dateTimeArrival).getTime() <= new Date(kickVoyageFilter.dateTimeArrival).getTime(),
        )
        ?.map((x) => x.analytics);
    }
    return voyages.map((x) => x.analytics);
  };

  const voyagesFiltered = getVoyagesFiltered();
  const sums = voyagesFiltered.reduce<{
    distance: number;
    speedAvg: number;
    speedAvgInOcean: number;
    ifo: number;
    ifoPort: number;
    ifoVoyage: number;
    mdo: number;
    lsf: number;
    mgo: number;
  }>(
    (a, b) => ({
      distance: a.distance + (b?.inVoyage?.distance || 0),
      speedAvg: a.speedAvg + (b?.inVoyage?.speedAvg || 0),
      speedAvgInOcean: a.speedAvgInOcean + (Number((b?.inVoyage?.avgData?.speedInOcean?.distance || 0) / (b?.inVoyage?.avgData?.speedInOcean?.time || 1)) || 0),
      ifo: a.ifo + (b?.inPort?.consume?.ifo || 0) + (b?.inVoyage?.consume?.ifo || 0),
      ifoPort: a.ifoPort + (b?.inPort?.consume?.ifo || 0),
      ifoVoyage: a.ifoVoyage + (b?.inVoyage?.consume?.ifo || 0),
      mdo: a.mdo + (b?.inPort?.consume?.mdo || 0) + (b?.inVoyage?.consume?.mdo || 0),
      lsf: a.lsf + (b?.inPort?.consume?.lsf || 0) + (b?.inVoyage?.consume?.lsf || 0),
      mgo: a.mgo + (b?.inPort?.consume?.mgo || 0) + (b?.inVoyage?.consume?.mgo || 0),
    }),
    { ifoPort: 0, ifoVoyage: 0, distance: 0, speedAvg: 0, speedAvgInOcean: 0, ifo: 0, mdo: 0, lsf: 0, mgo: 0 },
  );

  const getAvgSpeed = () => {
    const speedsMoreZero = voyagesFiltered.filter((x) => (x?.inVoyage?.avgData?.speed?.distance || 0) > 0);
    if (!speedsMoreZero.length) return 0;
    const distancesSums = speedsMoreZero.reduce((a, b) => a + (b?.inVoyage?.avgData?.speed?.distance || 0), 0);
    const timesSums = speedsMoreZero.reduce((a, b) => a + (b?.inVoyage?.avgData?.speed?.time || 0), 0);
    return timesSums ? distancesSums / timesSums : 0;
  };

  const getValueAvgSpeed = (propName: 'speedAvg' | 'speedAvgInOcean') => {
    const filteredAnalytics = kickVoyageFilter ? voyagesFiltered : voyages.map((v) => v.analytics);
    const filter = filteredAnalytics.filter((x) => ((x?.inVoyage as any)?.[propName] || 0) > 0);
    return filter.length ? (sums as any)[propName] / filter.length : 0;
  };

  const analytics: { description: string; value: number; unit: string; isInt?: boolean }[] = [
    { description: t('distance'), value: sums.distance, unit: voyages[0].analytics?.inPort?.distanceUnit || 'NM' },
    { description: t('speed.avg'), value: kickVoyageFilter ? getAvgSpeed() : getValueAvgSpeed('speedAvg'), unit: 'KN' },
    { description: t('speed.avg.in.ocean'), value: getValueAvgSpeed('speedAvgInOcean'), unit: 'KN' },
  ];

  if (sums.ifo) analytics.push({ description: 'IFO Total', value: sums.ifo, unit: 'ton' });
  if (sums.ifoPort) analytics.push({ description: 'IFO Porto', value: sums.ifoPort, unit: 'ton' });
  if (sums.ifoVoyage) analytics.push({ description: 'IFO Viagem', value: sums.ifoVoyage, unit: 'ton' });
  if (sums.lsf) analytics.push({ description: 'LSF', value: sums.lsf, unit: 'ton' });
  if (sums.mdo) analytics.push({ description: 'MDO', value: sums.mdo, unit: 'ton' });
  if (sums.mgo) analytics.push({ description: 'MGO', value: sums.mgo, unit: 'ton' });

  if (sums.ifoVoyage && kickVoyageFilter) {
    const timesSums = voyagesFiltered.reduce((a, b) => a + (b?.inVoyage?.avgData?.speed?.time || 0), 0);
    if (timesSums > 0) {
      analytics.push({ description: `${t('medium')} IFO/h`, value: (sums.ifoVoyage / timesSums) * 1000, unit: 'kg/h', isInt: true });
      analytics.push({ description: `${t('medium')} IFO/${t('day')}`, value: (sums.ifoVoyage / timesSums) * 24, unit: `ton/${t('day')}`, isInt: false });
    }
  }

  return (
    <div className="flex flex-col gap-3 border-b py-3">
      <ItemContent className="flex-row text-muted-foreground">
        <PieChart className="size-3 text-primary" />
        <ItemTitle className="text-xs uppercase tracking-wide">{t('indicators')}</ItemTitle>
      </ItemContent>

      <div className="grid grid-cols-2 gap-3">
        {analytics.map((item) => (
          <ItemContent key={`analytics-${item.description}`} className="gap-0 rounded-md border border-border/50 bg-secondary p-2">
            <ItemTitle className="truncate text-[10px] text-muted-foreground uppercase tracking-tighter">{item.description}</ItemTitle>
            <div className="flex items-baseline gap-1">
              <ItemTitle className="font-medium text-lg">{item.value.toFixed(item.isInt ? 0 : 1)}</ItemTitle>
              <ItemDescription className="font-medium text-xs uppercase">{item.unit}</ItemDescription>
            </div>
          </ItemContent>
        ))}
      </div>
    </div>
  );
}

interface AnalyticsVoyageProps {
  voyages: IntegrationVoyageDetail[];
}
