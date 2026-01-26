import { ArrowRight, Box, Package } from 'lucide-react';
import { Item, ItemContent, ItemHeader, ItemTitle } from '@/components/ui/item';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import type { IntegrationVoyage } from '../@interface/voyage-integration';

interface ItemVoyageProps {
  item: IntegrationVoyage;
  isActive?: boolean;
  onClick?: () => void;
}

export function ItemVoyage({ item, isActive, onClick }: ItemVoyageProps) {
  return (
    <Item
      variant={isActive ? 'muted' : 'default'}
      className={cn('cursor-pointer flex-col items-stretch gap-2 transition-colors hover:bg-accent/50', isActive && 'border-primary')}
      onClick={onClick}
    >
      <ItemHeader>
        <ItemTitle className="font-bold text-sm">{item.code}</ItemTitle>
      </ItemHeader>

      <ItemContent className="gap-2">
        <div className="flex items-center justify-between gap-2 text-muted-foreground text-xs">
          <div className="flex flex-1 flex-col truncate">
            <span className="font-medium text-foreground">{item.portStart || '-'}</span>
            <span>{item.dateTimeStart ? formatDate(new Date(item.dateTimeStart), 'dd MMM, HH:mm') : '-'}</span>
          </div>
          <ArrowRight className="size-4 shrink-0 opacity-50" />
          <div className="flex flex-1 flex-col truncate text-right">
            <span className="font-medium text-foreground">{item.portEnd || '-'}</span>
            <span>{item.dateTimeLastArrival ? formatDate(new Date(item.dateTimeLastArrival), 'dd MMM, HH:mm') : '-'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-dashed pt-2">
          <div className="flex items-center gap-1.5 truncate text-[11px] text-muted-foreground">
            <Package className="size-3.5" />
            <span className="truncate">{item.loadDescription || '-'}</span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 text-[11px] text-muted-foreground">
            <Box className="size-3.5" />
            <span>{item.loadWeight?.toFixed(1) || '0.0'} T</span>
          </div>
        </div>
      </ItemContent>
    </Item>
  );
}
