import { formatDistanceToNow } from 'date-fns';
import { Droplets, Gauge, Settings, X, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { useFleetConsume, useMachineDetails } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';

export function FleetConsumePanel() {
  const { t } = useTranslation();
  const { selectedMachineId, setSelectedPanel } = useFleetManagerStore();

  const { data: machineData } = useMachineDetails(selectedMachineId) as any;
  const { data: consumeData, isLoading } = useFleetConsume(selectedMachineId) as any;

  const onClose = () => setSelectedPanel('details');

  if (!selectedMachineId) return null;

  return (
    <ItemGroup className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[800px] z-1001 flex flex-col shadow-2xl border border-primary/10 rounded-xl overflow-hidden bg-background/95 backdrop-blur-sm animate-in slide-in-from-bottom-4 pointer-events-auto">
      <Item size="sm" className="p-4 border-b border-primary/10 rounded-none bg-muted/30">
        <ItemHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Gauge className="size-5 text-primary" />
            </div>
            <div>
              <ItemTitle className="text-sm font-bold tracking-tight">
                {machineData?.machine?.name} - {t('consume')}
              </ItemTitle>
              <ItemDescription className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">{t('performance.metrics')}</ItemDescription>
            </div>
          </div>
          <ItemActions>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </ItemActions>
        </ItemHeader>
      </Item>

      <div className="p-6">
        {isLoading ? (
          <DefaultLoading />
        ) : (
          <div className="grid grid-cols-4 gap-4">
            <MetricItem
              icon={<Gauge className="size-4 text-blue-500" />}
              label={t('speed')}
              value={`${consumeData?.speed?.toFixed(1) || 0} kn`}
              subValue={consumeData?.lastUpdate ? formatDistanceToNow(new Date(consumeData.lastUpdate), { addSuffix: true }) : ''}
            />
            <MetricItem icon={<Settings className="size-4 text-orange-500" />} label="Engines" value={consumeData?.enginesRun || '0'} subValue="Working" />
            <MetricItem icon={<Zap className="size-4 text-yellow-500" />} label="Power" value={`${consumeData?.power?.toFixed(0) || 0} kW`} subValue="Actual" />
            <MetricItem
              icon={<Droplets className="size-4 text-cyan-500" />}
              label={t('consume')}
              value={`${consumeData?.comsuption?.toFixed(1) || 0} l/h`}
              subValue={consumeData?.comsuptionToday ? `Today: ${consumeData.comsuptionToday.toFixed(1)} m³` : ''}
            />
          </div>
        )}
      </div>
    </ItemGroup>
  );
}

function MetricItem({ icon, label, value, subValue }: { icon: React.ReactNode; label: string; value: string; subValue?: string }) {
  return (
    <Item variant="muted" size="sm" className="flex-col items-start gap-2 p-4 rounded-xl border border-primary/5">
      <ItemHeader className="flex items-center gap-2">
        {icon}
        <span className="text-[10px] uppercase font-bold tracking-tight text-muted-foreground">{label}</span>
      </ItemHeader>
      <ItemContent className="flex flex-col gap-1">
        <div className="text-xl font-bold tracking-tight">{value}</div>
        {subValue && <ItemDescription className="text-[10px] text-muted-foreground font-medium">{subValue}</ItemDescription>}
      </ItemContent>
    </Item>
  );
}
