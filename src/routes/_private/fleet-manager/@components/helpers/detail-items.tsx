import type { LucideIcon } from 'lucide-react';
import type React from 'react';
import { Item, ItemTitle } from '@/components/ui/item';

export function DetailGridItem({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: LucideIcon | any }) {
  return (
    <div className="flex w-full flex-col items-center space-y-1">
      <ItemTitle className="truncate text-center font-bold text-[10px] text-muted-foreground uppercase tracking-tight">{label}</ItemTitle>
      <div className="flex items-center gap-1.5 font-semibold text-xs">
        {Icon && <Icon className="size-3 shrink-0 text-muted-foreground" />}
        <div className="truncate text-ellipsis text-center">{value}</div>
      </div>
    </div>
  );
}

export function DetailItemCard({ label, icon: Icon, value, color }: { label: string; icon: LucideIcon | any; value: string; color?: string }) {
  return (
    <Item className="flex-col items-start space-y-1 rounded-lg border border-primary/5 bg-accent/30 p-3">
      <div className="flex items-center gap-2">
        <Icon className={`size-3 text-primary ${color}`} />
        <span className="font-bold text-[10px] text-muted-foreground uppercase">{label}</span>
      </div>
      <p className="font-semibold text-sm">{value}</p>
    </Item>
  );
}
