import { StatusIndicator } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { STATUS_VARIANTS } from '../@consts/heatmap-panel.consts';
import type { TrackerItem } from '../@interface/heatmap-panel.types';

export function StatusTracker({ items, onItemClick }: StatusTrackerProps) {
  return (
    <div className="flex items-center justify-center gap-1">
      {items.map((item, index) => {
        if (item.isEmpty) {
          return <div key={index} className="size-3 rounded-full bg-muted" />;
        }

        const variant = STATUS_VARIANTS[item.status || 'Basic'] || 'secondary';

        return (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <button type="button" onClick={() => onItemClick?.(item)} className="cursor-pointer transition-transform hover:scale-125">
                <StatusIndicator status={variant} />
              </button>
            </TooltipTrigger>
            <TooltipContent>{item.tooltip || '-'}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

interface StatusTrackerProps {
  items: TrackerItem[];
  onItemClick?: (item: TrackerItem) => void;
}
