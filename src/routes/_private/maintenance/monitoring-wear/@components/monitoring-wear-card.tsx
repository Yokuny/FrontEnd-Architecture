import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { cn } from '@/lib/utils';
import type { MonitoringWearMachine } from '../@interface/monitoring-wear.types';
import { MonitoringWearDetails } from './monitoring-wear-details';

interface MonitoringWearCardProps {
  data: MonitoringWearMachine;
}

export function MonitoringWearCard({ data }: MonitoringWearCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const initials = data.machine.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Item variant="outline" className="flex-col items-stretch! overflow-hidden group/card">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-4">
          <Avatar className="size-12">
            <AvatarImage src={data.machine.image?.url} alt={data.machine.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <ItemContent>
            <ItemTitle>{data.machine.name}</ItemTitle>
            <ItemDescription>{data.enterprise.name}</ItemDescription>
          </ItemContent>
        </div>

        <ItemActions>
          <Button
            variant="ghost"
            size="icon"
            className={cn('rounded-full transition-all duration-300', isExpanded ? 'bg-primary/10 text-primary rotate-180' : 'hover:bg-primary/10 hover:text-primary')}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <ChevronDown className="size-5" />
          </Button>
        </ItemActions>
      </div>

      {isExpanded && (
        <div className="p-4 pt-0 border-t bg-accent/2 animate-in fade-in slide-in-from-top-2 duration-300">
          <MonitoringWearDetails idMachine={data.machine.id} />
        </div>
      )}
    </Item>
  );
}
