import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { RVE_COLOR_MAPPING } from '../@consts/rve-dashboard.consts';
import type { OperationalCodeData } from '../@interface/rve-dashboard.types';

export function RVEKPIs({ data }: RVEKPIsProps) {
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

  return (
    <div className="flex w-full flex-wrap justify-between gap-4">
      <Item variant="outline" className="min-w-1/12 flex-1 border-l-4 border-l-muted">
        <ItemContent className="flex flex-col">
          <ItemDescription className="text-xs uppercase">{t('total.time')}</ItemDescription>
          <ItemTitle className="text-2xl">{totalHours.toFixed(2)} h</ItemTitle>
        </ItemContent>
      </Item>

      {categories.map((type) => {
        const categoryHours = getCategoryHours(type);
        const percentage = totalHours > 0 ? (categoryHours * 100) / totalHours : 0;
        const mapping = RVE_COLOR_MAPPING[type] || { border: 'border-l-muted', badge: 'bg-muted text-muted-foreground' };

        return (
          <Item variant="outline" key={type} className={`min-w-1/12 flex-1 border-l-4 ${mapping.border}`}>
            <ItemContent className="flex flex-col">
              <div className="flex items-center justify-between">
                <ItemDescription className="text-xs uppercase">{type}</ItemDescription>
                <Badge className={`rounded-sm font-bold ${mapping.badge}`}>{percentage.toFixed(1)}%</Badge>
              </div>
              <ItemTitle className="text-2xl">{categoryHours.toFixed(2)} h</ItemTitle>
            </ItemContent>
          </Item>
        );
      })}
    </div>
  );
}

interface RVEKPIsProps {
  data: OperationalCodeData[];
}
