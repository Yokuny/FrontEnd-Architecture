import { AlertCircle, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TYPE_MAINTENANCE } from '../@consts/maintenance.consts';
import type { MonitoringPlanItem as MonitoringPlanItemType } from '../@interface/monitoring-plan.types';

interface MonitoringPlanItemProps {
  planItem: MonitoringPlanItemType;
  onClick: () => void;
}

export function MonitoringPlanItem({ planItem, onClick }: MonitoringPlanItemProps) {
  const { t } = useTranslation();

  const isLate = () => {
    if (!planItem.dateWindowEnd) return false;
    const endDate = new Date(planItem.dateWindowEnd);
    return endDate < new Date() && !planItem.dateDoneEnd;
  };

  const isDone = () => {
    return !!planItem.dateDoneEnd;
  };

  const getStatusColor = () => {
    if (isDone()) return 'bg-green-500';
    if (isLate()) return 'bg-red-500';
    return 'bg-blue-500';
  };

  const getIcon = () => {
    if (isDone()) return <CheckCircle className="size-3" />;
    if (isLate()) return <AlertCircle className="size-3" />;
    return <Clock className="size-3" />;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const hasWear = planItem.typeMaintenance === TYPE_MAINTENANCE.WEAR || planItem.typeMaintenance === TYPE_MAINTENANCE.DATE_OR_WEAR;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 h-auto py-1.5" onClick={onClick}>
            <span className={`size-2 rounded-full ${getStatusColor()}`} />
            {getIcon()}
            <span className="text-xs max-w-24 truncate">{planItem.description}</span>
            {hasWear && planItem.wearCurrent !== null && planItem.wearLimit !== null && (
              <Badge variant="secondary" className="text-xs">
                {planItem.wearCurrent}/{planItem.wearLimit}
              </Badge>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1 text-xs">
            <p className="font-semibold">{planItem.description}</p>
            <div className="flex items-center gap-1">
              <Calendar className="size-3" />
              <span>
                {t('date.window')}: {formatDate(planItem.dateWindowInit)} - {formatDate(planItem.dateWindowEnd)}
              </span>
            </div>
            {planItem.datePlanInit && (
              <p>
                {t('date.plan')}: {formatDate(planItem.datePlanInit)} - {formatDate(planItem.datePlanEnd)}
              </p>
            )}
            {planItem.dateDoneInit && (
              <p className="text-green-600">
                {t('done')}: {formatDate(planItem.dateDoneInit)} - {formatDate(planItem.dateDoneEnd)}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
