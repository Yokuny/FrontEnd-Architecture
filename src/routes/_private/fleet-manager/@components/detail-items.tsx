import type { LucideIcon } from 'lucide-react';
import type React from 'react';
import { Item, ItemTitle } from '@/components/ui/item';

export function DetailGridItem({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: LucideIcon | any }) {
  return (
    <div className="space-y-1 flex flex-col items-center w-full">
      <ItemTitle className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-tight text-center">{label}</ItemTitle>
      <div className="text-xs font-semibold flex items-center gap-1.5">
        {Icon && <Icon className="size-3 text-muted-foreground shrink-0" />}
        <div className="truncate text-center text-ellipsis">{value}</div>
      </div>
    </div>
  );
}

export function DetailItemCard({ label, icon: Icon, value, color }: { label: string; icon: LucideIcon | any; value: string; color?: string }) {
  return (
    <Item className="flex-col items-start p-3 bg-accent/30 rounded-lg border border-primary/5 space-y-1">
      <div className="flex items-center gap-2">
        <Icon className={`size-3 text-primary ${color}`} />
        <span className="text-[10px] text-muted-foreground uppercase font-bold">{label}</span>
      </div>
      <p className="text-sm font-semibold">{value}</p>
    </Item>
  );
}
