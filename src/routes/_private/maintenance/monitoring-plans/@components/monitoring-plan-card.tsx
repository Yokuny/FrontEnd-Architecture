import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item';
import type { MonitoringMachine } from '../@interface/monitoring-plan.types';
import { MonitoringPlanItem } from './monitoring-plan-item';

interface MonitoringPlanCardProps {
  machine: MonitoringMachine;
}

export function MonitoringPlanCard({ machine }: MonitoringPlanCardProps) {
  const initials = machine.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground">
      <Item variant="default" className="border-b bg-muted/10">
        <Avatar className="size-14">
          <AvatarImage src={machine.image?.url} alt={machine.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <ItemContent>
          <ItemTitle className="font-semibold text-base tracking-tight">{machine.name}</ItemTitle>
          <ItemDescription className="text-xs">{machine.enterprise?.name}</ItemDescription>
        </ItemContent>
      </Item>

      <ItemGroup className="space-y-2 border-t p-4">
        {machine.monitoringPlan?.map((planItem, index) => (
          <MonitoringPlanItem key={`${planItem.idMaintenancePlan}-${index}`} planItem={planItem} idMachine={machine.idMachine} />
        ))}
      </ItemGroup>
    </div>
  );
}
