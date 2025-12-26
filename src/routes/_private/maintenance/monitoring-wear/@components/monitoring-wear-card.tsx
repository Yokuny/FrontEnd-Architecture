import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
    <div className="flex flex-col border rounded-lg overflow-hidden transition-all duration-200" style={{ borderLeft: '6px solid hsl(var(--primary))' }}>
      <div className="flex items-center justify-between p-4 bg-background">
        <div className="flex items-center gap-4">
          <Avatar className="size-12 rounded-lg">
            <AvatarImage src={data.machine.image?.url} alt={data.machine.name} className="object-cover" />
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground leading-none mb-1">{data.machine.name}</p>
            <p className="text-xs text-muted-foreground">{data.enterprise.name}</p>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="hover:bg-accent transition-transform">
          {isExpanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
        </Button>
      </div>

      {isExpanded && (
        <div className="p-4 pt-0 border-t bg-accent/5">
          <MonitoringWearDetails idMachine={data.machine.id} />
        </div>
      )}
    </div>
  );
}
