import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { ItemDescription, ItemTitle } from '@/components/ui/item';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useVesselStatus, useVesselsLastState } from '@/hooks/use-telemetry-api';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { getNavigationStatusInfo, getStatusOperationInfo } from '../@utils/status.utils';

interface StatusCardProps {
  idMachine: string;
}

const sensorsDefault = ['statusNavigation', 'speed', 'heading', 'eta', 'gps', 'destination', 'draught', 'course', 'cog'];

export function StatusCard({ idMachine }: StatusCardProps) {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();

  const { data: statusOperation, isLoading: loadingStatus } = useVesselStatus(idMachine);
  const { data: lastStates, isLoading: loadingState } = useVesselsLastState(idEnterprise);

  if (loadingStatus || loadingState) return null;

  const lastNavigationState = lastStates?.find((x: any) => x.idMachine === idMachine && x.idSensor === 'statusNavigation');

  const navigationInfo = getNavigationStatusInfo(lastNavigationState?.value);
  const operationInfo = getStatusOperationInfo(statusOperation?.status);

  const lastGPS = lastStates?.find((x: any) => x.idMachine === idMachine && x.idSensor === 'gps')?.date;

  const lastIAS = lastStates?.find((x: any) => x.idMachine === idMachine && !sensorsDefault.includes(x.idSensor))?.date;

  return (
    <div className="flex flex-col items-end gap-2 md:flex-row md:items-center">
      {/* Dates Section */}
      <div className="flex flex-col text-right">
        {lastGPS && (
          <ItemDescription className="text-[10px]">
            {t('last.date.acronym')} (GPS): {formatDate(lastGPS, 'HH:mm:ss dd/MMM/yyyy')}
          </ItemDescription>
        )}
        {lastIAS && (
          <ItemDescription className="text-[10px]">
            {t('last.date.acronym')} (IAS): {formatDate(lastIAS, 'HH:mm:ss dd/MMM/yyyy')}
          </ItemDescription>
        )}
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        {/* Navigation Mode */}
        {navigationInfo && (
          <div className="flex items-center gap-2">
            <ItemDescription className="text-xs">{t('mode.navigation')}:</ItemDescription>
            <Badge className={cn('gap-1 text-white', navigationInfo.color)}>
              <navigationInfo.icon className="size-3" />
              {t(navigationInfo.label)}
            </Badge>
          </div>
        )}

        {/* Operation Status */}
        {operationInfo && (
          <div className="flex items-center gap-2">
            <ItemDescription className="text-xs">{t('status')}:</ItemDescription>
            {statusOperation?.description ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex cursor-help items-center gap-1">
                    <span className="text-sm">{operationInfo.icon}</span>
                    <ItemTitle className={cn('text-xs uppercase', operationInfo.color)}>{operationInfo.label}</ItemTitle>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{statusOperation.description}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-sm">{operationInfo.icon}</span>
                <ItemTitle className={cn('text-xs uppercase', operationInfo.color)}>{operationInfo.label}</ItemTitle>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
