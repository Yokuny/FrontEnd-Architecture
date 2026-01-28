import { useTranslation } from 'react-i18next';
import { StatusIndicator } from '@/components/ui/badge';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { BENCHMARK_ITEMS, STATUS_VARIANTS } from '../@consts/heatmap-panel.consts';
import type { HeatmapTotals } from '../@interface/heatmap-panel.types';

export function BenchmarkCards({ totals }: BenchmarkCardsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      {BENCHMARK_ITEMS.map((item) => (
        <Item key={item.key} variant="outline" className="flex-row items-center gap-3 p-3">
          <StatusIndicator status={STATUS_VARIANTS[item.status]} />
          <ItemContent>
            <ItemDescription>{t(item.labelKey)}</ItemDescription>
            <ItemTitle className="text-lg">{totals?.[item.key as keyof HeatmapTotals] || 0}</ItemTitle>
          </ItemContent>
        </Item>
      ))}
    </div>
  );
}

interface BenchmarkCardsProps {
  totals?: HeatmapTotals;
}
