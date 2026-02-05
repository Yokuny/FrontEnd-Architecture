import { Ship, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { MAX_PERCENTAGE, OPERATIONAL_COLORS, OPERATIONAL_THRESHOLDS } from '../@const/operational-fleet.const';
import type { AssetOperationalRanking } from '../@interface/operational-dashboard.types';

interface OperationalKPIProps {
  data: AssetOperationalRanking[];
  isLoading: boolean;
}

export function OperationalKPI({ data, isLoading }: OperationalKPIProps) {
  const { t } = useTranslation();

  const stats = useMemo(() => {
    const total = data.length;
    const totalPercent = data.reduce((sum, item) => {
      const value = Number(item.percentualOperating) || 0;
      return sum + (value > MAX_PERCENTAGE ? MAX_PERCENTAGE : value);
    }, 0);
    const average = total ? totalPercent / total : 0;

    let colors = OPERATIONAL_COLORS.POOR;

    if (average >= OPERATIONAL_THRESHOLDS.EXCELLENT) {
      colors = OPERATIONAL_COLORS.EXCELLENT;
    } else if (average >= OPERATIONAL_THRESHOLDS.GOOD) {
      colors = OPERATIONAL_COLORS.GOOD;
    }

    return {
      total,
      average,
      averageColor: colors.text,
      badgeBgColor: colors.badgeBg,
      badgeTextColor: colors.badgeText,
    };
  }, [data]);

  if (isLoading) return <Skeleton className="h-[90px] w-full rounded-xl" />;
  if (stats.total === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2">
      <Item className="flex-col rounded-none border-0 bg-background">
        <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
          <ItemDescription className="font-medium">
            <Ship className="mr-1.5 inline size-4" />
            {t('vessels')}
          </ItemDescription>
        </ItemContent>
        <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{stats.total}</ItemTitle>
      </Item>

      <Item className="flex-col rounded-none border-0 bg-background">
        <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
          <ItemDescription className="font-medium">
            <TrendingUp className="mr-1.5 inline size-4" />
            {t('operational.average')}
          </ItemDescription>
          <Badge className={`rounded-sm ring-0 ${stats.badgeBgColor} font-bold ${stats.badgeTextColor}`}>{stats.average.toFixed(2)}%</Badge>
        </ItemContent>
        <ItemTitle className={`ml-6 font-bold text-2xl tracking-tight ${stats.averageColor}`}>{stats.average.toFixed(2)}%</ItemTitle>
      </Item>
    </div>
  );
}
