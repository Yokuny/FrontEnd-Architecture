import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { RVE_COLOR_MAPPING } from '../@consts/rve-dashboard.consts';
import type { OperationalCodeData } from '../@interface/rve-dashboard.types';

export function KPI({ data }: RVEKPIsProps) {
  const { t } = useTranslation();

  const totalHours = useMemo(() => {
    return data.reduce((sum, item) => sum + (item.totalHoras || 0), 0);
  }, [data]);

  const categories = useMemo(() => {
    const types = data.map((x) => x.codigo?.value?.slice(0, 2)) || [];
    return [...new Set(types)].sort();
  }, [data]);

  const getCategoryHours = (type: string) => {
    return data.filter((x) => x.codigo?.value?.slice(0, 2) === type).reduce((sum, item) => sum + (item.totalHoras || 0), 0);
  };

  if (data.length === 0) return null;

  const allItems = [
    {
      type: 'total',
      hours: totalHours,
      percentage: 100,
      border: 'border-l-muted',
      badge: 'bg-muted text-muted-foreground',
    },
    ...categories.map((type) => {
      const categoryHours = getCategoryHours(type);
      const percentage = totalHours > 0 ? (categoryHours * 100) / totalHours : 0;
      const mapping = RVE_COLOR_MAPPING[type] || { border: 'border-l-muted', badge: 'bg-muted text-muted-foreground' };
      return {
        type,
        hours: categoryHours,
        percentage,
        border: mapping.border,
        badge: mapping.badge,
      };
    }),
  ];

  return (
    <div className="grid gap-px overflow-hidden rounded-xl border bg-border" style={{ gridTemplateColumns: `repeat(${allItems.length}, minmax(0, 1fr))` }}>
      {allItems.map((item) => (
        <Item key={item.type} className="flex-col rounded-none border-0 bg-background">
          <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
            <ItemDescription className="font-medium">{item.type === 'total' ? t('total.time') : item.type}</ItemDescription>
            {item.type !== 'total' && <Badge className={`rounded-sm font-bold ${item.badge}`}>{item.percentage.toFixed(1)}%</Badge>}
          </ItemContent>
          <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{item.hours.toFixed(2)} h</ItemTitle>
        </Item>
      ))}
    </div>
  );
}

interface RVEKPIsProps {
  data: OperationalCodeData[];
}
