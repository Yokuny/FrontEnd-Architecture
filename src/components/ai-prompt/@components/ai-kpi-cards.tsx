import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { cn } from '@/lib/utils';
import type { IInterpretedResponse } from '../@interface/ai-search.interface';

type KPI = NonNullable<IInterpretedResponse['kpis']>[number];

interface AIKpiCardsProps {
  kpis: KPI[];
}

function TrendIcon({ trend }: { trend?: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <ArrowUp className="size-3.5" />;
  if (trend === 'down') return <ArrowDown className="size-3.5" />;
  return <Minus className="size-3.5" />;
}

function trendColor(trend?: 'up' | 'down' | 'stable') {
  if (trend === 'up') return 'text-emerald-500';
  if (trend === 'down') return 'text-red-500';
  return 'text-muted-foreground';
}

export function AIKpiCards({ kpis }: AIKpiCardsProps) {
  if (!kpis || kpis.length === 0) return null;

  return (
    <div className="grid w-full grid-cols-2 gap-2">
      {kpis.map((kpi, idx) => (
        <Item key={`${kpi.label}-${idx}`} variant="outline" size="sm" className="flex-col items-start">
          <ItemContent>
            <ItemDescription className="line-clamp-1 text-xs">{kpi.label}</ItemDescription>
            <div className="flex items-baseline gap-2">
              <ItemTitle className="font-bold text-lg tabular-nums">{typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}</ItemTitle>
              {kpi.unit && <ItemDescription className="text-xs">{kpi.unit}</ItemDescription>}
            </div>
            {kpi.trend && (
              <div className={cn('flex items-center gap-1 text-xs', trendColor(kpi.trend))}>
                <TrendIcon trend={kpi.trend} />
                {kpi.changePercent != null && (
                  <span className="font-medium tabular-nums">
                    {kpi.changePercent > 0 ? '+' : ''}
                    {kpi.changePercent}%
                  </span>
                )}
              </div>
            )}
          </ItemContent>
        </Item>
      ))}
    </div>
  );
}
