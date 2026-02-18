import { AlertTriangle, CheckCircle2, Info, Minus, TrendingDown, TrendingUp, XCircle } from 'lucide-react';
import { ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { cn } from '@/lib/utils';
import type { IInsight } from '../@interface/ai-search.interface';

const insightConfig = {
  info: {
    icon: Info,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  success: {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  critical: {
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
} as const;

function TrendIcon({ trend }: { trend?: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <TrendingUp className="size-3.5" />;
  if (trend === 'down') return <TrendingDown className="size-3.5" />;
  return <Minus className="size-3.5" />;
}

export function AIInsights({ insights }: AIInsightsProps) {
  if (!insights || insights.length === 0) return null;

  return (
    <ItemContent>
      {insights.map((insight) => {
        const config = insightConfig[insight.type] || insightConfig.info;
        const Icon = config.icon;

        return (
          <div key={insight.text} className={cn('flex items-start gap-2.5 rounded-md border p-2.5', config.border, config.bg)}>
            <Icon className={cn('size-4 shrink-0', config.color)} />
            <ItemContent className="gap-0">
              <ItemDescription className="text-foreground text-xs">{insight.text}</ItemDescription>
              {insight.metric && (
                <div className="flex flex-wrap items-center gap-2">
                  <ItemTitle className="text-xs tabular-nums">{typeof insight.metric.value === 'number' ? insight.metric.value.toLocaleString() : insight.metric.value}</ItemTitle>
                  {insight.metric.unit && <ItemDescription className="leading-none">{insight.metric.unit}</ItemDescription>}
                  {insight.metric.trend && (
                    <div className={cn(insight.metric.trend === 'up' ? 'text-emerald-500' : insight.metric.trend === 'down' ? 'text-red-500' : 'text-muted-foreground')}>
                      <TrendIcon trend={insight.metric.trend} />
                      {insight.metric.changePercent != null && (
                        <span className="tabular-nums">
                          {insight.metric.changePercent > 0 ? '+' : ''}
                          {insight.metric.changePercent}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </ItemContent>
          </div>
        );
      })}
    </ItemContent>
  );
}

interface AIInsightsProps {
  insights: IInsight[];
}
