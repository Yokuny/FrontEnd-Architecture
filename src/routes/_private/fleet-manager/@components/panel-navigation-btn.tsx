import { BarChart3, Box, Camera, Contact2, Info, LayoutDashboard, Phone, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';

export function FleetNavigation() {
  const { t } = useTranslation();
  const { selectedPanel, setSelectedPanel, selectedMachineId } = useFleetManagerStore();

  if (!selectedMachineId) return null;

  const navItems = [
    { id: 'summary', icon: LayoutDashboard, label: t('summary'), color: 'text-primary' },
    { id: 'details', icon: BarChart3, label: t('details'), color: 'text-primary' },
    { id: 'consume', icon: Zap, label: t('consume'), color: 'text-yellow-500' },
    { id: 'crew', icon: Contact2, label: t('crew'), color: 'text-blue-500' },
    { id: 'info', icon: Info, label: t('info'), color: 'text-muted-foreground' },
    { id: 'last-voyage', icon: Box, label: t('travel'), color: 'text-orange-500' },
    { id: 'cameras', icon: Camera, label: t('camera'), color: 'text-cyan-500' },
    { id: 'contacts', icon: Phone, label: t('contacts'), color: 'text-green-500' },
  ];

  return (
    <div className="absolute right-0 bottom-0 left-0 z-20 border-primary/10 border-t bg-background/90 p-2 backdrop-blur-md">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = selectedPanel === item.id || (item.id === 'summary' && selectedPanel === null);

          return (
            <Button
              key={item.id}
              variant={isActive ? 'secondary' : 'default'}
              size="sm"
              className="flex h-12 flex-col items-center justify-center gap-1 rounded-md px-1"
              onClick={() => setSelectedPanel(item.id as any)}
            >
              <Icon className={`size-3.5 ${item.color}`} />
              <span className="w-full truncate text-center font-bold text-[8px] uppercase tracking-tighter">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
