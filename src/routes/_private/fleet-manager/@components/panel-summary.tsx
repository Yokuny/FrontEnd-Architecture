import { format, formatDistanceToNow } from 'date-fns';
import { enUS, es, ptBR } from 'date-fns/locale';
import { Archive, Calendar, Clock, Compass, Flag, Gauge, Navigation2, Waves } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { getNavigationStatusColor, getOperationStatusColor } from '../@hooks/status-utils';
import { useFleetMachines, useMachineDetails } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';
import { DetailGridItem } from './helpers/detail-items';
import { Proximity } from './helpers/proximity';

const locales: Record<string, any> = { pt: ptBR, en: enUS, es: es, 'pt-BR': ptBR };

export function MachineSummaryPanel() {
  const { t, i18n } = useTranslation();
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

  const language = i18n.language;
  const currentLocale = locales[language] || locales[language.split('-')[0]] || enUS;

  return (
    <ItemGroup className="p-4 space-y-4">
      {/* Header with Name, Code and Badges */}
      <ItemHeader className="flex-col">
        <div className="items-baseline w-full">
          <div className="flex justify-between">
            <span className="text-lg font-bold text-primary leading-tight">{machine.name}</span>
            {machine.model && <span className=" text-muted-foreground font-bold uppercase tracking-tighter">{machine.model}</span>}
          </div>
          <span className="text-xs text-muted-foreground font-medium">{machine.code}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          {navStatus && (
            <Badge style={{ backgroundColor: navColor || undefined }} className="text-[10px] uppercase">
              {navStatus}
            </Badge>
          )}
          {opStatusValue && (
            <Badge style={{ backgroundColor: opColor || undefined }} className="text-[10px] uppercase">
              {opStatusValue}
            </Badge>
          )}
        </div>
      </ItemHeader>

      {/* Image and Floating Info */}
      <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted group">
        {machine.image?.url ? (
          <img src={machine.image.url} alt={machine.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-accent/20 font-bold uppercase tracking-tight text-xs">{t('no.image')}</div>
        )}

        {/* Floating overlays for Speed, Course, Draught */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black/80 via-black/40 to-transparent flex justify-around items-end">
          <div className="flex flex-col items-center">
            <Gauge className="size-4 text-white mb-1" />
            <span className="text-[10px] font-bold text-white">{data.speed !== undefined ? data.speed.toFixed(1) : '-'} kn</span>
          </div>
          {data.draught !== undefined && (
            <div className="flex flex-col items-center">
              <Waves className="size-4 text-white mb-1" />
              <span className="text-[10px] font-bold text-white">{data.draught.toFixed(1)} m</span>
            </div>
          )}
          <div className="flex flex-col items-center">
            <Compass className="size-4 text-white mb-1" />
            <span className="text-[10px] font-bold text-white">{data.course !== undefined ? data.course.toFixed(1) : '-'}º</span>
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
                <span>{format(new Date(travel.dateTimeStart), 'dd MMM yy')}</span>
                <span className="text-[10px] text-muted-foreground font-medium">{format(new Date(travel.dateTimeStart), 'HH:mm')}</span>
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
                <span>{format(new Date(travel?.metadata?.eta || data.eta || ''), 'dd MMM yy')}</span>
                <span className="text-[10px] text-muted-foreground font-medium">{format(new Date(travel?.metadata?.eta || data.eta || ''), 'HH:mm')}</span>
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
          <ItemTitle className="text-[10px] text-muted-foreground uppercase font-bold text-center">{t('proximity')}</ItemTitle>
          <div className="text-xs font-semibold flex flex-col items-center text-center">
            {data.position ? (
              <>
                <Proximity latitude={data.position[0]} longitude={data.position[1]} />
                <span className="text-[9px] text-muted-foreground font-mono mt-0.5 tabular-nums">
                  {data.position[0].toFixed(5)}, {data.position[1].toFixed(5)}
                </span>
              </>
            ) : (
              '-'
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ItemTitle className="text-[10px] text-muted-foreground uppercase font-bold text-center">{t('updated.in')}</ItemTitle>
          <div className="text-xs font-semibold flex flex-col items-center text-center">
            {data.lastUpdate ? (
              <>
                <div className="flex items-center gap-1">
                  <Clock className="size-3 text-muted-foreground" />
                  <span>{formatDistanceToNow(new Date(data.lastUpdate), { addSuffix: true, locale: currentLocale })}</span>
                </div>
                <span className="text-[9px] text-muted-foreground mt-0.5">{format(new Date(data.lastUpdate), 'dd/MM/yy HH:mm')}</span>
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
