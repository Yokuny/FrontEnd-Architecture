import { formatDistanceToNow } from 'date-fns';
import { Droplets, Gauge, Settings, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemMedia, ItemTitle } from '@/components/ui/item';
import { useFleetConsume } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';

export function FleetConsumePanel() {
  const { t } = useTranslation();
  const { selectedMachineId } = useFleetManagerStore();

  const { data: consumeData, isLoading } = useFleetConsume(selectedMachineId) as any;

  if (!selectedMachineId) return null;

  if (isLoading) {
    return (
      <ItemGroup className="p-4">
        <DefaultLoading />
      </ItemGroup>
    );
  }

  if (!consumeData) {
    return (
      <ItemGroup className="p-4 flex-1">
        <div className="flex-1 flex flex-col items-center justify-center min-h-96">
          <DefaultEmptyData />
        </div>
      </ItemGroup>
    );
  }

  return (
    <ItemGroup className="p-4 flex flex-col h-full gap-4">
      <div className="flex-1 grid grid-cols-2 gap-4">
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
    </ItemGroup>
  );
}

function MetricItem({ icon, label, value, subValue }: { icon: React.ReactNode; label: string; value: string; subValue?: string }) {
  return (
    <Item variant="muted" size="sm" className="flex-col items-start gap-2 p-4 rounded-xl border border-primary/5 bg-accent/30">
      <ItemHeader className="flex items-center gap-2">
        <ItemMedia>{icon}</ItemMedia>
        <ItemTitle className="text-[10px] uppercase font-bold tracking-tight text-muted-foreground">{label}</ItemTitle>
      </ItemHeader>
      <ItemContent className="flex flex-col gap-1">
        <div className="text-xl font-bold tracking-tight">{value}</div>
        {subValue && <ItemDescription className="text-[10px] text-muted-foreground font-medium">{subValue}</ItemDescription>}
      </ItemContent>
    </Item>
  );
}
