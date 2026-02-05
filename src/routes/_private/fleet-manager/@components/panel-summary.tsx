import { Archive, Calendar, Clock, Compass, Flag, Gauge, Navigation2, Waves } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { formatDate, formatDistanceToNow } from '@/lib/formatDate';
import { getNavigationStatusColor, getOperationStatusColor } from '../@hooks/status-utils';
import { useFleetMachines, useMachineDetails } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';
import { DetailGridItem } from './helpers/detail-items';
import { Proximity } from './helpers/proximity';

export function MachineSummaryPanel() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();
  const { selectedMachineId, statusMachine, operationMachines } = useFleetManagerStore();
  const { data: machineDetails, isLoading: isLoadingDetails } = useMachineDetails(selectedMachineId);
  const { data: machines, isLoading: isLoadingMachines } = useFleetMachines({ idEnterprise });

  const isLoading = isLoadingDetails || isLoadingMachines;

  if (isLoading || !machineDetails) return null;

  const data = machineDetails.data;
  const travel = machineDetails.travel;
  const machineInfo = machines?.find((m) => m.machine.id === selectedMachineId);

  // Normalize machine data
  const machine = {
    name: machineInfo?.machine?.name || travel?.machine?.name || (data as any)?.name || 'N/A',
    code: machineInfo?.machine?.code || (data as any)?.code || (data as any)?.id || selectedMachineId || 'N/A',
    image: machineInfo?.machine?.image || travel?.machine?.image || (data as any)?.image,
    model: machineInfo?.modelMachine?.description,
  };

  const navStatus = statusMachine?.find((x) => x.idMachine === selectedMachineId)?.statusNavigation || data.status;
  const opStatusValue = operationMachines?.find((o) => o?.machine?.id === selectedMachineId)?.value;

  const navColor = getNavigationStatusColor(navStatus as string);
  const opColor = getOperationStatusColor(opStatusValue as string);

  return (
    <ItemGroup className="space-y-4 p-4">
      {/* Header with Name, Code and Badges */}
      <ItemHeader className="flex-col">
        <div className="w-full items-baseline">
          <div className="flex justify-between">
            <span className="font-bold text-lg text-primary leading-tight">{machine.name}</span>
            {machine.model && <span className="font-bold text-muted-foreground uppercase tracking-tighter">{machine.model}</span>}
          </div>
          <span className="font-medium text-muted-foreground text-xs">{machine.code}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          {navStatus && (
            <Badge style={{ backgroundColor: navColor || undefined }} className="text-[10px] uppercase ring-0">
              {navStatus}
            </Badge>
          )}
          {opStatusValue && (
            <Badge style={{ backgroundColor: opColor || undefined }} className="text-[10px] uppercase ring-0">
              {opStatusValue}
            </Badge>
          )}
        </div>
      </ItemHeader>

      {/* Image and Floating Info */}
      <div className="group relative aspect-video overflow-hidden rounded-lg border bg-muted">
        {machine.image?.url ? (
          <img src={machine.image.url} alt={machine.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-accent/20 font-bold text-muted-foreground text-xs uppercase tracking-tight">{t('no.image')}</div>
        )}

        {/* Floating overlays for Speed, Course, Draught */}
        <div className="absolute right-0 bottom-0 left-0 flex items-end justify-around bg-linear-to-t from-black/80 via-black/40 to-transparent p-3">
          <div className="flex flex-col items-center">
            <Gauge className="mb-1 size-4 text-white" />
            <span className="font-bold text-[10px] text-white">{data.speed !== undefined ? data.speed.toFixed(1) : '-'} kn</span>
          </div>
          {data.draught !== undefined && (
            <div className="flex flex-col items-center">
              <Waves className="mb-1 size-4 text-white" />
              <span className="font-bold text-[10px] text-white">{data.draught.toFixed(1)} m</span>
            </div>
          )}
          <div className="flex flex-col items-center">
            <Compass className="mb-1 size-4 text-white" />
            <span className="font-bold text-[10px] text-white">{data.course !== undefined ? data.course.toFixed(1) : '-'}º</span>
          </div>
        </div>
      </div>

      {/* Grid of Info */}
      <div className="grid grid-cols-2 gap-4">
        <DetailGridItem
          label={t('departure')}
          icon={Calendar}
          value={
            travel?.dateTimeStart ? (
              <div className="flex flex-col items-center">
                <span>{formatDate(travel.dateTimeStart, 'dd MMM yy')}</span>
                <span className="font-medium text-[10px] text-muted-foreground">{formatDate(travel.dateTimeStart, 'HH:mm')}</span>
              </div>
            ) : (
              '-'
            )
          }
        />
        <DetailGridItem
          label="ETA"
          icon={Flag}
          value={
            travel?.metadata?.eta || data.eta ? (
              <div className="flex flex-col items-center">
                <span>{formatDate(travel?.metadata?.eta || data.eta || '', 'dd MMM yy')}</span>
                <span className="font-medium text-[10px] text-muted-foreground">{formatDate(travel?.metadata?.eta || data.eta || '', 'HH:mm')}</span>
              </div>
            ) : (
              '-'
            )
          }
        />
        <DetailGridItem label={t('travel')} icon={Archive} value={travel?.code || '-'} />
        <DetailGridItem label={t('destiny.port')} icon={Navigation2} value={travel?.portPointDestiny?.code || travel?.portPointEnd?.code || data.destiny || '-'} />
      </div>

      {/* Proximity and Last Update */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-1">
          <ItemTitle className="text-center font-bold text-[10px] text-muted-foreground uppercase">{t('proximity')}</ItemTitle>
          <div className="flex flex-col items-center text-center font-semibold text-xs">
            {data.position ? (
              <>
                <Proximity latitude={data.position[0]} longitude={data.position[1]} />
                <span className="mt-0.5 font-mono text-[9px] text-muted-foreground tabular-nums">
                  {data.position[0].toFixed(5)}, {data.position[1].toFixed(5)}
                </span>
              </>
            ) : (
              '-'
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ItemTitle className="text-center font-bold text-[10px] text-muted-foreground uppercase">{t('updated.in')}</ItemTitle>
          <div className="flex flex-col items-center text-center font-semibold text-xs">
            {data.lastUpdate ? (
              <>
                <div className="flex items-center gap-1">
                  <Clock className="size-3 text-muted-foreground" />
                  <span>{formatDistanceToNow(data.lastUpdate, { addSuffix: true })}</span>
                </div>
                <span className="mt-0.5 text-[9px] text-muted-foreground">{formatDate(data.lastUpdate, 'dd MM yy HH:mm')}</span>
              </>
            ) : (
              '-'
            )}
          </div>
        </div>
      </div>
    </ItemGroup>
  );
}
