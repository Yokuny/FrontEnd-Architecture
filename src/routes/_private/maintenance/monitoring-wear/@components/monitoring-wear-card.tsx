import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
      <div
        role="button"
        tabIndex={0}
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
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

        <ItemActions className={cn('duration-500', isExpanded ? 'rotate-180' : '')}>
          <ChevronDown className="size-5" />
        </ItemActions>
      </div>

      {isExpanded && <MonitoringWearDetails idMachine={data.machine.id} />}
    </Item>
  );
}
