import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { MonitoringMachine } from '../@interface/monitoring-plan.types';
import { MonitoringPlanItem } from './monitoring-plan-item';

interface MonitoringPlanCardProps {
  machine: MonitoringMachine;
  onSelectItem: (idMachine: string, idMaintenancePlan: string, dateWindowEnd: string) => void;
}

export function MonitoringPlanCard({ machine, onSelectItem }: MonitoringPlanCardProps) {
  const initials = machine.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleItemClick = (planItem: { idMaintenancePlan: string; dateWindowEnd: string }) => {
    onSelectItem(machine.idMachine, planItem.idMaintenancePlan, planItem.dateWindowEnd);
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderLeft: '4px solid #1087DB' }}>
      <div className="flex items-center gap-4">
        <Avatar className="size-12">
          <AvatarImage src={machine.image?.url} alt={machine.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{machine.name}</p>
          <p className="text-sm text-muted-foreground">{machine.enterprise?.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-end">
        {machine.monitoringPlan?.map((planItem, index) => (
          <MonitoringPlanItem
            key={`${planItem.idMaintenancePlan}-${index}`}
            planItem={planItem}
            onClick={() => handleItemClick({ idMaintenancePlan: planItem.idMaintenancePlan, dateWindowEnd: planItem.dateWindowEnd })}
          />
        ))}
      </div>
    </div>
  );
}
