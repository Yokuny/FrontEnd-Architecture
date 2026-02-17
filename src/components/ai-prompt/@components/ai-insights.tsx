import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, Info, Minus, XCircle } from 'lucide-react';
import { ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { cn } from '@/lib/utils';
import type { IInsight } from '../@interface/ai-search.interface';

interface AIInsightsProps {
  insights: IInsight[];
}

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
  if (trend === 'up') return <ArrowUp className="size-3" />;
  if (trend === 'down') return <ArrowDown className="size-3" />;
  return <Minus className="size-3" />;
}

export function AIInsights({ insights }: AIInsightsProps) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="flex w-full flex-col gap-2">
      {insights.map((insight, idx) => {
        const config = insightConfig[insight.type] || insightConfig.info;
        const Icon = config.icon;

        return (
          <div key={`insight-${idx}`} className={cn('flex items-start gap-2.5 rounded-md border p-2.5', config.border, config.bg)}>
            <Icon className={cn('mt-0.5 size-4 shrink-0', config.color)} />
            <ItemContent>
              <ItemDescription className="line-clamp-none text-foreground text-xs leading-relaxed">{insight.text}</ItemDescription>
              {insight.metric && (
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <ItemTitle className="text-xs tabular-nums">
                    {typeof insight.metric.value === 'number' ? insight.metric.value.toLocaleString() : insight.metric.value}
                    {insight.metric.unit && <span className="ml-0.5 font-normal text-muted-foreground">{insight.metric.unit}</span>}
                  </ItemTitle>
                  {insight.metric.trend && (
                    <div
                      className={cn(
                        'flex items-center gap-0.5 text-xs',
                        insight.metric.trend === 'up' ? 'text-emerald-500' : insight.metric.trend === 'down' ? 'text-red-500' : 'text-muted-foreground',
                      )}
                    >
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
    </div>
  );
}
